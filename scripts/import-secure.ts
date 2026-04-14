/**
 * Secure skill importer from official and community sources.
 * Usage: bunx tsx scripts/import-secure.ts
 *
 * Sources:
 * - anthropics/courses (official)
 * - vercel-labs/agent-skills (official)
 * - VoltAgent/awesome-agent-skills (official prefixes + community)
 */

import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";
import { checkSecurity } from "./security-checker";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;

const OFFICIAL_PREFIXES = [
  "anthropics/", "microsoft/", "google-labs-code/", "stripe/",
  "cloudflare/", "netlify/", "getsentry/", "trailofbits/",
  "expo/", "figma/", "huggingface/",
];

const RELEVANT_TOPICS = [
  "react", "nextjs", "next", "typescript", "python", "django", "fastapi",
  "laravel", "php", "vue", "svelte", "angular", "go", "golang", "rust",
  "nodejs", "tailwind", "supabase", "prisma", "drizzle", "docker",
  "kubernetes", "testing", "vitest", "jest", "playwright", "security",
  "git", "api", "rest", "graphql", "css", "html", "frontend", "backend",
  "fullstack", "database", "postgresql", "mongodb", "redis", "aws",
  "vercel", "debugging", "code-review", "documentation", "devops",
];

const SKILL_EXTENSIONS = [
  "SKILL.md", "CLAUDE.md", "AGENTS.md", ".cursorrules",
  ".mdc", "rules.md", "RULES.md",
];

// Stats
const stats = {
  officialImported: 0,
  communityImported: 0,
  communityRejectedSecurity: 0,
  communityRejectedTopic: 0,
  duplicates: 0,
  errors: 0,
  byType: { skill: 0, rule: 0, mcp: 0, agent: 0, hook: 0, plugin: 0 },
  rejectedDetails: [] as { name: string; reason: string }[],
  sources: {} as Record<string, number>,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function detectEditors(filename: string, content: string): string[] {
  const editors: string[] = [];
  if (filename === "SKILL.md" || filename === "CLAUDE.md" || filename === "AGENTS.md") {
    editors.push("claude-code");
  }
  if (filename === ".cursorrules" || filename.endsWith(".mdc")) {
    editors.push("cursor");
  }
  // Detect from content
  const lower = content.toLowerCase();
  if (lower.includes("windsurf") && !editors.includes("windsurf")) editors.push("windsurf");
  if (lower.includes("copilot") && !editors.includes("copilot")) editors.push("copilot");
  if (lower.includes("cursor") && !editors.includes("cursor")) editors.push("cursor");
  if (lower.includes("claude") && !editors.includes("claude-code")) editors.push("claude-code");
  if (editors.length === 0) editors.push("claude-code");
  return editors;
}

function detectType(filename: string, path: string): string {
  if (filename === "SKILL.md" || path.includes("skill")) return "skill";
  if (filename === "CLAUDE.md" || filename === ".cursorrules" || filename.endsWith(".mdc") || path.includes("rule")) return "rule";
  if (filename === "AGENTS.md" || path.includes("agent")) return "agent";
  if (path.includes("mcp")) return "mcp";
  if (path.includes("hook")) return "hook";
  return "skill";
}

function extractTags(frontmatter: Record<string, unknown>, content: string, path: string): string[] {
  const tags = new Set<string>();

  // From frontmatter
  if (Array.isArray(frontmatter.tags)) {
    frontmatter.tags.forEach((t: string) => tags.add(t.toLowerCase()));
  }
  if (typeof frontmatter.globs === "string") {
    const ext = frontmatter.globs.match(/\*\.(\w+)/)?.[1];
    if (ext) tags.add(ext);
  }

  // Infer from path and content
  const lower = (path + " " + content).toLowerCase();
  const infer = [
    "react", "nextjs", "typescript", "python", "django", "laravel",
    "vue", "svelte", "go", "rust", "tailwind", "supabase", "docker",
    "testing", "postgresql", "mongodb", "graphql", "fastapi", "prisma",
  ];
  for (const tag of infer) {
    if (lower.includes(tag)) tags.add(tag);
  }

  return [...tags].slice(0, 5);
}

function generateDescription(frontmatter: Record<string, unknown>, title: string, type: string): string {
  if (frontmatter.description && typeof frontmatter.description === "string") {
    const desc = frontmatter.description;
    if (desc.length <= 280) return desc;
    return desc.slice(0, 277) + "...";
  }
  const typeLabels: Record<string, string> = {
    skill: "Skill", rule: "Regla", mcp: "MCP Server",
    agent: "Agente", hook: "Hook", plugin: "Plugin",
  };
  return `${typeLabels[type] || "Skill"} para ${title.replace(/-/g, " ")}. Importado de fuentes comunitarias.`;
}

function isRelevantTopic(path: string, content: string, tags: string[]): boolean {
  const lower = (path + " " + content + " " + tags.join(" ")).toLowerCase();
  return RELEVANT_TOPICS.some((topic) => lower.includes(topic));
}

async function fetchGitHubTree(owner: string, repo: string): Promise<{ path: string; type: string }[]> {
  for (const branch of ["main", "master"]) {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
    );
    if (res.ok) {
      const data = await res.json();
      return data.tree || [];
    }
  }
  console.error(`  ✗ Could not fetch tree for ${owner}/${repo}`);
  return [];
}

async function fetchFileContent(owner: string, repo: string, path: string): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
  );
  if (!res.ok) return null;
  return res.text();
}

async function isDuplicate(
  supabase: ReturnType<typeof createClient>,
  githubUrl: string,
  slug: string,
  title: string
): Promise<boolean> {
  const { data: byUrl } = await supabase
    .from("items").select("id").eq("github_url", githubUrl).limit(1);
  if (byUrl && byUrl.length > 0) return true;

  const { data: bySlug } = await supabase
    .from("items").select("id").eq("slug", slug).limit(1);
  if (bySlug && bySlug.length > 0) return true;

  return false;
}

async function importRepo(
  supabase: ReturnType<typeof createClient>,
  owner: string,
  repo: string,
  trustLevel: "official" | "community",
  filterFn?: (path: string) => boolean
) {
  const repoKey = `${owner}/${repo}`;
  console.log(`\n📦 Scanning ${repoKey} (${trustLevel})...`);
  stats.sources[repoKey] = 0;

  const tree = await fetchGitHubTree(owner, repo);
  const skillFiles = tree.filter(
    (node) =>
      node.type === "blob" &&
      SKILL_EXTENSIONS.some((ext) => node.path.endsWith(ext)) &&
      (!filterFn || filterFn(node.path))
  );

  console.log(`  Found ${skillFiles.length} skill files`);

  for (const file of skillFiles) {
    const filename = file.path.split("/").pop()!;
    const githubUrl = `https://github.com/${owner}/${repo}/blob/main/${file.path}`;

    // Generate slug from path
    const pathParts = file.path.replace(/\//g, "-").replace(/\.(md|mdc)$/, "");
    const slug = slugify(`${repo}-${pathParts}`);
    const title = (file.path.split("/").slice(-2, -1)[0] || pathParts)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    // Check duplicate
    if (await isDuplicate(supabase, githubUrl, slug, title)) {
      stats.duplicates++;
      continue;
    }

    // Fetch content
    const content = await fetchFileContent(owner, repo, file.path);
    if (!content) {
      stats.errors++;
      continue;
    }

    const { data: frontmatter, content: body } = matter(content);
    const finalTitle = (frontmatter.name || frontmatter.title || title) as string;
    const type = detectType(filename, file.path);
    const editors = detectEditors(filename, content);
    const tags = extractTags(frontmatter as Record<string, unknown>, content, file.path);
    const description = generateDescription(frontmatter as Record<string, unknown>, finalTitle, type);
    const finalSlug = slugify(`${repo}-${(frontmatter.name as string) || (frontmatter.title as string) || pathParts}`);

    // Security check for community
    let securityStatus = "trusted";
    let securityNotes: string | null = null;
    let securityScore = 100;

    if (trustLevel === "community") {
      // Check topic relevance
      if (!isRelevantTopic(file.path, content, tags)) {
        stats.communityRejectedTopic++;
        continue;
      }

      const check = checkSecurity(content);
      securityScore = check.score;

      if (!check.safe) {
        stats.communityRejectedSecurity++;
        stats.rejectedDetails.push({ name: finalTitle, reason: check.flags.join(", ") });
        securityStatus = "flagged";
        securityNotes = check.flags.join("; ");
        // Still insert but as rejected
        await supabase.from("items").insert({
          title: finalTitle,
          slug: finalSlug,
          description,
          content: body || content,
          type,
          editors,
          tags,
          language: "en",
          github_url: githubUrl,
          status: "rejected",
          trust_level: trustLevel,
          security_status: securityStatus,
          security_notes: securityNotes,
          security_score: securityScore,
        });
        continue;
      }
      securityStatus = "reviewed";
    }

    // Insert
    const { error } = await supabase.from("items").insert({
      title: finalTitle,
      slug: finalSlug,
      description,
      content: body || content,
      type,
      editors,
      tags,
      language: "en",
      github_url: githubUrl,
      status: "draft",
      trust_level: trustLevel,
      security_status: securityStatus,
      security_notes: securityNotes,
      security_score: securityScore,
    });

    if (error) {
      if (error.message.includes("duplicate")) {
        stats.duplicates++;
      } else {
        console.error(`  ✗ Error: ${finalTitle}: ${error.message}`);
        stats.errors++;
      }
    } else {
      console.log(`  ✓ ${finalTitle} (${type})`);
      stats.sources[repoKey]!++;
      if (trustLevel === "official") stats.officialImported++;
      else stats.communityImported++;
      stats.byType[type as keyof typeof stats.byType]++;
    }
  }
}

async function organizeBatches(supabase: ReturnType<typeof createClient>) {
  console.log("\n📋 Organizing batches...");

  // Get all draft items ordered by trust_level (official first) then type variety
  const { data: items, error } = await supabase
    .from("items")
    .select("id, title, type, trust_level, editors, tags, installs")
    .eq("status", "draft")
    .neq("security_status", "flagged")
    .order("trust_level", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !items || items.length === 0) {
    console.log("  No items to organize.");
    return;
  }

  // Separate official and community
  const official = items.filter((i) => i.trust_level === "official");
  const community = items.filter((i) => i.trust_level !== "official");

  // Batch 0: Top 50 items
  const batch0: typeof items = [];

  // Priority 1: Official Anthropic/Vercel
  for (const item of official) {
    if (batch0.length < 50) batch0.push(item);
  }

  // Priority 2: Popular frameworks from community
  const popularTags = ["nextjs", "react", "typescript", "python", "tailwind", "supabase"];
  for (const item of community) {
    if (batch0.length >= 50) break;
    if (item.tags?.some((t: string) => popularTags.includes(t))) {
      batch0.push(item);
    }
  }

  // Priority 3: Fill with variety
  const usedTypes = new Set(batch0.map((i) => i.type));
  for (const item of community) {
    if (batch0.length >= 50) break;
    if (batch0.includes(item)) continue;
    if (!usedTypes.has(item.type) || batch0.length < 50) {
      batch0.push(item);
      usedTypes.add(item.type);
    }
  }

  // Publish batch 0
  const batch0Ids = batch0.map((i) => i.id);
  if (batch0Ids.length > 0) {
    await supabase
      .from("items")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        publish_batch: 0,
      })
      .in("id", batch0Ids);

    // Feature top 5
    const featuredIds = batch0.slice(0, 5).map((i) => i.id);
    await supabase.from("items").update({ featured: true }).in("id", featuredIds);

    console.log(`  Batch 0: ${batch0Ids.length} items published (${featuredIds.length} featured)`);
  }

  // Remaining items → batches of 5
  const remaining = items.filter((i) => !batch0Ids.includes(i.id));
  let batchNum = 1;
  for (let i = 0; i < remaining.length; i += 5) {
    const batch = remaining.slice(i, i + 5);
    const batchIds = batch.map((item) => item.id);
    await supabase
      .from("items")
      .update({ publish_batch: batchNum })
      .in("id", batchIds);
    batchNum++;
  }

  console.log(`  Remaining: ${remaining.length} items in ${batchNum - 1} batches`);

  // Generate schedule doc
  await generateScheduleDoc(supabase, batch0, remaining, batchNum - 1);
}

async function generateScheduleDoc(
  supabase: ReturnType<typeof createClient>,
  batch0: { title: string; type: string }[],
  remaining: { title: string; type: string; editors: string[]; tags: string[] }[],
  totalBatches: number
) {
  let doc = `# Calendario de publicación — codeskills.tech\n\n`;
  doc += `## Lote 0 — Publicado (lanzamiento)\n`;
  batch0.forEach((item, i) => {
    doc += `${i + 1}. ${item.title} (${item.type})\n`;
  });

  for (let b = 0; b < totalBatches; b++) {
    const batch = remaining.slice(b * 5, (b + 1) * 5);
    doc += `\n## Lote ${b + 1} — Día ${b + 2}\n`;
    batch.forEach((item, i) => {
      const editors = (item.editors || []).join(", ");
      const tags = (item.tags || []).slice(0, 3).join(", ");
      doc += `${i + 1}. ${item.title} (${item.type}, ${editors}, ${tags})\n`;
    });
  }

  doc += `\n### Cómo publicar un lote\n`;
  doc += `\`\`\`bash\nbunx tsx scripts/publish-batch.ts [NÚMERO]\n\`\`\`\n`;
  doc += `\nO en Supabase SQL Editor:\n`;
  doc += `\`\`\`sql\nUPDATE items SET status = 'published', published_at = NOW() WHERE publish_batch = [NÚMERO];\n\`\`\`\n`;

  // Write to filesystem
  const fs = await import("fs");
  fs.writeFileSync("docs/PUBLISH-SCHEDULE.md", doc);
  console.log("\n  📄 docs/PUBLISH-SCHEDULE.md generated");
}

function printSummary() {
  console.log("\n" + "=".repeat(50));
  console.log("📊 RESUMEN DE IMPORTACIÓN");
  console.log("=".repeat(50));

  console.log("\nFuentes oficiales:");
  for (const [repo, count] of Object.entries(stats.sources)) {
    if (count > 0 || repo.includes("anthropics") || repo.includes("vercel")) {
      console.log(`  - ${repo}: ${count} skills importados`);
    }
  }
  console.log(`Total oficiales: ${stats.officialImported}`);

  console.log("\nFuentes comunitarias (VoltAgent):");
  console.log(`  - Importados (pasaron seguridad): ${stats.communityImported}`);
  console.log(`  - Rechazados (seguridad): ${stats.communityRejectedSecurity}`);
  console.log(`  - Omitidos (duplicados): ${stats.duplicates}`);
  console.log(`  - Omitidos (tema no relevante): ${stats.communityRejectedTopic}`);

  console.log("\nDistribución:");
  for (const [type, count] of Object.entries(stats.byType)) {
    if (count > 0) console.log(`  - ${type}: ${count}`);
  }

  const total = stats.officialImported + stats.communityImported;
  const batches = Math.ceil(Math.max(0, total - 50) / 5);
  console.log("\nPublicación:");
  console.log(`  - Lote 0 (publicado ahora): ${Math.min(50, total)} items`);
  console.log(`  - Lotes programados: ${batches} lotes de 5 items`);
  console.log(`  - Total lotes: ${batches + 1} (para ${batches + 1} días de contenido)`);

  if (stats.rejectedDetails.length > 0) {
    console.log("\n⚠️ Skills rechazados por seguridad:");
    stats.rejectedDetails.forEach(({ name, reason }) => {
      console.log(`  - ${name}: ${reason}`);
    });
  }

  console.log("\nArchivo de calendario: docs/PUBLISH-SCHEDULE.md");
  console.log("=".repeat(50));
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY || !GITHUB_TOKEN) {
    console.error("Missing env vars. Need NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GITHUB_TOKEN");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // 1. Official sources
  await importRepo(supabase, "anthropics", "courses", "official");
  await importRepo(supabase, "vercel-labs", "agent-skills", "official");

  // 2. VoltAgent — official prefixes
  await importRepo(supabase, "VoltAgent", "awesome-agent-skills", "official", (path) =>
    OFFICIAL_PREFIXES.some((prefix) => path.startsWith(prefix))
  );

  // 3. VoltAgent — community (not official prefixes)
  await importRepo(supabase, "VoltAgent", "awesome-agent-skills", "community", (path) =>
    !OFFICIAL_PREFIXES.some((prefix) => path.startsWith(prefix))
  );

  // 4. Organize batches
  await organizeBatches(supabase);

  // 5. Print summary
  printSummary();
}

main().catch(console.error);

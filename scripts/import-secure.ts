/**
 * Secure skill importer from GitHub repos.
 *
 * Usage:
 *   bunx tsx scripts/import-secure.ts <repo-url> --trust=official|community
 *   bunx tsx scripts/import-secure.ts --meta <meta-repo-url>   (follow links in README)
 *   bunx tsx scripts/import-secure.ts --reorganize              (reorganize batches only)
 *   bunx tsx scripts/import-secure.ts --all                     (run all predefined sources)
 */

import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";
import { checkSecurity } from "./security-checker";
import * as fs from "fs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;

const OFFICIAL_ORGS = [
  "anthropics", "microsoft", "google-labs-code", "vercel", "vercel-labs",
  "stripe", "cloudflare", "netlify", "getsentry", "trailofbits",
  "expo", "figma", "huggingface",
];

const RELEVANT_TOPICS = [
  "react", "nextjs", "next", "typescript", "python", "django", "fastapi",
  "laravel", "php", "vue", "svelte", "angular", "go", "golang", "rust",
  "nodejs", "tailwind", "supabase", "prisma", "drizzle", "docker",
  "kubernetes", "testing", "vitest", "jest", "playwright", "security",
  "git", "api", "rest", "graphql", "css", "html", "frontend", "backend",
  "fullstack", "database", "postgresql", "mongodb", "redis", "aws",
  "vercel", "debugging", "code-review", "documentation", "devops",
  "claude", "cursor", "windsurf", "copilot", "agent", "skill", "rule",
  "mcp", "hook", "plugin", "ai", "llm", "prompt", "coding",
];

const SKILL_EXTENSIONS = [
  "SKILL.md", "CLAUDE.md", "AGENTS.md", ".cursorrules",
  ".mdc", "rules.md", "RULES.md", ".clinerules",
];

const stats = {
  officialImported: 0,
  communityImported: 0,
  communityRejectedSecurity: 0,
  communityRejectedTopic: 0,
  duplicates: 0,
  errors: 0,
  byType: { skill: 0, rule: 0, mcp: 0, agent: 0, hook: 0, plugin: 0 } as Record<string, number>,
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
  if (filename === "SKILL.md" || filename === "CLAUDE.md" || filename === "AGENTS.md") editors.push("claude-code");
  if (filename === ".cursorrules" || filename.endsWith(".mdc") || filename === ".clinerules") editors.push("cursor");
  const lower = content.toLowerCase();
  if (lower.includes("windsurf") && !editors.includes("windsurf")) editors.push("windsurf");
  if (lower.includes("copilot") && !editors.includes("copilot")) editors.push("copilot");
  if (lower.includes("cursor") && !editors.includes("cursor")) editors.push("cursor");
  if (lower.includes("claude") && !editors.includes("claude-code")) editors.push("claude-code");
  if (editors.length === 0) editors.push("claude-code");
  return editors;
}

function detectType(filename: string, path: string, content: string): string {
  const lower = (path + " " + content.slice(0, 500)).toLowerCase();
  if (filename === "AGENTS.md" || lower.includes("agent")) return "agent";
  if (lower.includes("mcp") || lower.includes("model context protocol")) return "mcp";
  if (lower.includes("hook")) return "hook";
  if (filename === "SKILL.md" || lower.includes("skill")) return "skill";
  if (filename === ".cursorrules" || filename.endsWith(".mdc") || filename === "CLAUDE.md" || lower.includes("rule")) return "rule";
  return "skill";
}

function extractTags(fm: Record<string, unknown>, content: string, path: string): string[] {
  const tags = new Set<string>();
  if (Array.isArray(fm.tags)) fm.tags.forEach((t: string) => tags.add(String(t).toLowerCase()));
  if (typeof fm.globs === "string") { const ext = fm.globs.match(/\*\.(\w+)/)?.[1]; if (ext) tags.add(ext); }
  const lower = (path + " " + content.slice(0, 2000)).toLowerCase();
  const infer = ["react", "nextjs", "typescript", "python", "django", "laravel", "vue", "svelte", "go", "rust", "tailwind", "supabase", "docker", "testing", "postgresql", "mongodb", "graphql", "fastapi", "prisma", "angular", "nodejs", "css", "html", "aws", "kubernetes", "security"];
  for (const tag of infer) { if (lower.includes(tag)) tags.add(tag); }
  return [...tags].slice(0, 5);
}

function generateDescription(fm: Record<string, unknown>, title: string, type: string): string {
  if (fm.description && typeof fm.description === "string") {
    return fm.description.length <= 280 ? fm.description : fm.description.slice(0, 277) + "...";
  }
  const labels: Record<string, string> = { skill: "Skill", rule: "Regla", mcp: "MCP Server", agent: "Agente", hook: "Hook", plugin: "Plugin" };
  return `${labels[type] || "Skill"} para ${title.replace(/-/g, " ")}.`;
}

async function ghFetch(url: string): Promise<Response> {
  return fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
  });
}

async function fetchTree(owner: string, repo: string): Promise<{ path: string; type: string }[]> {
  for (const branch of ["main", "master"]) {
    const res = await ghFetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
    if (res.ok) { const data = await res.json(); return data.tree || []; }
  }
  return [];
}

async function fetchFile(owner: string, repo: string, path: string): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw" } }
  );
  return res.ok ? res.text() : null;
}

async function isDuplicate(supabase: ReturnType<typeof createClient>, githubUrl: string, slug: string): Promise<boolean> {
  const { data: a } = await supabase.from("items").select("id").eq("github_url", githubUrl).limit(1);
  if (a && a.length > 0) return true;
  const { data: b } = await supabase.from("items").select("id").eq("slug", slug).limit(1);
  return !!(b && b.length > 0);
}

function isRelevant(path: string, content: string, tags: string[]): boolean {
  const lower = (path + " " + content.slice(0, 3000) + " " + tags.join(" ")).toLowerCase();
  return RELEVANT_TOPICS.some((t) => lower.includes(t));
}

async function importRepo(
  supabase: ReturnType<typeof createClient>,
  owner: string,
  repo: string,
  trustLevel: "official" | "community"
) {
  const key = `${owner}/${repo}`;
  console.log(`\n📦 ${key} (${trustLevel})...`);
  stats.sources[key] = stats.sources[key] || 0;

  const tree = await fetchTree(owner, repo);
  const files = tree.filter(
    (n) => n.type === "blob" && SKILL_EXTENSIONS.some((ext) => n.path.endsWith(ext))
  );

  if (files.length === 0) {
    console.log(`  No skill files found.`);
    return;
  }
  console.log(`  Found ${files.length} skill files`);

  for (const file of files) {
    const filename = file.path.split("/").pop()!;
    const githubUrl = `https://github.com/${owner}/${repo}/blob/main/${file.path}`;
    const pathParts = file.path.replace(/\//g, "-").replace(/\.(md|mdc)$/, "");
    const baseSlug = slugify(`${repo}-${pathParts}`);

    if (await isDuplicate(supabase, githubUrl, baseSlug)) { stats.duplicates++; continue; }

    const content = await fetchFile(owner, repo, file.path);
    if (!content) { stats.errors++; continue; }

    let fm: Record<string, unknown> = {};
    let body = content;
    try {
      const parsed = matter(content);
      fm = parsed.data as Record<string, unknown>;
      body = parsed.content;
    } catch {
      // YAML parse error — use raw content, no frontmatter
    }
    const title = String(fm.name || fm.title || file.path.split("/").slice(-2, -1)[0] || pathParts)
      .replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const type = detectType(filename, file.path, content);
    const editors = detectEditors(filename, content);
    const tags = extractTags(fm as Record<string, unknown>, content, file.path);
    const description = generateDescription(fm as Record<string, unknown>, title, type);
    const slug = slugify(`${repo}-${String(fm.name || fm.title || pathParts)}`);

    let securityStatus = "trusted";
    let securityNotes: string | null = null;
    let securityScore = 100;
    let status = "draft";

    if (trustLevel === "community") {
      if (!isRelevant(file.path, content, tags)) { stats.communityRejectedTopic++; continue; }
      const check = checkSecurity(content);
      securityScore = check.score;
      if (!check.safe) {
        stats.communityRejectedSecurity++;
        stats.rejectedDetails.push({ name: title, reason: check.flags.join(", ") });
        securityStatus = "flagged";
        securityNotes = check.flags.join("; ");
        status = "rejected";
      } else {
        securityStatus = "reviewed";
      }
    }

    const { error } = await supabase.from("items").insert({
      title, slug, description, content: body || content, type, editors, tags,
      language: "en", github_url: githubUrl, status,
      trust_level: trustLevel, security_status: securityStatus,
      security_notes: securityNotes, security_score: securityScore,
    });

    if (error) {
      if (error.message.includes("duplicate")) { stats.duplicates++; }
      else { console.error(`  ✗ ${title}: ${error.message}`); stats.errors++; }
    } else if (status !== "rejected") {
      console.log(`  ✓ ${title} (${type})`);
      stats.sources[key]!++;
      if (trustLevel === "official") stats.officialImported++;
      else stats.communityImported++;
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    }
  }
}

async function importMetaRepo(supabase: ReturnType<typeof createClient>, owner: string, repo: string) {
  console.log(`\n🔗 Parsing meta-repo ${owner}/${repo} for linked repos...`);
  const readme = await fetchFile(owner, repo, "README.md");
  if (!readme) { console.log("  No README.md found"); return; }

  const repoLinks = [...readme.matchAll(/github\.com\/([^\/\s\)#]+)\/([^\/\s\)#]+)/g)];
  const uniqueRepos = new Map<string, { owner: string; repo: string }>();

  for (const match of repoLinks) {
    const rOwner = match[1].replace(/['"]/g, "");
    const rRepo = match[2].replace(/['"]/g, "").replace(/\.git$/, "");
    const rKey = `${rOwner}/${rRepo}`;
    if (rKey === `${owner}/${repo}`) continue; // skip self
    if (!uniqueRepos.has(rKey)) uniqueRepos.set(rKey, { owner: rOwner, repo: rRepo });
  }

  console.log(`  Found ${uniqueRepos.size} linked repos`);

  for (const [key, { owner: rOwner, repo: rRepo }] of uniqueRepos) {
    const trust = OFFICIAL_ORGS.includes(rOwner) ? "official" : "community";
    await importRepo(supabase, rOwner, rRepo, trust as "official" | "community");
  }
}

async function reorganizeBatches(supabase: ReturnType<typeof createClient>) {
  console.log("\n📋 Reorganizing batches...");

  // Reset all batch assignments
  await supabase.from("items").update({ publish_batch: null, featured: false }).neq("status", "rejected");

  // Get all publishable items
  const { data: items } = await supabase
    .from("items")
    .select("id, title, type, trust_level, editors, tags, installs, status")
    .neq("security_status", "flagged")
    .neq("status", "rejected")
    .order("trust_level", { ascending: true })
    .order("installs", { ascending: false });

  if (!items || items.length === 0) { console.log("  No items to organize."); return; }

  // Already published items stay published
  const alreadyPublished = items.filter((i) => i.status === "published");
  const drafts = items.filter((i) => i.status === "draft");

  // Batch 0: Top 50 from drafts + already published
  const batch0: typeof items = [...alreadyPublished];
  const official = drafts.filter((i) => i.trust_level === "official");
  const community = drafts.filter((i) => i.trust_level !== "official");

  // Add officials first
  for (const item of official) { if (batch0.length < 50) batch0.push(item); }
  // Then popular community
  const popularTags = ["nextjs", "react", "typescript", "python", "tailwind", "supabase", "docker", "testing"];
  for (const item of community) {
    if (batch0.length >= 50) break;
    if (item.tags?.some((t: string) => popularTags.includes(t))) batch0.push(item);
  }
  // Fill remaining
  for (const item of community) {
    if (batch0.length >= 50) break;
    if (!batch0.includes(item)) batch0.push(item);
  }

  // Publish batch 0
  const batch0Ids = batch0.map((i) => i.id);
  if (batch0Ids.length > 0) {
    const now = new Date().toISOString();
    await supabase.from("items").update({ status: "published", published_at: now, publish_batch: 0 }).in("id", batch0Ids);
    // Feature top 5
    const featuredIds = batch0.slice(0, 5).map((i) => i.id);
    await supabase.from("items").update({ featured: true }).in("id", featuredIds);
    console.log(`  Batch 0: ${batch0Ids.length} items published (${featuredIds.length} featured)`);
  }

  // Remaining drafts → batches of 5
  const remaining = drafts.filter((i) => !batch0Ids.includes(i.id));
  let batchNum = 1;
  for (let i = 0; i < remaining.length; i += 5) {
    const batch = remaining.slice(i, i + 5);
    await supabase.from("items").update({ publish_batch: batchNum }).in("id", batch.map((b) => b.id));
    batchNum++;
  }
  console.log(`  Remaining: ${remaining.length} items in ${batchNum - 1} batches`);

  // Generate schedule doc
  let doc = `# Calendario de publicación — codeskills.tech\n\n`;
  doc += `## Lote 0 — Publicado (lanzamiento)\n`;
  batch0.forEach((item, i) => { doc += `${i + 1}. ${item.title} (${item.type})\n`; });
  for (let b = 0; b < batchNum - 1; b++) {
    const batch = remaining.slice(b * 5, (b + 1) * 5);
    doc += `\n## Lote ${b + 1} — Día ${b + 2}\n`;
    batch.forEach((item, i) => {
      doc += `${i + 1}. ${item.title} (${item.type}, ${(item.editors || []).join(", ")}, ${(item.tags || []).slice(0, 3).join(", ")})\n`;
    });
  }
  doc += `\n### Cómo publicar un lote\n\`\`\`bash\nbunx tsx scripts/publish-batch.ts [NÚMERO]\n\`\`\`\n`;
  fs.writeFileSync("docs/PUBLISH-SCHEDULE.md", doc);
  console.log("  📄 docs/PUBLISH-SCHEDULE.md updated");
}

function printSummary() {
  console.log("\n" + "=".repeat(55));
  console.log("📊 RESUMEN DE IMPORTACIÓN");
  console.log("=".repeat(55));
  console.log("\nFuentes oficiales:");
  for (const [repo, count] of Object.entries(stats.sources)) { if (count > 0) console.log(`  - ${repo}: ${count} importados`); }
  console.log(`Total oficiales: ${stats.officialImported}`);
  console.log("\nFuentes comunitarias:");
  console.log(`  - Importados (pasaron seguridad): ${stats.communityImported}`);
  console.log(`  - Rechazados (seguridad): ${stats.communityRejectedSecurity}`);
  console.log(`  - Omitidos (duplicados): ${stats.duplicates}`);
  console.log(`  - Omitidos (tema no relevante): ${stats.communityRejectedTopic}`);
  console.log("\nDistribución:");
  for (const [type, count] of Object.entries(stats.byType)) { if (count > 0) console.log(`  - ${type}: ${count}`); }
  const total = stats.officialImported + stats.communityImported;
  const batches = Math.ceil(Math.max(0, total - 50) / 5);
  console.log(`\nTotal importados: ${total}`);
  if (stats.rejectedDetails.length > 0) {
    console.log("\n⚠️ Rechazados por seguridad:");
    stats.rejectedDetails.forEach(({ name, reason }) => { console.log(`  - ${name}: ${reason}`); });
  }
  console.log("=".repeat(55));
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY || !GITHUB_TOKEN) {
    console.error("Missing env vars"); process.exit(1);
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const args = process.argv.slice(2);

  if (args.includes("--reorganize")) {
    await reorganizeBatches(supabase);
    return;
  }

  if (args.includes("--all")) {
    // Official repos
    const officialRepos = [
      ["trailofbits", "agent-skills"],
      ["getsentry", "agent-skills"],
      ["expo", "agent-skills"],
      ["nicholasgriffintn", "claude-agent-skills"],
    ];
    for (const [o, r] of officialRepos) { await importRepo(supabase, o, r, "official"); }

    // Community repos
    const communityRepos = [
      ["PatrickJS", "awesome-cursorrules"],
      ["wshobson", "agents"],
      ["heilcheng", "awesome-agent-skills"],
      ["shanraisshan", "claude-code-best-practice"],
    ];
    for (const [o, r] of communityRepos) { await importRepo(supabase, o, r, "community"); }

    // Meta-repo: follow links
    await importMetaRepo(supabase, "VoltAgent", "awesome-agent-skills");

    // Reorganize
    await reorganizeBatches(supabase);
    printSummary();
    return;
  }

  // Single repo mode
  if (args.includes("--meta")) {
    const url = args.find((a) => a.startsWith("http"));
    if (!url) { console.error("Provide a repo URL"); process.exit(1); }
    const m = url.match(/github\.com\/([^\/]+)\/([^\/\s]+)/);
    if (!m) { console.error("Invalid URL"); process.exit(1); }
    await importMetaRepo(supabase, m[1], m[2].replace(/\.git$/, ""));
  } else {
    const url = args.find((a) => a.startsWith("http"));
    const trust = args.find((a) => a.startsWith("--trust="))?.split("=")[1] || "community";
    if (!url) { console.error("Usage: bunx tsx scripts/import-secure.ts <url> --trust=official|community"); process.exit(1); }
    const m = url.match(/github\.com\/([^\/]+)\/([^\/\s]+)/);
    if (!m) { console.error("Invalid URL"); process.exit(1); }
    await importRepo(supabase, m[1], m[2].replace(/\.git$/, ""), trust as "official" | "community");
  }

  printSummary();
}

main().catch(console.error);

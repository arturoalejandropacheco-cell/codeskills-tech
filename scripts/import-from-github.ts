/**
 * Import skills from a GitHub repository.
 * Usage: bunx tsx scripts/import-from-github.ts <repo-url>
 * Example: bunx tsx scripts/import-from-github.ts https://github.com/anthropics/courses
 */

import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const SKILL_FILES = ["SKILL.md", ".cursorrules", "CLAUDE.md", "AGENTS.md"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function detectEditors(filename: string): string[] {
  if (filename === "SKILL.md" || filename === "CLAUDE.md" || filename === "AGENTS.md") {
    return ["claude-code"];
  }
  if (filename === ".cursorrules" || filename.endsWith(".mdc")) {
    return ["cursor"];
  }
  return ["claude-code"];
}

function detectType(filename: string): string {
  if (filename === "SKILL.md") return "skill";
  if (filename === "CLAUDE.md" || filename === ".cursorrules") return "rule";
  if (filename === "AGENTS.md") return "agent";
  return "skill";
}

async function fetchGitHubTree(owner: string, repo: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
    { headers }
  );

  if (!res.ok) {
    // Try master branch
    const res2 = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`,
      { headers }
    );
    if (!res2.ok) throw new Error(`GitHub API error: ${res2.status}`);
    return res2.json();
  }
  return res.json();
}

async function fetchFileContent(owner: string, repo: string, path: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3.raw",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    { headers }
  );

  if (!res.ok) return null;
  return res.text();
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("Usage: bunx tsx scripts/import-from-github.ts <repo-url>");
    process.exit(1);
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("Missing SUPABASE env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    console.error("Invalid GitHub URL");
    process.exit(1);
  }

  const [, owner, repo] = match;
  const githubBase = `https://github.com/${owner}/${repo}`;

  console.log(`Scanning ${owner}/${repo}...`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const tree = await fetchGitHubTree(owner, repo);

  const skillFiles = tree.tree.filter(
    (node: { path: string; type: string }) =>
      node.type === "blob" &&
      SKILL_FILES.some((sf) => node.path.endsWith(sf))
  );

  console.log(`Found ${skillFiles.length} potential skill files.`);

  let imported = 0;
  let duplicates = 0;
  let errors = 0;

  for (const file of skillFiles) {
    const filename = file.path.split("/").pop()!;
    const githubUrl = `${githubBase}/blob/main/${file.path}`;

    // Check duplicate
    const { data: existing } = await supabase
      .from("items")
      .select("id")
      .eq("github_url", githubUrl)
      .single();

    if (existing) {
      duplicates++;
      continue;
    }

    const content = await fetchFileContent(owner, repo, file.path);
    if (!content) {
      errors++;
      continue;
    }

    const { data: frontmatter, content: body } = matter(content);
    const title =
      frontmatter.name ||
      frontmatter.title ||
      file.path.replace(/\//g, " — ").replace(/\.(md|mdc)$/, "");
    const description =
      frontmatter.description || `Imported from ${owner}/${repo}`;

    const slug = slugify(`${repo}-${title}`);
    const editors = detectEditors(filename);
    const type = detectType(filename);

    const { error } = await supabase.from("items").insert({
      title,
      slug,
      description,
      content: body || content,
      type,
      editors,
      tags: frontmatter.tags || [],
      language: "en",
      github_url: githubUrl,
      status: "draft",
    });

    if (error) {
      console.error(`Error importing ${file.path}: ${error.message}`);
      errors++;
    } else {
      console.log(`  ✓ ${title}`);
      imported++;
    }
  }

  console.log(`\nDone! Importados: ${imported}, Duplicados: ${duplicates}, Errores: ${errors}`);
}

main().catch(console.error);

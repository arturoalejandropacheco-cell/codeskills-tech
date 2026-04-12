import type { Item, Category, ItemType } from "@/types/database";

// Mock data for development until Supabase is connected
// Replace these functions with actual Supabase queries

const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "React", slug: "react", icon: "⚛️", item_count: 0, created_at: "" },
  { id: "2", name: "Next.js", slug: "nextjs", icon: "▲", item_count: 0, created_at: "" },
  { id: "3", name: "TypeScript", slug: "typescript", icon: "🔷", item_count: 0, created_at: "" },
  { id: "4", name: "Python", slug: "python", icon: "🐍", item_count: 0, created_at: "" },
  { id: "5", name: "Django", slug: "django", icon: "🎸", item_count: 0, created_at: "" },
  { id: "6", name: "Laravel", slug: "laravel", icon: "🔴", item_count: 0, created_at: "" },
  { id: "7", name: "Vue", slug: "vue", icon: "💚", item_count: 0, created_at: "" },
  { id: "8", name: "Go", slug: "go", icon: "🐹", item_count: 0, created_at: "" },
  { id: "9", name: "Rust", slug: "rust", icon: "🦀", item_count: 0, created_at: "" },
  { id: "10", name: "Tailwind CSS", slug: "tailwindcss", icon: "🎨", item_count: 0, created_at: "" },
  { id: "11", name: "Supabase", slug: "supabase", icon: "⚡", item_count: 0, created_at: "" },
  { id: "12", name: "Testing", slug: "testing", icon: "🧪", item_count: 0, created_at: "" },
];

const MOCK_ITEMS: Item[] = [
  {
    id: "1",
    title: "Next.js 15 CLAUDE.md",
    slug: "nextjs-15-claude-md",
    description: "Configuración completa de CLAUDE.md para proyectos Next.js 15 con App Router, TypeScript, y Tailwind CSS. Incluye convenciones, comandos, y patrones recomendados.",
    content: "# CLAUDE.md para Next.js 15\n\nEste es un proyecto Next.js 15...",
    type: "rule",
    editors: ["claude-code", "cursor"],
    tags: ["nextjs", "react", "typescript", "tailwindcss"],
    language: "es",
    github_url: null,
    author_id: null,
    status: "published",
    installs: 234,
    upvotes: 18,
    featured: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "2",
    title: "React Testing Patterns",
    slug: "react-testing-patterns",
    description: "Skill para escribir tests de componentes React con Vitest y Testing Library. Sigue patrones AAA y genera tests con cobertura completa.",
    content: "---\nname: react-testing\ndescription: Testing patterns for React\n---\n\n# React Testing...",
    type: "skill",
    editors: ["claude-code", "cursor", "windsurf"],
    tags: ["react", "testing", "vitest"],
    language: "en",
    github_url: "https://github.com/example/react-testing-skill",
    author_id: null,
    status: "published",
    installs: 189,
    upvotes: 12,
    featured: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "3",
    title: "Supabase MCP Server",
    slug: "supabase-mcp-server",
    description: "Servidor MCP para conectar tu agente de código con Supabase. Permite consultar la base de datos, gestionar migraciones, y manipular storage directamente.",
    content: "# Supabase MCP\n\nConecta tu agente...",
    type: "mcp",
    editors: ["claude-code", "cursor", "copilot"],
    tags: ["supabase", "database", "postgresql"],
    language: "es",
    github_url: null,
    author_id: null,
    status: "published",
    installs: 156,
    upvotes: 9,
    featured: false,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    published_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "4",
    title: "Code Reviewer Agent",
    slug: "code-reviewer-agent",
    description: "Subagente especializado en revisión de código. Analiza PRs buscando bugs, problemas de seguridad, y oportunidades de optimización con reportes detallados.",
    content: "---\nname: code-reviewer\nmodel: sonnet\n---\n\n# Code Reviewer...",
    type: "agent",
    editors: ["claude-code"],
    tags: ["code-review", "security", "quality"],
    language: "es",
    github_url: null,
    author_id: null,
    status: "published",
    installs: 98,
    upvotes: 7,
    featured: false,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    published_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: "5",
    title: "Laravel API CLAUDE.md",
    slug: "laravel-api-claude-md",
    description: "Reglas para proyectos Laravel API con Sanctum, Eloquent, y PHPUnit. Define convenciones de naming, estructura de controllers, y patrones de testing.",
    content: "# CLAUDE.md para Laravel API\n\n...",
    type: "rule",
    editors: ["claude-code", "cursor", "windsurf"],
    tags: ["laravel", "php", "api"],
    language: "es",
    github_url: null,
    author_id: null,
    status: "published",
    installs: 87,
    upvotes: 5,
    featured: false,
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    published_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: "6",
    title: "Frontend Design Skill",
    slug: "frontend-design-skill",
    description: "Crea interfaces web distintivas y production-grade. Genera código con alta calidad de diseño evitando estéticas genéricas de AI. Soporta React, Vue, y HTML/CSS.",
    content: "---\nname: frontend-design\ndescription: Create distinctive UI\n---\n\n...",
    type: "skill",
    editors: ["claude-code"],
    tags: ["frontend", "design", "react", "css"],
    language: "en",
    github_url: "https://github.com/anthropics/skills",
    author_id: null,
    status: "published",
    installs: 312,
    upvotes: 24,
    featured: true,
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    published_at: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
];

export async function getItems(options?: {
  type?: ItemType;
  editor?: string;
  category?: string;
  sort?: string;
  limit?: number;
}): Promise<{ items: Item[]; totalCount: number }> {
  // TODO: Replace with Supabase query
  // const supabase = await createClient();
  // let query = supabase.from('items').select('*', { count: 'exact' }).eq('status', 'published');

  let filtered = MOCK_ITEMS.filter((i) => i.status === "published");

  if (options?.type) {
    filtered = filtered.filter((i) => i.type === options.type);
  }
  if (options?.editor && options.editor !== "all") {
    filtered = filtered.filter((i) =>
      i.editors.includes(options.editor as Item["editors"][number])
    );
  }
  if (options?.category && options.category !== "all") {
    filtered = filtered.filter((i) => i.tags.includes(options.category!));
  }

  // Sort
  const sort = options?.sort ?? "installs";
  if (sort === "installs") {
    filtered.sort((a, b) => b.installs - a.installs);
  } else if (sort === "newest") {
    filtered.sort(
      (a, b) =>
        new Date(b.published_at ?? b.created_at).getTime() -
        new Date(a.published_at ?? a.created_at).getTime()
    );
  }

  const limit = options?.limit ?? 50;
  return {
    items: filtered.slice(0, limit),
    totalCount: filtered.length,
  };
}

export async function getItemBySlug(slug: string): Promise<Item | null> {
  // TODO: Replace with Supabase query
  return MOCK_ITEMS.find((i) => i.slug === slug) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  // TODO: Replace with Supabase query
  return MOCK_CATEGORIES;
}

export async function getFeaturedItems(): Promise<Item[]> {
  // TODO: Replace with Supabase query
  return MOCK_ITEMS.filter((i) => i.featured && i.status === "published");
}

export async function getStats() {
  // TODO: Replace with Supabase query
  return {
    totalItems: MOCK_ITEMS.filter((i) => i.status === "published").length,
    totalInstalls: MOCK_ITEMS.reduce((sum, i) => sum + i.installs, 0),
    contributors: 3,
    editors: 6,
  };
}

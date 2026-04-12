// Database types for codeskills.lat

export type ItemType = "skill" | "rule" | "mcp" | "agent" | "hook" | "plugin";
export type ItemStatus = "draft" | "published" | "rejected";
export type EditorType = "claude-code" | "cursor" | "windsurf" | "copilot" | "codex" | "gemini-cli";
export type Language = "es" | "en" | "pt";

export interface Item {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  type: ItemType;
  editors: EditorType[];
  tags: string[];
  language: Language;
  github_url: string | null;
  author_id: string | null;
  status: ItemStatus;
  installs: number;
  upvotes: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  // Joined fields
  author?: Profile;
}

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  github_username: string | null;
  bio: string | null;
  country: string | null;
  items_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  item_count: number;
  created_at: string;
}

export interface Install {
  id: string;
  item_id: string;
  editor: string | null;
  country: string | null;
  created_at: string;
}

// UI-specific types

export interface FilterState {
  type: ItemType | "all";
  editor: EditorType | "all";
  category: string | "all";
  language: Language | "all";
  search: string;
  sort: "installs" | "newest" | "updated";
}

export interface SearchResult {
  item: Item;
  score: number;
}

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  skill: "Skill",
  rule: "Regla",
  mcp: "MCP Server",
  agent: "Agente",
  hook: "Hook",
  plugin: "Plugin",
};

export const EDITOR_LABELS: Record<EditorType, string> = {
  "claude-code": "Claude Code",
  cursor: "Cursor",
  windsurf: "Windsurf",
  copilot: "GitHub Copilot",
  codex: "Codex CLI",
  "gemini-cli": "Gemini CLI",
};

export const ITEM_TYPE_ICONS: Record<ItemType, string> = {
  skill: "🛠️",
  rule: "📏",
  mcp: "🔌",
  agent: "🤖",
  hook: "🪝",
  plugin: "🧩",
};

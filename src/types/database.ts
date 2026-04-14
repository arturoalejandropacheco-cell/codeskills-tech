import type { Database } from "./database.generated";

export type { Database } from "./database.generated";

// Strict union types for type safety
export type ItemType = "skill" | "rule" | "mcp" | "agent" | "hook" | "plugin";
export type ItemStatus = "draft" | "published" | "rejected";
export type EditorType = "claude-code" | "cursor" | "windsurf" | "copilot" | "codex" | "gemini-cli";
export type Language = "es" | "en" | "pt";
export type TrustLevel = "official" | "community" | "user";
export type SecurityStatus = "trusted" | "reviewed" | "flagged" | "pending";

// Row types with strict unions (generated types use plain `string`)
type ItemRow = Database["public"]["Tables"]["items"]["Row"];
export type Item = Omit<ItemRow, "type" | "status" | "language" | "editors" | "trust_level" | "security_status"> & {
  type: ItemType;
  status: ItemStatus;
  language: Language;
  editors: EditorType[];
  trust_level: TrustLevel;
  security_status: SecurityStatus;
};
export type ItemInsert = Database["public"]["Tables"]["items"]["Insert"];
export type ItemUpdate = Database["public"]["Tables"]["items"]["Update"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Install = Database["public"]["Tables"]["installs"]["Row"];
export type InstallInsert = Database["public"]["Tables"]["installs"]["Insert"];

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

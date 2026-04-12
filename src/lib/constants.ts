export const SITE = {
  name: "codeskills.lat",
  title: "codeskills.lat — AI Coding Skills en Español",
  description:
    "El directorio en español de Agent Skills, Rules, MCPs y Agents para Claude Code, Cursor, Windsurf y más. La comunidad LATAM de AI coding.",
  url: "https://codeskills.lat",
  github: "https://github.com/codeskills-lat",
  twitter: "@codeskillslat",
} as const;

export const NAV_ITEMS = [
  { label: "Skills", href: "/skills", icon: "🛠️" },
  { label: "Reglas", href: "/rules", icon: "📏" },
  { label: "MCPs", href: "/mcps", icon: "🔌" },
  { label: "Agentes", href: "/agents", icon: "🤖" },
  { label: "Blog", href: "/blog", icon: "📝" },
] as const;

export const EDITORS = [
  { id: "claude-code", label: "Claude Code", color: "#d97706" },
  { id: "cursor", label: "Cursor", color: "#06b6d4" },
  { id: "windsurf", label: "Windsurf", color: "#8b5cf6" },
  { id: "copilot", label: "GitHub Copilot", color: "#3b82f6" },
  { id: "codex", label: "Codex CLI", color: "#10b981" },
  { id: "gemini-cli", label: "Gemini CLI", color: "#f59e0b" },
] as const;

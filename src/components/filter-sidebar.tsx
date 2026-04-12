"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ITEM_TYPE_LABELS,
  ITEM_TYPE_ICONS,
  EDITOR_LABELS,
  type ItemType,
  type EditorType,
} from "@/types/database";
import type { Category } from "@/types/database";

interface FilterSidebarProps {
  categories: Category[];
  currentType?: string;
}

const ITEM_TYPES: ItemType[] = [
  "skill",
  "rule",
  "mcp",
  "agent",
  "hook",
  "plugin",
];

const EDITOR_IDS: EditorType[] = [
  "claude-code",
  "cursor",
  "windsurf",
  "copilot",
  "codex",
  "gemini-cli",
];

export default function FilterSidebar({
  categories,
  currentType,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeEditor = searchParams.get("editor") ?? "all";
  const activeCategory = searchParams.get("category") ?? "all";
  const activeSort = searchParams.get("sort") ?? "installs";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const base = currentType ? `/${currentType}s` : "/browse";
    router.push(`${base}?${params.toString()}`);
  }

  return (
    <aside className="w-full space-y-6 lg:w-56 shrink-0">
      {/* Sort */}
      <div>
        <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Ordenar por
        </h4>
        <div className="flex flex-wrap gap-1">
          {[
            { value: "installs", label: "Populares" },
            { value: "newest", label: "Recientes" },
            { value: "updated", label: "Actualizados" },
          ].map((sort) => (
            <button
              key={sort.value}
              onClick={() => updateFilter("sort", sort.value)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs transition-colors",
                activeSort === sort.value
                  ? "bg-accent/15 text-accent"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type filter (only on /browse) */}
      {!currentType && (
        <div>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Tipo
          </h4>
          <div className="flex flex-wrap gap-1">
            {ITEM_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => updateFilter("type", type)}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors",
                  searchParams.get("type") === type
                    ? "bg-accent/15 text-accent"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{ITEM_TYPE_ICONS[type]}</span>
                {ITEM_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Editor filter */}
      <div>
        <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Editor
        </h4>
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => updateFilter("editor", "all")}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
              activeEditor === "all"
                ? "bg-accent/15 text-accent"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Todos
          </button>
          {EDITOR_IDS.map((id) => (
            <button
              key={id}
              onClick={() => updateFilter("editor", id)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                activeEditor === id
                  ? "bg-accent/15 text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {EDITOR_LABELS[id]}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div>
        <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Framework / Lenguaje
        </h4>
        <div className="flex flex-col gap-0.5 max-h-64 overflow-y-auto">
          <button
            onClick={() => updateFilter("category", "all")}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
              activeCategory === "all"
                ? "bg-accent/15 text-accent"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateFilter("category", cat.slug)}
              className={cn(
                "flex items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                activeCategory === cat.slug
                  ? "bg-accent/15 text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>
                {cat.icon} {cat.name}
              </span>
              {cat.item_count > 0 && (
                <span className="tabular-nums">{cat.item_count}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

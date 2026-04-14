import Link from "next/link";
import { cn, formatNumber, timeAgo } from "@/lib/utils";
import {
  ITEM_TYPE_LABELS,
  ITEM_TYPE_ICONS,
  EDITOR_LABELS,
  type Item,
} from "@/types/database";

interface ItemCardProps {
  item: Item;
  compact?: boolean;
}

export default function ItemCard({ item, compact = false }: ItemCardProps) {
  const href = `/${item.type}s/${item.slug}`;

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-lg border border-border bg-card transition-all hover:border-accent/30 hover:bg-accent/5",
        compact ? "p-4" : "p-5"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-lg shrink-0">{ITEM_TYPE_ICONS[item.type]}</span>
          <div className="min-w-0">
            <h3
              className={cn(
                "font-medium truncate group-hover:text-accent transition-colors",
                compact ? "text-sm" : "text-base"
              )}
            >
              {item.title}
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {ITEM_TYPE_LABELS[item.type]}
              {item.trust_level === "official" && (
                <span className="rounded bg-emerald-500/10 px-1 py-0.5 text-[10px] text-emerald-500">✓ Oficial</span>
              )}
              {item.trust_level === "community" && item.security_status === "reviewed" && (
                <span className="rounded bg-blue-500/10 px-1 py-0.5 text-[10px] text-blue-500">✓ Revisado</span>
              )}
              {item.trust_level === "user" && (
                <span className="rounded bg-zinc-800 px-1 py-0.5 text-[10px] text-zinc-500">Comunidad</span>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 rounded-md bg-muted px-2 py-0.5">
          <span className="text-xs text-muted-foreground">⬇</span>
          <span className="text-xs font-medium tabular-nums">
            {formatNumber(item.installs)}
          </span>
        </div>
      </div>

      {/* Description */}
      <p
        className={cn(
          "mt-3 text-sm text-muted-foreground line-clamp-2",
          compact && "mt-2 line-clamp-1"
        )}
      >
        {item.description}
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        {/* Editors */}
        <div className="flex flex-wrap gap-1">
          {item.editors.slice(0, 3).map((editor) => (
            <span
              key={editor}
              className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {EDITOR_LABELS[editor] ?? editor}
            </span>
          ))}
          {item.editors.length > 3 && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              +{item.editors.length - 3}
            </span>
          )}
        </div>

        {/* Time */}
        {item.published_at && (
          <span className="text-[10px] text-muted-foreground shrink-0">
            {timeAgo(item.published_at)}
          </span>
        )}
      </div>

      {/* Tags */}
      {!compact && item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1 border-t border-border pt-3">
          {item.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 4 && (
            <span className="text-[10px] text-muted-foreground self-center">
              +{item.tags.length - 4}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

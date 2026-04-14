import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getItemBySlug, getRelatedItems } from "@/lib/data";
import { trackInstall } from "@/app/actions/install";
import {
  ITEM_TYPE_LABELS,
  ITEM_TYPE_ICONS,
  EDITOR_LABELS,
} from "@/types/database";
import { formatNumber, timeAgo } from "@/lib/utils";
import CopyButton from "@/components/copy-button";
import ItemCard from "@/components/item-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) return { title: "No encontrado" };
  return {
    title: `${item.title} — ${ITEM_TYPE_LABELS[item.type]}`,
    description: item.description,
    openGraph: {
      title: `${item.title} | codeskills.tech`,
      description: item.description,
    },
  };
}

export default async function SkillDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);

  if (!item) notFound();

  const related = await getRelatedItems(item.id, item.tags);

  const installWithId = trackInstall.bind(null, item.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Inicio
        </Link>
        <span>/</span>
        <Link href={`/${item.type}s`} className="hover:text-foreground">
          {ITEM_TYPE_LABELS[item.type]}s
        </Link>
        <span>/</span>
        <span className="text-foreground">{item.title}</span>
      </nav>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start gap-4">
            <span className="text-3xl">{ITEM_TYPE_ICONS[item.type]}</span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold">{item.title}</h1>
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            </div>
          </div>

          {/* Meta badges */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
              {ITEM_TYPE_LABELS[item.type]}
            </span>
            {item.trust_level === "official" && (
              <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-500">✓ Oficial</span>
            )}
            {item.trust_level === "community" && item.security_status === "reviewed" && (
              <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs text-blue-500">✓ Revisado</span>
            )}
            {item.editors.map((editor) => (
              <span
                key={editor}
                className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground"
              >
                {EDITOR_LABELS[editor] ?? editor}
              </span>
            ))}
            {item.language !== "es" && (
              <span className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                🌐 {item.language.toUpperCase()}
              </span>
            )}
          </div>

          {/* Stats row */}
          <div className="mt-6 flex flex-wrap items-center gap-6 border-y border-border py-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span>⬇</span>
              <span className="font-medium text-foreground">
                {formatNumber(item.installs)}
              </span>{" "}
              instalaciones
            </span>
            <span className="flex items-center gap-1.5">
              <span>👍</span>
              <span className="font-medium text-foreground">
                {item.upvotes}
              </span>{" "}
              votos
            </span>
            {item.published_at && (
              <span>Publicado {timeAgo(item.published_at)}</span>
            )}
            {item.github_url && (
              <a
                href={item.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-accent hover:underline"
              >
                GitHub ↗
              </a>
            )}
          </div>

          {/* Content */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Contenido
              </h2>
              <CopyButton text={item.content} label="Copiar contenido" />
            </div>
            <div className="rounded-lg border border-border bg-card">
              <pre className="overflow-x-auto p-6 text-sm leading-relaxed text-foreground/90">
                <code>{item.content}</code>
              </pre>
            </div>
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground hover:border-accent/30 hover:text-accent transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full shrink-0 space-y-6 lg:w-72">
          {/* Install button */}
          <form action={installWithId}>
            <button
              type="submit"
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              ⬇ Registrar instalación
            </button>
          </form>

          {/* Install instructions */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-medium">Cómo instalar</h3>
            <div className="mt-4 space-y-4">
              {item.editors.includes("claude-code") && (
                <div>
                  <p className="text-xs font-medium text-accent mb-2">
                    Claude Code
                  </p>
                  <div className="rounded-md bg-muted p-3">
                    <code className="text-xs text-muted-foreground break-all">
                      Copia el contenido en
                      .claude/skills/{item.slug}/SKILL.md
                    </code>
                  </div>
                </div>
              )}
              {item.editors.includes("cursor") && (
                <div>
                  <p className="text-xs font-medium text-accent mb-2">
                    Cursor
                  </p>
                  <div className="rounded-md bg-muted p-3">
                    <code className="text-xs text-muted-foreground break-all">
                      Copia el contenido en .cursor/rules/{item.slug}.mdc
                    </code>
                  </div>
                </div>
              )}
              {item.editors.includes("windsurf") && (
                <div>
                  <p className="text-xs font-medium text-accent mb-2">
                    Windsurf
                  </p>
                  <div className="rounded-md bg-muted p-3">
                    <code className="text-xs text-muted-foreground break-all">
                      Copia el contenido en .windsurf/rules/{item.slug}.md
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related items */}
          {related.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Relacionados
              </h3>
              <div className="space-y-2">
                {related.map((relItem) => (
                  <ItemCard key={relItem.id} item={relItem} compact />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  ITEM_TYPE_LABELS,
  ITEM_TYPE_ICONS,
  type ItemType,
} from "@/types/database";
import { EDITORS } from "@/lib/constants";
import { getStats, getFeaturedItems } from "@/lib/data";
import ItemCard from "@/components/item-card";

const ITEM_TYPES: { type: ItemType; description: string }[] = [
  {
    type: "skill",
    description: "Capacidades modulares que tu agente carga bajo demanda",
  },
  {
    type: "rule",
    description: "Instrucciones de sistema por framework o lenguaje",
  },
  {
    type: "mcp",
    description: "Conexiones a herramientas externas y APIs",
  },
  {
    type: "agent",
    description: "Subagentes especializados para tareas específicas",
  },
  {
    type: "hook",
    description: "Scripts que se ejecutan en eventos del ciclo de vida",
  },
  {
    type: "plugin",
    description: "Paquetes que combinan skills, commands y agents",
  },
];

export default async function HomePage() {
  const [stats, featuredItems] = await Promise.all([
    getStats(),
    getFeaturedItems(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-accent)_0%,_transparent_50%)] opacity-5" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-secondary animate-pulse" />
            Primera plataforma de AI coding skills en español
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Las mejores{" "}
            <span className="text-accent">configuraciones AI</span> para tu
            editor de código
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Descubre, comparte e instala Agent Skills, Reglas, MCPs y Agentes
            para Claude Code, Cursor, Windsurf y más.{" "}
            <span className="text-foreground">
              En español, para devs LATAM.
            </span>
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-10 max-w-xl">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1.5 shadow-lg shadow-black/20 transition-colors focus-within:border-accent/50">
              <span className="pl-3 text-muted-foreground">🔍</span>
              <input
                type="text"
                placeholder="Buscar skills, reglas, MCPs..."
                className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">
                Buscar
              </button>
            </div>
          </div>

          {/* Editor badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">
              Compatible con:
            </span>
            {EDITORS.map((editor) => (
              <span
                key={editor.id}
                className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {editor.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {[
            { value: stats.totalItems || "—", label: "Items publicados" },
            { value: stats.totalInstalls || "—", label: "Instalaciones" },
            { value: stats.contributors || "—", label: "Contribuidores" },
            { value: stats.editors, label: "Editores soportados" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-background px-4 py-6 text-center"
            >
              <p className="text-2xl font-bold text-accent">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by type */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2 className="text-xl font-semibold">Explorar por tipo</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Encuentra exactamente lo que necesita tu agente
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ITEM_TYPES.map(({ type, description }) => (
            <Link
              key={type}
              href={`/${type}s`}
              className="group flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-all hover:border-accent/30 hover:bg-accent/5"
            >
              <span className="text-2xl">{ITEM_TYPE_ICONS[type]}</span>
              <div>
                <h3 className="font-medium group-hover:text-accent">
                  {ITEM_TYPE_LABELS[type]}s
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured items */}
      {featuredItems.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-16">
            <h2 className="text-xl font-semibold">⭐ Destacados</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Los items más populares de la comunidad
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-border bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold">
            ¿Tienes un skill o regla que compartir?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Publica tus configuraciones y ayuda a otros devs LATAM a ser más
            productivos con sus agentes AI.
          </p>
          <Link
            href="/submit"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            + Publicar un item
          </Link>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { searchItems } from "@/lib/data";
import ItemCard from "@/components/item-card";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q ?? "";
  return {
    title: q ? `"${q}" — Buscar` : "Buscar",
    description: `Resultados de búsqueda para "${q}" en codeskills.tech`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const items = await searchItems(q);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Buscar</h1>

      {/* Search form */}
      <form
        action="/search"
        method="GET"
        className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-card p-1.5"
      >
        <span className="pl-3 text-muted-foreground">🔍</span>
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar skills, reglas, MCPs..."
          className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Buscar
        </button>
      </form>

      {/* Results */}
      {q && (
        <p className="mt-6 text-sm text-muted-foreground">
          {items.length} resultado{items.length !== 1 ? "s" : ""} para &quot;{q}&quot;
        </p>
      )}

      {items.length > 0 ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : q ? (
        <div className="mt-16 text-center">
          <span className="text-4xl">📭</span>
          <p className="mt-4 font-medium">No se encontraron resultados</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Intenta con otros términos de búsqueda.
          </p>
        </div>
      ) : null}
    </div>
  );
}

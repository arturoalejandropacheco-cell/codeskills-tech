import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { submitItem } from "./actions";
import {
  ITEM_TYPE_LABELS,
  EDITOR_LABELS,
  type ItemType,
  type EditorType,
} from "@/types/database";

export const metadata: Metadata = {
  title: "Publicar",
  description:
    "Comparte tus skills, reglas, MCPs o agentes con la comunidad LATAM.",
};

export default async function SubmitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold">Publicar un item</h1>
        <p className="mt-2 text-muted-foreground">
          Comparte tus configuraciones de AI coding con la comunidad.
        </p>
        <div className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
          <span className="text-4xl">🔐</span>
          <p className="mt-4 font-medium">Necesitas iniciar sesión</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa con tu cuenta de GitHub para publicar contenido.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90"
          >
            Ingresar con GitHub
          </Link>
        </div>
      </div>
    );
  }

  const itemTypes = Object.entries(ITEM_TYPE_LABELS) as [ItemType, string][];
  const editorTypes = Object.entries(EDITOR_LABELS) as [EditorType, string][];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">Publicar un item</h1>
      <p className="mt-2 text-muted-foreground">
        Comparte tus configuraciones de AI coding con la comunidad.
      </p>

      <form action={submitItem} className="mt-8 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Ej: Next.js 15 CLAUDE.md"
            className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium">
            Tipo
          </label>
          <select
            id="type"
            name="type"
            required
            className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {itemTypes.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Editors */}
        <div>
          <label className="block text-sm font-medium">
            Editores compatibles
          </label>
          <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {editorTypes.map(([id, label]) => (
              <label
                key={id}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-accent/30 cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-accent/10"
              >
                <input
                  type="checkbox"
                  name="editors"
                  value={id}
                  className="accent-accent"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium">
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            placeholder="react, nextjs, typescript (máx. 5, separados por coma)"
            className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Separados por coma, máximo 5
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            required
            maxLength={280}
            rows={3}
            placeholder="Breve descripción de tu item (máx. 280 caracteres)"
            className="mt-1.5 w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium">
            Contenido
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={16}
            placeholder="Pega aquí el contenido de tu SKILL.md, CLAUDE.md, .cursorrules..."
            className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 font-mono text-sm outline-none focus:border-accent"
          />
        </div>

        {/* GitHub URL */}
        <div>
          <label htmlFor="github_url" className="block text-sm font-medium">
            URL de GitHub{" "}
            <span className="text-muted-foreground">(opcional)</span>
          </label>
          <input
            id="github_url"
            name="github_url"
            type="url"
            placeholder="https://github.com/user/repo"
            className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium">
            Idioma
          </label>
          <select
            id="language"
            name="language"
            className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 border-t border-border pt-6">
          <button
            type="submit"
            className="rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Enviar para revisión
          </button>
          <p className="text-xs text-muted-foreground">
            Tu item será revisado antes de publicarse.
          </p>
        </div>
      </form>
    </div>
  );
}

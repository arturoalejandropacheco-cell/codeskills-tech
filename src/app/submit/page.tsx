import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Publicar",
  description: "Comparte tus skills, reglas, MCPs o agentes con la comunidad LATAM.",
};

export default function SubmitPage() {
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

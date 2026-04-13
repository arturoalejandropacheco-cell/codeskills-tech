import type { Metadata } from "next";
import Link from "next/link";
import { signInWithGitHub } from "./actions";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Inicia sesión con tu cuenta de GitHub para publicar y contribuir.",
};

interface LoginPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center justify-center px-4 py-20">
      <span className="text-4xl">🔐</span>
      <h1 className="mt-6 text-2xl font-bold">Ingresar</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Inicia sesión con GitHub para publicar skills, reglas, y más.
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          Error al iniciar sesión. Intenta nuevamente.
        </div>
      )}

      <form action={signInWithGitHub} className="mt-8 w-full">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 font-medium text-background transition-opacity hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Continuar con GitHub
        </button>
      </form>

      <p className="mt-4 text-xs text-muted-foreground">
        Solo necesitamos tu perfil público.{" "}
        <Link href="/about" className="text-accent hover:underline">
          Más info
        </Link>
      </p>
    </div>
  );
}

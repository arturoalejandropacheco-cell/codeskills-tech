import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "codeskills.lat — AI Coding Skills en Español",
    template: "%s | codeskills.lat",
  },
  description:
    "El directorio en español de Agent Skills, Rules, MCPs y Agents para Claude Code, Cursor, Windsurf y más. La comunidad LATAM de AI coding.",
  metadataBase: new URL("https://codeskills.lat"),
  openGraph: {
    title: "codeskills.lat — AI Coding Skills en Español",
    description:
      "Descubre, comparte e instala configuraciones para tus agentes de código AI. Multi-editor, en español, para devs LATAM.",
    siteName: "codeskills.lat",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@codeskillslat",
  },
};

const navItems = [
  { label: "Skills", href: "/skills" },
  { label: "Reglas", href: "/rules" },
  { label: "MCPs", href: "/mcps" },
  { label: "Agentes", href: "/agents" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn("h-full antialiased", "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold tracking-tight"
              >
                <span className="text-lg text-accent">⚡</span>
                <span>
                  code<span className="text-accent">skills</span>
                  <span className="text-muted-foreground">.lat</span>
                </span>
              </Link>
              <nav className="hidden items-center gap-1 md:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/submit"
                className="hidden rounded-md bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20 sm:inline-flex"
              >
                + Publicar
              </Link>
              <Link
                href="/login"
                className="rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
              >
                Ingresar
              </Link>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              codeskills.lat — AI Coding Skills en Español para devs LATAM
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Acerca de
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Blog
              </Link>
              <a
                href="https://github.com/codeskills-lat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href="https://x.com/codeskillslat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                X/Twitter
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

# codeskills.tech

Directorio comunitario en español de Agent Skills, Rules, MCPs y Agents para Claude Code, Cursor, Windsurf y otros editores AI.

## Stack

- Next.js 16 (App Router, Server Components por defecto)
- TypeScript strict mode
- Tailwind CSS 4 + shadcn/ui (componentes en src/components/ui/)
- Supabase (auth con GitHub OAuth, PostgreSQL)
- Bun como package manager
- Vercel para deploy

## Comandos

- `bun run dev` — Dev server en localhost:3000
- `bun run build` — Build de producción
- `bun run lint` — ESLint
- `bun run db:types` — Regenerar tipos TypeScript desde Supabase local

## Supabase local

- `supabase start` — Levanta Postgres, Auth, API (requiere Docker)
- `supabase stop` — Detiene la instancia local
- `supabase db reset` — Aplica migraciones y seeds
- Studio local en http://127.0.0.1:54323

## Base de datos

Migraciones en supabase/migrations/. Tablas: items, profiles, installs, categories.

## Auth

- GitHub OAuth via Supabase Auth
- Middleware en src/middleware.ts refresca sesión
- Server actions en src/app/login/actions.ts (signInWithGitHub, signOut)
- Callback en src/app/auth/callback/route.ts

## Convenciones

- Componentes: PascalCase, un archivo por componente
- Archivos: kebab-case (skill-card.tsx)
- Server Components por defecto. "use client" solo cuando necesario
- NUNCA usar any. Tipos en src/types/
- Imports con @/ (ej: @/components/skill-card)
- Solo Tailwind classes, NO CSS custom
- cn() de @/lib/utils para clases condicionales
- shadcn/ui: `bunx shadcn@latest add <componente>` para agregar nuevos

## Idioma

- UI y contenido: español
- Código y variables: inglés
- Commits: inglés, conventional commits

## Diseño

IMPORTANTE: Leer `docs/DESIGN-SYSTEM.md` antes de crear o modificar
cualquier componente visual. Contiene la paleta completa, tipografía,
componentes con código de ejemplo, y anti-patrones.

Resumen rápido:
- Dark & minimal (estilo Linear/GitHub)
- Fondo: #08080a, cards: #111113, surface: #18181b
- Acento: ámbar #f59e0b (hover: #d97706, muted: #b45309)
- Texto: #e4e4e7 (primario), #a1a1aa (secundario), #71717a (muted)
- Bordes: #27272a (sólido) o rgba(255,255,255,0.06) (sutil)
- Tipografía: system-ui para UI, monospace para código
- Logo SVGs en /public/logo/
- NO gradientes, NO shadows, NO animaciones complejas

## NO hacer

- No instalar ORMs (Supabase client directo)
- No crear archivos CSS separados
- No usar localStorage
- No commitear .env.local

# codeskills.lat

Directorio comunitario en español de Agent Skills, Rules, MCPs y Agents para Claude Code, Cursor, Windsurf y otros editores AI.

## Stack

- Next.js 15 (App Router, Server Components por defecto)
- TypeScript strict mode
- Tailwind CSS + class-variance-authority + clsx + tailwind-merge
- Supabase (auth con GitHub OAuth, PostgreSQL)
- Vercel para deploy

## Comandos

- `npm run dev` — Dev server en localhost:3000
- `npm run build` — Build de producción
- `npm run lint` — ESLint

## Base de datos

Migraciones en supabase/migrations/. Tablas: items, profiles, installs, categories.

## Convenciones

- Componentes: PascalCase, un archivo por componente
- Archivos: kebab-case (skill-card.tsx)
- Server Components por defecto. "use client" solo cuando necesario
- NUNCA usar any. Tipos en src/types/
- Imports con @/ (ej: @/components/skill-card)
- Solo Tailwind classes, NO CSS custom
- cn() de @/lib/utils para clases condicionales

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

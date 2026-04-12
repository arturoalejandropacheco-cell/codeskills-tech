# codeskills.lat — Sistema de diseño

Este documento define la identidad visual completa de codeskills.lat.
Debe ser leído por Claude Code antes de crear o modificar cualquier
componente visual del proyecto.

## Filosofía de diseño

Dark & minimal, inspirado en Linear y GitHub. Cada elemento tiene
propósito. Nada decorativo. El contenido es protagonista. El ámbar
como acento transmite energía y calidez sin ser agresivo — nos
diferencia de los cyan (cursor.directory), azules (skills.sh),
y verdes (claudedirectory.org) del ecosistema.

## Logo

Archivos en `/public/logo/`:
- `logo-full.svg` — Ícono + codeskills.lat (header desktop)
- `logo-compact.svg` — Ícono + codeskills (header mobile)
- `logo-icon.svg` — Solo ícono 28x28 (favicon)
- `logo-og.svg` — Ícono grande 512x512 (og:image, social)

### Concepto del ícono
Hexágono (nodo de red = skills conectados) con punto central
(tu agente). Rounded square exterior con rx=6. Forma de cristal
que sugiere valor y precisión.

### Uso en código
```tsx
// Header desktop
<Link href="/" className="flex items-center gap-2">
  <img src="/logo/logo-icon.svg" alt="" width={22} height={22} />
  <span className="text-sm font-semibold tracking-tight">
    code<span className="text-amber-500">skills</span>
    <span className="text-zinc-500">.lat</span>
  </span>
</Link>

// Header mobile — solo ícono
<img src="/logo/logo-icon.svg" alt="codeskills.lat" width={24} height={24} />
```

### Reglas del logo
- Nunca cambiar los colores del ícono
- Nunca rotar ni distorsionar
- Mínimo 18px de ancho para el ícono solo
- Siempre "code" en blanco, "skills" en ámbar, ".lat" en zinc-500

## Paleta de colores

### Colores base (fondos)

| Token | Hex | Uso |
|-------|-----|-----|
| `--background` | `#08080a` | Fondo principal de la página |
| `--card` | `#111113` | Fondo de cards, dropdowns, modals |
| `--surface` | `#18181b` | Badges, inputs, surfaces elevadas |
| `--border` | `#27272a` | Bordes, separadores, dividers |
| `--border-subtle` | `rgba(255,255,255,0.06)` | Bordes sutiles dentro de cards |

### Colores de acento

| Token | Hex | Tailwind | Uso |
|-------|-----|----------|-----|
| `--accent` | `#f59e0b` | `amber-500` | Acento principal: CTAs, links activos, stats |
| `--accent-hover` | `#d97706` | `amber-600` | Hover en botones primarios |
| `--accent-muted` | `#b45309` | `amber-700` | Texto sobre fondos ámbar, badges |
| `--accent-bg` | `rgba(245,158,11,0.10)` | `amber-500/10` | Fondos tenues: badges, pills, hover cards |
| `--accent-bg-hover` | `rgba(245,158,11,0.15)` | `amber-500/15` | Hover sobre fondos ámbar |
| `--accent-border` | `rgba(245,158,11,0.25)` | `amber-500/25` | Border hover en cards |

### Colores de texto

| Token | Hex | Tailwind | Uso |
|-------|-----|----------|-----|
| `--text-primary` | `#e4e4e7` | `zinc-200` | Texto principal: títulos, body |
| `--text-secondary` | `#a1a1aa` | `zinc-400` | Texto secundario: descripciones |
| `--text-muted` | `#71717a` | `zinc-500` | Texto terciario: labels, hints |
| `--text-faint` | `#52525b` | `zinc-600` | Section labels, placeholders |

### Colores semánticos

| Token | Hex | Tailwind | Uso |
|-------|-----|----------|-----|
| `--success` | `#22c55e` | `green-500` | Online, publicado, éxito |
| `--danger` | `#ef4444` | `red-500` | Error, eliminar, alerta |
| `--info` | `#3b82f6` | `blue-500` | Info, links externos |

### CSS Variables (copiar a globals.css)

```css
:root {
  --background: #08080a;
  --foreground: #e4e4e7;
  --card: #111113;
  --card-foreground: #e4e4e7;
  --surface: #18181b;
  --border: #27272a;
  --border-subtle: rgba(255, 255, 255, 0.06);
  --accent: #f59e0b;
  --accent-hover: #d97706;
  --accent-muted: #b45309;
  --accent-bg: rgba(245, 158, 11, 0.10);
  --accent-bg-hover: rgba(245, 158, 11, 0.15);
  --accent-border: rgba(245, 158, 11, 0.25);
  --text-primary: #e4e4e7;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --text-faint: #52525b;
  --success: #22c55e;
  --danger: #ef4444;
  --info: #3b82f6;
}
```

## Tipografía

### Font stack
- UI: `system-ui, -apple-system, 'Segoe UI', sans-serif`
- Código: `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`

NO usar Google Fonts para evitar latencia. El system font stack
renderiza SF Pro en macOS, Segoe UI en Windows, y Roboto en Android.

### Escala

| Nivel | Tamaño | Peso | Tracking | Uso |
|-------|--------|------|----------|-----|
| H1 | 28-36px | 700 | -1px | Hero, títulos de página |
| H2 | 20px | 600 | -0.5px | Sección titles |
| H3 | 16px | 600 | 0 | Card titles, subtítulos |
| Body | 14px | 400 | 0 | Párrafos, descripciones |
| Small | 13px | 400 | 0 | Texto secundario, metadata |
| Caption | 11-12px | 400 | 0 | Badges, tags, timestamps |
| Label | 10px | 500 | 1.5px | Section headers (UPPERCASE) |
| Code | 13px | 400 | 0 | Paths, snippets (monospace) |

### Reglas tipográficas
- Títulos: tight letter-spacing (-0.5px a -1px)
- Section labels: UPPERCASE, letter-spacing 1.5px, text-faint
- "codeskills" siempre en una palabra, nunca "Code Skills"
- Texto en ámbar solo para: el nombre "skills" en el logo,
  números de stats, y accents en headings
- Nunca ámbar en párrafos largos de texto

## Espaciado

### Escala base (rem)
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 0.75rem (12px)
- lg: 1rem (16px)
- xl: 1.5rem (24px)
- 2xl: 2rem (32px)
- 3xl: 3rem (48px)

### Padding de componentes
- Cards: `p-4` (16px) en mobile, `p-5` (20px) en desktop
- Botones: `px-3 py-1.5` (small), `px-4 py-2` (default), `px-6 py-3` (large)
- Badges: `px-2 py-0.5` (8px x 2px)
- Input fields: `px-3 py-2`
- Secciones de página: `py-16` (64px) vertical, `px-4` horizontal
- Max-width del contenido: `max-w-6xl` (1152px) centrado

## Border radius

| Elemento | Valor | Tailwind |
|----------|-------|----------|
| Cards | 10px | `rounded-lg` |
| Botones | 6px | `rounded-md` |
| Badges/pills | 4px | `rounded` |
| Input fields | 8px | `rounded-lg` |
| Pills redondeados | 20px | `rounded-full` |
| Modals | 12px | `rounded-xl` |

## Componentes

### Card (item del directorio)

```
┌─────────────────────────────────────┐
│ 🛠️ Skill              ⬇ 312       │  ← Tipo + install count
│ Frontend Design                     │  ← Título (font-weight 500)
│                                     │
│ Crea interfaces web distintivas y   │  ← Descripción (text-muted, line-clamp-2)
│ production-grade con alta calidad.  │
│                                     │
│ [Claude Code] [react] [css]         │  ← Badges: editor primario en ámbar, tags en surface
└─────────────────────────────────────┘

Estados:
- Default: bg-card, border-border-subtle
- Hover: border-accent-border, bg-accent-bg (muy sutil)
- El título cambia a text-accent en hover
```

Implementación:
```tsx
<div className="rounded-lg border border-white/[0.06] bg-[#111113] p-4
  transition-all hover:border-amber-500/25 hover:bg-amber-500/[0.03]
  group cursor-pointer">

  {/* Header */}
  <div className="flex items-start justify-between">
    <div>
      <span className="text-xs text-zinc-500">🛠️ Skill</span>
      <h3 className="mt-1 text-sm font-medium group-hover:text-amber-500
        transition-colors">Frontend Design</h3>
    </div>
    <span className="rounded bg-[#18181b] px-2 py-0.5 text-xs text-zinc-500">
      ⬇ 312
    </span>
  </div>

  {/* Description */}
  <p className="mt-2 text-xs text-zinc-500 line-clamp-2">
    Crea interfaces web distintivas y production-grade...
  </p>

  {/* Badges */}
  <div className="mt-3 flex gap-1">
    <span className="rounded bg-amber-500/10 px-2 py-0.5
      text-[10px] text-amber-700">Claude Code</span>
    <span className="rounded bg-[#18181b] px-2 py-0.5
      text-[10px] text-zinc-600">react</span>
  </div>
</div>
```

### Botón primario

```tsx
<button className="rounded-md bg-amber-500 px-4 py-2 text-sm
  font-medium text-[#08080a] transition-colors hover:bg-amber-600">
  Buscar
</button>
```

### Botón secundario

```tsx
<button className="rounded-md bg-[#18181b] px-3 py-1.5 text-sm
  text-zinc-500 transition-colors hover:bg-[#27272a] hover:text-zinc-300">
  Ingresar
</button>
```

### Botón ghost (navegación)

```tsx
<button className="rounded-md px-3 py-1.5 text-sm text-zinc-500
  transition-colors hover:bg-[#18181b] hover:text-zinc-300">
  Skills
</button>
```

### Botón accent outline (publicar)

```tsx
<button className="rounded-md bg-amber-500/10 px-3 py-1.5 text-sm
  font-medium text-amber-500 transition-colors hover:bg-amber-500/20">
  + Publicar
</button>
```

### Badge de editor (destacado)

```tsx
<span className="rounded bg-amber-500/10 px-2 py-0.5
  text-[10px] text-amber-700">Claude Code</span>
```

### Badge de tag (neutro)

```tsx
<span className="rounded bg-[#18181b] px-2 py-0.5
  text-[10px] text-zinc-600">nextjs</span>
```

### Badge de filtro (activo vs inactivo)

```tsx
{/* Activo */}
<button className="rounded-md bg-amber-500/15 px-2.5 py-1
  text-xs text-amber-500">Populares</button>

{/* Inactivo */}
<button className="rounded-md bg-[#18181b] px-2.5 py-1
  text-xs text-zinc-500 hover:text-zinc-300">Recientes</button>
```

### Input / search bar

```tsx
<div className="flex items-center gap-2 rounded-lg border border-white/[0.06]
  bg-[#111113] p-1.5 transition-colors focus-within:border-amber-500/30
  shadow-lg shadow-black/20">
  <span className="pl-3 text-zinc-500">🔍</span>
  <input
    type="text"
    placeholder="Buscar skills, reglas, MCPs..."
    className="flex-1 bg-transparent py-2 text-sm outline-none
      placeholder:text-zinc-500"
  />
  <button className="rounded-md bg-amber-500 px-4 py-2 text-sm
    font-medium text-[#08080a]">Buscar</button>
</div>
```

### Pill de estado

```tsx
<div className="inline-flex items-center gap-2 rounded-full border
  border-white/[0.06] bg-[#18181b] px-3 py-1 text-xs text-zinc-500">
  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
  Primera plataforma de AI coding skills en español
</div>
```

### Stat card

```tsx
<div className="text-center px-4 py-4">
  <p className="text-2xl font-bold text-amber-500">847</p>
  <p className="mt-1 text-[10px] text-zinc-500">Items publicados</p>
</div>
```

### Section label

```tsx
<h2 className="text-[10px] font-medium uppercase tracking-[1.5px] text-zinc-600">
  Framework / Lenguaje
</h2>
```

### Header

```
┌──────────────────────────────────────────────────────────────┐
│ [⬡] codeskills.lat    Skills  Reglas  MCPs  Agentes    [+P] [Ing] │
└──────────────────────────────────────────────────────────────┘

- Sticky top con backdrop-blur
- bg-background/80 + backdrop-blur-md
- border-b con border-subtle
- Height: h-14 (56px)
- Max-width: max-w-6xl centrado
- Logo a la izquierda, nav al centro-izq, actions a la derecha
- En mobile: logo + hamburger menu
```

### Footer

```
- border-t con border-subtle
- Texto muted, links hover a foreground
- Dos columnas: branding izq, links der
- Padding: py-8
```

## Efectos y transiciones

### Hover en cards
```css
transition: all 150ms ease;
/* Default → Hover */
border-color: rgba(255,255,255,0.06) → rgba(245,158,11,0.25);
background: #111113 → rgba(245,158,11,0.03);
```

### Hero glow
```css
/* Radial gradient sutil detrás del hero */
background: radial-gradient(
  ellipse at top,
  rgba(245, 158, 11, 0.06) 0%,
  transparent 60%
);
```

### Transiciones globales
- Todas las transiciones: `transition-colors` (150ms ease)
- Hover en links: color change only, no underline
- Focus en inputs: `border-amber-500/30` con ring sutil
- NO usar animaciones complejas, transform scale, ni shadows

### Scrollbar (webkit)
```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #18181b; }
::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #71717a; }
```

## Layout

### Estructura de páginas

```
┌─ Header (sticky, h-14) ──────────────────────────┐
│                                                    │
├─ Main Content (flex-1) ───────────────────────────┤
│  max-w-6xl mx-auto px-4                           │
│                                                    │
│  Browse pages:                                     │
│  ┌─ Sidebar (w-56) ─┬─ Grid (flex-1) ──────────┐ │
│  │ Sort              │  ┌──────┐ ┌──────┐       │ │
│  │ Editor            │  │ Card │ │ Card │       │ │
│  │ Category          │  └──────┘ └──────┘       │ │
│  │                   │  ┌──────┐ ┌──────┐       │ │
│  │                   │  │ Card │ │ Card │       │ │
│  └───────────────────┴──└──────┘─└──────┘───────┘ │
│                                                    │
│  Detail pages:                                     │
│  ┌─ Content (flex-1) ──────┬─ Sidebar (w-72) ──┐ │
│  │ Title, description      │ Install instruc.   │ │
│  │ Meta badges             │ Related items      │ │
│  │ Stats                   │                    │ │
│  │ Content preview         │                    │ │
│  │ Tags                    │                    │ │
│  └─────────────────────────┴────────────────────┘ │
│                                                    │
├─ Footer ──────────────────────────────────────────┤
└───────────────────────────────────────────────────┘
```

### Breakpoints
- Mobile: < 640px — stack everything, sidebar collapses
- Tablet: 640-1024px — 2-column grid, sidebar visible
- Desktop: > 1024px — full layout, sidebar + 2-col grid

### Grid de cards
- Browse: `grid-cols-1 sm:grid-cols-2` con gap-3
- Landing featured: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` con gap-3
- Landing "por tipo": `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` con gap-3

## Anti-patrones (NO hacer)

- NO usar gradientes excepto el glow sutil del hero
- NO usar drop-shadows ni box-shadows en cards
- NO usar bordes gruesos (max 1px, preferir 0.5px)
- NO usar colores fuera de la paleta definida
- NO usar opacity menor a 0.06 para bordes (invisible)
- NO usar ámbar para texto de párrafos largos
- NO usar hover effects con scale/transform
- NO usar animaciones de entrada (fade-in, slide-in)
- NO usar font-weight 700 excepto en H1
- NO mezclar border-radius (todo consistente por tipo)
- NO usar backgrounds con pattern/texture/noise
- NO usar emojis como decoración, solo como íconos funcionales
  de tipo de item (🛠️ skill, 📏 rule, 🔌 mcp, 🤖 agent)

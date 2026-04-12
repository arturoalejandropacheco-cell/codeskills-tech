---
description: Reglas de estilo para componentes React y páginas
globs: src/**/*.tsx
---

- Tipar props con interface, no type alias
- Nombre de interface: {ComponentName}Props
- Usar cn() para clases Tailwind condicionales
- Server Component por defecto, "use client" solo si necesario
- Imports absolutos con @/ siempre
- No usar default export para utilidades, solo para componentes
- Manejar estados vacíos en componentes de lista
- Texts de UI en español, nombres de código en inglés

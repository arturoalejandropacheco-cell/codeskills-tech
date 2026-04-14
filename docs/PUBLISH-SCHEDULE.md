# Calendario de publicación — codeskills.tech

## Lote 0 — Publicado (lanzamiento)
1. AGENTS (agent)
2. CLAUDE (rule)
3. Composition Patterns (skill)
4. vercel-composition-patterns (skill)
5. deploy-to-vercel (skill)
6. React Best Practices (skill)
7. vercel-react-best-practices (skill)
8. React Native Skills (skill)
9. vercel-react-native-skills (skill)
10. React View Transitions (skill)
11. vercel-react-view-transitions (skill)
12. vercel-cli-with-tokens (skill)
13. web-design-guidelines (skill)

### Cómo publicar un lote
```bash
bunx tsx scripts/publish-batch.ts [NÚMERO]
```

O en Supabase SQL Editor:
```sql
UPDATE items SET status = 'published', published_at = NOW() WHERE publish_batch = [NÚMERO];
```

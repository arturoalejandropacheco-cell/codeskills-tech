import type { Metadata } from "next";
import BrowsePageLayout from "@/components/browse-page-layout";
import { getItems, getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Agent Skills para Claude Code, Cursor, Windsurf y más. Capacidades modulares que tu agente carga bajo demanda.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function SkillsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [{ items, totalCount }, categories] = await Promise.all([
    getItems({
      type: "skill",
      editor: params.editor,
      category: params.category,
      sort: params.sort,
    }),
    getCategories(),
  ]);

  return (
    <BrowsePageLayout
      title="🛠️ Skills"
      description="Capacidades modulares que tu agente carga bajo demanda. SKILL.md compatibles con Claude Code, Cursor, y más."
      items={items}
      categories={categories}
      itemType="skill"
      totalCount={totalCount}
    />
  );
}

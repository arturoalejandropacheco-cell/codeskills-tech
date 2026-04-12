import type { Metadata } from "next";
import BrowsePageLayout from "@/components/browse-page-layout";
import { getItems, getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Reglas",
  description:
    "Cursor Rules y CLAUDE.md templates para configurar tu agente AI por framework y lenguaje.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function RulesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [{ items, totalCount }, categories] = await Promise.all([
    getItems({
      type: "rule",
      editor: params.editor,
      category: params.category,
      sort: params.sort,
    }),
    getCategories(),
  ]);

  return (
    <BrowsePageLayout
      title="📏 Reglas"
      description="CLAUDE.md templates y Cursor Rules por framework. Instrucciones de sistema que definen cómo tu agente escribe código."
      items={items}
      categories={categories}
      itemType="rule"
      totalCount={totalCount}
    />
  );
}

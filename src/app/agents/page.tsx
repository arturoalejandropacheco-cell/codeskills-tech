import type { Metadata } from "next";
import BrowsePageLayout from "@/components/browse-page-layout";
import { getItems, getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Agentes",
  description:
    "Subagentes especializados para Claude Code. Code reviewers, architects, debuggers y más.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AgentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [{ items, totalCount }, categories] = await Promise.all([
    getItems({
      type: "agent",
      editor: params.editor,
      category: params.category,
      sort: params.sort,
    }),
    getCategories(),
  ]);

  return (
    <BrowsePageLayout
      title="🤖 Agentes"
      description="Subagentes especializados para tareas específicas. Code reviewers, architects, debuggers, y más."
      items={items}
      categories={categories}
      itemType="agent"
      totalCount={totalCount}
    />
  );
}

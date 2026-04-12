import type { Metadata } from "next";
import BrowsePageLayout from "@/components/browse-page-layout";
import { getItems, getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "MCP Servers",
  description:
    "Servidores MCP para conectar tu agente AI con herramientas externas, bases de datos, y APIs.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function McpsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [{ items, totalCount }, categories] = await Promise.all([
    getItems({
      type: "mcp",
      editor: params.editor,
      category: params.category,
      sort: params.sort,
    }),
    getCategories(),
  ]);

  return (
    <BrowsePageLayout
      title="🔌 MCP Servers"
      description="Conexiones a herramientas externas y APIs. Extiende tu agente con acceso a GitHub, bases de datos, Slack, y más."
      items={items}
      categories={categories}
      itemType="mcp"
      totalCount={totalCount}
    />
  );
}

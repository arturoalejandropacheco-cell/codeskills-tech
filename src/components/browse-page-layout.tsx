import { Suspense } from "react";
import ItemCard from "@/components/item-card";
import FilterSidebar from "@/components/filter-sidebar";
import type { Item, Category, ItemType } from "@/types/database";
import { ITEM_TYPE_LABELS } from "@/types/database";

interface BrowsePageLayoutProps {
  title: string;
  description: string;
  items: Item[];
  categories: Category[];
  itemType?: ItemType;
  totalCount: number;
}

export default function BrowsePageLayout({
  title,
  description,
  items,
  categories,
  itemType,
  totalCount,
}: BrowsePageLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <Suspense fallback={null}>
          <FilterSidebar categories={categories} currentType={itemType} />
        </Suspense>

        {/* Grid */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {totalCount}{" "}
              {itemType
                ? ITEM_TYPE_LABELS[itemType].toLowerCase() +
                  (totalCount !== 1 ? "s" : "")
                : "resultado" + (totalCount !== 1 ? "s" : "")}
            </p>
          </div>

          {items.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
              <p className="text-4xl">📭</p>
              <p className="mt-4 font-medium">No hay items todavía</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sé el primero en publicar un{" "}
                {itemType ? ITEM_TYPE_LABELS[itemType].toLowerCase() : "item"}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import type { Item, Category, ItemType } from "@/types/database";

export async function getItems(options?: {
  type?: ItemType;
  editor?: string;
  category?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: Item[]; totalCount: number }> {
  const supabase = await createClient();
  let query = supabase
    .from("items")
    .select("*", { count: "exact" })
    .eq("status", "published");

  if (options?.type) {
    query = query.eq("type", options.type);
  }
  if (options?.editor && options.editor !== "all") {
    query = query.contains("editors", [options.editor]);
  }
  if (options?.category && options.category !== "all") {
    query = query.contains("tags", [options.category]);
  }

  const sort = options?.sort ?? "installs";
  if (sort === "installs") {
    query = query.order("installs", { ascending: false });
  } else if (sort === "newest") {
    query = query.order("published_at", { ascending: false, nullsFirst: false });
  } else if (sort === "updated") {
    query = query.order("updated_at", { ascending: false });
  }

  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("getItems error:", error.message);
    return { items: [], totalCount: 0 };
  }

  return {
    items: (data ?? []) as Item[],
    totalCount: count ?? 0,
  };
}

export async function getItemBySlug(slug: string): Promise<Item | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*, author:profiles(*)")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as Item;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("item_count", { ascending: false });

  if (error) {
    console.error("getCategories error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getFeaturedItems(): Promise<Item[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("installs", { ascending: false })
    .limit(6);

  if (error) {
    console.error("getFeaturedItems error:", error.message);
    return [];
  }

  return (data ?? []) as Item[];
}

export async function getStats() {
  const supabase = await createClient();

  const [itemsRes] = await Promise.all([
    supabase
      .from("items")
      .select("id, installs, author_id, editors", { count: "exact" })
      .eq("status", "published"),
  ]);

  const items = itemsRes.data ?? [];
  const totalItems = itemsRes.count ?? 0;
  const totalInstalls = items.reduce((sum, i) => sum + (i.installs ?? 0), 0);
  const contributors = new Set(items.map((i) => i.author_id).filter(Boolean)).size;
  const allEditors = new Set(items.flatMap((i) => i.editors ?? []));

  return {
    totalItems,
    totalInstalls,
    contributors: contributors || 0,
    editors: allEditors.size || 6,
  };
}

export async function getRelatedItems(
  itemId: string,
  tags: string[]
): Promise<Item[]> {
  if (tags.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("status", "published")
    .neq("id", itemId)
    .overlaps("tags", tags)
    .limit(3);

  if (error) {
    console.error("getRelatedItems error:", error.message);
    return [];
  }

  return (data ?? []) as Item[];
}

export async function searchItems(query: string): Promise<Item[]> {
  if (!query.trim()) return [];

  const supabase = await createClient();
  const term = `%${query.trim()}%`;
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("status", "published")
    .or(`title.ilike.${term},description.ilike.${term}`)
    .order("installs", { ascending: false })
    .limit(50);

  if (error) {
    console.error("searchItems error:", error.message);
    return [];
  }

  return (data ?? []) as Item[];
}

export async function getProfileByUsername(username: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getItemsByAuthor(
  authorId: string,
  includeDrafts = false
): Promise<Item[]> {
  const supabase = await createClient();
  let query = supabase
    .from("items")
    .select("*")
    .eq("author_id", authorId)
    .order("created_at", { ascending: false });

  if (!includeDrafts) {
    query = query.eq("status", "published");
  }

  const { data, error } = await query;

  if (error) {
    console.error("getItemsByAuthor error:", error.message);
    return [];
  }

  return (data ?? []) as Item[];
}

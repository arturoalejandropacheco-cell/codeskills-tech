"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function submitItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const githubUrl = (formData.get("github_url") as string) || null;
  const language = (formData.get("language") as string) || "es";
  const tagsRaw = (formData.get("tags") as string) || "";
  const editors = formData.getAll("editors") as string[];

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 5);

  const slug = slugify(title);

  const { error } = await supabase.from("items").insert({
    title,
    slug,
    description,
    content,
    type,
    editors,
    tags,
    language,
    github_url: githubUrl,
    author_id: user.id,
    status: "draft",
  });

  if (error) {
    console.error("submitItem error:", error.message);
    redirect("/submit?error=submit_failed");
  }

  redirect("/?submitted=true");
}

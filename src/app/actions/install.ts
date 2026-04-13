"use server";

import { createClient } from "@/lib/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function trackInstall(itemId: string, _formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("installs").insert({
    item_id: itemId,
  });

  if (error) {
    console.error("trackInstall error:", error.message);
  }
}

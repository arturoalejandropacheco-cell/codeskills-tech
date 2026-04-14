/**
 * Publish a batch of items.
 * Usage: bunx tsx scripts/publish-batch.ts <batch-number>
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function main() {
  const batchNum = parseInt(process.argv[2], 10);
  if (isNaN(batchNum)) {
    console.error("Usage: bunx tsx scripts/publish-batch.ts <batch-number>");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: items, error: fetchError } = await supabase
    .from("items")
    .select("id, title")
    .eq("publish_batch", batchNum)
    .eq("status", "draft");

  if (fetchError || !items || items.length === 0) {
    console.error(`No items found for batch ${batchNum}`);
    process.exit(1);
  }

  const { error } = await supabase
    .from("items")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("publish_batch", batchNum);

  if (error) {
    console.error(`Error publishing batch: ${error.message}`);
    process.exit(1);
  }

  console.log(`\n✅ Lote ${batchNum} publicado:\n`);
  items.forEach((item) => console.log(`  - ${item.title}`));
  console.log(`\nTotal: ${items.length} items publicados.`);
}

main().catch(console.error);

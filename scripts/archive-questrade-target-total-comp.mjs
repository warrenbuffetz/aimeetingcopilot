#!/usr/bin/env node
/**
 * Archive "What is your target total compensation?" (keep "What are your compensation expectations?").
 *
 *   node scripts/archive-questrade-target-total-comp.mjs --apply
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const apply = process.argv.includes("--apply");

const ROW_ID = "fbb01b9e-858d-42cc-94d2-74d9f0c412d9";
const KEEP_CANONICAL = "What are your compensation expectations?";
const ANCHOR_IDS = [
  "28571e7f-620f-4880-9cd7-cdfc2e146aa8",
  "c1d638b6-1858-487d-9ac2-5b6cc5327eb8",
  "a3f8c2d1-6e7b-4a9c-8d0e-1f2a3b4c5d6e",
  "b8e9f0a1-2c3d-4e5f-6a7b-8c9d0e1f2a3b",
];

function loadEnv() {
  const path = resolve(root, "apps/web/.env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function stripId(ids, remove) {
  return (ids ?? []).filter((id) => id !== remove);
}

function syncRepoFiles() {
  const seedPath = resolve(root, "data/seed/questrade-interview-full.json");
  const metaPath = resolve(root, "data/migration/navigator-meta-by-question.json");
  const seed = JSON.parse(readFileSync(seedPath, "utf8"));
  seed.preparedQa = seed.preparedQa.filter((r) => r.id !== ROW_ID);
  writeFileSync(seedPath, JSON.stringify(seed, null, 2));

  const meta = JSON.parse(readFileSync(metaPath, "utf8"));
  delete meta["What is your target total compensation?"];
  writeFileSync(metaPath, JSON.stringify(meta, null, 2));
}

async function main() {
  const { data: row, error } = await admin.from("prepared_qa").select("*").eq("id", ROW_ID).maybeSingle();
  if (error) throw error;
  if (!row) {
    console.warn("Row not found in Supabase:", ROW_ID);
    syncRepoFiles();
    return;
  }

  const report = { apply, rowId: ROW_ID, question: row.question, anchorsPatched: [] };

  if (apply) {
    const meta = {
      ...(row.navigator_meta ?? {}),
      revisionStatus: "archived",
      retrievalExcluded: true,
      inactiveReason: "removed_duplicate_compensation",
      supersededByQuestion: KEEP_CANONICAL,
    };
    const { error: upErr } = await admin
      .from("prepared_qa")
      .update({ navigator_meta: meta, updated_at: new Date().toISOString() })
      .eq("id", ROW_ID);
    if (upErr) throw upErr;

    for (const anchorId of ANCHOR_IDS) {
      const { data: anchor } = await admin.from("prepared_qa").select("id, navigator_meta").eq("id", anchorId).maybeSingle();
      if (!anchor?.navigator_meta) continue;
      const related = stripId(anchor.navigator_meta.relatedQuestionIds, ROW_ID);
      if (related.length === (anchor.navigator_meta.relatedQuestionIds ?? []).length) continue;
      const { error: aErr } = await admin
        .from("prepared_qa")
        .update({
          navigator_meta: { ...anchor.navigator_meta, relatedQuestionIds: related },
          updated_at: new Date().toISOString(),
        })
        .eq("id", anchorId);
      if (aErr) throw aErr;
      report.anchorsPatched.push(anchorId);
    }

    await admin.from("prepared_qa_embeddings").delete().eq("prepared_qa_id", ROW_ID);
    syncRepoFiles();
  }

  const out = resolve(root, "data/migration/archive-target-total-comp-report.json");
  writeFileSync(out, JSON.stringify({ ...report, at: new Date().toISOString() }, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

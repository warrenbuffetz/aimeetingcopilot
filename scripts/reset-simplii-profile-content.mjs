#!/usr/bin/env node
/**
 * Remove all prepared Q&A (and embeddings) for Simplii profile only.
 * Questrade records are untouched.
 *
 * Usage: node scripts/reset-simplii-profile-content.mjs [--apply]
 */
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const QUESTRADE_PROFILE_ID = "f96f6db8-c0e9-4341-be68-c29f6975dc5e";
const SIMPLII_NAME = "Simplii Financial — Senior Product Manager";
const apply = process.argv.includes("--apply");

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

function rowHash(row) {
  return createHash("sha256")
    .update(JSON.stringify({ q: row.question, a: row.answer, m: row.navigator_meta, f: row.follow_ups }))
    .digest("hex");
}

async function main() {
  const { data: profiles } = await admin.from("interview_profiles").select("id, name").ilike("name", "%Simplii%");
  const simplii = profiles?.find((p) => p.name === SIMPLII_NAME);
  if (!simplii) {
    console.log("No Simplii profile found — nothing to reset.");
    return;
  }

  const { data: qBefore } = await admin.from("prepared_qa").select("*").eq("profile_id", QUESTRADE_PROFILE_ID);
  const questradeHashBefore = createHash("sha256")
    .update(qBefore.map((r) => rowHash(r)).sort().join("|"))
    .digest("hex");

  const { data: simpliiRows } = await admin.from("prepared_qa").select("id").eq("profile_id", simplii.id);
  const ids = (simpliiRows ?? []).map((r) => r.id);

  console.log({ simpliiProfileId: simplii.id, preparedQaToRemove: ids.length, apply });

  if (!apply) {
    console.log("Dry run. Pass --apply to delete Simplii Q&A only.");
    return;
  }

  if (ids.length) {
    await admin.from("prepared_qa_embeddings").delete().in("prepared_qa_id", ids);
    await admin.from("prepared_qa").delete().in("id", ids);
  }

  const { data: qAfter } = await admin.from("prepared_qa").select("*").eq("profile_id", QUESTRADE_PROFILE_ID);
  const questradeHashAfter = createHash("sha256")
    .update(qAfter.map((r) => rowHash(r)).sort().join("|"))
    .digest("hex");

  if (questradeHashAfter !== questradeHashBefore) {
    throw new Error("Questrade integrity check failed after Simplii reset");
  }

  const { count } = await admin
    .from("prepared_qa")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", simplii.id);

  console.log("Done. Simplii Q&A count:", count ?? 0, "Questrade unchanged.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

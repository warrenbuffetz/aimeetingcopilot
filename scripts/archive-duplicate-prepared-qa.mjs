#!/usr/bin/env node
/**
 * Archive duplicate active prepared_qa rows (same profile + same question text).
 * Keeps the strongest row; marks others superseded + retrievalExcluded.
 *
 *   node scripts/archive-duplicate-prepared-qa.mjs           # dry-run
 *   node scripts/archive-duplicate-prepared-qa.mjs --apply
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const apply = process.argv.includes("--apply");

const PROFILE_IDS = [
  "f96f6db8-c0e9-4341-be68-c29f6975dc5e",
  "1aff0813-6615-4a12-bfd6-ce7603604f6b",
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

function isInactive(meta) {
  if (!meta) return false;
  if (meta.retrievalExcluded) return true;
  return meta.revisionStatus === "superseded" || meta.revisionStatus === "archived";
}

function scoreRow(r) {
  let s = 0;
  if (r.is_preferred) s += 100;
  if (r.is_authoritative) s += 50;
  const tier = r.navigator_meta?.preparationTier;
  if (tier === "P0") s += 20;
  if (tier === "P1") s += 10;
  if (r.updated_at) s += new Date(r.updated_at).getTime() / 1e15;
  return s;
}

async function processProfile(profileId) {
  const { data: rows, error } = await admin.from("prepared_qa").select("*").eq("profile_id", profileId);
  if (error) throw error;

  const groups = new Map();
  for (const r of rows) {
    if (isInactive(r.navigator_meta)) continue;
    const k = r.question.trim().toLowerCase();
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  }

  const plan = [];
  for (const [key, list] of groups) {
    if (list.length < 2) continue;
    const sorted = [...list].sort((a, b) => scoreRow(b) - scoreRow(a));
    const keep = sorted[0];
    for (const drop of sorted.slice(1)) {
      plan.push({ question: keep.question, keepId: keep.id, archiveId: drop.id });
    }
  }
  return plan;
}

async function main() {
  const report = { at: new Date().toISOString(), apply, archived: [] };

  for (const profileId of PROFILE_IDS) {
    const plan = await processProfile(profileId);
    for (const { question, keepId, archiveId } of plan) {
      report.archived.push({ profileId, question, keepId, archiveId });
      if (!apply) continue;

      const { data: row } = await admin.from("prepared_qa").select("navigator_meta").eq("id", archiveId).single();
      const meta = { ...(row?.navigator_meta ?? {}), revisionStatus: "superseded", retrievalExcluded: true };
      meta.supersededByPreparedQaId = keepId;
      meta.inactiveReason = "duplicate_question_archived";

      const { error } = await admin.from("prepared_qa").update({ navigator_meta: meta }).eq("id", archiveId);
      if (error) throw error;
    }
  }

  const out = resolve(root, "data/migration/duplicate-qa-archive-report.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(apply ? "Applied" : "Dry-run", "— archive", report.archived.length, "rows");
  console.log(out);
  for (const a of report.archived) {
    console.log(`  [${a.profileId.slice(0, 8)}] ${a.question.slice(0, 60)}… keep ${a.keepId} archive ${a.archiveId}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

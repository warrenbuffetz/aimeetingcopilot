#!/usr/bin/env node
/**
 * QA checks for OpenTable profile isolation and content hygiene.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const QUESTRADE_PROFILE_ID = "f96f6db8-c0e9-4341-be68-c29f6975dc5e";
const SIMPLII_PROFILE_ID = "1aff0813-6615-4a12-bfd6-ce7603604f6b";
const OPENTABLE_NAME =
  "OpenTable — Senior Product Manager, Restaurant Product (AI/ML Revenue Optimization)";

const FORBIDDEN = /\b(questbank|temenos|questrade flows|brokerage-to-banking|investing-to-banking)\b/i;

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

function rowHash(row) {
  return createHash("sha256")
    .update(JSON.stringify({ q: row.question, a: row.answer, m: row.navigator_meta, f: row.follow_ups }))
    .digest("hex");
}

async function main() {
  const { data: qRows, error: qErr } = await admin.from("prepared_qa").select("*").eq("profile_id", QUESTRADE_PROFILE_ID);
  if (qErr) throw new Error(`Questrade fetch failed: ${qErr.message}`);
  const qHash = createHash("sha256").update(qRows.map((r) => rowHash(r)).sort().join("|")).digest("hex");

  const { data: sRows } = await admin.from("prepared_qa").select("*").eq("profile_id", SIMPLII_PROFILE_ID);
  const sHash = createHash("sha256").update((sRows ?? []).map((r) => rowHash(r)).sort().join("|")).digest("hex");

  const { data: profiles } = await admin
    .from("interview_profiles")
    .select("id, name")
    .ilike("name", "%OpenTable%");
  const opentable = profiles?.find((p) => p.name === OPENTABLE_NAME);
  if (!opentable) throw new Error("OpenTable profile not found");

  const { data: oRows } = await admin.from("prepared_qa").select("*").eq("profile_id", opentable.id);
  const active = (oRows ?? []).filter((r) => !isInactive(r.navigator_meta));

  const forbiddenHits = [];
  for (const r of active) {
    const text = `${r.question}\n${r.answer}\n${JSON.stringify(r.follow_ups)}`;
    if (FORBIDDEN.test(text)) {
      forbiddenHits.push({ id: r.id, question: r.question, match: text.match(FORBIDDEN)?.[0] });
    }
  }

  const predictionsPath = resolve(root, "data/review/opentable_question_predictions.json");
  let predictionsInDb = 0;
  if (existsSync(predictionsPath)) {
    const preds = JSON.parse(readFileSync(predictionsPath, "utf8"));
    const predQuestions = new Set(preds.rankedPredictions.map((p) => p.canonicalQuestion.trim().toLowerCase()));
    for (const r of active) {
      if (predQuestions.has(r.question.trim().toLowerCase())) predictionsInDb++;
    }
  }

  const report = {
    at: new Date().toISOString(),
    questradeRowCount: qRows?.length ?? 0,
    simpliiRowCount: sRows?.length ?? 0,
    opentable: {
      profileId: opentable.id,
      totalRows: oRows?.length ?? 0,
      activeRows: active.length,
      forbiddenTermHits: forbiddenHits.length,
      unapprovedPredictionsImportedAsPreparedQa: predictionsInDb,
      p0Count: active.filter((r) => r.navigator_meta?.preparationTier === "P0" || r.is_preferred).length,
    },
    integrityHashes: {
      questrade: qHash,
      simplii: sHash,
    },
    forbiddenHits: forbiddenHits.slice(0, 20),
  };

  const out = resolve(root, "docs/opentable-profile-validation.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log("Wrote", out);
  console.log(report.opentable);
  if (report.opentable.forbiddenTermHits > 0 || report.opentable.unapprovedPredictionsImportedAsPreparedQa > 0) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * QA checks for Simplii profile isolation and content hygiene.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const QUESTRADE_PROFILE_ID = "f96f6db8-c0e9-4341-be68-c29f6975dc5e";
const SIMPLII_NAME = "Simplii Financial — Senior Product Manager";

const FORBIDDEN = /\b(questbank|temenos|questrade flows|brokerage-to-banking|investing-to-banking)\b/i;
const QUESTRADE_BRAND = /\bquestrade\b/i;

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
  const qtBaselinePath = resolve(root, "data/migration/baselines/questrade-pre-cross-panel.json");
  const auditPath = resolve(root, "data/migration/simplii-clone-audit.json");
  const baselineHash = existsSync(qtBaselinePath)
    ? JSON.parse(readFileSync(qtBaselinePath, "utf8")).hash
    : existsSync(auditPath)
      ? JSON.parse(readFileSync(auditPath, "utf8")).questradeIntegrityHash
      : null;

  const { data: qRows, error: qErr } = await admin.from("prepared_qa").select("*").eq("profile_id", QUESTRADE_PROFILE_ID);
  if (qErr) throw new Error(`Questrade fetch failed: ${qErr.message}`);
  if (!qRows?.length) throw new Error("Questrade prepared_qa rows missing (check Supabase credentials)");
  const qHash = createHash("sha256").update(qRows.map((r) => rowHash(r)).sort().join("|")).digest("hex");

  const { data: profiles } = await admin.from("interview_profiles").select("id, name").ilike("name", "%Simplii%");
  const simplii = profiles?.find((p) => p.name === SIMPLII_NAME);
  if (!simplii) throw new Error("Simplii profile not found");

  const { data: sRows } = await admin.from("prepared_qa").select("*").eq("profile_id", simplii.id);
  const active = sRows.filter((r) => !isInactive(r.navigator_meta));

  const questions = new Map();
  const dupes = [];
  for (const r of active) {
    const k = r.question.trim().toLowerCase();
    if (questions.has(k)) dupes.push({ a: questions.get(k), b: r.id, question: r.question });
    else questions.set(k, r.id);
  }

  const forbiddenHits = [];
  for (const r of active) {
    const text = `${r.question}\n${r.answer}\n${JSON.stringify(r.follow_ups)}`;
    if (FORBIDDEN.test(text)) {
      forbiddenHits.push({ id: r.id, question: r.question, match: text.match(FORBIDDEN)?.[0] });
    }
    if (QUESTRADE_BRAND.test(text)) {
      forbiddenHits.push({ id: r.id, question: r.question, match: "Questrade" });
    }
  }

  const cloneIds = new Set(active.map((r) => r.navigator_meta?.cloneSourceQuestradeId).filter(Boolean));
  const p0 = active.filter((r) => r.navigator_meta?.preparationTier === "P0" || r.is_preferred);

  const report = {
    at: new Date().toISOString(),
    questradeIntegrity: {
      baselineHash,
      currentHash: qHash,
      unchanged: baselineHash ? baselineHash === qHash : "no_baseline",
      rowCount: qRows.length,
    },
    simplii: {
      profileId: simplii.id,
      totalRows: sRows.length,
      activeRows: active.length,
      duplicateActiveQuestions: dupes.length,
      forbiddenTermHits: forbiddenHits.length,
      withCloneSourceId: cloneIds.size,
      p0Count: p0.length,
    },
    forbiddenHits: forbiddenHits.slice(0, 50),
    duplicateSamples: dupes.slice(0, 20),
    p0Questions: p0.map((r) => ({ question: r.question, tier: r.navigator_meta?.preparationTier })),
  };

  const out = resolve(root, "docs/simplii-profile-validation.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log("Wrote", out);
  console.log(report.simplii);
  if (report.simplii.forbiddenTermHits > 0 || report.simplii.duplicateActiveQuestions > 0) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

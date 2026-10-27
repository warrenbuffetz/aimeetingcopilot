#!/usr/bin/env node
/**
 * Bidirectional Q&A isolation: Questrade must not contain Simplii-specific content;
 * Simplii must not contain Questrade-specific content.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const QUESTRADE_PROFILE_ID = "f96f6db8-c0e9-4341-be68-c29f6975dc5e";
const QUESTRADE_NAME = "Questrade — Senior PM, Everyday Banking";
const SIMPLII_NAME = "Simplii Financial — Senior Product Manager";

const SIMPLII_IN_QUESTRADE = /\b(simplii(?:\s+financial)?|simplii-jd)\b/i;
const QUESTRADE_IN_SIMPLII =
  /\b(questrade|questbank|temenos|brokerage-to-banking|investing-to-banking|questrade flows)\b/i;

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

function rowText(row) {
  const meta = row.navigator_meta ?? {};
  return [
    row.question,
    row.answer,
    JSON.stringify(row.follow_ups ?? []),
    meta.importKey,
    meta.sourceFile,
    meta.canonicalQuestion,
    JSON.stringify(meta.altPhrasings ?? []),
    JSON.stringify(meta.topicTags ?? []),
    row.notes,
  ]
    .filter(Boolean)
    .join("\n");
}

function scanRows(rows, pattern, label) {
  const hits = [];
  for (const r of rows) {
    if (isInactive(r.navigator_meta)) continue;
    const text = rowText(r);
    const m = text.match(pattern);
    if (m) {
      hits.push({
        id: r.id,
        question: r.question,
        match: m[0],
        importKey: r.navigator_meta?.importKey,
      });
    }
  }
  return hits;
}

function duplicateQuestions(activeRows) {
  const map = new Map();
  const dupes = [];
  for (const r of activeRows) {
    const k = r.question.trim().toLowerCase();
    if (map.has(k)) dupes.push({ question: r.question, ids: [map.get(k), r.id] });
    else map.set(k, r.id);
  }
  return dupes;
}

async function main() {
  const { data: profiles } = await admin.from("interview_profiles").select("id, name");
  const questrade = profiles?.find((p) => p.id === QUESTRADE_PROFILE_ID || p.name === QUESTRADE_NAME);
  const simplii = profiles?.find((p) => p.name === SIMPLII_NAME);
  if (!questrade || !simplii) throw new Error("Missing Questrade or Simplii profile");

  const { data: qRows } = await admin.from("prepared_qa").select("*").eq("profile_id", questrade.id);
  const { data: sRows } = await admin.from("prepared_qa").select("*").eq("profile_id", simplii.id);

  const qActive = qRows.filter((r) => !isInactive(r.navigator_meta));
  const sActive = sRows.filter((r) => !isInactive(r.navigator_meta));

  const simpliiInQuestrade = scanRows(qRows, SIMPLII_IN_QUESTRADE, "simplii_in_questrade");
  const questradeInSimplii = scanRows(sRows, QUESTRADE_IN_SIMPLII, "questrade_in_simplii");

  const wrongProfile = [];
  for (const r of qRows ?? []) {
    if (r.profile_id !== questrade.id) wrongProfile.push({ side: "questrade_query", id: r.id, profile_id: r.profile_id });
  }
  for (const r of sRows ?? []) {
    if (r.profile_id !== simplii.id) wrongProfile.push({ side: "simplii_query", id: r.id, profile_id: r.profile_id });
  }

  const crossProfileIds = [];
  const qIds = new Set(qRows.map((r) => r.id));
  for (const r of sActive) {
    const meta = r.navigator_meta ?? {};
    if (meta.cloneSourceQuestradeId && qIds.has(meta.cloneSourceQuestradeId)) {
      crossProfileIds.push({ simpliiId: r.id, cloneSourceQuestradeId: meta.cloneSourceQuestradeId });
    }
  }

  const report = {
    at: new Date().toISOString(),
    questrade: {
      profileId: questrade.id,
      totalRows: qRows.length,
      activeRows: qActive.length,
      simpliiTermHits: simpliiInQuestrade.length,
      duplicateActiveQuestions: duplicateQuestions(qActive).length,
    },
    simplii: {
      profileId: simplii.id,
      totalRows: sRows.length,
      activeRows: sActive.length,
      questradeTermHits: questradeInSimplii.length,
      duplicateActiveQuestions: duplicateQuestions(sActive).length,
    },
    simpliiInQuestrade: simpliiInQuestrade.slice(0, 100),
    questradeInSimplii: questradeInSimplii.slice(0, 100),
    wrongProfileRows: wrongProfile,
    simpliiCloneSourceLinks: crossProfileIds.length,
    simpliiDuplicateSamples: duplicateQuestions(sActive).slice(0, 20),
    questradeDuplicateSamples: duplicateQuestions(qActive).slice(0, 20),
  };

  const out = resolve(root, "data/migration/profile-isolation-audit.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log("Wrote", out);
  console.log(
    `Questrade: ${report.questrade.simpliiTermHits} Simplii hits, ${report.questrade.duplicateActiveQuestions} dupes`
  );
  console.log(
    `Simplii: ${report.simplii.questradeTermHits} Questrade hits, ${report.simplii.duplicateActiveQuestions} dupes`
  );

  const fail =
    simpliiInQuestrade.length > 0 ||
    questradeInSimplii.length > 0 ||
    wrongProfile.length > 0 ||
    report.simplii.duplicateActiveQuestions > 0 ||
    report.questrade.duplicateActiveQuestions > 0;

  if (fail) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

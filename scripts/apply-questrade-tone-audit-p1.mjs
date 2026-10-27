#!/usr/bin/env node
/**
 * Pass 2: Questrade tone audit P1 (33 rows) — spoken variants + light answer trims.
 *
 *   node scripts/apply-questrade-tone-audit-p1.mjs --dry-run
 *   node scripts/apply-questrade-tone-audit-p1.mjs --apply
 *   node scripts/apply-questrade-tone-audit-p1.mjs --apply --embed
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { SPOKEN_OVERRIDES, ANSWER_OVERRIDES } from "./questrade-tone-audit-p1-spoken-overrides.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const apply = process.argv.includes("--apply");
const dryRun = !apply || process.argv.includes("--dry-run");
const runEmbed = process.argv.includes("--embed");

const AUDIT_PATH =
  process.env.QUESTRADE_TONE_AUDIT_JSON ??
  "/Users/johnlee/Downloads/Questrade_Tone_Audit_Complete_Package/Questrade_Tone_Audit_318_Records.json";
const PATCHES_PATH = resolve(root, "data/review/questrade-tone-audit-p1-patches.json");

/** Audit JSON typos → live prepared_qa IDs */
const ID_ALIASES = {
  "be18eb7a-948b-4a5c-8c5c-4d69faaa418e": "be18eb7a-948b-4a5d-8c5c-4d69faaa418e",
};

function shortFrom(text, max = 320) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

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

function buildPatchMap() {
  const audit = JSON.parse(readFileSync(AUDIT_PATH, "utf8"));
  const p1 = audit.records.filter((r) => r.priority === "P1");
  const fromFile = existsSync(PATCHES_PATH) ? JSON.parse(readFileSync(PATCHES_PATH, "utf8")) : {};
  const map = new Map();

  for (const r of p1) {
    const liveId = ID_ALIASES[r.id] ?? r.id;
    const spoken =
      r.proposedSpokenVariant ??
      SPOKEN_OVERRIDES[liveId] ??
      SPOKEN_OVERRIDES[r.id] ??
      fromFile[r.id]?.spokenAnswer;
    if (!spoken) {
      throw new Error(`Missing spoken variant for P1 row ${r.id}`);
    }
    map.set(liveId, {
      auditId: r.id,
      spokenAnswer: spoken,
      protect: Boolean(r.signedOffProtect),
      answerOverride: ANSWER_OVERRIDES[liveId] ?? ANSWER_OVERRIDES[r.id],
      reembed: Boolean(ANSWER_OVERRIDES[liveId] ?? ANSWER_OVERRIDES[r.id]),
    });
  }
  if (map.size !== 33) throw new Error(`Expected 33 P1 patches, got ${map.size}`);
  return map;
}

function syncSeedAnswer(question, answer) {
  const seedPath = resolve(root, "data/seed/questrade-interview-full.json");
  if (!existsSync(seedPath)) return false;
  const seed = JSON.parse(readFileSync(seedPath, "utf8"));
  const row = seed.preparedQa?.find((r) => r.question?.trim() === question?.trim());
  if (!row) return false;
  row.answer = answer;
  writeFileSync(seedPath, JSON.stringify(seed, null, 2));
  return true;
}

function syncMetaByQuestion(question, patch) {
  const metaPath = resolve(root, "data/migration/navigator-meta-by-question.json");
  if (!existsSync(metaPath)) return;
  const meta = JSON.parse(readFileSync(metaPath, "utf8"));
  const key = question.trim();
  meta[key] = { ...(meta[key] ?? {}), ...patch };
  writeFileSync(metaPath, JSON.stringify(meta, null, 2));
}

async function fetchRow(id) {
  const { data, error } = await admin.from("prepared_qa").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

async function main() {
  const patchMap = buildPatchMap();
  const report = {
    at: new Date().toISOString(),
    mode: dryRun ? "dry-run" : "apply",
    count: patchMap.size,
    actions: [],
    embedIds: [],
    missing: [],
  };

  for (const [id, patch] of patchMap) {
    const row = await fetchRow(id);
    if (!row) {
      report.missing.push(id);
      continue;
    }

    const meta = {
      ...(row.navigator_meta ?? {}),
      spokenAnswer: patch.spokenAnswer,
      shortAnswer: shortFrom(patch.spokenAnswer, 320),
      toneAuditP1: patch.protect ? "spoken_only_signed_off" : "spoken_polish",
    };

    const update = { navigator_meta: meta, updated_at: new Date().toISOString() };
    if (patch.answerOverride && !patch.protect) {
      update.answer = patch.answerOverride;
      report.embedIds.push(id);
    }

    report.actions.push({
      id,
      auditId: patch.auditId,
      question: row.question,
      protect: patch.protect,
      answerUpdated: Boolean(update.answer),
    });

    if (!dryRun) {
      const { error } = await admin.from("prepared_qa").update(update).eq("id", id);
      if (error) throw error;
      if (update.answer) syncSeedAnswer(row.question, update.answer);
      syncMetaByQuestion(row.question, meta);
    }
  }

  const outDir = resolve(root, "data/review");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "questrade-tone-audit-p1-apply-report.json"), JSON.stringify(report, null, 2));

  if (runEmbed && !dryRun && report.embedIds.length) {
    const unique = [...new Set(report.embedIds)];
    await new Promise((resolvePromise, reject) => {
      const child = spawn("node", [resolve(root, "scripts/embed-qa-gte.mjs")], {
        env: { ...process.env, EMBED_QA_IDS: unique.join(",") },
        stdio: "inherit",
      });
      child.on("exit", (code) => (code === 0 ? resolvePromise() : reject(new Error(`embed exited ${code}`))));
    });
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

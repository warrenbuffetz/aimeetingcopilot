#!/usr/bin/env node
/**
 * Import Questrade audit hypothetical probes (trade timeout, handover artifacts).
 *
 *   node scripts/import-questrade-audit-probes.mjs --dry-run
 *   node scripts/import-questrade-audit-probes.mjs --apply
 *   node scripts/import-questrade-audit-probes.mjs --apply --embed
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import { spawn } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const PACK = resolve(root, "imports/questrade_audit_probes_qa.json");

const apply = process.argv.includes("--apply");
const dryRun = !apply || process.argv.includes("--dry-run");
const runEmbed = process.argv.includes("--embed");

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

function buildNavigatorMeta(rec, relatedIds) {
  const section =
    rec.experienceModuleId === "questrade-mcp" ? "product_banking_knowledge" : "career_motivation";
  return {
    librarySection: section,
    libraryCategory: section === "product_banking_knowledge" ? "product_banking" : "career_recruiter",
    experienceModuleId: rec.experienceModuleId ?? "career-general",
    experienceLabel: rec.experienceLabel ?? "Career & Motivation",
    intent: "general",
    evidenceStatus: "rehearsal_framework",
    reviewStatus: "ok",
    revisionStatus: "current",
    topicTags: ["audit-probe", rec.category],
    altPhrasings: rec.altPhrasings ?? [],
    roundRelevance: rec.roundRelevance,
    importKey: rec.importKey,
    sourceFile: "imports/questrade_audit_probes_qa.json",
    relatedQuestionIds: relatedIds,
    canonicalQuestion: rec.question,
  };
}

function mergeRelated(existing, addIds) {
  const set = new Set(existing ?? []);
  for (const id of addIds) if (id) set.add(id);
  return [...set];
}

function syncRepoSeedAndMeta(pack, idsByImportKey) {
  const seedPath = resolve(root, "data/seed/questrade-interview-full.json");
  const metaPath = resolve(root, "data/migration/navigator-meta-by-question.json");
  const seed = JSON.parse(readFileSync(seedPath, "utf8"));
  const meta = JSON.parse(readFileSync(metaPath, "utf8"));

  for (const rec of pack.records) {
    const id = idsByImportKey[rec.importKey];
    const q = rec.question.trim();
    let row = seed.preparedQa.find((x) => x.question?.trim() === q);
    if (!row) {
      row = { id, question: rec.question, answer: rec.answer, category: rec.category };
      seed.preparedQa.push(row);
    } else {
      row.id = id;
      row.answer = rec.answer;
      row.category = rec.category;
    }
    meta[q] = {
      ...(meta[q] ?? {}),
      ...buildNavigatorMeta(rec, pack.relatedQuestionIdsOnNewRecords ?? []),
    };
  }

  writeFileSync(seedPath, JSON.stringify(seed, null, 2));
  writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  console.log("Synced seed + navigator-meta-by-question for", pack.records.length, "records");
}

async function main() {
  const pack = JSON.parse(readFileSync(PACK, "utf8"));
  const seedEmail = process.env.SEED_USER_EMAIL ?? "poc-demo@interviewcopilot.app";

  const { data: users } = await admin.auth.admin.listUsers({ perPage: 200 });
  const user = users.users.find((u) => u.email === seedEmail);
  if (!user) throw new Error(`User not found: ${seedEmail}`);

  const { data: profiles } = await admin
    .from("interview_profiles")
    .select("id, name")
    .eq("user_id", user.id);
  const profile = profiles?.find((p) => p.name === pack.profileName);
  if (!profile) throw new Error(`Profile not found: ${pack.profileName}`);

  const { data: existingRows } = await admin
    .from("prepared_qa")
    .select("id, question, navigator_meta")
    .eq("profile_id", profile.id);

  const byQuestion = new Map(existingRows.map((r) => [r.question.trim().toLowerCase(), r]));
  const byImportKey = new Map();
  for (const r of existingRows) {
    const ik = r.navigator_meta?.importKey;
    if (ik) byImportKey.set(ik, r);
  }

  const report = {
    at: new Date().toISOString(),
    apply: apply && !dryRun,
    inserted: [],
    updated: [],
    skipped: [],
    relationships: [],
    ids: {},
  };

  const relatedOnNew = pack.relatedQuestionIdsOnNewRecords ?? [];
  const idByImportKey = new Map();

  for (const rec of pack.records) {
    let row = byImportKey.get(rec.importKey) ?? byQuestion.get(rec.question.trim().toLowerCase());
    const meta = buildNavigatorMeta(rec, relatedOnNew);

    if (row) {
      report.updated.push({ id: row.id, question: rec.question, importKey: rec.importKey });
      idByImportKey.set(rec.importKey, row.id);
      if (apply && !dryRun) {
        const { error } = await admin
          .from("prepared_qa")
          .update({
            question: rec.question,
            answer: rec.answer,
            category: rec.category,
            is_preferred: rec.isPreferred ?? false,
            navigator_meta: { ...(row.navigator_meta ?? {}), ...meta },
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);
        if (error) throw error;
      }
      continue;
    }

    const newId = rec.presetId ?? randomUUID();
    idByImportKey.set(rec.importKey, newId);
    report.inserted.push({ id: newId, question: rec.question, importKey: rec.importKey });
    if (apply && !dryRun) {
      const { error } = await admin.from("prepared_qa").insert({
        id: newId,
        user_id: user.id,
        profile_id: profile.id,
        question: rec.question,
        answer: rec.answer,
        category: rec.category,
        is_preferred: rec.isPreferred ?? false,
        is_authoritative: true,
        follow_ups: [],
        navigator_meta: meta,
      });
      if (error) throw error;
    }
  }

  for (const rec of pack.records) {
    report.ids[rec.importKey] = idByImportKey.get(rec.importKey);
  }

  const probeIds = pack.records.map((r) => idByImportKey.get(r.importKey)).filter(Boolean);

  for (const link of pack.appendRelatedOnAnchors ?? []) {
    const anchor = existingRows.find((r) => r.question.trim() === link.anchorQuestion.trim());
    if (!anchor) {
      report.skipped.push({ anchor: link.anchorQuestion, reason: "anchor_not_found" });
      continue;
    }
    const addIds = link.appendRelatedImportKeys
      .map((k) => idByImportKey.get(k) ?? byImportKey.get(k)?.id)
      .filter(Boolean);
    const merged = mergeRelated(anchor.navigator_meta?.relatedQuestionIds, addIds);
    report.relationships.push({ anchorId: anchor.id, anchor: link.anchorQuestion, added: addIds.length });
    if (apply && !dryRun) {
      const { error } = await admin
        .from("prepared_qa")
        .update({
          navigator_meta: { ...(anchor.navigator_meta ?? {}), relatedQuestionIds: merged },
          updated_at: new Date().toISOString(),
        })
        .eq("id", anchor.id);
      if (error) throw error;
    }
  }

  if (apply && !dryRun) {
    syncRepoSeedAndMeta(pack, report.ids);
  }

  mkdirSync(resolve(root, "data/migration"), { recursive: true });
  const out = resolve(root, "data/migration/questrade-audit-probes-import-report.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.log("Wrote", out);

  if (apply && !dryRun && runEmbed && probeIds.length) {
    await new Promise((resolvePromise, reject) => {
      const child = spawn("node", [resolve(root, "scripts/embed-qa-gte.mjs")], {
        env: { ...process.env, EMBED_QA_IDS: probeIds.join(",") },
        stdio: "inherit",
      });
      child.on("exit", (code) => (code === 0 ? resolvePromise() : reject(new Error(`embed exited ${code}`))));
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

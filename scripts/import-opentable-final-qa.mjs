#!/usr/bin/env node
/**
 * Import externally authored OpenTable Q&A (verbatim).
 *
 * Usage:
 *   node scripts/import-opentable-final-qa.mjs [path]              # dry-run
 *   node scripts/import-opentable-final-qa.mjs [path] --apply      # commit
 *   node scripts/import-opentable-final-qa.mjs [path] --apply --embed
 *
 * Default path: imports/opentable_final_qa.json
 */
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { validateImportPackage, normQ } from "./lib/validate-interview-qa-import.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const QUESTRADE_PROFILE_ID = "f96f6db8-c0e9-4341-be68-c29f6975dc5e";
const SIMPLII_PROFILE_ID = "1aff0813-6615-4a12-bfd6-ce7603604f6b";
const DEFAULT_PROFILE_NAME =
  "OpenTable — Senior Product Manager, Restaurant Product (AI/ML Revenue Optimization)";
const DEFAULT_INPUT = resolve(root, "imports/opentable_final_qa.json");

const apply = process.argv.includes("--apply");
const embed = process.argv.includes("--embed");
const positional = process.argv.slice(2).filter((a) => !a.startsWith("--") && !a.includes("="));
const inputPath = positional[0]
  ? resolve(root, positional[0])
  : DEFAULT_INPUT;
const profileNameArg = process.argv.find((a) => a.startsWith("--profile-name="));
const profileName = profileNameArg ? profileNameArg.split("=")[1] : DEFAULT_PROFILE_NAME;

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

const seedEmail = process.env.SEED_USER_EMAIL ?? "poc-demo@interviewcopilot.app";

function rowHash(row) {
  return createHash("sha256")
    .update(JSON.stringify({ q: row.question, a: row.answer, m: row.navigator_meta, f: row.follow_ups }))
    .digest("hex");
}

function buildNavigatorMeta(rec, externalIdToUuid) {
  const topicTags = [...(rec.topicTags ?? [])];
  if (rec.preparationTier && !topicTags.includes(rec.preparationTier)) topicTags.push(rec.preparationTier);

  const relatedQuestionIds = (rec.relatedExternalIds ?? [])
    .map((eid) => externalIdToUuid.get(eid))
    .filter(Boolean);

  const meta = {
    importKey: rec.externalId,
    externalContentId: rec.externalId,
    adaptationType: rec.adaptationType,
    sourceQuestradeRecordId: rec.sourceQuestradeRecordId ?? undefined,
    librarySection: rec.librarySection,
    libraryCategory: rec.libraryCategory,
    experienceModuleId: rec.experienceModuleId,
    experienceLabel: rec.experienceLabel,
    intent: rec.questionIntent ?? "general",
    evidenceStatus: rec.evidenceStatus ?? "resume_supported",
    altPhrasings: rec.aliases ?? [],
    topicTags,
    keywords: rec.keywords ?? [],
    relatedQuestionIds,
    roundRelevance: rec.roundRelevance,
    panelDiscipline: rec.panelDiscipline,
    spokenAnswer: rec.spokenAnswer,
    shortAnswer: rec.shortAnswer,
    revisionStatus: rec.revisionStatus ?? "current",
    retrievalExcluded: rec.retrievalExcluded ?? false,
    reviewStatus: rec.reviewRequired ? "needs_review" : rec.reviewStatus ?? "ok",
    preparationTier: rec.preparationTier,
    primaryInterviewRound: rec.primaryInterviewRound,
    sourceFile: rec.sourceFile ?? inputPath,
  };

  if (rec.profileExclusive) meta.profileExclusive = rec.profileExclusive;
  if (rec.employerClosing) meta.employerClosing = rec.employerClosing;
  if (rec.reviewNotes) meta.reviewNotes = rec.reviewNotes;
  if (rec.notes) meta.authorNotes = rec.notes;
  if (rec.supersededByExternalId) {
    meta.supersededByExternalId = rec.supersededByExternalId;
    const supUuid = externalIdToUuid.get(rec.supersededByExternalId);
    if (supUuid) meta.supersededByPreparedQaId = supUuid;
  }

  return meta;
}

async function findUserId() {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;
  const user = data.users.find((u) => u.email === seedEmail) ?? data.users[0];
  if (!user) throw new Error("No user found");
  return user.id;
}

async function resolveProfile(userId, pkg) {
  const name = pkg.targetProfile?.name ?? profileName;
  if (pkg.targetProfile?.id) {
    const { data } = await admin
      .from("interview_profiles")
      .select("id, name")
      .eq("id", pkg.targetProfile.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (data) return data;
  }
  const { data, error } = await admin
    .from("interview_profiles")
    .select("id, name")
    .eq("user_id", userId)
    .eq("name", name)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error(`Target profile not found: ${name}. Run: node scripts/ensure-opentable-profile.mjs`);
  return data;
}

function semanticDuplicateWarnings(records, existingActive) {
  const warnings = [];
  const existingNorm = new Map();
  for (const r of existingActive) {
    const n = normQ(r.question);
    if (!existingNorm.has(n)) existingNorm.set(n, r.id);
  }
  const importNorm = new Map();
  for (const rec of records) {
    const n = normQ(rec.canonicalQuestion);
    if (importNorm.has(n)) {
      warnings.push({
        type: "duplicate_in_import",
        normalizedQuestion: n,
        externalIds: [importNorm.get(n), rec.externalId],
      });
    } else importNorm.set(n, rec.externalId);
    if (existingNorm.has(n)) {
      warnings.push({
        type: "duplicate_vs_existing",
        normalizedQuestion: n,
        externalId: rec.externalId,
        existingId: existingNorm.get(n),
      });
    }
  }
  return warnings;
}

async function main() {
  if (!existsSync(inputPath)) {
    console.error(`Import file not found: ${inputPath}`);
    console.error("Place ChatGPT-authored package at imports/opentable_final_qa.json");
    process.exit(1);
  }

  const pkg = JSON.parse(readFileSync(inputPath, "utf8"));
  const validation = validateImportPackage(pkg);
  const report = {
    at: new Date().toISOString(),
    mode: apply ? "apply" : "dry-run",
    inputPath,
    validation,
    actions: { insert: 0, update: 0, skipped: 0 },
    relationshipIssues: [],
    semanticDuplicates: [],
    questradeIntegrity: null,
    simpliiIntegrity: null,
  };

  if (!validation.valid) {
    mkdirSync(resolve(root, "data/migration"), { recursive: true });
    const out = resolve(root, "data/migration/opentable-final-import-report.json");
    writeFileSync(out, JSON.stringify(report, null, 2));
    console.error("Validation failed. See", out);
    validation.errors.forEach((e) => console.error(`  ${e.path}: ${e.message}`));
    process.exit(1);
  }

  const userId = await findUserId();
  const profile = await resolveProfile(userId, pkg);

  if (profile.name !== (pkg.targetProfile?.name ?? profileName) && !pkg.targetProfile?.id) {
    report.relationshipIssues.push({
      type: "profile_name_mismatch",
      expected: pkg.targetProfile?.name,
      resolved: profile.name,
    });
  }

  const { data: qBefore } = await admin.from("prepared_qa").select("*").eq("profile_id", QUESTRADE_PROFILE_ID);
  const { data: sBefore } = await admin.from("prepared_qa").select("*").eq("profile_id", SIMPLII_PROFILE_ID);
  const questradeHashBefore = createHash("sha256")
    .update(qBefore.map((r) => rowHash(r)).sort().join("|"))
    .digest("hex");
  const simpliiHashBefore = createHash("sha256")
    .update((sBefore ?? []).map((r) => rowHash(r)).sort().join("|"))
    .digest("hex");

  const { data: existingRows } = await admin
    .from("prepared_qa")
    .select("id, question, navigator_meta")
    .eq("profile_id", profile.id);

  const byImportKey = new Map();
  for (const r of existingRows ?? []) {
    const key = r.navigator_meta?.importKey ?? r.navigator_meta?.externalContentId;
    if (key) byImportKey.set(key, r.id);
  }

  const activeExisting = (existingRows ?? []).filter(
    (r) => !(r.navigator_meta?.revisionStatus === "superseded" || r.navigator_meta?.revisionStatus === "archived")
  );
  report.semanticDuplicates = semanticDuplicateWarnings(pkg.records, activeExisting);

  const externalIdToUuid = new Map();
  for (const rec of pkg.records) {
    if (byImportKey.has(rec.externalId)) externalIdToUuid.set(rec.externalId, byImportKey.get(rec.externalId));
  }

  for (const rec of pkg.records) {
    const existingId = byImportKey.get(rec.externalId);
    if (existingId) {
      report.actions.update++;
    } else {
      report.actions.insert++;
    }
  }

  if (!apply) {
    mkdirSync(resolve(root, "data/migration"), { recursive: true });
    const out = resolve(root, "data/migration/opentable-final-import-report.json");
    writeFileSync(out, JSON.stringify(report, null, 2));
    console.log("Dry run OK.", report.actions);
    if (validation.warnings.length) console.log("Warnings:", validation.warnings.length);
    if (report.semanticDuplicates.length) console.log("Semantic duplicates:", report.semanticDuplicates.length);
    console.log("Report:", out);
    return;
  }

  // Pass 1: upsert all records (verbatim text)
  for (const rec of pkg.records) {
    const follow_ups = (rec.followUps ?? []).map((fu) => ({
      question: fu.question,
      answer: fu.answer,
      notes: fu.notes ?? undefined,
    }));

    const payload = {
      user_id: userId,
      profile_id: profile.id,
      question: rec.canonicalQuestion,
      answer: rec.answer,
      category: rec.category ?? null,
      is_preferred: rec.isPreferred ?? false,
      is_authoritative: rec.isAuthoritative ?? true,
      follow_ups,
      navigator_meta: buildNavigatorMeta(rec, externalIdToUuid),
      updated_at: new Date().toISOString(),
    };

    const existingId = byImportKey.get(rec.externalId);
    if (existingId) {
      const { error } = await admin.from("prepared_qa").update(payload).eq("id", existingId);
      if (error) throw error;
      externalIdToUuid.set(rec.externalId, existingId);
    } else {
      const { data, error } = await admin.from("prepared_qa").insert(payload).select("id").single();
      if (error) throw error;
      externalIdToUuid.set(rec.externalId, data.id);
      byImportKey.set(rec.externalId, data.id);
    }
  }

  // Pass 2: parent / related links (UUIDs now known)
  for (const rec of pkg.records) {
    const id = externalIdToUuid.get(rec.externalId);
    if (!id) continue;
    const meta = buildNavigatorMeta(rec, externalIdToUuid);
    if (rec.parentExternalId) {
      const parentId = externalIdToUuid.get(rec.parentExternalId);
      if (!parentId) {
        report.relationshipIssues.push({
          type: "missing_parent",
          externalId: rec.externalId,
          parentExternalId: rec.parentExternalId,
        });
      } else {
        const parentRelated = new Set(meta.relatedQuestionIds ?? []);
        parentRelated.add(id);
        meta.relatedQuestionIds = [...parentRelated];
      }
    }
    const { error } = await admin.from("prepared_qa").update({ navigator_meta: meta }).eq("id", id);
    if (error) throw error;
  }

  const { data: qAfter } = await admin.from("prepared_qa").select("*").eq("profile_id", QUESTRADE_PROFILE_ID);
  const { data: sAfter } = await admin.from("prepared_qa").select("*").eq("profile_id", SIMPLII_PROFILE_ID);
  const questradeHashAfter = createHash("sha256")
    .update(qAfter.map((r) => rowHash(r)).sort().join("|"))
    .digest("hex");
  const simpliiHashAfter = createHash("sha256")
    .update((sAfter ?? []).map((r) => rowHash(r)).sort().join("|"))
    .digest("hex");

  report.questradeIntegrity = {
    unchanged: questradeHashBefore === questradeHashAfter,
    hash: questradeHashAfter,
  };
  report.simpliiIntegrity = {
    unchanged: simpliiHashBefore === simpliiHashAfter,
    hash: simpliiHashAfter,
  };

  if (!report.questradeIntegrity.unchanged) {
    throw new Error("Questrade integrity check failed after import");
  }
  if (!report.simpliiIntegrity.unchanged) {
    throw new Error("Simplii integrity check failed after import");
  }

  mkdirSync(resolve(root, "data/migration"), { recursive: true });
  writeFileSync(resolve(root, "data/migration/opentable-final-import-report.json"), JSON.stringify(report, null, 2));

  console.log("Import applied.", report.actions, "Profile:", profile.id);

  if (embed) {
    await new Promise((resolvePromise, reject) => {
      const child = spawn("npm", ["run", "embed:qa:gte"], {
        cwd: root,
        stdio: "inherit",
        env: { ...process.env, EMBED_PROFILE_NAME: "OpenTable" },
      });
      child.on("exit", (code) => (code === 0 ? resolvePromise() : reject(new Error(`embed exited ${code}`))));
    });
  } else {
    console.log("Tip: EMBED_PROFILE_NAME=OpenTable npm run embed:qa:gte");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

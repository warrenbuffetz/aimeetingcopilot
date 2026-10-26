#!/usr/bin/env node
/**
 * Export Questrade interview library + inventory + proposed expansion delta.
 * Usage: node scripts/export-questrade-library.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const QUESTRADE_PROFILE_ID = "f96f6db8-c0e9-4341-be68-c29f6975dc5e";
const QUESTRADE_PROFILE_NAME = "Questrade — Senior PM, Everyday Banking";

const BRAND_TERMS = [
  "questrade",
  "questbank",
  "temenos",
  "balance sheet",
  "financial hub",
  "mcp",
  "flows",
  "brokerage-to-banking",
  "investing-to-banking",
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

const seedEmail = process.env.SEED_USER_EMAIL ?? "poc-demo@interviewcopilot.app";

function isInactive(meta) {
  if (!meta || typeof meta !== "object") return false;
  if (meta.retrievalExcluded) return true;
  return meta.revisionStatus === "superseded" || meta.revisionStatus === "archived";
}

function normQ(s) {
  return (s ?? "")
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectBrandTerms(text) {
  const lower = (text ?? "").toLowerCase();
  return BRAND_TERMS.filter((t) => lower.includes(t));
}

function mapRow(row) {
  const meta = row.navigator_meta ?? {};
  const inactive = isInactive(meta);
  const embeddedFollowUps = Array.isArray(row.follow_ups) ? row.follow_ups : [];

  return {
    id: row.id,
    profileId: row.profile_id,
    profileName: QUESTRADE_PROFILE_NAME,
    question: row.question,
    answer: row.answer,
    category: row.category,
    isPreferred: row.is_preferred,
    isAuthoritative: row.is_authoritative,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: inactive ? "inactive" : "active",
    inactiveReason: inactive
      ? meta.revisionStatus === "superseded"
        ? "superseded"
        : meta.revisionStatus === "archived"
          ? "archived"
          : meta.retrievalExcluded
            ? "retrieval_excluded"
            : "inactive"
      : null,
    navigatorMeta: meta,
    aliases: meta.altPhrasings ?? [],
    spokenAnswer: meta.spokenAnswer ?? meta.shortAnswer ?? null,
    shortAnswer: meta.shortAnswer ?? null,
    canonicalQuestion: meta.canonicalQuestion ?? null,
    canonicalQuestionId: meta.canonicalQuestionId ?? null,
    relatedQuestionIds: meta.relatedQuestionIds ?? [],
    experienceModuleId: meta.experienceModuleId ?? null,
    experienceLabel: meta.experienceLabel ?? null,
    librarySection: meta.librarySection ?? null,
    libraryCategory: meta.libraryCategory ?? null,
    questionIntent: meta.intent ?? null,
    evidenceStatus: meta.evidenceStatus ?? null,
    revisionStatus: meta.revisionStatus ?? "current",
    reviewStatus: meta.reviewStatus ?? null,
    supersededByQuestion: meta.supersededByQuestion ?? null,
    roundRelevance: meta.roundRelevance ?? null,
    primaryInterviewRound: meta.primaryInterviewRound ?? null,
    panelDiscipline: meta.panelDiscipline ?? null,
    preparationTier: meta.preparationTier ?? meta.topicTags?.find((t) => /^P[012]$/.test(t)) ?? null,
    importKey: meta.importKey ?? null,
    sourceFile: meta.sourceFile ?? null,
    seedKey: meta.seedKey ?? null,
    supplementalTalkingPoints: meta.supplementalTalkingPoints ?? [],
    embeddedFollowUps: embeddedFollowUps.map((fu) => ({
      question: fu.question ?? "",
      answer: fu.answer ?? "",
      notes: fu.notes ?? null,
    })),
    embeddedFollowUpCount: embeddedFollowUps.length,
  };
}

async function main() {
  const { data: users } = await admin.auth.admin.listUsers({ perPage: 200 });
  const user = users.users.find((u) => u.email === seedEmail);
  if (!user) throw new Error("No user found");

  const { data: rows, error } = await admin
    .from("prepared_qa")
    .select(
      "id, user_id, profile_id, question, answer, category, is_preferred, is_authoritative, follow_ups, navigator_meta, created_at, updated_at"
    )
    .eq("profile_id", QUESTRADE_PROFILE_ID)
    .order("created_at", { ascending: true });
  if (error) throw error;

  const records = rows.map(mapRow);
  const active = records.filter((r) => r.status === "active");
  const inactive = records.filter((r) => r.status === "inactive");

  const parentsWithEmbedded = active.filter((r) => r.embeddedFollowUpCount > 0);
  const embeddedTotal = active.reduce((s, r) => s + r.embeddedFollowUpCount, 0);

  const idToQuestion = new Map(records.map((r) => [r.id, r.question]));
  const standaloneFollowUpCandidates = active.filter(
    (r) => (r.relatedQuestionIds?.length ?? 0) > 0 || r.canonicalQuestionId
  );

  const byNorm = new Map();
  const duplicateGroups = [];
  for (const r of active) {
    const k = normQ(r.question);
    if (!byNorm.has(k)) byNorm.set(k, []);
    byNorm.get(k).push(r.id);
  }
  for (const [k, ids] of byNorm) {
    if (ids.length > 1) duplicateGroups.push({ normalizedQuestion: k, recordIds: ids });
  }

  const expansionPath = resolve(root, "data/migration/questrade-followup-expansion-current-arcteryx.json");
  const registryPath = resolve(root, "data/migration/import-registry-followup-expansion-92.json");

  let proposedSource = null;
  let proposedEntries = [];
  if (existsSync(expansionPath)) {
    proposedSource = JSON.parse(readFileSync(expansionPath, "utf8"));
    proposedEntries = proposedSource.entries ?? [];
  }

  const registry = existsSync(registryPath) ? JSON.parse(readFileSync(registryPath, "utf8")) : {};
  const dbImportKeys = new Set(
    records.map((r) => r.importKey).filter(Boolean)
  );
  const dbQuestions = new Set(records.map((r) => normQ(r.question)));

  const proposedNotInDb = [];
  for (const entry of proposedEntries) {
    const key = entry.importKey;
    const reg = registry[key];
    const importedViaRegistry = reg && (reg.action === "created" || reg.action === "alias_only");
    const inDbByKey = key && dbImportKeys.has(key);
    const inDbByQuestion = dbQuestions.has(normQ(entry.canonicalQuestion));
    if (!importedViaRegistry && !inDbByKey && !inDbByQuestion) {
      proposedNotInDb.push(entry);
    }
  }

  const libraryExport = {
    exportVersion: "1.0.0",
    exportedAt: new Date().toISOString(),
    source: {
      system: "supabase.prepared_qa",
      profileId: QUESTRADE_PROFILE_ID,
      profileName: QUESTRADE_PROFILE_NAME,
      userEmail: seedEmail,
    },
    summary: {
      totalRecords: records.length,
      activeCount: active.length,
      inactiveCount: inactive.length,
      parentsWithEmbeddedFollowUps: parentsWithEmbedded.length,
      embeddedFollowUpSnippets: embeddedTotal,
      standaloneFollowUpLinkedRecords: standaloneFollowUpCandidates.length,
      duplicateActiveQuestionGroups: duplicateGroups.length,
      withRoundRelevance: active.filter((r) => r.roundRelevance && Object.keys(r.roundRelevance).length).length,
      withImportKey: active.filter((r) => r.importKey).length,
    },
    records,
    relationships: {
      relatedQuestionIdEdges: active.flatMap((r) =>
        (r.relatedQuestionIds ?? []).map((targetId) => ({
          fromRecordId: r.id,
          toRecordId: targetId,
          toQuestion: idToQuestion.get(targetId) ?? null,
          relationship: "relatedQuestionIds",
        }))
      ),
      canonicalQuestionIdLinks: active
        .filter((r) => r.canonicalQuestionId)
        .map((r) => ({
          recordId: r.id,
          canonicalQuestionId: r.canonicalQuestionId,
          canonicalQuestionText: idToQuestion.get(r.canonicalQuestionId) ?? null,
        })),
    },
    duplicateActiveQuestionGroups: duplicateGroups,
  };

  const inventory = {
    exportVersion: "1.0.0",
    exportedAt: new Date().toISOString(),
    profileId: QUESTRADE_PROFILE_ID,
    profileName: QUESTRADE_PROFILE_NAME,
    items: records.map((r) => ({
      id: r.id,
      question: r.question,
      status: r.status,
      category: r.category,
      experienceModuleId: r.experienceModuleId,
      librarySection: r.librarySection,
      questionIntent: r.questionIntent,
      preparationTier: r.preparationTier,
      revisionStatus: r.revisionStatus,
      importKey: r.importKey,
      relatedQuestionIds: r.relatedQuestionIds,
      canonicalQuestionId: r.canonicalQuestionId,
      embeddedFollowUpCount: r.embeddedFollowUpCount,
      embeddedFollowUpLabels: r.embeddedFollowUps.map((f) => f.question),
      brandTermsDetected: detectBrandTerms(`${r.question}\n${r.answer}`),
      aliasCount: r.aliases.length,
    })),
  };

  const proposedExport = {
    exportVersion: "1.0.0",
    exportedAt: new Date().toISOString(),
    note:
      "Source file in repo is data/migration/questrade-followup-expansion-current-arcteryx.json (variant of Questrade_Proposed_Followup_Expansion.json). Entries already in Supabase are omitted.",
    sourceMeta: proposedSource?.meta ?? null,
    summary: {
      proposedFileEntryCount: proposedEntries.length,
      notRepresentedInDatabase: proposedNotInDb.length,
      alreadyImportedOrPresent: proposedEntries.length - proposedNotInDb.length,
    },
    entriesNotInDatabase: proposedNotInDb,
    registryReference: registryPath,
  };

  mkdirSync(resolve(root, "exports"), { recursive: true });
  writeFileSync(resolve(root, "exports/questrade_interview_library.json"), JSON.stringify(libraryExport, null, 2));
  writeFileSync(resolve(root, "exports/questrade_content_inventory.json"), JSON.stringify(inventory, null, 2));
  writeFileSync(resolve(root, "exports/questrade_proposed_expansion.json"), JSON.stringify(proposedExport, null, 2));

  console.log("Wrote exports/questrade_interview_library.json");
  console.log("Wrote exports/questrade_content_inventory.json");
  console.log("Wrote exports/questrade_proposed_expansion.json");
  console.log(JSON.stringify(libraryExport.summary, null, 2));
  console.log("Proposed expansion:", proposedExport.summary);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

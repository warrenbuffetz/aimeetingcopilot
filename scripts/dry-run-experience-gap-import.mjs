#!/usr/bin/env node
/**
 * Dual-profile dry-run for the 61-card experience-gap Q&A pack.
 * Does not apply changes or overwrite live answers.
 *
 * Usage:
 *   node scripts/dry-run-experience-gap-import.mjs
 *   node scripts/dry-run-experience-gap-import.mjs --pack=/path/to/pack.md
 *   node scripts/dry-run-experience-gap-import.mjs --questrade=imports/qt_exp_gap.json --simplii=imports/sim_exp_gap.json
 */
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import {
  parseExperienceGapPack,
  contentFingerprint,
  MODULE_LABEL_TO_ID,
} from "./lib/parse-experience-gap-pack.mjs";
import { validateImportPackage, normQ } from "./lib/validate-interview-qa-import.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const QUESTRADE_PROFILE_ID = "f96f6db8-c0e9-4341-be68-c29f6975dc5e";
const QUESTRADE_PROFILE_NAME = "Questrade — Senior PM, Everyday Banking";
const SIMPLII_PROFILE_NAME = "Simplii Financial — Senior Product Manager";

const DEFAULT_PACK = resolve(root, "docs/Interview_Experience_Gap_QA_Cursor_Pack.md");
const FALLBACK_PACK = "/Users/johnlee/Downloads/Interview_Experience_Gap_QA_Cursor_Pack.md";
const QT_JSON = resolve(root, "imports/questrade_experience_gap_qa.json");
const SIM_JSON = resolve(root, "imports/simplii_experience_gap_qa.json");
const QT_EXPORT = resolve(root, "exports/questrade_interview_library.json");

function argValue(flag) {
  const hit = process.argv.find((a) => a.startsWith(`${flag}=`));
  return hit ? hit.slice(flag.length + 1) : null;
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

function sha256Text(s) {
  return createHash("sha256").update(s, "utf8").digest("hex");
}

function buildQuestradeQuestionIndex() {
  if (!existsSync(QT_EXPORT)) return new Map();
  const lib = JSON.parse(readFileSync(QT_EXPORT, "utf8"));
  const index = new Map();
  for (const rec of lib.records ?? []) {
    if (rec.status !== "active") continue;
    const nq = normQ(rec.question);
    if (!index.has(nq)) index.set(nq, rec.id);
    for (const alt of rec.navigatorMeta?.altPhrasings ?? []) {
      const na = normQ(alt);
      if (!index.has(na)) index.set(na, rec.id);
    }
  }
  return index;
}

function isRfc4122Uuid(s) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
}

function resolveSourceQuestradeId(card, qtIndex) {
  const candidates = [card.canonicalQuestion, ...card.aliases];
  for (const q of candidates) {
    const id = qtIndex.get(normQ(q));
    if (id && isRfc4122Uuid(id)) return { id, matchedQuestion: q };
  }
  return { id: null, matchedQuestion: null };
}

function externalIdFor(profileKey, cardId) {
  const prefix = profileKey === "questrade" ? "qt-exp-gap" : "sim-exp-gap";
  return `${prefix}-${cardId}`;
}

function buildImportPackage(cards, profileKey, targetProfile, qtIndex) {
  const records = cards.map((card) => {
    const externalId = externalIdFor(profileKey, card.cardId);
    const relatedExternalIds = card.suggestedNext.map((sn) => externalIdFor(profileKey, sn.cardId));
    const parentExternalId = card.parentCardId ? externalIdFor(profileKey, card.parentCardId) : undefined;
    const prov = resolveSourceQuestradeId(card, qtIndex);

    return {
      externalId,
      canonicalQuestion: card.canonicalQuestion,
      answer: card.answer,
      spokenAnswer: card.spokenAnswer,
      shortAnswer: card.shortAnswer,
      aliases: card.aliases,
      adaptationType: prov.id ? "newly_authored" : "newly_authored",
      sourceQuestradeRecordId: prov.id ?? undefined,
      preparationTier: card.preparationTier,
      roundRelevance: card.roundRelevance,
      questionIntent: card.questionIntent,
      experienceModuleId: card.experienceModuleId,
      experienceLabel: card.moduleLabel,
      librarySection: "product_experience",
      libraryCategory: "resume_deep_dive",
      evidenceStatus: card.evidenceStatus,
      reviewRequired: card.reviewRequired,
      reviewNotes: card.reviewNote,
      revisionStatus: "current",
      retrievalExcluded: false,
      isPreferred: card.isEmployerOverview,
      isAuthoritative: false,
      parentExternalId,
      relatedExternalIds,
      topicTags: [`sharedConcept:${card.cardId}`, "experience-gap-2026-10", card.preparationTier],
      keywords: [card.cardId, card.experienceModuleId],
      sourceFile: "Interview_Experience_Gap_QA_Cursor_Pack.md",
      notes: prov.matchedQuestion
        ? `Provenance match (not update selector): ${prov.matchedQuestion}`
        : "No Questrade row matched by question text; new gap coverage.",
    };
  });

  return {
    schemaVersion: "1.0.0",
    packageId: `experience-gap-2026-10-26-${profileKey}`,
    authoredBy: "Interview_Experience_Gap_QA_Cursor_Pack.md",
    authoredAt: "2026-10-26T00:00:00.000Z",
    targetProfile,
    records,
  };
}

function sharedConceptKey(rec) {
  const tag = rec.topicTags?.find((t) => t.startsWith("shared-concept:") || t.startsWith("sharedConcept:"));
  if (!tag) return null;
  return tag.replace(/^shared-concept:/, "").replace(/^sharedConcept:/, "");
}

function validateSharedContent(qtPkg, simPkg, cards) {
  const issues = [];
  const qtByConcept = new Map();
  const simByConcept = new Map();
  for (const rec of qtPkg.records) {
    const key = sharedConceptKey(rec);
    if (key) qtByConcept.set(key, rec);
  }
  for (const rec of simPkg.records) {
    const key = sharedConceptKey(rec);
    if (key) simByConcept.set(key, rec);
  }

  const cardToConcept = (cardId) => `john-experience-depth-v1-${cardId}`;

  for (const card of cards) {
    const concept = cardToConcept(card.cardId);
    const qt = qtByConcept.get(concept);
    const sim = simByConcept.get(concept);
    if (!qt || !sim) {
      issues.push({ type: "missing_shared_pair", cardId: card.cardId, concept });
      continue;
    }
    const fields = ["answer", "spokenAnswer", "shortAnswer", "reviewNotes"];
    for (const f of fields) {
      if ((qt[f] ?? "") !== (sim[f] ?? "")) {
        issues.push({ type: "cross_profile_text_drift", cardId: card.cardId, field: f });
      }
    }
    const fpPack = sha256Text(contentFingerprint(card));
    const fpQt = sha256Text(
      JSON.stringify({
        q: qt.canonicalQuestion,
        a: qt.answer,
        s: qt.shortAnswer,
        aliases: qt.aliases,
        review: qt.reviewNotes,
      })
    );
    if (fpPack !== fpQt) {
      issues.push({ type: "pack_vs_json_drift", cardId: card.cardId, profile: "questrade" });
    }
  }
  return issues;
}

function linkValidation(pkg) {
  const ids = new Set(pkg.records.map((r) => r.externalId));
  const issues = [];
  for (const rec of pkg.records) {
    if (rec.parentExternalId && !ids.has(rec.parentExternalId)) {
      issues.push({ externalId: rec.externalId, issue: "missing_parent", ref: rec.parentExternalId });
    }
    for (const rid of rec.relatedExternalIds ?? []) {
      if (!ids.has(rid)) issues.push({ externalId: rec.externalId, issue: "missing_related", ref: rid });
    }
  }
  return issues;
}

function classifyExistingRow(rec, existing) {
  const actions = [];
  const importKey = rec.externalId;
  const byKey = existing.byImportKey.get(importKey);
  if (byKey) {
    actions.push({ kind: "idempotent_skip", reason: "importKey exists", existingId: byKey.id });
    return actions;
  }

  const nq = normQ(rec.canonicalQuestion);
  const sameQuestion = existing.byNormQ.get(nq);
  if (sameQuestion) {
    actions.push({
      kind: "proposed_revision",
      reason: "normalized question match",
      existingId: sameQuestion.id,
      preserveExistingVersion: true,
      note: "Do not auto-update by sourceQuestradeRecordId; propose draft sibling or supersede flow.",
    });
  }

  const intentKey = `${rec.experienceModuleId}::${rec.questionIntent}`;
  const intentPeers = existing.byIntentModule.get(intentKey) ?? [];
  const activePeers = intentPeers.filter(
    (p) => !(p.navigator_meta?.revisionStatus === "superseded" || p.navigator_meta?.revisionStatus === "archived")
  );
  if (activePeers.length && !sameQuestion) {
    const conceptTag = rec.topicTags?.find((t) => t.startsWith("shared-concept:") || t.startsWith("sharedConcept:"));
    const concept = conceptTag?.split(":").slice(1).join(":") ?? "";
    const overviewIds = new Set([
      "john-experience-depth-v1-arc-overview",
      "john-experience-depth-v1-rbc-overview",
      "john-experience-depth-v1-hbc-overview",
      "john-experience-depth-v1-air-overview",
      "arc-overview",
      "rbc-overview",
      "hbc-overview",
      "air-overview",
    ]);
    actions.push({
      kind: activePeers.some((p) => p.is_preferred) ? "consolidate_or_route" : "competing_intent_risk",
      reason: "same module+intent already has live-style row(s)",
      existingIds: activePeers.map((p) => p.id),
      employerOverviewRouting: concept ? overviewIds.has(concept) : false,
    });
  }

  if (!actions.length) actions.push({ kind: "create_draft", reason: "new gap coverage" });
  return actions;
}

async function loadExistingForProfile(admin, profileId) {
  const { data, error } = await admin
    .from("prepared_qa")
    .select("id, question, answer, is_preferred, navigator_meta")
    .eq("profile_id", profileId);
  if (error) throw error;

  const byImportKey = new Map();
  const byNormQ = new Map();
  const byIntentModule = new Map();

  for (const r of data ?? []) {
    const key = r.navigator_meta?.importKey ?? r.navigator_meta?.externalContentId;
    if (key) byImportKey.set(key, r);
    const nq = normQ(r.question);
    if (!byNormQ.has(nq)) byNormQ.set(nq, r);
    const intent = r.navigator_meta?.intent ?? "general";
    const mod = r.navigator_meta?.experienceModuleId ?? "unknown";
    const ik = `${mod}::${intent}`;
    if (!byIntentModule.has(ik)) byIntentModule.set(ik, []);
    byIntentModule.get(ik).push(r);
  }

  return { rows: data ?? [], byImportKey, byNormQ, byIntentModule };
}

async function resolveSimpliiProfile(admin, userId) {
  const { data, error } = await admin
    .from("interview_profiles")
    .select("id, name")
    .eq("user_id", userId)
    .eq("name", SIMPLII_PROFILE_NAME)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error(`Simplii profile not found by exact name: ${SIMPLII_PROFILE_NAME}`);
  return data;
}

async function findUserId(admin) {
  const seedEmail = process.env.SEED_USER_EMAIL ?? "poc-demo@interviewcopilot.app";
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;
  const user = data.users.find((u) => u.email === seedEmail) ?? data.users[0];
  if (!user) throw new Error("No user found for profile resolution");
  return user.id;
}

function ensurePackInRepo(packPath) {
  mkdirSync(resolve(root, "docs"), { recursive: true });
  if (packPath === DEFAULT_PACK && !existsSync(DEFAULT_PACK) && existsSync(FALLBACK_PACK)) {
    copyFileSync(FALLBACK_PACK, DEFAULT_PACK);
  }
  if (!existsSync(packPath)) {
    throw new Error(`Pack not found: ${packPath}`);
  }
  return packPath;
}

async function main() {
  loadEnv();
  const packPath = ensurePackInRepo(argValue("--pack") ? resolve(argValue("--pack")) : DEFAULT_PACK);
  const cards = parseExperienceGapPack(packPath);
  const qtIndex = buildQuestradeQuestionIndex();

  let qtPkg;
  let simPkg;
  const qtPath = argValue("--questrade") ? resolve(argValue("--questrade")) : QT_JSON;
  const simPath = argValue("--simplii") ? resolve(argValue("--simplii")) : SIM_JSON;

  const userSupplied =
    argValue("--questrade") ||
    (existsSync(qtPath) &&
      existsSync(simPath) &&
      readFileSync(qtPath, "utf8").includes("john-experience-depth-v1"));

  if (existsSync(qtPath) && existsSync(simPath)) {
    qtPkg = JSON.parse(readFileSync(qtPath, "utf8"));
    simPkg = JSON.parse(readFileSync(simPath, "utf8"));
  } else {
    qtPkg = buildImportPackage(cards, "questrade", { name: QUESTRADE_PROFILE_NAME, id: QUESTRADE_PROFILE_ID }, qtIndex);
    simPkg = buildImportPackage(cards, "simplii", { name: SIMPLII_PROFILE_NAME }, qtIndex);
    mkdirSync(resolve(root, "imports"), { recursive: true });
    writeFileSync(qtPath, JSON.stringify(qtPkg, null, 2));
    writeFileSync(simPath, JSON.stringify(simPkg, null, 2));
  }

  const qtVal = validateImportPackage(qtPkg);
  const simVal = validateImportPackage(simPkg);
  const sharedIssues = validateSharedContent(qtPkg, simPkg, cards);
  const qtLinks = linkValidation(qtPkg);
  const simLinks = linkValidation(simPkg);

  const report = {
    at: new Date().toISOString(),
    mode: "dry-run-only",
    authorization: "Content handoff only — no production deploy, no overwrite of live answers.",
    inputs: {
      packPath,
      questradeJson: qtPath,
      simpliiJson: simPath,
      jsonSource: userSupplied ? "user_supplied_json" : "generated_from_pack_because_accompanying_json_not_supplied",
    },
    cardCount: cards.length,
    validation: { questrade: qtVal, simplii: simVal },
    textPreservation: {
      packFingerprints: cards.map((c) => ({ cardId: c.cardId, sha256: sha256Text(contentFingerprint(c)) })),
      crossProfileSharedIssues: sharedIssues,
    },
    links: { questrade: qtLinks, simplii: simLinks },
    employerOverviewModules: cards
      .filter((c) => c.isEmployerOverview)
      .map((c) => ({
        cardId: c.cardId,
        moduleLabel: c.moduleLabel,
        experienceModuleId: c.experienceModuleId,
        routingNote: "Broad employer questions should hit this overview first (isPreferred on import row).",
      })),
    profiles: {},
    idempotency: {},
    duplicateHandling: {},
  };

  if (!qtVal.valid || !simVal.valid) {
    mkdirSync(resolve(root, "data/migration"), { recursive: true });
    const out = resolve(root, "data/migration/experience-gap-import-plan.json");
    writeFileSync(out, JSON.stringify(report, null, 2));
    console.error("Validation failed. See", out);
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    report.profiles.note = "Supabase not configured — structural validation only.";
    report.idempotency.note = "Re-run with apps/web/.env.local to reconcile against live prepared_qa.";
  } else {
    const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
    const userId = await findUserId(admin);
    const simplii = await resolveSimpliiProfile(admin, userId);

    report.profiles.questrade = { id: QUESTRADE_PROFILE_ID, name: QUESTRADE_PROFILE_NAME, resolvedBy: "constant_id" };
    report.profiles.simplii = { id: simplii.id, name: simplii.name, resolvedBy: "exact_name_match" };

    const qtExisting = await loadExistingForProfile(admin, QUESTRADE_PROFILE_ID);
    const simExisting = await loadExistingForProfile(admin, simplii.id);

    const planQt = [];
    const planSim = [];
    for (const rec of qtPkg.records) {
      planQt.push({
        externalId: rec.externalId,
        sharedConcept: sharedConceptKey(rec),
        actions: classifyExistingRow(rec, qtExisting),
      });
    }
    for (const rec of simPkg.records) {
      planSim.push({
        externalId: rec.externalId,
        sharedConcept: sharedConceptKey(rec),
        actions: classifyExistingRow(rec, simExisting),
      });
    }

    report.plannedActions = { questrade: planQt, simplii: planSim };
    report.duplicateHandling = {
      questradeSemantic: qtPkg.records
        .map((rec) => {
          const nq = normQ(rec.canonicalQuestion);
          const ex = qtExisting.byNormQ.get(nq);
          return ex ? { externalId: rec.externalId, existingId: ex.id, normalizedQuestion: nq } : null;
        })
        .filter(Boolean),
      simpliiSemantic: simPkg.records
        .map((rec) => {
          const nq = normQ(rec.canonicalQuestion);
          const ex = simExisting.byNormQ.get(nq);
          return ex ? { externalId: rec.externalId, existingId: ex.id, normalizedQuestion: nq } : null;
        })
        .filter(Boolean),
      profileIsolation: {
        questradeRowCount: qtExisting.rows.length,
        simpliiRowCount: simExisting.rows.length,
        note: "Import keys and UUID links are profile-local; sharedConcept tags tie content only.",
      },
    };

    const qtHash = sha256Text(JSON.stringify(qtPkg.records.map((r) => r.externalId).sort()));
    const simHash = sha256Text(JSON.stringify(simPkg.records.map((r) => r.externalId).sort()));
    report.idempotency = {
      questradeImportKeySetSha256: qtHash,
      simpliiImportKeySetSha256: simHash,
      rerunBehavior: "Second dry-run with same JSON should classify all rows as idempotent_skip once importKeys exist (apply not run in this handoff).",
    };
  }

  mkdirSync(resolve(root, "data/migration"), { recursive: true });
  const jsonOut = resolve(root, "data/migration/experience-gap-import-plan.json");
  writeFileSync(jsonOut, JSON.stringify(report, null, 2));

  function summarizeActions(plan) {
    const m = {};
    for (const row of plan ?? []) {
      for (const a of row.actions) m[a.kind] = (m[a.kind] ?? 0) + 1;
    }
    return m;
  }

  const qtSum = summarizeActions(report.plannedActions?.questrade);
  const simSum = summarizeActions(report.plannedActions?.simplii);

  const mdLines = [
    "# Experience-gap Q&A import plan (dry-run)",
    "",
    `Generated: ${report.at}`,
    "",
    "**Not authorized:** production deployment or overwriting existing live answers.",
    "",
    "## Inputs",
    `- Pack: \`${packPath}\``,
    `- Questrade JSON: \`${qtPath}\``,
    `- Simplii JSON: \`${simPath}\``,
    `- JSON provenance: ${report.inputs.jsonSource}`,
    "",
    "## Profiles",
    `- Questrade: **${QUESTRADE_PROFILE_NAME}** (\`${QUESTRADE_PROFILE_ID}\`)`,
    report.profiles?.simplii
      ? `- Simplii: **${report.profiles.simplii.name}** (\`${report.profiles.simplii.id}\`, resolved by exact name)`
      : `- Simplii: **${SIMPLII_PROFILE_NAME}** (resolve by exact name at import time)`,
    "",
    "## Validation",
    `- Questrade package: ${qtVal.valid ? "OK" : "FAILED"} (${qtVal.errors.length} errors, ${qtVal.warnings.length} warnings)`,
    `- Simplii package: ${simVal.valid ? "OK" : "FAILED"} (${simVal.errors.length} errors, ${simVal.warnings.length} warnings)`,
    `- Cross-profile shared text issues: **${sharedIssues.length}**`,
    `- Link issues — Questrade: ${qtLinks.length}, Simplii: ${simLinks.length}`,
    "",
    "## Planned actions (per 61 cards, both profiles)",
    report.plannedActions
      ? [
          `- Questrade: ${Object.entries(qtSum).map(([k, v]) => `${k}=${v}`).join(", ")}`,
          `- Simplii: ${Object.entries(simSum).map(([k, v]) => `${k}=${v}`).join(", ")}`,
          "",
          "Action kinds:",
          "- `create_draft` — new gap row; `isAuthoritative: false`, `reviewRequired: true`",
          "- `proposed_revision` — normalized question already exists; keep existing version, do not auto-update via `sourceQuestradeRecordId`",
          "- `consolidate_or_route` — same module+intent with preferred live row; route broad employer questions to overview (`isPreferred`)",
          "- `competing_intent_risk` — module+intent overlap without exact question match; avoid second live answer without supersede",
        ].join("\n")
      : "(Supabase not configured — structural validation only.)",
    "",
    "## Employer overview routing (4 modules)",
    ...report.employerOverviewModules.map(
      (m) => `- \`${m.cardId}\` → module \`${m.experienceModuleId}\` (${m.moduleLabel})`
    ),
    "",
    "## Shared content rule",
    "61 `sharedConcept:*` tags; full, short, aliases and review notes must match across profiles (delivery-length alternatives only).",
    "",
    "## Idempotency",
    report.idempotency?.questradeImportKeySetSha256
      ? `Import keys are stable (\`qt-exp-gap-*\` / \`sim-exp-gap-*\`). After a future \`--apply\`, re-running this dry-run should classify rows as \`idempotent_skip\` by importKey.`
      : "Re-run with Supabase env for idempotency notes.",
    "",
    "## Outputs",
    `- Machine report: \`data/migration/experience-gap-import-plan.json\``,
    "",
  ];
  const mdOut = resolve(root, "data/migration/experience-gap-import-plan.md");
  writeFileSync(mdOut, mdLines.join("\n"));

  console.log("Experience-gap dry-run complete.");
  console.log("Cards:", cards.length);
  console.log("Shared issues:", sharedIssues.length);
  console.log("Plan:", mdOut);
  console.log("JSON:", jsonOut);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * @deprecated Use export + ChatGPT-authored imports/simplii_final_qa.json
 * and scripts/import-simplii-final-qa.mjs instead.
 *
 * This auto-clone script is disabled unless FORCE_CLONE_QUESTRADE_TO_SIMPLII=1.
 */
if (process.env.FORCE_CLONE_QUESTRADE_TO_SIMPLII !== "1") {
  console.error(
    "import-simplii-profile.mjs is deprecated.\n" +
      "Use: npm run export:questrade-library\n" +
      "     ChatGPT → imports/simplii_final_qa.json\n" +
      "     npm run import:simplii:final:apply"
  );
  process.exit(1);
}
/**
 * Legacy: Clone Questrade prepared Q&A → Simplii profile with audited dispositions.
 */
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const QUESTRADE_PROFILE_ID = "f96f6db8-c0e9-4341-be68-c29f6975dc5e";
const SIMPLII_PROFILE_NAME = "Simplii Financial — Senior Product Manager";

const remaps = JSON.parse(readFileSync(resolve(root, "data/migration/simplii-question-remaps.json"), "utf8"));
const answerOverrides = JSON.parse(readFileSync(resolve(root, "data/migration/simplii-answer-overrides.json"), "utf8"));
const newQuestions = JSON.parse(readFileSync(resolve(root, "data/migration/simplii-new-questions.json"), "utf8"));

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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const seedEmail = process.env.SEED_USER_EMAIL ?? "poc-demo@interviewcopilot.app";

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const MODULE_REMAP = {
  "questrade-primary": "digital-banking-engagement",
  "questrade-deposits": "digital-banking-deposits",
  "questrade-payments": "digital-banking-payments",
  "questrade-metrics": "digital-banking-metrics",
  "questrade-mcp": "digital-banking-ai",
  "questrade-hub": "digital-banking-hub",
  "questrade-temenos": null,
};

const MODULE_LABELS = {
  "digital-banking-engagement": "Digital Banking — Account Engagement",
  "digital-banking-deposits": "Digital Banking — Direct Deposit & Funding",
  "digital-banking-payments": "Digital Banking — Payments & Controls",
  "digital-banking-metrics": "Digital Banking — Metrics & Economics",
  "digital-banking-ai": "Digital Banking — AI & Automation",
  "digital-banking-hub": "Digital Banking — Aggregation & Financial View",
};

const MCP_KEEP =
  /consent|human approval|revokes.*access|deterministic|malicious|unauthorized|measure whether.*AI|stop.*pilot|test an AI|wrong trade|introduce AI-assisted|recommend how someone should move|protect customers from|drafts the wrong/i;
const MCP_EXCLUDE =
  /MCP standardizes|Claude and ChatGPT|extend Questrade MCP|Flows\?|Why would Questrade expose/i;

const HUB_KEEP =
  /share of wallet|stale or disconnected|biggest risk in connecting|screen scraping|customer-permissioned|financial hub truly deepens|design a single financial hub/i;
const HUB_EXCLUDE = /Balance Sheet|Questrade's financial hub|automatically transfer extra cash/i;

const BRAND_RE =
  /\b(questrade|questbank|temenos|balance sheet|financial hub|brokerage-to-banking|investing-to-banking)\b/i;

function isInactive(meta) {
  if (!meta || typeof meta !== "object") return false;
  if (meta.retrievalExcluded) return true;
  return meta.revisionStatus === "superseded" || meta.revisionStatus === "archived";
}

function rowHash(row) {
  return createHash("sha256")
    .update(JSON.stringify({ q: row.question, a: row.answer, m: row.navigator_meta, f: row.follow_ups }))
    .digest("hex");
}

function neutralizeCaseText(text) {
  if (!text) return text;
  return text
    .replace(/\bQuestbank's\b/g, "the everyday banking product's")
    .replace(/\bQuestbank\b/g, "everyday banking")
    .replace(/\bQuestrade's\b/g, "the bank's")
    .replace(/\bQuestrade investing customers\b/gi, "customers")
    .replace(/\bQuestrade\b/g, "a digital bank")
    .replace(/\bQuestrade\b/gi, "a digital bank");
}

function transformQuestionBranding(question) {
  if (!question) return question;
  return question
    .replace(/\bQuestbank's\b/gi, "everyday banking's")
    .replace(/\bQuestbank\b/gi, "everyday banking")
    .replace(/\bQuestrade investing customers\b/gi, "customers")
    .replace(/\bQuestrade\b/gi, "a digital bank");
}

function transformFollowUps(followUps, transformAnswer) {
  if (!Array.isArray(followUps)) return [];
  return followUps.map((fu) => {
    let fq = fu.question ?? "";
    if (BRAND_RE.test(fq)) fq = transformQuestionBranding(fq);
    return {
      ...fu,
      question: fq,
      answer: transformAnswer(fu.answer ?? ""),
    };
  });
}

function inferPreparationTier(question, meta, moduleId) {
  const q = question.toLowerCase();
  if (
    /tell me about yourself|simplii financial|why simplii|why leave|compensation|availability|notice period/i.test(q)
  ) {
    return "P0";
  }
  if (meta?.preparationTier) return meta.preparationTier;
  if (moduleId?.startsWith("digital-banking-") && /how would you|walk me through|diagnos/i.test(q)) {
    return "P0";
  }
  if (moduleId === "leadership-general" || moduleId === "rbc-cashback" || moduleId === "hbc-mastercard-app") {
    if (/priorit|disagree|influence|data|ambigu|stakeholder|wrong|failed/i.test(q)) return "P0";
  }
  if (moduleId?.startsWith("questrade-") || moduleId?.startsWith("digital-banking-")) return "P1";
  return "P2";
}

function simpliiRoundRelevance(question, librarySection, existing) {
  if (existing && Object.keys(existing).length) {
    const copy = { ...existing };
    const q = question.toLowerCase();
    if (/simplii|tell me about yourself|compensation|hybrid|notice/i.test(q)) {
      copy.recruiter = "very_high";
    }
    if (/acceptance criteria|user story|backlog|discovery|onboarding|direct deposit|transfer|payment/i.test(q)) {
      copy.hiring_manager = "very_high";
      copy.cross_functional_panel = "high";
    }
    if (librarySection === "product_banking_knowledge") {
      copy.cross_functional_panel = copy.cross_functional_panel ?? "high";
    }
    return copy;
  }
  return existing;
}

function classifyRow(row) {
  const meta = row.navigator_meta ?? {};
  const moduleId = meta.experienceModuleId ?? "";
  const q = row.question;
  const combined = `${q} ${row.answer}`;

  if (remaps[q] === null) return { disposition: "EXCLUDE_FROM_SIMPLII", reason: "explicit_remap_exclude" };

  if (moduleId === "questrade-temenos") {
    return { disposition: "EXCLUDE_FROM_SIMPLII", reason: "temenos_specific" };
  }
  if (moduleId === "questrade-mcp") {
    if (MCP_EXCLUDE.test(q)) return { disposition: "EXCLUDE_FROM_SIMPLII", reason: "mcp_vendor_specific" };
    if (!MCP_KEEP.test(q) && BRAND_RE.test(q)) {
      return { disposition: "EXCLUDE_FROM_SIMPLII", reason: "mcp_not_generalizable" };
    }
    return { disposition: "RETAIN_AS_GENERAL_BANKING", reason: "mcp_general_ai" };
  }
  if (moduleId === "questrade-hub") {
    if (HUB_EXCLUDE.test(q)) return { disposition: "EXCLUDE_FROM_SIMPLII", reason: "hub_product_specific" };
    if (!HUB_KEEP.test(q) && /questrade|balance sheet/i.test(q)) {
      return { disposition: "EXCLUDE_FROM_SIMPLII", reason: "hub_not_generalizable" };
    }
    return { disposition: "RETAIN_AS_GENERAL_BANKING", reason: "hub_general" };
  }
  if (moduleId.startsWith("questrade-")) {
    return { disposition: "RETAIN_AS_GENERAL_BANKING", reason: "questrade_module_remap" };
  }
  if (answerOverrides[q] || remaps[q]) {
    return { disposition: "REWRITE_FOR_SIMPLII", reason: "curated_override" };
  }
  if (/why questrade|questbank|questrade mcp|questrade's/i.test(q)) {
    return { disposition: "REWRITE_FOR_SIMPLII", reason: "branded_question" };
  }
  if (BRAND_RE.test(combined)) {
    return { disposition: "REUSE_WITH_LIGHT_EDIT", reason: "residual_brand_mentions" };
  }
  return { disposition: "REUSE_UNCHANGED", reason: "universal" };
}

function buildSimpliiRow(source, classification) {
  let question = source.question;
  if (remaps[question] === null) return null;
  if (remaps[question]) question = remaps[question];
  if (BRAND_RE.test(question)) question = transformQuestionBranding(question);

  let answer = source.answer;
  if (answerOverrides[source.question]) answer = answerOverrides[source.question];
  else if (answerOverrides[question]) answer = answerOverrides[question];
  else if (
    classification.disposition === "REUSE_WITH_LIGHT_EDIT" ||
    classification.disposition === "RETAIN_AS_GENERAL_BANKING" ||
    classification.disposition === "REWRITE_FOR_SIMPLII"
  ) {
    answer = neutralizeCaseText(answer);
  }
  if (BRAND_RE.test(answer)) answer = neutralizeCaseText(answer);

  const transformAns = (t) => {
    let out = t;
    if (answerOverrides[source.question]) out = answerOverrides[source.question];
    else if (answerOverrides[question]) out = answerOverrides[question];
    else out = neutralizeCaseText(t);
    if (BRAND_RE.test(out)) out = neutralizeCaseText(out);
    return out;
  };

  const followUps = transformFollowUps(source.follow_ups, transformAns);

  const meta = { ...(source.navigator_meta ?? {}) };
  const srcModule = meta.experienceModuleId ?? "";
  if (MODULE_REMAP[srcModule] === null) return null;
  if (MODULE_REMAP[srcModule]) {
    meta.experienceModuleId = MODULE_REMAP[srcModule];
    meta.experienceLabel = MODULE_LABELS[MODULE_REMAP[srcModule]] ?? meta.experienceLabel;
  }
  if (meta.librarySection === "questrade_cases") {
    meta.librarySection = "product_banking_knowledge";
  }
  if (meta.libraryCategory === "banking_strategy" && meta.experienceModuleId?.startsWith("digital-banking-")) {
    meta.libraryCategory = meta.experienceModuleId.includes("metrics")
      ? "product_analytics"
      : meta.experienceModuleId.includes("payments") || meta.experienceModuleId.includes("ai")
        ? "banking_technical"
        : "banking_strategy";
  }

  meta.cloneSourceQuestradeId = source.id;
  meta.cloneDisposition = classification.disposition;
  meta.sourceProfileId = QUESTRADE_PROFILE_ID;
  meta.sourceFile = "scripts/import-simplii-profile.mjs";
  meta.revisionStatus = meta.revisionStatus === "superseded" ? "superseded" : "current";
  meta.preparationTier = inferPreparationTier(question, meta, meta.experienceModuleId);
  meta.roundRelevance = simpliiRoundRelevance(question, meta.librarySection, meta.roundRelevance);

  return {
    question,
    answer,
    category: source.category,
    is_preferred: source.is_preferred || meta.preparationTier === "P0",
    is_authoritative: source.is_authoritative,
    follow_ups: followUps,
    navigator_meta: meta,
  };
}

const JD_HEADER = `INTERVIEW: Wednesday, October 28, 2026, 12:00–12:45 PM Eastern
STAGE: Initial interview (recruiter, hiring manager, and panel preparation)
PREPARATION STATUS: Active

`;

let JD_BODY = "";
try {
  JD_BODY = readFileSync(resolve(root, "data/migration/simplii-job-description-excerpt.txt"), "utf8");
} catch {
  JD_BODY = "";
}

async function findUserId() {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;
  const user = data.users.find((u) => u.email === seedEmail) ?? data.users[0];
  if (!user) throw new Error("No user found");
  return user.id;
}

async function ensureSimpliiProfile(userId) {
  const jobDescription = JD_HEADER + (JD_BODY || "See uploaded JD_Sr Product Manager.pdf");
  const { data: existing } = await admin
    .from("interview_profiles")
    .select("id")
    .eq("user_id", userId)
    .eq("name", SIMPLII_PROFILE_NAME)
    .maybeSingle();

  if (existing) {
    await admin
      .from("interview_profiles")
      .update({
        employer: "Simplii Financial (CIBC)",
        role_title: "Senior Product Manager",
        job_description: jobDescription,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    return existing.id;
  }

  const { data: created, error } = await admin
    .from("interview_profiles")
    .insert({
      user_id: userId,
      name: SIMPLII_PROFILE_NAME,
      employer: "Simplii Financial (CIBC)",
      role_title: "Senior Product Manager",
      job_description: jobDescription,
    })
    .select("id")
    .single();
  if (error) throw error;
  return created.id;
}

async function main() {
  const userId = await findUserId();

  const { data: questradeRows, error: qErr } = await admin
    .from("prepared_qa")
    .select("*")
    .eq("profile_id", QUESTRADE_PROFILE_ID);
  if (qErr) throw qErr;

  const questradeSnapshot = questradeRows.map((r) => rowHash(r)).sort().join("|");
  const questradeHash = createHash("sha256").update(questradeSnapshot).digest("hex");

  const audit = {
    generatedAt: new Date().toISOString(),
    mode: apply ? "apply" : "dry-run",
    questradeProfileId: QUESTRADE_PROFILE_ID,
    questradeRowCount: questradeRows.length,
    questradeIntegrityHash: questradeHash,
    counts: {
      REUSE_UNCHANGED: 0,
      REUSE_WITH_LIGHT_EDIT: 0,
      REWRITE_FOR_SIMPLII: 0,
      RETAIN_AS_GENERAL_BANKING: 0,
      EXCLUDE_FROM_SIMPLII: 0,
      NEW_SIMPLII_QUESTION: 0,
    },
    excluded: [],
    simpliiRows: [],
  };

  const simpliiProfileId = apply ? await ensureSimpliiProfile(userId) : null;

  const { data: existingSimplii } = apply
    ? await admin.from("prepared_qa").select("id, navigator_meta").eq("profile_id", simpliiProfileId)
    : { data: [] };

  const byCloneId = new Map();
  const byImportKey = new Map();
  for (const r of existingSimplii ?? []) {
    const cid = r.navigator_meta?.cloneSourceQuestradeId;
    if (cid) byCloneId.set(cid, r.id);
    const ik = r.navigator_meta?.simpliiImportKey;
    if (ik) byImportKey.set(ik, r.id);
  }

  const toUpsert = [];

  for (const row of questradeRows) {
    if (isInactive(row.navigator_meta) && row.navigator_meta?.revisionStatus === "superseded") {
      // Keep inactive chain for audit fidelity but still clone as superseded
    } else if (isInactive(row.navigator_meta)) {
      audit.counts.EXCLUDE_FROM_SIMPLII++;
      audit.excluded.push({ id: row.id, question: row.question, reason: "inactive_source" });
      continue;
    }

    const classification = classifyRow(row);
    audit.counts[classification.disposition]++;

    if (classification.disposition === "EXCLUDE_FROM_SIMPLII") {
      audit.excluded.push({ id: row.id, question: row.question, reason: classification.reason });
      continue;
    }

    const built = buildSimpliiRow(row, classification);
    if (!built) {
      audit.counts.EXCLUDE_FROM_SIMPLII++;
      audit.excluded.push({ id: row.id, question: row.question, reason: "build_returned_null" });
      continue;
    }

    toUpsert.push({ sourceId: row.id, ...built });
    audit.simpliiRows.push({
      sourceId: row.id,
      question: built.question,
      disposition: classification.disposition,
    });
  }

  for (const nq of newQuestions) {
    audit.counts.NEW_SIMPLII_QUESTION++;
    toUpsert.push({
      sourceId: null,
      question: nq.question,
      answer: nq.answer,
      category: nq.category,
      is_preferred: nq.isPreferred ?? false,
      is_authoritative: true,
      follow_ups: [],
      navigator_meta: {
        simpliiImportKey: nq.importKey,
        librarySection: nq.librarySection,
        libraryCategory: "leadership_behavioural",
        experienceModuleId: nq.experienceModuleId,
        experienceLabel: MODULE_LABELS[nq.experienceModuleId] ?? nq.experienceModuleId,
        intent: "general",
        evidenceStatus: "resume_supported",
        altPhrasings: [],
        topicTags: [nq.preparationTier],
        keywords: [],
        relatedQuestionIds: [],
        preparationTier: nq.preparationTier,
        roundRelevance: nq.roundRelevance,
        revisionStatus: "current",
        sourceFile: "data/migration/simplii-new-questions.json",
      },
    });
  }

  audit.finalSimpliiCount = toUpsert.length;

  mkdirSync(resolve(root, "data/migration"), { recursive: true });
  writeFileSync(resolve(root, "data/migration/simplii-clone-audit.json"), JSON.stringify(audit, null, 2));

  if (!apply) {
    console.log("Dry run complete. Audit:", resolve(root, "data/migration/simplii-clone-audit.json"));
    console.log("Counts:", audit.counts);
    console.log("Would upsert", toUpsert.length, "Simplii rows");
    return;
  }

  let created = 0;
  let updated = 0;

  for (const item of toUpsert) {
    const payload = {
      user_id: userId,
      profile_id: simpliiProfileId,
      question: item.question,
      answer: item.answer,
      category: item.category,
      is_preferred: item.is_preferred,
      is_authoritative: item.is_authoritative,
      follow_ups: item.follow_ups,
      navigator_meta: item.navigator_meta,
      updated_at: new Date().toISOString(),
    };

    let existingId = item.sourceId ? byCloneId.get(item.sourceId) : null;
    if (!existingId && item.navigator_meta?.simpliiImportKey) {
      existingId = byImportKey.get(item.navigator_meta.simpliiImportKey);
    }

    if (existingId) {
      const { error } = await admin.from("prepared_qa").update(payload).eq("id", existingId);
      if (error) throw error;
      updated++;
    } else {
      const { data, error } = await admin.from("prepared_qa").insert(payload).select("id").single();
      if (error) throw error;
      if (item.sourceId) byCloneId.set(item.sourceId, data.id);
      if (item.navigator_meta?.simpliiImportKey) byImportKey.set(item.navigator_meta.simpliiImportKey, data.id);
      created++;
    }
  }

  const { data: afterQuestrade } = await admin.from("prepared_qa").select("*").eq("profile_id", QUESTRADE_PROFILE_ID);
  const afterHash = createHash("sha256")
    .update(afterQuestrade.map((r) => rowHash(r)).sort().join("|"))
    .digest("hex");

  if (afterHash !== questradeHash) {
    console.error("QUESTRADE INTEGRITY CHECK FAILED");
    process.exit(1);
  }

  console.log("Simplii profile:", simpliiProfileId);
  console.log("Upserted:", { created, updated, total: toUpsert.length });
  console.log("Questrade integrity verified unchanged.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

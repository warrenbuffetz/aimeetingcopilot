#!/usr/bin/env node
/**
 * Read-only audit: Questrade Q&A library from Supabase → docs/*.md + docs/*.json
 * Usage: node scripts/generate-questrade-qa-audit.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

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

const ROUNDS = ["recruiter", "hiring_manager", "cross_functional_panel"];
const ROUND_LABELS = {
  recruiter: "Round 1 — Recruiter",
  hiring_manager: "Round 2 — Hiring Manager",
  cross_functional_panel: "Round 3 — Cross-Functional Panel",
};
const PRIORITY_WEIGHT = { very_high: 4, high: 3, medium: 2, low: 1 };
const LIKELIHOOD_SECTIONS = ["very_high", "high", "medium", "low"];

const PANEL_DISCIPLINE_LABELS = {
  payments_ops: "Money Movement / Payments",
  risk_compliance: "Risk / Compliance",
  finance_economics: "Finance / Treasury",
  engineering_platform: "Engineering / Architecture",
  data_experimentation: "Product Analytics",
  ai_agentic: "AI / Platform",
  general: "Product Leadership",
};

function isInactive(meta) {
  if (!meta) return false;
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

function inferRoundRelevance(row) {
  const m = row.navigator_meta ?? {};
  const section = m.librarySection ?? "";
  const q = row.question.toLowerCase();
  const cat = (row.category ?? "").toLowerCase();
  const base = {
    recruiter: "low",
    hiring_manager: "low",
    cross_functional_panel: "low",
  };

  if (section === "career_motivation" || /motivation|career/i.test(cat)) {
    base.recruiter = "very_high";
    base.hiring_manager = "medium";
    base.cross_functional_panel = "low";
  } else if (section === "questrade_cases" || /case strategy|questbank|questrade/i.test(cat)) {
    base.hiring_manager = "very_high";
    base.cross_functional_panel = "medium";
    base.recruiter = "low";
  } else if (section === "product_banking_knowledge" || /banking knowledge|product & banking/i.test(cat)) {
    base.cross_functional_panel = "very_high";
    base.hiring_manager = "high";
    base.recruiter = "low";
  } else if (section === "product_experience" || /resume|deep dive|experience/i.test(cat)) {
    base.hiring_manager = "high";
    base.cross_functional_panel = "medium";
    base.recruiter = "low";
  } else if (section === "leadership_behavioural" || /leadership|behavioural/i.test(cat)) {
    base.hiring_manager = "high";
    base.cross_functional_panel = "medium";
    base.recruiter = "medium";
  } else {
    base.hiring_manager = "medium";
  }

  if (/compensation|salary|hybrid|availability|notice period/i.test(q)) {
    base.recruiter = "high";
  }
  if (/tell me about yourself|why questrade|why this role|why everyday banking|why leave|why move|walk me through your background/i.test(q)) {
    base.recruiter = "very_high";
    base.hiring_manager = "medium";
  }
  if (/how are you using ai|ai agents rather|measuring ai|claude|chatgpt|cursor/i.test(q)) {
    base.recruiter = "high";
    base.hiring_manager = "high";
  }
  if (/\b(interac|eft|temenos|reconcil|ledger|mcp\b|settlement|exception|straight-through|authorization hold)/i.test(q)) {
    base.cross_functional_panel = "very_high";
    base.hiring_manager = "high";
  }
  if (/primary bank|direct deposit|financial hub|questbank/i.test(q)) {
    base.hiring_manager = "very_high";
  }

  return base;
}

function roundEditorialScore(row, round) {
  const q = row.question.toLowerCase();
  let s = row.is_preferred ? 15 : 0;
  if (round === "recruiter") {
    if (/^tell me about yourself/.test(q)) s += 200;
    if (/why questrade|why this role|expansion into banking|everyday banking appeal/i.test(q)) s += 180;
    if (/why move into everyday banking|why leave|compensation|hybrid/i.test(q)) s += 120;
    if (/how are you using ai in your product management/i.test(q)) s += 160;
    if (/ai agents rather than just chatbots|measuring ai effectiveness|claude|chatgpt|grok|cursor/i.test(q)) s += 90;
    if (/questions (to ask|for the recruiter)|what would you ask/i.test(q)) s += 100;
    if (/business case.*million|cohort analysis|lifetime value|monthly active banking/i.test(q)) s -= 80;
  }
  if (round === "hiring_manager") {
    if (/primary bank|direct deposit|financial hub|questbank|temenos/i.test(q)) s += 100;
    if (/convince existing questrade|reliability versus differentiated|brokerage/i.test(q)) s += 90;
    if (/mcp.*proprietary|mcp platform strategy|ai investment versus banking/i.test(q)) s += 85;
    if (/rbc|hbc|aeroplan|arc'?teryx/i.test(q) && /tell me about|walk me through/i.test(q)) s += 70;
    if (/prioritiz|roadmap|stakeholder|discovery|experiment/i.test(q)) s += 40;
  }
  if (round === "cross_functional_panel") {
    if (/temenos|ledger|transaction status|reconcil|payment exception|straight-through/i.test(q)) s += 120;
    if (/\bmcp\b|model context protocol|agentic|malicious|flows/i.test(q)) s += 100;
    if (/interac|eft|settlement|authorization/i.test(q)) s += 90;
    if (/incorrect ai|evaluate.*ai|data reliability/i.test(q)) s += 80;
  }
  const m = row.navigator_meta ?? {};
  if (m.primaryInterviewRound === round) s += 25;
  return s;
}

function effectiveRoundRelevance(row) {
  const existing = row.navigator_meta?.roundRelevance;
  if (existing && Object.keys(existing).length > 0) {
    return { source: "existing", relevance: { ...existing } };
  }
  return { source: "recommended", relevance: inferRoundRelevance(row) };
}

function panelDisciplineLabel(row) {
  const m = row.navigator_meta ?? {};
  if (m.panelDiscipline && PANEL_DISCIPLINE_LABELS[m.panelDiscipline]) {
    return PANEL_DISCIPLINE_LABELS[m.panelDiscipline];
  }
  const tags = m.topicTags ?? [];
  if (tags.some((t) => /panel:engineering|architecture/i.test(t))) return "Engineering / Architecture";
  if (tags.some((t) => /panel:payments|money/i.test(t))) return "Money Movement / Payments";
  if (tags.some((t) => /panel:risk|compliance/i.test(t))) return "Risk / Compliance";
  if (tags.some((t) => /panel:ai/i.test(t))) return "AI / Platform";
  if (tags.some((t) => /panel:product_leadership/i.test(t))) return "Product Leadership";
  if (m.librarySection === "product_banking_knowledge") return "Engineering / Architecture";
  return "Product Leadership";
}

function assessReadiness(row, primaryRound) {
  const m = row.navigator_meta ?? {};
  const answer = (row.answer ?? "").trim();
  if (!answer) {
    return { readiness: "MISSING", issues: ["No prepared answer text"], refineHints: [] };
  }
  const issues = [];
  const refineHints = [];
  const words = answer.split(/\s+/).length;

  if (m.reviewStatus === "needs_review") {
    issues.push("Marked needs_review in navigator metadata");
    refineHints.push("Resolve review flag after verifying facts and framing");
  }
  if (m.proposedAnswerUpdate) {
    issues.push("Has pending proposedAnswerUpdate in metadata (not applied to answer body)");
  }
  if (m.evidenceStatus === "rehearsal_framework" && /I (built|launched|owned|led) /i.test(answer)) {
    issues.push("Rehearsal/hypothetical evidence status but answer may sound like past employment fact");
    refineHints.push("Clarify Questrade/hypothetical framing when spoken");
  }
  if (primaryRound === "recruiter" && words > 450) {
    issues.push("Long for recruiter round — consider leading with shortAnswer/spoken preview");
    refineHints.push("Open with 60–90 second headline, then offer to go deeper");
  }
  if (primaryRound === "cross_functional_panel" && words < 80 && m.librarySection === "product_banking_knowledge") {
    issues.push("May lack technical depth for panel on banking/architecture topic");
    refineHints.push("Add one concrete boundary, metric, or failure mode if probed");
  }
  if (/dashboard engagement|north star/i.test(answer) && !/\d|%|basis point|bps/i.test(answer)) {
    if (m.intent === "measurement_impact") {
      issues.push("Measurement answer without numeric example");
      refineHints.push("Add one illustrative metric target or guardrail");
    }
  }

  if (issues.length === 0) return { readiness: "READY", issues, refineHints };
  if (issues.some((i) => i.includes("No prepared"))) return { readiness: "MISSING", issues, refineHints };
  return { readiness: "REFINE", issues, refineHints };
}

const INTENT_FOLLOW_ORDER = [
  "main_story",
  "problem_discovery",
  "solution_alternatives",
  "personal_ownership",
  "technical_implementation",
  "measurement_impact",
  "attribution",
  "tradeoffs",
  "challenges_lessons",
  "what_differently",
  "prioritization",
  "general",
];

function buildFollowUpMaps(active, byId, byModule) {
  const maps = [];

  for (const parent of active) {
    const m = parent.navigator_meta ?? {};
    const moduleId = m.experienceModuleId;
    const chain = [];
    const seen = new Set([parent.id]);

    for (const fu of parent.follow_ups ?? []) {
      const t = fu?.question?.trim();
      if (!t) continue;
      const hit = active.find((r) => normQ(r.question) === normQ(t));
      const embeddedAnswer = (fu?.answer ?? "").trim();
      chain.push({
        question: t,
        linkedId: hit?.id ?? null,
        likelihood: "very_high",
        why: hit
          ? "Explicit follow-up on parent record (linked canonical Q&A)"
          : embeddedAnswer
            ? "Explicit follow-up stored on parent record (no separate canonical row)"
            : "Explicit follow-up on parent record",
        missing: !hit && !embeddedAnswer,
        answer: hit?.answer ?? (embeddedAnswer || null),
      });
      if (hit) seen.add(hit.id);
    }

    for (const rid of m.relatedQuestionIds ?? []) {
      const hit = byId.get(rid);
      if (!hit || seen.has(hit.id)) continue;
      chain.push({
        question: hit.question,
        linkedId: hit.id,
        likelihood: "high",
        why: "Linked via relatedQuestionIds metadata",
        missing: false,
        answer: hit.answer,
      });
      seen.add(hit.id);
    }

    if (moduleId && byModule.has(moduleId)) {
      const siblings = byModule
        .get(moduleId)
        .filter((r) => r.id !== parent.id && !seen.has(r.id))
        .sort(
          (a, b) =>
            INTENT_FOLLOW_ORDER.indexOf(a.navigator_meta?.intent ?? "general") -
            INTENT_FOLLOW_ORDER.indexOf(b.navigator_meta?.intent ?? "general")
        );
      for (const sib of siblings.slice(0, 5)) {
        chain.push({
          question: sib.question,
          linkedId: sib.id,
          likelihood: sib.navigator_meta?.intent === "personal_ownership" ? "high" : "medium",
          why: `Same experience module (${moduleId}); typical ${sib.navigator_meta?.intent ?? "general"} probe`,
          missing: false,
          answer: sib.answer,
        });
        seen.add(sib.id);
      }
    }

    if (chain.length === 0) continue;
    maps.push({ parentId: parent.id, parentQuestion: parent.question, followUps: chain });
  }

  maps.sort((a, b) => b.followUps.length - a.followUps.length);
  return maps;
}

function rankInRound(active, round) {
  const rows = active.map((row) => {
    const { source, relevance } = effectiveRoundRelevance(row);
    const level = relevance[round] ?? "low";
    return { row, level, source, relevance, editorial: roundEditorialScore(row, round) };
  });
  rows.sort((a, b) => {
    const pw = PRIORITY_WEIGHT[b.level] - PRIORITY_WEIGHT[a.level];
    if (pw !== 0) return pw;
    return b.editorial - a.editorial;
  });
  let rank = 0;
  const buckets = { very_high: [], high: [], medium: [], low: [] };
  for (const item of rows) {
    rank += 1;
    buckets[item.level].push({ ...item, rankInRound: rank });
  }
  return { buckets, ordered: rows };
}

function mdEscape(s) {
  return (s ?? "").replace(/\|/g, "\\|");
}

function anchorId(id) {
  return `qa-${id}`;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing Supabase env in apps/web/.env.local");
    process.exit(1);
  }

  const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const seedEmail = process.env.SEED_USER_EMAIL ?? "poc-demo@interviewcopilot.app";
  const { data: userList } = await admin.auth.admin.listUsers({ perPage: 200 });
  const user = userList.users.find((u) => u.email === seedEmail);
  if (!user) throw new Error("User not found: " + seedEmail);

  const { data: profiles } = await admin
    .from("interview_profiles")
    .select("id, name")
    .eq("user_id", user.id);
  const profile = profiles?.find((p) => /Questrade/i.test(p.name));
  if (!profile) throw new Error("Questrade profile not found");

  const { data: rows, error } = await admin
    .from("prepared_qa")
    .select(
      "id, question, answer, category, is_preferred, follow_ups, navigator_meta, profile_id, updated_at, created_at"
    )
    .eq("user_id", user.id)
    .eq("profile_id", profile.id)
    .order("question");
  if (error) throw error;

  const fetchedAt = new Date().toISOString();
  const all = rows ?? [];
  const active = all.filter((r) => !isInactive(r.navigator_meta));
  const inactive = all.filter((r) => isInactive(r.navigator_meta));

  const byId = new Map(active.map((r) => [r.id, r]));
  const byModule = new Map();
  for (const r of active) {
    const mod = r.navigator_meta?.experienceModuleId ?? "unset";
    if (!byModule.has(mod)) byModule.set(mod, []);
    byModule.get(mod).push(r);
  }

  const duplicateGroups = [];
  const normToRows = new Map();
  for (const r of active) {
    const n = normQ(r.question);
    if (!normToRows.has(n)) normToRows.set(n, []);
    normToRows.get(n).push(r);
  }
  for (const [, group] of normToRows) {
    if (group.length > 1) duplicateGroups.push(group.map((g) => ({ id: g.id, question: g.question })));
  }

  const altConflicts = [];
  for (const r of active) {
    for (const alt of r.navigator_meta?.altPhrasings ?? []) {
      const hit = active.find((o) => o.id !== r.id && normQ(o.question) === normQ(alt));
      if (hit) {
        altConflicts.push({
          canonicalId: r.id,
          canonicalQuestion: r.question,
          alt,
          conflictsWithId: hit.id,
          conflictsWithQuestion: hit.question,
        });
      }
    }
  }

  const orphanedRelated = [];
  for (const r of active) {
    for (const rid of r.navigator_meta?.relatedQuestionIds ?? []) {
      if (!byId.has(rid) && !inactive.some((i) => i.id === rid)) {
        orphanedRelated.push({ fromId: r.id, fromQuestion: r.question, missingId: rid });
      }
    }
  }

  const followMaps = buildFollowUpMaps(active, byId, byModule);

  let storedRoundRelevanceCount = 0;
  for (const r of active) {
    const rr = r.navigator_meta?.roundRelevance;
    if (rr && Object.keys(rr).length > 0) storedRoundRelevanceCount += 1;
  }

  const inventory = {
    fetchedAt,
    source: "supabase.prepared_qa",
    userEmail: seedEmail,
    profileId: profile.id,
    profileName: profile.name,
    totalFetched: all.length,
    activeCount: active.length,
    inactiveCount: inactive.length,
    storedRoundRelevanceCount,
    inferredRoundRelevanceCount: active.length - storedRoundRelevanceCount,
    byLibrarySection: {},
    byModule: {},
    byRoundAssignment: { recruiter: 0, hiring_manager: 0, cross_functional_panel: 0, none: 0 },
    withEmbeddedFollowUps: 0,
    withRelatedIds: 0,
    missingAnswer: 0,
    embeddingsNote: "search_embeddings not audited in this script",
  };

  for (const r of active) {
    const sec = r.navigator_meta?.librarySection ?? "unset";
    inventory.byLibrarySection[sec] = (inventory.byLibrarySection[sec] ?? 0) + 1;
    const mod = r.navigator_meta?.experienceModuleId ?? "unset";
    inventory.byModule[mod] = (inventory.byModule[mod] ?? 0) + 1;
    if (!(r.answer ?? "").trim()) inventory.missingAnswer += 1;
    if ((r.follow_ups ?? []).length > 0) inventory.withEmbeddedFollowUps += 1;
    if ((r.navigator_meta?.relatedQuestionIds ?? []).length > 0) inventory.withRelatedIds += 1;
    const { relevance } = effectiveRoundRelevance(r);
    let any = false;
    for (const round of ROUNDS) {
      if (relevance[round]) {
        inventory.byRoundAssignment[round] += 1;
        any = true;
      }
    }
    if (!any) inventory.byRoundAssignment.none += 1;
  }

  const jsonRecords = [];
  const roundStats = { recruiter: { very_high: 0, high: 0 }, hiring_manager: { very_high: 0, high: 0 }, cross_functional_panel: { very_high: 0, high: 0 } };

  for (const row of active) {
    const m = row.navigator_meta ?? {};
    const { source, relevance } = effectiveRoundRelevance(row);
    const existingRR = m.roundRelevance ?? {};
    const recommended = inferRoundRelevance(row);
    const existingVsProposedRanking = {};
    for (const round of ROUNDS) {
      const existing = existingRR[round];
      const rec = recommended[round];
      existingVsProposedRanking[round] = {
        existing: existing ?? null,
        recommended: rec,
        changed: existing != null && existing !== rec,
        baselineUsed: source === "existing" ? existing ?? rec : rec,
      };
    }

    const rankByRound = {};
    for (const round of ROUNDS) {
      const { ordered } = rankInRound(active, round);
      const idx = ordered.findIndex((o) => o.row.id === row.id);
      rankByRound[round] = idx >= 0 ? idx + 1 : null;
    }

    const primaryRound =
      m.primaryInterviewRound ??
      ROUNDS.reduce((best, r) => {
        const w = PRIORITY_WEIGHT[relevance[r] ?? "low"];
        const bw = PRIORITY_WEIGHT[relevance[best] ?? "low"];
        return w > bw ? r : best;
      }, "recruiter");

    const assessment = assessReadiness(row, primaryRound);

    for (const round of ROUNDS) {
      const lvl = relevance[round] ?? "low";
      if (lvl === "very_high" || lvl === "high") roundStats[round][lvl] += 1;
    }

    const followUpQuestionIds = [];
    for (const fu of row.follow_ups ?? []) {
      const hit = active.find((r) => normQ(r.question) === normQ(fu?.question));
      if (hit) followUpQuestionIds.push(hit.id);
    }
    for (const rid of m.relatedQuestionIds ?? []) {
      if (byId.has(rid)) followUpQuestionIds.push(rid);
    }

    let rankingRationale = "";
    if (source === "existing") {
      rankingRationale = "Uses persisted navigator_meta.roundRelevance as baseline.";
    } else {
      rankingRationale =
        "No roundRelevance in DB; recommended levels inferred from library section and question keywords (not measured probability).";
    }
    if (existingVsProposedRanking.recruiter.changed || existingVsProposedRanking.hiring_manager.changed || existingVsProposedRanking.cross_functional_panel.changed) {
      rankingRationale += " Some rounds differ between stored and heuristic recommendation — see existingVsProposedRanking.";
    }

    jsonRecords.push({
      id: row.id,
      canonicalQuestion: m.canonicalQuestion ?? row.question,
      fullAnswer: row.answer,
      librarySection: m.librarySection ?? null,
      experienceModuleId: m.experienceModuleId ?? null,
      experienceLabel: m.experienceLabel ?? null,
      questionIntent: m.intent ?? null,
      roundRelevance: relevance,
      rankByRound,
      rankingRationale,
      followUpQuestionIds: [...new Set(followUpQuestionIds)],
      embeddedFollowUps: row.follow_ups ?? [],
      answerReadiness: assessment.readiness,
      readinessIssues: assessment.issues,
      refineHints: assessment.refineHints,
      evidenceStatus: m.evidenceStatus ?? null,
      reviewStatus: m.reviewStatus ?? null,
      existingVsProposedRanking,
      roundRelevanceSource: source,
      importKey: m.importKey ?? null,
      altPhrasings: m.altPhrasings ?? [],
      panelDiscipline: panelDisciplineLabel(row),
      primaryInterviewRound: primaryRound,
      inactive: false,
    });
  }

  const topByRound = {};
  for (const round of ROUNDS) {
    const { ordered } = rankInRound(active, round);
    topByRound[round] = ordered.slice(0, 10).map((o, i) => ({
      rank: i + 1,
      id: o.row.id,
      question: o.row.question,
      likelihood: o.level,
    }));
  }

  const overallScore = (r) => {
    const { relevance } = effectiveRoundRelevance(r);
    return ROUNDS.reduce((s, round) => s + PRIORITY_WEIGHT[relevance[round] ?? "low"], 0);
  };
  const top20Overall = [...active]
    .sort((a, b) => overallScore(b) - overallScore(a))
    .slice(0, 20)
    .map((r, i) => ({ rank: i + 1, id: r.id, question: r.question, score: overallScore(r) }));

  const refineList = jsonRecords.filter((r) => r.answerReadiness === "REFINE");
  const missingList = jsonRecords.filter((r) => r.answerReadiness === "MISSING");

  const coverageChecks = {
    whyQuestradeBankingExpansion: active.some((r) => /why.*questrade|expansion into banking|everyday banking now/i.test(r.question)),
    primaryFinancialInstitution: active.some((r) => /primary bank|primary banking|primary account/i.test(r.question)),
    investingToBanking: active.some((r) => /investing|investor|brokerage/i.test(r.question) && /bank|questbank/i.test(r.question)),
    directDeposit: active.some((r) => /direct deposit/i.test(r.question)),
    competitors: active.some((r) => /tangerine|simplii|wealthsimple|rbc|td/i.test(r.question + r.answer)),
    temenos: active.some((r) => /temenos|core banking/i.test(r.question)),
    financialHub: active.some((r) => /financial hub/i.test(r.question)),
    mcp: active.some((r) => /\bMCP\b|model context protocol/i.test(r.question + r.answer)),
    mcpVsNative: active.some((r) => /proprietary|native ai|build.*assistant/i.test(r.question)),
    mcpVsFlows: active.some((r) => /flows/i.test(r.question) && /mcp/i.test(r.question.toLowerCase())),
    agentPermissions: active.some((r) => /consent|approval|authorization|malicious/i.test(r.question)),
    personalAiTools: active.some((r) => /cursor|chatgpt|claude|grok|ai in your/i.test(r.question + r.answer)),
    aiReliability: active.some((r) => /incorrect|reliability|evaluate.*ai/i.test(r.question)),
  };

  mkdirSync(resolve(root, "docs"), { recursive: true });
  const jsonOut = {
    meta: inventory,
    inactiveRecords: inactive.map((r) => ({
      id: r.id,
      question: r.question,
      revisionStatus: r.navigator_meta?.revisionStatus,
      supersededByQuestion: r.navigator_meta?.supersededByQuestion,
    })),
    coverageChecks,
    topByRound,
    top20Overall,
    followUpMaps: followMaps.map((m) => ({
      parentId: m.parentId,
      parentQuestion: m.parentQuestion,
      followUps: m.followUps.map((f) => ({
        question: f.question,
        linkedId: f.linkedId,
        likelihood: f.likelihood,
        why: f.why,
        missing: f.missing,
      })),
    })),
    records: jsonRecords,
  };
  writeFileSync(resolve(root, "docs/questrade-interview-ranked-inventory.json"), JSON.stringify(jsonOut, null, 2) + "\n");

  const lines = [];
  lines.push("# Questrade Interview Copilot — Complete Q&A Library Audit");
  lines.push("");
  lines.push(`**Generated:** ${fetchedAt}  `);
  lines.push(`**Source of truth:** Supabase \`prepared_qa\` for profile **${profile.name}** (\`${profile.id}\`)  `);
  lines.push(`**User:** ${seedEmail}  `);
  lines.push("");
  lines.push("> Rankings are **qualitative editorial estimates**, not statistical probabilities. Stored `roundRelevance` in the database is preserved as baseline where present.");
  lines.push("");
  lines.push("## Table of contents");
  lines.push("");
  lines.push("1. [Executive Summary](#1-executive-summary)");
  lines.push("2. [Library Inventory and Counts](#2-library-inventory-and-counts)");
  lines.push("3. [Round 1 — Recruiter](#3-round-1--recruiter)");
  lines.push("4. [Round 2 — Hiring Manager](#4-round-2--hiring-manager)");
  lines.push("5. [Round 3 — Cross-Functional Panel](#5-round-3--cross-functional-panel)");
  lines.push("6. [Follow-Up Question Maps](#6-follow-up-question-maps)");
  lines.push("7. [Complete Canonical Answer Reference](#7-complete-canonical-answer-reference)");
  lines.push("8. [Duplicate and Contradictory Answers](#8-duplicate-and-contradictory-answers)");
  lines.push("9. [Weak or Missing Answers](#9-weak-or-missing-answers)");
  lines.push("10. [Recommended Content Improvements](#10-recommended-content-improvements)");
  lines.push("11. [Top 20 Questions Overall](#11-top-20-questions-overall)");
  lines.push("12. [Appendix — Every Active Q&A Record ID](#12-appendix--every-active-qa-record-id)");
  lines.push("");

  lines.push("## 1. Executive Summary");
  lines.push("");
  lines.push(`- **Active prepared Q&As:** ${active.length} (fetched ${all.length} total for this profile; ${inactive.length} inactive/superseded)`);
  lines.push(`- **Unique canonical questions (active):** ${normToRows.size}`);
  lines.push(`- **Very High / High by round:** Recruiter ${roundStats.recruiter.very_high + roundStats.recruiter.high} (VH ${roundStats.recruiter.very_high}, H ${roundStats.recruiter.high}); HM ${roundStats.hiring_manager.very_high + roundStats.hiring_manager.high}; Panel ${roundStats.cross_functional_panel.very_high + roundStats.cross_functional_panel.high}`);
  lines.push(`- **Embedded follow-up arrays:** ${inventory.withEmbeddedFollowUps} parent records`);
  lines.push(`- **REFINE flagged:** ${refineList.length}; **MISSING:** ${missingList.length}`);
  lines.push(
    `- **Round rankings:** ${storedRoundRelevanceCount} rows use stored \`navigator_meta.roundRelevance\`; ${active.length - storedRoundRelevanceCount} use **recommended** inference (section/category/keywords) — see JSON \`roundRelevanceSource\`.`
  );
  lines.push("");
  lines.push("### Questrade / AI coverage (presence in active library)");
  lines.push("");
  for (const [k, v] of Object.entries(coverageChecks)) {
    lines.push(`- ${k}: ${v ? "✓ covered" : "⚠ gap or partial"}`);
  }
  lines.push("");

  lines.push("## 2. Library Inventory and Counts");
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("| --- | ---: |");
  lines.push(`| Total rows fetched (profile-scoped) | ${all.length} |`);
  lines.push(`| Active | ${active.length} |`);
  lines.push(`| Inactive (superseded/archived/excluded) | ${inactive.length} |`);
  lines.push(`| Missing answer body | ${inventory.missingAnswer} |`);
  lines.push(`| With round assignment (any round) | ${active.length - inventory.byRoundAssignment.none} |`);
  lines.push(`| Without round assignment | ${inventory.byRoundAssignment.none} |`);
  lines.push("");
  lines.push("### By library section");
  lines.push("");
  for (const [k, v] of Object.entries(inventory.byLibrarySection).sort((a, b) => b[1] - a[1])) {
    lines.push(`- **${k}:** ${v}`);
  }
  lines.push("");
  lines.push("### Inactive / superseded records (not in round rankings)");
  lines.push("");
  for (const r of inactive) {
    lines.push(`- \`${r.id}\` — ${r.question} (${r.navigator_meta?.revisionStatus ?? "excluded"})`);
  }
  lines.push("");

  function renderRoundSection(num, round) {
    lines.push(`## ${num}. ${ROUND_LABELS[round]}`);
    lines.push("");
    const { buckets } = rankInRound(active, round);
    const labels = { very_high: "A. Very High Likelihood", high: "B. High Likelihood", medium: "C. Medium Likelihood", low: "D. Low Likelihood" };
    for (const lvl of LIKELIHOOD_SECTIONS) {
      lines.push(`### ${labels[lvl]}`);
      lines.push("");
      const items = buckets[lvl];
      if (items.length === 0) {
        lines.push("_None._");
        lines.push("");
        continue;
      }
      lines.push("| Rank | ID | Likelihood | Module | Intent | Question |");
      lines.push("| ---: | --- | --- | --- | --- | --- |");
      let localRank = 0;
      for (const item of items) {
        localRank += 1;
        const r = item.row;
        const m = r.navigator_meta ?? {};
        const src = item.source === "existing" ? "stored" : "inferred";
        lines.push(
          `| ${localRank} | [${r.id.slice(0, 8)}…](${anchorId(r.id)}) | ${lvl} (${src}) | ${mdEscape(m.experienceModuleId ?? "—")} | ${m.intent ?? "—"} | ${mdEscape(r.question)} |`
        );
      }
      lines.push("");
    }
    if (round === "cross_functional_panel") {
      lines.push("### Panel discipline tags (active questions)");
      lines.push("");
      lines.push("| ID | Discipline | Question |");
      lines.push("| --- | --- | --- |");
      for (const r of active) {
        const { relevance } = effectiveRoundRelevance(r);
        if (PRIORITY_WEIGHT[relevance.cross_functional_panel ?? "low"] < 2) continue;
        lines.push(`| ${r.id.slice(0, 8)}… | ${panelDisciplineLabel(r)} | ${mdEscape(r.question)} |`);
      }
      lines.push("");
    }
  }

  renderRoundSection(3, "recruiter");
  renderRoundSection(4, "hiring_manager");
  renderRoundSection(5, "cross_functional_panel");

  lines.push("## 6. Follow-Up Question Maps");
  lines.push("");
  for (const map of followMaps) {
    lines.push(`### Parent: [${map.parentQuestion}](${anchorId(map.parentId)}) (\`${map.parentId}\`)`);
    lines.push("");
    let i = 0;
    for (const fu of map.followUps) {
      i += 1;
      const link = fu.linkedId ? `[${fu.question}](${anchorId(fu.linkedId)})` : fu.question;
      lines.push(`${i}. ${link} — **${fu.likelihood}** — ${fu.why}${fu.missing ? " **MISSING canonical record**" : ""}`);
    }
    lines.push("");
  }

  lines.push("## 7. Complete Canonical Answer Reference");
  lines.push("");
  lines.push("Full verbatim answers (active library).");
  lines.push("");
  for (const r of active.sort((a, b) => a.question.localeCompare(b.question))) {
    const m = r.navigator_meta ?? {};
    lines.push(`<a id="${anchorId(r.id)}"></a>`);
    lines.push("");
    lines.push(`### ${r.question}`);
    lines.push("");
    lines.push(`- **ID:** \`${r.id}\``);
    lines.push(`- **Section:** ${m.librarySection ?? "—"} | **Module:** ${m.experienceModuleId ?? "—"} | **Intent:** ${m.intent ?? "—"}`);
    lines.push(`- **Evidence:** ${m.evidenceStatus ?? "—"} | **Review:** ${m.reviewStatus ?? "—"}`);
    const { relevance, source } = effectiveRoundRelevance(r);
    lines.push(
      `- **Round relevance (${source}):** recruiter=${relevance.recruiter ?? "—"}, hiring_manager=${relevance.hiring_manager ?? "—"}, panel=${relevance.cross_functional_panel ?? "—"}`
    );
    if ((m.altPhrasings ?? []).length) lines.push(`- **Alt phrasings:** ${m.altPhrasings.map((a) => `"${a}"`).join("; ")}`);
    if (m.importKey) lines.push(`- **Import key:** ${m.importKey}`);
    lines.push("");
    lines.push("**Answer:**");
    lines.push("");
    lines.push(r.answer);
    lines.push("");
    if ((r.follow_ups ?? []).length) {
      lines.push("**Embedded follow-ups (on this record):**");
      for (const fu of r.follow_ups) {
        lines.push(`- ${fu.question}`);
      }
      lines.push("");
    }
    if (m.supplementalTalkingPoints?.length) {
      for (const st of m.supplementalTalkingPoints) {
        lines.push(`**Supplemental — ${st.label}**`);
        lines.push("");
        lines.push(st.content);
        lines.push("");
      }
    }
    lines.push("---");
    lines.push("");
  }

  lines.push("## 8. Duplicate and Contradictory Answers");
  lines.push("");
  if (duplicateGroups.length === 0) lines.push("No exact duplicate canonical question text among active rows.");
  else {
    for (const g of duplicateGroups) {
      lines.push(`- Duplicate group: ${g.map((x) => `\`${x.id}\` ${x.question}`).join(" | ")}`);
    }
  }
  lines.push("");
  if (altConflicts.length) {
    lines.push("### Alt phrasing matches another canonical question");
    for (const c of altConflicts) {
      lines.push(`- \`${c.canonicalId}\` alt "${c.alt}" → same as \`${c.conflictsWithId}\` ${c.conflictsWithQuestion}`);
    }
  }
  lines.push("");
  if (orphanedRelated.length) {
    lines.push("### Orphaned relatedQuestionIds");
    for (const o of orphanedRelated) {
      lines.push(`- \`${o.fromId}\` references missing id \`${o.missingId}\``);
    }
  }
  lines.push("");

  lines.push("## 9. Weak or Missing Answers");
  lines.push("");
  for (const r of [...missingList, ...refineList]) {
    lines.push(`- **${r.answerReadiness}** — \`${r.id}\` — ${r.canonicalQuestion}`);
    for (const issue of r.readinessIssues) lines.push(`  - ${issue}`);
  }
  lines.push("");

  lines.push("## 10. Recommended Content Improvements");
  lines.push("");
  for (const r of refineList.slice(0, 40)) {
    lines.push(`### ${r.canonicalQuestion}`);
    for (const h of r.refineHints) lines.push(`- ${h}`);
    lines.push("");
  }
  if (refineList.length > 40) lines.push(`_(${refineList.length - 40} additional REFINE entries — see JSON export.)_`);
  lines.push("");

  lines.push("## 11. Top 20 Questions Overall");
  lines.push("");
  lines.push("| Rank | ID | Composite score | Question |");
  lines.push("| ---: | --- | ---: | --- |");
  for (const t of top20Overall) {
    lines.push(`| ${t.rank} | ${t.id.slice(0, 8)}… | ${t.score} | ${mdEscape(t.question)} |`);
  }
  lines.push("");

  lines.push("## 12. Appendix — Every Active Q&A Record ID");
  lines.push("");
  lines.push("| ID | Question | Section |");
  lines.push("| --- | --- | --- |");
  for (const r of active.sort((a, b) => a.id.localeCompare(b.id))) {
    lines.push(`| \`${r.id}\` | ${mdEscape(r.question)} | ${r.navigator_meta?.librarySection ?? "—"} |`);
  }
  lines.push("");

  writeFileSync(resolve(root, "docs/questrade-interview-complete-qa-audit.md"), lines.join("\n"));

  console.log("Audit complete.");
  console.log("Active Q&A:", active.length, "Inactive:", inactive.length);
  console.log("Wrote docs/questrade-interview-complete-qa-audit.md");
  console.log("Wrote docs/questrade-interview-ranked-inventory.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

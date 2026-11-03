#!/usr/bin/env node
/**
 * Generates OpenTable — Bristol (Focused) curated JSON, canonical answer bundle,
 * and GPT authoring backlog. Does not modify Questrade/Simplii sources.
 */
import fs from "node:fs";
import path from "node:path";
import {
  buildBattlecard,
  buildIndustryPovQuestions,
  buildIndustryReferenceQuestion,
  buildLiveScenarios,
  buildPhilosophyQuestions,
  buildUpdatedP0Prediction,
  buildWeaknessTracker,
  buildWeaknessTrackerMd,
  buildP0Md,
  SCENARIO_JUDGMENT_FRAMEWORK,
} from "./bristol-addendum-content.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const EXPORT = path.join(ROOT, "exports/questrade_interview_library.json");
const OPENTABLE = path.join(ROOT, "imports/opentable_final_qa.json");
const OUT_DIR = path.join(ROOT, "data/opentable-bristol");
const APP_DATA = path.join(ROOT, "apps/web/src/data/bristol-focused-curated.json");
const CANONICAL_OUT = path.join(ROOT, "apps/web/src/data/bristol-canonical-answers.json");

const NEEDS_GPT =
  "_Answer not authored yet for this profile. Status: needs_gpt_draft. Do not speak this placeholder in interview._";

/** @type {Record<string, string>} */
const SHARED_UUID_BY_KEY = {
  "shared-interac-e2e": "244e239c-2f88-4b6e-968f-ef8ce65daa70",
  "shared-stakeholder-disagreement": "a6c0e8b0-8f6a-4c0a-9c8e-8d6e8f0a1b2c", // resolved below
  "shared-influence": "b8e2c4d6-1a3f-4e5b-9c7d-2f4e6a8b0c1d",
  "shared-failure": "c9f3d5e7-2b4a-5f6c-0d8e-3a5f7b9c1d2e",
  "shared-ambiguity": "d0a4e6f8-3c5b-6a7d-1e9f-4b6a8c0d2e4f",
  "shared-prioritization-arcteryx": "e1b5f7a9-4d6c-7b8e-2f0a-5c7b9d1e3f5a",
  "shared-prioritization-rbc": "f2c6a8b0-5e7d-8c9f-3a1b-6d8c0e2f4a6b",
  "shared-experimentation": "244e239c-2f88-4b6e-968f-ef8ce65daa70",
};

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function findQuestradeId(records, predicate) {
  const hit = records.find((r) => r.status !== "inactive" && predicate(r));
  return hit?.id ?? null;
}

function resolveSharedIds(records) {
  SHARED_UUID_BY_KEY["shared-stakeholder-disagreement"] = findQuestradeId(
    records,
    (r) => /stakeholder disagreements often come from people optimizing/i.test(r.answer ?? "")
  );
  SHARED_UUID_BY_KEY["shared-influence"] =
    findQuestradeId(records, (r) => /reporting authority to establish direction/i.test(r.answer ?? "")) ??
    "20f12afb-0dbb-49eb-821e-01989453d828";
  SHARED_UUID_BY_KEY["shared-failure"] = findQuestradeId(records, (r) =>
    /weren't able to launch the full membership|didn't go as planned/i.test(r.answer ?? "")
  );
  SHARED_UUID_BY_KEY["shared-ambiguity"] = findQuestradeId(records, (r) =>
    /incomplete information|ambiguous/i.test(r.question ?? "")
  );
  SHARED_UUID_BY_KEY["shared-prioritization-arcteryx"] = findQuestradeId(records, (r) =>
    /membership program at Arc'teryx|web-first and deferring the full mobile/i.test(r.answer ?? "")
  );
  SHARED_UUID_BY_KEY["shared-prioritization-rbc"] = findQuestradeId(records, (r) =>
    /Avion Select was opening|native travel experience would have improved/i.test(r.answer ?? "")
  );
  SHARED_UUID_BY_KEY["shared-experimentation"] = findQuestradeId(records, (r) =>
    /A\/B|experiment/i.test(r.question ?? "") && /HBC|abandonment/i.test(r.answer ?? "")
  );
}

function q(curatedKey, fields) {
  return { curatedKey, canonicalAnswerId: null, opentableRecordId: null, answer: "", ...fields };
}

function buildQuestions() {
  const career = [
    q("B01", {
      category: "Career & Motivation",
      title: "Tell me about yourself.",
      navigationLabel: "Tell me about yourself",
      priority: 0,
      opentableRecordId: "opentable-rec-001",
      evidenceStatus: "resume_supported",
      suggestedPinned: true,
      aliases: ["Walk me through your background", "Overview"],
    }),
    q("B02", {
      category: "Career & Motivation",
      title: "Why OpenTable?",
      priority: 0,
      opentableRecordId: "opentable-rec-002",
      evidenceStatus: "resume_supported",
      suggestedPinned: true,
      aliases: ["Why do you want to work at OpenTable"],
    }),
    q("B03", {
      category: "Career & Motivation",
      title: "Why are you interested in the Restaurant Product team specifically?",
      priority: 0,
      opentableRecordId: "opentable-rec-003",
      evidenceStatus: "resume_supported",
      suggestedPinned: true,
    }),
    q("B04", {
      category: "Career & Motivation",
      title: "Why are you looking for a new opportunity now?",
      priority: 1,
      opentableRecordId: "opentable-rec-004",
      evidenceStatus: "resume_supported",
    }),
    q("B05", {
      category: "Career & Motivation",
      title: "Why move into hospitality and AI/ML product management?",
      priority: 1,
      opentableRecordId: "opentable-rec-005",
      evidenceStatus: "needs_verification",
      answerStatus: "needs_gpt_draft",
    }),
    q("B06", {
      category: "Career & Motivation",
      title: "What makes your background relevant when you haven't owned a production AI/ML product end to end?",
      priority: 0,
      opentableRecordId: "opentable-rec-006",
      evidenceStatus: "needs_verification",
      suggestedPinned: true,
      aliases: ["AI/ML gap", "Production ML experience"],
    }),
    ...buildPhilosophyQuestions(q),
  ];

  const restaurantTitles = [
    "How would you develop a product strategy to increase revenue for OpenTable's restaurant partners?",
    "Where do you see the biggest untapped revenue opportunities in the restaurant reservation lifecycle?",
    "If you joined OpenTable, how would you identify and prioritize your first product opportunity?",
    "How would you improve restaurant profitability without compromising the diner experience?",
    "How would you approach optimizing restaurant table inventory and utilization?",
    "How would you prioritize between restaurant acquisition, operational efficiency, repeat diners and increased revenue per guest?",
    "How do you balance restaurant-side outcomes with the health of a two-sided marketplace?",
    "How would you segment restaurants to find differentiated product opportunities?",
    "How would you differentiate OpenTable's restaurant product from competing restaurant technology platforms?",
    "What would your first 90 days and initial product strategy look like?",
  ];

  const restaurant = restaurantTitles.map((title, i) =>
    q(`B${String(7 + i).padStart(2, "0")}`, {
      category: "Restaurant Product & Marketplace Strategy",
      title,
      navigationLabel: title.length > 72 ? `${title.slice(0, 69)}…` : title,
      priority: i < 4 ? 0 : 1,
      answerStatus: "needs_gpt_draft",
      evidenceStatus: "hypothetical",
      suggestedPinned: i === 0 || i === 2 || i === 9,
      aliases:
        i === 4
          ? ["RevPASH", "table utilization", "yield optimization"]
          : i === 6
            ? ["marketplace", "two-sided marketplace"]
            : i === 9
              ? ["first 90 days", "30 60 90"]
              : [],
    })
  );

  const aiTitles = [
    "What is the most compelling 0-to-1 AI/ML product you would explore for OpenTable?",
    "How do you decide whether a problem requires machine learning, rules-based automation or a simpler product solution?",
    "How would you use predictive models to help restaurants increase revenue?",
    "How would you evaluate an AI-powered product before committing to a full build?",
    "What data would you need to build a demand forecasting or revenue optimization model?",
    "How would you measure the quality of the model and its actual commercial impact?",
    "How would you address cold-start problems for smaller or newer restaurants?",
    "How would you build restaurant operator trust in AI-generated recommendations?",
    "How would you balance automation, human control, explainability and operational safety?",
    "How would you move an AI/ML product from prototype to production?",
  ];

  const aiMl = aiTitles.map((title, i) =>
    q(`B${String(17 + i).padStart(2, "0")}`, {
      category: "AI/ML & Revenue Optimization",
      title,
      navigationLabel: title.length > 72 ? `${title.slice(0, 69)}…` : title,
      priority: i === 0 || i === 1 || i === 5 ? 0 : 1,
      answerStatus: "needs_gpt_draft",
      evidenceStatus: "hypothetical",
      suggestedPinned: i === 0 || i === 1,
      aliases:
        i === 0
          ? ["0-to-1 AI", "machine learning product"]
          : i === 2
            ? ["predictive modeling", "forecasting"]
            : [],
    })
  );

  const econTitles = [
    "Walk me through the reservation lifecycle from diner discovery to completed restaurant visit.",
    "What would be your North Star metric for OpenTable's Restaurant Product team?",
    "Which metrics would you use to measure restaurant revenue optimization?",
    "How would you distinguish increased reservations from genuine incremental restaurant revenue?",
    "How would you measure and reduce the economic impact of no-shows and late cancellations?",
    "What would you investigate if restaurant bookings increased but profitability remained unchanged?",
  ];

  const economics = econTitles.map((title, i) =>
    q(`B${String(27 + i).padStart(2, "0")}`, {
      category: "Restaurant Economics, Workflows & Metrics",
      title,
      priority: i === 1 || i === 2 || i === 4 ? 0 : 1,
      answerStatus: i === 0 ? "needs_gpt_draft" : "needs_gpt_draft",
      evidenceStatus: i === 0 ? "reference" : "hypothetical",
      suggestedPinned: i === 1 || i === 4,
      aliases:
        i === 4 ? ["no-show", "cancellation", "recovered covers"] : i === 1 ? ["north star"] : ["RevPASH", "incremental revenue"],
    })
  );

  const metricRefs = [
    "Seated covers, bookings and show rate",
    "Booking conversion and demand capture",
    "Seat and table utilization",
    "Revenue per available seat-hour (RevPASH)",
    "Average check and contribution margin",
    "Table turn times, party-size mix and reservation pacing",
    "Cancellation recovery and waitlist conversion",
    "Repeat dining and guest lifetime value",
    "Restaurant product adoption, retention and churn",
    "Incremental revenue versus revenue cannibalization",
    "Experiment guardrail metrics",
  ];

  const metricReference = metricRefs.map((title, i) =>
    q(`B-R${String(i + 1).padStart(2, "0")}`, {
      category: "Restaurant Economics, Workflows & Metrics",
      title,
      navigationLabel: title,
      priority: 2,
      recordType: "reference",
      answerStatus: "needs_gpt_draft",
      evidenceStatus: "reference",
      accuracyNote: "Reference concept — concise definition and OpenTable vs restaurant outcome distinction pending GPT authoring.",
    })
  );

  const craftTitles = [
    "How would you validate a restaurant revenue opportunity before building the solution?",
    "Design an experiment to increase restaurant revenue during off-peak periods.",
    "How would you test an AI-generated recommendation with restaurant operators?",
    "How would you structure an A/B experiment when restaurants and diners can affect one another?",
    "How would you evaluate whether an apparently successful experiment creates genuine incremental value?",
    "How would you prioritize three competing restaurant AI/ML opportunities with limited engineering and data science capacity?",
    "How would you approach a 0-to-1 launch with uncertain data quality and incomplete infrastructure?",
  ];

  const craft = craftTitles.map((title, i) =>
    q(`B${String(33 + i).padStart(2, "0")}`, {
      category: "Product Craft, Discovery & Experimentation",
      title,
      priority: i === 1 || i === 4 ? 0 : 1,
      answerStatus: "needs_gpt_draft",
      evidenceStatus: "hypothetical",
      suggestedPinned: i === 1 || i === 4,
      aliases: i === 1 ? ["off-peak", "growth experiment"] : i === 3 ? ["A/B test", "marketplace experiment"] : [],
    })
  );

  const experimentRefs = [
    "No-show mitigation and targeted confirmations",
    "Late-cancellation backfill and waitlist matching",
    "Off-peak demand stimulation",
    "Guest retention and personalized CRM",
    "Restaurant operator decision recommendations",
    "Reservation pacing optimization",
    "Turn-time prediction and capacity optimization",
    "Diner discovery and conversion improvements",
  ];

  const experimentReference = experimentRefs.map((title, i) =>
    q(`B-E${String(i + 1).padStart(2, "0")}`, {
      category: "Product Craft, Discovery & Experimentation",
      title: `Experiment reference: ${title}`,
      navigationLabel: title,
      priority: 2,
      recordType: "reference",
      answerStatus: "needs_gpt_draft",
      evidenceStatus: "reference",
      accuracyNote:
        "Template: Opportunity → Hypothesis → Target segment → Intervention → Test design → Primary metric → Guardrails → Decision rule → Commercial impact",
    })
  );

  const experience = [
    q("B40", {
      category: "Experience Stories",
      title: "Walk me through the RBC Interac cashback withdrawal product end to end.",
      priority: 0,
      sharedKey: "shared-interac-e2e",
      evidenceStatus: "grounded",
      suggestedPinned: true,
      projectTags: ["RBC"],
      aliases: ["Interac e-Transfer", "RBC payouts", "cashback withdrawal"],
    }),
    q("B41", {
      category: "Experience Stories",
      title: "Tell me about expanding Avion to non-RBC customers (Avion Select).",
      priority: 1,
      opentableRecordId: "opentable-rec-008",
      evidenceStatus: "grounded",
      projectTags: ["RBC"],
    }),
    q("B42", {
      category: "Experience Stories",
      title: "Tell me about HBC Mastercard growth and funnel experimentation.",
      priority: 1,
      opentableRecordId: "opentable-rec-009",
      evidenceStatus: "grounded",
      projectTags: ["HBC"],
      aliases: ["HBC abandonment", "Mastercard"],
    }),
    q("B43", {
      category: "Experience Stories",
      title: "Tell me about building Arc'teryx membership from zero to one.",
      priority: 0,
      opentableRecordId: "opentable-rec-010",
      evidenceStatus: "grounded",
      suggestedPinned: true,
      projectTags: ["Arc'teryx"],
    }),
    q("B44", {
      category: "Experience Stories",
      title: "Tell me about Aeroplan acquisition and conversion optimization.",
      priority: 2,
      opentableRecordId: "opentable-rec-011",
      evidenceStatus: "grounded",
      projectTags: ["Aeroplan"],
    }),
    q("B45", {
      category: "Experience Stories",
      title: "Tell me about a customer problem you identified and solved — ShopPlus.",
      priority: 1,
      opentableRecordId: "opentable-rec-012",
      evidenceStatus: "grounded",
      projectTags: ["RBC"],
      aliases: ["ShopPlus", "browser extension"],
    }),
    q("B46", {
      category: "Experience Stories",
      title: "Tell me about your Ensights startup experience.",
      priority: 2,
      opentableRecordId: "opentable-rec-013",
      evidenceStatus: "grounded",
      projectTags: ["Ensights"],
    }),
    q("B47", {
      category: "Experience Stories",
      title: "RBC Avion overview — scope and impact.",
      priority: 2,
      opentableRecordId: "opentable-rec-014",
      evidenceStatus: "grounded",
      projectTags: ["RBC"],
    }),
    q("B48", {
      category: "Experience Stories",
      title: "Arc'teryx overview — current responsibilities.",
      priority: 2,
      opentableRecordId: "opentable-rec-015",
      evidenceStatus: "grounded",
      projectTags: ["Arc'teryx"],
    }),
  ];

  const leadership = [
    q("B49", {
      category: "Leadership & Judgment",
      title: "How do you handle disagreement with engineering or design?",
      sharedKey: "shared-stakeholder-disagreement",
      priority: 1,
      evidenceStatus: "grounded",
    }),
    q("B50", {
      category: "Leadership & Judgment",
      title: "How do you influence stakeholders without authority?",
      sharedKey: "shared-influence",
      priority: 1,
      evidenceStatus: "grounded",
    }),
    q("B51", {
      category: "Leadership & Judgment",
      title: "Tell me about a time something didn't go as planned.",
      sharedKey: "shared-failure",
      priority: 1,
      evidenceStatus: "grounded",
    }),
    q("B52", {
      category: "Leadership & Judgment",
      title: "How do you make decisions with incomplete information?",
      sharedKey: "shared-ambiguity",
      priority: 0,
      evidenceStatus: "grounded",
      suggestedPinned: true,
    }),
    q("B53", {
      category: "Leadership & Judgment",
      title: "How do you prioritize with limited resources and competing stakeholders?",
      sharedKey: "shared-prioritization-arcteryx",
      priority: 0,
      evidenceStatus: "grounded",
      suggestedPinned: true,
    }),
    q("B54", {
      category: "Leadership & Judgment",
      title: "Tell me about prioritizing between two important initiatives.",
      sharedKey: "shared-prioritization-rbc",
      priority: 1,
      evidenceStatus: "grounded",
    }),
    q("B55", {
      category: "Leadership & Judgment",
      title: "How do you navigate stakeholder disagreement on product direction?",
      sharedKey: "shared-stakeholder-disagreement",
      priority: 2,
      evidenceStatus: "grounded",
      answerStatus: "shared_duplicate",
      accuracyNote: "Alternative phrasing — same canonical story as B49.",
    }),
    q("B56", {
      category: "Leadership & Judgment",
      title: "How do you recover from a launch or delivery setback?",
      priority: 2,
      answerStatus: "needs_gpt_draft",
      evidenceStatus: "grounded",
    }),
    q("B57", {
      category: "Leadership & Judgment",
      title: "How do you communicate difficult decisions to executives?",
      priority: 2,
      answerStatus: "needs_gpt_draft",
      evidenceStatus: "grounded",
    }),
    q("B58", {
      category: "Leadership & Judgment",
      title: "How do you lead cross-functional initiatives under time pressure?",
      priority: 2,
      answerStatus: "needs_gpt_draft",
      evidenceStatus: "grounded",
    }),
  ];

  return [
    ...career,
    ...buildIndustryPovQuestions(q),
    buildIndustryReferenceQuestion(q),
    ...buildLiveScenarios(q),
    ...restaurant,
    ...aiMl,
    ...economics,
    ...metricReference,
    ...craft,
    ...experimentReference,
    ...experience,
    ...leadership,
  ];
}

function stripQuestradeClosing(answer) {
  if (!answer) return answer;
  const markers = [
    /\n\nWhat interests me about Questrade[\s\S]*$/i,
    /\n\nThat's what makes Questrade's everyday-banking opportunity[\s\S]*$/i,
    /\n\nThat's partly what interested me about Questrade[\s\S]*$/i,
  ];
  let out = answer;
  for (const re of markers) out = out.replace(re, "");
  return out.trim();
}

/** When curated JSON was imported with full answers, only refresh mirrors/backlog — do not overwrite. */
function syncMirrorsFromImportedCurated(curated) {
  const questions = curated.questions ?? [];
  const backlog = [];
  for (const item of questions) {
    const prepTier = item.priority === 0 ? "P0" : item.priority === 1 ? "P1" : "P2";
    const body = String(item.answer ?? "");
    const needsDraft = body.includes("needs_gpt_draft") || !body.trim();
    let source = "New";
    if (item.opentableRecordId?.startsWith("opentable-bristol-")) source = "OpenTable-specific";
    else if (item.canonicalAnswerId) source = "Shared";
    else if (item.opentableRecordId) source = "OpenTable-specific";

    backlog.push({
      questionId: item.curatedKey,
      category: item.category,
      question: item.title,
      priority: prepTier,
      source,
      backlogType:
        item.backlogType ??
        (item.recordType === "scenario"
          ? "live_scenario"
          : item.recordType === "industry_reference"
            ? "industry_reference"
            : "general"),
      currentAnswer: needsDraft ? "Needs GPT authoring" : "Ready",
      recommendedStory: (item.projectTags ?? []).join(", ") || null,
      strategicConcepts: item.recordType === "reference" ? item.title : null,
      followUps: (item.followUps ?? []).map((f) => f.question).filter(Boolean),
      status: needsDraft ? "Needs GPT authoring" : "Ready",
      canonicalAnswerId: item.canonicalAnswerId ?? null,
      opentableRecordId: item.opentableRecordId ?? null,
    });
  }

  const authoringBacklogByType = {
    industry_pov: backlog.filter((b) => b.backlogType === "industry_pov"),
    industry_reference: backlog.filter((b) => b.backlogType === "industry_reference"),
    live_scenario: backlog.filter((b) => b.backlogType === "live_scenario"),
    personal_philosophy: backlog.filter((b) => b.backlogType === "personal_philosophy"),
    strategic_prioritization: backlog.filter(
      (b) => b.category?.includes("Restaurant Product") || b.backlogType === "industry_pov"
    ),
    ai_ml_strategy: backlog.filter((b) => b.category?.includes("AI/ML")),
    general: backlog.filter((b) => b.backlogType === "general" && b.status !== "Ready"),
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(APP_DATA, `${JSON.stringify(curated, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_DIR, "bristol-focused-curated.json"), `${JSON.stringify(curated, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_DIR, "answer-authoring-backlog.json"), `${JSON.stringify(backlog, null, 2)}\n`);
  fs.writeFileSync(
    path.join(OUT_DIR, "answer-authoring-backlog-by-type.json"),
    `${JSON.stringify(authoringBacklogByType, null, 2)}\n`
  );

  const p0 = curated.p0Prediction?.p0 ?? [];
  const md = [
    "# OpenTable — Bristol (Focused) — answer backlog (imported)",
    "",
    `Synced: ${new Date().toISOString()}`,
    "",
    "## P0 prediction",
    "",
    p0.map((b) => `- **${b.id}** [${b.area}] — ${b.reason}`).join("\n") || "_See curated p0Prediction_",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "answer-authoring-backlog.md"), md);

  if (curated.weaknessTracker?.length) {
    fs.writeFileSync(path.join(OUT_DIR, "WEAKNESS_TRACKER.md"), buildWeaknessTrackerMd(curated.weaknessTracker));
  }
  if (curated.p0Prediction) {
    fs.writeFileSync(path.join(OUT_DIR, "P0_PREDICTION.md"), buildP0Md(curated.p0Prediction));
  }

  console.log(`Synced mirrors for ${questions.length} imported questions`);
}

function main() {
  const FORCE = process.env.BRISTOL_FORCE_REGEN === "1";

  if (!FORCE && fs.existsSync(APP_DATA)) {
    const existing = loadJson(APP_DATA);
    const rows = existing.questions ?? [];
    const importedComplete =
      rows.length >= 111 &&
      rows.every((q) => {
        const body = String(q.answer ?? "");
        return body.length > 40 && !body.includes("needs_gpt_draft");
      });
    if (importedComplete) {
      syncMirrorsFromImportedCurated(existing);
      console.log(
        `Preserved imported curated profile (${rows.length} questions). Set BRISTOL_FORCE_REGEN=1 to rebuild from seeds.`
      );
      return;
    }
  }

  const exportData = loadJson(EXPORT);
  const otData = loadJson(OPENTABLE);
  resolveSharedIds(exportData.records);

  const otById = new Map(otData.records.map((r) => [r.externalId, r]));
  const qtById = new Map(exportData.records.map((r) => [r.id, r]));

  const questions = buildQuestions();
  const canonicalBundle = { version: 1, questrade: {}, opentable: {} };
  const backlog = [];

  for (const item of questions) {
    if (item.sharedKey) {
      const uuid = SHARED_UUID_BY_KEY[item.sharedKey];
      item.canonicalAnswerId = uuid;
      if (uuid && qtById.has(uuid)) {
        const rec = qtById.get(uuid);
        canonicalBundle.questrade[uuid] = {
          question: rec.question,
          answer: stripQuestradeClosing(rec.answer),
          shortAnswer: rec.navigatorMeta?.shortAnswer ?? "",
          evidenceStatus: "grounded",
        };
      }
    }
    if (item.opentableRecordId && otById.has(item.opentableRecordId)) {
      const rec = otById.get(item.opentableRecordId);
      canonicalBundle.opentable[item.opentableRecordId] = {
        question: rec.canonicalQuestion,
        answer: rec.answer,
        shortAnswer: rec.shortAnswer ?? "",
        evidenceStatus: rec.evidenceStatus ?? "resume_supported",
      };
    }

    let currentAnswer = "reused";
    let source = "New";
    if (item.opentableRecordId && canonicalBundle.opentable[item.opentableRecordId]) {
      source = "OpenTable-specific";
      item.answer = canonicalBundle.opentable[item.opentableRecordId].answer;
      currentAnswer = "Reused";
    } else if (item.canonicalAnswerId && canonicalBundle.questrade[item.canonicalAnswerId]) {
      source = "Shared";
      item.answer = canonicalBundle.questrade[item.canonicalAnswerId].answer;
      currentAnswer = item.answerStatus === "shared_duplicate" ? "Reused" : "Reused";
    } else if (item.recordType === "reference" || item.recordType === "industry_reference") {
      source = "New";
      item.answer = "";
      currentAnswer = "Missing";
    } else if (item.recordType === "scenario") {
      source = "New";
      item.answer = NEEDS_GPT;
      currentAnswer = "Missing";
    } else if (item.answerStatus === "needs_gpt_draft" || !item.answer) {
      item.answer = NEEDS_GPT;
      currentAnswer = "Missing";
      source = item.category?.includes("Restaurant") || item.category?.includes("AI") ? "OpenTable-specific" : "New";
    }

    delete item.sharedKey;
    item.followUps = item.followUps ?? [];
    item.aliases = item.aliases ?? [];
    item.projectTags = item.projectTags ?? [];
    item.accuracyNote = item.accuracyNote ?? "";
    item.suggestedPinned = Boolean(item.suggestedPinned);
    if (!item.navigationLabel?.trim()) item.navigationLabel = item.title;
    item.answerStatus = item.answerStatus ?? (currentAnswer === "Missing" ? "needs_gpt_draft" : "ready");

    const prepTier =
      item.priority === 0 ? "P0" : item.priority === 1 ? "P1" : "P2";

    backlog.push({
      questionId: item.curatedKey,
      category: item.category,
      question: item.title,
      priority: prepTier,
      source,
      backlogType: item.backlogType ?? (item.recordType === "scenario" ? "live_scenario" : item.recordType === "industry_reference" ? "industry_reference" : "general"),
      currentAnswer: currentAnswer === "Reused" ? "Reused" : item.recordType === "reference" || item.recordType === "industry_reference" ? "Missing" : "Needs GPT authoring",
      recommendedStory: (item.projectTags ?? []).join(", ") || null,
      strategicConcepts: item.recordType === "reference" ? item.title : null,
      followUps: (item.followUps ?? []).map((f) => f.question).filter(Boolean),
      status: item.answer.includes("needs_gpt_draft") || !item.answer?.trim() ? "Needs GPT authoring" : "Ready",
      canonicalAnswerId: item.canonicalAnswerId,
      opentableRecordId: item.opentableRecordId,
    });
  }

  const authoringBacklogByType = {
    industry_pov: backlog.filter((b) => b.backlogType === "industry_pov"),
    industry_reference: backlog.filter((b) => b.backlogType === "industry_reference"),
    live_scenario: backlog.filter((b) => b.backlogType === "live_scenario"),
    personal_philosophy: backlog.filter((b) => b.backlogType === "personal_philosophy"),
    strategic_prioritization: backlog.filter(
      (b) => b.category?.includes("Restaurant Product") || b.backlogType === "industry_pov"
    ),
    ai_ml_strategy: backlog.filter((b) => b.category?.includes("AI/ML")),
    general: backlog.filter((b) => b.backlogType === "general" && b.status !== "Ready"),
  };

  const questionsForBristol = [
    {
      topic: "Restaurant revenue opportunity",
      tier: "primary",
      badge: "Priority 1",
      question:
        "Where do you see the biggest untapped opportunity in restaurant revenue optimization today?",
      note: "Topic placeholder — phrase in your own words.",
    },
    {
      topic: "Experimentation vs reliability",
      tier: "primary",
      badge: "Priority 2",
      question:
        "How does the Restaurant Product team balance experimentation with shipping and operational reliability?",
    },
    {
      topic: "AI/ML vs conventional product",
      tier: "primary",
      badge: "Priority 3",
      question:
        "How is the team thinking about AI/ML opportunities versus more conventional product improvements?",
    },
    {
      topic: "0-to-1 autonomy",
      tier: "primary",
      badge: "Priority 4",
      question: "How much autonomy would this Senior PM have in defining the 0-to-1 roadmap?",
    },
    {
      topic: "Success in first year",
      tier: "backup",
      badge: "Backup",
      question: "What would meaningful success look like for this hire in the first six to twelve months?",
    },
    {
      topic: "Support through ambiguity",
      tier: "backup",
      badge: "Backup",
      question:
        "How do you approach supporting PMs through ambiguity, difficult trade-offs and changing priorities?",
      note: "Does not assume Bristol's reporting structure.",
    },
  ];

  const curated = {
    profile: "OpenTable — Bristol (Focused)",
    profileSlug: "bristol",
    contentNotes: {
      jazInterviewLearnings:
        "Nov 3, 2026 Questrade/Jaz: prioritize decisive industry POV, constraint-driven product promise changes, second-order effects, concise structure. Scenarios are preparation hypotheses only.",
      opentableProductAwareness:
        "Table Automations and Turn Times/Availability Insights already exist on OpenTable — do not pitch basic versions as original 0-to-1 ideas.",
      aiMlHonesty:
        "Do not claim production AI/ML ownership; distinguish professional work from independent prototypes.",
      questradeIsolation: "Questrade-specific overrides must not resolve into this profile.",
    },
    scenarioJudgmentFramework: SCENARIO_JUDGMENT_FRAMEWORK,
    battlecard: buildBattlecard(),
    weaknessTracker: buildWeaknessTracker(),
    p0Prediction: buildUpdatedP0Prediction(),
    questions,
    questionsForBristol,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(APP_DATA, `${JSON.stringify(curated, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_DIR, "bristol-focused-curated.json"), `${JSON.stringify(curated, null, 2)}\n`);
  fs.writeFileSync(CANONICAL_OUT, `${JSON.stringify(canonicalBundle, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_DIR, "answer-authoring-backlog.json"), `${JSON.stringify(backlog, null, 2)}\n`);
  fs.writeFileSync(
    path.join(OUT_DIR, "answer-authoring-backlog-by-type.json"),
    `${JSON.stringify(authoringBacklogByType, null, 2)}\n`
  );

  const p0 = buildUpdatedP0Prediction().p0;
  const md = [
    "# OpenTable — Bristol (Focused) — GPT answer backlog",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## P0 prediction (" + p0.length + " items — experience + industry + scenarios)",
    "",
    p0.map((b) => `- **${b.id}** [${b.area}] — ${b.reason}`).join("\n"),
    "",
    "See `answer-authoring-backlog.json` for full table.",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "answer-authoring-backlog.md"), md);

  fs.writeFileSync(path.join(OUT_DIR, "WEAKNESS_TRACKER.md"), buildWeaknessTrackerMd(buildWeaknessTracker()));
  fs.writeFileSync(path.join(OUT_DIR, "P0_PREDICTION.md"), buildP0Md(buildUpdatedP0Prediction()));

  console.log(`Wrote ${questions.length} questions, ${questionsForBristol.length} questions for Bristol`);
  console.log(`Canonical bundle: ${Object.keys(canonicalBundle.questrade).length} shared, ${Object.keys(canonicalBundle.opentable).length} opentable`);
}

main();

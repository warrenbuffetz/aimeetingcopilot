#!/usr/bin/env node
/**
 * Generate OpenTable hiring-manager question predictions and review markdown (no answers).
 */
import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";
import { OPENTABLE_APPROVED_RECORDS } from "../data/migration/opentable-approved-records.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const reviewDir = resolve(root, "data/review");

/** @type {import('../data/review/opentable_question_predictions.types').OpentablePrediction[]} */
const rankedPredictions = [
  {
    rank: 1,
    predictionId: "opentable-pred-hm-001",
    canonicalQuestion:
      "The JD requires demonstrated experience shipping AI/ML products, but your resume is mostly non-ML launches. Why should we believe you can lead this?",
    alternativePhrasings: [
      "You haven't led an enterprise ML launch — what makes you ready for this role?",
      "How do we reconcile your background with our minimum qualification on AI/ML shipping?",
    ],
    interviewRound: "hiring_manager",
    likelihood: "Very High",
    justification:
      "Minimum qualification explicitly requires building and shipping AI/ML-powered products; candidate narrative distinguishes personal AI apps from production ML.",
    existingAnswerImportKey: "opentable-rec-008",
    recommendedExperience: "Honest framing + Queen's MMA + personal apps + commercial PM launches",
    coverageStatus: "Ready",
    contextualFollowUps: ["opentable-pred-hm-001-fu1", "opentable-pred-hm-001-fu2"],
  },
  {
    rank: 2,
    predictionId: "opentable-pred-hm-001-fu1",
    canonicalQuestion: "What would you need from ML engineering and data science in your first 90 days?",
    alternativePhrasings: ["How would you onboard on OpenTable's data and models?"],
    interviewRound: "hiring_manager",
    likelihood: "High",
    justification: "Natural follow-up when production ML experience is challenged.",
    existingAnswerImportKey: "opentable-rec-012",
    recommendedExperience: "Cross-functional partnership pattern (RBC, Arc'teryx)",
    coverageStatus: "Adapt",
    parentPredictionId: "opentable-pred-hm-001",
    contextualFollowUps: [],
  },
  {
    rank: 3,
    predictionId: "opentable-pred-hm-001-fu2",
    canonicalQuestion: "Tell me about a time you had to learn a new technical domain quickly to ship a product.",
    alternativePhrasings: ["How did you ramp on payments infrastructure at RBC?"],
    interviewRound: "hiring_manager",
    likelihood: "High",
    justification: "Tests transferable learning velocity for restaurant ML domain.",
    existingAnswerImportKey: "opentable-rec-005",
    recommendedExperience: "RBC Interac e-Transfer launch",
    coverageStatus: "Adapt",
    parentPredictionId: "opentable-pred-hm-001",
    contextualFollowUps: [],
  },
  {
    rank: 4,
    predictionId: "opentable-pred-hm-002",
    canonicalQuestion:
      "Walk me through how you would take a 0-to-1 AI revenue feature from ambiguous problem to launch.",
    alternativePhrasings: [
      "Describe your end-to-end process for a new AI/ML restaurant product.",
      "How do you go from concept to launch for 0-to-1 AI products?",
    ],
    interviewRound: "hiring_manager",
    likelihood: "Very High",
    justification: "Core responsibility: lead end-to-end 0-to-1 AI/ML-powered products.",
    existingAnswerImportKey: "opentable-rec-010",
    recommendedExperience: "Combine opentable-rec-010 + opentable-rec-013 (scope/learn first)",
    coverageStatus: "Adapt",
    contextualFollowUps: ["opentable-pred-hm-002-fu1"],
  },
  {
    rank: 5,
    predictionId: "opentable-pred-hm-002-fu1",
    canonicalQuestion: "What would you prototype first versus put on the roadmap for v2?",
    alternativePhrasings: ["How do you decide MVP scope for an ML feature?"],
    interviewRound: "hiring_manager",
    likelihood: "High",
    justification: "JD emphasizes rapid prototype/test/iterate with eng and design.",
    existingAnswerImportKey: "opentable-rec-013",
    recommendedExperience: "Arc'teryx Sperro SV vs full platform",
    coverageStatus: "Ready",
    parentPredictionId: "opentable-pred-hm-002",
    contextualFollowUps: [],
  },
  {
    rank: 6,
    predictionId: "opentable-pred-hm-003",
    canonicalQuestion:
      "Where would you look first in OpenTable data to find incremental restaurant revenue opportunities?",
    alternativePhrasings: [
      "How would you use analytics to prioritize the revenue roadmap?",
      "What signals tell you a restaurant is leaving money on the table?",
    ],
    interviewRound: "hiring_manager",
    likelihood: "Very High",
    justification: "Responsibility to use data analytics to identify revenue opportunities and prioritize roadmap.",
    existingAnswerImportKey: "opentable-rec-010",
    recommendedExperience: "Framework answer + ask discovery questions",
    coverageStatus: "Adapt",
    contextualFollowUps: ["opentable-pred-hm-003-fu1"],
  },
  {
    rank: 7,
    predictionId: "opentable-pred-hm-003-fu1",
    canonicalQuestion: "How would you validate demand forecasting before investing in a sophisticated model?",
    alternativePhrasings: ["Would you start with rules before ML for demand prediction?"],
    interviewRound: "hiring_manager",
    likelihood: "High",
    justification: "Tests pragmatic ML sequencing aligned with perishable capacity economics.",
    existingAnswerImportKey: "opentable-rec-010",
    recommendedExperience: "Experiment-first narrative in approved answer",
    coverageStatus: "Ready",
    parentPredictionId: "opentable-pred-hm-003",
    contextualFollowUps: [],
  },
  {
    rank: 8,
    predictionId: "opentable-pred-hm-004",
    canonicalQuestion:
      "How would you design an experiment to prove a revenue recommendation actually increased covers, not just shifted bookings?",
    alternativePhrasings: [
      "How do you measure incrementality for restaurant revenue features?",
      "What holdout design would you use for a fill-empty-tables feature?",
    ],
    interviewRound: "hiring_manager",
    likelihood: "Very High",
    justification: "JD requires measuring impact of shipped features; marketplace incrementality is non-trivial.",
    existingAnswerImportKey: "opentable-rec-011",
    recommendedExperience: "HBC holdout experiments (opentable-rec-007) + opentable-rec-011",
    coverageStatus: "Adapt",
    contextualFollowUps: ["opentable-pred-hm-004-fu1"],
  },
  {
    rank: 9,
    predictionId: "opentable-pred-hm-004-fu1",
    canonicalQuestion: "What guardrail metrics would you monitor so revenue tactics don't hurt service quality?",
    alternativePhrasings: ["How do you balance revenue vs guest experience vs staff load?"],
    interviewRound: "hiring_manager",
    likelihood: "High",
    justification: "Approved success answer mentions operational downsides; HM will pressure-test.",
    existingAnswerImportKey: "opentable-rec-011",
    recommendedExperience: "Extend measurement answer with ops guardrails",
    coverageStatus: "Adapt",
    parentPredictionId: "opentable-pred-hm-004",
    contextualFollowUps: [],
  },
  {
    rank: 10,
    predictionId: "opentable-pred-hm-005",
    canonicalQuestion:
      "Describe a product case: unfilled tables on Friday at 7pm — what would you build and why?",
    alternativePhrasings: [
      "How would AI help a restaurant fill off-peak or last-minute capacity?",
      "Walk me through a yield-management feature for perishable restaurant capacity.",
    ],
    interviewRound: "hiring_manager",
    likelihood: "Very High",
    justification: "Role focus on revenue optimization and perishable capacity; preferred yield/pricing background.",
    existingAnswerImportKey: null,
    recommendedExperience: "Synthesize opentable-rec-010/011; add OpenTable-specific product case",
    coverageStatus: "Missing",
    contextualFollowUps: ["opentable-pred-hm-005-fu1"],
  },
  {
    rank: 11,
    predictionId: "opentable-pred-hm-005-fu1",
    canonicalQuestion: "Would you recommend discounts, pacing reservations, or reallocation across shifts — how do you decide?",
    alternativePhrasings: ["When is discounting the wrong lever for empty tables?"],
    interviewRound: "hiring_manager",
    likelihood: "High",
    justification: "Tests pricing/yield judgment beyond generic forecasting.",
    existingAnswerImportKey: null,
    recommendedExperience: "HBC incentive economics + marketplace diner/restaurant trade-offs",
    coverageStatus: "Missing",
    parentPredictionId: "opentable-pred-hm-005",
    contextualFollowUps: [],
  },
  {
    rank: 12,
    predictionId: "opentable-pred-hm-006",
    canonicalQuestion: "How do you prioritize the roadmap when executives want multiple AI bets at once?",
    alternativePhrasings: [
      "Tell me about aligning executives on product trade-offs.",
      "How do you say no to an AI idea from leadership?",
    ],
    interviewRound: "hiring_manager",
    likelihood: "Very High",
    justification: "JD: align cross-functional stakeholders and executives around priorities and trade-offs.",
    existingAnswerImportKey: "opentable-rec-014",
    recommendedExperience: "Arc'teryx membership stakeholder trade-offs",
    coverageStatus: "Ready",
    contextualFollowUps: [],
  },
  {
    rank: 13,
    predictionId: "opentable-pred-hm-007",
    canonicalQuestion:
      "How would you translate restaurant revenue goals into a product narrative engineering and design can execute?",
    alternativePhrasings: ["How do you build a compelling strategy narrative for a new AI product?"],
    interviewRound: "hiring_manager",
    likelihood: "High",
    justification: "Explicit JD responsibility on product narrative guiding shared outcomes.",
    existingAnswerImportKey: null,
    recommendedExperience: "Arc'teryx funding narrative + HBC commercial framing",
    coverageStatus: "Missing",
    contextualFollowUps: [],
  },
  {
    rank: 14,
    predictionId: "opentable-pred-hm-008",
    canonicalQuestion:
      "Tell me about a time you improved revenue or engagement with experimentation — what did you measure?",
    alternativePhrasings: ["Walk me through a controlled experiment that moved commercial outcomes."],
    interviewRound: "hiring_manager",
    likelihood: "Very High",
    justification: "Preferred rapid experimentation; strong overlap with HBC portfolio story.",
    existingAnswerImportKey: "opentable-rec-007",
    recommendedExperience: "HBC active cardholder + spend lift",
    coverageStatus: "Ready",
    contextualFollowUps: ["opentable-pred-hm-008-fu1"],
  },
  {
    rank: 15,
    predictionId: "opentable-pred-hm-008-fu1",
    canonicalQuestion: "What would you do if the experiment won on volume but lost on margin?",
    alternativePhrasings: ["How do you trade off short-term revenue vs profitability?"],
    interviewRound: "hiring_manager",
    likelihood: "High",
    justification: "Restaurant promos and incentives have similar economics to HBC incentives.",
    existingAnswerImportKey: "opentable-rec-007",
    recommendedExperience: "Extend HBC LTV / incentive profitability angle",
    coverageStatus: "Adapt",
    parentPredictionId: "opentable-pred-hm-008",
    contextualFollowUps: [],
  },
  {
    rank: 16,
    predictionId: "opentable-pred-hm-009",
    canonicalQuestion:
      "How do you partner with ML engineers on model selection — when is a simpler model good enough?",
    alternativePhrasings: [
      "How do you decide between rules, classical ML, and LLM-based approaches?",
      "What criteria do you use to pick a model for a restaurant revenue use case?",
    ],
    interviewRound: "hiring_manager",
    likelihood: "Very High",
    justification: "Advanced AI/ML fluency preferred; role requires pragmatic shipping with eng.",
    existingAnswerImportKey: "opentable-rec-019",
    recommendedExperience: "Personal semantic retrieval project trade-offs",
    coverageStatus: "Adapt",
    contextualFollowUps: ["opentable-pred-panel-001"],
  },
  {
    rank: 17,
    predictionId: "opentable-pred-panel-001",
    canonicalQuestion:
      "How would you evaluate offline model quality versus online business impact for a demand forecast?",
    alternativePhrasings: ["What metrics would ML and product disagree on, and how do you reconcile them?"],
    interviewRound: "cross_functional_panel",
    likelihood: "Very High",
    justification: "Panel probes ML evaluation beyond PM-friendly language in JD.",
    existingAnswerImportKey: "opentable-rec-011",
    recommendedExperience: "Combine measurement + ML evaluation framework (needs ChatGPT)",
    coverageStatus: "Missing",
    parentPredictionId: "opentable-pred-hm-009",
    contextualFollowUps: [],
  },
  {
    rank: 18,
    predictionId: "opentable-pred-panel-002",
    canonicalQuestion:
      "What is your approach to hallucinations, unsafe recommendations, or low-confidence predictions in a restaurant-facing AI feature?",
    alternativePhrasings: [
      "How do you design guardrails when an LLM recommends revenue actions?",
      "When would you refuse to show a model suggestion to an operator?",
    ],
    interviewRound: "cross_functional_panel",
    likelihood: "Very High",
    justification: "Emerging-tech 0-to-1 AI products require reliability and trust for operators.",
    existingAnswerImportKey: "opentable-rec-008",
    recommendedExperience: "Personal apps reliability + RBC controls mindset",
    coverageStatus: "Adapt",
    contextualFollowUps: ["opentable-pred-panel-002-fu1"],
  },
  {
    rank: 19,
    predictionId: "opentable-pred-panel-002-fu1",
    canonicalQuestion: "How do latency and token cost factor into your product requirements for AI features?",
    alternativePhrasings: ["When would you cache, distill, or use a smaller model?"],
    interviewRound: "cross_functional_panel",
    likelihood: "High",
    justification: "Candidate cites latency/token cost in personal projects; panel will generalize to production.",
    existingAnswerImportKey: "opentable-rec-019",
    recommendedExperience: "Interview copilot / semantic search project",
    coverageStatus: "Adapt",
    parentPredictionId: "opentable-pred-panel-002",
    contextualFollowUps: [],
  },
  {
    rank: 20,
    predictionId: "opentable-pred-panel-003",
    canonicalQuestion:
      "Describe system architecture at a whiteboard level for an AI feature that recommends actions to restaurants.",
    alternativePhrasings: [
      "What data pipelines and serving layer would you expect?",
      "How would you phase build vs buy for ML infrastructure?",
    ],
    interviewRound: "cross_functional_panel",
    likelihood: "High",
    justification: "Cross-functional panel validates technical collaboration with ML eng and data science.",
    existingAnswerImportKey: "opentable-rec-012",
    recommendedExperience: "High-level architecture narrative (needs ChatGPT)",
    coverageStatus: "Missing",
    contextualFollowUps: [],
  },
  {
    rank: 21,
    predictionId: "opentable-pred-hm-010",
    canonicalQuestion:
      "How do you balance diner experience with restaurant revenue when incentives conflict?",
    alternativePhrasings: [
      "Tell me about managing two-sided marketplace tensions.",
      "What if filling tables hurts premium guest experience?",
    ],
    interviewRound: "hiring_manager",
    likelihood: "High",
    justification: "Preferred two-sided marketplace experience; OpenTable core dynamic.",
    existingAnswerImportKey: "opentable-rec-015",
    recommendedExperience: "Aeroplan partners + HBC incentives",
    coverageStatus: "Ready",
    contextualFollowUps: [],
  },
  {
    rank: 22,
    predictionId: "opentable-pred-hm-011",
    canonicalQuestion: "What is your framework for pricing and promotions in a marketplace you don't fully control?",
    alternativePhrasings: ["How would you think about yield management without owning menu prices?"],
    interviewRound: "hiring_manager",
    likelihood: "High",
    justification: "Preferred revenue management / pricing / yield optimization experience.",
    existingAnswerImportKey: null,
    recommendedExperience: "HBC promotional economics; adapt to restaurant promos/fees",
    coverageStatus: "Missing",
    contextualFollowUps: [],
  },
  {
    rank: 23,
    predictionId: "opentable-pred-hm-012",
    canonicalQuestion: "Tell me about a launch that underperformed — what did you change?",
    alternativePhrasings: ["Describe a product bet that didn't work and how you responded."],
    interviewRound: "hiring_manager",
    likelihood: "High",
    justification: "Standard HM judgment question for ambiguous 0-to-1 role.",
    existingAnswerImportKey: null,
    recommendedExperience: "Reuse verified HBC activation or Questrade/Simplii library story if imported later",
    coverageStatus: "Missing",
    contextualFollowUps: [],
  },
  {
    rank: 24,
    predictionId: "opentable-pred-hm-013",
    canonicalQuestion: "How would you define success in your first 6 months in this role?",
    alternativePhrasings: ["What would you deliver in the first two quarters?"],
    interviewRound: "hiring_manager",
    likelihood: "Medium",
    justification: "High-visibility role; HM tests expectations and prioritization.",
    existingAnswerImportKey: null,
    recommendedExperience: "Discovery + thin slice launch + measurement plan",
    coverageStatus: "Missing",
    contextualFollowUps: [],
  },
  {
    rank: 25,
    predictionId: "opentable-pred-hm-014",
    canonicalQuestion:
      "You're still leading membership at Arc'teryx — why OpenTable now, before the platform fully launches?",
    alternativePhrasings: ["Why leave Arc'teryx with $5.2M committed?"],
    interviewRound: "hiring_manager",
    likelihood: "High",
    justification: "Follow-up on career transition; tests commitment and handover.",
    existingAnswerImportKey: "opentable-rec-016",
    recommendedExperience: "Selective move + OpenTable AI/commercial fit",
    coverageStatus: "Ready",
    contextualFollowUps: [],
  },
  {
    rank: 26,
    predictionId: "opentable-pred-panel-004",
    canonicalQuestion: "How would you monitor model drift after launch for a seasonality-heavy restaurant demand model?",
    alternativePhrasings: ["What triggers a retrain or rollback?"],
    interviewRound: "cross_functional_panel",
    likelihood: "Medium",
    justification: "Restaurant demand is seasonal/event-driven; tests production ML ops awareness.",
    existingAnswerImportKey: null,
    recommendedExperience: "Queen's MMA + personal ML ops talking points",
    coverageStatus: "Missing",
    contextualFollowUps: [],
  },
  {
    rank: 27,
    predictionId: "opentable-pred-panel-005",
    canonicalQuestion:
      "Walk through how your semantic matching side project informs retrieval design for a copilot or operator assistant.",
    alternativePhrasings: ["How does your interview copilot experience translate to restaurant tools?"],
    interviewRound: "cross_functional_panel",
    likelihood: "High",
    justification: "Candidate's strongest hands-on AI story; panel will deep-dive engineering choices.",
    existingAnswerImportKey: "opentable-rec-019",
    recommendedExperience: "AI Meeting Copilot / semantic matching (careful: personal vs production)",
    coverageStatus: "Adapt",
    contextualFollowUps: ["opentable-pred-panel-005-fu1"],
  },
  {
    rank: 28,
    predictionId: "opentable-pred-panel-005-fu1",
    canonicalQuestion: "How did you evaluate retrieval accuracy versus user trust in that application?",
    alternativePhrasings: ["What failure modes did you see in semantic matching?"],
    interviewRound: "cross_functional_panel",
    likelihood: "High",
    justification: "Follow-up on embeddings/RAG quality from approved answer themes.",
    existingAnswerImportKey: "opentable-rec-019",
    recommendedExperience: "Extend opentable-rec-019 with eval approach",
    coverageStatus: "Adapt",
    parentPredictionId: "opentable-pred-panel-005",
    contextualFollowUps: [],
  },
  {
    rank: 29,
    predictionId: "opentable-pred-hm-015",
    canonicalQuestion: "How do you decide when an AI feature is ready for GA versus extended pilot?",
    alternativePhrasings: ["What launch criteria would you require for operator-facing ML?"],
    interviewRound: "hiring_manager",
    likelihood: "High",
    justification: "Ship-fast culture vs restaurant operational risk.",
    existingAnswerImportKey: "opentable-rec-013",
    recommendedExperience: "Scope/learn-first + operational guardrails",
    coverageStatus: "Adapt",
    contextualFollowUps: [],
  },
  {
    rank: 30,
    predictionId: "opentable-pred-hm-016",
    canonicalQuestion:
      "Tell me about influencing engineers when you disagreed on build vs experiment.",
    alternativePhrasings: ["How do you partner with design and engineering when opinions differ?"],
    interviewRound: "hiring_manager",
    likelihood: "Medium",
    justification: "Partner closely with engineering and design to iterate — conflict is common in 0-to-1 AI.",
    existingAnswerImportKey: "opentable-rec-014",
    recommendedExperience: "Stakeholder alignment story",
    coverageStatus: "Adapt",
    contextualFollowUps: [],
  },
  {
    rank: 31,
    predictionId: "opentable-pred-hm-017",
    canonicalQuestion: "How would you use OpenTable's diner-side data responsibly to help restaurants without creeping guests out?",
    alternativePhrasings: ["How do you think about privacy and data use in a two-sided marketplace?"],
    interviewRound: "hiring_manager",
    likelihood: "Medium",
    justification: "Marketplace data ethics for AI personalization and revenue features.",
    existingAnswerImportKey: null,
    recommendedExperience: "RBC data/controls sensitivity + marketplace framing",
    coverageStatus: "Missing",
    contextualFollowUps: [],
  },
  {
    rank: 32,
    predictionId: "opentable-pred-hm-018",
    canonicalQuestion: "What restaurant or hospitality product would you benchmark, and what would you steal?",
    alternativePhrasings: ["Who do you see doing revenue optimization well outside OpenTable?"],
    interviewRound: "hiring_manager",
    likelihood: "Medium",
    justification: "Tests industry curiosity despite non-hospitality background.",
    existingAnswerImportKey: "opentable-rec-002",
    recommendedExperience: "Personal OpenTable usage + market scan (needs ChatGPT)",
    coverageStatus: "Adapt",
    contextualFollowUps: [],
  },
];

const primaryHmCount = rankedPredictions.filter(
  (p) => p.interviewRound === "hiring_manager" && !p.parentPredictionId
).length;

const pkg = {
  schemaVersion: "1.0.0",
  profile: "OpenTable — Senior Product Manager, Restaurant Product (AI/ML Revenue Optimization)",
  status: "proposed_not_imported",
  note: "Review-only predictions. Do not import into prepared_qa without ChatGPT-authored answers.",
  generatedAt: new Date().toISOString(),
  jobDescriptionSource: "data/migration/opentable-job-description-excerpt.txt",
  summary: {
    totalPredictions: rankedPredictions.length,
    primaryHiringManagerQuestions: primaryHmCount,
    byLikelihood: {
      veryHigh: rankedPredictions.filter((p) => p.likelihood === "Very High").length,
      high: rankedPredictions.filter((p) => p.likelihood === "High").length,
      medium: rankedPredictions.filter((p) => p.likelihood === "Medium").length,
    },
    coverage: {
      ready: rankedPredictions.filter((p) => p.coverageStatus === "Ready").length,
      adapt: rankedPredictions.filter((p) => p.coverageStatus === "Adapt").length,
      missing: rankedPredictions.filter((p) => p.coverageStatus === "Missing").length,
    },
  },
  rankedPredictions,
};

mkdirSync(reviewDir, { recursive: true });
writeFileSync(resolve(reviewDir, "opentable_question_predictions.json"), `${JSON.stringify(pkg, null, 2)}\n`);

// Import validation report (local, no Supabase)
const importPath = resolve(root, "imports/opentable_final_qa.json");
const importPkg = JSON.parse(readFileSync(importPath, "utf8"));
const byId = new Map(OPENTABLE_APPROVED_RECORDS.map((r) => [r.externalId, r]));
const mismatches = [];
for (const rec of importPkg.records) {
  const src = byId.get(rec.externalId);
  if (!src) {
    mismatches.push({ externalId: rec.externalId, issue: "missing_in_source_module" });
    continue;
  }
  const hImport = createHash("sha256").update(rec.answer).digest("hex");
  const hSrc = createHash("sha256").update(src.answer).digest("hex");
  if (hImport !== hSrc) mismatches.push({ externalId: rec.externalId, issue: "answer_hash_mismatch" });
  if (rec.canonicalQuestion !== src.canonicalQuestion) {
    mismatches.push({ externalId: rec.externalId, issue: "question_changed" });
  }
}

const validationReport = {
  at: new Date().toISOString(),
  importPath,
  recordCount: importPkg.records.length,
  sourceModuleRecordCount: OPENTABLE_APPROVED_RECORDS.length,
  verbatimPreserved: mismatches.length === 0,
  mismatches,
  approvedImportKeys: importPkg.records.map((r) => r.externalId),
};

writeFileSync(
  resolve(root, "data/migration/opentable-import-validation-report.json"),
  `${JSON.stringify(validationReport, null, 2)}\n`
);

const ready = rankedPredictions.filter((p) => p.coverageStatus === "Ready").length;
const adapt = rankedPredictions.filter((p) => p.coverageStatus === "Adapt").length;
const missing = rankedPredictions.filter((p) => p.coverageStatus === "Missing").length;

const coverageMd = `# OpenTable — content coverage

Generated: ${validationReport.at}

## Approved library (imported)

| Metric | Value |
| --- | --- |
| ChatGPT Tier 1–2 records | ${OPENTABLE_APPROVED_RECORDS.length} |
| Import package | \`imports/opentable_final_qa.json\` |
| Verbatim validation | ${validationReport.verbatimPreserved ? "PASS" : "FAIL — see opentable-import-validation-report.json"} |

### Coverage by theme (approved)

| Theme | Import keys |
| --- | --- |
| Career & motivation | opentable-rec-001 … opentable-rec-004, opentable-rec-016–018 |
| Experience / revenue proof | opentable-rec-005–007, opentable-rec-006 |
| AI credibility (personal + PM) | opentable-rec-008, opentable-rec-009, opentable-rec-019 |
| OpenTable product cases (framework) | opentable-rec-010, opentable-rec-011 |
| Cross-functional / marketplace | opentable-rec-012–015 |

## Shared narrative reuse (do not duplicate in other profiles)

These approved answers intentionally align with Questrade/Simplii **experience modules** (RBC, HBC, Arc'teryx) while using OpenTable-specific closings where marked \`profileExclusive: opentable\`.

| Shared module | OpenTable records |
| --- | --- |
| rbc-cashback | opentable-rec-005 |
| arcteryx-membership | opentable-rec-006, opentable-rec-013, opentable-rec-014 |
| hbc-portfolio | opentable-rec-007 |
| leadership-general | opentable-rec-012, opentable-rec-014 |
| opentable-revenue-ai | opentable-rec-008–011, opentable-rec-015, opentable-rec-019 |

## Predicted HM / panel gaps (not in live library)

From \`data/review/opentable_question_predictions.json\` (${rankedPredictions.length} ranked entries, ${primaryHmCount} primary HM):

| Coverage | Count |
| --- | --- |
| Ready (existing answer) | ${ready} |
| Adapt (partial overlap) | ${adapt} |
| Missing (needs new answer) | ${missing} |

### Highest-priority missing themes

1. **Concrete restaurant revenue product case** (empty tables / yield levers) — pred hm-005, hm-005-fu1  
2. **Executive product narrative for AI roadmap** — pred hm-007  
3. **Pricing/yield in marketplace you don't control** — pred hm-011  
4. **Launch underperformance / pivot** — pred hm-012  
5. **First 6 months success plan** — pred hm-013  
6. **ML offline vs online evaluation** — pred panel-001  
7. **Architecture whiteboard for operator AI** — pred panel-003  
8. **Model drift / retrain triggers** — pred panel-004  
9. **Diner data ethics for restaurant AI** — pred hm-017  

Predictions remain **review-only** until ChatGPT authors answers.
`;

const missingPreds = rankedPredictions
  .filter((p) => p.coverageStatus === "Missing" && !p.parentPredictionId)
  .concat(rankedPredictions.filter((p) => p.coverageStatus === "Missing" && p.parentPredictionId));

const handoffMd = `# OpenTable — ChatGPT answer handoff

Generated: ${validationReport.at}

**Scope:** Author spoken answers for predicted questions marked Missing or Adapt where overlap is insufficient. Cursor must not auto-import predictions.

## P0 — Write first (Very High likelihood)

${rankedPredictions
  .filter((p) => p.likelihood === "Very High" && (p.coverageStatus === "Missing" || p.coverageStatus === "Adapt"))
  .slice(0, 12)
  .map(
    (p, i) =>
      `${i + 1}. **${p.canonicalQuestion}** (${p.interviewRound}, ${p.coverageStatus})  
   - Prediction ID: \`${p.predictionId}\`  
   - Reuse: ${p.existingAnswerImportKey ?? "none"} — ${p.recommendedExperience}`
  )
  .join("\n\n")}

## P1 — Missing primary answers

${missingPreds
  .filter((p) => p.coverageStatus === "Missing")
  .map(
    (p) =>
      `- \`${p.predictionId}\` (${p.likelihood}) — ${p.canonicalQuestion}`
  )
  .join("\n")}

## Adapt — extend existing approved answers

${rankedPredictions
  .filter((p) => p.coverageStatus === "Adapt")
  .map(
    (p) =>
      `- \`${p.predictionId}\` — start from \`${p.existingAnswerImportKey}\`; ${p.canonicalQuestion}`
  )
  .join("\n")}

## Guardrails (unchanged)

- Currently employed at Arc'teryx; selective move narrative  
- Distinguish personal AI apps from enterprise ML launches  
- Compensation: CAD $185K–$205K base target; OpenTable published $135K–$165K (see opentable-rec-017)  
- Do not invent restaurant production metrics or ML deployments  
`;

writeFileSync(resolve(reviewDir, "opentable_content_coverage.md"), coverageMd);
writeFileSync(resolve(reviewDir, "opentable_chatgpt_handoff.md"), handoffMd);

console.log("Wrote data/review/opentable_question_predictions.json");
console.log("Wrote data/review/opentable_content_coverage.md");
console.log("Wrote data/review/opentable_chatgpt_handoff.md");
console.log("Wrote data/migration/opentable-import-validation-report.json", validationReport.verbatimPreserved ? "PASS" : "FAIL");

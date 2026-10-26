/**
 * Audit backlog: supersede HBC-X1/X2, round relevance, AI-at-work, Questrade prep additions.
 * Run: npm run apply:audit-improvements
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type { InterviewRound, RoundPriority } from "../packages/shared/src/navigator/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const seedPath = resolve(root, "data/seed/questrade-interview-full.json");
const metaPath = resolve(root, "data/migration/navigator-meta-by-question.json");
const reportPath = resolve(root, "data/migration/audit-apply-report.json");

const CANONICAL_ACTIVATION =
  "Tell me exactly how you defined HBC's 30-day activation and 90-day retention.";
const CANONICAL_HOLDOUT =
  "Did you actually run randomized holdouts on the HBC Mastercard programme?";

const SUPERSEDED = [
  {
    question: "What exactly do your 30-day activation and 90-day repeat-spend metrics mean?",
    supersededBy: CANONICAL_ACTIVATION,
    canonicalQuestionId: "hbc-activation-metrics-v2",
  },
  {
    question: "How did you establish that lifecycle incentives improved P&L and modeled LTV?",
    supersededBy: CANONICAL_HOLDOUT,
    canonicalQuestionId: "hbc-portfolio-holdout-v2",
  },
];

function spokenFromAnswer(answer: string, maxWords = 90): string {
  const words = answer.replace(/\s+/g, " ").trim().split(" ");
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}…`;
}

const ROUND_TAGS: Record<string, Partial<Record<InterviewRound, RoundPriority>>> = {
  "Tell me about yourself.": {
    recruiter: "very_high",
    hiring_manager: "high",
  },
  "Why Questrade? Why this role?": { recruiter: "very_high" },
  "Why Questrade instead of continuing at Arc'teryx?": { recruiter: "very_high" },
  "Why move into everyday banking from rewards and loyalty?": { recruiter: "very_high" },
  "How are you using AI in your product management work?": { recruiter: "very_high", hiring_manager: "high" },
  "How would you convince existing Questrade investors to make Questbank their primary bank?": {
    hiring_manager: "very_high",
  },
  "Who would you target first for Questbank adoption?": { hiring_manager: "high" },
  "Tell me about a customer problem you solved at RBC.": { hiring_manager: "very_high" },
  "How did you measure success for the Avion cashback withdrawal launch?": {
    hiring_manager: "very_high",
    cross_functional_panel: "high",
  },
  "Tell me about the financial impact of your work at HBC.": { hiring_manager: "very_high" },
  "How would you handle a major payment incident?": {
    cross_functional_panel: "very_high",
  },
  "Why should we hire you over someone with direct core banking experience?": {
    hiring_manager: "high",
  },
};

const AI_ANSWER = `I use AI regularly, but I separate what I actually use today from what I'm exploring and what would stay hypothetical in a regulated bank.

**Tools I use today:** ChatGPT and Claude for structuring research, drafting interview guides and stress-testing product assumptions. Cursor for prototyping — including Bench, a side project where I've experimented with computer vision for exercise rep counting and human video verification. Those help me go from hypothesis to something testable faster than static mocks alone.

**Workflows I'm exploring:** summarizing customer feedback themes, generating experiment variants to review, and using AI-assisted code search to understand unfamiliar payment or core-banking integrations — always with human review before anything customer-facing.

**What I would not claim as deployed:** automated Slack bots, unsupervised customer messaging, or agent actions on money movement without explicit consent, least-privilege scopes, read-only defaults, draft-vs-execute separation and human approval. At Questrade-scale banking, I'd treat AI outputs as inputs to judgment, not authoritative financial facts.

I don't see AI replacing product ownership. It shortens the loop between a question and an evidence-backed answer — with validation, especially for data, compliance and customer impact.`;

const PREP_ADDITIONS = [
  {
    question: "Why is Questbank expanding into everyday banking now, and what changes for product?",
    answer:
      "Questrade already has investing relationships and trust with a large customer base. Everyday banking is a different promise: payroll, bill pay and balances customers rely on weekly. I'd anchor on why existing investors might adopt Questbank as a primary relationship — recurring deposits, transactional activity and retained balances — not just opening another account. Publicly, Questbank has moved toward regulated everyday banking with partners like Temenos for core capabilities. My job would be to translate that ambition into sequenced customer value, reliability and economics without pretending brokerage trust automatically transfers.",
    category: "Questrade Product Cases",
    part: 3,
    experienceModuleId: "questrade-primary",
    evidenceStatus: "rehearsal_framework",
    roundRelevance: { recruiter: "very_high", hiring_manager: "very_high" } as Partial<
      Record<InterviewRound, RoundPriority>
    >,
  },
  {
    question: "How would you build product on top of Temenos core banking without owning the ledger?",
    answer:
      "I'd be explicit about system boundaries. Core banking owns balances, postings and product rules; Questbank owns customer experience, orchestration and the read models product teams need. I'd map payment and deposit states end-to-end — pending, posted, available — and define reconciliation handoffs, SLAs and exception queues before promising features in the hub. Integrations through extensibility APIs still need idempotency, observability and partner escalation paths. I wouldn't blur 'we shipped a UI' with 'money moved correctly.' My RBC payments work taught me that operational truth matters as much as feature delivery.",
    category: "Product & Banking Knowledge",
    part: 9,
    experienceModuleId: "questrade-temenos",
    evidenceStatus: "rehearsal_framework",
    roundRelevance: { hiring_manager: "very_high", cross_functional_panel: "high" },
  },
  {
    question:
      "How would you design MCP or agentic finance connections with consent and human approval?",
    answer:
      "I'd start from customer-controlled consent: OAuth-style authorization, least privilege, read-only by default, and clear listing of what an agent can see versus do. Draft insights and proposed actions should be separable from execution — especially trades, transfers or bill payments. Questrade's public MCP materials emphasize customer approval for trades; I'd extend that pattern to any material money movement. Logging, revocation, rate limits and error surfaces matter as much as the demo. I would not describe autonomous agents moving money without an explicit confirmation step and audit trail.",
    category: "Product & Banking Knowledge",
    part: 9,
    experienceModuleId: "questrade-mcp",
    evidenceStatus: "rehearsal_framework",
    panelDiscipline: "ai_agentic",
    roundRelevance: { cross_functional_panel: "very_high", hiring_manager: "high" },
  },
  {
    question: "How do you measure primary-banking adoption versus superficial account opening?",
    answer:
      "Opening is not primacy. I'd track recurring qualifying deposits, bill-pay or payroll setup, monthly transacting customers, repeat deposit behaviour and 90-day retained activity — alongside guardrails on failed payments, fraud and complaints. Share-of-wallet is often estimated; I'd separate observable Questbank behaviours from inferred external balances unless customers permission data with clear consent. This parallels how I separated HBC activation, repeat spend and portfolio activity rather than treating one metric as the whole story.",
    category: "Questrade Product Cases",
    part: 3,
    experienceModuleId: "questrade-metrics",
    evidenceStatus: "rehearsal_framework",
    roundRelevance: { hiring_manager: "very_high" },
  },
  {
    question:
      "How do you ensure financial data shown to customers — or AI tools — is accurate enough to act on?",
    answer:
      "I'd define freshness, source of truth and fallback copy for pending versus posted amounts. Product surfaces should not present inferred balances as settled money. For AI-assisted insights, I'd require labelled uncertainty, link back to source transactions, and block automated actions when reconciliation is incomplete. Human review paths and kill switches matter for incidents. Accuracy is a cross-functional requirement among core banking, payments ops, risk and product — not a front-end polish item.",
    category: "Product & Banking Knowledge",
    part: 9,
    experienceModuleId: "questrade-payments",
    evidenceStatus: "rehearsal_framework",
    roundRelevance: { cross_functional_panel: "very_high" },
  },
];

const seed = JSON.parse(readFileSync(seedPath, "utf8")) as {
  preparedQa: Array<Record<string, unknown> & { question: string; answer: string }>;
};
const meta: Record<string, Record<string, unknown>> = JSON.parse(readFileSync(metaPath, "utf8"));

let aiUpdated = false;
for (const qa of seed.preparedQa) {
  if (qa.question === "How are you using AI in your product management work?") {
    qa.answer = AI_ANSWER;
    aiUpdated = true;
  }
}

const existingQuestions = new Set(seed.preparedQa.map((q) => q.question.trim()));
let added = 0;
for (const item of PREP_ADDITIONS) {
  if (existingQuestions.has(item.question)) continue;
  seed.preparedQa.push({
    question: item.question,
    answer: item.answer,
    category: item.category,
    part: item.part,
    isPreferred: false,
    detect: [],
    notes: "audit-2026-10-22 prep",
  });
  existingQuestions.add(item.question);
  meta[item.question] = {
    librarySection: item.part <= 5 ? "career_motivation" : item.part <= 8 ? "questrade_cases" : "product_banking_knowledge",
    experienceModuleId: item.experienceModuleId,
    intent: "general",
    evidenceStatus: item.evidenceStatus,
    reviewStatus: "ok",
    revisionStatus: "current",
    roundRelevance: item.roundRelevance,
    panelDiscipline: item.panelDiscipline,
    spokenAnswer: spokenFromAnswer(item.answer),
    shortAnswer: spokenFromAnswer(item.answer, 55),
    sourceFile: "apply-audit-improvements.ts",
  };
  added += 1;
}

if (aiUpdated) {
  const aiQ = "How are you using AI in your product management work?";
  const m = meta[aiQ] ?? {};
  meta[aiQ] = {
    ...m,
    altPhrasings: [
      "How are you using AI at work?",
      "How do you use AI as a PM?",
      "Tell me about AI in your workflow.",
    ],
    roundRelevance: ROUND_TAGS[aiQ],
    spokenAnswer: spokenFromAnswer(AI_ANSWER),
    shortAnswer: spokenFromAnswer(AI_ANSWER, 55),
    evidenceStatus: "resume_supported",
    reviewStatus: "ok",
  };
}

let supersededCount = 0;
for (const s of SUPERSEDED) {
  const m = meta[s.question];
  if (!m) continue;
  meta[s.question] = {
    ...m,
    revisionStatus: "superseded",
    retrievalExcluded: true,
    supersededByQuestion: s.supersededBy,
    canonicalQuestionId: s.canonicalQuestionId,
    evidenceStatus: "rehearsal_framework",
  };
  supersededCount += 1;
}

let roundTagged = 0;
for (const [question, roundRelevance] of Object.entries(ROUND_TAGS)) {
  const m = meta[question];
  if (!m) continue;
  const qa = seed.preparedQa.find((q) => q.question === question);
  const answer = qa?.answer ?? "";
  meta[question] = {
    ...m,
    roundRelevance,
    spokenAnswer: (m.spokenAnswer as string) ?? (answer ? spokenFromAnswer(answer) : undefined),
    shortAnswer: (m.shortAnswer as string) ?? (answer ? spokenFromAnswer(answer, 55) : undefined),
  };
  roundTagged += 1;
}

writeFileSync(seedPath, JSON.stringify(seed, null, 2) + "\n");
writeFileSync(metaPath, JSON.stringify(meta, null, 2));
mkdirSync(resolve(root, "data/migration"), { recursive: true });
writeFileSync(
  reportPath,
  JSON.stringify(
    {
      appliedAt: new Date().toISOString(),
      seedCount: seed.preparedQa.length,
      supersededRecords: supersededCount,
      roundTagged,
      prepAdditions: added,
      aiAnswerUpdated: aiUpdated,
    },
    null,
    2
  )
);
console.log(JSON.stringify({ seedCount: seed.preparedQa.length, supersededCount, added, aiUpdated }, null, 2));

import raw from "@/data/bristol-focused-curated.json";
import { canonicalFromOpenTableId, canonicalFromQuestradeId } from "./canonical";

export const BRISTOL_NEEDS_GPT_MARKER = "needs_gpt_draft";

export type BristolScenarioMeta = {
  originalQuestion: string;
  illustrativeData?: string;
  initialPovPrompt?: string;
  structuredGuide?: string;
  unexpectedTwist?: string;
  followUpProbes: string[];
  assessedSkills: string[];
  answerFramework: string[];
  primaryMetric?: string;
  guardrailMetrics?: string[];
  commonMistakes: string[];
  quickDecision?: string;
  responseToTwist?: string;
};

export type BristolIndustryReference = {
  disclaimer: string;
  painPoints: {
    id: number;
    name: string;
    segments: string[];
    evidence: string;
    commercialConsequence: string;
    opentableCapabilities: string;
    underserved: string;
    metrics: string[];
    tradeoffs: string;
  }[];
  proposedPriorityRanking: string[];
  sourcesToVerify: string[];
};

export type BristolBattlecardSection = {
  id: string;
  heading: string;
  bullets: string[];
};

export type BristolBattlecard = {
  title: string;
  subtitle: string;
  sections: BristolBattlecardSection[];
};

export type BristolWeaknessRow = {
  skill: string;
  jazEvidence: string;
  opentableEquivalent: string;
  coverage: string;
  priority: string;
  missing: string;
  practice: string;
};

export type BristolScenarioFramework = {
  title: string;
  steps: { id: string; label: string; detail: string }[];
  initialPovHint: string;
  jazMistakesToAvoid: string[];
};

export type BristolFollowUp = {
  id: string;
  question: string;
  answer: string;
};

export type BristolQuestion = {
  id: string;
  curatedKey: string;
  category: string;
  title: string;
  navigationLabel: string;
  shortLabel: string;
  priority: number;
  answer: string;
  shortAnswer: string;
  followUps: BristolFollowUp[];
  aliases: string[];
  evidenceStatus: string;
  accuracyNote: string;
  projectTags: string[];
  suggestedPinned: boolean;
  answerStatus: string;
  answerSource: "opentable" | "shared" | "inline" | "missing";
  canonicalAnswerId: string | null;
  opentableRecordId: string | null;
  recordType: "question" | "reference" | "scenario" | "industry_reference";
  scenario?: BristolScenarioMeta;
  industryReference?: BristolIndustryReference;
  scenarioFrameworkHint?: string;
};

export type BristolAskFollowUp = {
  id: string;
  question: string;
  cue: string;
  note: string;
};

export type BristolAskQuestion = {
  id: string;
  topic: string;
  question: string;
  note: string;
  badge: string;
  tier: "primary" | "backup" | "additional";
  followUps: BristolAskFollowUp[];
};

type RawFollowUp = { question?: string; answer?: string };
type RawQuestion = {
  curatedKey?: string;
  canonicalAnswerId?: string | null;
  opentableRecordId?: string | null;
  category?: string;
  title?: string;
  navigationLabel?: string;
  priority?: number;
  answer?: string;
  shortAnswer?: string;
  followUps?: RawFollowUp[];
  aliases?: string[];
  evidenceStatus?: string;
  accuracyNote?: string;
  projectTags?: string[];
  suggestedPinned?: boolean;
  answerStatus?: string;
  recordType?: string;
  scenario?: BristolScenarioMeta;
  industryReference?: BristolIndustryReference;
};

type RawAskFollow = { question?: string; cue?: string; note?: string };
type RawAsk = {
  topic?: string;
  question?: string;
  note?: string;
  badge?: string;
  tier?: string;
  followUps?: RawAskFollow[];
};

export const BRISTOL_CATEGORIES: { id: string; label: string }[] = [
  { id: "Career & Motivation", label: "Career & Motivation" },
  { id: "Industry POV & Strategic Judgment", label: "Industry POV & Judgment" },
  { id: "Live Product Scenarios", label: "Live Product Scenarios" },
  { id: "Experience Stories", label: "Experience Stories" },
  { id: "Restaurant Product & Marketplace Strategy", label: "Restaurant Product & Marketplace" },
  { id: "AI/ML & Revenue Optimization", label: "AI/ML & Revenue Optimization" },
  { id: "Restaurant Economics, Workflows & Metrics", label: "Restaurant Economics & Metrics" },
  { id: "Product Craft, Discovery & Experimentation", label: "Product Craft & Experimentation" },
  { id: "Leadership & Judgment", label: "Leadership & Judgment" },
];

const SHORT_LABELS: Record<string, string> = {
  B01: "Tell me about yourself",
  B02: "Why OpenTable",
  B03: "Why Restaurant Product",
  B04: "Why new opportunity",
  B05: "Hospitality & AI/ML",
  B06: "AI/ML gap",
  B07: "Partner revenue strategy",
  B08: "Reservation lifecycle",
  B09: "First opportunity",
  B10: "Profitability vs diner UX",
  B11: "Table utilization",
  B12: "Prioritize growth levers",
  B13: "Marketplace balance",
  B14: "Restaurant segmentation",
  B15: "Competitive differentiation",
  B16: "First 90 days",
  B17: "0-to-1 AI idea",
  B18: "ML vs rules",
  B19: "Predictive revenue",
  B20: "Evaluate AI product",
  B21: "Forecasting data",
  B22: "Model quality & impact",
  B23: "Cold start",
  B24: "Operator trust",
  B25: "Automation vs control",
  B26: "Prototype to production",
  B27: "Reservation lifecycle",
  B28: "North Star metric",
  B29: "Revenue metrics",
  B30: "Incremental revenue",
  B31: "No-shows",
  B32: "Bookings vs profit",
  B40: "RBC Interac",
  B41: "Avion Select",
  B42: "HBC Mastercard",
  B43: "Arc'teryx membership",
  B44: "Aeroplan",
  B45: "Customer problem",
  B46: "Ensights",
  B47: "RBC overview",
  B48: "Arc'teryx overview",
  B49: "Disagreement",
  B50: "Influence",
  B51: "Failure",
  B52: "Incomplete data",
  B53: "Prioritization",
  B54: "Two initiatives",
  B59: "Love about PM",
  B60: "Frustrates you about PM",
  B61: "Global TMS scale",
  B66: "Role scope AI vs FOH",
  IP01: "Restaurant industry take",
  IP02: "Operator pain points",
  IP03: "Pain point priority",
  SC01: "Scenario: deposits",
  SC05: "Scenario: privacy",
  SC06: "Scenario: incrementality",
};

function shortLabelFor(key: string, navigationLabel: string, title: string): string {
  if (SHORT_LABELS[key]) return SHORT_LABELS[key];
  const base = navigationLabel || title;
  if (base.length <= 36) return base;
  return `${base.slice(0, 33)}…`;
}

export const BRISTOL_EXPERIENCES: { id: string; label: string; test: (tags: string[]) => boolean }[] = [
  { id: "arcteryx", label: "Arc'teryx", test: (tags) => tags.some((t) => foldTag(t).includes("arcteryx")) },
  { id: "rbc", label: "RBC", test: (tags) => tags.some((t) => /\brbc\b/.test(foldTag(t))) },
  { id: "hbc", label: "HBC", test: (tags) => tags.some((t) => /\bhbc\b/.test(foldTag(t))) },
  { id: "aeroplan", label: "Aeroplan", test: (tags) => tags.some((t) => foldTag(t).includes("aeroplan")) },
  { id: "ensights", label: "Ensights", test: (tags) => tags.some((t) => foldTag(t).includes("ensights")) },
];

function foldTag(value: string): string {
  return value.toLowerCase().replace(/[’']/g, "");
}

function resolveAnswer(rawQ: RawQuestion): {
  answer: string;
  shortAnswer: string;
  source: BristolQuestion["answerSource"];
  status: string;
} {
  const inline = String(rawQ.answer ?? "").trim();
  const status = String(rawQ.answerStatus ?? "");

  if (rawQ.opentableRecordId) {
    const ot = canonicalFromOpenTableId(rawQ.opentableRecordId);
    if (ot?.answer) {
      return {
        answer: ot.answer,
        shortAnswer: ot.shortAnswer || ot.answer.split("\n\n")[0] || "",
        source: "opentable",
        status: status || "ready",
      };
    }
  }

  if (rawQ.canonicalAnswerId) {
    const shared = canonicalFromQuestradeId(rawQ.canonicalAnswerId);
    if (shared?.answer) {
      return {
        answer: shared.answer,
        shortAnswer: shared.shortAnswer || shared.answer.split("\n\n")[0] || "",
        source: "shared",
        status: status || "ready",
      };
    }
  }

  if (inline && !inline.includes(BRISTOL_NEEDS_GPT_MARKER)) {
    return {
      answer: inline,
      shortAnswer: String(rawQ.shortAnswer ?? inline.split("\n\n")[0] ?? ""),
      source: "inline",
      status: status || "ready",
    };
  }

  return {
    answer: inline || `_Answer not authored yet for this profile. Status: ${BRISTOL_NEEDS_GPT_MARKER}. Do not speak this placeholder in interview._`,
    shortAnswer: "",
    source: "missing",
    status: "needs_gpt_draft",
  };
}

function recordTypeOf(rawQ: RawQuestion): BristolQuestion["recordType"] {
  const t = rawQ.recordType;
  if (t === "reference" || t === "scenario" || t === "industry_reference") return t;
  return "question";
}

function asQuestions(input: RawQuestion[], frameworkHint: string): BristolQuestion[] {
  return input.map((q, index) => {
    const curatedKey = String(q.curatedKey ?? `B${index + 1}`);
    const resolved = resolveAnswer(q);
    const followUps = (q.followUps ?? []).map((follow, followIndex) => ({
      id: `bristol-${curatedKey}-f${followIndex + 1}`,
      question: String(follow.question ?? ""),
      answer: String(follow.answer ?? "").trim() || `_Follow-up answer: ${BRISTOL_NEEDS_GPT_MARKER}_`,
    }));
    const rt = recordTypeOf(q);
    return {
      id: `bristol-${curatedKey}`,
      curatedKey,
      category: String(q.category ?? "Uncategorized"),
      title: String(q.title ?? ""),
      navigationLabel: String(q.navigationLabel ?? q.title ?? ""),
      shortLabel: shortLabelFor(curatedKey, String(q.navigationLabel ?? ""), String(q.title ?? "")),
      priority: Number(q.priority ?? 2),
      answer: resolved.answer,
      shortAnswer: resolved.shortAnswer,
      followUps,
      aliases: (q.aliases ?? []).map(String),
      evidenceStatus: String(q.evidenceStatus ?? ""),
      accuracyNote: String(q.accuracyNote ?? ""),
      projectTags: (q.projectTags ?? []).map(String),
      suggestedPinned: Boolean(q.suggestedPinned),
      answerStatus: resolved.status,
      answerSource: resolved.source,
      canonicalAnswerId: q.canonicalAnswerId ?? null,
      opentableRecordId: q.opentableRecordId ?? null,
      recordType: rt,
      scenario: q.scenario,
      industryReference: q.industryReference,
      scenarioFrameworkHint: rt === "scenario" ? frameworkHint : undefined,
    };
  });
}

const rawQuestions = ((raw as { questions?: RawQuestion[] }).questions ?? []) as RawQuestion[];
const rawAsk = ((raw as { questionsForBristol?: RawAsk[] }).questionsForBristol ?? []) as RawAsk[];
const scenarioFramework = (raw as { scenarioJudgmentFramework?: BristolScenarioFramework }).scenarioJudgmentFramework;
const frameworkHint =
  scenarioFramework?.steps?.map((s) => s.label).join(" → ") ?? "Clarify → Diagnose → Evaluate → Decide → Validate → Adapt";

export const bristolScenarioFramework: BristolScenarioFramework | null = scenarioFramework ?? null;
export const bristolBattlecard: BristolBattlecard | null =
  ((raw as { battlecard?: BristolBattlecard }).battlecard ?? null) as BristolBattlecard | null;
export const bristolWeaknessTracker: BristolWeaknessRow[] =
  ((raw as { weaknessTracker?: BristolWeaknessRow[] }).weaknessTracker ?? []) as BristolWeaknessRow[];
export const bristolP0Prediction = (raw as { p0Prediction?: { disclaimer: string; p0: { id: string; area: string; reason: string }[] } })
  .p0Prediction;

export const bristolQuestions: BristolQuestion[] = asQuestions(rawQuestions, frameworkHint);

export const bristolAskQuestions: BristolAskQuestion[] = rawAsk.map((item, index) => {
  const tierRaw = String(item.tier ?? "");
  const tier: BristolAskQuestion["tier"] =
    tierRaw === "primary" || tierRaw === "backup" || tierRaw === "additional" ? tierRaw : "additional";
  return {
    id: `bristol-ask-${index + 1}`,
    topic: String(item.topic ?? `Question ${index + 1}`),
    question: String(item.question ?? ""),
    note: String(item.note ?? ""),
    badge: String(item.badge ?? ""),
    tier,
    followUps: (item.followUps ?? []).map((follow, followIndex) => ({
      id: `bristol-ask-${index + 1}-f${followIndex + 1}`,
      question: String(follow.question ?? ""),
      cue: String(follow.cue ?? ""),
      note: String(follow.note ?? ""),
    })),
  };
});

export const bristolPinnedQuestions = bristolQuestions.filter((q) => q.suggestedPinned);

export function bristolCategoryLabel(category: string): string {
  return BRISTOL_CATEGORIES.find((c) => c.id === category)?.label ?? category;
}

export function validateBristolDataset(): string[] {
  const issues: string[] = [];
  const questions = rawQuestions;
  if (questions.length !== 111) issues.push(`expected 111 questions, found ${questions.length}`);
  const pinned = questions.filter((q) => q.suggestedPinned).length;
  if (pinned < 10) issues.push(`expected at least 10 pins, found ${pinned}`);
  if (rawAsk.length !== 7) issues.push(`expected 7 questions for Bristol, found ${rawAsk.length}`);
  const legacyOt = questions.filter((q) => String(q.opentableRecordId ?? "").startsWith("opentable-rec-"));
  if (legacyOt.length) issues.push(`legacy opentable-rec-* pointers: ${legacyOt.map((q) => q.curatedKey).join(", ")}`);

  const keys = new Set<string>();
  for (const q of questions) {
    const key = q.curatedKey ?? "";
    if (keys.has(key)) issues.push(`duplicate ${key}`);
    keys.add(key);
    if (!q.title?.trim()) issues.push(`${key} missing title`);
    if (!q.navigationLabel?.trim()) issues.push(`${key} missing navigation label`);
    if (!BRISTOL_CATEGORIES.some((c) => c.id === q.category)) issues.push(`${key} unexpected category ${q.category}`);
    if (q.answer?.includes("Questrade's everyday-banking")) {
      issues.push(`${key} inherited Questrade-specific answer text`);
    }
    if (q.recordType === "scenario" && !q.scenario?.originalQuestion) {
      issues.push(`${key} scenario missing metadata`);
    }
    if (q.recordType === "industry_reference" && !q.industryReference?.painPoints?.length) {
      issues.push(`${key} industry reference missing pain points`);
    }
    const otId = q.opentableRecordId;
    if (otId && !canonicalFromOpenTableId(otId)) {
      issues.push(`${key} missing canonical opentable record ${otId}`);
    }
  }

  rawAsk.forEach((item, index) => {
    if (!item.question?.trim()) issues.push(`questionsForBristol ${index + 1} missing question`);
    if (!item.topic?.trim()) issues.push(`questionsForBristol ${index + 1} missing topic`);
  });

  return issues;
}

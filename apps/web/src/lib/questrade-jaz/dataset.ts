import raw from "@/data/questrade-jaz-curated.json";

export type JazFollowUp = {
  id: string;
  question: string;
  answer: string;
};

export type JazQuestion = {
  id: string;
  curatedKey: string;
  category: string;
  title: string;
  navigationLabel: string;
  /** Compact sidebar label. The answer pane always shows the full title. */
  shortLabel: string;
  priority: number;
  answer: string;
  followUps: JazFollowUp[];
  aliases: string[];
  evidenceStatus: string;
  accuracyNote: string;
  projectTags: string[];
  suggestedPinned: boolean;
};

export type JazAskFollowUp = {
  id: string;
  question: string;
  cue: string;
  note: string;
};

export type JazAskQuestion = {
  id: string;
  topic: string;
  question: string;
  note: string;
  badge: string;
  followUps: JazAskFollowUp[];
};

type RawFollowUp = { question?: string; answer?: string };
type RawQuestion = {
  curatedKey?: string;
  canonicalAnswerId?: string | null;
  category?: string;
  title?: string;
  navigationLabel?: string;
  priority?: number;
  answer?: string;
  followUps?: RawFollowUp[];
  aliases?: string[];
  evidenceStatus?: string;
  accuracyNote?: string;
  projectTags?: string[];
  suggestedPinned?: boolean;
};

type RawAskFollow = { question?: string; cue?: string; note?: string };
type RawAsk = { topic?: string; question?: string; note?: string; badge?: string; followUps?: RawAskFollow[] };

const SHORT_LABELS: Record<string, string> = {
  Q01: "Tell me about yourself",
  Q02: "Why Questrade",
  Q03: "Why leave Arc'teryx",
  Q04: "Primary bank",
  Q05: "30 / 60 / 90",
  Q06: "Roadmap",
  Q07: "Cross-squad",
  Q08: "Direct deposit",
  Q09: "P&L and profitability",
  Q10: "Investor cross-sell",
  Q11: "Financial wellness",
  Q12: "Financial hub",
  Q13: "Primary-account metrics",
  Q14: "Money movement",
  Q15: "RBC Interac",
  Q16: "Cards and history",
  Q17: "Prioritization (Arc'teryx)",
  Q18: "Outcomes and metrics",
  Q19: "HBC discovery",
  Q20: "ShopPlus",
  Q21: "Complex integration",
  Q22: "Risk and compliance",
  Q23: "Agile delivery",
  Q24: "Stakeholder disagreement",
  Q25: "Failure",
  Q26: "Influence",
  Q27: "Ambiguity",
  Q28: "Vendor miss",
  Q29: "People management",
  Q30: "Arc'teryx overview",
  Q31: "RBC overview",
  Q32: "HBC overview",
  Q33: "Aeroplan overview",
  Q34: "Growth Experiment",
  Q35: "Prioritization (RBC)",
};

export const JAZ_CATEGORIES: { id: string; label: string }[] = [
  { id: "Career & Motivation", label: "Career & Motivation" },
  { id: "Everyday Banking Strategy", label: "Everyday Banking Strategy" },
  { id: "Payments & Cards", label: "Payments & Cards" },
  { id: "Product Craft & Execution", label: "Product Craft & Execution" },
  { id: "Leadership & Judgment", label: "Leadership & Judgment" },
  { id: "Experience Overviews", label: "Experience Stories" },
];

export const JAZ_EXPERIENCES: { id: string; label: string; test: (tags: string[]) => boolean }[] = [
  { id: "arcteryx", label: "Arc'teryx", test: (tags) => tags.some((t) => foldTag(t).includes("arcteryx")) },
  { id: "rbc", label: "RBC", test: (tags) => tags.some((t) => /\brbc\b/.test(foldTag(t))) },
  { id: "hbc", label: "HBC", test: (tags) => tags.some((t) => /\bhbc\b/.test(foldTag(t))) },
  { id: "aeroplan", label: "Aeroplan", test: (tags) => tags.some((t) => foldTag(t).includes("aeroplan")) },
];

function foldTag(value: string): string {
  return value.toLowerCase().replace(/[’']/g, "");
}

function asQuestions(input: RawQuestion[]): JazQuestion[] {
  return input.map((q, index) => {
    const curatedKey = String(q.curatedKey ?? `Q${index + 1}`);
    const followUps = (q.followUps ?? []).map((follow, followIndex) => ({
      id: `jaz-${curatedKey}-f${followIndex + 1}`,
      question: String(follow.question ?? ""),
      answer: String(follow.answer ?? ""),
    }));
    return {
      id: `jaz-${curatedKey}`,
      curatedKey,
      category: String(q.category ?? "Uncategorized"),
      title: String(q.title ?? ""),
      navigationLabel: String(q.navigationLabel ?? q.title ?? ""),
      shortLabel: SHORT_LABELS[curatedKey] ?? String(q.navigationLabel ?? q.title ?? curatedKey),
      priority: Number(q.priority ?? 2),
      answer: String(q.answer ?? ""),
      followUps,
      aliases: (q.aliases ?? []).map(String),
      evidenceStatus: String(q.evidenceStatus ?? ""),
      accuracyNote: String(q.accuracyNote ?? ""),
      projectTags: (q.projectTags ?? []).map(String),
      suggestedPinned: Boolean(q.suggestedPinned),
    };
  });
}

const rawQuestions = ((raw as { questions?: RawQuestion[] }).questions ?? []) as RawQuestion[];
const rawAsk = ((raw as { questionsForJaz?: RawAsk[] }).questionsForJaz ?? []) as RawAsk[];

export const jazQuestions: JazQuestion[] = asQuestions(rawQuestions);

export const jazAskQuestions: JazAskQuestion[] = rawAsk.map((item, index) => ({
  id: `jaz-ask-${index + 1}`,
  topic: String(item.topic ?? `Question ${index + 1}`),
  question: String(item.question ?? ""),
  note: String(item.note ?? ""),
  badge: String(item.badge ?? ""),
  followUps: (item.followUps ?? []).map((follow, followIndex) => ({
    id: `jaz-ask-${index + 1}-f${followIndex + 1}`,
    question: String(follow.question ?? ""),
    cue: String(follow.cue ?? ""),
    note: String(follow.note ?? ""),
  })),
}));

export const jazPinnedQuestions = jazQuestions.filter((q) => q.suggestedPinned);

export function jazCategoryLabel(category: string): string {
  return JAZ_CATEGORIES.find((c) => c.id === category)?.label ?? category;
}

export function validateJazDataset(): string[] {
  const issues: string[] = [];
  const questions = rawQuestions;
  if (questions.length !== 35) issues.push(`expected 35 questions, found ${questions.length}`);
  const followCount = questions.reduce((sum, q) => sum + (q.followUps?.length ?? 0), 0);
  if (followCount !== 77) issues.push(`expected 77 follow-ups, found ${followCount}`);
  const pinned = questions.filter((q) => q.suggestedPinned).length;
  if (pinned !== 13) issues.push(`expected 13 pins, found ${pinned}`);
  if (rawAsk.length !== 11) issues.push(`expected 11 questions for Jaz, found ${rawAsk.length}`);

  const keys = new Set<string>();
  for (const q of questions) {
    const key = q.curatedKey ?? "";
    if (keys.has(key)) issues.push(`duplicate ${key}`);
    keys.add(key);
    if (!q.title?.trim()) issues.push(`${key} missing title`);
    if (!q.answer?.trim()) issues.push(`${key} missing answer`);
    if (!q.navigationLabel?.trim()) issues.push(`${key} missing navigation label`);
    if (q.canonicalAnswerId != null) issues.push(`${key} canonicalAnswerId must stay unused`);
    if (!SHORT_LABELS[key]) issues.push(`${key} missing short navigation label`);
    if (!JAZ_CATEGORIES.some((c) => c.id === q.category)) issues.push(`${key} unexpected category ${q.category}`);
    (q.followUps ?? []).forEach((follow, index) => {
      if (!follow.question?.trim()) issues.push(`${key} follow-up ${index + 1} missing question`);
      if (!follow.answer?.trim()) issues.push(`${key} follow-up ${index + 1} missing answer`);
    });
  }
  for (let n = 1; n <= 35; n += 1) {
    const key = `Q${String(n).padStart(2, "0")}`;
    if (!keys.has(key)) issues.push(`missing ${key}`);
  }
  rawAsk.forEach((item, index) => {
    if (!item.question?.trim()) issues.push(`questionsForJaz ${index + 1} missing question`);
    if (!item.topic?.trim()) issues.push(`questionsForJaz ${index + 1} missing topic`);
    (item.followUps ?? []).forEach((follow, followIndex) => {
      if (!follow.question?.trim()) issues.push(`questionsForJaz ${index + 1} follow-up ${followIndex + 1} missing question`);
    });
  });

  const arc = jazQuestions.find((q) => q.curatedKey === "Q30");
  const responsibilities = jazQuestions.filter(
    (q) =>
      q.curatedKey !== "Q30" &&
      (q.title.toLowerCase().includes("current responsibilities") ||
        q.aliases.some((alias) => alias.toLowerCase().includes("current responsibilities")))
  );
  if (!arc) issues.push("Q30 missing");
  if (responsibilities.length) issues.push("current responsibilities duplicated outside Q30");
  if (arc && !arc.aliases.some((alias) => /current responsibilities/i.test(alias))) {
    issues.push("Q30 missing current-responsibilities alias");
  }
  return issues;
}

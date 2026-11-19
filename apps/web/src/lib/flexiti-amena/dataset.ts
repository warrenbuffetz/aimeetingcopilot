import raw from "@/data/flexiti-amena-curated.json";

export type AmenaFollowUp = {
  id: string;
  question: string;
  answer: string;
};

export type AmenaQuestion = {
  id: string;
  curatedKey: string;
  category: string;
  title: string;
  navigationLabel: string;
  /** Compact sidebar label. The answer pane always shows the full title. */
  shortLabel: string;
  priority: number;
  answer: string;
  followUps: AmenaFollowUp[];
  aliases: string[];
  evidenceStatus: string;
  accuracyNote: string;
  projectTags: string[];
  suggestedPinned: boolean;
};

export type AmenaAskFollowUp = {
  id: string;
  question: string;
  cue: string;
  note: string;
};

export type AmenaAskQuestion = {
  id: string;
  topic: string;
  question: string;
  note: string;
  badge: string;
  tier: "primary" | "backup" | "additional";
  followUps: AmenaAskFollowUp[];
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
type RawAsk = {
  topic?: string;
  question?: string;
  note?: string;
  badge?: string;
  tier?: string;
  followUps?: RawAskFollow[];
};

const SHORT_LABELS: Record<string, string> = {
  A01: "Tell me about yourself",
  A02: "Why Flexiti",
  A03: "Why leave Arc'teryx",
  A04: "After Everyday Banking",
  A05: "Preferred Everyday Banking?",
  A06: "Complex product — RBC",
  A07: "Prioritization — Arc'teryx",
  A08: "Growth vs cost — HBC",
  A09: "Partner funnel — Neo",
  A10: "Flexiti health metrics",
  A11: "Checkout conversion",
  A12: "Approvals vs losses",
  A13: "Standards across squads",
  A14: "Backup — Air Canada",
};

export const AMENA_CATEGORIES: { id: string; label: string }[] = [
  { id: "Career & Motivation", label: "Career & Motivation" },
  { id: "Experience Stories", label: "Experience Stories" },
  { id: "Flexiti Product Sense", label: "Flexiti Product Sense" },
  { id: "Leadership & Judgment", label: "Leadership & Judgment" },
  { id: "Backup", label: "Backup" },
];

export const AMENA_EXPERIENCES: { id: string; label: string; test: (tags: string[]) => boolean }[] = [
  { id: "flexiti", label: "Flexiti", test: (tags) => tags.some((t) => foldTag(t).includes("flexiti")) },
  { id: "arcteryx", label: "Arc'teryx", test: (tags) => tags.some((t) => foldTag(t).includes("arcteryx")) },
  { id: "rbc", label: "RBC", test: (tags) => tags.some((t) => /\brbc\b/.test(foldTag(t))) },
  { id: "hbc", label: "HBC", test: (tags) => tags.some((t) => /\bhbc\b/.test(foldTag(t))) },
  { id: "aeroplan", label: "Aeroplan", test: (tags) => tags.some((t) => foldTag(t).includes("aeroplan")) },
];

function foldTag(value: string): string {
  return value.toLowerCase().replace(/[’']/g, "");
}

function asQuestions(input: RawQuestion[]): AmenaQuestion[] {
  return input.map((q, index) => {
    const curatedKey = String(q.curatedKey ?? `A${index + 1}`);
    const followUps = (q.followUps ?? []).map((follow, followIndex) => ({
      id: `amena-${curatedKey}-f${followIndex + 1}`,
      question: String(follow.question ?? ""),
      answer: String(follow.answer ?? ""),
    }));
    return {
      id: `amena-${curatedKey}`,
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
const rawAsk = ((raw as { questionsForAmena?: RawAsk[] }).questionsForAmena ?? []) as RawAsk[];

export const amenaQuestions: AmenaQuestion[] = asQuestions(rawQuestions);

export const amenaAskQuestions: AmenaAskQuestion[] = rawAsk.map((item, index) => {
  const tierRaw = String(item.tier ?? "");
  const tier: AmenaAskQuestion["tier"] =
    tierRaw === "primary" || tierRaw === "backup" || tierRaw === "additional" ? tierRaw : "additional";
  return {
    id: `amena-ask-${index + 1}`,
    topic: String(item.topic ?? `Question ${index + 1}`),
    question: String(item.question ?? ""),
    note: String(item.note ?? ""),
    badge: String(item.badge ?? ""),
    tier,
    followUps: (item.followUps ?? []).map((follow, followIndex) => ({
      id: `amena-ask-${index + 1}-f${followIndex + 1}`,
      question: String(follow.question ?? ""),
      cue: String(follow.cue ?? ""),
      note: String(follow.note ?? ""),
    })),
  };
});

export const amenaPinnedQuestions = amenaQuestions.filter((q) => q.suggestedPinned);

export function amenaCategoryLabel(category: string): string {
  return AMENA_CATEGORIES.find((c) => c.id === category)?.label ?? category;
}

export function validateAmenaDataset(): string[] {
  const issues: string[] = [];
  const questions = rawQuestions;
  if (questions.length !== 14) issues.push(`expected 14 questions, found ${questions.length}`);
  const followCount = questions.reduce((sum, q) => sum + (q.followUps?.length ?? 0), 0);
  if (followCount !== 14) issues.push(`expected 14 follow-ups, found ${followCount}`);
  const pinned = questions.filter((q) => q.suggestedPinned).length;
  if (pinned !== 9) issues.push(`expected 9 pins, found ${pinned}`);
  if (rawAsk.length !== 3) issues.push(`expected 3 questions for Amena, found ${rawAsk.length}`);

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
    if (!AMENA_CATEGORIES.some((c) => c.id === q.category)) issues.push(`${key} unexpected category ${q.category}`);
    (q.followUps ?? []).forEach((follow, index) => {
      if (!follow.question?.trim()) issues.push(`${key} follow-up ${index + 1} missing question`);
      if (!follow.answer?.trim()) issues.push(`${key} follow-up ${index + 1} missing answer`);
    });
  }
  for (let n = 1; n <= 14; n += 1) {
    const key = `A${String(n).padStart(2, "0")}`;
    if (!keys.has(key)) issues.push(`missing ${key}`);
  }
  rawAsk.forEach((item, index) => {
    if (!item.question?.trim()) issues.push(`questionsForAmena ${index + 1} missing question`);
    if (!item.topic?.trim()) issues.push(`questionsForAmena ${index + 1} missing topic`);
    const tier = String(item.tier ?? "");
    if (tier && tier !== "primary" && tier !== "backup" && tier !== "additional") {
      issues.push(`questionsForAmena ${index + 1} invalid tier ${tier}`);
    }
    (item.followUps ?? []).forEach((follow, followIndex) => {
      if (!follow.question?.trim()) issues.push(`questionsForAmena ${index + 1} follow-up ${followIndex + 1} missing question`);
    });
  });

  const rbc = amenaQuestions.find((q) => q.curatedKey === "A06");
  if (!rbc) issues.push("A06 missing");
  else if (!rbc.followUps.some((f) => /times out|paid twice/i.test(f.question))) {
    issues.push("A06 missing timeout/double-pay follow-up");
  }
  return issues;
}

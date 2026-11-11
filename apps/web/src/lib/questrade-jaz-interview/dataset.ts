import raw from "@/data/questrade-jaz-interview-pack.json";
import type { JazFollowUp, JazQuestion } from "@/lib/questrade-jaz/dataset";

export type JazInterviewRecordType = "panel" | "deep_dive" | "alias";

export type JazInterviewQuestion = JazQuestion & {
  recordType: JazInterviewRecordType;
  shortAnswer: string;
  linkedDeepDiveKey: string | null;
  /** Alternate phrasings that cue this deep dive — shown in UI, not separate nav rows. */
  questionTriggers: string[];
};

type RawFollow = { id?: string; question?: string; answer?: string };
type RawQuestion = {
  curatedKey?: string;
  category?: string;
  title?: string;
  navigationLabel?: string;
  shortLabel?: string;
  priority?: number;
  answer?: string;
  shortAnswer?: string;
  followUps?: RawFollow[];
  aliases?: string[];
  evidenceStatus?: string;
  accuracyNote?: string;
  suggestedPinned?: boolean;
  recordType?: string;
  linkedDeepDiveKey?: string | null;
  questionTriggers?: string[];
};

/** @deprecated Sidebar uses `jazInterviewExperienceSections`; kept for legacy category strings on records. */
export const JAZ_INTERVIEW_CATEGORIES: { id: string; label: string }[] = [
  { id: "Likely panel questions", label: "Likely panel questions (1–10)" },
  { id: "Panel questions", label: "Likely panel questions (1–10)" },
];

export type JazInterviewExperienceSection = {
  deepDiveKey: string;
  label: string;
  deepDive: JazInterviewQuestion;
};

export function jazInterviewExperienceSections(
  questions: JazInterviewQuestion[] = jazInterviewQuestions
): JazInterviewExperienceSection[] {
  const dives = questions
    .filter((q) => q.recordType === "deep_dive")
    .sort((a, b) => a.curatedKey.localeCompare(b.curatedKey));
  return dives.map((deepDive) => ({
    deepDiveKey: deepDive.curatedKey,
    label: deepDive.shortLabel,
    deepDive,
  }));
}

function asQuestions(input: RawQuestion[]): JazInterviewQuestion[] {
  return input.map((q, index) => {
    const curatedKey = String(q.curatedKey ?? `P${index + 1}`);
    const followUps: JazFollowUp[] = (q.followUps ?? []).map((follow, followIndex) => ({
      id: follow.id ? String(follow.id) : `jaziv-${curatedKey}-f${followIndex + 1}`,
      question: String(follow.question ?? ""),
      answer: String(follow.answer ?? ""),
    }));
    const title = String(q.title ?? "");
    const nav = String(q.navigationLabel ?? title);
    const shortLabel =
      q.shortLabel != null && String(q.shortLabel).trim()
        ? String(q.shortLabel)
        : nav.length > 56
          ? `${nav.slice(0, 56)}…`
          : nav;
    const recordType: JazInterviewRecordType =
      q.recordType === "deep_dive" ? "deep_dive" : q.recordType === "alias" ? "alias" : "panel";
    return {
      id: `jaziv-${curatedKey}`,
      curatedKey,
      category: String(q.category ?? "Panel questions"),
      title,
      navigationLabel: nav,
      shortLabel,
      priority: Number(q.priority ?? 2),
      answer: String(q.answer ?? ""),
      shortAnswer: String(q.shortAnswer ?? q.answer ?? "").split("\n\n")[0] ?? "",
      followUps,
      aliases: (q.aliases ?? []).map(String),
      evidenceStatus: String(q.evidenceStatus ?? ""),
      accuracyNote: String(q.accuracyNote ?? ""),
      projectTags: [],
      suggestedPinned: Boolean(q.suggestedPinned),
      recordType,
      linkedDeepDiveKey: q.linkedDeepDiveKey ?? null,
      questionTriggers: (q.questionTriggers ?? []).map(String).filter(Boolean),
    };
  });
}

const rawQuestions = ((raw as { questions?: RawQuestion[] }).questions ?? []) as RawQuestion[];

export const jazInterviewQuestions: JazInterviewQuestion[] = asQuestions(rawQuestions);

export const jazInterviewPanelQuestions = jazInterviewQuestions.filter((q) => q.recordType === "panel");

export const jazInterviewPinnedQuestions = jazInterviewQuestions.filter((q) => q.suggestedPinned);

/** Sidebar Quick picks: likely panel Q03–Q10 only. */
export const jazInterviewPanelQuickPicks = jazInterviewPanelQuestions.filter((q) => q.suggestedPinned);

export const jazInterviewDeepDives = jazInterviewQuestions.filter((q) => q.recordType === "deep_dive");

export function jazInterviewCategoryLabel(question: JazInterviewQuestion): string {
  if (question.recordType === "panel") return "Likely panel questions";
  if (question.recordType === "deep_dive") return `${question.curatedKey} · Experience`;
  return JAZ_INTERVIEW_CATEGORIES.find((c) => c.id === question.category)?.label ?? question.category;
}

export function validateJazInterviewDataset(): string[] {
  const issues: string[] = [];
  const meta = raw as { metadata?: { panelCount?: number; deepDiveCount?: number; followUpCount?: number } };
  const panels = jazInterviewQuestions.filter((q) => q.recordType === "panel");
  const dives = jazInterviewQuestions.filter((q) => q.recordType === "deep_dive");
  if (panels.length !== (meta.metadata?.panelCount ?? 10)) issues.push(`expected 10 panel questions, found ${panels.length}`);
  if (dives.length !== (meta.metadata?.deepDiveCount ?? 5)) issues.push(`expected 5 deep dives, found ${dives.length}`);
  for (const d of dives) {
    if (!d.answer.trim()) issues.push(`${d.curatedKey} missing reduced answer`);
    if (d.followUps.length < 5) issues.push(`${d.curatedKey} expected 5 follow-ups, found ${d.followUps.length}`);
  }
  const fuTotal = jazInterviewQuestions.reduce((n, q) => n + q.followUps.length, 0);
  if (fuTotal < 25) issues.push(`expected at least 25 follow-ups total, found ${fuTotal}`);
  const triggerTotal = dives.reduce((n, d) => n + d.questionTriggers.length, 0);
  const metaTriggers = (raw as { metadata?: { questionTriggerCount?: number } }).metadata?.questionTriggerCount;
  if (metaTriggers != null && triggerTotal !== metaTriggers) {
    issues.push(`question trigger count mismatch: metadata ${metaTriggers}, found ${triggerTotal}`);
  }
  for (const d of dives) {
    if (d.questionTriggers.length < 5) {
      issues.push(`${d.curatedKey} expected 5 question cues, found ${d.questionTriggers.length}`);
    }
  }
  const legacyAliases = jazInterviewQuestions.filter((q) => q.recordType === "alias");
  if (legacyAliases.length > 0) {
    issues.push(`legacy alias rows should not be in pack (found ${legacyAliases.length}); rebuild from source`);
  }
  return issues;
}

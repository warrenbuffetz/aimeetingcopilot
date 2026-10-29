import type { EnrichedQaRow, InterviewProfileKey } from "./types";

export type { InterviewProfileKey };

const SIMPLII_MARKERS = /\b(simplii(?:\s+financial)?|simplii-jd|simplii-from-)\b/i;
const OPENTABLE_MARKERS = /\b(opentable|opentable-rec|opentable-jd)\b/i;
const QUESTRADE_MARKERS =
  /\b(questrade|questbank|temenos|brokerage-to-banking|investing-to-banking|questrade flows)\b/i;

const JOB_QUESTION_MARKERS =
  /\bwhy\s+(questrade|simplii|opentable|questbank|this\s+(role|company|opportunity)|are you interested)\b/i;

export function interviewProfileKeyFromLabel(profileName: string | null | undefined): InterviewProfileKey {
  if (!profileName) return "unknown";
  if (/questrade/i.test(profileName)) return "questrade";
  if (/simplii/i.test(profileName)) return "simplii";
  if (/opentable/i.test(profileName)) return "opentable";
  return "unknown";
}

function questionSurface(row: EnrichedQaRow): string {
  const nav = row.navigator;
  return [row.question, nav.canonicalQuestion, ...(nav.altPhrasings ?? [])].filter(Boolean).join("\n");
}

const SHARED_CATEGORIES = new Set([
  "resume_deep_dive",
  "leadership_behavioural",
  "banking_technical",
  "banking_strategy",
  "product_analytics",
]);

/** True when the prepared row is about this employer/role, not general experience or cases. */
export function isJobSpecificPreparedRow(row: EnrichedQaRow): boolean {
  const nav = row.navigator;
  if (nav.profileExclusive) return true;
  if (SHARED_CATEGORIES.has(nav.libraryCategory)) return false;

  const q = questionSurface(row);
  if (JOB_QUESTION_MARKERS.test(q)) return true;
  if (/\bwhy\s+(questrade|simplii|opentable|questbank)\b/i.test(q)) return true;
  if (/\bwhy\s+this\s+(role|company|opportunity|team)\b/i.test(q)) return true;
  if (
    /\bwhy\s+.+\b(role|company|opportunity|team|move|leaving|instead)\b/i.test(q) &&
    (SIMPLII_MARKERS.test(q) || QUESTRADE_MARKERS.test(q) || OPENTABLE_MARKERS.test(q))
  ) {
    return true;
  }
  return false;
}

/** Which profile owns this row when job-specific; null means shared across profiles. */
export function exclusiveProfileForPreparedRow(row: EnrichedQaRow): InterviewProfileKey | null {
  const nav = row.navigator;
  if (nav.profileExclusive) return nav.profileExclusive;

  if (!isJobSpecificPreparedRow(row)) return null;

  const importKey = nav.importKey ?? "";
  if (importKey.startsWith("simplii-")) return "simplii";
  if (importKey.startsWith("opentable-")) return "opentable";

  const q = questionSurface(row);
  const qSimplii = SIMPLII_MARKERS.test(q);
  const qOpentable = OPENTABLE_MARKERS.test(q);
  const qQuestrade = QUESTRADE_MARKERS.test(q);
  if (qSimplii && !qQuestrade && !qOpentable) return "simplii";
  if (qOpentable && !qQuestrade && !qSimplii) return "opentable";
  if (qQuestrade && !qSimplii && !qOpentable) return "questrade";

  const answerLead = (row.answer ?? "").slice(0, 400);
  if (SIMPLII_MARKERS.test(q) || SIMPLII_MARKERS.test(answerLead)) return "simplii";
  if (OPENTABLE_MARKERS.test(q) || OPENTABLE_MARKERS.test(answerLead)) return "opentable";
  if (QUESTRADE_MARKERS.test(q) || QUESTRADE_MARKERS.test(answerLead)) return "questrade";

  return null;
}

/**
 * Defence-in-depth when catalogs are merged. Shared experience rows stay visible on every profile;
 * only job-specific prepared answers are exclusive.
 */
export function isPreparedRowEligibleForProfile(
  row: EnrichedQaRow,
  profile: InterviewProfileKey
): boolean {
  if (profile === "unknown") return true;
  const exclusive = exclusiveProfileForPreparedRow(row);
  if (!exclusive) return true;
  return exclusive === profile;
}

const EMPLOYER_CLOSE_PLACEHOLDER = /\{\{\s*EMPLOYER_CLOSE\s*\}\}/i;

/** Answer text for display/TTS, applying optional per-profile closing. */
export function preparedAnswerForProfile(row: EnrichedQaRow, profile: InterviewProfileKey): string {
  const base = row.answer ?? "";
  const closing = row.navigator.employerClosing?.[profile];
  if (!closing) return base;
  if (EMPLOYER_CLOSE_PLACEHOLDER.test(base)) {
    return base.replace(EMPLOYER_CLOSE_PLACEHOLDER, closing.trim());
  }
  const trimmed = base.trimEnd();
  if (!trimmed) return closing.trim();
  return `${trimmed}\n\n${closing.trim()}`;
}

import type { EnrichedQaRow } from "./types";

export type InterviewProfileKey = "questrade" | "simplii" | "unknown";

const SIMPLII_MARKERS = /\b(simplii(?:\s+financial)?|simplii-jd|simplii-from-)\b/i;
const QUESTRADE_MARKERS =
  /\b(questrade|questbank|temenos|brokerage-to-banking|investing-to-banking|questrade flows)\b/i;

export function interviewProfileKeyFromLabel(profileName: string | null | undefined): InterviewProfileKey {
  if (!profileName) return "unknown";
  if (/questrade/i.test(profileName)) return "questrade";
  if (/simplii/i.test(profileName)) return "simplii";
  return "unknown";
}

function rowSurfaceText(row: EnrichedQaRow): string {
  const nav = row.navigator;
  return [
    row.question,
    row.answer,
    nav.canonicalQuestion,
    nav.importKey,
    nav.sourceFile,
    ...(nav.altPhrasings ?? []),
  ]
    .filter(Boolean)
    .join("\n");
}

/** Defence-in-depth: filter catalog rows that belong to another interview profile. */
export function isPreparedRowEligibleForProfile(
  row: EnrichedQaRow,
  profile: InterviewProfileKey
): boolean {
  if (profile === "unknown") return true;

  const text = rowSurfaceText(row);
  const importKey = row.navigator.importKey ?? "";

  if (profile === "questrade") {
    if (SIMPLII_MARKERS.test(text)) return false;
    if (importKey.startsWith("simplii-")) return false;
    return true;
  }

  if (profile === "simplii") {
    if (QUESTRADE_MARKERS.test(text)) return false;
    return true;
  }

  return true;
}

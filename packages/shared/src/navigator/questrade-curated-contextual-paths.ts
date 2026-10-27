import resolved from "./questrade-curated-contextual-followups-resolved.json";
import type { InterviewRound } from "./types";

export type CuratedContextualChild = {
  questionId: string;
  order: number;
  intent?: string;
  reason: string;
  question?: string;
};

export type CuratedContextualPath = {
  anchorQuestionId: string;
  anchorQuestion: string;
  round: InterviewRound;
  anchorRoundRank: number;
  anchorTier?: string;
  children: CuratedContextualChild[];
};

export const QUESTRADE_CURATED_CONTEXTUAL_PROFILE_ID = resolved.profileId as string;
export const QUESTRADE_TELL_ME_ABOUT_YOURSELF_ID = "2f3a780e-6b54-42b8-b56d-8936a471fa68";

const ROUND_FALLBACK_ORDER: InterviewRound[] = [
  "recruiter",
  "hiring_manager",
  "cross_functional_panel",
];

function pathKey(anchorId: string, round: InterviewRound): string {
  return `${anchorId}:${round}`;
}

const lookup = new Map<string, CuratedContextualChild[]>();

for (const p of resolved.paths as CuratedContextualPath[]) {
  lookup.set(pathKey(p.anchorQuestionId, p.round), p.children);
}

export function getCuratedContextualChildren(
  anchorQuestionId: string,
  round: InterviewRound | null | undefined
): CuratedContextualChild[] | null {
  const r = round ?? "recruiter";
  const direct = lookup.get(pathKey(anchorQuestionId, r));
  if (direct?.length) return direct;

  for (const fallback of ROUND_FALLBACK_ORDER) {
    if (fallback === r) continue;
    const alt = lookup.get(pathKey(anchorQuestionId, fallback));
    if (alt?.length) return alt;
  }
  return null;
}

export function hasCuratedContextualPath(anchorQuestionId: string, round: InterviewRound): boolean {
  return Boolean(lookup.get(pathKey(anchorQuestionId, round))?.length);
}

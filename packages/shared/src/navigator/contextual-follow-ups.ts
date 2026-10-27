import { scoreLexicalSimilarity } from "../lexical-match";
import {
  getCuratedContextualChildren,
  type CuratedContextualChild,
} from "./questrade-curated-contextual-paths";
import { simpliiHpChildrenForParentImportKey } from "./simplii-hp-paths";
import {
  type InterviewProfileKey,
  isPreparedRowEligibleForProfile,
} from "./profile-content-eligibility";
import { isRetrievalExcluded } from "./revision-retrieval";
import type { EnrichedQaRow, FollowUpSuggestion, InterviewRound, InterviewSessionContext } from "./types";

export const CONTEXTUAL_FOLLOW_UP_DEFAULT_LIMIT = 4;
export const CONTEXTUAL_FOLLOW_UP_EXPANDED_LIMIT = 8;

export type ContextualFollowUpOptions = {
  limit?: number;
  interviewProfile?: InterviewProfileKey;
  anchorQuestionLabel?: string;
};

function normKey(question: string): string {
  return question
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isParaphraseOf(a: string, b: string): boolean {
  if (normKey(a) === normKey(b)) return true;
  return scoreLexicalSimilarity(a, b) >= 0.88;
}

function isParaphraseOfAny(question: string, texts: string[]): boolean {
  return texts.some((t) => t && isParaphraseOf(question, t));
}

function canonicalAnchorId(row: EnrichedQaRow): string {
  return row.navigator.canonicalQuestionId && row.navigator.canonicalQuestionId !== row.id
    ? row.navigator.canonicalQuestionId
    : row.id;
}

function narrowRelatedFallback(
  catalog: EnrichedQaRow[],
  activeRow: EnrichedQaRow,
  ctx: InterviewSessionContext,
  profile: InterviewProfileKey,
  excludeTexts: string[],
  limit: number
): FollowUpSuggestion[] {
  const eligible = catalog.filter((r) => isPreparedRowEligibleForProfile(r, profile));
  const byId = new Map(eligible.map((r) => [r.id, r]));
  const out: FollowUpSuggestion[] = [];
  const seen = new Set<string>();

  const addRow = (row: EnrichedQaRow, reason: string, rank: number) => {
    if (row.id === activeRow.id || seen.has(row.id)) return;
    if (isRetrievalExcluded(row.navigator)) return;
    if (ctx.askedQuestionIds.includes(row.id)) return;
    if (isParaphraseOfAny(row.question, excludeTexts)) return;
    seen.add(row.id);
    out.push({
      rowId: row.id,
      question: row.question,
      answer: row.answer,
      experienceModuleId: row.navigator.experienceModuleId,
      experienceLabel: row.navigator.experienceLabel,
      intent: row.navigator.intent,
      rank,
      reason,
    });
  };

  for (const rid of activeRow.navigator.relatedQuestionIds ?? []) {
    const row = byId.get(rid);
    if (row) addRow(row, "Linked follow-up in your library", 0.9);
  }
  for (const row of eligible) {
    if ((row.navigator.relatedQuestionIds ?? []).includes(activeRow.id)) {
      addRow(row, "Linked follow-up in your library", 0.88);
    }
    if (row.navigator.canonicalQuestionId === activeRow.id) {
      addRow(row, "Follow-up to current decision", 0.85);
    }
  }

  return out.slice(0, limit);
}

function curatedSuggestions(
  catalog: EnrichedQaRow[],
  activeRow: EnrichedQaRow,
  round: InterviewRound,
  ctx: InterviewSessionContext,
  profile: InterviewProfileKey,
  excludeTexts: string[],
  children: CuratedContextualChild[],
  limit: number
): FollowUpSuggestion[] {
  const byId = new Map(catalog.map((r) => [r.id, r]));
  const out: FollowUpSuggestion[] = [];
  const seen = new Set<string>();

  for (const child of children) {
    if (out.length >= limit) break;
    const row = byId.get(child.questionId);
    if (!row || !isPreparedRowEligibleForProfile(row, profile)) continue;
    if (isRetrievalExcluded(row.navigator)) continue;
    if (ctx.askedQuestionIds.includes(row.id)) continue;
    if (isParaphraseOfAny(row.question, excludeTexts)) continue;
    if (seen.has(row.id)) continue;
    seen.add(row.id);

    out.push({
      rowId: row.id,
      question: row.question,
      answer: row.answer,
      experienceModuleId: row.navigator.experienceModuleId,
      experienceLabel: row.navigator.experienceLabel,
      intent: row.navigator.intent,
      rank: 1 - child.order * 0.001,
      reason: child.reason,
    });
  }
  return out;
}

/**
 * Centre-panel contextual follow-ups: round-specific curated paths (Questrade Top 115), no generic backfill.
 */
export function suggestContextualFollowUps(
  catalog: EnrichedQaRow[],
  ctx: InterviewSessionContext,
  activeRow: EnrichedQaRow | null,
  _recentDetectedQuestions: string[],
  limitOrOpts: number | ContextualFollowUpOptions = CONTEXTUAL_FOLLOW_UP_DEFAULT_LIMIT
): FollowUpSuggestion[] {
  if (!activeRow) return [];

  const opts: ContextualFollowUpOptions =
    typeof limitOrOpts === "number" ? { limit: limitOrOpts } : limitOrOpts;
  const limit = opts.limit ?? CONTEXTUAL_FOLLOW_UP_DEFAULT_LIMIT;
  const profile = opts.interviewProfile ?? "unknown";
  const round: InterviewRound = ctx.activeInterviewRound ?? "recruiter";

  const excludeTexts = [
    ctx.lastDetectedQuestion ?? "",
    activeRow.question,
    ...(activeRow.navigator.altPhrasings ?? []),
    activeRow.navigator.canonicalQuestion ?? "",
  ].filter(Boolean);

  const anchorId = canonicalAnchorId(activeRow);

  if (profile === "simplii") {
    const hpKeys = simpliiHpChildrenForParentImportKey(activeRow.navigator.importKey);
    if (hpKeys.length) {
      const children: CuratedContextualChild[] = [];
      let order = 0;
      for (const hpKey of hpKeys) {
        const row = catalog.find((r) => r.navigator.importKey === hpKey);
        if (!row || !isPreparedRowEligibleForProfile(row, profile)) continue;
        children.push({
          questionId: row.id,
          order: order++,
          reason: "High-pressure follow-up (panel drill)",
          intent: row.navigator.intent,
        });
      }
      if (children.length) {
        const curated = curatedSuggestions(
          catalog,
          activeRow,
          round,
          ctx,
          profile,
          excludeTexts,
          children,
          limit
        );
        if (curated.length) return curated;
      }
    }
    return narrowRelatedFallback(catalog, activeRow, ctx, profile, excludeTexts, limit);
  }

  if (profile === "questrade" || profile === "unknown") {
    const children = getCuratedContextualChildren(anchorId, round);
    if (children?.length) {
      const curated = curatedSuggestions(
        catalog,
        activeRow,
        round,
        ctx,
        profile === "unknown" ? "questrade" : profile,
        excludeTexts,
        children,
        limit
      );
      if (curated.length) return curated;
    }
  }

  if (profile === "questrade" || profile === "unknown") {
    return narrowRelatedFallback(catalog, activeRow, ctx, "questrade", excludeTexts, limit);
  }

  return narrowRelatedFallback(catalog, activeRow, ctx, profile, excludeTexts, limit);
}

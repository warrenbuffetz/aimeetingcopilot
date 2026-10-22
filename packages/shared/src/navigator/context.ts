import { rankPreparedQaLexical, scoreLexicalSimilarity, type LexicalQaRow } from "../lexical-match";
import { LEXICAL_MATCH_THRESHOLD_WEAK } from "../lexical-match";
import { experienceModule } from "./experience-modules";
import { enrichQaRow, type InferMetaInput } from "./meta-inference";
import type {
  ContextResolution,
  EnrichedQaRow,
  InterviewSessionContext,
  QuestionIntent,
} from "./types";

const TOPIC_SWITCH =
  /\b(switch gears|different topic|let'?s (talk|move) about|move on to|change (topics|subjects)|instead, tell me about)\b/i;

const AMBIGUOUS_FOLLOW_UP =
  /\b(what would you do differently|how did you measure|what did you (personally )?decide|what did you own|what was your role|what would you change)\b/i;

const COMPANY_HINTS: { pattern: RegExp; moduleId: string }[] = [
  { pattern: /\b(rbc|avion|interac)\b/i, moduleId: "rbc-cashback" },
  { pattern: /\b(arc'?teryx|rebird)\b/i, moduleId: "arcteryx-membership" },
  { pattern: /\b(aeroplan|air canada)\b/i, moduleId: "aeroplan-cobrand" },
  { pattern: /\b(hbc|hudson'?s bay|neo financial)\b/i, moduleId: "hbc-mastercard-app" },
  { pattern: /\b(questbank|questrade)\b/i, moduleId: "questrade-primary" },
];

export function enrichLibrary(rows: InferMetaInput[]): EnrichedQaRow[] {
  return rows.map(enrichQaRow);
}

function detectExplicitModule(spoken: string): string | null {
  for (const { pattern, moduleId } of COMPANY_HINTS) {
    if (pattern.test(spoken)) return moduleId;
  }
  return null;
}

export function isAmbiguousFollowUp(spoken: string): boolean {
  return AMBIGUOUS_FOLLOW_UP.test(spoken);
}

export function resolveInterviewContext(
  spoken: string,
  library: EnrichedQaRow[],
  prev: InterviewSessionContext
): ContextResolution {
  const lexicalRows: LexicalQaRow[] = library.map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
    isPreferred: r.isPreferred,
    followUps: r.navigator.altPhrasings.map((q) => ({ question: q, answer: r.answer })),
    category: r.category,
  }));

  const ranked = rankPreparedQaLexical(spoken, lexicalRows);
  const best = ranked[0];
  const bestEnriched = best ? library.find((r) => r.id === best.rowId) : undefined;

  const topicSwitch = TOPIC_SWITCH.test(spoken);
  const explicitModule = detectExplicitModule(spoken);
  const ambiguous = isAmbiguousFollowUp(spoken);
  const override = prev.manualExperienceOverrideId;

  let experienceModuleId =
    override ?? explicitModule ?? bestEnriched?.navigator.experienceModuleId ?? prev.activeExperienceModuleId;
  let intent = bestEnriched?.navigator.intent ?? null;
  let rowId = best?.rowId ?? null;
  let confidence = best?.score ?? 0;

  if (ambiguous && !explicitModule && !topicSwitch && prev.activeExperienceModuleId) {
    experienceModuleId = prev.activeExperienceModuleId;
    const inModule = library.filter((r) => r.navigator.experienceModuleId === experienceModuleId);
    let bestLocal: { row: EnrichedQaRow; score: number } | null = null;
    for (const row of inModule) {
      const s = scoreLexicalSimilarity(spoken, row.question);
      const intentBoost = row.navigator.intent === intentFromAmbiguous(spoken) ? 0.08 : 0;
      const total = s + intentBoost;
      if (!bestLocal || total > bestLocal.score) bestLocal = { row, score: total };
    }
    if (bestLocal && bestLocal.score >= LEXICAL_MATCH_THRESHOLD_WEAK * 0.85) {
      rowId = bestLocal.row.id;
      intent = bestLocal.row.navigator.intent;
      confidence = bestLocal.score;
    }
  }

  if (topicSwitch && explicitModule) {
    experienceModuleId = explicitModule;
  }

  const mod = experienceModuleId ? experienceModule(experienceModuleId) : null;

  return {
    experienceModuleId,
    experienceLabel: mod?.label ?? null,
    intent,
    topicSwitch: topicSwitch || Boolean(explicitModule && explicitModule !== prev.activeExperienceModuleId),
    confidence,
    rowId,
  };
}

function intentFromAmbiguous(spoken: string): QuestionIntent {
  const q = spoken.toLowerCase();
  if (/differently|change/.test(q)) return "what_differently";
  if (/measure/.test(q)) return "measurement_impact";
  if (/decide|own/.test(q)) return "personal_ownership";
  return "general";
}

export function applyContextResolution(
  prev: InterviewSessionContext,
  resolution: ContextResolution,
  spoken: string,
  matchedRowId?: string | null
): InterviewSessionContext {
  const id = matchedRowId ?? resolution.rowId;
  const askedIds = id && !prev.askedQuestionIds.includes(id) ? [...prev.askedQuestionIds, id] : prev.askedQuestionIds;
  const askedTexts =
    spoken && !prev.askedQuestionTexts.includes(spoken)
      ? [...prev.askedQuestionTexts, spoken]
      : prev.askedQuestionTexts;

  const prevExp = prev.activeExperienceModuleId;
  const nextExp = resolution.experienceModuleId;

  return {
    ...prev,
    previousExperienceModuleId: resolution.topicSwitch ? prevExp : prev.previousExperienceModuleId,
    activeExperienceModuleId: nextExp,
    activeExperienceLabel: resolution.experienceLabel,
    activeIntent: resolution.intent,
    activeQuestionId: id,
    askedQuestionIds: askedIds,
    askedQuestionTexts: askedTexts,
    lastDetectedQuestion: spoken,
  };
}

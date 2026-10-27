import { rankPreparedQaLexical, scoreLexicalSimilarity, type LexicalQaRow } from "../lexical-match";
import { LEXICAL_MATCH_THRESHOLD_WEAK } from "../lexical-match";
import { experienceModule } from "./experience-modules";
import { enrichQaRow, type InferMetaInput } from "./meta-inference";
import { enrichQaRowFromPersisted, type PersistedNavigatorMeta } from "./navigator-meta-persist";
import type {
  ContextResolution,
  EnrichedQaRow,
  InterviewSessionContext,
  QuestionIntent,
} from "./types";

const TOPIC_SWITCH =
  /\b(switch gears|different topic|let'?s (talk|move) about|move on to|change (topics|subjects)|instead, tell me about)\b/i;

const AMBIGUOUS_FOLLOW_UP =
  /\b(what would you do differently|how did you measure|how exactly did you measure|what did you (personally )?decide|what did you own|what was your role|what would you change|was that incremental|how did you attribute|why did you use|why interac|what if it failed|how would the customer know|how did you prevent|how did you know it worked|what went wrong|how would you handle|why didn't you|whole membership platform|continue without you|leave before seeing|those 14|the 14|14 people|direct reports?|what actually shipped|still planned|what is live from|what would you put in the mvp|what goes in the mvp|approved trade|duplicate order|times? out)\b/i;

const BROAD_EMPLOYER_QUESTION =
  /\b(tell me more about your time at|walk me through your (role|experience) at|what did you work on at|give me an overview of your|tell me about your experience at)\b/i;

function employerOverviewModuleFromSpoken(spoken: string): string | null {
  if (!BROAD_EMPLOYER_QUESTION.test(spoken)) return null;
  if (/\b(arc'?teryx|arcterx|arcteryx)\b/i.test(spoken)) return "arcteryx-overview";
  if (/\b(rbc|royal bank|avion rewards)\b/i.test(spoken)) return "rbc-overview";
  if (/\b(hbc|hudson'?s bay)\b/i.test(spoken)) return "hbc-overview";
  if (/\b(aeroplan|air canada)\b/i.test(spoken)) return "aeroplan-overview";
  return null;
}

const COMPANY_HINTS: { pattern: RegExp; moduleId: string }[] = [
  { pattern: /\bshop\s*plus|shopplus\b/i, moduleId: "rbc-shopplus" },
  { pattern: /\b(rbc|avion|interac)\b/i, moduleId: "rbc-cashback" },
  { pattern: /\b(arc'?teryx|rebird)\b/i, moduleId: "arcteryx-membership" },
  { pattern: /\b(aeroplan|air canada)\b/i, moduleId: "aeroplan-cobrand" },
  {
    pattern: /\b(hbc|hudson'?s bay).*(portfolio|ltv|p&l|cardholder|incremental|quests)\b/i,
    moduleId: "hbc-portfolio",
  },
  { pattern: /\b(hbc|hudson'?s bay|neo financial)\b/i, moduleId: "hbc-mastercard-app" },
  { pattern: /\b(questbank|questrade)\b/i, moduleId: "questrade-primary" },
];

export type EnrichLibraryInput = InferMetaInput & { navigatorMeta?: PersistedNavigatorMeta | null };

export function enrichLibrary(rows: EnrichLibraryInput[]): EnrichedQaRow[] {
  return rows.map((row) =>
    row.navigatorMeta && Object.keys(row.navigatorMeta).length > 0
      ? enrichQaRowFromPersisted({ ...row, navigatorMeta: row.navigatorMeta })
      : enrichQaRow(row)
  );
}

export function explicitExperienceModuleFromSpoken(spoken: string): string | null {
  const overview = employerOverviewModuleFromSpoken(spoken);
  if (overview) return overview;
  for (const { pattern, moduleId } of COMPANY_HINTS) {
    if (pattern.test(spoken)) return moduleId;
  }
  return null;
}

export { employerOverviewModuleFromSpoken };

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
  const explicitModule = explicitExperienceModuleFromSpoken(spoken);
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
  if (/incremental|attribut/.test(q)) return "attribution";
  if (/differently|change/.test(q)) return "what_differently";
  if (/measure|know it worked|prevent/.test(q)) return "measurement_impact";
  if (/decide|own|direct report|those 14|the 14/.test(q)) return "personal_ownership";
  if (/shipped|still planned|what is live/.test(q)) return "main_story";
  if (/mvp/.test(q)) return "solution_alternatives";
  if (/why did you use|why interac|technical|integrat/.test(q)) return "technical_implementation";
  if (/what if|failed|went wrong|customer know|timeout|duplicate/.test(q)) return "challenges_lessons";
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

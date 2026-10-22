import { transitionScore } from "./intent-transitions";
import { librarySectionForModule } from "./library-sections";
import { experienceModule } from "./experience-modules";
import type { EnrichedQaRow, FollowUpSuggestion, InterviewSessionContext, QuestionIntent } from "./types";
import { intentLabel } from "./follow-ups";

const ANALYTICAL_INTENTS: QuestionIntent[] = [
  "measurement_impact",
  "attribution",
  "technical_implementation",
  "prioritization",
];

/**
 * Up to three likely next questions (Next tab). Empty when no active experience.
 */
export function suggestNextQuestions(
  catalog: EnrichedQaRow[],
  ctx: InterviewSessionContext,
  limit = 3
): FollowUpSuggestion[] {
  const moduleId = ctx.manualExperienceOverrideId ?? ctx.activeExperienceModuleId;
  if (!moduleId) return [];

  const sameModule: FollowUpSuggestion[] = [];
  const related: FollowUpSuggestion[] = [];

  const activeSection = librarySectionForModule(experienceModule(moduleId));

  for (const row of catalog) {
    if (ctx.askedQuestionIds.includes(row.id)) continue;

    const tScore = transitionScore(ctx.activeIntent, row.navigator.intent);
    const inModule = row.navigator.experienceModuleId === moduleId;

    if (inModule && tScore < 0.08) continue;

    const item: FollowUpSuggestion = {
      rowId: row.id,
      question: row.question,
      answer: row.answer,
      experienceModuleId: row.navigator.experienceModuleId,
      experienceLabel: row.navigator.experienceLabel,
      intent: row.navigator.intent,
      rank: tScore + (row.isPreferred ? 0.05 : 0),
      reason: ctx.activeIntent
        ? `After ${intentLabel(ctx.activeIntent)}`
        : "Related to active experience",
    };

    if (inModule) {
      item.rank += 0.2;
      sameModule.push(item);
    } else if (
      row.navigator.librarySection === activeSection &&
      ANALYTICAL_INTENTS.includes(row.navigator.intent)
    ) {
      related.push(item);
    }
  }

  sameModule.sort((a, b) => b.rank - a.rank);
  related.sort((a, b) => b.rank - a.rank);

  const out: FollowUpSuggestion[] = [];
  for (const s of sameModule) {
    if (out.length >= limit) break;
    out.push(s);
  }
  for (const s of related) {
    if (out.length >= limit) break;
    if (!out.some((x) => x.rowId === s.rowId)) out.push(s);
  }
  return out.slice(0, limit);
}

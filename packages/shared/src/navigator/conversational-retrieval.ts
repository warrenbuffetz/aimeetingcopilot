import { isAmbiguousFollowUp } from "./context";
import type { EnrichedQaRow, InterviewSessionContext, QuestionIntent } from "./types";

/** Stable Questrade Tier 2 canonical IDs (measurement + behavioural intents). */
export const QUESTRADE_TIER2_CANONICAL = {
  aeroplanMeasurementPrimary: "0e33272e-0d91-49a8-8d6d-e74881372454",
  hbcMeasurementPrimary: "722da43e-9883-44ce-800c-97a0aafbc694",
  hbcMeasurementAttributionFollowUp: "2af89a04-ab52-40bd-928d-96a3122fffd1",
  arcLiveVsPlanned: "1c3f6b10-2b62-4807-bffd-ef21beef30d7",
  weakness: "39a0bcf9-7d01-4cde-8da4-4ff893da44b3",
  productMistakeQ3: "c8d9e0f1-2a3b-4c5d-6e7f-8a9b0c1d2e3f",
  initiativeDidntGoToPlan: "15aa03e2-46af-4d60-9d73-90ed342c6ccc",
} as const;

export type ConversationalBoost = {
  preferredModuleIds?: string[];
  preferredRowIds?: string[];
  preferredIntent?: QuestionIntent;
  penalizeRowIds?: string[];
  /** Multiply score for rows outside these modules when active context is set */
  penalizeOtherModules?: boolean;
};

function activeRow(
  session: InterviewSessionContext,
  catalog: EnrichedQaRow[]
): EnrichedQaRow | null {
  if (!session.activeQuestionId) return null;
  return catalog.find((r) => r.id === session.activeQuestionId) ?? null;
}

function moduleFamily(moduleId: string | null | undefined): string | null {
  if (!moduleId) return null;
  if (moduleId.startsWith("rbc-")) return "rbc";
  if (moduleId.startsWith("hbc-")) return "hbc";
  if (moduleId.startsWith("aeroplan-")) return "aeroplan";
  if (moduleId.startsWith("arcteryx-")) return "arcteryx";
  if (moduleId.startsWith("questrade-")) return "questrade";
  return moduleId;
}

/**
 * Session-aware boosts for elliptical follow-ups (MVP, those 14, shipped vs planned, etc.).
 */
export function conversationalBoostForQuery(
  spoken: string,
  session: InterviewSessionContext | null | undefined,
  catalog: EnrichedQaRow[]
): ConversationalBoost | null {
  if (!session) return null;
  const q = spoken.toLowerCase();
  const row = activeRow(session, catalog);
  const activeModule = session.activeExperienceModuleId ?? row?.navigator.experienceModuleId ?? null;
  const lastQ = (session.lastDetectedQuestion ?? row?.question ?? "").toLowerCase();

  if (/\b(biggest weakness|greatest weakness)\b/i.test(spoken)) {
    return { preferredRowIds: [QUESTRADE_TIER2_CANONICAL.weakness], penalizeOtherModules: false };
  }

  if (
    /\b(product decision you got wrong|decision you got wrong|decision you regret|mistake in product judgment|changed your mind after seeing evidence)\b/i.test(
      spoken
    )
  ) {
    return { preferredRowIds: [QUESTRADE_TIER2_CANONICAL.productMistakeQ3], penalizeOtherModules: false };
  }

  if (/\b(didn't go according to plan|didn't go to plan|initiative that didn't)\b/i.test(spoken)) {
    return {
      preferredRowIds: [QUESTRADE_TIER2_CANONICAL.initiativeDidntGoToPlan],
      penalizeRowIds: [QUESTRADE_TIER2_CANONICAL.productMistakeQ3],
      penalizeOtherModules: false,
    };
  }

  if (/\b(product that failed|failed product|product failure)\b/i.test(spoken)) {
    return {
      penalizeRowIds: [
        QUESTRADE_TIER2_CANONICAL.productMistakeQ3,
        QUESTRADE_TIER2_CANONICAL.initiativeDidntGoToPlan,
      ],
      penalizeOtherModules: false,
    };
  }

  if (
    /\b(how exactly did you measure|how did you measure).*(40%|aeroplan|conversion)/i.test(spoken) ||
    (/\b(40%|aeroplan).*(measure|conversion)/i.test(spoken) && /measure/i.test(spoken))
  ) {
    return { preferredRowIds: [QUESTRADE_TIER2_CANONICAL.aeroplanMeasurementPrimary], penalizeOtherModules: false };
  }

  if (
    (/\b(how did you measure).*(15%|hbc|application completion)/i.test(spoken) ||
      /\bapplication completion lift\b/i.test(spoken) ||
      (/\b15%/.test(spoken) && /relative|percentage point|measure/i.test(spoken))) &&
    !/\b(applicant mix|different mix|marketing traffic|attribution)\b/i.test(spoken)
  ) {
    return {
      preferredRowIds: [QUESTRADE_TIER2_CANONICAL.hbcMeasurementPrimary],
      penalizeRowIds: [QUESTRADE_TIER2_CANONICAL.hbcMeasurementAttributionFollowUp],
      penalizeOtherModules: false,
    };
  }

  if (
    /\b(what actually launched|what's live|what is live|launched versus|still being developed|still planned)\b/i.test(
      spoken
    ) &&
    /arc'?teryx|sperro|membership/i.test(spoken + lastQ)
  ) {
    return { preferredRowIds: [QUESTRADE_TIER2_CANONICAL.arcLiveVsPlanned], penalizeOtherModules: false };
  }

  if (
    /\b(those 14|the 14|14 people|fourteen people|reported directly|direct reports?|how many of those)\b/i.test(
      spoken
    )
  ) {
    return {
      preferredModuleIds: ["rbc-overview", "rbc-core", "rbc-cashback", "rbc-avion", "rbc-shopplus"],
      preferredIntent: "personal_ownership",
      penalizeOtherModules: true,
    };
  }

  if (/\b(what actually shipped|still planned|what is live from|delivered versus|what remains planned)\b/i.test(spoken)) {
    if (moduleFamily(activeModule) === "arcteryx" || /arc'?teryx|sperro|membership/.test(lastQ)) {
      return {
        preferredModuleIds: ["arcteryx-membership", "arcteryx-overview"],
        preferredIntent: "main_story",
        penalizeOtherModules: true,
      };
    }
  }

  if (/\b(what would you put in the mvp|what goes in the mvp|mvp for this|the mvp)\b/i.test(spoken)) {
    if (
      activeModule === "questrade-primary" ||
      activeModule === "questrade-deposits" ||
      /direct deposit|payroll|paycheque|primary bank/.test(lastQ)
    ) {
      return {
        preferredModuleIds: ["questrade-primary", "questrade-deposits"],
        penalizeOtherModules: true,
      };
    }
    if (moduleFamily(activeModule) === "arcteryx" || /membership|sperro/.test(lastQ)) {
      return {
        preferredModuleIds: ["arcteryx-membership"],
        penalizeOtherModules: true,
      };
    }
    if (moduleFamily(activeModule) === "rbc") {
      return {
        preferredModuleIds: activeModule ? [activeModule] : ["rbc-cashback"],
        penalizeOtherModules: true,
      };
    }
  }

  if (
    /\b(approved trade|trade request|times? out|duplicate order|prevent a duplicate)\b/i.test(spoken) &&
    (/mcp|agentic|model context/.test(lastQ) || activeModule?.includes("questrade"))
  ) {
    const tradeRows = catalog.filter((r) =>
      /duplicate order|trade request times out|approved trade/i.test(r.question)
    );
    if (tradeRows.length) {
      return { preferredRowIds: tradeRows.map((r) => r.id), penalizeOtherModules: false };
    }
  }

  if (row && (isAmbiguousFollowUp(spoken) || spoken.split(/\s+/).length <= 14)) {
    const childIds = [
      ...(row.navigator.relatedQuestionIds ?? []),
      ...(row.navigator.canonicalQuestionId && row.navigator.canonicalQuestionId !== row.id
        ? [row.navigator.canonicalQuestionId]
        : []),
    ];
    if (childIds.length) {
      return { preferredRowIds: childIds, penalizeOtherModules: false };
    }
  }

  return null;
}

export function applyConversationalBoost(
  score: number,
  row: EnrichedQaRow,
  boost: ConversationalBoost | null
): number {
  if (!boost) return score;
  let s = score;
  if (boost.preferredRowIds?.includes(row.id)) s += 0.35;
  if (boost.penalizeRowIds?.includes(row.id)) s *= 0.35;
  if (boost.preferredModuleIds?.includes(row.navigator.experienceModuleId)) s += 0.22;
  if (boost.preferredIntent && row.navigator.intent === boost.preferredIntent) s += 0.12;
  if (boost.penalizeOtherModules && boost.preferredModuleIds?.length) {
    if (!boost.preferredModuleIds.includes(row.navigator.experienceModuleId)) {
      if (row.navigator.experienceModuleId === "career-general") s *= 0.55;
      else if (row.navigator.librarySection === "career_motivation") s *= 0.5;
      else s *= 0.72;
    }
  }
  return Math.min(1, s);
}

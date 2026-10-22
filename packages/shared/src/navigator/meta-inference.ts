import type { LexicalQaRow } from "../lexical-match";
import { EXPERIENCE_MODULES, experienceModule } from "./experience-modules";
import type {
  EvidenceStatus,
  LibraryCategory,
  NavigatorQaMeta,
  QuestionIntent,
} from "./types";

const SEED_INTENT_SUFFIX: Record<string, QuestionIntent> = {
  "00": "main_story",
  "01": "problem_discovery",
  "02": "prioritization",
  "03": "solution_alternatives",
  "04": "personal_ownership",
  "05": "measurement_impact",
  "06": "what_differently",
};

function seedKeyFromNotes(notes?: string | null): string | undefined {
  if (!notes) return undefined;
  const m = notes.match(/^(RBC|ARC|HBC|AERO|HBC-X\d+)/);
  return m?.[1] ?? undefined;
}

function moduleFromSeedKey(key: string): string {
  if (key.startsWith("RBC")) return "rbc-cashback";
  if (key.startsWith("ARC")) return "arcteryx-membership";
  if (key.startsWith("HBC-X")) return "hbc-portfolio";
  if (key.startsWith("HBC")) return "hbc-mastercard-app";
  if (key.startsWith("AERO")) return "aeroplan-cobrand";
  return "general-banking";
}

function intentFromSeedKey(key: string): QuestionIntent {
  if (key.startsWith("HBC-X")) return "measurement_impact";
  const num = key.match(/(\d+)$/)?.[1];
  if (num && SEED_INTENT_SUFFIX[num]) return SEED_INTENT_SUFFIX[num];
  return "general";
}

function libraryCategoryFromPart(part?: number, category?: string | null): LibraryCategory {
  if (part === 12) return "resume_deep_dive";
  if (part === 7) return "banking_strategy";
  if (part === 8) return "product_analytics";
  if (part === 9) return "banking_technical";
  if (part === 11) return "leadership_behavioural";
  if (part === 1 || part === 2) return "career_recruiter";
  if (part === 10) return "resume_deep_dive";
  const c = (category ?? "").toLowerCase();
  if (c.includes("motivation") || c.includes("intro")) return "career_recruiter";
  if (c.includes("leadership")) return "leadership_behavioural";
  if (c.includes("analytical")) return "product_analytics";
  if (c.includes("case")) return "banking_strategy";
  return "banking_strategy";
}

function moduleFromQuestion(question: string, category?: string | null, part?: number): string {
  const q = question.toLowerCase();
  if (/\brbc\b|avion|interac|cashback withdrawal|payout/.test(q)) return "rbc-cashback";
  if (/arc'?teryx|rebird|membership platform/.test(q)) return "arcteryx-membership";
  if (/aeroplan|co-brand|427%|offer.?page/.test(q)) return "aeroplan-cobrand";
  if (/hbc.*(portfolio|ltv|activation|holdout|cardholder spending|quests)/.test(q)) return "hbc-portfolio";
  if (/hbc|neo financial|application completion|save-and-resume/.test(q)) return "hbc-mastercard-app";
  if (/direct deposit|payroll|paycheque/.test(q)) return "questrade-deposits";
  if (/balance sheet|financial hub|share of wallet/.test(q)) return "questrade-hub";
  if (/north.?star|ltv|cohort|experiment|metric|mau|conversion math/.test(q)) return "questrade-metrics";
  if (/reconcil|settlement|payout success|payment incident|ledger/.test(q)) return "questrade-payments";
  if (/primary (bank|account)|questbank/.test(q)) return "questrade-primary";
  if (part === 1 || part === 2 || (category ?? "").match(/motivation|intro/i)) return "career-general";
  if (part === 11 || (category ?? "").match(/leadership/i)) return "leadership-general";
  return "general-banking";
}

function intentFromQuestion(question: string): QuestionIntent {
  const q = question.toLowerCase();
  if (/what would you do differently|what would you change/.test(q)) return "what_differently";
  if (/how did you measure|what were the kpis|north.?star|define.*metric/.test(q)) return "measurement_impact";
  if (/what did you personally|your ownership|what did you own/.test(q)) return "personal_ownership";
  if (/why interac|why.*instead of|alternatives|trade.?off/.test(q)) return "solution_alternatives";
  if (/why priorit|why now|deprioritize/.test(q)) return "prioritization";
  if (/how did you know|discover|validate|evidence|research/.test(q)) return "problem_discovery";
  if (/technical|implementation|api|reconcil|settlement/.test(q)) return "technical_implementation";
  if (/tell me about|walk me through|describe.*launch/.test(q)) return "main_story";
  return "general";
}

function evidenceFromNotes(notes?: string | null, isPreferred?: boolean): EvidenceStatus {
  if (!notes) return isPreferred ? "resume_supported" : "resume_supported";
  const n = notes.toLowerCase();
  if (n.includes("rehearsal framework")) return "rehearsal_framework";
  if (n.includes("illustrative") || n.includes("hypothetical") || n.includes("requires verification")) {
    return "illustrative_scenario";
  }
  if (n.includes("evidence guardrail")) return "illustrative_scenario";
  if (isPreferred === false) return "rehearsal_framework";
  return "resume_supported";
}

export type InferMetaInput = LexicalQaRow & {
  notes?: string | null;
  part?: number;
};

export function inferNavigatorMeta(row: InferMetaInput): NavigatorQaMeta {
  const seedKey = seedKeyFromNotes(row.notes);
  const part = row.part;
  const libraryCategory = libraryCategoryFromPart(part, row.category);
  let experienceModuleId = seedKey ? moduleFromSeedKey(seedKey) : moduleFromQuestion(row.question, row.category, part);
  let intent = seedKey ? intentFromSeedKey(seedKey) : intentFromQuestion(row.question);

  const mod = EXPERIENCE_MODULES[experienceModuleId];
  const experienceLabel = mod?.label ?? experienceModule(experienceModuleId).label;

  const altPhrasings: string[] = [];
  for (const fu of row.followUps ?? []) {
    if (fu.question && fu.answer.trim() === row.answer.trim()) altPhrasings.push(fu.question);
    else if (fu.question && fu.answer.trim() !== row.answer.trim()) altPhrasings.push(fu.question);
  }

  const keywords = [
    mod?.company ?? "",
    experienceModuleId,
    row.category ?? "",
    libraryCategory,
    intent,
  ].filter(Boolean);

  return {
    seedKey,
    libraryCategory,
    experienceModuleId,
    experienceLabel,
    intent,
    evidenceStatus: evidenceFromNotes(row.notes, row.isPreferred),
    altPhrasings,
    keywords,
    part,
  };
}

export function enrichQaRow(row: InferMetaInput): import("./types").EnrichedQaRow {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
    isPreferred: row.isPreferred,
    navigator: inferNavigatorMeta(row),
  };
}

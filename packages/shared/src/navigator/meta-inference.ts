import type { LexicalQaRow } from "../lexical-match";
import { EXPERIENCE_MODULES, experienceModule } from "./experience-modules";
import { librarySectionForModule } from "./library-sections";
import type {
  EvidenceStatus,
  LibraryCategory,
  NavigatorQaMeta,
  QuestionIntent,
  ReviewStatus,
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
  const m = notes.match(/^(HBC-X\d+|RBC|ARC|HBC|AERO)/);
  return m?.[1] ?? undefined;
}

function moduleFromSeedKey(key: string): string {
  if (key.startsWith("RBC")) return "rbc-cashback";
  if (key.startsWith("ARC")) return "arcteryx-membership";
  if (key.startsWith("HBC-X")) return "hbc-portfolio";
  if (key.startsWith("HBC")) return "hbc-mastercard-app";
  if (key.startsWith("AERO")) return "aeroplan-cobrand";
  return "unclassified-review";
}

function intentFromSeedKey(key: string): QuestionIntent {
  if (key === "HBC-X1" || key === "HBC-X3") return "attribution";
  if (key.startsWith("HBC-X")) return "measurement_impact";
  const num = key.match(/(\d+)$/)?.[1];
  if (num && SEED_INTENT_SUFFIX[num]) return SEED_INTENT_SUFFIX[num];
  return "general";
}

function libraryCategoryFromPart(part?: number, category?: string | null): LibraryCategory {
  if (part === 12 || part === 10 || part === 4 || part === 5 || part === 6) return "resume_deep_dive";
  if (part === 7) return "banking_strategy";
  if (part === 8) return "product_analytics";
  if (part === 9) return "banking_technical";
  if (part === 11) return "leadership_behavioural";
  if (part === 1 || part === 2 || part === 3) return "career_recruiter";
  const c = (category ?? "").toLowerCase();
  if (c.includes("motivation") || c.includes("intro")) return "career_recruiter";
  if (c.includes("leadership")) return "leadership_behavioural";
  if (c.includes("analytical")) return "product_analytics";
  if (c.includes("case")) return "banking_strategy";
  if (c.includes("experience") || c.includes("resume")) return "resume_deep_dive";
  return "banking_strategy";
}

function moduleFromQuestion(question: string, category?: string | null, part?: number): string {
  const q = question.toLowerCase();
  if (/tell me more about your time at|walk me through your (role|experience) at|give me an overview of your/.test(q)) {
    if (/arc'?teryx|arcterx/.test(q)) return "arcteryx-overview";
    if (/\brbc|royal bank|avion rewards/.test(q)) return "rbc-overview";
    if (/hbc|hudson'?s bay/.test(q)) return "hbc-overview";
    if (/aeroplan|air canada/.test(q)) return "aeroplan-overview";
  }
  if (/\bshop\s*plus|shopplus/.test(q)) return "rbc-shopplus";
  if (/\bavion select|avion\b/.test(q) && !/cashback withdrawal/.test(q)) return "rbc-avion";
  if (/\bcore platform|mobile banking platform/.test(q)) return "rbc-core";
  if (/\brbc\b|interac|cashback withdrawal|payout/.test(q)) return "rbc-cashback";
  if (/arc'?teryx|rebird|membership platform/.test(q)) return "arcteryx-membership";
  if (/vendor evaluation|rfp|procurement/.test(q) && /arc'?teryx/.test(q)) return "arcteryx-vendor";
  if (/crm|salesforce|integration/.test(q) && /arc'?teryx/.test(q)) return "arcteryx-crm";
  if (/aeroplan|co-brand|427%|offer.?page/.test(q)) return "aeroplan-cobrand";
  if (/partnership|commercial partner/.test(q) && /aeroplan|air canada/.test(q)) return "aeroplan-partnerships";
  if (/quests?\b|gamification/.test(q) && /hbc|bay/.test(q)) return "hbc-quests";
  if (/hbc.*(portfolio|ltv|p&l|cardholder spending|incremental|holdout)/.test(q)) return "hbc-portfolio";
  if (/post.?approval|activation rate|first purchase/.test(q) && /hbc|mastercard/.test(q)) return "hbc-activation";
  if (/hbc|neo financial|application completion|save-and-resume/.test(q)) return "hbc-mastercard-app";
  if (/direct deposit|payroll|paycheque/.test(q)) return "questrade-deposits";
  if (/balance sheet|financial hub|share of wallet/.test(q)) return "questrade-hub";
  if (/north.?star|ltv|cohort|experiment|metric|mau|conversion math/.test(q)) return "questrade-metrics";
  if (/reconcil|settlement|payout success|payment incident|ledger/.test(q)) return "questrade-payments";
  if (/primary (bank|account)|questbank/.test(q)) return "questrade-primary";
  if (part === 1 || part === 2 || part === 3 || (category ?? "").match(/motivation|intro/i)) return "career-general";
  if (part === 11 || (category ?? "").match(/leadership/i)) return "leadership-general";
  if (part === 4 || part === 5 || part === 6) return "unclassified-review";
  return "unclassified-review";
}

function intentFromQuestion(question: string): QuestionIntent {
  const q = question.toLowerCase();
  if (/incremental|attribution|holdout|was that incremental/.test(q)) return "attribution";
  if (/what would you do differently|what would you change/.test(q)) return "what_differently";
  if (/how did you measure|what were the kpis|north.?star|define.*metric/.test(q)) return "measurement_impact";
  if (/what did you personally|your ownership|what did you own|what did you decide/.test(q)) {
    return "personal_ownership";
  }
  if (/why interac|why.*instead of|alternatives|trade.?off|solution choice/.test(q)) return "solution_alternatives";
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
  if (n.includes("unverified")) return "unverified_detail";
  if (isPreferred === false) return "rehearsal_framework";
  return "resume_supported";
}

function reviewStatusFromInference(
  moduleId: string,
  evidence: EvidenceStatus,
  part?: number
): ReviewStatus | undefined {
  if (moduleId === "unclassified-review" && part !== 7 && part !== 8 && part !== 9) return "needs_review";
  if (evidence === "unverified_detail" || evidence === "illustrative_scenario") return "needs_review";
  return "ok";
}

function topicTagsFromMeta(moduleId: string, category?: string | null, notes?: string | null): string[] {
  const tags = new Set<string>();
  const mod = EXPERIENCE_MODULES[moduleId];
  if (mod?.company) tags.add(mod.company);
  if (category) tags.add(category);
  if (notes?.match(/HBC-X/)) tags.add("portfolio");
  if (notes?.match(/RBC/)) tags.add("RBC");
  return [...tags];
}

export type InferMetaInput = LexicalQaRow & {
  notes?: string | null;
  part?: number;
  shortAnswer?: string | null;
  sourceFile?: string | null;
};

export function inferNavigatorMeta(row: InferMetaInput): NavigatorQaMeta {
  const seedKey = seedKeyFromNotes(row.notes);
  const part = row.part;
  const libraryCategory = libraryCategoryFromPart(part, row.category);
  let experienceModuleId = seedKey ? moduleFromSeedKey(seedKey) : moduleFromQuestion(row.question, row.category, part);
  let intent = seedKey ? intentFromSeedKey(seedKey) : intentFromQuestion(row.question);

  const mod = EXPERIENCE_MODULES[experienceModuleId] ?? experienceModule(experienceModuleId);
  const experienceLabel = mod.label;
  const librarySection = librarySectionForModule(mod);

  const altPhrasings: string[] = [];
  for (const fu of row.followUps ?? []) {
    if (fu.question) altPhrasings.push(fu.question);
  }

  const evidenceStatus = evidenceFromNotes(row.notes, row.isPreferred);

  return {
    seedKey,
    libraryCategory,
    librarySection,
    experienceModuleId,
    experienceLabel,
    intent,
    evidenceStatus,
    altPhrasings,
    topicTags: topicTagsFromMeta(experienceModuleId, row.category, row.notes),
    keywords: [mod.company ?? "", experienceModuleId, row.category ?? "", libraryCategory, intent].filter(Boolean),
    part,
    canonicalQuestion: row.question,
    shortAnswer: row.shortAnswer ?? undefined,
    relatedQuestionIds: [],
    sourceFile: row.sourceFile ?? undefined,
    reviewStatus: reviewStatusFromInference(experienceModuleId, evidenceStatus, part),
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

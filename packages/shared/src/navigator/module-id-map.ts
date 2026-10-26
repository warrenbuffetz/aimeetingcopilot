import type { LibraryCategory, LibrarySection, QuestionIntent } from "./types";
import { EXPERIENCE_MODULES } from "./experience-modules";

/** Map GPT / import module slugs to canonical EXPERIENCE_MODULES ids (no duplicate modules). */
export const MODULE_ID_CANONICAL: Record<string, string> = {
  "hbc-mastercard-application": "hbc-mastercard-app",
  "arcteryx-vendor-evaluation": "arcteryx-vendor",
  "questrade-primary-account": "questrade-primary",
  "questrade-competitive-positioning": "questrade-primary",
  "questrade-product-discovery": "questrade-primary",
  "banking-unit-economics": "questrade-metrics",
  "banking-product-metrics": "questrade-metrics",
  "banking-card-transactions": "questrade-payments",
  "banking-payments-platform": "questrade-payments",
  "banking-payments-integration": "questrade-payments",
  "banking-money-movement": "questrade-deposits",
  "banking-account-aggregation": "questrade-hub",
  "leadership-stakeholder-alignment": "leadership-general",
  "leadership-prioritization": "leadership-general",
  "leadership-risk-compliance": "leadership-general",
  "leadership-product-outcomes": "leadership-general",
  "general-banking": "unclassified-review",
  "career-why-questrade": "career-general",
  "career-ai-workflows": "career-general",
  "questrade-primary-banking": "questrade-primary",
  "questrade-financial-hub": "questrade-hub",
  "banking-core-platform": "questrade-temenos",
  "banking-payment-lifecycle": "questrade-payments",
  "banking-payment-operations": "questrade-payments",
  "questrade-ai-banking": "questrade-mcp",
  "ai-mcp-platform": "questrade-mcp",
  "questrade-ai-platform": "questrade-mcp",
  "ai-financial-data-integrity": "questrade-payments",
  "ai-agent-security": "questrade-mcp",
  "ai-model-evaluation": "questrade-mcp",
};

const INTENT_ALIASES: Record<string, QuestionIntent> = {
  measurement: "measurement_impact",
  solution_choice: "solution_alternatives",
  what_id_do_differently: "what_differently",
  motivation: "general",
  personal_ai_usage: "general",
  technical_architecture: "technical_implementation",
  growth_strategy: "general",
  ai_product_strategy: "general",
  risk_tradeoffs: "tradeoffs",
  technical_explanation: "technical_implementation",
  build_vs_buy: "solution_alternatives",
  platform_expansion: "general",
  failure_handling: "challenges_lessons",
  security_risk: "tradeoffs",
  product_comparison: "solution_alternatives",
  incident_response: "challenges_lessons",
  experimentation: "measurement_impact",
};

export function canonicalModuleId(moduleId: string): string {
  const mapped = MODULE_ID_CANONICAL[moduleId] ?? moduleId;
  if (EXPERIENCE_MODULES[mapped]) return mapped;
  if (EXPERIENCE_MODULES[moduleId]) return moduleId;
  return mapped;
}

export function canonicalQuestionIntent(intent: string): QuestionIntent {
  const aliased = INTENT_ALIASES[intent];
  if (aliased) return aliased;
  return intent as QuestionIntent;
}

export function libraryCategoryFromSection(section: LibrarySection): LibraryCategory {
  switch (section) {
    case "career_motivation":
      return "career_recruiter";
    case "product_experience":
      return "resume_deep_dive";
    case "questrade_cases":
      return "banking_strategy";
    case "product_banking_knowledge":
      return "product_analytics";
    case "leadership_behavioural":
      return "leadership_behavioural";
    default:
      return "banking_strategy";
  }
}

export function wasModuleRemapped(originalId: string): boolean {
  return MODULE_ID_CANONICAL[originalId] !== undefined && MODULE_ID_CANONICAL[originalId] !== originalId;
}

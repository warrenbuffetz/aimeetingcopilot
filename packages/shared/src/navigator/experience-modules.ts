import type { InterviewProfileKey } from "./profile-content-eligibility";
import type { ExperienceModule, LibraryCategory } from "./types";

export const EXPERIENCE_MODULES: Record<string, ExperienceModule> = {
  "rbc-cashback": {
    id: "rbc-cashback",
    label: "RBC — Cashback Withdrawals",
    company: "RBC",
    libraryCategory: "resume_deep_dive",
  },
  "rbc-avion": {
    id: "rbc-avion",
    label: "RBC — Avion Select",
    company: "RBC",
    libraryCategory: "resume_deep_dive",
  },
  "rbc-core": {
    id: "rbc-core",
    label: "RBC — Core Platform",
    company: "RBC",
    libraryCategory: "resume_deep_dive",
  },
  "rbc-shopplus": {
    id: "rbc-shopplus",
    label: "RBC — ShopPlus",
    company: "RBC",
    libraryCategory: "resume_deep_dive",
  },
  "hbc-mastercard-app": {
    id: "hbc-mastercard-app",
    label: "HBC — Mastercard Acquisition",
    company: "HBC",
    libraryCategory: "resume_deep_dive",
  },
  "hbc-activation": {
    id: "hbc-activation",
    label: "HBC — Post-Approval Activation",
    company: "HBC",
    libraryCategory: "resume_deep_dive",
  },
  "hbc-portfolio": {
    id: "hbc-portfolio",
    label: "HBC — Cardholder Portfolio & P&L",
    company: "HBC",
    libraryCategory: "resume_deep_dive",
  },
  "hbc-quests": {
    id: "hbc-quests",
    label: "HBC — Quests",
    company: "HBC",
    libraryCategory: "resume_deep_dive",
  },
  "aeroplan-cobrand": {
    id: "aeroplan-cobrand",
    label: "Aeroplan — Co-brand Card Acquisition",
    company: "Aeroplan",
    libraryCategory: "resume_deep_dive",
  },
  "aeroplan-partnerships": {
    id: "aeroplan-partnerships",
    label: "Aeroplan — Commercial Partnerships",
    company: "Aeroplan",
    libraryCategory: "resume_deep_dive",
  },
  "arcteryx-membership": {
    id: "arcteryx-membership",
    label: "Arc'teryx — Membership Platform",
    company: "Arc'teryx",
    libraryCategory: "resume_deep_dive",
  },
  "arcteryx-vendor": {
    id: "arcteryx-vendor",
    label: "Arc'teryx — Vendor Evaluation",
    company: "Arc'teryx",
    libraryCategory: "resume_deep_dive",
  },
  "arcteryx-crm": {
    id: "arcteryx-crm",
    label: "Arc'teryx — CRM & Integrations",
    company: "Arc'teryx",
    libraryCategory: "resume_deep_dive",
  },
  "arcteryx-overview": {
    id: "arcteryx-overview",
    label: "Arc'teryx — Employer Overview",
    company: "Arc'teryx",
    libraryCategory: "resume_deep_dive",
  },
  "rbc-overview": {
    id: "rbc-overview",
    label: "RBC — Employer Overview",
    company: "RBC",
    libraryCategory: "resume_deep_dive",
  },
  "hbc-overview": {
    id: "hbc-overview",
    label: "HBC — Employer Overview",
    company: "HBC",
    libraryCategory: "resume_deep_dive",
  },
  "aeroplan-overview": {
    id: "aeroplan-overview",
    label: "Air Canada / Aeroplan — Employer Overview",
    company: "Aeroplan",
    libraryCategory: "resume_deep_dive",
  },
  "questrade-primary": {
    id: "questrade-primary",
    label: "Questbank — Primary Account",
    company: "Questrade",
    libraryCategory: "banking_strategy",
  },
  "questrade-deposits": {
    id: "questrade-deposits",
    label: "Questbank — Direct Deposit",
    company: "Questrade",
    libraryCategory: "banking_strategy",
  },
  "questrade-hub": {
    id: "questrade-hub",
    label: "Financial Hub / Balance Sheet",
    company: "Questrade",
    libraryCategory: "banking_strategy",
  },
  "questrade-metrics": {
    id: "questrade-metrics",
    label: "Product Metrics & Economics",
    company: "Questrade",
    libraryCategory: "product_analytics",
  },
  "questrade-payments": {
    id: "questrade-payments",
    label: "Payments & Controls",
    company: "Questrade",
    libraryCategory: "banking_technical",
  },
  "questrade-temenos": {
    id: "questrade-temenos",
    label: "Questbank — Temenos Core Integration",
    company: "Questrade",
    libraryCategory: "banking_technical",
  },
  "questrade-mcp": {
    id: "questrade-mcp",
    label: "Agentic Finance & MCP",
    company: "Questrade",
    libraryCategory: "banking_technical",
  },
  "digital-banking-engagement": {
    id: "digital-banking-engagement",
    label: "Digital Banking — Account Engagement",
    libraryCategory: "banking_strategy",
  },
  "digital-banking-deposits": {
    id: "digital-banking-deposits",
    label: "Digital Banking — Direct Deposit & Funding",
    libraryCategory: "banking_strategy",
  },
  "digital-banking-payments": {
    id: "digital-banking-payments",
    label: "Digital Banking — Payments & Controls",
    libraryCategory: "banking_technical",
  },
  "digital-banking-metrics": {
    id: "digital-banking-metrics",
    label: "Digital Banking — Metrics & Economics",
    libraryCategory: "product_analytics",
  },
  "digital-banking-ai": {
    id: "digital-banking-ai",
    label: "Digital Banking — AI & Automation",
    libraryCategory: "banking_technical",
  },
  "digital-banking-hub": {
    id: "digital-banking-hub",
    label: "Digital Banking — Aggregation & Financial View",
    libraryCategory: "banking_strategy",
  },
  "career-general": {
    id: "career-general",
    label: "Career & Motivation",
    libraryCategory: "career_recruiter",
  },
  "leadership-general": {
    id: "leadership-general",
    label: "Leadership & Judgment",
    libraryCategory: "leadership_behavioural",
  },
  "unclassified-review": {
    id: "unclassified-review",
    label: "Needs classification review",
    libraryCategory: "banking_strategy",
  },
};

/** @deprecated Use unclassified-review — kept for migrated rows */
export const LEGACY_GENERAL_BANKING = "general-banking";

export const LIBRARY_CATEGORY_LABELS: Record<LibraryCategory, string> = {
  career_recruiter: "Career & Motivation",
  resume_deep_dive: "My Product Experience",
  banking_strategy: "Questrade Product Cases",
  banking_technical: "Product & Banking Knowledge",
  product_analytics: "Product & Banking Knowledge",
  leadership_behavioural: "Leadership & Behavioural",
};

export function experienceModule(id: string): ExperienceModule {
  if (id === LEGACY_GENERAL_BANKING) {
    return EXPERIENCE_MODULES["unclassified-review"];
  }
  return (
    EXPERIENCE_MODULES[id] ?? {
      id: "unclassified-review",
      label: "Needs classification review",
      libraryCategory: "banking_strategy",
    }
  );
}

/** Companies with product experience modules (for Experiences tab). */
export const PRODUCT_EXPERIENCE_COMPANIES = ["RBC", "HBC", "Aeroplan", "Arc'teryx"] as const;

/** Questrade-branded case modules vs Simplii generic digital-banking modules. */
export function isExperienceModuleEligibleForProfile(
  moduleId: string,
  profile: InterviewProfileKey
): boolean {
  if (moduleId === "unclassified-review") return false;
  if (profile === "unknown") return true;
  if (moduleId.startsWith("questrade-")) return profile === "questrade";
  if (moduleId.startsWith("digital-banking-")) return profile === "simplii";
  return true;
}

export function experienceModulesForProfile(profile: InterviewProfileKey): ExperienceModule[] {
  return Object.values(EXPERIENCE_MODULES)
    .filter((m) => isExperienceModuleEligibleForProfile(m.id, profile))
    .sort((a, b) => a.label.localeCompare(b.label));
}

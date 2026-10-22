import type { ExperienceModule, LibraryCategory } from "./types";

export const EXPERIENCE_MODULES: Record<string, ExperienceModule> = {
  "rbc-cashback": {
    id: "rbc-cashback",
    label: "RBC — Cashback Withdrawals",
    company: "RBC",
    libraryCategory: "resume_deep_dive",
  },
  "arcteryx-membership": {
    id: "arcteryx-membership",
    label: "Arc'teryx — Membership Platform",
    company: "Arc'teryx",
    libraryCategory: "resume_deep_dive",
  },
  "hbc-mastercard-app": {
    id: "hbc-mastercard-app",
    label: "HBC — Mastercard Application",
    company: "HBC",
    libraryCategory: "resume_deep_dive",
  },
  "hbc-portfolio": {
    id: "hbc-portfolio",
    label: "HBC — Portfolio Growth & P&L",
    company: "HBC",
    libraryCategory: "resume_deep_dive",
  },
  "aeroplan-cobrand": {
    id: "aeroplan-cobrand",
    label: "Aeroplan — Co-brand Acquisition",
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
  "general-banking": {
    id: "general-banking",
    label: "Banking Strategy (General)",
    libraryCategory: "banking_strategy",
  },
};

export const LIBRARY_CATEGORY_LABELS: Record<LibraryCategory, string> = {
  career_recruiter: "Career and Recruiter Questions",
  resume_deep_dive: "Resume Experience Deep Dives",
  banking_strategy: "Banking Strategy and Product Cases",
  banking_technical: "Banking Technical Knowledge",
  product_analytics: "Product Analytics and Economics",
  leadership_behavioural: "Leadership and Behavioural Questions",
};

export function experienceModule(id: string): ExperienceModule {
  return EXPERIENCE_MODULES[id] ?? {
    id: "general",
    label: "General",
    libraryCategory: "banking_strategy",
  };
}

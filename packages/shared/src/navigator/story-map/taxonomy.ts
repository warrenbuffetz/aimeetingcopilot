import type { StoryMapRoot, StoryMapRootId, StoryMapTopic, StoryMapTopicId } from "./types";

const RBC_MODULES = ["rbc-cashback", "rbc-avion", "rbc-core", "rbc-shopplus", "rbc-overview"] as const;
const ARCTERYX_MODULES = ["arcteryx-membership", "arcteryx-vendor", "arcteryx-crm", "arcteryx-overview"] as const;
const HBC_MODULES = ["hbc-mastercard-app", "hbc-activation", "hbc-portfolio", "hbc-quests", "hbc-overview"] as const;
const AEROPLAN_MODULES = ["aeroplan-cobrand", "aeroplan-partnerships", "aeroplan-overview"] as const;

const BANKING_MODULE_IDS = [
  "questrade-primary",
  "questrade-deposits",
  "questrade-hub",
  "questrade-metrics",
  "questrade-payments",
  "questrade-temenos",
  "questrade-mcp",
  "digital-banking-engagement",
  "digital-banking-deposits",
  "digital-banking-payments",
  "digital-banking-metrics",
  "digital-banking-ai",
  "digital-banking-hub",
] as const;

export const STORY_MAP_TOPICS: StoryMapTopic[] = [
  { id: "career:tmay", rootId: "career", label: "Tell Me About Yourself", synthetic: true },
  { id: "career:why-employer", rootId: "career", label: "Why This Employer", synthetic: true },
  { id: "career:transitions", rootId: "career", label: "Career Transitions", synthetic: true },
  { id: "career:strengths", rootId: "career", label: "Strengths & Weaknesses", synthetic: true },
  { id: "career:logistics", rootId: "career", label: "Compensation & Logistics", synthetic: true },
  { id: "career:other", rootId: "career", label: "Other Career & Motivation", moduleIds: ["career-general"], synthetic: true },

  { id: "rbc:rbc-cashback", rootId: "rbc", label: "Cashback Withdrawals", moduleIds: ["rbc-cashback"] },
  { id: "rbc:rbc-avion", rootId: "rbc", label: "Avion Select", moduleIds: ["rbc-avion"] },
  { id: "rbc:rbc-core", rootId: "rbc", label: "Core Platform", moduleIds: ["rbc-core"] },
  { id: "rbc:rbc-shopplus", rootId: "rbc", label: "Shop+ Browser Extension", moduleIds: ["rbc-shopplus"] },
  { id: "rbc:rbc-overview", rootId: "rbc", label: "Leadership & Delivery", moduleIds: ["rbc-overview"] },

  { id: "arcteryx:membership", rootId: "arcteryx", label: "Membership Platform", moduleIds: ["arcteryx-membership"] },
  { id: "arcteryx:sperro", rootId: "arcteryx", label: "Sperro SV", synthetic: true },
  { id: "arcteryx:investment", rootId: "arcteryx", label: "$5.2M Investment Case", synthetic: true },
  { id: "arcteryx:vendor", rootId: "arcteryx", label: "Platform & Vendor Evaluation", moduleIds: ["arcteryx-vendor"] },
  { id: "arcteryx:crm", rootId: "arcteryx", label: "CRM & Integrations", moduleIds: ["arcteryx-crm"] },
  { id: "arcteryx:overview", rootId: "arcteryx", label: "Employer Overview", moduleIds: ["arcteryx-overview"] },

  { id: "hbc:hbc-mastercard-app", rootId: "hbc", label: "Mastercard Acquisition", moduleIds: ["hbc-mastercard-app"] },
  { id: "hbc:hbc-portfolio", rootId: "hbc", label: "Cardholder Portfolio & P&L", moduleIds: ["hbc-portfolio"] },
  { id: "hbc:hbc-activation", rootId: "hbc", label: "Activation & Retention", moduleIds: ["hbc-activation"] },
  { id: "hbc:hbc-quests", rootId: "hbc", label: "Quests & Incentives", moduleIds: ["hbc-quests"] },
  { id: "hbc:hbc-overview", rootId: "hbc", label: "Other HBC", moduleIds: ["hbc-overview"] },

  { id: "aeroplan:cobrand", rootId: "aeroplan", label: "Co-brand Card Acquisition", moduleIds: ["aeroplan-cobrand"] },
  { id: "aeroplan:partnerships", rootId: "aeroplan", label: "Partner Integrations", moduleIds: ["aeroplan-partnerships"] },
  { id: "aeroplan:overview", rootId: "aeroplan", label: "Conversion & Overview", moduleIds: ["aeroplan-overview"] },

  { id: "leadership:strategy", rootId: "leadership", label: "Product Strategy", synthetic: true },
  { id: "leadership:prioritization", rootId: "leadership", label: "Prioritization", synthetic: true },
  { id: "leadership:stakeholders", rootId: "leadership", label: "Stakeholder Management", synthetic: true },
  { id: "leadership:cross-functional", rootId: "leadership", label: "Cross-functional Leadership", synthetic: true },
  { id: "leadership:discovery", rootId: "leadership", label: "Discovery & Experimentation", synthetic: true },
  { id: "leadership:conflict", rootId: "leadership", label: "Conflict & Difficult Decisions", synthetic: true },
  { id: "leadership:failures", rootId: "leadership", label: "Failures & Lessons", synthetic: true },
  { id: "leadership:people", rootId: "leadership", label: "People Leadership", moduleIds: ["leadership-general"], synthetic: true },

  { id: "banking:everyday", rootId: "banking-cases", label: "Everyday Banking", moduleIds: ["digital-banking-engagement", "questrade-primary"] },
  { id: "banking:primary-adoption", rootId: "banking-cases", label: "Primary Account Adoption", moduleIds: ["digital-banking-engagement", "questrade-primary"] },
  { id: "banking:deposits", rootId: "banking-cases", label: "Payroll & Direct Deposits", moduleIds: ["digital-banking-deposits", "questrade-deposits"] },
  { id: "banking:money-movement", rootId: "banking-cases", label: "Money Movement", synthetic: true },
  { id: "banking:payments", rootId: "banking-cases", label: "Payments & Reconciliation", moduleIds: ["digital-banking-payments", "questrade-payments", "rbc-cashback"] },
  { id: "banking:risk", rootId: "banking-cases", label: "Risk, Fraud & Compliance", synthetic: true },
  { id: "banking:cx-growth", rootId: "banking-cases", label: "Customer Experience & Growth", moduleIds: ["digital-banking-metrics", "questrade-metrics"] },
  { id: "banking:hub-ai", rootId: "banking-cases", label: "Financial Hub & AI", moduleIds: ["digital-banking-hub", "digital-banking-ai", "questrade-hub", "questrade-mcp", "questrade-temenos"] },
];

export const STORY_MAP_ROOTS: { id: StoryMapRootId; label: string }[] = [
  { id: "career", label: "Career & Motivation" },
  { id: "rbc", label: "RBC" },
  { id: "arcteryx", label: "Arc'teryx" },
  { id: "hbc", label: "HBC" },
  { id: "aeroplan", label: "Aeroplan" },
  { id: "leadership", label: "Leadership & Product Craft" },
  { id: "banking-cases", label: "Banking & Product Cases" },
];

export const MODULE_TO_PRIMARY_TOPIC: Partial<Record<string, StoryMapTopicId>> = Object.fromEntries(
  STORY_MAP_TOPICS.flatMap((t) => (t.moduleIds ?? []).map((m) => [m, t.id] as const))
);

export { RBC_MODULES, ARCTERYX_MODULES, HBC_MODULES, AEROPLAN_MODULES, BANKING_MODULE_IDS };

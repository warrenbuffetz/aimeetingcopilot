import type { ExperienceModule, LibraryCategory, LibrarySection } from "./types";

export type { LibrarySection };

export const LIBRARY_SECTION_ORDER: LibrarySection[] = [
  "career_motivation",
  "product_experience",
  "questrade_cases",
  "product_banking_knowledge",
  "leadership_behavioural",
];

export const LIBRARY_SECTION_LABELS: Record<LibrarySection, string> = {
  career_motivation: "Career & Motivation",
  product_experience: "My Product Experience",
  questrade_cases: "Questrade Product Cases",
  product_banking_knowledge: "Product & Banking Knowledge",
  leadership_behavioural: "Leadership & Behavioural",
};

export function librarySectionForModule(module: ExperienceModule): LibrarySection {
  if (module.id === "career-general") return "career_motivation";
  if (module.id === "leadership-general") return "leadership_behavioural";
  if (module.id.startsWith("questrade-")) return "questrade_cases";
  if (module.id.startsWith("digital-banking-")) return "product_banking_knowledge";
  if (module.company && module.libraryCategory === "resume_deep_dive") return "product_experience";
  if (module.libraryCategory === "career_recruiter") return "career_motivation";
  if (module.libraryCategory === "leadership_behavioural") return "leadership_behavioural";
  if (module.libraryCategory === "banking_technical" || module.libraryCategory === "product_analytics") {
    return "product_banking_knowledge";
  }
  if (module.libraryCategory === "banking_strategy") return "questrade_cases";
  return "product_banking_knowledge";
}

/** Map legacy browse category → primary section (backwards compatible). */
export function librarySectionFromCategory(
  category: LibraryCategory,
  moduleId?: string
): LibrarySection {
  if (moduleId?.startsWith("questrade-")) return "questrade_cases";
  if (moduleId?.startsWith("digital-banking-")) return "product_banking_knowledge";
  if (moduleId === "career-general") return "career_motivation";
  if (moduleId === "leadership-general") return "leadership_behavioural";
  if (moduleId && /^(rbc|hbc|aeroplan|arcteryx)-/.test(moduleId)) return "product_experience";

  switch (category) {
    case "career_recruiter":
      return "career_motivation";
    case "resume_deep_dive":
      return "product_experience";
    case "leadership_behavioural":
      return "leadership_behavioural";
    case "banking_technical":
    case "product_analytics":
      return "product_banking_knowledge";
    case "banking_strategy":
      return "questrade_cases";
    default:
      return "product_banking_knowledge";
  }
}

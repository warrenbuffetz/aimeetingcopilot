import { describe, expect, it } from "vitest";
import {
  exclusiveProfileForPreparedRow,
  isJobSpecificPreparedRow,
  isPreparedRowEligibleForProfile,
  preparedAnswerForProfile,
} from "../profile-content-eligibility";
import type { EnrichedQaRow, NavigatorQaMeta } from "../types";

function row(
  partial: Omit<Partial<EnrichedQaRow>, "navigator"> &
    Pick<EnrichedQaRow, "id" | "question"> & { navigator?: Partial<NavigatorQaMeta> }
): EnrichedQaRow {
  const { id, question, navigator: navPatch, ...rest } = partial;
  return {
    answer: "Shared body about RBC cashback. I am excited about Questrade's mission.",
    category: "Experience",
    isPreferred: false,
    ...rest,
    id,
    question,
    navigator: {
      libraryCategory: "resume_deep_dive",
      librarySection: "product_experience",
      experienceModuleId: "rbc-cashback",
      experienceLabel: "RBC",
      intent: "main_story",
      evidenceStatus: "resume_supported",
      altPhrasings: [],
      topicTags: [],
      keywords: [],
      relatedQuestionIds: [],
      reviewStatus: "ok",
      revisionStatus: "current",
      ...navPatch,
    },
  };
}

describe("profile content eligibility", () => {
  it("keeps shared experience rows on both profiles even when answer mentions another employer", () => {
    const shared = row({ id: "1", question: "Tell me about RBC cashback." });
    expect(isJobSpecificPreparedRow(shared)).toBe(false);
    expect(isPreparedRowEligibleForProfile(shared, "simplii")).toBe(true);
    expect(isPreparedRowEligibleForProfile(shared, "questrade")).toBe(true);
  });

  it("treats why-company questions as job-specific", () => {
    const whyQt = row({
      id: "2",
      question: "Why Questrade? Why this role?",
      navigator: { libraryCategory: "career_recruiter", librarySection: "career_motivation" },
    });
    expect(isJobSpecificPreparedRow(whyQt)).toBe(true);
    expect(exclusiveProfileForPreparedRow(whyQt)).toBe("questrade");
    expect(isPreparedRowEligibleForProfile(whyQt, "simplii")).toBe(false);
  });

  it("applies employerClosing placeholder", () => {
    const r = row({
      id: "3",
      question: "Why this company?",
      answer: "Shared intro.\n\n{{EMPLOYER_CLOSE}}",
      navigator: {
        libraryCategory: "career_recruiter",
        librarySection: "career_motivation",
        employerClosing: { simplii: "That is why Simplii Financial is the right next step." },
      },
    });
    expect(preparedAnswerForProfile(r, "simplii")).toContain("Simplii Financial");
    expect(preparedAnswerForProfile(r, "simplii")).not.toContain("{{EMPLOYER_CLOSE}}");
  });
});

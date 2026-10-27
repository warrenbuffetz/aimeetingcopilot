import { describe, expect, it } from "vitest";
import { filterCatalogForBrowse, rowMatchesExperienceModule, rowMatchesInterviewRound } from "../browse-filters";
import type { EnrichedQaRow, NavigatorQaMeta } from "../types";

function row(
  partial: Omit<Partial<EnrichedQaRow>, "navigator"> &
    Pick<EnrichedQaRow, "id" | "question"> & { navigator?: Partial<NavigatorQaMeta> }
): EnrichedQaRow {
  const { id, question, navigator: navPatch, ...rest } = partial;
  return {
    answer: "A",
    category: "Test",
    isPreferred: false,
    ...rest,
    id,
    question,
    navigator: {
      libraryCategory: "resume_deep_dive",
      librarySection: "product_experience",
      experienceModuleId: "rbc-cashback",
      experienceLabel: "RBC",
      intent: "general",
      evidenceStatus: "resume_supported",
      altPhrasings: [],
      topicTags: [],
      keywords: [],
      relatedQuestionIds: [],
      reviewStatus: "ok",
      revisionStatus: "current",
      roundRelevance: {
        recruiter: "low",
        hiring_manager: "very_high",
        cross_functional_panel: "high",
      },
      ...navPatch,
    },
  };
}

describe("browse filters", () => {
  it("filters by interview round", () => {
    const catalog = [row({ id: "1", question: "Q1" })];
    expect(filterCatalogForBrowse(catalog, { interviewRound: "recruiter" })).toHaveLength(0);
    expect(filterCatalogForBrowse(catalog, { interviewRound: "hiring_manager" })).toHaveLength(1);
  });

  it("filters by experience module", () => {
    const catalog = [
      row({ id: "1", question: "Q1" }),
      row({
        id: "2",
        question: "Q2",
        navigator: { experienceModuleId: "leadership-general", librarySection: "people_leadership" },
      }),
    ];
    expect(filterCatalogForBrowse(catalog, { experienceModuleId: "leadership-general" })).toHaveLength(1);
    expect(rowMatchesExperienceModule(catalog[0], "rbc-overview")).toBe(true);
  });

  it("rowMatchesInterviewRound allows unset round", () => {
    expect(rowMatchesInterviewRound(row({ id: "1", question: "Q" }), null)).toBe(true);
  });
});

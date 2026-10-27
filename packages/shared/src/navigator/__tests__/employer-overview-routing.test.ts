import { describe, expect, it } from "vitest";
import {
  employerOverviewModuleFromSpoken,
  explicitExperienceModuleFromSpoken,
  enrichLibrary,
  emptyInterviewContext,
  lexicalRowsFromEnriched,
  rankPreparedQaWithContext,
} from "../index";

describe("employer overview module routing", () => {
  it("maps broad Arc'teryx employer questions to arcteryx-overview", () => {
    expect(
      employerOverviewModuleFromSpoken("Tell me more about your time at Arc'teryx.")
    ).toBe("arcteryx-overview");
    expect(explicitExperienceModuleFromSpoken("What did you work on at Arc'teryx?")).toBe(
      "arcteryx-overview"
    );
  });

  it("maps broad RBC / HBC / Aeroplan employer questions", () => {
    expect(employerOverviewModuleFromSpoken("Tell me more about your time at RBC.")).toBe("rbc-overview");
    expect(employerOverviewModuleFromSpoken("Walk me through your experience at HBC.")).toBe("hbc-overview");
    expect(employerOverviewModuleFromSpoken("Give me an overview of your Aeroplan work.")).toBe(
      "aeroplan-overview"
    );
  });

  it("keeps specific ShopPlus questions on rbc-shopplus", () => {
    expect(explicitExperienceModuleFromSpoken("How did ShopPlus work at RBC?")).toBe("rbc-shopplus");
  });

  it("boosts employer overview rows when module context is explicit", () => {
    const enriched = enrichLibrary([
      {
        id: "overview",
        question: "Tell me more about your time at Arc'teryx.",
        answer: "Overview answer",
        navigatorMeta: {
          experienceModuleId: "arcteryx-overview",
          intent: "main_story",
          topicTags: ["scope:employer_overview"],
          librarySection: "product_experience",
          libraryCategory: "resume_deep_dive",
          altPhrasings: [],
          keywords: [],
          relatedQuestionIds: [],
        },
      },
      {
        id: "crm",
        question: "Tell me about CRM at Arc'teryx.",
        answer: "CRM answer",
        navigatorMeta: {
          experienceModuleId: "arcteryx-crm",
          intent: "main_story",
          librarySection: "product_experience",
          libraryCategory: "resume_deep_dive",
          altPhrasings: [],
          keywords: [],
          relatedQuestionIds: [],
        },
      },
    ]);
    const library = lexicalRowsFromEnriched(enriched);
    const ranked = rankPreparedQaWithContext(
      "Tell me more about your time at Arc'teryx.",
      library,
      enriched,
      emptyInterviewContext()
    );
    expect(ranked[0]?.rowId).toBe("overview");
  });
});

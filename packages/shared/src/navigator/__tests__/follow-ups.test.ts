import { describe, expect, it } from "vitest";
import { suggestFollowUps } from "../follow-ups";
import { emptyInterviewContext } from "../types";
import type { EnrichedQaRow } from "../types";

const stubRow = (id: string, moduleId: string): EnrichedQaRow => ({
  id,
  question: "Q?",
  answer: "A",
  navigator: {
    libraryCategory: "resume_deep_dive",
    experienceModuleId: moduleId,
    experienceLabel: moduleId,
    intent: "main_story",
    evidenceStatus: "resume_supported",
    altPhrasings: [],
    keywords: [],
  },
});

describe("suggestFollowUps", () => {
  it("returns empty when no active experience", () => {
    const catalog = [stubRow("1", "rbc-cashback")];
    expect(suggestFollowUps(catalog, emptyInterviewContext())).toEqual([]);
  });

  it("suggests within active module after context is set", () => {
    const ctx = {
      ...emptyInterviewContext(),
      activeExperienceModuleId: "rbc-cashback",
      activeIntent: "main_story",
    };
    const catalog = [
      stubRow("1", "rbc-cashback"),
      stubRow("2", "hbc-mastercard-app"),
    ];
    const out = suggestFollowUps(catalog, ctx);
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((s) => s.experienceModuleId === "rbc-cashback")).toBe(true);
  });
});

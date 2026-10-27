import { describe, expect, it } from "vitest";
import { buildProductExperienceTree, dedupeExperienceRowsForBrowse } from "../experience-tree";
import type { EnrichedQaRow } from "../types";

function row(partial: Partial<EnrichedQaRow> & Pick<EnrichedQaRow, "id" | "question">): EnrichedQaRow {
  const { id, question, navigator: navPatch, ...rest } = partial;
  return {
    answer: "Answer.",
    category: "Experience deep dive",
    isPreferred: false,
    ...rest,
    id,
    question,
    navigator: {
      libraryCategory: "resume_deep_dive",
      librarySection: "product_experience",
      experienceModuleId: "rbc-avion",
      experienceLabel: "RBC — Avion Select",
      intent: "personal_ownership",
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

describe("experience browse tree", () => {
  it("dedupes identical questions within a module", () => {
    const q = "What did you personally own in Avion Select's onboarding and identity experience?";
    const kept = row({
      id: "a",
      question: q,
      isPreferred: true,
      navigator: { importKey: "core-rbc-avion" },
    });
    const dup = row({
      id: "b",
      question: q,
      navigator: {
        importKey: "questrade-john-experience-depth-v1-rbc-avion-identity",
        retrievalExcluded: true,
      },
    });
    const out = dedupeExperienceRowsForBrowse([kept, dup]);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe("a");
  });

  it("excludes retrieval-excluded rows from the experience tree", () => {
    const tree = buildProductExperienceTree([
      row({ id: "live", question: "Live question?", navigator: { retrievalExcluded: false } }),
      row({
        id: "draft",
        question: "Draft duplicate?",
        navigator: { retrievalExcluded: true, intent: "general" },
      }),
    ]);
    const rbc = tree.find((g) => g.company === "RBC");
    const allIds = rbc?.modules.flatMap((m) => m.intents.flatMap((i) => i.rows.map((r) => r.id))) ?? [];
    expect(allIds).toContain("live");
    expect(allIds).not.toContain("draft");
  });
});

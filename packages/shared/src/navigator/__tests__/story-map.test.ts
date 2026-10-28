import { describe, expect, it } from "vitest";
import {
  buildStoryMapIndex,
  storyMapRowIdsEqual,
  storyMapSearch,
  storyMapTopQuestions,
  storyMapUnclassifiedRows,
} from "../story-map/build-index";
import type { EnrichedQaRow, NavigatorQaMeta } from "../types";

function row(
  partial: Omit<Partial<EnrichedQaRow>, "navigator"> &
    Pick<EnrichedQaRow, "id" | "question"> & { navigator?: Partial<NavigatorQaMeta> }
): EnrichedQaRow {
  const { id, question, navigator: navPatch, ...rest } = partial;
  return {
    answer: "Answer body.",
    category: "Test",
    isPreferred: false,
    ...rest,
    id,
    question,
    navigator: {
      libraryCategory: "resume_deep_dive",
      librarySection: "product_experience",
      experienceModuleId: "rbc-cashback",
      experienceLabel: "RBC — Cashback",
      intent: "main_story",
      evidenceStatus: "resume_supported",
      altPhrasings: [],
      topicTags: [],
      keywords: [],
      relatedQuestionIds: [],
      reviewStatus: "ok",
      revisionStatus: "current",
      roundRelevance: { recruiter: "high", hiring_manager: "very_high" },
      ...navPatch,
    },
  };
}

describe("story map index", () => {
  const interac = row({
    id: "interac-1",
    question: "Walk me through the Interac e-Transfer product you launched at RBC.",
    isPreferred: true,
  });

  const whySimplii = row({
    id: "why-simplii",
    question: "Why Simplii Financial, and why this Senior Product Manager role?",
    navigator: {
      libraryCategory: "career_recruiter",
      librarySection: "career_motivation",
      experienceModuleId: "career-general",
      experienceLabel: "Career",
      intent: "general",
    },
  });

  const whyQuestrade = row({
    id: "why-qt",
    question: "Why Questrade? Why this role?",
    navigator: {
      libraryCategory: "career_recruiter",
      librarySection: "career_motivation",
      experienceModuleId: "career-general",
      experienceLabel: "Career",
      intent: "general",
    },
  });

  const catalog = [interac, whySimplii, whyQuestrade];

  it("indexes RBC cashback under module and banking money movement", () => {
    const index = buildStoryMapIndex(catalog, { profile: "simplii" });
    const moduleRows = index.rowsByTopic.get("rbc:rbc-cashback") ?? [];
    const crossRows = index.rowsByTopic.get("banking:money-movement") ?? [];
    expect(moduleRows.some((r) => r.id === "interac-1")).toBe(true);
    expect(crossRows.some((r) => r.id === "interac-1")).toBe(true);
    expect(storyMapRowIdsEqual(moduleRows[0], crossRows.find((r) => r.id === "interac-1")!)).toBe(true);
  });

  it("filters profile-exclusive job questions", () => {
    const simplii = buildStoryMapIndex(catalog, { profile: "simplii" });
    const allSimplii = [...simplii.rowsByTopic.values()].flat();
    expect(allSimplii.some((r) => r.id === "why-simplii")).toBe(true);
    expect(allSimplii.some((r) => r.id === "why-qt")).toBe(false);

    const qt = buildStoryMapIndex(catalog, { profile: "questrade" });
    const allQt = [...qt.rowsByTopic.values()].flat();
    expect(allQt.some((r) => r.id === "why-qt")).toBe(true);
    expect(allQt.some((r) => r.id === "why-simplii")).toBe(false);
  });

  it("search dedupes by row id", () => {
    const index = buildStoryMapIndex(catalog, { profile: "simplii" });
    const hits = storyMapSearch(index, "Interac e-Transfer", 10, {});
    expect(hits).toHaveLength(1);
    expect(hits[0].id).toBe("interac-1");
  });

  it("returns top questions at topic without extra navigation", () => {
    const index = buildStoryMapIndex(catalog, { profile: "simplii" });
    const top = storyMapTopQuestions(index, "rbc:rbc-cashback", 5, {});
    expect(top.length).toBeGreaterThan(0);
    expect(top[0].id).toBe("interac-1");
  });

  it("reports unclassified eligible rows", () => {
    const orphan = row({
      id: "orphan",
      question: "Obscure unmapped question xyz123?",
      navigator: { experienceModuleId: "unclassified-review", librarySection: "product_banking_knowledge" },
    });
    const index = buildStoryMapIndex([...catalog, orphan], { profile: "unknown" });
    const unclassified = storyMapUnclassifiedRows(index);
    expect(unclassified.some((r) => r.id === "orphan")).toBe(true);
  });
});

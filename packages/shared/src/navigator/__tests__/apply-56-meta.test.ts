import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { enrichLibrary } from "../context";
import { EXPERIENCE_MODULES } from "../experience-modules";
import { canonicalModuleId, canonicalQuestionIntent } from "../module-id-map";
import type { PersistedNavigatorMeta } from "../navigator-meta-persist";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../..");

type Assignment = {
  question: string;
  librarySection: string;
  experienceModuleId: string;
  questionIntent: string;
  evidenceStatus: string;
  reviewStatus: string;
};

const assignments = JSON.parse(
  readFileSync(resolve(root, "data/seed/questrade-56-library-assignments.json"), "utf8")
) as Assignment[];
const resolved39 = new Set(
  (
    JSON.parse(
      readFileSync(resolve(root, "data/migration/questrade-39-review-resolutions.json"), "utf8")
    ) as { question: string }[]
  ).map((r) => r.question.trim())
);
const metaByQuestion = JSON.parse(
  readFileSync(resolve(root, "data/migration/navigator-meta-by-question.json"), "utf8")
) as Record<string, PersistedNavigatorMeta>;
const seed = JSON.parse(
  readFileSync(resolve(root, "data/seed/questrade-interview-full.json"), "utf8")
) as {
  preparedQa: { id: string; question: string; answer: string; category?: string }[];
};

describe("questrade 56 library classifications", () => {
  it("has persisted metadata for all 56 assignment questions", () => {
    expect(assignments).toHaveLength(56);
    for (const row of assignments) {
      const q = row.question.trim();
      const meta = metaByQuestion[q];
      expect(meta, `missing meta for: ${q}`).toBeDefined();
      expect(meta.librarySection).toBe(row.librarySection);
      expect(meta.experienceModuleId).toBe(canonicalModuleId(row.experienceModuleId));
      expect(meta.intent).toBe(canonicalQuestionIntent(row.questionIntent));
      if (!resolved39.has(q)) {
        expect(meta.evidenceStatus).toBe(row.evidenceStatus);
        expect(meta.reviewStatus).toBe(row.reviewStatus);
      }
      expect(EXPERIENCE_MODULES[meta.experienceModuleId!]).toBeDefined();
    }
  });

  it("keeps HBC modules separate (no collapse into one id)", () => {
    const hbcModules = new Set(
      assignments
        .map((a) => canonicalModuleId(a.experienceModuleId))
        .filter((id) => id.startsWith("hbc-"))
    );
    expect(hbcModules).toEqual(
      new Set(["hbc-mastercard-app", "hbc-activation", "hbc-portfolio", "hbc-quests"])
    );
  });

  it("enriches all 56 rows from full seed with answers intact", () => {
    const assignmentQuestions = new Set(assignments.map((a) => a.question.trim()));
    const rows = seed.preparedQa
      .filter((q) => assignmentQuestions.has(q.question.trim()))
      .map((q) => ({
        ...q,
        navigatorMeta: metaByQuestion[q.question.trim()] ?? null,
      }));
    expect(rows).toHaveLength(56);
    const enriched = enrichLibrary(rows);
    expect(enriched).toHaveLength(56);
    for (const row of enriched) {
      expect(row.answer.length).toBeGreaterThan(0);
      expect(row.navigator.experienceModuleId).toBeTruthy();
    }
  });
});

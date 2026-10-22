import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { canonicalModuleId, canonicalQuestionIntent } from "../module-id-map";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../..");

type Resolution = {
  number: number;
  question: string;
  experienceModuleId: string;
  questionIntent: string;
  evidenceStatus: string;
  reviewStatus: string;
  answer: string;
  editType?: string;
};

const resolutions = JSON.parse(
  readFileSync(resolve(root, "data/migration/questrade-39-review-resolutions.json"), "utf8")
) as Resolution[];
const metaByQuestion = JSON.parse(
  readFileSync(resolve(root, "data/migration/navigator-meta-by-question.json"), "utf8")
) as Record<string, Record<string, unknown>>;
const seed = JSON.parse(
  readFileSync(resolve(root, "data/seed/questrade-interview-full.json"), "utf8")
) as { preparedQa: { question: string; answer: string }[] };

describe("questrade 39 review resolutions", () => {
  it("applied ok + evidence for all 39", () => {
    expect(resolutions).toHaveLength(39);
    for (const row of resolutions) {
      const q = row.question.trim();
      const meta = metaByQuestion[q];
      expect(meta?.reviewStatus).toBe("ok");
      expect(meta?.evidenceStatus).toBe(row.evidenceStatus);
      expect(meta?.experienceModuleId).toBe(canonicalModuleId(row.experienceModuleId));
      expect(meta?.intent).toBe(canonicalQuestionIntent(row.questionIntent));
      expect(meta?.evidenceStatus).not.toBe("verified_accomplishment");
    }
  });

  it("wrote patch answers into seed where supplied", () => {
    const qaByQ = new Map(seed.preparedQa.map((r) => [r.question.trim(), r.answer]));
    for (const row of resolutions) {
      expect(qaByQ.get(row.question.trim())?.trim()).toBe(row.answer.trim());
    }
  });

  it("applied all five full_answer_replacement entries", () => {
    const full = resolutions.filter((r) => r.editType === "full_answer_replacement");
    expect(full.map((r) => r.number).sort()).toEqual([13, 15, 17, 27, 28]);
    const q15 = seed.preparedQa.find(
      (r) => r.question === "How do you know the headless option saved two quarters?"
    );
    expect(q15?.answer).not.toMatch(/^##/);
    expect(q15?.answer).not.toContain("## ");
  });
});

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { enrichLibrary, isRetrievalExcluded, searchLibrary } from "../index";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../..");

const IMPORT_KEYS = Array.from({ length: 22 }, (_, i) =>
  `questrade-expansion-ai-2026-q${String(i + 1).padStart(2, "0")}`
);

describe("expansion 22 import", () => {
  const seed = JSON.parse(
    readFileSync(resolve(root, "data/seed/questrade-interview-full.json"), "utf8")
  ) as { preparedQa: { question: string; answer: string; followUps?: { question: string; answer: string }[] }[] };
  const meta = JSON.parse(
    readFileSync(resolve(root, "data/migration/navigator-meta-by-question.json"), "utf8")
  ) as Record<string, { importKey?: string; proposedAnswerUpdate?: string }>;
  const registry = JSON.parse(
    readFileSync(resolve(root, "data/migration/import-registry-expansion-22.json"), "utf8")
  ) as Record<string, unknown>;
  const source = JSON.parse(
    readFileSync(resolve(root, "data/seed/questrade-expansion-ai-22-qa-import.json"), "utf8")
  ) as { entries: { importKey: string; preparedAnswer: string; question: string }[] };

  it("processed all 22 import keys in registry", () => {
    for (const key of IMPORT_KEYS) {
      expect(registry[key], key).toBeDefined();
    }
    expect(Object.keys(registry).length).toBeGreaterThanOrEqual(22);
  });

  it("preserves full answer text for created entries", () => {
    const mergedImportKeys = new Set([
      "questrade-expansion-ai-2026-q03",
      "questrade-expansion-ai-2026-q04",
    ]);
    for (const entry of source.entries) {
      if (["q09", "q10", "q22"].some((n) => entry.importKey.endsWith(n))) continue;
      const reg = registry[entry.importKey] as { question: string };
      const row = seed.preparedQa.find((q) => q.question === reg.question || q.question === entry.question);
      if (!row) continue;
      const actual = row.answer.trim();
      if (mergedImportKeys.has(entry.importKey)) {
        expect(meta[reg.question]?.proposedAnswerUpdate).toBeUndefined();
        if (entry.importKey.endsWith("q04")) {
          expect(actual).toContain("guided direct deposit setup");
          expect(actual).toContain("deeper relationship, not just cross-sell");
        } else {
          expect(actual).toContain("integration layer");
          expect(actual).toContain("pending, posted, available");
        }
        continue;
      }
      const expected = entry.preparedAnswer.trim();
      const proposed = meta[reg.question]?.proposedAnswerUpdate?.trim();
      expect(actual === expected || proposed === expected).toBe(true);
    }
  });

  it("attaches AI follow-ups without duplicate main rows", () => {
    const main = seed.preparedQa.find(
      (q) => q.question === "How are you using AI in your product management work?"
    );
    expect(main?.followUps?.length).toBeGreaterThanOrEqual(3);
    const agents = main?.followUps?.some((f) => /agents rather than just chatbots/i.test(f.question));
    expect(agents).toBe(true);
    const dupMain = seed.preparedQa.filter((q) =>
      /How are you using AI agents rather than just chatbots/i.test(q.question)
    );
    expect(dupMain.length).toBe(0);
  });

  it("supersedes overlapping audit Questbank expansion stub", () => {
    const row = enrichLibrary([
      {
        id: "x",
        question:
          "Why is Questbank expanding into everyday banking now, and what changes for product?",
        answer: "x",
        navigatorMeta: meta[
          "Why is Questbank expanding into everyday banking now, and what changes for product?"
        ],
      },
    ])[0];
    expect(isRetrievalExcluded(row.navigator)).toBe(true);
  });

  it("finds MCP content via search without duplicate What is MCP row requirement", () => {
    const rows = seed.preparedQa.map((q, i) => ({
      id: `id-${i}`,
      question: q.question,
      answer: q.answer,
      navigatorMeta: meta[q.question.trim()] ?? {},
    }));
    const catalog = enrichLibrary(rows).filter((r) => !isRetrievalExcluded(r.navigator));
    const hits = searchLibrary(catalog, "What is MCP", 5);
    expect(hits.some((h) => /MCP/i.test(h.question))).toBe(true);
  });
});

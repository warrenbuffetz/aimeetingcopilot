import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  enrichLibrary,
  emptyInterviewContext,
  lexicalRowsFromEnriched,
  rankPreparedQaHybrid,
} from "../index";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../..");

function loadCatalog() {
  const seed = JSON.parse(
    readFileSync(resolve(root, "data/seed/questrade-interview-full.json"), "utf8")
  ) as { preparedQa: { id?: string; question: string; answer: string }[] };
  const meta = JSON.parse(
    readFileSync(resolve(root, "data/migration/navigator-meta-by-question.json"), "utf8")
  ) as Record<string, unknown>;
  const rows = seed.preparedQa.map((q, i) => ({
    id: q.id ?? `seed-${i}`,
    question: q.question,
    answer: q.answer,
    navigatorMeta: (meta[q.question.trim()] ?? {}) as Record<string, unknown>,
  }));
  const enriched = enrichLibrary(rows);
  const library = lexicalRowsFromEnriched(enriched);
  return { enriched, library };
}

function topMatch(
  spoken: string,
  ctx = emptyInterviewContext()
) {
  const { enriched, library } = loadCatalog();
  const ranked = rankPreparedQaHybrid(spoken, library, enriched, ctx, null, null);
  const top = ranked[0];
  const row = enriched.find((r) => r.id === top?.rowId);
  return { row, ranked: ranked.slice(0, 3), score: top?.score ?? 0 };
}

function expectModule(row: { navigator: { experienceModuleId: string } } | null | undefined, mod: string | RegExp) {
  if (!row) throw new Error("no row");
  if (typeof mod === "string") expect(row.navigator.experienceModuleId).toBe(mod);
  else expect(row.navigator.experienceModuleId).toMatch(mod);
}

describe("expansion retrieval validation (post-review)", () => {
  it("membership handover → Q5", () => {
    const { row } = topMatch("What happens to the membership program if you leave?");
    expect(row?.question).toBe(
      "How would you manage transitioning away from an ongoing membership initiative?"
    );
  });

  it("membership roadmap → revised Arc current-status Q&A", () => {
    const { row } = topMatch("What delivered for Sperro SV, and what's still on the roadmap?");
    expect(row?.question).toMatch(/live from Arc'teryx's membership and Sperro SV work/i);
    expect(row?.navigator.experienceModuleId).toMatch(/arcteryx/);
  });

  it("RBC duplicate payments", () => {
    const { row } = topMatch("How did you stop customers getting paid twice?");
    expect(row?.question.toLowerCase()).toMatch(/cashback payout twice|duplicate/);
    expectModule(row, "rbc-cashback");
  });

  it("RBC pending payout visibility", () => {
    const { row } = topMatch("What could customers see while their transfer was pending?");
    expect(row?.question.toLowerCase()).toMatch(/pending|cashback payout/);
    expectModule(row, "rbc-cashback");
  });

  it("HBC attribution / traffic mix", () => {
    const { row } = topMatch(
      "How do you know your fifteen percent conversion increase wasn't just different traffic?"
    );
    expect(row?.question.toLowerCase()).toMatch(/hbc|applicant mix|application improvement/);
    expectModule(row, /hbc/);
  });

  it("Questbank — invest but not move paycheque", () => {
    const { row } = topMatch("What if brokerage customers won't move their paycheque to Questrade?");
    expect(row?.navigator.experienceModuleId).toMatch(/questrade/);
    expect(row?.answer.toLowerCase()).toMatch(/paycheque|payroll|primary/);
  });

  it("payroll / salary incident — major payment incident family", () => {
    const { row } = topMatch("What's your immediate response when customer salaries are delayed?");
    expect(row?.question.toLowerCase()).toMatch(/payment incident|payroll|deposit|salary|payday|15 minutes/);
  });

  it("AI / copilot semantic matching", () => {
    const { row } = topMatch("Explain how your interview copilot matches questions without the jargon.");
    expect(row?.question.toLowerCase()).toMatch(/semantic|interview copilot/);
  });

  it("negative control — unrelated topic stays low confidence or off-topic", () => {
    const { row, score } = topMatch("What is your favourite pizza topping?");
    expect(score).toBeLessThan(0.55);
    expect(row?.navigator.experienceModuleId).not.toBe("rbc-cashback");
  });
});

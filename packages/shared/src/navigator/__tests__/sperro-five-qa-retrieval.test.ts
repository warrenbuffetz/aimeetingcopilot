import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  applyContextResolution,
  enrichLibrary,
  emptyInterviewContext,
  rankPreparedQaHybrid,
  resolveInterviewContext,
} from "../index";
import type { LexicalQaRow } from "../../lexical-match";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../..");

const Q1 = "What are you currently working on at Arc'teryx?";
const Q2 = "How did you decide what to include in the smaller Sperro SV release?";
const Q3 = "Tell me about a product decision you got wrong.";
const Q4 =
  "You've secured a significant investment and are still building the product. Why would you leave before seeing it launch?";
const Q5 = "How would you manage transitioning away from an ongoing membership initiative?";

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
  const library: LexicalQaRow[] = enriched.map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
  }));
  return { enriched, library };
}

function topQuestion(spoken: string, ctx = emptyInterviewContext()) {
  const { enriched, library } = loadCatalog();
  const ranked = rankPreparedQaHybrid(spoken, library, enriched, ctx, null, null);
  const row = enriched.find((r) => r.id === ranked[0]?.rowId);
  return { row, ranked: ranked.slice(0, 3), ctx, enriched, library };
}

function advance(ctx: ReturnType<typeof emptyInterviewContext>, spoken: string, rowId: string) {
  const { enriched } = loadCatalog();
  const resolution = resolveInterviewContext(spoken, enriched, ctx);
  return applyContextResolution(ctx, resolution, spoken, rowId);
}

describe("Sperro five Q&A retrieval (Tests A–F)", () => {
  it("Test A — broad Arc'teryx current-work prompt → Q1", () => {
    const { row } = topQuestion("Can you tell me a little more about what you're working on at Arc'teryx?");
    expect(row?.question).toBe(Q1);
    expect(row?.answer).toMatch(/Sperro SV/i);
  });

  it("Test B — scope follow-up → Q2", () => {
    let { row, ctx } = topQuestion("Can you tell me more about your time at Arc'teryx?");
    ctx = advance(ctx, row!.question, row!.id);
    const next = topQuestion("Why didn't you just launch the whole membership platform?", ctx);
    expect(next.row?.question).toBe(Q2);
  });

  it("Test C — career follow-up → Q4", () => {
    let { row, ctx } = topQuestion(Q1);
    ctx = advance(ctx, row!.question, row!.id);
    const next = topQuestion("So why would you leave before seeing that launch?", ctx);
    expect(next.row?.question).toBe(Q4);
  });

  it("Test D — transition follow-up → Q5", () => {
    let { row, ctx } = topQuestion(Q4);
    ctx = advance(ctx, row!.question, row!.id);
    const next = topQuestion("How would you make sure the team could continue without you?", ctx);
    expect(next.row?.question).toBe(Q5);
  });

  it("Test E — HBC mistake at HBC → Q3", () => {
    const { row } = topQuestion("Tell me about a product decision you got wrong at HBC.");
    expect(row?.question).toBe(Q3);
    expect(row?.navigator.experienceModuleId).toBe("hbc-quests");
  });

  it("Test F — return to Arc'teryx ownership after HBC", () => {
    let { row, ctx } = topQuestion("Tell me about a product decision you got wrong at HBC.");
    ctx = advance(ctx, row!.question, row!.id);
    expect(ctx.activeExperienceModuleId).toBe("hbc-quests");
    const arc = topQuestion("Going back to Sperro SV, what did you personally own?", ctx);
    expect(arc.row?.navigator.experienceModuleId).toMatch(/arcteryx/);
    expect(
      arc.row?.question === "What did you personally decide or deprioritize?" ||
        arc.row?.answer.toLowerCase().includes("sperro") ||
        arc.row?.question === Q1
    ).toBe(true);
  });
});

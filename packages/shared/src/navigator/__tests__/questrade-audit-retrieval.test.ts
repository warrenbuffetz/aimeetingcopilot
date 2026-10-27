import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  applyContextResolution,
  emptyInterviewContext,
  enrichLibrary,
  rankPreparedQaHybrid,
  resolveInterviewContext,
} from "../index";
import type { LexicalQaRow } from "../../lexical-match";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../..");

function loadExportCatalog() {
  const exportJson = JSON.parse(
    readFileSync(resolve(root, "exports/questrade_interview_library.json"), "utf8")
  ) as {
    records: {
      id: string;
      question: string;
      answer: string;
      status: string;
      navigatorMeta?: Record<string, unknown>;
    }[];
  };
  const rows = exportJson.records
    .filter((q) => q.status === "active")
    .filter((q) => !(q.navigatorMeta as { retrievalExcluded?: boolean })?.retrievalExcluded)
    .map((q) => ({
      id: q.id,
      question: q.question,
      answer: q.answer,
      navigatorMeta: q.navigatorMeta ?? {},
    }));
  const enriched = enrichLibrary(rows);
  const library: LexicalQaRow[] = enriched.map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
    followUps: (r.navigator.altPhrasings ?? []).map((alt) => ({ question: alt, answer: r.answer })),
  }));
  return { enriched, library };
}

function rankTop(
  spoken: string,
  enriched: ReturnType<typeof enrichLibrary>,
  library: LexicalQaRow[],
  ctx: ReturnType<typeof emptyInterviewContext>
) {
  const ranked = rankPreparedQaHybrid(spoken, library, enriched, ctx, null, null);
  const top = ranked[0];
  const row = enriched.find((r) => r.id === top?.rowId);
  return { row, score: top?.score ?? 0 };
}

describe("Questrade audit retrieval (stateful)", () => {
  const { enriched, library } = loadExportCatalog();

  it("payroll context: MVP follow-up prefers questrade-primary over membership", () => {
    const payroll = enriched.find((r) => /increase direct deposit adoption/i.test(r.question));
    expect(payroll).toBeTruthy();
    let ctx = emptyInterviewContext();
    const intro = rankTop(payroll!.question, enriched, library, ctx);
    const resolution = resolveInterviewContext(payroll!.question, enriched, ctx);
    ctx = applyContextResolution(ctx, resolution, payroll!.question, intro.row!.id);

    const mvp = rankTop("What would you put in the MVP for this?", enriched, library, ctx);
    expect(mvp.row?.navigator.experienceModuleId).toMatch(/questrade-(deposits|primary)/);
    expect(mvp.row?.question).toMatch(/direct deposit|payroll|primary|mvp/i);
  });

  it("Arc'teryx context: MVP follow-up stays on membership module", () => {
    const arc = enriched.find(
      (r) =>
        r.navigator.experienceModuleId === "arcteryx-membership" &&
        /membership|integration/i.test(r.question)
    );
    expect(arc).toBeTruthy();
    let ctx = emptyInterviewContext();
    const resolution = resolveInterviewContext(arc!.question, enriched, ctx);
    ctx = applyContextResolution(ctx, resolution, arc!.question, arc!.id);

    const mvp = rankTop("What goes in the MVP?", enriched, library, ctx);
    expect(mvp.row?.navigator.experienceModuleId).toMatch(/arcteryx/);
  });

  it("Arc'teryx: shipped vs planned prefers live/delivered story", () => {
    const arc = enriched.find((r) => /membership platform|complex integration/i.test(r.question));
    expect(arc).toBeTruthy();
    let ctx = emptyInterviewContext();
    ctx = {
      ...ctx,
      activeExperienceModuleId: "arcteryx-membership",
      activeQuestionId: arc!.id,
      lastDetectedQuestion: arc!.question,
    };
    const shipped = rankTop("What actually shipped versus what's still planned?", enriched, library, ctx);
    expect(shipped.row?.question).toMatch(/live from|shipped|planned|delivered/i);
  });

  it("MCP context: trade timeout prefers execution-uncertainty probe", () => {
    const mcp = enriched.find((r) =>
      /design MCP or agentic finance connections/i.test(r.question)
    );
    const trade = enriched.find((r) => /approved trade request times out/i.test(r.question));
    if (!mcp || !trade) return;
    const ctx = {
      ...emptyInterviewContext(),
      activeExperienceModuleId: "questrade-mcp",
      activeQuestionId: mcp.id,
      lastDetectedQuestion: mcp.question,
    };
    const follow = rankTop(
      "If an approved trade request times out, how would you prevent a duplicate order?",
      enriched,
      library,
      ctx
    );
    expect(follow.row?.id).toBe(trade.id);
  });

  it("those 14 people boosts RBC module over career intro", () => {
    const rbc = enriched.find((r) => r.navigator.experienceModuleId?.startsWith("rbc"));
    expect(rbc).toBeTruthy();
    let ctx = emptyInterviewContext();
    ctx = {
      ...ctx,
      activeExperienceModuleId: "rbc-overview",
      activeQuestionId: rbc!.id,
      lastDetectedQuestion: "Tell me about your time at RBC.",
    };
    const follow = rankTop("How many of those 14 people reported directly to you?", enriched, library, ctx);
    expect(follow.row?.navigator.experienceModuleId).toMatch(/^rbc-/);
    expect(follow.row?.question).not.toMatch(/^tell me about yourself/i);
  });
});

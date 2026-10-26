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

function loadCatalog() {
  const seed = JSON.parse(
    readFileSync(resolve(root, "data/seed/questrade-interview-full.json"), "utf8")
  ) as {
    preparedQa: {
      id?: string;
      question: string;
      answer: string;
      category?: string;
      followUps?: { question: string; answer: string }[];
    }[];
  };
  const meta = JSON.parse(
    readFileSync(resolve(root, "data/migration/navigator-meta-by-question.json"), "utf8")
  ) as Record<string, unknown>;
  const rows = seed.preparedQa.map((q, i) => ({
    id: q.id ?? `seed-${i}`,
    question: q.question,
    answer: q.answer,
    category: q.category,
    navigatorMeta: (meta[q.question.trim()] ?? {}) as Record<string, unknown>,
    followUps: q.followUps,
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

function runTurn(
  spoken: string,
  enriched: ReturnType<typeof enrichLibrary>,
  library: LexicalQaRow[],
  ctx: ReturnType<typeof emptyInterviewContext>
) {
  const ranked = rankPreparedQaHybrid(spoken, library, enriched, ctx, null, null);
  const top = ranked[0];
  const row = enriched.find((r) => r.id === top?.rowId);
  if (!top || !row) return { ctx, row: null as null, top: null as null };
  const resolution = resolveInterviewContext(spoken, enriched, ctx);
  const next = applyContextResolution(ctx, resolution, spoken, top.rowId);
  return { ctx: next, row, top };
}

describe("conversation chains (contextual follow-ups)", () => {
  const { enriched, library } = loadCatalog();

  it("RBC Cashback: main → Interac → measurement stays on rbc-cashback", () => {
    let ctx = emptyInterviewContext();
    const main = runTurn(
      "Tell me about a customer problem you solved at RBC",
      enriched,
      library,
      ctx
    );
    ctx = main.ctx;
    expect(main.row?.navigator.experienceModuleId).toBe("rbc-cashback");

    const why = runTurn("Why did you use Interac?", enriched, library, ctx);
    expect(why.row?.navigator.experienceModuleId).toBe("rbc-cashback");

    const measure = runTurn("How did you measure whether it worked?", enriched, library, why.ctx);
    expect(measure.row?.navigator.experienceModuleId).toBe("rbc-cashback");
  });

  it("Arc'teryx: integration story → funding question stays on arcteryx-membership", () => {
    let ctx = emptyInterviewContext();
    const current = runTurn("Tell me about a complex integration you led.", enriched, library, ctx);
    ctx = current.ctx;
    expect(current.row?.question).toMatch(/integration/i);

    const story = runTurn(
      "How did you secure $5.2 million in capital funding at Arc'teryx?",
      enriched,
      library,
      ctx
    );
    expect(story.row?.navigator.experienceModuleId).toMatch(/arcteryx/);
  });

  it("HBC: app story → conversion follow-up stays on hbc-mastercard-app", () => {
    let ctx = emptyInterviewContext();
    const main = runTurn("Tell me about a customer experience you improved at HBC", enriched, library, ctx);
    ctx = main.ctx;
    expect(main.row?.navigator.experienceModuleId).toBe("hbc-mastercard-app");

    const conv = runTurn("How did you measure the 15% improvement?", enriched, library, ctx);
    expect(conv.row?.navigator.experienceModuleId).toBe("hbc-mastercard-app");
  });

  it("Questbank strategy chain keeps questrade-primary module", () => {
    let ctx = emptyInterviewContext();
    const main = runTurn(
      "How would you convince existing Questrade investors to make Questbank their primary bank?",
      enriched,
      library,
      ctx
    );
    ctx = main.ctx;
    expect(main.row?.navigator.experienceModuleId).toBe("questrade-primary");

    const payroll = runTurn("How would the customer know their payroll switch worked?", enriched, library, ctx);
    expect(["questrade-primary", "questrade-deposits"]).toContain(
      payroll.row?.navigator.experienceModuleId
    );
  });

  it("AI MCP chain resolves to mcp module", () => {
    let ctx = emptyInterviewContext();
    const main = runTurn(
      "Why would Questrade expose brokerage capabilities to Claude and ChatGPT instead of building its own AI assistant?",
      enriched,
      library,
      ctx
    );
    ctx = main.ctx;
    expect(main.row?.navigator.experienceModuleId).toBe("questrade-mcp");

    const consent = runTurn(
      "How would you design MCP or agentic finance connections with consent and human approval?",
      enriched,
      library,
      ctx
    );
    expect(consent.row?.navigator.experienceModuleId).toBe("questrade-mcp");
  });
});

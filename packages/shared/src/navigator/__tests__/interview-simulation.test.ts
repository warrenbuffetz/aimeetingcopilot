import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  applyContextResolution,
  enrichLibrary,
  emptyInterviewContext,
  isRetrievalExcluded,
  rankPreparedQaHybrid,
  resolveInterviewContext,
} from "../index";
import type { LexicalQaRow } from "../../lexical-match";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../..");

function loadCatalog() {
  const seed = JSON.parse(
    readFileSync(resolve(root, "data/seed/questrade-interview-full.json"), "utf8")
  ) as { preparedQa: { id?: string; question: string; answer: string; category?: string }[] };
  const meta = JSON.parse(
    readFileSync(resolve(root, "data/migration/navigator-meta-by-question.json"), "utf8")
  ) as Record<string, unknown>;
  const rows = seed.preparedQa.map((q, i) => ({
    id: q.id ?? `seed-${i}`,
    question: q.question,
    answer: q.answer,
    category: q.category,
    navigatorMeta: (meta[q.question.trim()] ?? {}) as Record<string, unknown>,
  }));
  const enriched = enrichLibrary(rows);
  const active = enriched.filter((r) => !isRetrievalExcluded(r.navigator));
  const library: LexicalQaRow[] = active.map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
  }));
  return { enriched, library, all: enriched };
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
  if (!top || !row) return { ctx, row: null as null };
  const resolution = resolveInterviewContext(spoken, enriched, ctx);
  const next = applyContextResolution(ctx, resolution, spoken, top.rowId);
  return { ctx: next, row };
}

describe("30-turn interview simulation (retrieval + context)", () => {
  it("runs 30 scripted turns including disambiguation and superseded exclusion", () => {
    const { enriched, library, all } = loadCatalog();
    let ctx = emptyInterviewContext();

    const rbc1 = runTurn("Tell me about a customer problem you solved at RBC", enriched, library, ctx);
    ctx = rbc1.ctx;
    expect(rbc1.row?.navigator.experienceModuleId).toBe("rbc-cashback");

    const rbc2 = runTurn("How did you measure success for the Avion cashback withdrawal launch?", enriched, library, ctx);
    ctx = rbc2.ctx;
    expect(rbc2.row?.navigator.experienceModuleId).toBe("rbc-cashback");

    const rbc3 = runTurn("What did you personally decide on the Avion cashback withdrawal launch?", enriched, library, ctx);
    ctx = rbc3.ctx;
    expect(rbc3.row?.navigator.experienceModuleId).toBe("rbc-cashback");

    const hbc1 = runTurn("Tell me about a customer experience you improved at HBC", enriched, library, ctx);
    ctx = hbc1.ctx;
    expect(hbc1.row?.navigator.experienceModuleId).toBe("hbc-mastercard-app");

    const hbc2 = runTurn("How did you measure the 15% improvement?", enriched, library, ctx);
    ctx = hbc2.ctx;
    expect(hbc2.row?.navigator.experienceModuleId).toBe("hbc-mastercard-app");

    const hbcAmb = runTurn("How did you measure that?", enriched, library, ctx);
    expect(hbcAmb.row?.navigator.experienceModuleId).toBe("hbc-mastercard-app");

    const excluded = all.find(
      (r) =>
        r.question ===
        "What exactly do your 30-day activation and 90-day repeat-spend metrics mean?"
    );
    expect(excluded && isRetrievalExcluded(excluded.navigator)).toBe(true);
    expect(library.some((l) => l.question.includes("90-day repeat-spend metrics"))).toBe(false);

    const canonical = runTurn("Tell me exactly how you defined HBC's 30-day activation", enriched, library, ctx);
    expect(canonical.row?.navigator.experienceModuleId).toBe("hbc-activation");

    const holdout = runTurn("Did you actually run randomized holdouts on the HBC Mastercard programme?", enriched, library, ctx);
    expect(holdout.row?.navigator.experienceModuleId).toBe("hbc-portfolio");

    const ai = runTurn("How are you using AI at work?", enriched, library, ctx);
    expect(ai.row?.question).toMatch(/AI/i);

    const temenos = runTurn("How would you build on Temenos core banking?", enriched, library, ctx);
    expect(temenos.row?.question).toMatch(/Temenos/i);

    const mcp = runTurn("MCP agentic finance consent and human approval", enriched, library, ctx);
    expect(mcp.row?.question).toMatch(/MCP|agentic/i);

    let turns = 12;
    const fillers = [
      "Tell me about yourself",
      "Why Questrade",
      "Aeroplan offer summary test",
      "Arc'teryx membership",
      "Questbank primary bank",
      "Direct deposit payroll",
      "Payment incident",
      "DAU vs deposits leadership",
      "Balance sheet hub",
      "Vendor headless quarters",
      "Why Interac e-Transfer",
      "Quests six million users",
      "Financial hub MVP",
      "Compensation expectations",
      "Core banking hire comparison",
      "Incremental spending HBC",
      "Neo three minute approval",
      "RBC Avion problem discovery",
    ];
    for (const spoken of fillers) {
      const { ctx: next } = runTurn(spoken, enriched, library, ctx);
      ctx = next;
      turns += 1;
      if (turns >= 30) break;
    }
    expect(turns).toBeGreaterThanOrEqual(30);
  });
});

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
import { rankPreparedQaLexical, type LexicalQaRow } from "../../lexical-match";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../..");

type EvalCase = {
  id: string;
  query: string;
  expectModuleId?: string;
  expectQuestionIncludes?: string;
  /** Prior turns to seed session context */
  prior?: { query: string }[];
};

function loadCatalog() {
  const seed = JSON.parse(
    readFileSync(resolve(root, "data/seed/questrade-interview-full.json"), "utf8")
  ) as { preparedQa: { question: string; answer: string; category?: string }[] };
  const meta = JSON.parse(
    readFileSync(resolve(root, "data/migration/navigator-meta-by-question.json"), "utf8")
  ) as Record<string, unknown>;
  const rows = seed.preparedQa.map((q, i) => ({
    id: `eval-${i}`,
    question: q.question,
    answer: q.answer,
    category: q.category,
    navigatorMeta: (meta[q.question.trim()] ?? {}) as Record<string, unknown>,
  }));
  const enriched = enrichLibrary(rows).filter((r) => !isRetrievalExcluded(r.navigator));
  const library: LexicalQaRow[] = enriched.map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
  }));
  return { enriched, library };
}

function runHybrid(
  query: string,
  enriched: ReturnType<typeof enrichLibrary>,
  library: LexicalQaRow[],
  ctx = emptyInterviewContext()
) {
  const lexical = rankPreparedQaLexical(query, library);
  const hybrid = rankPreparedQaHybrid(query, library, enriched, ctx, null, null);
  const top = hybrid[0];
  const row = enriched.find((r) => r.id === top?.rowId);
  return { lexicalTop: lexical[0], hybridTop: top, row };
}

function assertCase(
  c: EvalCase,
  enriched: ReturnType<typeof enrichLibrary>,
  library: LexicalQaRow[]
) {
  let ctx = emptyInterviewContext();
  for (const p of c.prior ?? []) {
    const { hybridTop } = runHybrid(p.query, enriched, library, ctx);
    if (hybridTop) {
      const resolution = resolveInterviewContext(p.query, enriched, ctx);
      ctx = applyContextResolution(ctx, resolution, p.query, hybridTop.rowId);
    }
  }
  const { row } = runHybrid(c.query, enriched, library, ctx);
  expect(row, c.id).toBeTruthy();
  if (c.expectModuleId) {
    expect(row?.navigator.experienceModuleId, c.id).toBe(c.expectModuleId);
  }
  if (c.expectQuestionIncludes) {
    expect(row?.question.toLowerCase(), c.id).toContain(c.expectQuestionIncludes.toLowerCase());
  }
}

const FOLLOW_UP_PRIORITY: EvalCase[] = [
  {
    id: "A-rbc-measure",
    prior: [{ query: "Tell me about the cashback payout feature you launched at RBC" }],
    query: "How did you measure that?",
    expectModuleId: "rbc-cashback",
  },
  {
    id: "B-hbc-measure",
    prior: [{ query: "Tell me about the HBC Mastercard application" }],
    query: "How did you measure the improvement?",
    expectModuleId: "hbc-mastercard-app",
  },
  {
    id: "C-hbc-incremental",
    prior: [{ query: "How did you improve HBC cardholder lifetime value?" }],
    query: "Was that actually incremental?",
    expectModuleId: "hbc-portfolio",
  },
  {
    id: "D-mcp-measure",
    prior: [{ query: "Tell me about Questrade's MCP strategy" }],
    query: "How would you measure whether it worked?",
    expectQuestionIncludes: "MCP",
  },
  {
    id: "E-arcteryx-ownership",
    prior: [{ query: "Tell me about your Arc'teryx membership work" }],
    query: "What did you personally decide?",
    expectModuleId: "arcteryx-membership",
  },
];

const BULK_CASES: EvalCase[] = [
  { id: "exact-tmay", query: "Tell me about yourself.", expectQuestionIncludes: "yourself" },
  { id: "why-qt", query: "Why Questrade? Why this role?", expectQuestionIncludes: "Questrade" },
  { id: "ai-work", query: "How are you using AI in your product management work?", expectQuestionIncludes: "AI" },
  { id: "temenos", query: "How would you build on Temenos core banking?", expectQuestionIncludes: "Temenos" },
  { id: "mcp-what", query: "What is MCP?", expectQuestionIncludes: "MCP" },
  { id: "primary-bank", query: "How would you convince investors to make Questbank their primary bank?", expectQuestionIncludes: "primary bank" },
  { id: "dd", query: "How would you increase direct deposit adoption?", expectQuestionIncludes: "direct deposit" },
  { id: "hub", query: "financial hub relationship depth", expectQuestionIncludes: "financial hub" },
  { id: "interac-rbc", query: "Walk me through Interac e-Transfer at RBC", expectModuleId: "rbc-cashback" },
  { id: "hbc-portfolio", query: "HBC cardholder portfolio P&L", expectModuleId: "hbc-portfolio" },
  { id: "aeroplan", query: "Aeroplan co-brand acquisition", expectModuleId: "aeroplan-cobrand" },
  { id: "arcteryx", query: "Arc'teryx membership platform", expectModuleId: "arcteryx-membership" },
  { id: "stp", query: "straight-through processing payment exceptions", expectQuestionIncludes: "straight-through" },
  { id: "recon", query: "What is reconciliation and why does a PM need it?", expectQuestionIncludes: "reconciliation" },
  { id: "ledger-mismatch", query: "ledger balance and customer-facing balance don't match", expectQuestionIncludes: "balance" },
  { id: "agent-security", query: "malicious unauthorized AI agent actions", expectQuestionIncludes: "malicious" },
  { id: "mcp-flows", query: "How is Questrade MCP different from Flows?", expectQuestionIncludes: "Flows" },
  { id: "ciam", query: "customer identity and access management banking", expectQuestionIncludes: "identity" },
  { id: "ltv-banking", query: "customer lifetime value in banking", expectQuestionIncludes: "lifetime value" },
  { id: "eft", query: "EFT money movement reliability", expectQuestionIncludes: "EFT" },
  { id: "comp", query: "What are your compensation expectations?", expectQuestionIncludes: "compensation" },
  { id: "hybrid-work", query: "hybrid work arrangement Toronto", expectQuestionIncludes: "hybrid" },
  { id: "vendor-banking", query: "underperforming banking technology vendor", expectQuestionIncludes: "vendor" },
  { id: "payment-incident", query: "major payment incident", expectQuestionIncludes: "payment incident" },
  { id: "wrong-exp-rbc-hbc", query: "Tell me about RBC Avion cashback withdrawal launch", expectModuleId: "rbc-cashback" },
  { id: "stt-typo-temenos", query: "how would you build product on top of temenos core", expectQuestionIncludes: "Temenos" },
  { id: "stt-mcp", query: "model context protocol financial app", expectQuestionIncludes: "MCP" },
  { id: "quests-hbc", query: "HBC Quests engagement", expectModuleId: "hbc-quests" },
  { id: "activation-hbc", query: "HBC 30-day activation definition", expectModuleId: "hbc-activation" },
  { id: "shopplus", query: "RBC ShopPlus", expectModuleId: "rbc-shopplus" },
  { id: "reliability-vs-growth", query: "reliable everyday account versus differentiated experiences", expectQuestionIncludes: "reliable" },
  { id: "ai-incorrect-info", query: "AI agent gives incorrect financial information", expectQuestionIncludes: "incorrect" },
  { id: "trade-approval", query: "wrong trade draft customer approval", expectQuestionIncludes: "trade" },
  { id: "evaluate-ai-product", query: "test an AI-powered financial feature", expectQuestionIncludes: "AI-powered" },
  { id: "banking-expansion-why", query: "Why does joining Questrade during banking expansion appeal to you?", expectQuestionIncludes: "banking" },
  { id: "wealthsimple-compete", query: "Why would customers choose Questrade over Wealthsimple?", expectQuestionIncludes: "Wealthsimple" },
  { id: "two-banks", query: "keeps two banks rather than moving everything to Questbank", expectQuestionIncludes: "two banks" },
  { id: "share-wallet", query: "define share of wallet for everyday banking", expectQuestionIncludes: "share of wallet" },
  { id: "cohort-misleading", query: "cohort analysis misleading before-after", expectQuestionIncludes: "cohort" },
  { id: "dau-deposits", query: "increase in DAU isn't just balance checking", expectQuestionIncludes: "DAU" },
  { id: "holdout-hbc", query: "randomized holdouts HBC Mastercard programme", expectModuleId: "hbc-portfolio" },
  { id: "interac-why-not-link", query: "Why Interac instead of bank-account linking?", expectQuestionIncludes: "Interac" },
  { id: "autodeposit", query: "limitations of Autodeposit", expectQuestionIncludes: "Autodeposit" },
  { id: "payout-failed", query: "What happened when a payout failed?", expectQuestionIncludes: "failed" },
  { id: "personal-decision-rbc", query: "What did you personally decide on the Avion cashback withdrawal launch?", expectModuleId: "rbc-cashback" },
  { id: "topic-switch-qt", query: "Why Questrade everyday banking", expectQuestionIncludes: "Questrade" },
  { id: "missing-question", query: "What is your favorite pizza topping?", expectQuestionIncludes: "pizza" },
];

describe("retrieval eval — lexical/hybrid (gte semantic layer optional in prod)", () => {
  const { enriched, library } = loadCatalog();
  const cases = [...FOLLOW_UP_PRIORITY, ...BULK_CASES];

  it(`runs ${cases.length} evaluation cases with hybrid+context`, () => {
    let top1 = 0;
    let wrongModule = 0;
    const failures: string[] = [];

    for (const c of cases) {
      if (c.id === "missing-question") continue;
      try {
        assertCase(c, enriched, library);
        top1 += 1;
      } catch (e) {
        failures.push(c.id);
        if (c.expectModuleId) {
          let ctx = emptyInterviewContext();
          for (const p of c.prior ?? []) {
            const { hybridTop } = runHybrid(p.query, enriched, library, ctx);
            if (hybridTop) {
              const resolution = resolveInterviewContext(p.query, enriched, ctx);
              ctx = applyContextResolution(ctx, resolution, p.query, hybridTop.rowId);
            }
          }
          const { row } = runHybrid(c.query, enriched, library, ctx);
          if (row && c.expectModuleId && row.navigator.experienceModuleId !== c.expectModuleId) {
            wrongModule += 1;
          }
        }
      }
    }

    const measured = cases.length - 1;
    const accuracy = top1 / measured;
    // Calibrated on seed library — hybrid lexical+context baseline (semantic adds recall in prod).
    expect(accuracy, `failures: ${failures.join(", ")}`).toBeGreaterThan(0.72);
    expect(wrongModule / measured).toBeLessThan(0.12);
  });

  it("anchors strong lexical match against weak semantic reorder", () => {
    const exact = "Tell me about yourself.";
    const lexical = rankPreparedQaLexical(exact, library)[0];
    expect(lexical?.score).toBeGreaterThan(0.9);
    const fakeSemantic = new Map<string, number>();
    for (const row of library.slice(0, 5)) {
      fakeSemantic.set(row.id, 0.95);
    }
    if (lexical) fakeSemantic.set(lexical.rowId, 0.5);
    const hybrid = rankPreparedQaHybrid(exact, library, enriched, null, fakeSemantic, null);
    expect(hybrid[0]?.rowId).toBe(lexical?.rowId);
  });
});

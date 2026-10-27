import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  QUESTRADE_TIER2_CANONICAL,
  enrichLibrary,
  emptyInterviewContext,
  isRetrievalExcluded,
  rankPreparedQaHybrid,
} from "../index";
import type { LexicalQaRow } from "../../lexical-match";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../..");

function loadCatalog() {
  const exp = JSON.parse(
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
  const rows = exp.records
    .filter((r) => r.status === "active")
    .map((r) => ({
      id: r.id,
      question: r.question,
      answer: r.answer,
      navigatorMeta: r.navigatorMeta ?? {},
    }));
  const enriched = enrichLibrary(rows).filter((r) => !isRetrievalExcluded(r.navigator));
  const library: LexicalQaRow[] = enriched.map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
  }));
  return { enriched, library };
}

function top(query: string, enriched: ReturnType<typeof enrichLibrary>, library: LexicalQaRow[]) {
  const ranked = rankPreparedQaHybrid(query, library, enriched, emptyInterviewContext(), null, null);
  const row = enriched.find((r) => r.id === ranked[0]?.rowId);
  return row;
}

describe("Questrade Tier 2 consistency retrieval", () => {
  const { enriched, library } = loadCatalog();

  it("archived illustrative Aeroplan experiment is excluded from catalog", () => {
    expect(enriched.find((r) => r.id === "8f93a4d4-6570-4ae8-8e29-ff5f1c6218b4")).toBeUndefined();
  });

  it("archived illustrative HBC experiment is excluded from catalog", () => {
    expect(enriched.find((r) => r.id === "3218b561-2159-442e-a3aa-074756f877c0")).toBeUndefined();
  });

  it("1 — How exactly did you measure Aeroplan 40% → cautious primary", () => {
    const row = top("How exactly did you measure Aeroplan's 40% conversion improvement?", enriched, library);
    expect(row?.id).toBe(QUESTRADE_TIER2_CANONICAL.aeroplanMeasurementPrimary);
  });

  it("2 — 40% relative vs points → Aeroplan primary", () => {
    const row = top("Was that 40% relative or 40 percentage points?", enriched, library);
    expect(row?.id).toBe(QUESTRADE_TIER2_CANONICAL.aeroplanMeasurementPrimary);
  });

  it("3 — HBC application completion measurement → cautious primary", () => {
    const row = top("How did you measure the HBC application completion lift?", enriched, library);
    expect(row?.id).toBe(QUESTRADE_TIER2_CANONICAL.hbcMeasurementPrimary);
  });

  it("4 — HBC 15% relative → HBC primary", () => {
    const row = top("Was that 15% relative?", enriched, library);
    expect(row?.id).toBe(QUESTRADE_TIER2_CANONICAL.hbcMeasurementPrimary);
  });

  it("5 — biggest weakness", () => {
    const row = top("Tell me about your biggest weakness.", enriched, library);
    expect(row?.id).toBe(QUESTRADE_TIER2_CANONICAL.weakness);
  });

  it("6 — product decision wrong → Q3", () => {
    const row = top("Tell me about a product decision you got wrong.", enriched, library);
    expect(row?.id).toBe(QUESTRADE_TIER2_CANONICAL.productMistakeQ3);
  });

  it("7 — didn't go to plan → initiative story not Q3", () => {
    const row = top("Tell me about a product initiative that didn't go according to plan.", enriched, library);
    expect(row?.id).toBe(QUESTRADE_TIER2_CANONICAL.initiativeDidntGoToPlan);
  });

  it("8 — explicit failed product does not prefer Q3", () => {
    const row = top("Tell me about a product that failed.", enriched, library);
    expect(row?.id).not.toBe(QUESTRADE_TIER2_CANONICAL.productMistakeQ3);
  });

  it("9 — Arc'teryx launched vs developed", () => {
    const row = top(
      "What actually launched at Arc'teryx versus what's still being developed?",
      enriched,
      library
    );
    expect(row?.id).toBe(QUESTRADE_TIER2_CANONICAL.arcLiveVsPlanned);
    expect(row?.answer).not.toMatch(/while I was there/i);
  });
});

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  QUESTRADE_TELL_ME_ABOUT_YOURSELF_ID,
  enrichLibrary,
  emptyInterviewContext,
  suggestContextualFollowUps,
} from "../index";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../..");

function loadQuestradeExportCatalog() {
  const exp = JSON.parse(
    readFileSync(resolve(root, "exports/questrade_interview_library.json"), "utf8")
  ) as {
    records: {
      id: string;
      question: string;
      answer: string;
      category?: string;
      isPreferred?: boolean;
      status: string;
      navigatorMeta?: Record<string, unknown>;
    }[];
  };
  return enrichLibrary(
    exp.records
      .filter((r) => r.status === "active")
      .map((r) => ({
        id: r.id,
        question: r.question,
        answer: r.answer,
        category: r.category,
        isPreferred: r.isPreferred,
        navigatorMeta: r.navigatorMeta ?? {},
      }))
  );
}

function rowByQuestion(catalog: ReturnType<typeof loadQuestradeExportCatalog>, pattern: RegExp) {
  const row = catalog.find((r) => pattern.test(r.question));
  expect(row).toBeTruthy();
  return row!;
}

function ctxFor(row: ReturnType<typeof rowByQuestion>, round: "recruiter" | "hiring_manager" | "cross_functional_panel") {
  return {
    ...emptyInterviewContext(),
    activeInterviewRound: round,
    activeExperienceModuleId: row.navigator.experienceModuleId,
    activeIntent: row.navigator.intent,
    activeQuestionId: row.id,
    lastDetectedQuestion: row.question,
  };
}

describe("Top115 curated contextual follow-ups", () => {
  const catalog = loadQuestradeExportCatalog();
  const profile = "questrade" as const;

  it("1 — Recruiter / Tell me about yourself", () => {
    const intro = catalog.find((r) => r.id === QUESTRADE_TELL_ME_ABOUT_YOURSELF_ID)!;
    const fu = suggestContextualFollowUps(catalog, ctxFor(intro, "recruiter"), intro, [], {
      limit: 4,
      interviewProfile: profile,
    });
    expect(fu.map((f) => f.rowId)).toEqual([
      "1fd9478b-7396-4778-bc00-e62aee52de52",
      "c1d638b6-1858-487d-9ac2-5b6cc5327eb8",
      "28571e7f-620f-4880-9cd7-cdfc2e146aa8",
      "244e239c-2f88-4b6e-968f-ef8ce65daa70",
    ]);
    expect(fu.map((f) => f.question).join(" ")).not.toMatch(/simplii/i);
  });

  it("2 — Hiring Manager / Tell me about yourself", () => {
    const intro = catalog.find((r) => r.id === QUESTRADE_TELL_ME_ABOUT_YOURSELF_ID)!;
    const fu = suggestContextualFollowUps(catalog, ctxFor(intro, "hiring_manager"), intro, [], {
      limit: 4,
      interviewProfile: profile,
    });
    const titles = fu.map((f) => f.question).join("\n");
    expect(titles).toMatch(/currently working on at arc/i);
    expect(titles).toMatch(/interac e-transfer/i);
    expect(titles).toMatch(/why questrade/i);
    expect(titles).toMatch(/primary bank|questbank/i);
  });

  it("3 — Panel / Tell me about yourself", () => {
    const intro = catalog.find((r) => r.id === QUESTRADE_TELL_ME_ABOUT_YOURSELF_ID)!;
    const fu = suggestContextualFollowUps(catalog, ctxFor(intro, "cross_functional_panel"), intro, [], {
      limit: 4,
      interviewProfile: profile,
    });
    const titles = fu.map((f) => f.question).join("\n");
    expect(titles).toMatch(/interac e-transfer/i);
    expect(titles).toMatch(/risk, compliance or engineering/i);
    expect(titles).toMatch(/complex integration/i);
    expect(titles).toMatch(/designers and customer researchers/i);
  });

  it("4 — RBC Interac story", () => {
    const main = rowByQuestion(catalog, /interac e-transfer product you launched at rbc/i);
    const fu = suggestContextualFollowUps(catalog, ctxFor(main, "cross_functional_panel"), main, [], {
      limit: 6,
      interviewProfile: profile,
    });
    const joined = fu.map((f) => f.question).join("\n");
    expect(joined).toMatch(/interac|eft|own|timeout|duplicate/i);
  });

  it("5 — Arc'teryx Sperro current work", () => {
    const main = rowByQuestion(catalog, /currently working on at arc'?teryx/i);
    const fu = suggestContextualFollowUps(catalog, ctxFor(main, "recruiter"), main, [], {
      limit: 6,
      interviewProfile: profile,
    });
    const joined = fu.map((f) => f.question).join("\n");
    expect(joined).toMatch(/sperro|membership|funding|headless/i);
  });

  it("6 — Direct deposit adoption case", () => {
    const main = rowByQuestion(catalog, /increase direct deposit adoption/i);
    const fu = suggestContextualFollowUps(catalog, ctxFor(main, "hiring_manager"), main, [], {
      limit: 6,
      interviewProfile: profile,
    });
    const joined = fu.map((f) => f.question).join("\n");
    expect(joined).toMatch(/payroll|deposit|primary|funded|failure/i);
  });

  it("9 — Compensation anchor shows no contextual cards", () => {
    const main = rowByQuestion(catalog, /what are your compensation expectations/i);
    const fu = suggestContextualFollowUps(catalog, ctxFor(main, "recruiter"), main, [], {
      limit: 4,
      interviewProfile: profile,
    });
    expect(fu.length).toBe(0);
  });

  it("10 — Profile separation filters Simplii poison", () => {
    const intro = catalog.find((r) => r.id === QUESTRADE_TELL_ME_ABOUT_YOURSELF_ID)!;
    const poison = {
      ...intro,
      id: "fake-simplii",
      question: "Walk me through discovery for an unfamiliar Simplii product area.",
      answer: "x",
      navigator: { ...intro.navigator, importKey: "simplii-jd-001" },
    };
    const fu = suggestContextualFollowUps([...catalog, poison], ctxFor(intro, "recruiter"), intro, [], {
      limit: 8,
      interviewProfile: profile,
    });
    expect(fu.some((f) => /simplii/i.test(f.question))).toBe(false);
  });

  it("12 — Round change reorders intro follow-ups", () => {
    const intro = catalog.find((r) => r.id === QUESTRADE_TELL_ME_ABOUT_YOURSELF_ID)!;
    const rec = suggestContextualFollowUps(catalog, ctxFor(intro, "recruiter"), intro, [], {
      limit: 4,
      interviewProfile: profile,
    }).map((f) => f.rowId);
    const panel = suggestContextualFollowUps(catalog, ctxFor(intro, "cross_functional_panel"), intro, [], {
      limit: 4,
      interviewProfile: profile,
    }).map((f) => f.rowId);
    expect(rec).not.toEqual(panel);
  });
});

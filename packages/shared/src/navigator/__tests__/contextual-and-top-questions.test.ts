import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  editorialTopQuestionLimit,
  enrichLibrary,
  emptyInterviewContext,
  suggestContextualFollowUps,
  suggestTopInterviewQuestions,
} from "../index";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../..");

function loadCatalog() {
  const seed = JSON.parse(
    readFileSync(resolve(root, "data/seed/questrade-interview-full.json"), "utf8")
  ) as {
    preparedQa: { id?: string; question: string; answer: string; category?: string }[];
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
  }));
  return enrichLibrary(rows);
}

describe("suggestTopInterviewQuestions", () => {
  const catalog = loadCatalog();

  it("recruiter shortlist follows curated editorial order", () => {
    const ctx = { ...emptyInterviewContext(), activeInterviewRound: "recruiter" as const };
    const top = suggestTopInterviewQuestions(catalog, ctx, { limit: 12 });
    expect(top.length).toBeGreaterThanOrEqual(5);
    expect(top[0].question).toMatch(/tell me about yourself/i);
    expect(top[0].reason).toMatch(/Recruiter #1 · VH/);
    const joined = top.map((t) => t.question).join("\n");
    expect(joined).toMatch(/questrade|everyday banking|retail banking|rewards/i);
  });

  it("hiring manager shortlist prioritizes intro then current role per editorial list", () => {
    const top = suggestTopInterviewQuestions(catalog, {
      ...emptyInterviewContext(),
      activeInterviewRound: "hiring_manager",
    }, { limit: 5 });
    expect(top[0].question).toMatch(/tell me about yourself/i);
    expect(top[1].question).toMatch(/currently working on at arc/i);
  });

  it("does not reshuffle when only active experience changes", () => {
    const base = { ...emptyInterviewContext(), activeInterviewRound: "recruiter" as const };
    const a = suggestTopInterviewQuestions(catalog, base, { limit: 10 }).map((x) => x.rowId);
    const withExp = {
      ...base,
      activeExperienceModuleId: "rbc-cashback",
      activeExperienceLabel: "RBC",
      activeIntent: "main_story" as const,
    };
    const b = suggestTopInterviewQuestions(catalog, withExp, { limit: 10 }).map((x) => x.rowId);
    expect(a).toEqual(b);
  });

  it("updates when interview round changes", () => {
    const rec = suggestTopInterviewQuestions(catalog, {
      ...emptyInterviewContext(),
      activeInterviewRound: "recruiter",
    }).map((x) => x.rowId);
    const hm = suggestTopInterviewQuestions(catalog, {
      ...emptyInterviewContext(),
      activeInterviewRound: "hiring_manager",
    }).map((x) => x.rowId);
    expect(rec).not.toEqual(hm);
  });

  it("returns full editorial list length per round", () => {
    const rec = suggestTopInterviewQuestions(catalog, {
      ...emptyInterviewContext(),
      activeInterviewRound: "recruiter",
    });
    expect(rec.length).toBe(editorialTopQuestionLimit("recruiter"));
    const hm = suggestTopInterviewQuestions(catalog, {
      ...emptyInterviewContext(),
      activeInterviewRound: "hiring_manager",
    });
    expect(hm.length).toBe(editorialTopQuestionLimit("hiring_manager"));
    const panel = suggestTopInterviewQuestions(catalog, {
      ...emptyInterviewContext(),
      activeInterviewRound: "cross_functional_panel",
    });
    expect(panel.length).toBe(editorialTopQuestionLimit("cross_functional_panel"));
  });
});

describe("suggestContextualFollowUps", () => {
  it("returns curated RBC Interac follow-ups from export catalog", () => {
    const exp = JSON.parse(
      readFileSync(resolve(root, "exports/questrade_interview_library.json"), "utf8")
    ) as { records: { id: string; question: string; answer: string; status: string; navigatorMeta?: Record<string, unknown> }[] };
    const catalog = enrichLibrary(
      exp.records
        .filter((r) => r.status === "active")
        .map((r) => ({
          id: r.id,
          question: r.question,
          answer: r.answer,
          navigatorMeta: r.navigatorMeta ?? {},
        }))
    );
    const main = catalog.find((r) => /interac e-transfer product you launched at rbc/i.test(r.question));
    expect(main).toBeTruthy();
    const ctx = {
      ...emptyInterviewContext(),
      activeInterviewRound: "cross_functional_panel" as const,
      activeExperienceModuleId: main!.navigator.experienceModuleId,
      activeIntent: main!.navigator.intent,
      activeQuestionId: main!.id,
      lastDetectedQuestion: main!.question,
    };
    const fu = suggestContextualFollowUps(catalog, ctx, main!, [main!.question], {
      limit: 6,
      interviewProfile: "questrade",
    });
    expect(fu.length).toBeGreaterThan(0);
    expect(fu.some((f) => /interac|eft|own|timeout|duplicate|reconcil/i.test(f.question))).toBe(true);
    expect(fu.some((f) => f.question === main!.question)).toBe(false);
  });

  it("empty when no active row", () => {
    expect(suggestContextualFollowUps(loadCatalog(), emptyInterviewContext(), null, [])).toEqual([]);
  });
});

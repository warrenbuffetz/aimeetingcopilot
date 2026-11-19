import { describe, expect, it } from "vitest";
import {
  amenaAskQuestions,
  amenaPinnedQuestions,
  amenaQuestions,
  validateAmenaDataset,
} from "./dataset";
import { applyAmenaEdits } from "./edits";
import {
  AMENA_FOCUSED_PROFILE_ID,
  AMENA_FOCUSED_PROFILE_NAME,
  chooseClassicLiveProfile,
  isAmenaFocusedProfileName,
} from "./profile";
import { relatedQuestions } from "./related";
import { searchAmenaQuestions } from "./search";

function topKey(query: string): string | undefined {
  const hit = searchAmenaQuestions(amenaQuestions, query)[0];
  return amenaQuestions.find((question) => question.id === hit?.questionId)?.curatedKey;
}

function followQuestion(query: string): string | null {
  const hit = searchAmenaQuestions(amenaQuestions, query)[0];
  if (!hit?.followUpId) return null;
  return (
    amenaQuestions.flatMap((question) => question.followUps).find((follow) => follow.id === hit.followUpId)
      ?.question ?? null
  );
}

describe("flexiti amena dataset", () => {
  it("matches the curated counts and keeps answers isolated", () => {
    expect(validateAmenaDataset()).toEqual([]);
    expect(amenaQuestions).toHaveLength(15);
    expect(amenaQuestions.reduce((sum, question) => sum + question.followUps.length, 0)).toBe(15);
    expect(amenaPinnedQuestions).toHaveLength(10);
    expect(amenaAskQuestions).toHaveLength(3);
    expect(amenaAskQuestions.every((item) => item.tier === "primary")).toBe(true);
    expect(new Set(amenaQuestions.map((question) => question.id)).size).toBe(15);
    expect(amenaQuestions.every((question) => question.id.startsWith("amena-A"))).toBe(true);
  });

  it("nests the improve-first follow-up under Flexiti product observations", () => {
    const observations = amenaQuestions.find((question) => question.curatedKey === "A15")!;
    expect(observations.title).toMatch(/financing experiences/i);
    expect(observations.followUps).toHaveLength(1);
    expect(observations.followUps[0]?.question).toMatch(/improve first/i);
    expect(observations.followUps[0]?.answer).toMatch(/The Brick/);
    expect(observations.answer).toMatch(/Visions Electronics/);
  });

  it("nests timeout and double-pay follow-ups under the RBC story", () => {
    const rbc = amenaQuestions.find((question) => question.curatedKey === "A06")!;
    expect(rbc.followUps).toHaveLength(2);
    expect(rbc.followUps.some((follow) => /build a new payment integration|reuse RBC/i.test(follow.question))).toBe(
      true
    );
    expect(rbc.followUps.some((follow) => /times out|paid twice/i.test(follow.question))).toBe(true);
  });

  it("keeps Flexiti product-sense answers distinct from Everyday Banking framing", () => {
    const why = amenaQuestions.find((question) => question.curatedKey === "A02")!;
    expect(why.answer).toMatch(/Flexiti/);
    expect(why.answer).toMatch(/The Brick|Visions Electronics/);
    expect(why.answer).toMatch(/identity verification, credit decisions/);
    expect(why.answer).not.toMatch(/Everyday Banking ambition|become their primary bank/i);

    const metrics = amenaQuestions.find((question) => question.curatedKey === "A10")!;
    expect(metrics.followUps).toHaveLength(1);
    expect(metrics.followUps[0]?.answer).toMatch(/risk-adjusted contribution/i);
  });

  it("compacts career answers into spoken blocks without sentence-per-paragraph spacing", () => {
    const leave = amenaQuestions.find((question) => question.curatedKey === "A03")!;
    const paragraphs = leave.answer.split(/\n{2,}/);
    expect(paragraphs.length).toBeGreaterThanOrEqual(4);
    expect(paragraphs.length).toBeLessThanOrEqual(7);
    expect(paragraphs.some((paragraph) => paragraph.includes("I've actually really enjoyed"))).toBe(true);
    expect(paragraphs.some((paragraph) => /other half of the job/i.test(paragraph))).toBe(true);
    expect(leave.answer).toMatch(/\$5\.2 million in capital funding/);
  });
});

describe("flexiti amena edits", () => {
  it("applies local answer overrides without mutating the curated dataset", () => {
    const base = amenaQuestions[0]!;
    const edited = applyAmenaEdits(amenaQuestions, {
      answers: { [base.id]: "Edited spoken answer." },
      followUps: {},
    });
    expect(edited.find((question) => question.id === base.id)?.answer).toBe("Edited spoken answer.");
    expect(amenaQuestions.find((question) => question.id === base.id)?.answer).toBe(base.answer);
  });
});

describe("flexiti amena search and related", () => {
  it("surfaces Flexiti checkout conversion from product-sense keywords", () => {
    expect(topKey("checkout conversion financing")).toBe("A11");
    expect(topKey("business health metrics")).toBe("A10");
    expect(topKey("Brick and Visions financing experiences")).toBe("A15");
  });

  it("can open the RBC timeout follow-up from a follow-up query", () => {
    const question = followQuestion("payment request times out paid twice");
    expect(question).toMatch(/times out|paid twice/i);
  });

  it("returns related pivots for Flexiti metrics", () => {
    const metrics = amenaQuestions.find((question) => question.curatedKey === "A10")!;
    const related = relatedQuestions(metrics, amenaQuestions).map((question) => question.curatedKey);
    expect(related).toEqual(expect.arrayContaining(["A11", "A12"]));
  });
});

describe("flexiti amena routing", () => {
  it("recognizes the Amena focused profile name and local id", () => {
    expect(isAmenaFocusedProfileName(AMENA_FOCUSED_PROFILE_NAME)).toBe(true);
    expect(isAmenaFocusedProfileName("Flexiti — Amena (Focused)")).toBe(true);
    expect(isAmenaFocusedProfileName("Questrade — Jaz (Focused)")).toBe(false);
    expect(AMENA_FOCUSED_PROFILE_ID).toBe("local:flexiti-amena");
  });

  it("routes classic live selection to the Amena navigator", () => {
    expect(chooseClassicLiveProfile([], AMENA_FOCUSED_PROFILE_ID)).toEqual({ kind: "amena" });
    expect(
      chooseClassicLiveProfile([{ id: "db-1", name: AMENA_FOCUSED_PROFILE_NAME }], "db-1")
    ).toEqual({ kind: "amena" });
  });
});

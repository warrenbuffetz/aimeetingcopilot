import { describe, expect, it } from "vitest";
import { jazAskQuestions, jazPinnedQuestions, jazQuestions, validateJazDataset } from "./dataset";
import { applyJazEdits } from "./edits";
import { chooseClassicLiveProfile, isJazFocusedProfileName } from "./profile";
import { relatedQuestions } from "./related";
import { searchJazQuestions } from "./search";
import { mapIdsForQuestionId } from "./map-links";
import { validateJazStoryMaps } from "./story-maps";
import { validateJazTechStack } from "./tech-stack";
import { searchJazStoryMaps } from "./story-map-search";
import { jazStoryMaps } from "./story-maps";

function topKey(query: string): string | undefined {
  const hit = searchJazQuestions(jazQuestions, query)[0];
  return jazQuestions.find((question) => question.id === hit?.questionId)?.curatedKey;
}

function followQuestion(query: string): string | null {
  const hit = searchJazQuestions(jazQuestions, query)[0];
  if (!hit?.followUpId) return null;
  return jazQuestions.flatMap((question) => question.followUps).find((follow) => follow.id === hit.followUpId)?.question ?? null;
}

describe("questrade jaz dataset", () => {
  it("matches the curated counts and keeps answers isolated from old ids", () => {
    expect(validateJazDataset()).toEqual([]);
    expect(jazQuestions).toHaveLength(36);
    expect(jazQuestions.reduce((sum, question) => sum + question.followUps.length, 0)).toBe(80);
    expect(jazPinnedQuestions).toHaveLength(13);
    expect(jazAskQuestions).toHaveLength(12);
    expect(jazAskQuestions[3]?.topic).toBe("Team stability and evolution");
    expect(jazAskQuestions[3]?.question).toContain("long-term stability");
    expect(jazAskQuestions[0]?.topic).toBe("Leadership under pressure");
    expect(jazAskQuestions[0]?.question).toContain("When do you step in versus give them space");
    expect(jazAskQuestions.find((item) => item.topic === "Why the role is open")?.followUps).toHaveLength(2);
    expect(jazAskQuestions.some((item) => item.question.includes("Why this is better"))).toBe(false);
    expect(new Set(jazQuestions.map((question) => question.id)).size).toBe(36);
    expect(jazQuestions.every((question) => question.id.startsWith("jaz-Q"))).toBe(true);
  });

  it("keeps the authored distinctions the interview depends on", () => {
    const byKey = (key: string) => jazQuestions.find((question) => question.curatedKey === key)!;
    expect(byKey("Q04").answer).toContain("fund their investment accounts");
    expect(byKey("Q11").answer).toContain("Balance Sheet");
    expect(byKey("Q36").followUps).toHaveLength(3);
    expect(byKey("Q36").navigationLabel).toBe("Questrade App Observations");
    expect(byKey("Q14").followUps.some((follow) => /idempotency/i.test(follow.question))).toBe(true);
    expect(byKey("Q15").answer).toMatch(/Interac/);
    expect(byKey("Q19").evidenceStatus).toBe("illustrative");
    expect(byKey("Q20").answer).toContain("ShopPlus");
    expect(byKey("Q20").answer).not.toMatch(/withdrawals were prioritized/i);
    expect(byKey("Q30").title).toMatch(/current responsibilities at Arc'teryx/i);
    expect(byKey("Q32").answer).toContain("15%");
    expect(byKey("Q17").answer).toMatch(/web-first|deferring the full mobile/i);
  });
});

describe("questrade jaz edits", () => {
  it("copies an edited answer without changing the curated record", () => {
    const original = jazQuestions[0]!.answer;
    const edited = applyJazEdits(jazQuestions, { answers: { [jazQuestions[0]!.id]: "Local edit only." }, followUps: {} });
    expect(edited[0]!.answer).toBe("Local edit only.");
    expect(jazQuestions[0]!.answer).toBe(original);
    expect(edited[1]).toBe(jazQuestions[1]);
  });
});

describe("classic profile selection", () => {
  const questrade = { id: "qt", name: "Questrade — Senior PM, Everyday Banking" };
  const simplii = { id: "sm", name: "Simplii Financial — Senior Product Manager" };
  const jazDb = { id: "db-jaz", name: "Questrade — Jaz (Focused)" };

  it("recognizes the focused profile name and leaves the existing names alone", () => {
    expect(isJazFocusedProfileName(jazDb.name)).toBe(true);
    expect(isJazFocusedProfileName(questrade.name)).toBe(false);
    expect(isJazFocusedProfileName(simplii.name)).toBe(false);
  });

  it("keeps the existing live default and routes the focused name away from it", () => {
    expect(chooseClassicLiveProfile([questrade, simplii], null)).toEqual({ kind: "profile", id: "qt" });
    expect(chooseClassicLiveProfile([simplii], null)).toEqual({ kind: "profile", id: "sm" });
    expect(chooseClassicLiveProfile([questrade, jazDb], null)).toEqual({ kind: "profile", id: "qt" });
    expect(chooseClassicLiveProfile([questrade, simplii], "sm")).toEqual({ kind: "profile", id: "sm" });
    expect(chooseClassicLiveProfile([jazDb], null)).toEqual({ kind: "jaz" });
    expect(chooseClassicLiveProfile([jazDb], "db-jaz")).toEqual({ kind: "jaz" });
    expect(chooseClassicLiveProfile([], null)).toEqual({ kind: "none" });
  });
});

describe("questrade jaz search", () => {
  it("retrieves the prepared paths from a keyword", () => {
    expect(topKey("money movement")).toBe("Q14");
    expect(followQuestion("idempotency")).toMatch(/idempotency/i);
    expect(topKey("HBC abandonment")).toBe("Q19");
    expect(topKey("primary bank")).toBe("Q04");
    expect(topKey("paycheque")).toBe("Q08");
    expect(topKey("payroll")).toBe("Q08");
    expect(topKey("stakeholder conflict")).toBe("Q24");
    expect(topKey("competing priorities")).toBe("Q35");
    expect(topKey("Arc'teryx prioritization")).toBe("Q17");
    expect(topKey("why Questrade")).toBe("Q02");
    expect(topKey("30/60/90")).toBe("Q05");
    expect(topKey("first 90 days")).toBe("Q05");
    expect(topKey("P&L")).toBe("Q09");
    expect(topKey("ShopPlus")).toBe("Q20");
    expect(topKey("didn't launch")).toBe("Q25");
    expect(topKey("Tell me about your current responsibilities at Arc'teryx")).toBe("Q30");
    expect(topKey("direct deposit")).toBe("Q08");
    expect(topKey("Questrade app")).toBe("Q36");
    expect(topKey("RBC Interac")).toBe("Q15");
    expect(searchJazQuestions(jazQuestions, "money movement").length).toBeLessThanOrEqual(7);
    expect(searchJazQuestions(jazQuestions, "independently confirmed details")).toEqual([]);
  });

  it("links primary-bank and disagreement answers to the next prepared pivot", () => {
    const primary = jazQuestions.find((question) => question.curatedKey === "Q04")!;
    const disagreement = jazQuestions.find((question) => question.curatedKey === "Q24")!;
    expect(relatedQuestions(primary, jazQuestions).map((question) => question.curatedKey)).toEqual(["Q36", "Q08", "Q13"]);
    expect(relatedQuestions(disagreement, jazQuestions).map((question) => question.curatedKey)).toContain("Q26");
    expect(relatedQuestions(disagreement, jazQuestions).map((question) => question.curatedKey)).toContain("Q25");
  });

  it("adds targeted growth and RBC prioritization answers without replacing Arc'teryx prioritization", () => {
    const growth = jazQuestions.find((question) => question.curatedKey === "Q34")!;
    const rbcPriority = jazQuestions.find((question) => question.curatedKey === "Q35")!;
    const arcPriority = jazQuestions.find((question) => question.curatedKey === "Q17")!;
    const ambiguity = jazQuestions.find((question) => question.curatedKey === "Q27")!;
    expect(growth.followUps).toHaveLength(4);
    expect(rbcPriority.followUps).toHaveLength(3);
    expect(growth.evidenceStatus).toBe("illustrative");
    expect(growth.answer).toContain("five percentage points");
    expect(arcPriority.answer).toContain("membership program at Arc'teryx");
    expect(rbcPriority.answer).toContain("Avion Select");
    expect(ambiguity.answer).toContain("smaller, controlled lifecycle test");
    expect(topKey("growth experiment")).toBe("Q34");
    expect(topKey("RBC competing priorities")).toBe("Q35");
  });
});

describe("questrade jaz experience maps", () => {
  it("keeps story maps and tech stack datasets valid", () => {
    expect(validateJazStoryMaps()).toEqual([]);
    expect(validateJazTechStack()).toEqual([]);
    expect(jazStoryMaps).toHaveLength(7);
    expect(mapIdsForQuestionId("jaz-Q15")).toEqual(["rbc-payouts"]);
    expect(mapIdsForQuestionId("jaz-Q19")).toEqual(["hbc-app"]);
    expect(mapIdsForQuestionId("jaz-Q24")).toEqual(["arc-membership"]);
    expect(mapIdsForQuestionId("jaz-Q34")).toEqual(["hbc-portfolio"]);
    expect(mapIdsForQuestionId("jaz-Q35")).toEqual(["rbc-select"]);
    expect(searchJazStoryMaps(jazStoryMaps, "Neo").some((story) => story.id === "hbc-app")).toBe(true);
    expect(searchJazStoryMaps(jazStoryMaps, "Interac").some((story) => story.id === "rbc-payouts")).toBe(true);
  });
});

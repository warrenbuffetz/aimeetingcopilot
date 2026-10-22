import { describe, expect, it } from "vitest";
import { applyContextResolution, enrichLibrary, resolveInterviewContext } from "../context";
import { emptyInterviewContext } from "../types";
import type { EnrichedQaRow } from "../types";

function row(
  id: string,
  question: string,
  moduleId: string,
  intent: EnrichedQaRow["navigator"]["intent"],
  answer = "Answer"
): EnrichedQaRow {
  return {
    id,
    question,
    answer,
    navigator: {
      libraryCategory: "resume_deep_dive",
      experienceModuleId: moduleId,
      experienceLabel: moduleId,
      intent,
      evidenceStatus: "illustrative_scenario",
      altPhrasings: [],
      keywords: [],
    },
  };
}

const catalog = enrichLibrary([
  {
    id: "rbc0",
    question: "Tell me about a customer problem you solved at RBC.",
    answer: "RBC main",
    notes: "RBC-00",
    part: 12,
  },
  {
    id: "rbc4",
    question: "What did you personally decide on the Avion cashback withdrawal launch?",
    answer: "RBC own",
    notes: "RBC-04",
    part: 12,
  },
  {
    id: "hbc5",
    question: "How did you measure the 15% improvement?",
    answer: "HBC app measure",
    notes: "HBC-05",
    part: 12,
  },
  {
    id: "hbcx",
    question: "How did you establish that lifecycle incentives improved P&L and modeled LTV?",
    answer: "HBC portfolio",
    notes: "HBC-X2",
    part: 12,
    isPreferred: false,
  },
  {
    id: "arc0",
    question: "Tell me about something you took from an idea into a product.",
    answer: "Arc main",
    notes: "ARC-00",
    part: 12,
  },
]);

describe("resolveInterviewContext", () => {
  it("scenario A: sets RBC on cashback story", () => {
    const ctx = emptyInterviewContext();
    const res = resolveInterviewContext("Tell me about RBC cashback withdrawals.", catalog, ctx);
    expect(res.experienceModuleId).toBe("rbc-cashback");
    const next = applyContextResolution(ctx, res, "Tell me about RBC cashback withdrawals.", res.rowId);
    expect(next.activeExperienceModuleId).toBe("rbc-cashback");
  });

  it("scenario A: ambiguous ownership stays on RBC", () => {
    let ctx = emptyInterviewContext();
    ctx = applyContextResolution(
      ctx,
      resolveInterviewContext("Walk me through the Interac cashback launch.", catalog, ctx),
      "Walk me through the Interac cashback launch."
    );
    const res = resolveInterviewContext("What did you personally decide?", catalog, ctx);
    expect(res.experienceModuleId).toBe("rbc-cashback");
    expect(res.rowId).toBe("rbc4");
  });

  it("scenario B: measurement on HBC app not portfolio", () => {
    let ctx = emptyInterviewContext();
    ctx = applyContextResolution(
      ctx,
      resolveInterviewContext("Tell me about the HBC Mastercard application.", catalog, ctx),
      "HBC app"
    );
    const res = resolveInterviewContext("How did you measure that?", catalog, ctx);
    expect(res.experienceModuleId).toBe("hbc-mastercard-app");
    expect(res.rowId).toBe("hbc5");
    expect(res.rowId).not.toBe("hbcx");
  });

  it("scenario C: topic switch to Arc'teryx", () => {
    let ctx = emptyInterviewContext();
    ctx = applyContextResolution(
      ctx,
      resolveInterviewContext("Why Interac at RBC?", catalog, ctx),
      "Why Interac?"
    );
    const res = resolveInterviewContext("Let's switch gears. Tell me about Arc'teryx.", catalog, ctx);
    expect(res.topicSwitch).toBe(true);
    expect(res.experienceModuleId).toBe("arcteryx-membership");
  });
});

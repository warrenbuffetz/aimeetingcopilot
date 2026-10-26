import { describe, expect, it } from "vitest";
import { isInterviewPrompt, isLikelyQuestion } from "../question-heuristics";
import { shouldFinalizeTurnImmediately } from "../turn-classify";
import { normalizeInterviewQuery } from "../query-normalize";

describe("isInterviewPrompt", () => {
  it("recognizes Arc'teryx follow-up without relying on question mark alone", () => {
    const q = "Can you tell us a little bit more about your time at Arc'teryx?";
    expect(isInterviewPrompt(q)).toBe(true);
    expect(isLikelyQuestion(q)).toBe(true);
  });

  it("recognizes membership walk-through", () => {
    const q = "Walk me through the membership platform you worked on";
    expect(isInterviewPrompt(q)).toBe(true);
  });

  it("recognizes expand prompts", () => {
    expect(isInterviewPrompt("Can you expand on that?")).toBe(true);
  });
});

describe("shouldFinalizeTurnImmediately", () => {
  it("finalizes questions with question marks immediately", () => {
    expect(shouldFinalizeTurnImmediately("Why Questrade?")).toBe(true);
  });

  it("finalizes statement-style interview prompts when complete", () => {
    expect(shouldFinalizeTurnImmediately("Walk me through your most recent work at Arc'teryx.")).toBe(
      true
    );
  });

  it("does not finalize mid-answer speech", () => {
    expect(shouldFinalizeTurnImmediately("So I started by talking to engineering about")).toBe(false);
  });
});

describe("normalizeInterviewQuery", () => {
  it("maps arteries STT error to Arc'teryx for retrieval only", () => {
    const raw = "Tell me more about your time at arteries";
    const { query, corrections } = normalizeInterviewQuery(raw);
    expect(query).toMatch(/Arc'teryx/i);
    expect(corrections.some((c) => /Arc'teryx/i.test(c))).toBe(true);
    expect(raw).toMatch(/arteries/i);
  });
});

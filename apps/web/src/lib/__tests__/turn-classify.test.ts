import { describe, expect, it } from "vitest";
import {
  classifyTurn,
  isFillerTurn,
  surfaceTurnSuggestion,
  turnSilenceMs,
  TURN_SILENCE_MS,
} from "@interview-copilot/shared";

const library = [
  {
    id: "1",
    question: "Tell me about yourself.",
    answer: "Intro",
    followUps: [],
  },
  {
    id: "2",
    question: "Why are you looking to leave Arc'teryx?",
    answer: "Leave",
    followUps: [],
  },
];

describe("isFillerTurn", () => {
  it("flags small talk", () => {
    expect(isFillerTurn("Thanks for joining today.")).toBe(true);
  });
});

describe("classifyTurn", () => {
  it("promotes strong library match", () => {
    const c = classifyTurn("Can you tell me about yourself?", { library });
    expect(c.action).toBe("promote");
  });

  it("ignores duplicate of current question", () => {
    const c = classifyTurn("Tell me about yourself.", {
      library,
      currentPreparedQuestion: "Tell me about yourself.",
    });
    expect(c.action).toBe("ignore");
  });

  it("candidate on clear question phrasing", () => {
    const c = classifyTurn("Why are you looking to leave Arc'teryx?", {
      library,
      currentPreparedQuestion: "Tell me about yourself.",
    });
    expect(["candidate", "promote"]).toContain(c.action);
  });
});

describe("surfaceTurnSuggestion", () => {
  it("surfaces filler as review without discarding", () => {
    const c = surfaceTurnSuggestion("Thanks for joining today.", library);
    expect(c.action).toBe("candidate");
    expect(c.isFiller).toBe(false);
  });
});

describe("turnSilenceMs", () => {
  it("shortens finalize when buffer ends with a question mark", () => {
    expect(turnSilenceMs("Why Questrade?")).toBeLessThan(TURN_SILENCE_MS);
  });
});

import { describe, expect, it } from "vitest";
import {
  classifyTurn,
  isFillerTurn,
  isLikelyReadingDisplayedAnswer,
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

  it("ignores speech that matches the on-screen answer script", () => {
    const displayAnswer =
      "What caught my attention was the ambition behind everyday banking. Questrade already has relationships with people who trust it with their investments.";
    const spoken =
      "what caught my attention was the ambition behind everyday banking and questrade already has relationships";
    const c = surfaceTurnSuggestion(spoken, library, {
      displayAnswer,
      activeQuestion: "Why Questrade? Why this role?",
    });
    expect(c.action).toBe("ignore");
    expect(c.reason).toBe("reading_displayed_answer");
  });

  it("still surfaces a new interviewer question while an answer is on screen", () => {
    const displayAnswer = "Long prepared answer about roadmap prioritization and stakeholder alignment.";
    const c = surfaceTurnSuggestion("How would you measure success for onboarding in the first ninety days?", library, {
      displayAnswer,
      activeQuestion: "Tell me about a time you prioritized roadmap items.",
    });
    expect(c.action).toBe("candidate");
    expect(c.isQuestionLike).toBe(true);
  });
});

describe("isLikelyReadingDisplayedAnswer", () => {
  it("detects partial read-back of a long script", () => {
    const answer =
      "I partnered with design and engineering to run a holdout test on the cashback earn rate, then rolled out the winning variant after we saw a lift in activation.";
    const { reading } = isLikelyReadingDisplayedAnswer(
      "I partnered with design and engineering to run a holdout test on the cashback earn rate",
      answer,
      "Walk me through the RBC cashback launch."
    );
    expect(reading).toBe(true);
  });
});

describe("turnSilenceMs", () => {
  it("shortens finalize when buffer ends with a question mark", () => {
    expect(turnSilenceMs("Why Questrade?")).toBeLessThan(TURN_SILENCE_MS);
  });
});

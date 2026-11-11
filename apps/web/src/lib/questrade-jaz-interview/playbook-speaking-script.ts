import type { PlaybookCase } from "@/lib/questrade-jaz-interview/playbook-cases";
import priorityOverrides from "@/data/questrade-jaz-speaking-script-priority.json";

/** Fill-in slots for the shared product-sense speaking script. */
export type SpeakingScriptSlots = {
  clarifyQuestion: string;
  assumptionDetail: string;
  includeThinkingIntro: boolean;
  customerTryingTo: string;
  todayTheyHaveTo: string;
  focusPart: string;
  focusBecause: string;
  optionA: string;
  optionAHelpsWhen: string;
  optionB: string;
  startWith: "A" | "B";
  choiceWhy: string;
  customerWalkthrough: string;
  tradeoff: string;
  successIf: string;
  earlySign: string;
  concernIf: string;
  verifyCompare: string;
  changeMindIf: string;
};

export type SpeakingScriptOverride = Partial<SpeakingScriptSlots>;

const PRIORITY_OVERRIDES = priorityOverrides as Record<string, SpeakingScriptOverride>;

/** Product-sense speaking script only — not diagnostic / technical / strategy skeletons. */
export function supportsSpeakingScript(item: PlaybookCase): boolean {
  return item.liveType === "product-sense" || item.liveType === "priority";
}

function trimSentence(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\.\.+/g, ".").trim().replace(/\.$/, "");
}

function firstSentence(text: string): string {
  const t = trimSentence(text);
  const m = t.match(/^(.+?[.!?])(?:\s|$)/);
  return m ? trimSentence(m[1]!) : t;
}

function heuristicSlots(item: PlaybookCase): SpeakingScriptSlots {
  const clarifyQuestion = trimSentence(item.clarify);
  const assumptionDetail = trimSentence(item.hypothesis);
  const focusPart = firstSentence(item.hypothesis) || trimSentence(item.title);
  const focusBecause =
    firstSentence(item.seniorReasoning) ||
    "leaving it unsolved keeps the customer stuck and drives avoidable support";
  return {
    clarifyQuestion,
    assumptionDetail,
    includeThinkingIntro: true,
    customerTryingTo: `make progress on: ${trimSentence(item.title).replace(/\?$/, "").toLowerCase()}`,
    todayTheyHaveTo: "work around an unclear or incomplete experience for that job",
    focusPart,
    focusBecause,
    optionA: trimSentence(item.optionA),
    optionAHelpsWhen: "the dominant pain is clear and a smaller change can unlock the next step",
    optionB: trimSentence(item.optionB),
    startWith: "A",
    choiceWhy: trimSentence(item.choose),
    customerWalkthrough:
      "see the clearer next step for this job, take that action, and know what happened",
    tradeoff: `I'm accepting that ${trimSentence(item.optionB).replace(/\.$/, "").toLowerCase()} waits until the first path proves out`,
    successIf: trimSentence(item.metric),
    earlySign: "an early action or successful completion tied to that job",
    concernIf: trimSentence(item.guardrail),
    verifyCompare:
      "a held-out or staged cohort against today's experience on the success metric and the main guardrail",
    changeMindIf:
      "evidence shows a different root cause, the metric doesn't move, or a guardrail is breached",
  };
}

export function getSpeakingScriptSlots(item: PlaybookCase): SpeakingScriptSlots | null {
  if (!supportsSpeakingScript(item)) return null;
  const base = heuristicSlots(item);
  const override = PRIORITY_OVERRIDES[item.id];
  if (!override) return base;
  return { ...base, ...override };
}

export function choiceLabel(slots: SpeakingScriptSlots): string {
  return slots.startWith === "A" ? slots.optionA : slots.optionB;
}

/** Stitched read-aloud script from stems + slots. */
export function buildReadAloudScript(slots: SpeakingScriptSlots): string {
  const choice = choiceLabel(slots);
  const parts: string[] = [];

  parts.push(
    `Before I choose an approach, I'd like to clarify one thing. ${slots.clarifyQuestion}`
  );
  if (slots.assumptionDetail) {
    parts.push(`For this example, I'll assume ${slots.assumptionDetail}.`);
  }
  if (slots.includeThinkingIntro) {
    parts.push(
      "Let me take a second to organize my thoughts. I'll start with what the customer is trying to do and where they're getting stuck. Then I'll walk through what we could change, what I'd try first, and how I'd know it helped."
    );
  }
  parts.push(
    `From the customer's perspective, they're trying to ${slots.customerTryingTo}. Today they have to ${slots.todayTheyHaveTo}.`
  );
  parts.push(`The part I'd focus on is ${slots.focusPart} because ${slots.focusBecause}.`);
  parts.push(
    `One thing we could do is test ${slots.optionA}. That helps when ${slots.optionAHelpsWhen}.`
  );
  parts.push(`Another way to approach it would be to try ${slots.optionB}.`);
  parts.push(`I'd start with ${choice} because ${slots.choiceWhy}.`);
  parts.push(
    `Let me walk you through what that looks like for this customer. They'd ${slots.customerWalkthrough}.`
  );
  parts.push(`The trade-off I'm accepting is ${slots.tradeoff}.`);
  parts.push(`I'd know this helped if customers could ${slots.successIf}.`);
  parts.push(`The first sign I'd look for is ${slots.earlySign}.`);
  parts.push(`I'd be concerned if ${slots.concernIf}.`);
  parts.push(`I'd compare ${slots.verifyCompare}.`);
  parts.push(
    `So I'd start with ${choice} because ${slots.choiceWhy}. I'd keep going if customers could ${slots.successIf}.`
  );
  parts.push(`I'd change direction if ${slots.changeMindIf}.`);

  return parts.join("\n\n");
}

export type SpeakSection = {
  id: string;
  title: string;
  guidance?: string;
  optional?: boolean;
  lines: { stem?: string; slotKey?: keyof SpeakingScriptSlots; text?: string; dynamic?: "choice" }[];
};

export const SPEAK_SECTIONS: SpeakSection[] = [
  {
    id: "clarify",
    title: "Clarify",
    guidance: "Would a different answer change your first move? Ask, then pause.",
    lines: [
      { stem: "Before I choose an approach, I'd like to clarify one thing.", slotKey: "clarifyQuestion" },
      { stem: "For this example, I'll assume", slotKey: "assumptionDetail" },
    ],
  },
  {
    id: "intro",
    title: "Intro for time to think",
    optional: true,
    guidance:
      "Let me take a second to organize my thoughts. I'll start with what the customer is trying to do and where they're getting stuck. Then I'll walk through what we could change, what I'd try first, and how I'd know it helped.",
    lines: [],
  },
  {
    id: "problem",
    title: "Problem",
    lines: [
      { stem: "From the customer's perspective, they're trying to", slotKey: "customerTryingTo" },
      { stem: "Today they have to", slotKey: "todayTheyHaveTo" },
      { stem: "The part I'd focus on is", slotKey: "focusPart" },
      { stem: "because", slotKey: "focusBecause" },
    ],
  },
  {
    id: "options",
    title: "Options",
    lines: [
      { stem: "One thing we could do is test", slotKey: "optionA" },
      { stem: "That helps when", slotKey: "optionAHelpsWhen" },
      { stem: "Another way to approach it would be to try", slotKey: "optionB" },
    ],
  },
  {
    id: "choice",
    title: "Choice",
    guidance: "Start where the customer is today. What's the smallest change that would help them take the next step?",
    lines: [
      { stem: "I'd start with", dynamic: "choice" },
      { stem: "because", slotKey: "choiceWhy" },
      { stem: "Let me walk you through what that looks like for this customer. They'd", slotKey: "customerWalkthrough" },
      { stem: "The trade-off I'm accepting is", slotKey: "tradeoff" },
    ],
  },
  {
    id: "measure",
    title: "Measure",
    guidance: "What would the customer do differently? Compare with today's experience and watch for the mistake that would matter most.",
    lines: [
      { stem: "I'd know this helped if customers could", slotKey: "successIf" },
      { stem: "The first sign I'd look for is", slotKey: "earlySign" },
      { stem: "I'd be concerned if", slotKey: "concernIf" },
      { stem: "I'd compare", slotKey: "verifyCompare" },
    ],
  },
  {
    id: "closing",
    title: "Closing",
    optional: true,
    guidance: "What first? Why? What would convince me?",
    lines: [
      { text: "closing-summary" },
      { stem: "I'd change direction if", slotKey: "changeMindIf" },
    ],
  },
];

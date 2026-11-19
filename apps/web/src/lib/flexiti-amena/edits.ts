import type { AmenaQuestion } from "./dataset";

export const AMENA_EDITS_STORAGE_KEY = "ic-amena-focused-content-edits-v1";

export type AmenaFollowUpEdit = {
  question?: string;
  answer?: string;
};

export type AmenaContentEdits = {
  answers: Record<string, string>;
  followUps: Record<string, AmenaFollowUpEdit>;
};

export const EMPTY_AMENA_EDITS: AmenaContentEdits = { answers: {}, followUps: {} };

export function parseAmenaEdits(raw: string | null): AmenaContentEdits {
  if (!raw) return EMPTY_AMENA_EDITS;
  try {
    const parsed = JSON.parse(raw) as Partial<AmenaContentEdits>;
    const answers: Record<string, string> = {};
    const followUps: Record<string, AmenaFollowUpEdit> = {};
    if (parsed.answers && typeof parsed.answers === "object") {
      for (const [key, value] of Object.entries(parsed.answers)) {
        if (typeof value === "string") answers[key] = value;
      }
    }
    if (parsed.followUps && typeof parsed.followUps === "object") {
      for (const [key, value] of Object.entries(parsed.followUps)) {
        if (!value || typeof value !== "object") continue;
        const edit: AmenaFollowUpEdit = {};
        if (typeof value.question === "string") edit.question = value.question;
        if (typeof value.answer === "string") edit.answer = value.answer;
        if (edit.question != null || edit.answer != null) followUps[key] = edit;
      }
    }
    return { answers, followUps };
  } catch {
    return EMPTY_AMENA_EDITS;
  }
}

export function loadAmenaEdits(): AmenaContentEdits {
  if (typeof window === "undefined") return EMPTY_AMENA_EDITS;
  return parseAmenaEdits(window.localStorage.getItem(AMENA_EDITS_STORAGE_KEY));
}

export function saveAmenaEdits(edits: AmenaContentEdits): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AMENA_EDITS_STORAGE_KEY, JSON.stringify(edits));
}

/** Returns new question objects. Does not mutate the curated dataset. */
export function applyAmenaEdits(questions: readonly AmenaQuestion[], edits: AmenaContentEdits): AmenaQuestion[] {
  return questions.map((question) => {
    const answer = edits.answers[question.id];
    const followUps = question.followUps.map((follow) => {
      const edit = edits.followUps[follow.id];
      if (!edit) return follow;
      return {
        ...follow,
        question: edit.question ?? follow.question,
        answer: edit.answer ?? follow.answer,
      };
    });
    const answerChanged = answer != null && answer !== question.answer;
    const followChanged = followUps.some((follow, index) => follow !== question.followUps[index]);
    if (!answerChanged && !followChanged) return question;
    return {
      ...question,
      answer: answerChanged ? answer : question.answer,
      followUps,
    };
  });
}

export function questionHasEdits(question: AmenaQuestion, edits: AmenaContentEdits): boolean {
  if (edits.answers[question.id] != null && edits.answers[question.id] !== question.answer) return true;
  return question.followUps.some((follow) => {
    const edit = edits.followUps[follow.id];
    if (!edit) return false;
    return (
      (edit.question != null && edit.question !== follow.question) ||
      (edit.answer != null && edit.answer !== follow.answer)
    );
  });
}

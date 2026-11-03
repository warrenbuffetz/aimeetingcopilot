import type { JazQuestion } from "./dataset";

export const JAZ_EDITS_STORAGE_KEY = "ic-jaz-focused-content-edits-v1";

export type JazFollowUpEdit = {
  question?: string;
  answer?: string;
};

export type JazContentEdits = {
  answers: Record<string, string>;
  followUps: Record<string, JazFollowUpEdit>;
};

export const EMPTY_JAZ_EDITS: JazContentEdits = { answers: {}, followUps: {} };

export function parseJazEdits(raw: string | null): JazContentEdits {
  if (!raw) return EMPTY_JAZ_EDITS;
  try {
    const parsed = JSON.parse(raw) as Partial<JazContentEdits>;
    const answers: Record<string, string> = {};
    const followUps: Record<string, JazFollowUpEdit> = {};
    if (parsed.answers && typeof parsed.answers === "object") {
      for (const [key, value] of Object.entries(parsed.answers)) {
        if (typeof value === "string") answers[key] = value;
      }
    }
    if (parsed.followUps && typeof parsed.followUps === "object") {
      for (const [key, value] of Object.entries(parsed.followUps)) {
        if (!value || typeof value !== "object") continue;
        const edit: JazFollowUpEdit = {};
        if (typeof value.question === "string") edit.question = value.question;
        if (typeof value.answer === "string") edit.answer = value.answer;
        if (edit.question != null || edit.answer != null) followUps[key] = edit;
      }
    }
    return { answers, followUps };
  } catch {
    return EMPTY_JAZ_EDITS;
  }
}

export function loadJazEdits(): JazContentEdits {
  if (typeof window === "undefined") return EMPTY_JAZ_EDITS;
  return parseJazEdits(window.localStorage.getItem(JAZ_EDITS_STORAGE_KEY));
}

export function saveJazEdits(edits: JazContentEdits): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(JAZ_EDITS_STORAGE_KEY, JSON.stringify(edits));
}

/** Returns new question objects. Does not mutate the curated dataset. */
export function applyJazEdits(questions: readonly JazQuestion[], edits: JazContentEdits): JazQuestion[] {
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

export function questionHasEdits(question: JazQuestion, edits: JazContentEdits): boolean {
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

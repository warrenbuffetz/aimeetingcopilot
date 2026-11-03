import type { BristolQuestion } from "./dataset";

export const BRISTOL_EDITS_STORAGE_KEY = "ic-bristol-focused-content-edits-v1";

export type BristolFollowUpEdit = {
  question?: string;
  answer?: string;
};

export type BristolContentEdits = {
  answers: Record<string, string>;
  followUps: Record<string, BristolFollowUpEdit>;
};

export const EMPTY_BRISTOL_EDITS: BristolContentEdits = { answers: {}, followUps: {} };

export function parseBristolEdits(raw: string | null): BristolContentEdits {
  if (!raw) return EMPTY_BRISTOL_EDITS;
  try {
    const parsed = JSON.parse(raw) as Partial<BristolContentEdits>;
    const answers: Record<string, string> = {};
    const followUps: Record<string, BristolFollowUpEdit> = {};
    if (parsed.answers && typeof parsed.answers === "object") {
      for (const [key, value] of Object.entries(parsed.answers)) {
        if (typeof value === "string") answers[key] = value;
      }
    }
    if (parsed.followUps && typeof parsed.followUps === "object") {
      for (const [key, value] of Object.entries(parsed.followUps)) {
        if (!value || typeof value !== "object") continue;
        const edit: BristolFollowUpEdit = {};
        if (typeof value.question === "string") edit.question = value.question;
        if (typeof value.answer === "string") edit.answer = value.answer;
        if (edit.question != null || edit.answer != null) followUps[key] = edit;
      }
    }
    return { answers, followUps };
  } catch {
    return EMPTY_BRISTOL_EDITS;
  }
}

export function loadBristolEdits(): BristolContentEdits {
  if (typeof window === "undefined") return EMPTY_BRISTOL_EDITS;
  return parseBristolEdits(window.localStorage.getItem(BRISTOL_EDITS_STORAGE_KEY));
}

export function saveBristolEdits(edits: BristolContentEdits): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BRISTOL_EDITS_STORAGE_KEY, JSON.stringify(edits));
}

export function applyBristolEdits(
  questions: readonly BristolQuestion[],
  edits: BristolContentEdits
): BristolQuestion[] {
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

export function questionHasEdits(question: BristolQuestion, edits: BristolContentEdits): boolean {
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

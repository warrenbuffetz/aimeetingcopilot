/** Local profile for the Jaz PDF interview pack navigator. */
export const JAZ_INTERVIEW_PROFILE_ID = "local:questrade-jaz-interview";
export const JAZ_INTERVIEW_PROFILE_NAME = "Questrade — Jaz (HM Panel)";
export const JAZ_INTERVIEW_HREF = "/live/jaz-interview";

export function isJazInterviewProfileName(name: string | null | undefined): boolean {
  if (!name) return false;
  return /questrade/i.test(name) && /\bjaz\b/i.test(name) && /(hm panel|interview pack)/i.test(name);
}

import { isJazInterviewProfileName } from "@/lib/questrade-jaz-interview/profile";

/** Local profile for the Jaz Huang focused navigator. Not a shared library row. */
export const JAZ_FOCUSED_PROFILE_ID = "local:questrade-jaz";
export const JAZ_FOCUSED_PROFILE_NAME = "Questrade — Jaz (Focused)";
export const JAZ_FOCUSED_HREF = "/live/jaz";

export function isJazFocusedProfileName(name: string | null | undefined): boolean {
  if (!name) return false;
  if (isJazInterviewProfileName(name)) return false;
  return /questrade/i.test(name) && /\bjaz\b/i.test(name);
}

export type { FocusedLiveProfileChoice as ClassicLiveProfileChoice } from "@/lib/focused-live-routing";
export { chooseClassicLiveProfile } from "@/lib/focused-live-routing";

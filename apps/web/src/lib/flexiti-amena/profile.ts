/** Local profile for the Flexiti Amena focused navigator. Not a shared library row. */
export const AMENA_FOCUSED_PROFILE_ID = "local:flexiti-amena";
export const AMENA_FOCUSED_PROFILE_NAME = "Flexiti — Amena (Focused)";
export const AMENA_FOCUSED_HREF = "/live/amena";

export function isAmenaFocusedProfileName(name: string | null | undefined): boolean {
  if (!name) return false;
  return /flexiti/i.test(name) && /\bamena\b/i.test(name);
}

export type { FocusedLiveProfileChoice as ClassicLiveProfileChoice } from "@/lib/focused-live-routing";
export { chooseClassicLiveProfile } from "@/lib/focused-live-routing";

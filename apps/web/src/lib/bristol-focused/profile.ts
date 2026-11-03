/** Local profile for the Bristol Lewis focused navigator. Not a shared library row. */
export const BRISTOL_FOCUSED_PROFILE_ID = "local:opentable-bristol";
export const BRISTOL_FOCUSED_PROFILE_NAME = "OpenTable — Bristol (Focused)";
export const BRISTOL_FOCUSED_HREF = "/live/bristol";

export function isBristolFocusedProfileName(name: string | null | undefined): boolean {
  if (!name) return false;
  return /opentable/i.test(name) && /\bbristol\b/i.test(name);
}

export function isAnyFocusedProfileName(name: string | null | undefined): boolean {
  if (!name) return false;
  return (/questrade/i.test(name) && /\bjaz\b/i.test(name)) || isBristolFocusedProfileName(name);
}

export function focusedProfileHref(name: string | null | undefined): string | null {
  if (isBristolFocusedProfileName(name)) return BRISTOL_FOCUSED_HREF;
  if (/questrade/i.test(name ?? "") && /\bjaz\b/i.test(name ?? "")) return "/live/jaz";
  return null;
}

/** Local profile for the Jaz Huang focused navigator. Not a shared library row. */
export const JAZ_FOCUSED_PROFILE_ID = "local:questrade-jaz";
export const JAZ_FOCUSED_PROFILE_NAME = "Questrade — Jaz (Focused)";
export const JAZ_FOCUSED_HREF = "/live/jaz";

export function isJazFocusedProfileName(name: string | null | undefined): boolean {
  if (!name) return false;
  return /questrade/i.test(name) && /\bjaz\b/i.test(name);
}

export type ClassicLiveProfileChoice =
  | { kind: "jaz" }
  | { kind: "profile"; id: string }
  | { kind: "none" };

/**
 * Same default as the existing live page (single profile, otherwise Questrade),
 * except names that belong to the focused navigator never become the classic selection.
 */
export function chooseClassicLiveProfile(
  profiles: { id: string; name: string }[],
  requestedId: string | null
): ClassicLiveProfileChoice {
  if (requestedId) {
    const match = profiles.find((p) => p.id === requestedId);
    if (match && isJazFocusedProfileName(match.name)) return { kind: "jaz" };
    if (match) return { kind: "profile", id: match.id };
  }
  const selectable = profiles.filter((p) => !isJazFocusedProfileName(p.name));
  if (selectable.length === 0 && profiles.some((p) => isJazFocusedProfileName(p.name))) {
    return { kind: "jaz" };
  }
  if (selectable.length === 1) return { kind: "profile", id: selectable[0]!.id };
  const preferred = selectable.find((p) => /questrade/i.test(p.name));
  if (preferred) return { kind: "profile", id: preferred.id };
  return { kind: "none" };
}

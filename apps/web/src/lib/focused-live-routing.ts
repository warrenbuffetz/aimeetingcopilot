import {
  BRISTOL_FOCUSED_HREF,
  isBristolFocusedProfileName,
} from "@/lib/bristol-focused/profile";
import {
  JAZ_FOCUSED_HREF,
  isJazFocusedProfileName,
} from "@/lib/questrade-jaz/profile";

export type FocusedLiveProfileChoice =
  | { kind: "jaz" }
  | { kind: "bristol" }
  | { kind: "profile"; id: string }
  | { kind: "none" };

export function isFocusedProfileName(name: string | null | undefined): boolean {
  return isJazFocusedProfileName(name) || isBristolFocusedProfileName(name);
}

export function focusedProfileHrefForName(name: string | null | undefined): string | null {
  if (isBristolFocusedProfileName(name)) return BRISTOL_FOCUSED_HREF;
  if (isJazFocusedProfileName(name)) return JAZ_FOCUSED_HREF;
  return null;
}

/** Classic live default selection; focused profiles route to dedicated navigators. */
export function chooseClassicLiveProfile(
  profiles: { id: string; name: string }[],
  requestedId: string | null
): FocusedLiveProfileChoice {
  if (requestedId) {
    const match = profiles.find((p) => p.id === requestedId);
    if (match && isBristolFocusedProfileName(match.name)) return { kind: "bristol" };
    if (match && isJazFocusedProfileName(match.name)) return { kind: "jaz" };
    if (match) return { kind: "profile", id: match.id };
  }
  const selectable = profiles.filter((p) => !isFocusedProfileName(p.name));
  if (selectable.length === 0) {
    if (profiles.some((p) => isBristolFocusedProfileName(p.name))) return { kind: "bristol" };
    if (profiles.some((p) => isJazFocusedProfileName(p.name))) return { kind: "jaz" };
  }
  if (selectable.length === 1) return { kind: "profile", id: selectable[0]!.id };
  const preferred = selectable.find((p) => /questrade/i.test(p.name));
  if (preferred) return { kind: "profile", id: preferred.id };
  return { kind: "none" };
}

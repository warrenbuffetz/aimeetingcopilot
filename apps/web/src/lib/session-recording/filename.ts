import { extensionForMime } from "./mime";

/** Safe filesystem segment from interview profile name. */
export function profileSlugForFilename(profileName: string | null | undefined): string {
  const raw = (profileName ?? "Interview").trim() || "Interview";
  const slug = raw
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 48);
  return slug || "Interview";
}

export function formatRecordingFilename(
  profileName: string | null | undefined,
  startedAt: Date,
  mimeType: string
): string {
  const slug = profileSlugForFilename(profileName);
  const y = startedAt.getFullYear();
  const mo = String(startedAt.getMonth() + 1).padStart(2, "0");
  const d = String(startedAt.getDate()).padStart(2, "0");
  const h = String(startedAt.getHours()).padStart(2, "0");
  const min = String(startedAt.getMinutes()).padStart(2, "0");
  const ext = extensionForMime(mimeType);
  return `${slug}_${y}-${mo}-${d}_${h}${min}.${ext}`;
}

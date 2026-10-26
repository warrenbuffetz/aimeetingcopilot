import type { NavigatorQaMeta, RevisionStatus } from "./types";

export function revisionStatusFromPersisted(
  raw: { revisionStatus?: string; retrievalExcluded?: boolean } | null | undefined
): RevisionStatus {
  if (raw?.revisionStatus === "superseded" || raw?.revisionStatus === "archived") {
    return raw.revisionStatus as RevisionStatus;
  }
  return "current";
}

/** Exclude from live analyze / next-question ranking; still visible in library browse. */
export function isRetrievalExcluded(
  meta: Pick<NavigatorQaMeta, "revisionStatus" | "retrievalExcluded"> | null | undefined
): boolean {
  if (!meta) return false;
  if (meta.retrievalExcluded) return true;
  return meta.revisionStatus === "superseded" || meta.revisionStatus === "archived";
}

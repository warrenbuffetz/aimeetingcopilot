import type { EvidenceStatus } from "./types";

export function evidenceStatusLabel(status: EvidenceStatus | undefined): string | null {
  switch (status) {
    case "illustrative_scenario":
      return "Illustrative scenario — not a verified resume fact";
    case "rehearsal_framework":
      return "Rehearsal framework — validate before claiming";
    case "unverified_detail":
      return "Detail requires verification";
    case "resume_supported":
      return null;
    default:
      return null;
  }
}

export function evidenceStatusShort(status: EvidenceStatus | undefined): string | null {
  switch (status) {
    case "illustrative_scenario":
      return "Illustrative";
    case "rehearsal_framework":
      return "Rehearsal";
    case "unverified_detail":
      return "Verify";
    default:
      return null;
  }
}

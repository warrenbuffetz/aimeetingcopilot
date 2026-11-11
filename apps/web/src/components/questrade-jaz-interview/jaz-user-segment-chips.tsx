"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";
import {
  BANKING_USER_SEGMENT_CHIPS,
  GENERIC_USER_SEGMENT_CHIPS,
  type UserSegmentChip,
} from "@/lib/questrade-jaz-interview/product-sense-user-segments";
import { cn } from "@/lib/utils";

export function UserSegmentChips({
  pinnedId,
  onPin,
}: {
  pinnedId: string | null;
  onPin: (chip: UserSegmentChip | null) => void;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showGeneric, setShowGeneric] = useState(false);

  const copyLine = useCallback(async (chip: UserSegmentChip) => {
    try {
      await navigator.clipboard.writeText(chip.speakLine);
      setCopiedId(chip.id);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* clipboard blocked */
    }
  }, []);

  function renderChip(chip: UserSegmentChip) {
    const pinned = pinnedId === chip.id;
    return (
      <div
        key={chip.id}
        className={cn(
          "flex items-start gap-1 rounded-md border bg-white p-1.5",
          pinned ? "border-violet-500 ring-1 ring-violet-200" : "border-violet-100"
        )}
      >
        <button
          type="button"
          className="min-w-0 flex-1 rounded px-1.5 py-1 text-left text-xs font-medium text-violet-950 hover:bg-violet-50"
          onClick={() => onPin(pinned ? null : chip)}
          title={chip.speakLine}
        >
          {chip.label}
          {pinned ? <span className="ml-1 text-[10px] text-violet-600">· pinned</span> : null}
        </button>
        <button
          type="button"
          className="shrink-0 rounded p-1 text-violet-800 hover:bg-violet-50"
          aria-label={`Copy speak line for ${chip.label}`}
          onClick={() => copyLine(chip)}
        >
          {copiedId === chip.id ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Tap to pin one segment for the case; copy icon grabs a speakable line.
      </p>
      <div className="grid gap-1.5 sm:grid-cols-2">{BANKING_USER_SEGMENT_CHIPS.map(renderChip)}</div>
      <button
        type="button"
        className="text-xs text-violet-800 underline-offset-2 hover:underline"
        onClick={() => setShowGeneric((v) => !v)}
      >
        {showGeneric ? "Hide generic segments" : "Show generic segments"}
      </button>
      {showGeneric ? (
        <div className="grid gap-1.5 sm:grid-cols-2">{GENERIC_USER_SEGMENT_CHIPS.map(renderChip)}</div>
      ) : null}
    </div>
  );
}

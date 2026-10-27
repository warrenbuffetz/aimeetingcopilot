"use client";

import { useCallback, useMemo, useState } from "react";
import type { TranscriptLine } from "@/hooks/use-live-session";
import { useStickToBottom } from "@/hooks/use-stick-to-bottom";
import { TranscriptLineItem } from "@/components/live/transcript-line";
import {
  buildTranscriptDisplayUnits,
  stickToBottomKey,
} from "@/components/live/transcript-display-units";
import { TranscriptSpeechGroup } from "@/components/live/transcript-speech-group";
import { TranscriptReadbackGroup } from "@/components/live/transcript-readback-group";
import { liveSemantic } from "@/lib/live-semantic";
import { cn } from "@/lib/utils";
import { AudioInputMeter } from "@/components/live/audio-input-meter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PanelLeftClose, ArrowDown } from "lucide-react";

function formatLineTime(createdAt?: number) {
  if (!createdAt) return null;
  return new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export type RawTranscriptPanelProps = {
  lines: TranscriptLine[];
  listening: boolean;
  voiceLevel: number;
  voiceActive: boolean;
  hasAudioTrack: boolean;
  sttLabel: string;
  captureSourceLabel: string;
  sttError?: string | null;
  selectedTranscriptIds: string[];
  editRetryDraft: { lineId: string; text: string } | null;
  onCollapse?: () => void;
  onToggleSelect: (lineId: string, shiftKey: boolean) => void;
  onFindAnswer: (line: TranscriptLine) => void;
  onExploreRelated: (text: string) => void;
  onEditRetry: (line: TranscriptLine) => void;
  onEditRetryChange: (text: string) => void;
  onEditRetrySubmit: () => void;
  onEditRetryCancel: () => void;
  onAnalyzeCombined: () => void;
  onClearSelection: () => void;
  combinedSelectionText: string;
  highlightQuestion?: string | null;
};

export function RawTranscriptPanel({
  lines,
  listening,
  voiceLevel,
  voiceActive,
  hasAudioTrack,
  sttLabel,
  captureSourceLabel,
  sttError,
  selectedTranscriptIds,
  editRetryDraft,
  onCollapse,
  onToggleSelect,
  onFindAnswer,
  onExploreRelated,
  onEditRetry,
  onEditRetryChange,
  onEditRetrySubmit,
  onEditRetryCancel,
  onAnalyzeCombined,
  onClearSelection,
  combinedSelectionText,
  highlightQuestion = null,
}: RawTranscriptPanelProps) {
  const scrollKey = useMemo(() => stickToBottomKey(lines), [lines]);
  const { containerRef, onScroll, showJumpLatest, jumpToLatest } = useStickToBottom<HTMLDivElement>(scrollKey);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => new Set());

  const toggleExpanded = useCallback((key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const displayUnits = useMemo(() => buildTranscriptDisplayUnits(lines), [lines]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-start justify-between gap-1 border-b border-border px-2 py-2">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Raw transcript</p>
          <AudioInputMeter
            listening={listening}
            voiceLevel={voiceLevel}
            voiceActive={voiceActive}
            hasAudioTrack={hasAudioTrack}
          />
          <p className="text-xs text-muted-foreground">
            {listening ? (
              <>
                <span className="font-medium text-foreground/80">STT:</span> {sttLabel}
                <span className="block text-[10px]">Capture: {captureSourceLabel}</span>
              </>
            ) : (
              <span>Start audio to transcribe</span>
            )}
            {sttError && <span className="text-amber-400"> · {sttError}</span>}
          </p>
          <p className="text-[10px] leading-snug text-muted-foreground">
            Speaker unknown — mic captures all nearby speech; meeting-tab capture is remote audio only.
          </p>
        </div>
        {onCollapse && (
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 shrink-0 p-0" onClick={onCollapse} title="Hide raw transcript">
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          ref={containerRef}
          onScroll={onScroll}
          className="absolute inset-0 overflow-y-auto overflow-x-hidden p-3"
        >
          {selectedTranscriptIds.length >= 2 && (
            <div className={cn("mb-3 px-2 py-2", liveSemantic.transcriptQuestion)}>
              <p className={cn("text-[10px] font-medium", liveSemantic.labelDetected)}>
                {selectedTranscriptIds.length} segments selected
              </p>
              <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{combinedSelectionText}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <Button size="sm" className="h-7 text-xs" onClick={onAnalyzeCombined}>Analyze as one question</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onClearSelection}>Clear</Button>
              </div>
            </div>
          )}
          {editRetryDraft && (
            <div className="mb-3 space-y-2 rounded-md border border-border px-2 py-2">
              <Label className="text-[10px] text-muted-foreground">Edit query and retry (original segment unchanged)</Label>
              <Input value={editRetryDraft.text} onChange={(e) => onEditRetryChange(e.target.value)} className="h-8 text-xs" />
              <div className="flex gap-1">
                <Button size="sm" className="h-7 text-xs" onClick={onEditRetrySubmit}>Retry</Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onEditRetryCancel}>Cancel</Button>
              </div>
            </div>
          )}
          <p className="mb-2 text-[10px] text-muted-foreground">
            Click Find answer · Shift+click adjacent segments to combine
          </p>
          <ul className="space-y-2 text-sm">
            {displayUnits.map((unit) => {
              if (unit.type === "readback_group") {
                const head = unit.lines[0];
                return (
                  <li
                    key={unit.groupId}
                    className="rounded-md border border-border/40 bg-card/30 px-0.5"
                  >
                    <div className="flex items-center gap-2 px-1.5 pt-1 text-[10px] text-muted-foreground">
                      {formatLineTime(head.createdAt) && (
                        <span className="tabular-nums">{formatLineTime(head.createdAt)}</span>
                      )}
                      <span>reading answer · {unit.wordCount} words</span>
                    </div>
                    <TranscriptReadbackGroup
                      lines={unit.lines}
                      fullText={unit.fullText}
                      expanded={expandedKeys.has(unit.groupId)}
                      onToggleExpand={() => toggleExpanded(unit.groupId)}
                    />
                  </li>
                );
              }

              if (unit.type === "group") {
                const head = unit.lines[0];
                return (
                  <li
                    key={unit.groupId}
                    className="rounded-md border border-border/40 bg-card/30 px-0.5"
                  >
                    <div className="flex items-center gap-2 px-1.5 pt-1 text-[10px] text-muted-foreground">
                      {formatLineTime(head.createdAt) && (
                        <span className="tabular-nums">{formatLineTime(head.createdAt)}</span>
                      )}
                      <span>speech · {unit.wordCount} words</span>
                    </div>
                    <TranscriptSpeechGroup
                      lines={unit.lines}
                      fullText={unit.fullText}
                      wordCount={unit.wordCount}
                      expanded={expandedKeys.has(unit.groupId)}
                      onToggleExpand={() => toggleExpanded(unit.groupId)}
                      highlightQuestion={highlightQuestion}
                      selectedTranscriptIds={selectedTranscriptIds}
                      onToggleSelect={onToggleSelect}
                      onFindAnswer={onFindAnswer}
                      onExploreRelated={onExploreRelated}
                      onEditRetry={onEditRetry}
                    />
                  </li>
                );
              }

              const line = unit.line;
              return (
                <li key={line.id} className="rounded-md border border-border/40 bg-card/30 px-0.5">
                  <div className="flex items-center gap-2 px-1.5 pt-1 text-[10px] text-muted-foreground">
                    {formatLineTime(line.createdAt) && (
                      <span className="tabular-nums">{formatLineTime(line.createdAt)}</span>
                    )}
                    {!line.isFinal && <span className="text-sky-400/90">live</span>}
                    {line.kind === "readback" && <span>reading answer</span>}
                  </div>
                  <TranscriptLineItem
                    line={line}
                    selected={selectedTranscriptIds.includes(line.id)}
                    highlightQuestion={highlightQuestion}
                    expanded={expandedKeys.has(line.id)}
                    onToggleExpand={() => toggleExpanded(line.id)}
                    onFindAnswer={() => onFindAnswer(line)}
                    onToggleSelect={(shift) => onToggleSelect(line.id, shift)}
                    onExploreRelated={() => onExploreRelated(line.fullText ?? line.text)}
                    onEditRetry={() => onEditRetry(line)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        {showJumpLatest && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="pointer-events-auto h-8 gap-1 shadow-md"
              onClick={jumpToLatest}
            >
              <ArrowDown className="h-3.5 w-3.5" />
              Jump to latest
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildStoryMapIndex,
  intentLabel,
  preparedAnswerForProfile,
  storyMapIntentsInTopic,
  storyMapRowsForTopic,
  storyMapSearch,
  storyMapTopQuestions,
  type EnrichedQaRow,
  type InterviewProfileKey,
  type InterviewRound,
  type QuestionIntent,
  type StoryMapPath,
  type StoryMapRootId,
  type StoryMapTopicId,
} from "@interview-copilot/shared";
import { AnswerPreviewCard } from "@/components/live/answer-preview-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { liveSemantic } from "@/lib/live-semantic";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const TOP_AT_TOPIC = 5;

const INTENT_CHIP_ORDER: QuestionIntent[] = [
  "main_story",
  "problem_discovery",
  "personal_ownership",
  "tradeoffs",
  "solution_alternatives",
  "prioritization",
  "technical_implementation",
  "measurement_impact",
  "attribution",
  "challenges_lessons",
  "what_differently",
  "general",
];

function displayRow(row: EnrichedQaRow, profile: InterviewProfileKey): EnrichedQaRow {
  const spoken = row.navigator.spokenAnswer?.trim();
  const answer = spoken || preparedAnswerForProfile(row, profile);
  return { ...row, answer };
}

type Props = {
  catalog: EnrichedQaRow[];
  interviewProfile: InterviewProfileKey;
  highlightRound: InterviewRound | null;
  expanded: Record<string, boolean>;
  onToggleExpanded: (id: string) => void;
  onOpenInMainPanel: (row: EnrichedQaRow, opts?: { fromBrowse?: boolean }) => void;
  onPin: (row: EnrichedQaRow) => void;
  mainPanelPreparedId?: string | null;
};

export function StoryMapPanel({
  catalog,
  interviewProfile,
  highlightRound,
  expanded,
  onToggleExpanded,
  onOpenInMainPanel,
  onPin,
  mainPanelPreparedId = null,
}: Props) {
  const [path, setPath] = useState<StoryMapPath | null>(null);
  const [mapQuery, setMapQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTops = useRef<Map<string, number>>(new Map());

  const index = useMemo(
    () => buildStoryMapIndex(catalog, { profile: interviewProfile }),
    [catalog, interviewProfile]
  );

  useEffect(() => {
    setPath(null);
    setMapQuery("");
  }, [interviewProfile]);

  const rankOpts = { highlightRound };

  const searchHits = useMemo(() => {
    if (mapQuery.trim().length < 2) return [];
    return storyMapSearch(index, mapQuery, 24, rankOpts);
  }, [index, mapQuery, highlightRound]);

  const saveScroll = () => {
    const key = path?.topicId ? `${path.rootId}:${path.topicId}` : path?.rootId ?? "home";
    if (scrollRef.current) scrollTops.current.set(key, scrollRef.current.scrollTop);
  };

  const restoreScroll = (key: string) => {
    requestAnimationFrame(() => {
      const y = scrollTops.current.get(key);
      if (scrollRef.current && y != null) scrollRef.current.scrollTop = y;
    });
  };

  const goHome = () => {
    saveScroll();
    setPath(null);
    restoreScroll("home");
  };

  const goRoot = (rootId: StoryMapRootId) => {
    saveScroll();
    setPath({ rootId, intentFilter: "all" });
    restoreScroll(rootId);
  };

  const goTopic = (rootId: StoryMapRootId, topicId: StoryMapTopicId) => {
    saveScroll();
    setPath({ rootId, topicId, intentFilter: "all" });
    restoreScroll(`${rootId}:${topicId}`);
  };

  const breadcrumbs = () => {
    if (!path?.topicId) return null;
    const topic = index.topics.get(path.topicId);
    const root = index.roots.find((r) => r.id === path.rootId);
    if (!topic || !root) return null;
    return (
      <nav className="mb-2 flex flex-wrap items-center gap-0.5 text-[10px] text-muted-foreground">
        <button type="button" className="hover:text-foreground" onClick={goHome}>
          MAP
        </button>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <button
          type="button"
          className="hover:text-foreground"
          onClick={() => setPath({ rootId: path.rootId, intentFilter: "all" })}
        >
          {root.label}
        </button>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span className={cn("font-medium", liveSemantic.textAnswer)}>{topic.label}</span>
      </nav>
    );
  };

  const renderQuestionList = (rows: EnrichedQaRow[], keyPrefix: string) => (
    <ul className="space-y-1.5">
      {rows.map((row) => {
        const display = displayRow(row, interviewProfile);
        return (
          <li key={`${keyPrefix}-${row.id}`}>
            <AnswerPreviewCard
              source={display}
              catalog={catalog}
              semanticAccent="library"
              expanded={Boolean(expanded[row.id])}
              onToggle={() => onToggleExpanded(row.id)}
              onOpenMain={() => onOpenInMainPanel(row, { fromBrowse: true })}
              onPin={() => onPin(row)}
              showShortFirst
              showExpandChevron
              activeInMainPanel={mainPanelPreparedId === row.id}
            />
          </li>
        );
      })}
    </ul>
  );

  const activeTopicId = path?.topicId;
  const topicView = activeTopicId ? index.topics.get(activeTopicId) : null;
  const topicRows =
    topicView && activeTopicId
      ? storyMapRowsForTopic(index, activeTopicId, { ...rankOpts, intentFilter: path?.intentFilter ?? "all" })
      : [];
  const topAtTopic = activeTopicId ? storyMapTopQuestions(index, activeTopicId, TOP_AT_TOPIC, rankOpts) : [];
  const intentsInTopic = activeTopicId ? storyMapIntentsInTopic(index, activeTopicId) : [];

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <p className="mb-2 shrink-0 text-[10px] leading-snug text-muted-foreground">
        Browse only — does not change detection, asked tracking, or active experience.
      </p>
      <Input
        value={mapQuery}
        onChange={(e) => setMapQuery(e.target.value)}
        placeholder="Search map (RBC payout, Sperro, primary account…)"
        className="mb-2 h-8 shrink-0 text-xs"
      />

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
        {mapQuery.trim().length >= 2 && (
          <div className="space-y-1">
            <p className={cn("text-[10px] font-medium uppercase", liveSemantic.labelDetected)}>
              Search results ({searchHits.length})
            </p>
            {searchHits.length === 0 ? (
              <p className="text-xs text-muted-foreground">No matches for this profile.</p>
            ) : (
              renderQuestionList(searchHits, "search")
            )}
          </div>
        )}

        {mapQuery.trim().length < 2 && !path?.topicId && !path?.rootId && (
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {index.roots.map((root) => {
              const unique = new Set<string>();
              for (const tid of root.topicIds) {
                for (const r of index.rowsByTopic.get(tid) ?? []) unique.add(r.id);
              }
              return (
                <button
                  key={root.id}
                  type="button"
                  className="rounded-md border border-border/70 bg-muted/10 px-2 py-2 text-left hover:border-primary/40 hover:bg-muted/20"
                  onClick={() => goRoot(root.id)}
                >
                  <p className="text-[11px] font-medium leading-tight">{root.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {root.topicIds.length} topics · {unique.size} answers
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {mapQuery.trim().length < 2 && path?.rootId && !path.topicId && (
          <>
            <button type="button" className="text-[10px] text-primary hover:underline" onClick={goHome}>
              ← MAP home
            </button>
            <p className="text-xs font-medium">{index.roots.find((r) => r.id === path.rootId)?.label}</p>
            <div className="grid grid-cols-1 gap-1.5">
              {index.roots
                .find((r) => r.id === path.rootId)
                ?.topicIds.map((tid) => {
                  const topic = index.topics.get(tid);
                  const n = index.rowsByTopic.get(tid)?.length ?? 0;
                  if (!topic) return null;
                  return (
                    <button
                      key={tid}
                      type="button"
                      className="rounded-md border border-border/60 px-2 py-2 text-left hover:border-primary/40"
                      onClick={() => goTopic(path.rootId, tid)}
                    >
                      <p className="text-[11px] font-medium">{topic.label}</p>
                      <p className="text-[10px] text-muted-foreground">{n} prepared</p>
                    </button>
                  );
                })}
            </div>
          </>
        )}

        {mapQuery.trim().length < 2 && path?.topicId && topicView && path && (
          <>
            {breadcrumbs()}
            {topAtTopic.length > 0 && (
              <div>
                <p className={cn("mb-1 text-[10px] font-medium uppercase", liveSemantic.labelSuggested)}>
                  Key questions
                </p>
                {renderQuestionList(topAtTopic, "top")}
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              <Button
                type="button"
                size="sm"
                variant={path.intentFilter === "all" || !path.intentFilter ? "secondary" : "outline"}
                className="h-6 px-2 text-[9px]"
                onClick={() => setPath({ ...path, intentFilter: "all" })}
              >
                All
              </Button>
              {INTENT_CHIP_ORDER.filter((i) => intentsInTopic.includes(i)).map((intent) => (
                <Button
                  key={intent}
                  type="button"
                  size="sm"
                  variant={path.intentFilter === intent ? "secondary" : "outline"}
                  className="h-6 px-2 text-[9px]"
                  onClick={() => setPath({ ...path, intentFilter: intent })}
                >
                  {intentLabel(intent)}
                </Button>
              ))}
            </div>

            {topicRows.length === 0 ? (
              <p className="text-xs text-muted-foreground">No questions in this filter.</p>
            ) : path.intentFilter && path.intentFilter !== "all" ? (
              renderQuestionList(topicRows, "filtered")
            ) : (
              INTENT_CHIP_ORDER.filter((i) => intentsInTopic.includes(i)).map((intent) => {
                const group = topicRows.filter((r) => r.navigator.intent === intent);
                if (group.length === 0) return null;
                return (
                  <details key={intent} className="rounded-md border border-border/50" open={group.length <= 4}>
                    <summary className="cursor-pointer px-2 py-1.5 text-[10px] font-medium">
                      {intentLabel(intent)} ({group.length})
                    </summary>
                    <div className="border-t border-border/40 p-1">{renderQuestionList(group, intent)}</div>
                  </details>
                );
              })
            )}
          </>
        )}
      </div>
    </section>
  );
}

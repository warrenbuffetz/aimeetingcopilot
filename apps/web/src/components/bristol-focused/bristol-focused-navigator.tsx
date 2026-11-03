"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronRight, Clock, Search, Star } from "lucide-react";
import { PanelResizeHandle } from "@/components/live/panel-resize-handle";
import { Button } from "@/components/ui/button";
import { clamp, useHorizontalResize } from "@/hooks/use-horizontal-resize";
import { usePersistedNumber } from "@/hooks/use-persisted-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";
import {
  BRISTOL_CATEGORIES,
  BRISTOL_EXPERIENCES,
  bristolAskQuestions,
  bristolBattlecard,
  bristolCategoryLabel,
  bristolPinnedQuestions,
  bristolQuestions,
  type BristolQuestion,
} from "@/lib/bristol-focused/dataset";
import { BristolBattlecardPanel } from "@/components/bristol-focused/bristol-battlecard-panel";
import { BristolIndustryReferencePanel, BristolScenarioPanel } from "@/components/bristol-focused/bristol-scenario-panel";
import {
  applyBristolEdits,
  loadBristolEdits,
  questionHasEdits,
  saveBristolEdits,
  type BristolContentEdits,
} from "@/lib/bristol-focused/edits";
import {
  BRISTOL_FOCUSED_PROFILE_ID,
  BRISTOL_FOCUSED_PROFILE_NAME,
  isBristolFocusedProfileName,
} from "@/lib/bristol-focused/profile";
import { relatedQuestions } from "@/lib/bristol-focused/related";
import { searchAsksForBristol, searchBristolQuestions, type BristolSearchHit } from "@/lib/bristol-focused/search";
import { mapIdsForQuestionId } from "@/lib/bristol-focused/map-links";
import { bristolStoryById, bristolStoryMaps } from "@/lib/bristol-focused/story-maps";
import { BristolStoryMapDetail } from "@/components/bristol-focused/bristol-story-map-detail";
import { BristolStoryMapSidebar } from "@/components/bristol-focused/bristol-story-map-sidebar";
import { cn } from "@/lib/utils";

const LIGHT_SURFACE = {
  colorScheme: "light",
  "--background": "oklch(1 0 0)",
  "--foreground": "oklch(0.145 0 0)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.145 0 0)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0.145 0 0)",
  "--primary": "oklch(0.205 0 0)",
  "--primary-foreground": "oklch(0.985 0 0)",
  "--secondary": "oklch(0.97 0 0)",
  "--secondary-foreground": "oklch(0.205 0 0)",
  "--muted": "oklch(0.97 0 0)",
  "--muted-foreground": "oklch(0.45 0 0)",
  "--accent": "oklch(0.97 0 0)",
  "--accent-foreground": "oklch(0.205 0 0)",
  "--border": "oklch(0.922 0 0)",
  "--input": "oklch(0.922 0 0)",
  "--ring": "oklch(0.708 0 0)",
} as React.CSSProperties;

const TOPICS_WIDTH_KEY = "ic-bristol-focused-topics-width";
const TOPICS_DEFAULT = 340;
const TOPICS_MIN = 260;
const ANSWER_MIN = 360;
const RAIL_WIDTH = 224;

const ACTIVE_KEY = "ic-bristol-focused-active";
const FOLLOW_KEY = "ic-bristol-focused-follow";
const RECENT_KEY = "ic-bristol-focused-recent";
const EXPANDED_KEY = "ic-bristol-focused-expanded";
const GROUP_KEY = "ic-bristol-focused-groups";
const NAV_MODE_KEY = "ic-bristol-focused-nav-mode";
const SEARCH_KEY = "ic-bristol-focused-search";
const VIEW_MODE_KEY = "ic-bristol-focused-view-mode";
const MAP_ID_KEY = "ic-bristol-focused-map-id";
const MAP_SEARCH_KEY = "ic-bristol-focused-map-search";
const MAP_FROM_ANSWER_KEY = "ic-bristol-focused-map-from-answer";

type NavMode = "topics" | "experiences";
type Screen = "answer" | "ask";
type Pane = "nav" | "answer";
type ViewMode = "answers" | "maps" | "battlecard";

function readList(key: string): string[] {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function AnswerParagraphs({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/);
  return (
    <div className="space-y-4 text-[15.5px] leading-7 text-foreground">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="whitespace-pre-wrap">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function BristolFocusedNavigator() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const answerScrolls = useRef<Record<string, number>>({});
  const previousQuestionId = useRef<string | null>(null);

  const [edits, setEdits] = useState<BristolContentEdits>({ answers: {}, followUps: {} });
  const [ready, setReady] = useState(false);
  const [activeId, setActiveId] = useState(bristolPinnedQuestions[0]?.id ?? bristolQuestions[0]!.id);
  const [followId, setFollowId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [navMode, setNavMode] = useState<NavMode>("topics");
  const [screen, setScreen] = useState<Screen>("answer");
  const [pane, setPane] = useState<Pane>("nav");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [recentOpen, setRecentOpen] = useState(false);
  const [prep, setPrep] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("answers");
  const [selectedMapId, setSelectedMapId] = useState(bristolStoryMaps[0]?.id ?? "rbc-payouts");
  const [mapQuery, setMapQuery] = useState("");
  const [mapFromAnswer, setMapFromAnswer] = useState(false);
  const [showRail, setShowRail] = useState(false);
  const [splitLayout, setSplitLayout] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [preferredTopicsWidth, setPreferredTopicsWidth] = usePersistedNumber(TOPICS_WIDTH_KEY, TOPICS_DEFAULT);
  const [otherProfiles, setOtherProfiles] = useState<{ id: string; name: string }[]>([]);
  const topicsWidth =
    containerWidth > 0
      ? clamp(preferredTopicsWidth, TOPICS_MIN, Math.max(TOPICS_MIN, containerWidth - ANSWER_MIN))
      : preferredTopicsWidth;

  const maxTopicsWidth = useCallback(() => {
    const width = rootRef.current?.clientWidth ?? 0;
    if (width <= 0) return 520;
    return Math.max(TOPICS_MIN, width - ANSWER_MIN);
  }, []);

  const topicsResize = useHorizontalResize((dx) => {
    setPreferredTopicsWidth((width) => clamp(width + dx, TOPICS_MIN, maxTopicsWidth()));
  });

  const questions = useMemo(() => applyBristolEdits(bristolQuestions, edits), [edits]);
  const active = questions.find((question) => question.id === activeId) ?? questions[0]!;
  const baseActive = bristolQuestions.find((question) => question.id === active.id) ?? active;
  const edited = questionHasEdits(baseActive, edits);
  const hits = useMemo(() => searchBristolQuestions(questions, query), [questions, query]);
  const askHit = searchAsksForBristol(query);
  const resultCount = hits.length + (askHit ? 1 : 0);
  const related = useMemo(() => relatedQuestions(active, questions), [active, questions]);
  const linkedMapStories = useMemo(
    () =>
      mapIdsForQuestionId(active.id)
        .map((id) => bristolStoryById(id))
        .filter((story): story is NonNullable<ReturnType<typeof bristolStoryById>> => Boolean(story)),
    [active.id]
  );
  const selectedStory = bristolStoryById(selectedMapId) ?? bristolStoryMaps[0]!;
  const recentQuestions = recent
    .map((id) => questions.find((question) => question.id === id))
    .filter((question): question is BristolQuestion => Boolean(question))
    .slice(0, 8);

  useEffect(() => {
    setEdits(loadBristolEdits());
    const savedActive = sessionStorage.getItem(ACTIVE_KEY);
    const savedFollow = sessionStorage.getItem(FOLLOW_KEY);
    const savedRecent = readList(RECENT_KEY);
    const savedTopics = readList(EXPANDED_KEY);
    const savedGroups = readList(GROUP_KEY);
    const savedMode = sessionStorage.getItem(NAV_MODE_KEY);
    const savedQuery = sessionStorage.getItem(SEARCH_KEY) ?? "";
    const savedViewMode = sessionStorage.getItem(VIEW_MODE_KEY);
    const savedMapId = sessionStorage.getItem(MAP_ID_KEY);
    const savedMapQuery = sessionStorage.getItem(MAP_SEARCH_KEY) ?? "";
    const savedMapFromAnswer = sessionStorage.getItem(MAP_FROM_ANSWER_KEY) === "1";
    const initialId =
      savedActive && bristolQuestions.some((question) => question.id === savedActive)
        ? savedActive
        : bristolPinnedQuestions[0]?.id ?? bristolQuestions[0]!.id;
    const initialQuestion = bristolQuestions.find((question) => question.id === initialId) ?? bristolQuestions[0]!;
    setActiveId(initialId);
    if (savedFollow && initialQuestion.followUps.some((follow) => follow.id === savedFollow)) setFollowId(savedFollow);
    setRecent(savedRecent);
    setExpandedTopics(savedTopics.length ? savedTopics : [initialQuestion.category]);
    setExpandedGroups(savedGroups);
    if (savedMode === "experiences" || savedMode === "topics") setNavMode(savedMode);
    setQuery(savedQuery);
    if (savedViewMode === "maps" || savedViewMode === "answers") setViewMode(savedViewMode);
    if (savedMapId && bristolStoryMaps.some((story) => story.id === savedMapId)) setSelectedMapId(savedMapId);
    setMapQuery(savedMapQuery);
    setMapFromAnswer(savedMapFromAnswer);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem(ACTIVE_KEY, activeId);
    sessionStorage.setItem(FOLLOW_KEY, followId ?? "");
    sessionStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    sessionStorage.setItem(EXPANDED_KEY, JSON.stringify(expandedTopics));
    sessionStorage.setItem(GROUP_KEY, JSON.stringify(expandedGroups));
    sessionStorage.setItem(NAV_MODE_KEY, navMode);
    sessionStorage.setItem(SEARCH_KEY, query);
    sessionStorage.setItem(VIEW_MODE_KEY, viewMode);
    sessionStorage.setItem(MAP_ID_KEY, selectedMapId);
    sessionStorage.setItem(MAP_SEARCH_KEY, mapQuery);
    sessionStorage.setItem(MAP_FROM_ANSWER_KEY, mapFromAnswer ? "1" : "0");
  }, [ready, activeId, followId, recent, expandedTopics, expandedGroups, navMode, query, viewMode, selectedMapId, mapQuery, mapFromAnswer]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let cancelled = false;
    void (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("interview_profiles").select("id, name");
        if (cancelled) return;
        setOtherProfiles(
          (data ?? []).filter(
            (profile) =>
              !isBristolFocusedProfileName(profile.name) &&
              !(/questrade/i.test(profile.name) && /\bjaz\b/i.test(profile.name))
          )
        );
      } catch {
        if (!cancelled) setOtherProfiles([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const apply = () => setSplitLayout(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => setContainerWidth(root.clientWidth);
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setShowRail(viewMode === "answers" && splitLayout && containerWidth - topicsWidth - RAIL_WIDTH >= 520);
  }, [containerWidth, splitLayout, topicsWidth, viewMode]);

  useEffect(() => {
    const pane = answerRef.current;
    if (!pane) return;
    if (previousQuestionId.current !== activeId) {
      pane.scrollTop = answerScrolls.current[activeId] ?? 0;
      previousQuestionId.current = activeId;
    }
  }, [activeId, screen]);

  useEffect(() => {
    if (!followId) return;
    document.getElementById(`bristol-follow-${followId}`)?.scrollIntoView({ block: "nearest" });
  }, [followId, activeId]);

  const remember = useCallback((id: string) => {
    setRecent((current) => [id, ...current.filter((item) => item !== id)].slice(0, 12));
  }, []);

  const openExperienceMap = useCallback((mapId: string, fromAnswer = false) => {
    setSelectedMapId(mapId);
    setViewMode("maps");
    setMapFromAnswer(fromAnswer);
    setPane("answer");
  }, []);

  const returnToAnswersFromMap = useCallback(() => {
    setViewMode("answers");
    setMapFromAnswer(false);
    setPane("answer");
    requestAnimationFrame(() => {
      const pane = answerRef.current;
      if (!pane) return;
      pane.scrollTop = answerScrolls.current[activeId] ?? 0;
      if (followId) document.getElementById(`bristol-follow-${followId}`)?.scrollIntoView({ block: "nearest" });
    });
  }, [activeId, followId]);

  const openQuestion = useCallback(
    (questionId: string, nextFollowId: string | null) => {
      setHistory((current) => (activeId && activeId !== questionId ? [...current, activeId].slice(-20) : current));
      setActiveId(questionId);
      setFollowId(nextFollowId);
      setScreen("answer");
      setPane("answer");
      setSearchOpen(false);
      setRecentOpen(false);
      const question = questions.find((item) => item.id === questionId);
      if (question) {
        setExpandedTopics((current) => (current.includes(question.category) ? current : [...current, question.category]));
      }
      remember(questionId);
    },
    [activeId, questions, remember]
  );

  const openHit = useCallback(
    (hit: BristolSearchHit) => {
      openQuestion(hit.questionId, hit.followUpId);
      setQuery("");
    },
    [openQuestion]
  );

  const focusSearch = useCallback(() => {
    const field = [desktopSearchRef.current, mobileSearchRef.current].find((node) => node && node.offsetParent !== null);
    field?.focus();
    setSearchOpen(true);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = Boolean(target?.closest("input, textarea, [contenteditable='true']"));
      const inSearch = target === desktopSearchRef.current || target === mobileSearchRef.current;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        focusSearch();
        return;
      }
      if (event.key === "/" && !typing) {
        event.preventDefault();
        focusSearch();
        return;
      }
      if (!inSearch) return;
      if (event.key === "Escape") {
        event.preventDefault();
        if (query) setQuery("");
        else {
          setSearchOpen(false);
          (target as HTMLInputElement).blur();
        }
        return;
      }
      if (!searchOpen || resultCount === 0) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlight((index) => (index + 1) % resultCount);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlight((index) => (index - 1 + resultCount) % resultCount);
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (askHit && highlight === 0) {
          setScreen("ask");
          setPane("answer");
          setSearchOpen(false);
          setQuery("");
          return;
        }
        const hit = hits[askHit ? highlight - 1 : highlight];
        if (hit) openHit(hit);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [askHit, focusSearch, highlight, hits, openHit, query, resultCount, searchOpen]);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  function updateAnswer(value: string) {
    setEdits((current) => {
      const answers = { ...current.answers };
      if (value === baseActive.answer) delete answers[active.id];
      else answers[active.id] = value;
      const next = { ...current, answers };
      saveBristolEdits(next);
      return next;
    });
  }

  function updateFollow(followUpId: string, field: "question" | "answer", value: string, original: string) {
    setEdits((current) => {
      const followUps = { ...current.followUps };
      const existing = { ...(followUps[followUpId] ?? {}) };
      if (value === original) delete existing[field];
      else existing[field] = value;
      if (existing.question == null && existing.answer == null) delete followUps[followUpId];
      else followUps[followUpId] = existing;
      const next = { ...current, followUps };
      saveBristolEdits(next);
      return next;
    });
  }

  function resetQuestionEdits() {
    setEdits((current) => {
      const answers = { ...current.answers };
      delete answers[active.id];
      const followUps = { ...current.followUps };
      for (const follow of baseActive.followUps) delete followUps[follow.id];
      const next = { answers, followUps };
      saveBristolEdits(next);
      return next;
    });
  }

  function leaveProfile(profileId: string) {
    if (profileId === "all") router.push("/live");
    else router.push(`/live?profile=${encodeURIComponent(profileId)}`);
  }

  const searchField = (ref: { current: HTMLInputElement | null }, id: string) => (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={(node) => {
          ref.current = node;
        }}
        id={id}
        data-testid={id}
        value={query}
        placeholder="Search keywords, aliases, follow-ups"
        role="combobox"
        aria-label="Search prepared answers"
        aria-autocomplete="list"
        aria-expanded={searchOpen && resultCount > 0}
        aria-controls={`${id}-results`}
        autoComplete="off"
        className="h-9 w-full rounded-lg border border-border bg-background pr-14 pl-8 text-sm outline-none focus-visible:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-200"
        onChange={(event) => {
          setQuery(event.target.value);
          setSearchOpen(true);
        }}
        onFocus={() => setSearchOpen(true)}
        onBlur={() => setSearchOpen(false)}
      />
      <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border px-1 text-[10px] text-muted-foreground">
        /
      </kbd>
      {searchOpen && query.trim().length >= 2 && (
        <div
          id={`${id}-results`}
          role="listbox"
          className="absolute z-30 mt-1 max-h-80 w-full overflow-auto rounded-lg border border-border bg-popover p-1 shadow-md"
        >
          {askHit && (
            <button
              type="button"
              role="option"
              aria-selected={highlight === 0}
              className={cn(
                "flex w-full flex-col rounded-md px-2 py-2 text-left",
                highlight === 0 ? "bg-amber-100 text-amber-950" : "hover:bg-muted"
              )}
              onMouseEnter={() => setHighlight(0)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setScreen("ask");
                setPane("answer");
                setSearchOpen(false);
                setQuery("");
              }}
            >
              <span className="text-sm font-medium">Questions for Bristol</span>
              <span className="text-xs text-muted-foreground">{bristolAskQuestions.length} questions to ask</span>
            </button>
          )}
          {hits.map((hit, index) => {
            const optionIndex = askHit ? index + 1 : index;
            return (
              <button
                key={`${hit.questionId}-${hit.followUpId ?? "q"}`}
                type="button"
                role="option"
                aria-selected={highlight === optionIndex}
                className={cn(
                  "flex w-full flex-col rounded-md px-2 py-2 text-left",
                  highlight === optionIndex ? "bg-amber-100 text-amber-950" : "hover:bg-muted"
                )}
                onMouseEnter={() => setHighlight(optionIndex)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => openHit(hit)}
              >
                <span className="text-sm font-medium">{hit.label}</span>
                <span className="text-xs text-muted-foreground">
                  {hit.kind === "follow-up" ? `Follow-up · ${hit.detail}` : hit.detail}
                </span>
              </button>
            );
          })}
          {!askHit && hits.length === 0 && (
            <p className="px-2 py-3 text-sm text-muted-foreground">No prepared match. Try a shorter keyword.</p>
          )}
        </div>
      )}
    </div>
  );

  function navButton(question: BristolQuestion, dense = false) {
    const selected = screen === "answer" && question.id === active.id;
    return (
      <button
        key={question.id}
        type="button"
        title={question.navigationLabel}
        aria-current={selected ? "true" : undefined}
        className={cn(
          "flex w-full items-start gap-2 rounded-md px-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300",
          dense ? "min-h-8 py-1" : "min-h-9 py-1.5",
          selected ? "bg-amber-100 font-medium text-amber-950" : "hover:bg-white/80"
        )}
        onClick={() => openQuestion(question.id, null)}
      >
        {!dense && (
          <span className="mt-0.5 w-6 shrink-0 text-[10px] font-semibold text-amber-700">
            {question.priority === 0 ? "P0" : question.priority === 1 ? "P1" : "P2"}
          </span>
        )}
        <span className="text-[13px] leading-5">{question.shortLabel}</span>
      </button>
    );
  }

  const nav = (
    <div className="flex h-full min-h-0 flex-col bg-[#f6f4fb] text-neutral-900">
      <div className="hidden shrink-0 border-b border-amber-100 p-3 md:block">{searchField(desktopSearchRef, "bristol-search-desktop")}</div>
      <div className="min-h-0 flex-1 overflow-auto px-2 py-2">
        <p className="px-2 pt-1 pb-1 text-[11px] font-semibold tracking-wide text-amber-800 uppercase">Interview map</p>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/80"
          onClick={() => document.getElementById("bristol-pinned")?.scrollIntoView({ block: "nearest" })}
        >
          <Star className="h-3.5 w-3.5 text-amber-700" />
          Pinned ({bristolPinnedQuestions.length})
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/80"
          onClick={() => setRecentOpen((open) => !open)}
        >
          <Clock className="h-3.5 w-3.5 text-amber-700" />
          Recently viewed
        </button>
        {recentOpen && (
          <div className="mb-1 ml-2">
            {recentQuestions.length === 0 && <p className="px-2 py-1 text-xs text-muted-foreground">Nothing yet.</p>}
            {recentQuestions.map((question) => navButton(question, true))}
          </div>
        )}
        <div id="bristol-pinned" className="mt-2 mb-3">
          <p className="px-2 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Most likely</p>
          {bristolPinnedQuestions.map((question) => navButton(questions.find((item) => item.id === question.id) ?? question, true))}
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-1 px-1">
          <button
            type="button"
            className={cn(
              "rounded-md px-2 py-1 text-xs",
              navMode === "topics" ? "bg-amber-200 font-medium text-amber-950" : "text-muted-foreground hover:bg-white"
            )}
            onClick={() => setNavMode("topics")}
          >
            Topics
          </button>
          <button
            type="button"
            className={cn(
              "rounded-md px-2 py-1 text-xs",
              navMode === "experiences" ? "bg-amber-200 font-medium text-amber-950" : "text-muted-foreground hover:bg-white"
            )}
            onClick={() => setNavMode("experiences")}
          >
            Experiences
          </button>
          <span className="ml-auto flex shrink-0 gap-0.5">
            <button
              type="button"
              className="rounded px-1.5 py-0.5 text-[10px] font-medium text-amber-900 hover:bg-amber-100"
              onClick={() =>
                navMode === "topics"
                  ? setExpandedTopics(BRISTOL_CATEGORIES.map((c) => c.id))
                  : setExpandedGroups(BRISTOL_EXPERIENCES.map((e) => e.id))
              }
            >
              Expand all
            </button>
            <span className="text-[10px] text-muted-foreground" aria-hidden>
              ·
            </span>
            <button
              type="button"
              className="rounded px-1.5 py-0.5 text-[10px] font-medium text-amber-900 hover:bg-amber-100"
              onClick={() => (navMode === "topics" ? setExpandedTopics([]) : setExpandedGroups([]))}
            >
              Collapse all
            </button>
          </span>
        </div>

        {navMode === "topics"
          ? BRISTOL_CATEGORIES.map((category) => {
              const items = questions.filter((question) => question.category === category.id);
              const open = expandedTopics.includes(category.id);
              return (
                <div key={category.id} className="mb-1">
                  <button
                    type="button"
                    className="flex min-h-9 w-full items-center gap-1 rounded-md px-1.5 text-left text-[13px] font-medium hover:bg-white/80"
                    aria-expanded={open}
                    onClick={() =>
                      setExpandedTopics((current) =>
                        current.includes(category.id) ? current.filter((id) => id !== category.id) : [...current, category.id]
                      )
                    }
                  >
                    {open ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                    <span className="flex-1">{category.label}</span>
                    <span className="text-[11px] text-muted-foreground">{items.length}</span>
                  </button>
                  {open && <div className="ml-3">{items.map((question) => navButton(question))}</div>}
                </div>
              );
            })
          : BRISTOL_EXPERIENCES.map((experience) => {
              const items = questions.filter((question) => experience.test(question.projectTags));
              const open = expandedGroups.includes(experience.id);
              return (
                <div key={experience.id} className="mb-1">
                  <button
                    type="button"
                    className="flex min-h-9 w-full items-center gap-1 rounded-md px-1.5 text-left text-[13px] font-medium hover:bg-white/80"
                    aria-expanded={open}
                    onClick={() =>
                      setExpandedGroups((current) =>
                        current.includes(experience.id) ? current.filter((id) => id !== experience.id) : [...current, experience.id]
                      )
                    }
                  >
                    {open ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                    <span className="flex-1">{experience.label}</span>
                    <span className="text-[11px] text-muted-foreground">{items.length}</span>
                  </button>
                  {open && <div className="ml-3">{items.map((question) => navButton(question))}</div>}
                </div>
              );
            })}
      </div>
      <div className="shrink-0 border-t border-amber-100 p-2">
        <button
          type="button"
          className={cn(
            "flex min-h-10 w-full items-center rounded-md px-2 text-left text-sm font-medium",
            screen === "ask" ? "bg-amber-200 text-amber-950" : "hover:bg-white"
          )}
          onClick={() => {
            setScreen("ask");
            setPane("answer");
            setSearchOpen(false);
          }}
        >
          Questions for Bristol ({bristolAskQuestions.length})
        </button>
      </div>
    </div>
  );

  const showPrepNotes =
    Boolean(baseActive.accuracyNote.trim()) ||
    (baseActive.evidenceStatus &&
      baseActive.evidenceStatus !== "grounded" &&
      baseActive.evidenceStatus !== "requires_personal_review");

  const answer = (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-white text-neutral-950">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2 md:hidden">
        <Button type="button" variant="outline" size="sm" onClick={() => setPane("nav")}>
          <ArrowLeft className="h-3.5 w-3.5" />
          Topics
        </Button>
        <span className="truncate text-xs text-muted-foreground">{active.shortLabel}</span>
      </div>
      <div
        ref={answerRef}
        className="min-h-0 flex-1 overflow-auto"
        onScroll={(event) => {
          if (screen === "answer") answerScrolls.current[activeId] = event.currentTarget.scrollTop;
        }}
      >
        {screen === "ask" ? (
          <div className="w-full max-w-3xl px-5 py-6 md:px-8">
            <p className="text-xs font-medium tracking-wide text-amber-700 uppercase">Closing questions</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Questions for Bristol</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask these in her words. This list has no scripted answer.
            </p>
            {(
              [
                { tier: "primary" as const, title: "Top priorities" },
                { tier: "backup" as const, title: "If time allows" },
                { tier: "additional" as const, title: "More questions" },
              ] as const
            ).map((section) => {
              const items = bristolAskQuestions.filter((item) => item.tier === section.tier);
              if (!items.length) return null;
              const primaryCount = bristolAskQuestions.filter((q) => q.tier === "primary").length;
              const backupCount = bristolAskQuestions.filter((q) => q.tier === "backup").length;
              const listStart =
                section.tier === "primary" ? 1 : section.tier === "backup" ? primaryCount + 1 : primaryCount + backupCount + 1;
              return (
                <div key={section.tier} className={cn("mt-6", section.tier !== "primary" && "mt-8 border-t border-border pt-6")}>
                  <h2 className="text-sm font-semibold text-neutral-900">{section.title}</h2>
                  {section.tier === "primary" && (
                    <p className="mt-1 text-xs text-muted-foreground">Start here. Follow-ups are optional—expand when you need them.</p>
                  )}
                  <ol className="mt-4 space-y-4" start={listStart}>
                    {items.map((item, itemIndex) => {
                      const displayIndex = listStart + itemIndex;
                      const isPrimary = item.tier === "primary";
                      return (
                        <li
                          key={item.id}
                          className={cn(
                            "rounded-lg border px-4 py-3",
                            isPrimary ? "border-amber-200 bg-amber-50/60" : "border-border bg-card"
                          )}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <p
                              className={cn(
                                "text-xs font-semibold tracking-wide uppercase",
                                isPrimary ? "text-amber-800" : "text-amber-700"
                              )}
                            >
                              {displayIndex}. {item.topic}
                            </p>
                            {item.badge && (
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                  isPrimary ? "bg-amber-200 text-amber-950" : "bg-muted text-muted-foreground"
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className={cn("mt-2 leading-7", isPrimary ? "text-[17px] font-medium text-neutral-950" : "text-[16px]")}>
                            {item.question}
                          </p>
                          {item.note && <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p>}
                          {item.followUps.length > 0 && (
                            <details className="group mt-3 rounded-md border border-amber-100/80 bg-white/80">
                              <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-amber-900 marker:content-none [&::-webkit-details-marker]:hidden">
                                <span className="inline-flex items-center gap-1.5">
                                  Follow-ups ({item.followUps.length})
                                  <span className="text-xs font-normal text-muted-foreground group-open:hidden">— tap to expand</span>
                                </span>
                              </summary>
                              <div className="space-y-3 border-t border-amber-100 px-3 py-3">
                                {item.followUps.map((follow) => (
                                  <div key={follow.id} className="rounded-md bg-muted/40 px-3 py-2">
                                    {follow.cue && (
                                      <p className="text-[11px] font-semibold tracking-wide text-amber-800 uppercase">{follow.cue}</p>
                                    )}
                                    <p className="mt-1 text-[15px] leading-7 text-neutral-900">{follow.question}</p>
                                    {follow.note && <p className="mt-1 text-sm leading-6 text-muted-foreground">{follow.note}</p>}
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full max-w-3xl px-5 py-5 md:px-8 md:py-6">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {history.length > 0 && (
                <button type="button" className="font-medium text-amber-800 hover:underline" onClick={() => {
                  const previous = history[history.length - 1];
                  if (!previous) return;
                  setHistory((current) => current.slice(0, -1));
                  setActiveId(previous);
                  setFollowId(null);
                  setScreen("answer");
                }}>
                  Back
                </button>
              )}
              <span>{bristolCategoryLabel(active.category)}</span>
              <span aria-hidden>·</span>
              <span>{active.shortLabel}</span>
            </div>
            <div className="flex items-start gap-2">
              <h1 data-testid="bristol-answer-title" className="text-2xl font-semibold tracking-tight text-balance">
                {active.title}
              </h1>
              {active.suggestedPinned && <Star className="mt-1.5 h-4 w-4 shrink-0 fill-amber-500 text-amber-600" aria-label="Pinned" />}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                {active.priority === 0 ? "P0" : active.priority === 1 ? "P1" : "P2"}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{bristolCategoryLabel(active.category)}</span>
              {active.projectTags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px]">
                  {tag}
                </span>
              ))}
              {edited && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-950">Edited in this profile</span>}
              {baseActive.evidenceStatus === "requires_personal_review" && (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-950">
                  Personal review
                </span>
              )}
            </div>

            {linkedMapStories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {linkedMapStories.map((story) => (
                  <button
                    key={story.id}
                    type="button"
                    className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-left text-xs font-medium text-amber-950 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                    onClick={() => openExperienceMap(story.id, true)}
                  >
                    View experience map · {story.title}
                  </button>
                ))}
              </div>
            )}

            {prep ? (
              <div className="mt-4 space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-semibold tracking-wide text-amber-950 uppercase">Prep only — not spoken script</p>
                <p className="text-sm text-amber-950">
                  Evidence: {baseActive.evidenceStatus || "unspecified"}. Edits stay in this browser and are not synced to other profiles.
                </p>
                {baseActive.accuracyNote.trim() && <p className="text-sm leading-6 text-amber-950">{baseActive.accuracyNote}</p>}
                <Textarea
                  aria-label="Edit prepared answer"
                  value={active.answer}
                  onChange={(event) => updateAnswer(event.target.value)}
                  className="min-h-64 bg-background text-[15px] leading-7"
                />
                {edited && (
                  <Button type="button" variant="outline" size="sm" onClick={resetQuestionEdits}>
                    Reset to curated answer
                  </Button>
                )}
              </div>
            ) : (
              <>
                {showPrepNotes && (
                  <details className="mt-4 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
                    <summary className="cursor-pointer text-xs font-medium text-muted-foreground">Prep notes</summary>
                    <p className="mt-2 text-xs text-muted-foreground">Not part of the spoken answer.</p>
                    <p className="mt-1">Evidence: {baseActive.evidenceStatus || "unspecified"}.</p>
                    {baseActive.accuracyNote.trim() && <p className="mt-1 leading-6">{baseActive.accuracyNote}</p>}
                  </details>
                )}
                <div data-testid="bristol-answer" className="mt-5">
                  {active.recordType === "scenario" ? (
                    <BristolScenarioPanel question={active} />
                  ) : active.recordType === "industry_reference" ? (
                    <BristolIndustryReferencePanel question={active} />
                  ) : (
                    <AnswerParagraphs text={active.answer} />
                  )}
                </div>
              </>
            )}

            {active.followUps.length > 0 && (
              <section className="mt-8 rounded-lg border border-amber-100 bg-amber-50/70 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-amber-950">Likely follow-ups ({active.followUps.length})</h2>
                  {followId && (
                    <button
                      type="button"
                      className="text-xs font-medium text-amber-800 hover:underline"
                      onClick={() => {
                        setFollowId(null);
                        answerRef.current?.scrollTo({ top: 0 });
                      }}
                    >
                      Back to primary answer
                    </button>
                  )}
                </div>
                <ul className="space-y-1">
                  {active.followUps.map((follow) => {
                    const open = followId === follow.id;
                    const original = baseActive.followUps.find((item) => item.id === follow.id) ?? follow;
                    return (
                      <li key={follow.id} id={`bristol-follow-${follow.id}`} className="rounded-md bg-background/80">
                        <button
                          type="button"
                          aria-expanded={open}
                          className="flex min-h-10 w-full items-start gap-2 px-2 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                          onClick={() => setFollowId(open ? null : follow.id)}
                        >
                          {open ? <ChevronDown className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                          <span>{follow.question}</span>
                        </button>
                        {open && (
                          <div className="px-8 pb-3">
                            {prep ? (
                              <div className="space-y-2">
                                <Textarea
                                  aria-label="Edit follow-up question"
                                  value={follow.question}
                                  onChange={(event) => updateFollow(follow.id, "question", event.target.value, original.question)}
                                  className="min-h-16 bg-background text-sm"
                                />
                                <Textarea
                                  aria-label="Edit follow-up answer"
                                  value={follow.answer}
                                  onChange={(event) => updateFollow(follow.id, "answer", event.target.value, original.answer)}
                                  className="min-h-28 bg-background text-sm leading-6"
                                />
                              </div>
                            ) : (
                              <AnswerParagraphs text={follow.answer} />
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {related.length > 0 && (
              <details className="mt-4 rounded-lg border border-border px-3 py-2">
                <summary className="cursor-pointer text-sm font-medium">Related questions ({related.length})</summary>
                <ul className="mt-2 space-y-1">
                  {related.map((question) => (
                    <li key={question.id}>
                      <button
                        type="button"
                        className="w-full rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
                        onClick={() => openQuestion(question.id, null)}
                      >
                        {question.shortLabel}
                        <span className="mt-0.5 block text-xs text-muted-foreground">{question.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const mapsMain = (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col text-neutral-950">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2 md:hidden">
        <Button type="button" variant="outline" size="sm" onClick={() => setPane("nav")}>
          <ArrowLeft className="h-3.5 w-3.5" />
          Experiences
        </Button>
        <span className="truncate text-xs text-muted-foreground">{selectedStory.title}</span>
      </div>
      <BristolStoryMapDetail
        story={selectedStory}
        prep={prep}
        backLabel={mapFromAnswer ? active.shortLabel : null}
        onBack={mapFromAnswer ? returnToAnswersFromMap : undefined}
      />
    </div>
  );

  const mapsSidebar = (
    <BristolStoryMapSidebar
      selectedId={selectedMapId}
      query={mapQuery}
      onQueryChange={setMapQuery}
      onSelect={(id) => {
        setSelectedMapId(id);
        setPane("answer");
      }}
    />
  );

  return (
    <div ref={rootRef} style={LIGHT_SURFACE} className="flex h-[100vh] max-h-[100vh] flex-col overflow-hidden bg-white text-neutral-950">
      <header className="flex shrink-0 items-center gap-3 bg-[#221b3a] px-3 py-2 text-white">
        <div className="min-w-0 shrink-0">
          <p className="truncate text-sm font-semibold">{BRISTOL_FOCUSED_PROFILE_NAME}</p>
          <p className="text-[11px] text-amber-200">Live navigator · local answers · no transcript</p>
        </div>
        <div
          className="hidden shrink-0 rounded-md bg-white/10 p-0.5 sm:flex"
          role="tablist"
          aria-label="Bristol focused modes"
        >
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "answers"}
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
              viewMode === "answers" ? "bg-white text-amber-950" : "text-white/90 hover:bg-white/10"
            )}
            onClick={() => {
              setViewMode("answers");
              setMapFromAnswer(false);
            }}
          >
            Answers
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "maps"}
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
              viewMode === "maps" ? "bg-white text-amber-950" : "text-white/90 hover:bg-white/10"
            )}
            onClick={() => {
              setViewMode("maps");
              setMapFromAnswer(false);
              setPane("answer");
            }}
          >
            Experience Maps
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "battlecard"}
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
              viewMode === "battlecard" ? "bg-white text-amber-950" : "text-white/90 hover:bg-white/10"
            )}
            onClick={() => {
              setViewMode("battlecard");
              setScreen("answer");
              setPane("answer");
            }}
          >
            Battlecard
          </button>
        </div>
        <div className="min-w-0 flex-1 md:hidden">{viewMode === "answers" ? searchField(mobileSearchRef, "bristol-search-mobile") : null}</div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="hidden h-8 bg-white/10 text-white hover:bg-white/15 sm:inline-flex"
            onClick={() => {
              setPane("nav");
              document.getElementById("bristol-pinned")?.scrollIntoView({ block: "nearest" });
            }}
          >
            Pinned ({bristolPinnedQuestions.length})
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className={cn("h-8 bg-white/10 text-white hover:bg-white/15", screen === "ask" && "bg-white text-amber-950")}
            onClick={() => {
              setScreen("ask");
              setViewMode("answers");
              setPane("answer");
            }}
          >
            Ask Bristol
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className={cn("h-8 bg-white/10 text-white hover:bg-white/15", prep && "bg-amber-200 text-amber-950")}
            aria-pressed={prep}
            onClick={() => setPrep((value) => !value)}
          >
            Prep
          </Button>
          <Select
            value={BRISTOL_FOCUSED_PROFILE_ID}
            onValueChange={(value) => {
              if (!value || value === BRISTOL_FOCUSED_PROFILE_ID) return;
              leaveProfile(value);
            }}
          >
            <SelectTrigger className="h-8 w-[12.5rem] border-white/15 bg-white/10 text-white">
              <SelectValue className="sr-only" />
              <span className="truncate">{BRISTOL_FOCUSED_PROFILE_NAME}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BRISTOL_FOCUSED_PROFILE_ID}>{BRISTOL_FOCUSED_PROFILE_NAME}</SelectItem>
              <SelectItem value="all">No profile</SelectItem>
              {otherProfiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <div
          className={cn(
            "relative min-h-0 shrink-0",
            viewMode === "battlecard" ? "hidden" : pane === "nav" ? "flex w-full md:w-auto" : "hidden md:block"
          )}
          style={splitLayout && viewMode !== "battlecard" ? { width: topicsWidth } : undefined}
        >
          <aside className="flex h-full min-h-0 w-full flex-col">{viewMode === "maps" ? mapsSidebar : nav}</aside>
          {splitLayout && (
            <PanelResizeHandle
              className="absolute top-0 right-0 z-30 hidden h-full w-3 translate-x-1/2 md:flex"
              label="Resize interview map"
              variant="strong"
              onPointerDown={topicsResize.onPointerDown}
            />
          )}
        </div>
        <div className={cn("min-h-0 min-w-0 flex-1 md:flex", pane === "answer" ? "flex" : "hidden")}>
          {viewMode === "battlecard" && bristolBattlecard ? (
            <BristolBattlecardPanel card={bristolBattlecard} />
          ) : viewMode === "maps" ? mapsMain : answer}
        </div>
        {showRail && viewMode === "answers" && screen === "answer" && (
          <aside className="w-56 shrink-0 overflow-auto border-l border-border bg-[#fbfbfe] p-3">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">At a glance</p>
            <dl className="mt-2 space-y-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Category</dt>
                <dd>{bristolCategoryLabel(active.category)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Priority</dt>
                <dd>{active.priority === 0 ? "P0 — highest" : active.priority === 1 ? "P1 — important" : "P2 — supporting"}</dd>
                <dt className="text-muted-foreground">Answer source</dt>
                <dd className="capitalize">{active.answerSource.replace("_", " ")}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Keywords</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {active.aliases.map((alias) => (
                    <span key={alias} className="rounded bg-muted px-1.5 py-0.5">
                      {alias}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Keyboard</p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li><kbd className="text-foreground">/</kbd> or <kbd className="text-foreground">⌘K</kbd> search</li>
              <li><kbd className="text-foreground">↑</kbd> <kbd className="text-foreground">↓</kbd> then Enter</li>
              <li><kbd className="text-foreground">Esc</kbd> clears search</li>
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}

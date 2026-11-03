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
  JAZ_CATEGORIES,
  JAZ_EXPERIENCES,
  jazAskQuestions,
  jazCategoryLabel,
  jazPinnedQuestions,
  jazQuestions,
  type JazQuestion,
} from "@/lib/questrade-jaz/dataset";
import {
  applyJazEdits,
  loadJazEdits,
  questionHasEdits,
  saveJazEdits,
  type JazContentEdits,
} from "@/lib/questrade-jaz/edits";
import {
  JAZ_FOCUSED_PROFILE_ID,
  JAZ_FOCUSED_PROFILE_NAME,
  isJazFocusedProfileName,
} from "@/lib/questrade-jaz/profile";
import { relatedQuestions } from "@/lib/questrade-jaz/related";
import { searchAsksForJaz, searchJazQuestions, type JazSearchHit } from "@/lib/questrade-jaz/search";
import { mapIdsForQuestionId } from "@/lib/questrade-jaz/map-links";
import { jazStoryById, jazStoryMaps } from "@/lib/questrade-jaz/story-maps";
import { JazStoryMapDetail } from "@/components/questrade-jaz/jaz-story-map-detail";
import { JazStoryMapSidebar } from "@/components/questrade-jaz/jaz-story-map-sidebar";
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

const TOPICS_WIDTH_KEY = "ic-jaz-focused-topics-width";
const TOPICS_DEFAULT = 340;
const TOPICS_MIN = 260;
const ANSWER_MIN = 360;
const RAIL_WIDTH = 224;

const ACTIVE_KEY = "ic-jaz-focused-active";
const FOLLOW_KEY = "ic-jaz-focused-follow";
const RECENT_KEY = "ic-jaz-focused-recent";
const EXPANDED_KEY = "ic-jaz-focused-expanded";
const GROUP_KEY = "ic-jaz-focused-groups";
const NAV_MODE_KEY = "ic-jaz-focused-nav-mode";
const SEARCH_KEY = "ic-jaz-focused-search";
const VIEW_MODE_KEY = "ic-jaz-focused-view-mode";
const MAP_ID_KEY = "ic-jaz-focused-map-id";
const MAP_SEARCH_KEY = "ic-jaz-focused-map-search";
const MAP_FROM_ANSWER_KEY = "ic-jaz-focused-map-from-answer";

type NavMode = "topics" | "experiences";
type Screen = "answer" | "ask";
type Pane = "nav" | "answer";
type ViewMode = "answers" | "maps";

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

export function JazFocusedNavigator() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const answerScrolls = useRef<Record<string, number>>({});
  const previousQuestionId = useRef<string | null>(null);

  const [edits, setEdits] = useState<JazContentEdits>({ answers: {}, followUps: {} });
  const [ready, setReady] = useState(false);
  const [activeId, setActiveId] = useState(jazPinnedQuestions[0]?.id ?? jazQuestions[0]!.id);
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
  const [selectedMapId, setSelectedMapId] = useState(jazStoryMaps[0]?.id ?? "rbc-payouts");
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

  const questions = useMemo(() => applyJazEdits(jazQuestions, edits), [edits]);
  const active = questions.find((question) => question.id === activeId) ?? questions[0]!;
  const baseActive = jazQuestions.find((question) => question.id === active.id) ?? active;
  const edited = questionHasEdits(baseActive, edits);
  const hits = useMemo(() => searchJazQuestions(questions, query), [questions, query]);
  const askHit = searchAsksForJaz(query);
  const resultCount = hits.length + (askHit ? 1 : 0);
  const related = useMemo(() => relatedQuestions(active, questions), [active, questions]);
  const linkedMapStories = useMemo(
    () =>
      mapIdsForQuestionId(active.id)
        .map((id) => jazStoryById(id))
        .filter((story): story is NonNullable<ReturnType<typeof jazStoryById>> => Boolean(story)),
    [active.id]
  );
  const selectedStory = jazStoryById(selectedMapId) ?? jazStoryMaps[0]!;
  const recentQuestions = recent
    .map((id) => questions.find((question) => question.id === id))
    .filter((question): question is JazQuestion => Boolean(question))
    .slice(0, 8);

  useEffect(() => {
    setEdits(loadJazEdits());
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
      savedActive && jazQuestions.some((question) => question.id === savedActive)
        ? savedActive
        : jazPinnedQuestions[0]?.id ?? jazQuestions[0]!.id;
    const initialQuestion = jazQuestions.find((question) => question.id === initialId) ?? jazQuestions[0]!;
    setActiveId(initialId);
    if (savedFollow && initialQuestion.followUps.some((follow) => follow.id === savedFollow)) setFollowId(savedFollow);
    setRecent(savedRecent);
    setExpandedTopics(savedTopics.length ? savedTopics : [initialQuestion.category]);
    setExpandedGroups(savedGroups);
    if (savedMode === "experiences" || savedMode === "topics") setNavMode(savedMode);
    setQuery(savedQuery);
    if (savedViewMode === "maps" || savedViewMode === "answers") setViewMode(savedViewMode);
    if (savedMapId && jazStoryMaps.some((story) => story.id === savedMapId)) setSelectedMapId(savedMapId);
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
        setOtherProfiles((data ?? []).filter((profile) => !isJazFocusedProfileName(profile.name)));
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
    document.getElementById(`jaz-follow-${followId}`)?.scrollIntoView({ block: "nearest" });
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
      if (followId) document.getElementById(`jaz-follow-${followId}`)?.scrollIntoView({ block: "nearest" });
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
    (hit: JazSearchHit) => {
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
      saveJazEdits(next);
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
      saveJazEdits(next);
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
      saveJazEdits(next);
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
        className="h-9 w-full rounded-lg border border-border bg-background pr-14 pl-8 text-sm outline-none focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-200"
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
                highlight === 0 ? "bg-violet-100 text-violet-950" : "hover:bg-muted"
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
              <span className="text-sm font-medium">Questions for Jaz</span>
              <span className="text-xs text-muted-foreground">{jazAskQuestions.length} questions to ask</span>
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
                  highlight === optionIndex ? "bg-violet-100 text-violet-950" : "hover:bg-muted"
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

  function navButton(question: JazQuestion, dense = false) {
    const selected = screen === "answer" && question.id === active.id;
    return (
      <button
        key={question.id}
        type="button"
        title={question.navigationLabel}
        aria-current={selected ? "true" : undefined}
        className={cn(
          "flex w-full items-start gap-2 rounded-md px-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300",
          dense ? "min-h-8 py-1" : "min-h-9 py-1.5",
          selected ? "bg-violet-100 font-medium text-violet-950" : "hover:bg-white/80"
        )}
        onClick={() => openQuestion(question.id, null)}
      >
        {!dense && (
          <span className="mt-0.5 w-6 shrink-0 text-[10px] font-semibold text-violet-700">
            {question.priority === 1 ? "P1" : "P2"}
          </span>
        )}
        <span className="text-[13px] leading-5">{question.shortLabel}</span>
      </button>
    );
  }

  const nav = (
    <div className="flex h-full min-h-0 flex-col bg-[#f6f4fb] text-neutral-900">
      <div className="hidden shrink-0 border-b border-violet-100 p-3 md:block">{searchField(desktopSearchRef, "jaz-search-desktop")}</div>
      <div className="min-h-0 flex-1 overflow-auto px-2 py-2">
        <p className="px-2 pt-1 pb-1 text-[11px] font-semibold tracking-wide text-violet-800 uppercase">Interview map</p>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/80"
          onClick={() => document.getElementById("jaz-pinned")?.scrollIntoView({ block: "nearest" })}
        >
          <Star className="h-3.5 w-3.5 text-violet-700" />
          Pinned ({jazPinnedQuestions.length})
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/80"
          onClick={() => setRecentOpen((open) => !open)}
        >
          <Clock className="h-3.5 w-3.5 text-violet-700" />
          Recently viewed
        </button>
        {recentOpen && (
          <div className="mb-1 ml-2">
            {recentQuestions.length === 0 && <p className="px-2 py-1 text-xs text-muted-foreground">Nothing yet.</p>}
            {recentQuestions.map((question) => navButton(question, true))}
          </div>
        )}
        <div id="jaz-pinned" className="mt-2 mb-3">
          <p className="px-2 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Most likely</p>
          {jazPinnedQuestions.map((question) => navButton(questions.find((item) => item.id === question.id) ?? question, true))}
        </div>

        <div className="mb-2 flex gap-1 px-1">
          <button
            type="button"
            className={cn(
              "rounded-md px-2 py-1 text-xs",
              navMode === "topics" ? "bg-violet-200 font-medium text-violet-950" : "text-muted-foreground hover:bg-white"
            )}
            onClick={() => setNavMode("topics")}
          >
            Topics
          </button>
          <button
            type="button"
            className={cn(
              "rounded-md px-2 py-1 text-xs",
              navMode === "experiences" ? "bg-violet-200 font-medium text-violet-950" : "text-muted-foreground hover:bg-white"
            )}
            onClick={() => setNavMode("experiences")}
          >
            Experiences
          </button>
        </div>

        {navMode === "topics"
          ? JAZ_CATEGORIES.map((category) => {
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
          : JAZ_EXPERIENCES.map((experience) => {
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
      <div className="shrink-0 border-t border-violet-100 p-2">
        <button
          type="button"
          className={cn(
            "flex min-h-10 w-full items-center rounded-md px-2 text-left text-sm font-medium",
            screen === "ask" ? "bg-violet-200 text-violet-950" : "hover:bg-white"
          )}
          onClick={() => {
            setScreen("ask");
            setPane("answer");
            setSearchOpen(false);
          }}
        >
          Questions for Jaz ({jazAskQuestions.length})
        </button>
      </div>
    </div>
  );

  const showPrepNotes = Boolean(baseActive.accuracyNote.trim()) || (baseActive.evidenceStatus && baseActive.evidenceStatus !== "grounded");

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
            <p className="text-xs font-medium tracking-wide text-violet-700 uppercase">Closing questions</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Questions for Jaz</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask these in her words. This list has no scripted answer.
            </p>
            <ol className="mt-6 space-y-4">
              {jazAskQuestions.map((item, index) => (
                <li key={item.id} className="rounded-lg border border-border bg-card px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold tracking-wide text-violet-700 uppercase">
                      {index + 1}. {item.topic}
                    </p>
                    {item.badge && (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-900">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[16px] leading-7">{item.question}</p>
                  {item.note && <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p>}
                  {item.followUps.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-border pt-3">
                      {item.followUps.map((follow) => (
                        <div key={follow.id}>
                          {follow.cue && (
                            <p className="text-[11px] font-semibold tracking-wide text-violet-700 uppercase">{follow.cue}</p>
                          )}
                          <p className="text-[15px] leading-7">{follow.question}</p>
                          {follow.note && <p className="mt-1 text-sm leading-6 text-muted-foreground">{follow.note}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="w-full max-w-3xl px-5 py-5 md:px-8 md:py-6">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {history.length > 0 && (
                <button type="button" className="font-medium text-violet-800 hover:underline" onClick={() => {
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
              <span>{jazCategoryLabel(active.category)}</span>
              <span aria-hidden>·</span>
              <span>{active.shortLabel}</span>
            </div>
            <div className="flex items-start gap-2">
              <h1 data-testid="jaz-answer-title" className="text-2xl font-semibold tracking-tight text-balance">
                {active.title}
              </h1>
              {active.suggestedPinned && <Star className="mt-1.5 h-4 w-4 shrink-0 fill-violet-500 text-violet-600" aria-label="Pinned" />}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-900">
                {active.priority === 1 ? "P1" : "P2"}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{jazCategoryLabel(active.category)}</span>
              {active.projectTags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px]">
                  {tag}
                </span>
              ))}
              {edited && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-950">Edited in this profile</span>}
            </div>

            {linkedMapStories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {linkedMapStories.map((story) => (
                  <button
                    key={story.id}
                    type="button"
                    className="rounded-md border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-left text-xs font-medium text-violet-950 hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
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
                <div data-testid="jaz-answer" className="mt-5">
                  <AnswerParagraphs text={active.answer} />
                </div>
              </>
            )}

            {active.followUps.length > 0 && (
              <section className="mt-8 rounded-lg border border-violet-100 bg-violet-50/70 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-violet-950">Likely follow-ups ({active.followUps.length})</h2>
                  {followId && (
                    <button
                      type="button"
                      className="text-xs font-medium text-violet-800 hover:underline"
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
                      <li key={follow.id} id={`jaz-follow-${follow.id}`} className="rounded-md bg-background/80">
                        <button
                          type="button"
                          aria-expanded={open}
                          className="flex min-h-10 w-full items-start gap-2 px-2 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
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
      <JazStoryMapDetail
        story={selectedStory}
        prep={prep}
        backLabel={mapFromAnswer ? active.shortLabel : null}
        onBack={mapFromAnswer ? returnToAnswersFromMap : undefined}
      />
    </div>
  );

  const mapsSidebar = (
    <JazStoryMapSidebar
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
          <p className="truncate text-sm font-semibold">{JAZ_FOCUSED_PROFILE_NAME}</p>
          <p className="text-[11px] text-violet-200">Live navigator · local answers · no transcript</p>
        </div>
        <div
          className="hidden shrink-0 rounded-md bg-white/10 p-0.5 sm:flex"
          role="tablist"
          aria-label="Jaz focused modes"
        >
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "answers"}
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
              viewMode === "answers" ? "bg-white text-violet-950" : "text-white/90 hover:bg-white/10"
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
              viewMode === "maps" ? "bg-white text-violet-950" : "text-white/90 hover:bg-white/10"
            )}
            onClick={() => {
              setViewMode("maps");
              setMapFromAnswer(false);
              setPane("answer");
            }}
          >
            Experience Maps
          </button>
        </div>
        <div className="min-w-0 flex-1 md:hidden">{viewMode === "answers" ? searchField(mobileSearchRef, "jaz-search-mobile") : null}</div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="hidden h-8 bg-white/10 text-white hover:bg-white/15 sm:inline-flex"
            onClick={() => {
              setPane("nav");
              document.getElementById("jaz-pinned")?.scrollIntoView({ block: "nearest" });
            }}
          >
            Pinned ({jazPinnedQuestions.length})
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className={cn("h-8 bg-white/10 text-white hover:bg-white/15", screen === "ask" && "bg-white text-violet-950")}
            onClick={() => {
              setScreen("ask");
              setViewMode("answers");
              setPane("answer");
            }}
          >
            Ask Jaz
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
            value={JAZ_FOCUSED_PROFILE_ID}
            onValueChange={(value) => {
              if (!value || value === JAZ_FOCUSED_PROFILE_ID) return;
              leaveProfile(value);
            }}
          >
            <SelectTrigger className="h-8 w-[12.5rem] border-white/15 bg-white/10 text-white">
              <SelectValue className="sr-only" />
              <span className="truncate">{JAZ_FOCUSED_PROFILE_NAME}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={JAZ_FOCUSED_PROFILE_ID}>{JAZ_FOCUSED_PROFILE_NAME}</SelectItem>
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
          className={cn("relative min-h-0 shrink-0", pane === "nav" ? "flex w-full md:w-auto" : "hidden md:block")}
          style={splitLayout ? { width: topicsWidth } : undefined}
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
          {viewMode === "maps" ? mapsMain : answer}
        </div>
        {showRail && viewMode === "answers" && screen === "answer" && (
          <aside className="w-56 shrink-0 overflow-auto border-l border-border bg-[#fbfbfe] p-3">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">At a glance</p>
            <dl className="mt-2 space-y-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Category</dt>
                <dd>{jazCategoryLabel(active.category)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Priority</dt>
                <dd>{active.priority === 1 ? "P1 — likely" : "P2 — supporting"}</dd>
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

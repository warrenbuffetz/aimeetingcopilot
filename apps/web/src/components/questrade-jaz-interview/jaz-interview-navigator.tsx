"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Clock, Search, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";
import {
  BRISTOL_FOCUSED_HREF,
  BRISTOL_FOCUSED_PROFILE_ID,
  BRISTOL_FOCUSED_PROFILE_NAME,
  isBristolFocusedProfileName,
} from "@/lib/bristol-focused/profile";
import {
  JAZ_FOCUSED_HREF,
  JAZ_FOCUSED_PROFILE_ID,
  JAZ_FOCUSED_PROFILE_NAME,
  isJazFocusedProfileName,
} from "@/lib/questrade-jaz/profile";
import {
  JAZ_INTERVIEW_PROFILE_ID,
  JAZ_INTERVIEW_PROFILE_NAME,
  isJazInterviewProfileName,
} from "@/lib/questrade-jaz-interview/profile";
import {
  jazInterviewCategoryLabel,
  jazInterviewExperienceSections,
  jazInterviewPanelQuestions,
  jazInterviewPanelQuickPicks,
  jazInterviewQuestions,
  type JazInterviewQuestion,
} from "@/lib/questrade-jaz-interview/dataset";
import { searchJazInterviewQuestions } from "@/lib/questrade-jaz-interview/search";
import { searchProductSenseCheatSheet } from "@/lib/questrade-jaz-interview/product-sense-search";
import {
  JazProductSensePanel,
  type ProductSensePanelHandle,
} from "@/components/questrade-jaz-interview/jaz-product-sense-panel";
import { JazSideDeskCheatSheetPanel } from "@/components/questrade-jaz-interview/jaz-side-desk-cheat-sheet-panel";
import { JazPlaybookCasesPanel } from "@/components/questrade-jaz-interview/jaz-playbook-cases-panel";
import { searchSideDeskCheatSheets } from "@/lib/questrade-jaz-interview/side-desk-search";
import { searchPlaybookCases } from "@/lib/questrade-jaz-interview/playbook-search";
import {
  LIVE_CASE_TRIGGERS,
  caseLinksForPanel,
  caseLinksForSheet,
} from "@/lib/questrade-jaz-interview/playbook-live-nav";
import type { SideDeskCheatSheetId } from "@/lib/questrade-jaz-interview/side-desk-cheat-sheet";
import { cn } from "@/lib/utils";

type MainView = "answers" | "product-sense" | "system-design" | "diagnostic" | "technical" | "cases";

const MAIN_VIEWS: MainView[] = [
  "answers",
  "cases",
  "product-sense",
  "system-design",
  "diagnostic",
  "technical",
];

function isSideDeskView(view: MainView): view is SideDeskCheatSheetId {
  return view === "system-design" || view === "diagnostic" || view === "technical";
}

const VIEW_LABELS: Record<MainView, string> = {
  answers: "Panel",
  cases: "Cases",
  "product-sense": "Product",
  "system-design": "System",
  diagnostic: "Diagnostic",
  technical: "Technical",
};

const ACTIVE_KEY = "ic-jaz-interview-active";
const VIEW_KEY = "ic-jaz-interview-main-view";
const FOLLOW_KEY = "ic-jaz-interview-follow";
const RECENT_KEY = "ic-jaz-interview-recent";
const EXPANDED_KEY = "ic-jaz-interview-expanded";
const EXPANDED_EXPERIENCE_KEY = "ic-jaz-interview-experience-expanded";
const LIKELY_PANEL_SECTION = "likely-panel";

function readList(key: string): string[] {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeList(key: string, value: string[]) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

function AnswerParagraphs({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <div className="space-y-3 text-[15px] leading-7">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </div>
  );
}

export function JazInterviewNavigator() {
  const router = useRouter();
  const answerRef = useRef<HTMLDivElement>(null);
  const productSenseRef = useRef<ProductSensePanelHandle>(null);
  const [ready, setReady] = useState(false);
  const [activeId, setActiveId] = useState(jazInterviewPanelQuickPicks[0]?.id ?? jazInterviewQuestions[0]!.id);
  const [followId, setFollowId] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const experienceSections = useMemo(() => jazInterviewExperienceSections(), []);
  const [expandedSections, setExpandedSections] = useState<string[]>([LIKELY_PANEL_SECTION, ...experienceSections.map((e) => e.deepDiveKey)]);
  const [expandedParents, setExpandedParents] = useState<string[]>(() =>
    jazInterviewQuestions.filter((q) => q.recordType === "deep_dive").map((q) => q.id)
  );
  const [query, setQuery] = useState("");
  const [recentOpen, setRecentOpen] = useState(false);
  const [spokenMode, setSpokenMode] = useState<"full" | "quick">("full");
  const [mainView, setMainView] = useState<MainView>("answers");
  const [sideDeskFocusSection, setSideDeskFocusSection] = useState<string | null>(null);
  const [sideDeskFocusCard, setSideDeskFocusCard] = useState<string | null>(null);
  const [casesFocusId, setCasesFocusId] = useState<string | null>(null);
  const [otherProfiles, setOtherProfiles] = useState<{ id: string; name: string }[]>([]);

  const active = jazInterviewQuestions.find((q) => q.id === activeId) ?? jazInterviewQuestions[0]!;
  const hits = useMemo(() => searchJazInterviewQuestions(jazInterviewQuestions, query), [query]);
  const productSenseHits = useMemo(() => searchProductSenseCheatSheet(query), [query]);
  const playbookHits = useMemo(() => searchPlaybookCases(query), [query]);
  const sideDeskHits = useMemo(
    () =>
      isSideDeskView(mainView)
        ? searchSideDeskCheatSheets(query, mainView)
        : searchSideDeskCheatSheets(query),
    [query, mainView]
  );
  const recentQuestions = recent
    .map((id) => jazInterviewQuestions.find((q) => q.id === id))
    .filter((q): q is JazInterviewQuestion => Boolean(q))
    .slice(0, 8);

  const openSideDesk = useCallback(
    (view: SideDeskCheatSheetId, opts?: { sectionId?: string; cardId?: string }) => {
      setMainView(view);
      setSideDeskFocusSection(opts?.sectionId ?? null);
      setSideDeskFocusCard(opts?.cardId ?? null);
      setQuery("");
      answerRef.current?.scrollTo({ top: 0 });
    },
    []
  );

  const openQuestion = useCallback((questionId: string, followUpId: string | null) => {
    setMainView("answers");
    setActiveId(questionId);
    setFollowId(followUpId);
    setRecent((current) => {
      const next = [questionId, ...current.filter((id) => id !== questionId)].slice(0, 12);
      writeList(RECENT_KEY, next);
      return next;
    });
    sessionStorage.setItem(ACTIVE_KEY, questionId);
    if (followUpId) sessionStorage.setItem(FOLLOW_KEY, followUpId);
    else sessionStorage.removeItem(FOLLOW_KEY);
    answerRef.current?.scrollTo({ top: 0 });
  }, []);

  const openCase = useCallback((caseId: string) => {
    setMainView("cases");
    setCasesFocusId(null);
    queueMicrotask(() => setCasesFocusId(caseId));
    setQuery("");
    answerRef.current?.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const savedActive = sessionStorage.getItem(ACTIVE_KEY);
    const savedFollow = sessionStorage.getItem(FOLLOW_KEY);
    const initial =
      savedActive && jazInterviewQuestions.some((q) => q.id === savedActive)
        ? savedActive
        : jazInterviewPanelQuickPicks[0]?.id ?? jazInterviewQuestions[0]!.id;
    const initialQ = jazInterviewQuestions.find((q) => q.id === initial)!;
    setActiveId(initial);
    if (savedFollow && initialQ.followUps.some((f) => f.id === savedFollow)) setFollowId(savedFollow);
    setRecent(readList(RECENT_KEY));
    const savedSections = readList(EXPANDED_KEY);
  const savedExperiences = readList(EXPANDED_EXPERIENCE_KEY);
    const defaultSections = [LIKELY_PANEL_SECTION, ...experienceSections.map((e) => e.deepDiveKey)];
    setExpandedSections(savedExperiences.length ? savedExperiences : savedSections.length ? savedSections : defaultSections);
    const savedView = sessionStorage.getItem(VIEW_KEY);
    if (savedView && MAIN_VIEWS.includes(savedView as MainView)) setMainView(savedView as MainView);
    setReady(true);
  }, [experienceSections]);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem(VIEW_KEY, mainView);
  }, [mainView, ready]);

  useEffect(() => {
    if (!ready) return;
    writeList(EXPANDED_EXPERIENCE_KEY, expandedSections);
  }, [expandedSections, ready]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isSupabaseConfigured()) {
        setOtherProfiles([]);
        return;
      }
      try {
        const supabase = createClient();
        const { data } = await supabase.from("interview_profiles").select("id, name");
        if (cancelled) return;
        setOtherProfiles(
          (data ?? []).filter(
            (profile) =>
              !isJazFocusedProfileName(profile.name) &&
              !isJazInterviewProfileName(profile.name) &&
              !isBristolFocusedProfileName(profile.name)
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

  function leaveProfile(profileId: string) {
    if (profileId === "all") router.push("/live");
    else if (profileId === JAZ_FOCUSED_PROFILE_ID) router.push(JAZ_FOCUSED_HREF);
    else if (profileId === BRISTOL_FOCUSED_PROFILE_ID) router.push(BRISTOL_FOCUSED_HREF);
    else router.push(`/live?profile=${encodeURIComponent(profileId)}`);
  }

  const primaryBody =
    active.recordType === "deep_dive"
      ? active.answer
      : spokenMode === "quick"
        ? active.shortAnswer || active.answer
        : active.answer;

  const activeFollow = followId ? active.followUps.find((f) => f.id === followId) : null;

  function toggleSection(sectionId: string) {
    setExpandedSections((cur) =>
      cur.includes(sectionId) ? cur.filter((id) => id !== sectionId) : [...cur, sectionId]
    );
  }

  function sectionHeader(sectionId: string, label: string, count: number, hint?: string) {
    const open = expandedSections.includes(sectionId);
    return (
      <button
        type="button"
        className="mt-2 flex min-h-9 w-full flex-col items-stretch rounded-md px-1.5 text-left hover:bg-white/80"
        onClick={() => toggleSection(sectionId)}
      >
        <span className="flex items-center gap-1 text-[13px] font-medium">
          {open ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
          <span className="flex-1">{label}</span>
          <span className="text-[11px] text-muted-foreground">{count}</span>
        </span>
        {hint ? <span className="ml-5 pb-0.5 text-[10px] leading-snug text-muted-foreground">{hint}</span> : null}
      </button>
    );
  }

  function navQuestionButton(question: JazInterviewQuestion) {
    const selected = !followId && question.id === active.id;
    const parentOpen = expandedParents.includes(question.id);
    const hasFollowUps = question.followUps.length > 0;
    return (
      <div key={question.id} className="mb-0.5">
        <div className="flex items-stretch gap-0.5">
          {hasFollowUps ? (
            <button
              type="button"
              aria-label={parentOpen ? "Collapse follow-ups" : "Expand follow-ups"}
              className="mt-1 flex h-7 w-6 shrink-0 items-center justify-center rounded hover:bg-white/80"
              onClick={() =>
                setExpandedParents((cur) =>
                  cur.includes(question.id) ? cur.filter((id) => id !== question.id) : [...cur, question.id]
                )
              }
            >
              {parentOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
          ) : (
            <span className="w-6 shrink-0" />
          )}
          <button
            type="button"
            title={question.shortLabel}
            aria-current={selected ? "true" : undefined}
            className={cn(
              "min-h-9 flex-1 rounded-md px-2 py-1.5 text-left text-[13px] leading-5 break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300",
              selected ? "bg-violet-100 font-medium text-violet-950" : "hover:bg-white/80"
            )}
            onClick={() => {
              setMainView("answers");
              openQuestion(question.id, null);
            }}
          >
            <span className="text-[10px] font-semibold text-violet-700">{question.curatedKey}</span>
            <span className="ml-1.5">{question.shortLabel}</span>
          </button>
        </div>
        {hasFollowUps && parentOpen && (
          <ul className="ml-7 border-l border-violet-100 pl-2">
            {question.followUps.map((follow) => {
              const fuSelected = active.id === question.id && followId === follow.id;
              return (
                <li key={follow.id}>
                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-md px-2 py-1.5 text-left text-xs leading-5",
                      fuSelected ? "bg-violet-50 font-medium text-violet-950" : "text-muted-foreground hover:bg-white/80"
                    )}
                    onClick={() => {
                      setMainView("answers");
                      openQuestion(question.id, follow.id);
                    }}
                  >
                    {follow.question}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  if (!ready) return null;

  return (
    <div className="flex h-[100dvh] flex-col bg-violet-950 text-white">
      <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="text-sm font-semibold">{JAZ_INTERVIEW_PROFILE_NAME}</span>
        <span className="rounded bg-white/10 px-2 py-0.5 text-[11px]">Likely Q1–10 + 5 experiences</span>
        <div className="flex max-w-full flex-wrap rounded-md bg-white/10 p-0.5 text-[10px] sm:text-[11px]">
          {MAIN_VIEWS.map((view) => (
            <button
              key={view}
              type="button"
              className={cn(
                "rounded px-1.5 py-0.5 sm:px-2",
                mainView === view ? "bg-white text-violet-950" : "text-white/90"
              )}
              onClick={() => {
                setMainView(view);
                setSideDeskFocusSection(null);
                setSideDeskFocusCard(null);
                if (view !== "cases") setCasesFocusId(null);
              }}
              title={view === "answers" ? "Panel & stories" : VIEW_LABELS[view]}
            >
              {view === "answers" ? "Panel" : VIEW_LABELS[view]}
            </button>
          ))}
        </div>
        {mainView === "answers" ? (
          <SpokenModeToggle spokenMode={spokenMode} setSpokenMode={setSpokenMode} active={active} />
        ) : null}
        <Select
          value={JAZ_INTERVIEW_PROFILE_ID}
          onValueChange={(value) => {
            if (!value || value === JAZ_INTERVIEW_PROFILE_ID) return;
            leaveProfile(value);
          }}
        >
          <SelectTrigger className="ml-auto h-8 w-[12.5rem] border-white/15 bg-white/10 text-white">
            <SelectValue className="sr-only" />
            <span className="truncate">{JAZ_INTERVIEW_PROFILE_NAME}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={JAZ_INTERVIEW_PROFILE_ID}>{JAZ_INTERVIEW_PROFILE_NAME}</SelectItem>
            <SelectItem value={JAZ_FOCUSED_PROFILE_ID}>{JAZ_FOCUSED_PROFILE_NAME}</SelectItem>
            <SelectItem value={BRISTOL_FOCUSED_PROFILE_ID}>{BRISTOL_FOCUSED_PROFILE_NAME}</SelectItem>
            <SelectItem value="all">No profile</SelectItem>
            {otherProfiles.map((profile) => (
              <SelectItem key={profile.id} value={profile.id}>
                {profile.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-full max-w-md min-h-0 flex-col border-r border-violet-900/40 bg-[#f6f4fb] text-neutral-900 md:w-[22rem] md:max-w-[22rem]">
          <div className="border-b border-violet-100 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  mainView === "cases"
                    ? "Search prepared cases, primer triggers…"
                    : mainView === "product-sense"
                      ? "Search problems, levers, metrics…"
                      : isSideDeskView(mainView)
                        ? "Search this reference…"
                        : "Search panel, cases, cheat sheets…"
                }
                className="h-9 w-full rounded-md border border-violet-200 bg-white pl-8 pr-2 text-sm"
              />
            </div>
            {query.length >= 2 && mainView === "cases" && playbookHits.length > 0 && (
              <ul className="mt-2 max-h-48 overflow-auto rounded-md border border-violet-100 bg-white text-sm">
                {playbookHits.map((hit) => (
                  <li key={`${hit.kind}-${hit.id}`}>
                    <button
                      type="button"
                      className="w-full px-2 py-1.5 text-left hover:bg-violet-50"
                      onClick={() => {
                        setMainView("cases");
                        setCasesFocusId(hit.caseId ?? null);
                        setQuery("");
                        answerRef.current?.scrollTo({ top: 0 });
                      }}
                    >
                      <span className="text-[10px] font-semibold uppercase text-violet-700">{hit.kind}</span>
                      <span className="mt-0.5 block text-xs font-medium text-neutral-900">{hit.label}</span>
                      <span className="block text-[11px] text-muted-foreground">{hit.subtitle}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {query.length >= 2 && mainView === "product-sense" && productSenseHits.length > 0 && (
              <ul className="mt-2 max-h-48 overflow-auto rounded-md border border-violet-100 bg-white text-sm">
                {productSenseHits.map((hit) => (
                  <li key={`${hit.kind}-${hit.label}-${hit.problem ?? hit.stageId}`}>
                    <button
                      type="button"
                      className="w-full px-2 py-1.5 text-left hover:bg-violet-50"
                      onClick={() => {
                        setMainView("product-sense");
                        setQuery("");
                        productSenseRef.current?.applySearchHit(hit);
                        answerRef.current?.scrollTo({ top: 0 });
                      }}
                    >
                      <span className="text-[10px] font-semibold uppercase text-violet-700">{hit.kind}</span>
                      <span className="mt-0.5 block text-xs font-medium text-neutral-900">{hit.label}</span>
                      <span className="block text-[11px] text-muted-foreground">{hit.subtitle}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {query.length >= 2 && isSideDeskView(mainView) && sideDeskHits.length > 0 && (
              <ul className="mt-2 max-h-48 overflow-auto rounded-md border border-violet-100 bg-white text-sm">
                {sideDeskHits.map((hit) => (
                  <li key={`${hit.sheetId}-${hit.sectionId}-${hit.label}`}>
                    <button
                      type="button"
                      className="w-full px-2 py-1.5 text-left text-xs hover:bg-violet-50"
                      onClick={() => {
                        openSideDesk(hit.sheetId, {
                          sectionId: hit.cardId ? undefined : hit.sectionId,
                          cardId: hit.cardId,
                        });
                      }}
                    >
                      {hit.cardId ? (
                        <span className="text-[10px] font-semibold uppercase text-violet-700">card</span>
                      ) : null}
                      <span className={cn("block text-xs font-medium", hit.cardId ? "mt-0.5" : "")}>{hit.label}</span>
                      <span className="block text-[10px] text-muted-foreground">{hit.subtitle || hit.sectionTitle}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {query.length >= 2 && mainView === "answers" && hits.length > 0 && (
              <ul className="mt-2 max-h-48 overflow-auto rounded-md border border-violet-100 bg-white text-sm">
                {hits.map((hit) => {
                  const q = jazInterviewQuestions.find((item) => item.id === hit.questionId)!;
                  const label = hit.followUpId
                    ? q.followUps.find((f) => f.id === hit.followUpId)?.question
                    : q.shortLabel;
                  return (
                    <li key={`${hit.questionId}-${hit.followUpId ?? "q"}`}>
                      <button
                        type="button"
                        className="w-full px-2 py-1.5 text-left text-xs hover:bg-violet-50"
                        onClick={() => openQuestion(hit.questionId, hit.followUpId ?? null)}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            {query.length >= 2 && mainView === "answers" && hits.length === 0 && playbookHits.length > 0 && (
              <ul className="mt-2 max-h-40 overflow-auto rounded-md border border-violet-200 bg-violet-50/50 text-sm">
                <li className="px-2 py-1 text-[10px] font-semibold text-violet-800 uppercase">Prepared cases</li>
                {playbookHits.slice(0, 8).map((hit) => (
                  <li key={`case-${hit.kind}-${hit.id}`}>
                    <button
                      type="button"
                      className="w-full px-2 py-1.5 text-left text-xs hover:bg-white"
                      onClick={() => {
                        setMainView("cases");
                        setCasesFocusId(hit.caseId ?? null);
                        setQuery("");
                        answerRef.current?.scrollTo({ top: 0 });
                      }}
                    >
                      {hit.label}
                      <span className="block text-[10px] text-muted-foreground">{hit.subtitle}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {query.length >= 2 && mainView === "answers" && productSenseHits.length > 0 && hits.length === 0 && playbookHits.length === 0 && (
              <ul className="mt-2 max-h-40 overflow-auto rounded-md border border-violet-200 bg-violet-50/50 text-sm">
                <li className="px-2 py-1 text-[10px] font-semibold text-violet-800 uppercase">Product sense</li>
                {productSenseHits.slice(0, 6).map((hit) => (
                  <li key={`ps-${hit.kind}-${hit.label}`}>
                    <button
                      type="button"
                      className="w-full px-2 py-1.5 text-left text-xs hover:bg-white"
                      onClick={() => {
                        setMainView("product-sense");
                        setQuery("");
                        productSenseRef.current?.applySearchHit(hit);
                        answerRef.current?.scrollTo({ top: 0 });
                      }}
                    >
                      {hit.label}
                      <span className="block text-[10px] text-muted-foreground">{hit.subtitle}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-auto px-2 py-2">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/80"
              onClick={() => setRecentOpen((o) => !o)}
            >
              <Clock className="h-3.5 w-3.5 text-violet-700" />
              Recently viewed
            </button>
            {recentOpen && recentQuestions.map((q) => navQuestionButton(q))}
            <p className="px-2 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Live reference
            </p>
            {(
              [
                ["cases", "Prepared cases (playbook)"],
                ["product-sense", "Product sense"],
                ["system-design", "System design"],
                ["diagnostic", "Diagnostic"],
                ["technical", "Technical"],
              ] as const
            ).map(([view, label]) => (
              <button
                key={view}
                type="button"
                className={cn(
                  "mb-1.5 w-full rounded-md border px-2.5 py-2 text-left text-sm",
                  mainView === view
                    ? "border-violet-400 bg-violet-100 font-medium text-violet-950"
                    : "border-violet-200 bg-white hover:bg-violet-50"
                )}
                onClick={() => {
                  if (view === "cases") {
                    setMainView("cases");
                    setCasesFocusId(null);
                    answerRef.current?.scrollTo({ top: 0 });
                    return;
                  }
                  if (view === "product-sense") {
                    setMainView("product-sense");
                    setSideDeskFocusSection(null);
                    setSideDeskFocusCard(null);
                    answerRef.current?.scrollTo({ top: 0 });
                    return;
                  }
                  openSideDesk(view);
                }}
              >
                {label}
              </button>
            ))}
            {mainView === "cases" ? (
              <div className="mb-2 rounded-md border border-violet-200 bg-white px-2 py-2">
                <p className="px-0.5 pb-1.5 text-[10px] font-semibold tracking-wide text-violet-800 uppercase">
                  Trigger → case
                </p>
                <div className="flex flex-wrap gap-1">
                  {LIVE_CASE_TRIGGERS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                        casesFocusId === t.primaryCaseId
                          ? "border-violet-500 bg-violet-600 text-white"
                          : "border-violet-200 bg-violet-50 text-violet-950 hover:bg-violet-100"
                      )}
                      onClick={() => openCase(t.primaryCaseId)}
                      title={t.hints.join(", ")}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {jazInterviewPanelQuickPicks.length > 0 && (
              <div className="mb-2">
                <p className="px-2 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Quick picks (P03–P10)
                </p>
                {jazInterviewPanelQuickPicks.map((q) => navQuestionButton(q))}
              </div>
            )}

            {sectionHeader(
              LIKELY_PANEL_SECTION,
              "Likely panel questions",
              jazInterviewPanelQuestions.length,
              "Common HM questions — not tied to one résumé story"
            )}
            {expandedSections.includes(LIKELY_PANEL_SECTION) && (
              <div className="ml-1 pb-2">
                {jazInterviewPanelQuestions.map((q) => navQuestionButton(q))}
              </div>
            )}

            <p className="px-2 pt-1 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Experiences (reduced + follow-ups)
            </p>
            {experienceSections.map((section) => {
              const open = expandedSections.includes(section.deepDiveKey);
              const itemCount = 1 + section.deepDive.followUps.length;
              return (
                <div key={section.deepDiveKey} className="mb-1">
                  {sectionHeader(section.deepDiveKey, section.label, itemCount)}
                  {open && (
                    <div className="ml-1 border-l border-violet-100 pl-1">
                      {navQuestionButton(section.deepDive)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        <main className="min-h-0 min-w-0 flex-1 overflow-auto bg-white text-neutral-950" ref={answerRef}>
          {mainView === "cases" ? (
            <JazPlaybookCasesPanel
              focusCaseId={casesFocusId}
              onOpenPanel={(questionId) => openQuestion(questionId, null)}
              onOpenCheatSheet={(hint) => {
                if (hint === "product-sense") {
                  setMainView("product-sense");
                  return;
                }
                if (hint === "diagnostic" || hint === "technical" || hint === "system-design") {
                  openSideDesk(hint as SideDeskCheatSheetId);
                }
              }}
            />
          ) : mainView === "product-sense" ? (
            <div>
              <JazProductSensePanel
                ref={productSenseRef}
                onOpenPanelScript={(questionId) => openQuestion(questionId, null)}
              />
              <RelatedCasesStrip sheetId="product-sense" onOpenCase={openCase} />
            </div>
          ) : isSideDeskView(mainView) ? (
            <div>
              <JazSideDeskCheatSheetPanel
                key={mainView}
                sheetId={mainView}
                focusSectionId={sideDeskFocusSection}
                focusCardId={sideDeskFocusCard}
                onOpenPanelScript={(questionId) => openQuestion(questionId, null)}
              />
              <RelatedCasesStrip sheetId={mainView} onOpenCase={openCase} />
            </div>
          ) : (
          <div className="mx-auto max-w-3xl px-5 py-6 md:px-8">
            {activeFollow ? (
              <>
                <button type="button" className="text-xs text-violet-800 hover:underline" onClick={() => openQuestion(active.id, null)}>
                  ← Back to {active.curatedKey}
                </button>
                <p className="mt-2 text-xs text-muted-foreground">
                  {active.curatedKey} · Follow-up
                </p>
                <h1 className="mt-1 text-xl font-semibold">{activeFollow.question}</h1>
                <div className="mt-5">
                  <AnswerParagraphs text={activeFollow.answer} />
                </div>
                <RelatedCasesForPanel curatedKey={active.curatedKey} onOpenCase={openCase} />
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  {jazInterviewCategoryLabel(active)} · {active.curatedKey}
                  {active.recordType === "deep_dive" && " · Reduced script"}
                </p>
                <div className="mt-1 flex items-start gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight">{active.title}</h1>
                  {active.suggestedPinned && <Star className="mt-1.5 h-4 w-4 fill-violet-500 text-violet-600" />}
                </div>
                {active.linkedDeepDiveKey && (
                  <button
                    type="button"
                    className="mt-2 text-xs font-medium text-violet-800 hover:underline"
                    onClick={() => {
                      const dd = jazInterviewQuestions.find((q) => q.curatedKey === active.linkedDeepDiveKey);
                      if (dd) openQuestion(dd.id, null);
                    }}
                  >
                    Open matching deep dive ({active.linkedDeepDiveKey})
                  </button>
                )}
                {active.recordType === "deep_dive" && active.questionTriggers.length > 0 && (
                  <QuestionTriggerCues triggers={active.questionTriggers} />
                )}
                {active.accuracyNote && (
                  <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">{active.accuracyNote}</p>
                )}
                <RelatedCasesForPanel curatedKey={active.curatedKey} onOpenCase={openCase} />
                <div className="mt-5">
                  <AnswerParagraphs text={primaryBody} />
                </div>
                {active.followUps.length > 0 && (
                  <section className="mt-8 border-t border-violet-100 pt-4">
                    <h2 className="text-sm font-semibold text-violet-950">Follow-ups ({active.followUps.length})</h2>
                    <ul className="mt-2 space-y-1">
                      {active.followUps.map((follow) => (
                        <li key={follow.id}>
                          <button
                            type="button"
                            className="w-full rounded-md px-2 py-2 text-left text-sm hover:bg-violet-50"
                            onClick={() => openQuestion(active.id, follow.id)}
                          >
                            {follow.question}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            )}
          </div>
          )}
        </main>
      </div>
    </div>
  );
}

function QuestionTriggerCues({ triggers }: { triggers: string[] }) {
  return (
    <div className="mt-4 rounded-md border border-violet-200 bg-violet-50/80 px-3 py-2.5">
      <p className="text-[11px] font-semibold tracking-wide text-violet-900 uppercase">Question cues</p>
      <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm leading-snug text-violet-950/90">
        {triggers.map((trigger) => (
          <li key={trigger}>{trigger}</li>
        ))}
      </ul>
    </div>
  );
}

function RelatedCasesForPanel({
  curatedKey,
  onOpenCase,
}: {
  curatedKey: string;
  onOpenCase: (caseId: string) => void;
}) {
  const links = caseLinksForPanel(curatedKey);
  if (links.length === 0) return null;
  return (
    <div className="mt-4 rounded-md border border-violet-200 bg-violet-50/50 px-2.5 py-2">
      <p className="text-[10px] font-semibold tracking-wide text-violet-800 uppercase">Related practice cases</p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {links.map((link) =>
          link.caseId ? (
            <li key={link.caseId}>
              <button
                type="button"
                className="rounded-full border border-violet-300 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-950 hover:bg-violet-100"
                onClick={() => onOpenCase(link.caseId!)}
              >
                {link.caseId}
              </button>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}

function RelatedCasesStrip({
  sheetId,
  onOpenCase,
}: {
  sheetId: string;
  onOpenCase: (caseId: string) => void;
}) {
  const links = caseLinksForSheet(sheetId);
  if (links.length === 0) return null;
  return (
    <div className="mx-auto max-w-4xl border-t border-violet-100 px-5 py-4 md:px-8">
      <div className="rounded-md border border-violet-200 bg-violet-50/50 px-2.5 py-2">
        <p className="text-[10px] font-semibold tracking-wide text-violet-800 uppercase">Related practice cases</p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {links.map((link) =>
            link.caseId ? (
              <li key={link.caseId}>
                <button
                  type="button"
                  className="rounded-full border border-violet-300 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-950 hover:bg-violet-100"
                  onClick={() => onOpenCase(link.caseId!)}
                  title={link.label}
                >
                  {link.caseId}
                </button>
              </li>
            ) : null
          )}
        </ul>
      </div>
    </div>
  );
}

function SpokenModeToggle({
  spokenMode,
  setSpokenMode,
  active,
}: {
  spokenMode: "full" | "quick";
  setSpokenMode: (m: "full" | "quick") => void;
  active: JazInterviewQuestion;
}) {
  if (active.recordType === "deep_dive") {
    return <span className="text-[11px] text-white/80">Deep dive: reduced only</span>;
  }
  return (
    <div className="flex rounded-md bg-white/10 p-0.5 text-[11px]">
      <button
        type="button"
        className={cn("rounded px-2 py-0.5", spokenMode === "full" ? "bg-white text-violet-950" : "text-white/90")}
        onClick={() => setSpokenMode("full")}
      >
        Full script
      </button>
      <button
        type="button"
        className={cn("rounded px-2 py-0.5", spokenMode === "quick" ? "bg-white text-violet-950" : "text-white/90")}
        onClick={() => setSpokenMode("quick")}
      >
        Quick open
      </button>
    </div>
  );
}

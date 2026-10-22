"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  applyContextResolution,
  emptyInterviewContext,
  enrichLibrary,
  resolveInterviewContext,
  suggestFollowUps,
  type EnrichedQaRow,
  type InterviewSessionContext,
  type LexicalQaRow,
} from "@interview-copilot/shared";

const STORAGE_KEY = "interview-copilot-session-context";

export type LibraryRow = LexicalQaRow & { notes?: string | null; part?: number };

function loadStoredContext(): InterviewSessionContext {
  if (typeof window === "undefined") return emptyInterviewContext();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyInterviewContext();
    return { ...emptyInterviewContext(), ...JSON.parse(raw) } as InterviewSessionContext;
  } catch {
    return emptyInterviewContext();
  }
}

export function useInterviewContext(library: LibraryRow[]) {
  const [context, setContext] = useState<InterviewSessionContext>(emptyInterviewContext);

  useEffect(() => {
    setContext(loadStoredContext());
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
  }, [context]);

  const catalog: EnrichedQaRow[] = useMemo(() => enrichLibrary(library), [library]);

  const suggestions = useMemo(
    () => suggestFollowUps(catalog, context, { limit: 5 }),
    [catalog, context]
  );

  const registerDetection = useCallback(
    (spoken: string, matchedRowId?: string | null) => {
      let resolution: ReturnType<typeof resolveInterviewContext> | null = null;
      setContext((prev) => {
        resolution = resolveInterviewContext(spoken, catalog, prev);
        return applyContextResolution(prev, resolution, spoken, matchedRowId ?? resolution.rowId);
      });
      return resolution;
    },
    [catalog]
  );

  const setManualExperience = useCallback((moduleId: string | null, label?: string) => {
    setContext((prev) => ({
      ...prev,
      manualExperienceOverrideId: moduleId,
      activeExperienceModuleId: moduleId ?? prev.activeExperienceModuleId,
      activeExperienceLabel: label ?? prev.activeExperienceLabel,
    }));
  }, []);

  const clearContext = useCallback(() => {
    setContext(emptyInterviewContext());
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    context,
    catalog,
    suggestions,
    registerDetection,
    setManualExperience,
    clearContext,
  };
}

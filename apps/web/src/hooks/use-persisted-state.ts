"use client";

import { useCallback, useEffect, useState } from "react";

export function usePersistedBoolean(key: string, defaultValue: boolean) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === "true") setValue(true);
      else if (raw === "false") setValue(false);
    } catch {
      /* ignore */
    }
  }, [key]);

  const set = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      setValue((prev) => {
        const v = typeof next === "function" ? next(prev) : next;
        try {
          localStorage.setItem(key, String(v));
        } catch {
          /* ignore */
        }
        return v;
      });
    },
    [key]
  );

  return [value, set] as const;
}

export function usePersistedNumber(key: string, defaultValue: number) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) {
        const n = Number(raw);
        if (!Number.isNaN(n)) setValue(n);
      }
    } catch {
      /* ignore */
    }
  }, [key]);

  const set = useCallback(
    (next: number | ((prev: number) => number)) => {
      setValue((prev) => {
        const v = typeof next === "function" ? next(prev) : next;
        try {
          localStorage.setItem(key, String(v));
        } catch {
          /* ignore */
        }
        return v;
      });
    },
    [key]
  );

  return [value, set] as const;
}

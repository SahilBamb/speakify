"use client";

import { useState, useCallback, useEffect } from "react";

export interface ReadingPrefs {
  fontFamily: "sans" | "serif" | "mono";
  fontSize: number;
  lineHeight: number;
}

const DEFAULTS: ReadingPrefs = {
  fontFamily: "sans",
  fontSize: 16,
  lineHeight: 1.75,
};

const STORAGE_KEY = "speechify-reading-prefs";

const FONT_SIZES = [14, 15, 16, 18, 20];
const LINE_HEIGHTS = [1.4, 1.6, 1.75, 2.0, 2.2];

export const FONT_FAMILIES: Record<ReadingPrefs["fontFamily"], string> = {
  sans: "'Inter', system-ui, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "'SF Mono', 'Fira Code', monospace",
};

export { FONT_SIZES, LINE_HEIGHTS };

export function useReadingPrefs() {
  const [prefs, setPrefsState] = useState<ReadingPrefs>(DEFAULTS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPrefsState({ ...DEFAULTS, ...parsed });
      }
    } catch {}
  }, []);

  const setPrefs = useCallback((update: Partial<ReadingPrefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...update };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { prefs, setPrefs };
}

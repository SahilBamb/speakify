"use client";

import { useRef, useEffect } from "react";
import type { ReadingPrefs } from "@/hooks/useReadingPrefs";
import { FONT_SIZES, LINE_HEIGHTS } from "@/hooks/useReadingPrefs";

interface ReadingPrefsPanelProps {
  prefs: ReadingPrefs;
  onChange: (update: Partial<ReadingPrefs>) => void;
  open: boolean;
  onClose: () => void;
}

export default function ReadingPrefsPanel({ prefs, onChange, open, onClose }: ReadingPrefsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-64 glass-strong rounded-xl shadow-lg z-50 p-4 space-y-4"
    >
      <h3 className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
        Reading Preferences
      </h3>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-theme-secondary">Font</label>
        <div className="flex gap-1">
          {(["sans", "serif", "mono"] as const).map((f) => (
            <button
              key={f}
              onClick={() => onChange({ fontFamily: f })}
              className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                prefs.fontFamily === f
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  : "text-theme-muted hover:bg-theme-hover"
              }`}
              style={{ fontFamily: f === "sans" ? "sans-serif" : f === "serif" ? "Georgia, serif" : "monospace" }}
            >
              {f === "sans" ? "Sans" : f === "serif" ? "Serif" : "Mono"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-theme-secondary">
          Size <span className="text-theme-muted">({prefs.fontSize}px)</span>
        </label>
        <div className="flex gap-1">
          {FONT_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => onChange({ fontSize: s })}
              className={`flex-1 px-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                prefs.fontSize === s
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  : "text-theme-muted hover:bg-theme-hover"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-theme-secondary">
          Line Height <span className="text-theme-muted">({prefs.lineHeight})</span>
        </label>
        <div className="flex gap-1">
          {LINE_HEIGHTS.map((lh) => (
            <button
              key={lh}
              onClick={() => onChange({ lineHeight: lh })}
              className={`flex-1 px-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                prefs.lineHeight === lh
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  : "text-theme-muted hover:bg-theme-hover"
              }`}
            >
              {lh}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

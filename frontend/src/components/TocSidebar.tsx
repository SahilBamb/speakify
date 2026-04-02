"use client";

import { useState } from "react";

export interface TocEntry {
  id: string;
  label: string;
  active?: boolean;
  onClick: () => void;
  indent?: number;
}

interface TocSidebarProps {
  title: string;
  entries: TocEntry[];
}

export default function TocSidebar({ title, entries }: TocSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl text-theme-muted hover:text-theme-primary hover:bg-theme-hover transition-all"
        title="Table of Contents"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-72 max-w-[80vw] h-full glass-strong shadow-xl overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-[var(--glass-border)] flex items-center justify-between shrink-0">
              <h3 className="text-sm font-semibold text-theme-primary truncate">{title}</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-theme-muted hover:text-theme-primary hover:bg-theme-hover transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {entries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => {
                    entry.onClick();
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    entry.active
                      ? "bg-theme-highlight text-theme-highlight font-medium"
                      : "text-theme-secondary hover:bg-theme-hover"
                  }`}
                  style={{ paddingLeft: `${(entry.indent ?? 0) * 12 + 16}px` }}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

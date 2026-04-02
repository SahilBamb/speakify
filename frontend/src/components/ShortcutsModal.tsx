"use client";

interface ShortcutsModalProps {
  open: boolean;
  onClose: () => void;
  hasChapters?: boolean;
}

const SHORTCUTS = [
  { key: "Space", action: "Play / Pause" },
  { key: "←", action: "Previous sentence" },
  { key: "→", action: "Next sentence" },
  { key: "↑", action: "Increase speed" },
  { key: "↓", action: "Decrease speed" },
  { key: "Esc", action: "Stop playback" },
];

const CHAPTER_SHORTCUTS = [
  { key: "N", action: "Next chapter" },
  { key: "P", action: "Previous chapter" },
];

export default function ShortcutsModal({ open, onClose, hasChapters }: ShortcutsModalProps) {
  if (!open) return null;

  const allShortcuts = hasChapters ? [...SHORTCUTS, ...CHAPTER_SHORTCUTS] : SHORTCUTS;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-strong rounded-2xl p-6 w-full max-w-sm relative shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-theme-primary">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-theme-muted hover:text-theme-primary hover:bg-theme-hover transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          {allShortcuts.map(({ key, action }) => (
            <div key={key} className="flex items-center justify-between py-1">
              <span className="text-sm text-theme-secondary">{action}</span>
              <kbd className="px-2 py-0.5 rounded-md bg-theme-hover text-xs font-mono text-theme-muted border border-theme-input">
                {key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="text-xs text-theme-muted text-center pt-1">
          Press <kbd className="px-1 py-0.5 rounded bg-theme-hover text-[10px] font-mono border border-theme-input">?</kbd> to toggle this panel
        </p>
      </div>
    </div>
  );
}

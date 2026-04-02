"use client";

import { useEffect, useCallback, useState } from "react";
import type { PlaybackState } from "./usePlayback";

interface ShortcutHandlers {
  playback: PlaybackState;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

export function useKeyboardShortcuts({ playback, onNextChapter, onPrevChapter }: ShortcutHandlers) {
  const [showHelp, setShowHelp] = useState(false);

  const handler = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          if (playback.status === "playing") playback.pause();
          else if (playback.status === "paused") playback.resume();
          else if (playback.status === "ready") playback.play();
          break;
        case "ArrowRight":
          e.preventDefault();
          playback.skipForward();
          break;
        case "ArrowLeft":
          e.preventDefault();
          playback.skipBackward();
          break;
        case "ArrowUp":
          e.preventDefault();
          playback.setSpeed(Math.min(playback.speed + 0.25, 3));
          break;
        case "ArrowDown":
          e.preventDefault();
          playback.setSpeed(Math.max(playback.speed - 0.25, 0.5));
          break;
        case "Escape":
          e.preventDefault();
          if (showHelp) setShowHelp(false);
          else playback.stop();
          break;
        case "n":
        case "N":
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            onNextChapter?.();
          }
          break;
        case "p":
        case "P":
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            onPrevChapter?.();
          }
          break;
        case "?":
          e.preventDefault();
          setShowHelp((v) => !v);
          break;
      }
    },
    [playback, showHelp, onNextChapter, onPrevChapter]
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);

  return { showHelp, setShowHelp };
}

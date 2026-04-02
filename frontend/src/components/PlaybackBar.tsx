"use client";

import type { PlaybackState } from "@/hooks/usePlayback";
import { useMemo } from "react";

interface PlaybackBarChunk {
  text: string;
  estimated_duration_ms: number;
  page?: number;
}

interface PlaybackBarProps {
  playback: PlaybackState;
  chunks: PlaybackBarChunk[];
  documentTitle: string;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function PlaybackBar({ playback, chunks, documentTitle }: PlaybackBarProps) {
  const {
    status,
    activeChunkIndex,
    speed,
    play,
    pause,
    resume,
    stop,
    skipForward,
    skipBackward,
    setSpeed,
  } = playback;

  const currentChunk = chunks[activeChunkIndex];
  const progressPct = chunks.length > 0 ? ((activeChunkIndex + 1) / chunks.length) * 100 : 0;
  const isPlaying = status === "playing";
  const isPaused = status === "paused";
  const canPlay = status === "ready" || status === "paused";

  const totalDuration = useMemo(
    () => chunks.reduce((sum, c) => sum + c.estimated_duration_ms, 0),
    [chunks]
  );

  const elapsedDuration = useMemo(
    () => chunks.slice(0, activeChunkIndex).reduce((sum, c) => sum + c.estimated_duration_ms, 0),
    [chunks, activeChunkIndex]
  );

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      play();
    }
  };

  return (
    <div className="glass-strong border-t border-[var(--glass-border)] shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      {/* Progress bar */}
      <div className="h-1 bg-slate-100/60 w-full">
        <div
          className="h-full bg-zinc-800 transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Current sentence preview */}
        {currentChunk && (
          <p className="text-xs text-theme-muted truncate mb-3 max-w-xl mx-auto text-center leading-relaxed">
            {currentChunk.text}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: speed */}
          <div className="flex items-center gap-2 min-w-0 flex-1 hidden sm:flex">
            <select
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="text-xs font-medium bg-theme-input border border-theme-input rounded-lg px-2 py-1.5 text-theme-secondary focus:outline-none focus:ring-1 focus:ring-zinc-300 cursor-pointer"
            >
              {SPEEDS.map((s) => (
                <option key={s} value={s}>
                  {s}x
                </option>
              ))}
            </select>

            <span className="text-[10px] text-theme-muted hidden sm:inline whitespace-nowrap">
              {formatTime(elapsedDuration)} / {formatTime(totalDuration)}
            </span>
          </div>

          {/* Center: transport controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={stop}
              disabled={status === "idle" || status === "ready"}
              className="p-2 rounded-xl text-theme-muted hover:text-theme-primary hover:bg-theme-hover transition-all disabled:opacity-30"
              title="Stop"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            </button>

            <button
              onClick={skipBackward}
              disabled={status === "idle"}
              className="p-2 rounded-xl text-theme-muted hover:text-theme-primary hover:bg-theme-hover transition-all disabled:opacity-30"
              title="Previous"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
              </svg>
            </button>

            <button
              onClick={handlePlayPause}
              disabled={status === "idle"}
              className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white shadow-md shadow-zinc-200/50 hover:shadow-lg hover:shadow-zinc-300/50 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={skipForward}
              disabled={status === "idle"}
              className="p-2 rounded-xl text-theme-muted hover:text-theme-primary hover:bg-theme-hover transition-all disabled:opacity-30"
              title="Next"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          {/* Right: progress info */}
          <div className="flex items-center gap-3 min-w-0 flex-1 justify-end hidden sm:flex">
            <span className="text-xs text-theme-muted font-medium tabular-nums whitespace-nowrap">
              {chunks.length > 0 ? `${activeChunkIndex + 1} / ${chunks.length}` : "—"}
            </span>
            {currentChunk?.page != null && (
              <span className="text-xs text-theme-muted whitespace-nowrap">
                p. {currentChunk.page}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

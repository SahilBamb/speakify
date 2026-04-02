"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { API_BASE } from "@/lib/api";

export type PlaybackStatus = "idle" | "ready" | "playing" | "paused";

export type AudioUrlFn = (sequenceOrder: number) => string;

export interface PlaybackState {
  status: PlaybackStatus;
  activeChunkIndex: number;
  speed: number;
  currentTime: number;
  chunkDuration: number;
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  skipForward: () => void;
  skipBackward: () => void;
  jumpToChunk: (index: number) => void;
  setSpeed: (rate: number) => void;
  setActiveChunkIndex: (index: number) => void;
  onChapterEnd?: () => void;
}

function defaultAudioUrl(docId: number): AudioUrlFn {
  return (sequenceOrder: number) => `${API_BASE}/api/audio/${docId}/${sequenceOrder}`;
}

export interface PlaybackChunk {
  sequence_order: number;
  estimated_duration_ms: number;
  text: string;
  [key: string]: unknown;
}

export function usePlayback(
  chunks: PlaybackChunk[],
  docId: number,
  audioUrlFn?: AudioUrlFn,
  onChapterEnd?: () => void,
): PlaybackState {
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [activeChunkIndex, setActiveChunkIndex] = useState(0);
  const [speed, setSpeedState] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [chunkDuration, setChunkDuration] = useState(0);

  const isPlayingRef = useRef(false);
  const activeIndexRef = useRef(0);
  const speedRef = useRef(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef(chunks);
  const getUrl = useRef<AudioUrlFn>(audioUrlFn || defaultAudioUrl(docId));
  const onChapterEndRef = useRef(onChapterEnd);

  chunksRef.current = chunks;
  getUrl.current = audioUrlFn || defaultAudioUrl(docId);
  onChapterEndRef.current = onChapterEnd;

  useEffect(() => {
    activeIndexRef.current = activeChunkIndex;
  }, [activeChunkIndex]);

  useEffect(() => {
    if (chunks.length > 0 && status === "idle") {
      setStatus("ready");
    }
  }, [chunks, status]);

  const preloadNext = useCallback((afterIndex: number) => {
    const nextIdx = afterIndex + 1;
    if (nextIdx >= chunksRef.current.length) return;
    const next = new Audio(getUrl.current(chunksRef.current[nextIdx].sequence_order));
    next.preload = "auto";
    nextAudioRef.current = next;
  }, []);

  const playChunk = useCallback((index: number) => {
    const currentChunks = chunksRef.current;
    if (index >= currentChunks.length) {
      isPlayingRef.current = false;
      setStatus("ready");
      setActiveChunkIndex(0);
      activeIndexRef.current = 0;
      setCurrentTime(0);
      setChunkDuration(0);
      onChapterEndRef.current?.();
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.ontimeupdate = null;
    }

    const chunk = currentChunks[index];
    const url = getUrl.current(chunk.sequence_order);

    let audio: HTMLAudioElement;
    if (nextAudioRef.current && nextAudioRef.current.src === url) {
      audio = nextAudioRef.current;
      nextAudioRef.current = null;
    } else {
      audio = new Audio(url);
    }

    audio.playbackRate = speedRef.current;
    audioRef.current = audio;

    setActiveChunkIndex(index);
    activeIndexRef.current = index;
    setCurrentTime(0);

    audio.onloadedmetadata = () => {
      setChunkDuration(audio.duration);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onended = () => {
      if (isPlayingRef.current) {
        playChunk(index + 1);
      }
    };

    audio.onerror = () => {
      if (isPlayingRef.current) {
        playChunk(index + 1);
      }
    };

    audio.play().catch(() => {
      if (isPlayingRef.current) {
        playChunk(index + 1);
      }
    });

    preloadNext(index);
  }, [preloadNext]);

  const play = useCallback(() => {
    isPlayingRef.current = true;
    setStatus("playing");
    playChunk(activeIndexRef.current);
  }, [playChunk]);

  const pause = useCallback(() => {
    isPlayingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    isPlayingRef.current = true;
    setStatus("playing");
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    } else {
      playChunk(activeIndexRef.current);
    }
  }, [playChunk]);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.ontimeupdate = null;
    }
    setActiveChunkIndex(0);
    activeIndexRef.current = 0;
    setStatus("ready");
    setCurrentTime(0);
    setChunkDuration(0);
  }, []);

  const skipForward = useCallback(() => {
    const next = Math.min(activeIndexRef.current + 1, chunksRef.current.length - 1);
    setActiveChunkIndex(next);
    activeIndexRef.current = next;
    if (isPlayingRef.current) {
      playChunk(next);
    }
  }, [playChunk]);

  const skipBackward = useCallback(() => {
    const prev = Math.max(activeIndexRef.current - 1, 0);
    setActiveChunkIndex(prev);
    activeIndexRef.current = prev;
    if (isPlayingRef.current) {
      playChunk(prev);
    }
  }, [playChunk]);

  const jumpToChunk = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, chunksRef.current.length - 1));
      setActiveChunkIndex(clamped);
      activeIndexRef.current = clamped;
      if (isPlayingRef.current) {
        playChunk(clamped);
      }
    },
    [playChunk]
  );

  const setSpeed = useCallback((rate: number) => {
    speedRef.current = rate;
    setSpeedState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
    };
  }, []);

  return {
    status,
    activeChunkIndex,
    speed,
    currentTime,
    chunkDuration,
    play,
    pause,
    resume,
    stop,
    skipForward,
    skipBackward,
    jumpToChunk,
    setSpeed,
    setActiveChunkIndex,
  };
}

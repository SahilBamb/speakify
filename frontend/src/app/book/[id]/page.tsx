"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import TextReader from "@/components/TextReader";
import PlaybackBar from "@/components/PlaybackBar";
import ErrorBoundary from "@/components/ErrorBoundary";
import ThemeToggle from "@/components/ThemeToggle";
import TocSidebar from "@/components/TocSidebar";
import ReadingPrefsPanel from "@/components/ReadingPrefsPanel";
import { ReaderSkeleton, ChapterSkeleton } from "@/components/Skeleton";
import { usePlayback } from "@/hooks/usePlayback";
import { useReadingPrefs, FONT_FAMILIES } from "@/hooks/useReadingPrefs";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import ShortcutsModal from "@/components/ShortcutsModal";
import type { GeneratedBookDetail, BookChunk } from "@/lib/api";
import {
  getBook,
  generateChapter,
  getChapterChunks,
  getBookAudioUrl,
  getBookProgress,
  saveBookProgress,
  pollChapterReady,
} from "@/lib/api";

export default function BookReaderPage() {
  return (
    <ErrorBoundary>
      <BookReaderPageInner />
    </ErrorBoundary>
  );
}

function BookReaderPageInner() {
  const params = useParams();
  const router = useRouter();
  const bookId = Number(params.id);

  const [book, setBook] = useState<GeneratedBookDetail | null>(null);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [chunks, setChunks] = useState<BookChunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const initialLoadDone = useRef(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const { prefs, setPrefs } = useReadingPrefs();
  const bookRef = useRef(book);
  bookRef.current = book;

  const currentChapterRef = useRef(currentChapter);
  currentChapterRef.current = currentChapter;

  const audioUrlFn = useCallback(
    (seq: number) => getBookAudioUrl(bookId, currentChapterRef.current, seq),
    [bookId]
  );

  const handleChapterEnd = useCallback(() => {
    if (!book) return;
    if (currentChapter < book.chapter_count) {
      goToChapter(currentChapter + 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, currentChapter]);

  const playback = usePlayback(chunks, bookId, audioUrlFn, handleChapterEnd);

  const loadChapter = useCallback(
    async (chapterNum: number, restoreChunkId?: number | null) => {
      if (!bookId) return;
      setChapterLoading(true);
      setChunks([]);

      try {
        const chInfo = book?.chapters.find((c) => c.number === chapterNum);
        let data;
        if (chInfo?.status === "ready") {
          data = await getChapterChunks(bookId, chapterNum);
        } else {
          await generateChapter(bookId, chapterNum);
          data = await pollChapterReady(bookId, chapterNum);
        }

        setChunks(data.chunks);
        setCurrentChapter(chapterNum);

        if (restoreChunkId && data.chunks.length > 0) {
          const idx = data.chunks.findIndex((c) => c.id === restoreChunkId);
          if (idx !== -1) {
            playback.setActiveChunkIndex(idx);
          }
        }

        if (book) {
          const updatedChapters = book.chapters.map((c) =>
            c.number === chapterNum ? { ...c, status: "ready" } : c
          );
          setBook({ ...book, chapters: updatedChapters });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chapter");
      } finally {
        setChapterLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookId, book]
  );

  const goToChapter = useCallback(
    (num: number) => {
      playback.stop();
      loadChapter(num);
    },
    [playback, loadChapter]
  );

  const { showHelp, setShowHelp } = useKeyboardShortcuts({
    playback,
    onNextChapter: useCallback(() => {
      if (bookRef.current && currentChapterRef.current < bookRef.current.chapter_count) {
        goToChapter(currentChapterRef.current + 1);
      }
    }, [goToChapter]),
    onPrevChapter: useCallback(() => {
      if (currentChapterRef.current > 1) {
        goToChapter(currentChapterRef.current - 1);
      }
    }, [goToChapter]),
  });

  useEffect(() => {
    if (!bookId || initialLoadDone.current) return;
    initialLoadDone.current = true;

    async function init() {
      try {
        const [bookData, progressData] = await Promise.all([
          getBook(bookId),
          getBookProgress(bookId),
        ]);
        setBook(bookData);

        const startChapter = progressData.current_chapter || 1;
        setCurrentChapter(startChapter);
        await loadChapter(startChapter, progressData.current_chunk_id);
      } catch {
        setError("Failed to load book");
      } finally {
        setLoading(false);
      }
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const saveCurrentProgress = useCallback(() => {
    if (!bookId || chunks.length === 0) return;
    const chunk = chunks[playback.activeChunkIndex];
    if (!chunk) return;
    saveBookProgress(bookId, {
      current_chapter: currentChapter,
      current_chunk_id: chunk.id,
    }).catch(() => {});
  }, [bookId, chunks, playback.activeChunkIndex, currentChapter]);

  useEffect(() => {
    saveTimerRef.current = setInterval(saveCurrentProgress, 5000);
    return () => clearInterval(saveTimerRef.current);
  }, [saveCurrentProgress]);

  useEffect(() => {
    return () => { saveCurrentProgress(); };
  }, [saveCurrentProgress]);

  if (loading) {
    return <ReaderSkeleton />;
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center max-w-sm space-y-4">
          <p className="text-slate-600">{error || "Book not found"}</p>
          <button
            onClick={() => router.push("/")}
            className="text-sm font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const currentChapterInfo = book.chapters.find((c) => c.number === currentChapter);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="glass-strong shadow-sm shadow-black/[0.03] z-40 shrink-0">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => { saveCurrentProgress(); router.push("/"); }}
              className="p-2 rounded-xl text-theme-muted hover:text-theme-primary hover:bg-theme-hover transition-all shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-theme-primary truncate">{book.title}</h1>
              <p className="text-xs text-theme-muted">
                Chapter {currentChapter} of {book.chapter_count}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 relative">
            <TocSidebar
              title={book.title}
              entries={book.chapters.map((ch) => ({
                id: `ch-${ch.number}`,
                label: `${ch.number}. ${ch.title}`,
                active: ch.number === currentChapter,
                onClick: () => goToChapter(ch.number),
              }))}
            />
            <ThemeToggle />
            <button
              onClick={() => setPrefsOpen(!prefsOpen)}
              className="p-2 rounded-xl text-theme-muted hover:text-theme-primary hover:bg-theme-hover transition-all"
              title="Reading preferences"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </button>
            <ReadingPrefsPanel
              prefs={prefs}
              onChange={setPrefs}
              open={prefsOpen}
              onClose={() => setPrefsOpen(false)}
            />
            <button
              onClick={() => goToChapter(currentChapter - 1)}
              disabled={currentChapter <= 1 || chapterLoading}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-theme-secondary hover:bg-theme-hover transition-all disabled:opacity-30"
            >
              Prev
            </button>

            <select
              value={currentChapter}
              onChange={(e) => goToChapter(Number(e.target.value))}
              disabled={chapterLoading}
              className="text-xs font-medium bg-theme-input border border-theme-input rounded-lg px-2 py-1.5 text-theme-secondary focus:outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer"
            >
              {book.chapters.map((ch) => (
                <option key={ch.number} value={ch.number}>
                  Ch. {ch.number}: {ch.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => goToChapter(currentChapter + 1)}
              disabled={currentChapter >= book.chapter_count || chapterLoading}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-theme-secondary hover:bg-theme-hover transition-all disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {chapterLoading ? (
          <ChapterSkeleton />
        ) : (
          <TextReader
            chapterTitle={currentChapterInfo?.title || `Chapter ${currentChapter}`}
            chunks={chunks}
            activeChunkIndex={playback.activeChunkIndex}
            onChunkClick={(index) => playback.jumpToChunk(index)}
            style={{
              fontFamily: FONT_FAMILIES[prefs.fontFamily],
              fontSize: `${prefs.fontSize}px`,
              lineHeight: prefs.lineHeight,
            }}
          />
        )}
      </div>

      {/* Playback bar */}
      <div className="shrink-0 z-40">
        <PlaybackBar
          playback={playback}
          chunks={chunks}
          documentTitle={book.title}
        />
      </div>

      <ShortcutsModal open={showHelp} onClose={() => setShowHelp(false)} hasChapters />
    </div>
  );
}

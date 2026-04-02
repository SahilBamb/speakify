"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import PlaybackBar from "@/components/PlaybackBar";
import ErrorBoundary from "@/components/ErrorBoundary";
import ThemeToggle from "@/components/ThemeToggle";
import TocSidebar from "@/components/TocSidebar";
import { ReaderSkeleton } from "@/components/Skeleton";
import { usePlayback } from "@/hooks/usePlayback";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import ShortcutsModal from "@/components/ShortcutsModal";
import type { DocumentDetail, Chunk } from "@/lib/api";
import { getDocument, getChunks, getPdfUrl, getProgress, saveProgress } from "@/lib/api";

const PDFViewer = dynamic(() => import("@/components/PDFViewer"), { ssr: false });

export default function ReaderPage() {
  return (
    <ErrorBoundary>
      <ReaderPageInner />
    </ErrorBoundary>
  );
}

function ReaderPageInner() {
  const params = useParams();
  const router = useRouter();
  const docId = Number(params.id);

  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setInterval>>();

  const playback = usePlayback(chunks, docId);
  const { showHelp, setShowHelp } = useKeyboardShortcuts({ playback });

  useEffect(() => {
    if (!docId) return;
    let cancelled = false;

    async function load() {
      try {
        const [docData, chunksData, progressData] = await Promise.all([
          getDocument(docId),
          getChunks(docId),
          getProgress(docId),
        ]);

        if (cancelled) return;

        setDoc(docData);
        setChunks(chunksData.chunks);

        if (progressData.current_chunk_id && chunksData.chunks.length > 0) {
          const idx = chunksData.chunks.findIndex(
            (c) => c.id === progressData.current_chunk_id
          );
          if (idx !== -1) {
            playback.setActiveChunkIndex(idx);
          }
        }
      } catch {
        if (!cancelled) setError("Failed to load document");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId]);

  const saveCurrentProgress = useCallback(() => {
    if (!docId || chunks.length === 0) return;
    const chunk = chunks[playback.activeChunkIndex];
    if (!chunk) return;
    saveProgress(docId, {
      current_chunk_id: chunk.id,
      current_page: chunk.page,
    }).catch(() => {});
  }, [docId, chunks, playback.activeChunkIndex]);

  useEffect(() => {
    saveTimerRef.current = setInterval(saveCurrentProgress, 5000);
    return () => clearInterval(saveTimerRef.current);
  }, [saveCurrentProgress]);

  useEffect(() => {
    return () => {
      saveCurrentProgress();
    };
  }, [saveCurrentProgress]);

  if (loading) {
    return <ReaderSkeleton />;
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center max-w-sm space-y-4">
          <p className="text-slate-600">{error || "Document not found"}</p>
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

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="glass-strong shadow-sm shadow-black/[0.03] z-40 shrink-0">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => {
              saveCurrentProgress();
              router.push("/");
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-theme-primary truncate">{doc.title}</h1>
            <p className="text-xs text-theme-muted">
              {doc.page_count} page{doc.page_count !== 1 ? "s" : ""} &middot; {chunks.length} sentences
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <TocSidebar
              title={doc.title}
              entries={Array.from({ length: doc.page_count }, (_, i) => ({
                id: `page-${i + 1}`,
                label: `Page ${i + 1}`,
                active: chunks[playback.activeChunkIndex]?.page === i + 1,
                onClick: () => {
                  const el = document.getElementById(`pdf-page-${i + 1}`);
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                },
              }))}
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* PDF Viewer */}
      <div className="flex-1 min-h-0">
        <PDFViewer
          pdfUrl={getPdfUrl(docId)}
          chunks={chunks}
          pageDimensions={doc.pages}
          activeChunkIndex={playback.activeChunkIndex}
          onChunkClick={(index) => {
            playback.jumpToChunk(index);
          }}
        />
      </div>

      {/* Playback bar */}
      <div className="shrink-0 z-40">
        <PlaybackBar
          playback={playback}
          chunks={chunks}
          documentTitle={doc.title}
        />
      </div>

      <ShortcutsModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

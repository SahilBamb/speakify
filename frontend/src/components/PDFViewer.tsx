"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import type { Chunk, PageDimension } from "@/lib/api";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfUrl: string;
  chunks: Chunk[];
  pageDimensions: PageDimension[];
  activeChunkIndex: number;
  onChunkClick: (index: number) => void;
}

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const DEFAULT_WIDTH = 680;

export default function PDFViewer({
  pdfUrl,
  chunks,
  pageDimensions,
  activeChunkIndex,
  onChunkClick,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const activeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrolledChunk = useRef(-1);

  const renderWidth = DEFAULT_WIDTH * zoom;
  const activeChunk = chunks[activeChunkIndex] ?? null;

  const chunksByPage = useMemo(() => {
    const map: Record<number, Chunk[]> = {};
    for (const c of chunks) {
      if (!map[c.page]) map[c.page] = [];
      map[c.page].push(c);
    }
    return map;
  }, [chunks]);

  useEffect(() => {
    if (activeRef.current && activeChunkIndex !== lastScrolledChunk.current) {
      lastScrolledChunk.current = activeChunkIndex;
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeChunkIndex]);

  const zoomIn = useCallback(() => {
    setZoom((z) => {
      const next = ZOOM_STEPS.find((s) => s > z);
      return next ?? z;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const prev = [...ZOOM_STEPS].reverse().find((s) => s < z);
      return prev ?? z;
    });
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, numPages));
      const el = document.getElementById(`pdf-page-${clamped}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [numPages]
  );

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(pageInput, 10);
    if (!isNaN(num)) {
      goToPage(num);
      setPageInput("");
    }
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full text-theme-muted">
        <p>Failed to load PDF. Make sure the backend is running.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Zoom & page controls */}
      <div className="glass-strong border-b border-[var(--glass-border)] px-4 py-2 flex items-center justify-between gap-4 shrink-0 z-10">
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={zoom <= ZOOM_STEPS[0]}
            className="p-1.5 rounded-lg text-theme-muted hover:text-theme-primary hover:bg-theme-hover transition-all disabled:opacity-30"
            title="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          </button>
          <span className="text-xs font-medium text-theme-secondary tabular-nums w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
            className="p-1.5 rounded-lg text-theme-muted hover:text-theme-primary hover:bg-theme-hover transition-all disabled:opacity-30"
            title="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <button
            onClick={() => setZoom(1)}
            className="ml-1 px-2 py-1 rounded-lg text-[10px] font-medium text-theme-muted hover:text-theme-primary hover:bg-theme-hover transition-all"
            title="Reset zoom"
          >
            Reset
          </button>
        </div>

        <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
          <span className="text-xs text-theme-muted">{numPages} pages</span>
          <input
            type="text"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            placeholder="Go to…"
            className="w-16 px-2 py-1 rounded-lg text-xs bg-theme-input border border-theme-input text-theme-primary placeholder:text-theme-muted focus:outline-none focus:ring-1 focus:ring-indigo-300"
          />
        </form>
      </div>

      {/* PDF content */}
      <div ref={containerRef} className="flex-1 overflow-auto px-4 py-6">
        <div className="flex flex-col items-center">
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            onLoadError={() => setLoadError(true)}
            loading={
              <div className="flex items-center justify-center py-32">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-indigo-400 rounded-full animate-spin" />
              </div>
            }
          >
            {Array.from({ length: numPages }, (_, i) => {
              const pageNum = i + 1;
              const dim = pageDimensions.find((p) => p.page_number === pageNum);
              const scale = dim ? renderWidth / dim.width : 1;
              const pageChunks = chunksByPage[pageNum] || [];

              return (
                <div key={pageNum} className="relative mb-4" id={`pdf-page-${pageNum}`}>
                  <div className="glass-strong rounded-xl overflow-hidden shadow-sm">
                    <Page
                      pageNumber={pageNum}
                      width={renderWidth}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                  <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
                    {pageChunks.map((chunk) => {
                      const isActive = activeChunk?.id === chunk.id;
                      const globalIdx = chunks.findIndex((c) => c.id === chunk.id);
                      const [x1, y1, x2, y2] = chunk.bbox;

                      return (
                        <div
                          key={chunk.id}
                          ref={isActive ? activeRef : null}
                          className={`absolute pointer-events-auto cursor-pointer transition-all duration-300 ${
                            isActive
                              ? "bg-theme-highlight ring-2 ring-theme-highlight rounded-sm"
                              : "hover:bg-theme-hover rounded-sm"
                          }`}
                          style={{
                            left: `${x1 * scale}px`,
                            top: `${y1 * scale}px`,
                            width: `${(x2 - x1) * scale}px`,
                            height: `${(y2 - y1) * scale}px`,
                          }}
                          onClick={() => onChunkClick(globalIdx)}
                        />
                      );
                    })}
                  </div>
                  <div className="absolute bottom-2 right-3 text-[10px] font-medium text-theme-muted pointer-events-none">
                    {pageNum}
                  </div>
                </div>
              );
            })}
          </Document>
        </div>
      </div>
    </div>
  );
}

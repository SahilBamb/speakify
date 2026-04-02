"use client";

import { useRef, useEffect } from "react";
import type { BookChunk } from "@/lib/api";

interface TextReaderProps {
  chapterTitle: string;
  chunks: BookChunk[];
  activeChunkIndex: number;
  onChunkClick: (index: number) => void;
  style?: React.CSSProperties;
}

export default function TextReader({
  chapterTitle,
  chunks,
  activeChunkIndex,
  onChunkClick,
  style,
}: TextReaderProps) {
  const activeRef = useRef<HTMLSpanElement>(null);
  const lastScrolled = useRef(-1);

  useEffect(() => {
    if (activeRef.current && activeChunkIndex !== lastScrolled.current) {
      lastScrolled.current = activeChunkIndex;
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeChunkIndex]);

  const paragraphs = groupIntoParagraphs(chunks);

  return (
    <div className="h-full overflow-y-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass-strong rounded-2xl px-5 py-8 sm:px-8 sm:py-10 md:px-12 shadow-sm">
          <h2 className="text-xl font-semibold text-theme-primary mb-8 text-center">
            {chapterTitle}
          </h2>

          <div className="space-y-5 text-base leading-relaxed text-theme-secondary" style={style}>
            {paragraphs.map((para, pi) => (
              <p key={pi}>
                {para.map((chunk) => {
                  const globalIdx = chunks.findIndex((c) => c.id === chunk.id);
                  const isActive = globalIdx === activeChunkIndex;

                  return (
                    <span
                      key={chunk.id}
                      ref={isActive ? activeRef : null}
                      onClick={() => onChunkClick(globalIdx)}
                      className={`cursor-pointer transition-all duration-300 rounded-sm px-0.5 -mx-0.5 ${
                        isActive
                          ? "bg-theme-highlight text-theme-highlight ring-1 ring-theme-highlight"
                          : "hover:bg-theme-hover"
                      }`}
                    >
                      {chunk.text}{" "}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function groupIntoParagraphs(chunks: BookChunk[]): BookChunk[][] {
  if (chunks.length === 0) return [];

  const paragraphs: BookChunk[][] = [[]];
  let prevSentenceIdx = -1;

  for (const chunk of chunks) {
    if (chunk.sentence_index <= prevSentenceIdx && paragraphs[paragraphs.length - 1].length > 0) {
      paragraphs.push([]);
    }
    paragraphs[paragraphs.length - 1].push(chunk);
    prevSentenceIdx = chunk.sentence_index;
  }

  return paragraphs.filter((p) => p.length > 0);
}

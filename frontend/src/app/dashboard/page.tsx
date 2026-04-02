"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import DocumentList from "@/components/DocumentList";
import BookGenerator from "@/components/BookGenerator";
import BookList from "@/components/BookList";

type Tab = "pdf" | "book";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("pdf");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50 shadow-sm shadow-black/[0.03]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center shadow-sm shadow-zinc-200/50">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-theme-primary tracking-tight">Speakify</h1>
              <p className="text-xs text-theme-muted">Listen to anything</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Tab toggle */}
        <div className="flex justify-center">
          <div className="glass rounded-xl p-1 inline-flex gap-1">
            <button
              onClick={() => setActiveTab("pdf")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "pdf"
                  ? "glass-strong shadow-sm text-theme-primary"
                  : "text-theme-muted hover:text-theme-secondary"
              }`}
            >
              Upload PDF
            </button>
            <button
              onClick={() => setActiveTab("book")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "book"
                  ? "glass-strong shadow-sm text-theme-primary"
                  : "text-theme-muted hover:text-theme-secondary"
              }`}
            >
              Listen to Any Book
            </button>
          </div>
        </div>

        {activeTab === "pdf" ? (
          <>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-theme-primary tracking-tight">
                Listen to your PDFs
              </h2>
              <p className="text-sm text-theme-muted max-w-md mx-auto">
                Upload a PDF and follow along as it&apos;s read aloud with real-time sentence highlighting.
              </p>
            </div>
            <UploadZone onUploadComplete={() => setRefreshKey((k) => k + 1)} />
            <DocumentList refreshKey={refreshKey} />
          </>
        ) : (
          <>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-theme-primary tracking-tight">
                Listen to any book
              </h2>
              <p className="text-sm text-theme-muted max-w-md mx-auto">
                Enter a topic or title and we&apos;ll generate a full book you can listen to chapter by chapter.
              </p>
            </div>
            <BookGenerator onGenerated={() => setRefreshKey((k) => k + 1)} />
            <BookList refreshKey={refreshKey} />
          </>
        )}
      </main>
    </div>
  );
}

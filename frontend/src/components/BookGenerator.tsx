"use client";

import { useState, useCallback } from "react";
import { generateBook, pollBookReady } from "@/lib/api";

interface BookGeneratorProps {
  onGenerated: () => void;
}

export default function BookGenerator({ onGenerated }: BookGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = topic.trim();
      if (!trimmed) return;

      setError(null);
      setGenerating(true);

      try {
        const book = await generateBook(trimmed);
        onGenerated();
        await pollBookReady(book.id);
        setTopic("");
        onGenerated();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setGenerating(false);
      }
    },
    [topic, onGenerated]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="glass rounded-2xl p-5 sm:p-8 shadow-md shadow-black/[0.04] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. &quot;Introduction to Quantum Physics&quot; or &quot;A mystery novel set in 1920s Paris&quot;"
            disabled={generating}
            className="flex-1 px-4 py-3 rounded-xl bg-theme-input border border-theme-input text-sm text-theme-primary placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-zinc-300/50 focus:border-zinc-300 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={generating || !topic.trim()}
            className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium shadow-md shadow-zinc-200/50 hover:shadow-lg hover:shadow-zinc-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:hover:scale-100 whitespace-nowrap"
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              "Generate Book"
            )}
          </button>
        </div>

        {generating && (
          <p className="text-xs text-slate-400 text-center animate-pulse">
            Generating outline with AI — this takes a few seconds...
          </p>
        )}

        {error && (
          <p className="text-sm text-rose-500 font-medium bg-rose-50/80 px-4 py-2 rounded-lg text-center">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

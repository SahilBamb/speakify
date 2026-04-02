"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { listBooks, deleteBook, type GeneratedBookInfo } from "@/lib/api";
import { DocumentListSkeleton } from "@/components/Skeleton";

interface BookListProps {
  refreshKey: number;
}

export default function BookList({ refreshKey }: BookListProps) {
  const [books, setBooks] = useState<GeneratedBookInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchBooks = useCallback(async () => {
    try {
      const data = await listBooks();
      setBooks(data);
    } catch {
      /* backend may not be running */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks, refreshKey]);

  useEffect(() => {
    const hasGenerating = books.some(
      (b) => b.status !== "ready" && b.status !== "failed"
    );
    if (!hasGenerating) return;
    const timer = setInterval(fetchBooks, 2000);
    return () => clearInterval(timer);
  }, [books, fetchBooks]);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this book?")) return;
    await deleteBook(id);
    fetchBooks();
  };

  if (loading) {
    return <DocumentListSkeleton />;
  }

  if (books.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-theme-muted uppercase tracking-wider px-1">
        Your Books
      </h2>
      <div className="grid gap-3">
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => book.status === "ready" && router.push(`/book/${book.id}`)}
            className={`glass rounded-xl px-5 py-4 flex items-center justify-between transition-all duration-200 ${
              book.status === "ready"
                ? "cursor-pointer hover:shadow-md hover:shadow-zinc-100/30 hover:scale-[1.002]"
                : "opacity-70"
            }`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                book.status === "ready" ? "bg-zinc-50" : book.status === "failed" ? "bg-rose-50" : "bg-amber-50"
              }`}>
                <svg className={`w-5 h-5 ${book.status === "ready" ? "text-zinc-400" : book.status === "failed" ? "text-rose-400" : "text-amber-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-theme-primary truncate">{book.title}</p>
                <p className="text-xs text-theme-muted mt-0.5">
                  {book.status === "ready"
                    ? `${book.chapter_count} chapter${book.chapter_count !== 1 ? "s" : ""}`
                    : book.status === "failed"
                    ? book.error_message || "Generation failed"
                    : "Generating..."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {book.status === "ready" && (
                <span className="text-xs font-medium text-emerald-500 bg-emerald-50/80 px-2.5 py-1 rounded-full">
                  Ready
                </span>
              )}
              {book.status === "failed" && (
                <span className="text-xs font-medium text-rose-500 bg-rose-50/80 px-2.5 py-1 rounded-full">
                  Failed
                </span>
              )}
              <button
                onClick={(e) => handleDelete(book.id, e)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-rose-50/60 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

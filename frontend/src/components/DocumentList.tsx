"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { listDocuments, deleteDocument, type DocumentInfo } from "@/lib/api";
import { DocumentListSkeleton } from "@/components/Skeleton";

interface DocumentListProps {
  refreshKey: number;
}

export default function DocumentList({ refreshKey }: DocumentListProps) {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchDocs = useCallback(async () => {
    try {
      const data = await listDocuments();
      setDocuments(data);
    } catch {
      /* backend may not be running */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs, refreshKey]);

  useEffect(() => {
    const hasProcessing = documents.some(
      (d) => d.status !== "ready" && d.status !== "failed"
    );
    if (!hasProcessing) return;
    const timer = setInterval(fetchDocs, 2000);
    return () => clearInterval(timer);
  }, [documents, fetchDocs]);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this document?")) return;
    await deleteDocument(id);
    fetchDocs();
  };

  if (loading) {
    return <DocumentListSkeleton />;
  }

  if (documents.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-theme-muted uppercase tracking-wider px-1">
        Your Documents
      </h2>
      <div className="grid gap-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => doc.status === "ready" && router.push(`/reader/${doc.id}`)}
            className={`
              glass rounded-xl px-5 py-4 flex items-center justify-between
              transition-all duration-200
              ${doc.status === "ready"
                ? "cursor-pointer hover:shadow-md hover:shadow-indigo-100/30 hover:scale-[1.002]"
                : "opacity-70"
              }
            `}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                ${doc.status === "ready" ? "bg-indigo-50" : doc.status === "failed" ? "bg-rose-50" : "bg-amber-50"}
              `}>
                <svg className={`w-5 h-5 ${doc.status === "ready" ? "text-indigo-400" : doc.status === "failed" ? "text-rose-400" : "text-amber-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-theme-primary truncate">{doc.title}</p>
                <p className="text-xs text-theme-muted mt-0.5">
                  {doc.status === "ready"
                    ? `${doc.page_count} page${doc.page_count !== 1 ? "s" : ""}`
                    : doc.status === "failed"
                    ? doc.error_message || "Processing failed"
                    : "Processing..."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {doc.status === "ready" && (
                <span className="text-xs font-medium text-emerald-500 bg-emerald-50/80 px-2.5 py-1 rounded-full">
                  Ready
                </span>
              )}
              {doc.status === "failed" && (
                <span className="text-xs font-medium text-rose-500 bg-rose-50/80 px-2.5 py-1 rounded-full">
                  Failed
                </span>
              )}
              <button
                onClick={(e) => handleDelete(doc.id, e)}
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

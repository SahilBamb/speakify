"use client";

import { useState, useCallback, useRef } from "react";
import { uploadDocument } from "@/lib/api";

interface UploadZoneProps {
  onUploadComplete: () => void;
}

export default function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        setError("Please upload a PDF file");
        return;
      }
      setError(null);
      setUploading(true);
      setProgress("Uploading and processing...");

      try {
        const data = await uploadDocument(file);
        if (data.status === "failed") {
          setError(data.error || "Processing failed");
        } else {
          setProgress("Ready!");
          onUploadComplete();
        }
      } catch {
        setError("Upload failed. Is the backend running?");
      } finally {
        setUploading(false);
        setProgress("");
      }
    },
    [onUploadComplete]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        glass rounded-2xl p-8 sm:p-12 text-center cursor-pointer
        transition-all duration-300 ease-out
        ${dragging
          ? "shadow-lg shadow-indigo-200/50 scale-[1.01] border-indigo-300/60"
          : "shadow-md shadow-black/[0.04] hover:shadow-lg hover:shadow-indigo-100/40 hover:scale-[1.005]"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />

      <div className="flex flex-col items-center gap-4">
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          transition-colors duration-300
          ${dragging ? "bg-indigo-100" : "bg-slate-100/80"}
        `}>
          <svg className={`w-7 h-7 transition-colors ${dragging ? "text-indigo-500" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
          </svg>
        </div>

        {uploading ? (
          <div className="space-y-2">
            <div className="w-48 h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-400 rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-sm text-slate-500 font-medium">{progress}</p>
          </div>
        ) : (
          <>
            <div>
              <p className="text-base font-medium text-theme-primary">
                Drop a PDF here or click to browse
              </p>
              <p className="text-sm text-theme-muted mt-1">
                Text-based PDFs work best
              </p>
            </div>
          </>
        )}

        {error && (
          <p className="text-sm text-rose-500 font-medium bg-rose-50/80 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

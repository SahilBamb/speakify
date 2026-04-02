export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  { retries = 2, backoffMs = 500 }: { retries?: number; backoffMs?: number } = {},
): Promise<Response> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30_000);
      const res = await fetch(input, { ...init, signal: init?.signal ?? controller.signal });
      clearTimeout(timeoutId);
      if (res.status >= 500 && attempt < retries) {
        await new Promise((r) => setTimeout(r, backoffMs * 2 ** attempt));
        continue;
      }
      return res;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, backoffMs * 2 ** attempt));
      }
    }
  }
  throw lastError ?? new Error("Fetch failed after retries");
}

export interface DocumentInfo {
  id: number;
  title: string;
  original_filename: string;
  status: string;
  page_count: number;
  created_at: string | null;
  error_message: string | null;
}

export interface PageDimension {
  page_number: number;
  width: number;
  height: number;
}

export interface DocumentDetail {
  id: number;
  title: string;
  status: string;
  page_count: number;
  error_message: string | null;
  pages: PageDimension[];
}

export interface Chunk {
  id: number;
  page: number;
  paragraph_index: number;
  sentence_index: number;
  text: string;
  bbox: [number, number, number, number];
  char_count: number;
  estimated_duration_ms: number;
  sequence_order: number;
}

export interface ReadingProgressData {
  document_id: number;
  current_chunk_id: number | null;
  current_page: number;
}

export async function uploadDocument(file: File): Promise<{ document_id: number; status: string; error?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/api/upload`, { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Upload failed");
  }
  return res.json();
}

export async function listDocuments(): Promise<DocumentInfo[]> {
  const res = await fetchWithRetry(`${API_BASE}/api/documents`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function getDocument(id: number): Promise<DocumentDetail> {
  const res = await fetchWithRetry(`${API_BASE}/api/documents/${id}`);
  if (!res.ok) throw new Error("Document not found");
  return res.json();
}

export async function getChunks(id: number): Promise<{ document_id: number; chunks: Chunk[] }> {
  const res = await fetchWithRetry(`${API_BASE}/api/documents/${id}/chunks`);
  if (!res.ok) throw new Error("Failed to fetch chunks");
  return res.json();
}

export function getPdfUrl(id: number): string {
  return `${API_BASE}/api/documents/${id}/pdf`;
}

export async function getProgress(id: number): Promise<ReadingProgressData> {
  const res = await fetchWithRetry(`${API_BASE}/api/documents/${id}/progress`);
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
}

export async function saveProgress(id: number, data: { current_chunk_id: number | null; current_page: number }): Promise<void> {
  await fetch(`${API_BASE}/api/documents/${id}/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteDocument(id: number): Promise<void> {
  await fetch(`${API_BASE}/api/documents/${id}`, { method: "DELETE" });
}

// ===================== Generated Books =====================

export interface BookChapterInfo {
  number: number;
  title: string;
  summary: string;
  status: string;
}

export interface GeneratedBookInfo {
  id: number;
  title: string;
  topic: string;
  description: string | null;
  chapter_count: number;
  status: string;
  created_at: string | null;
  error_message: string | null;
}

export interface GeneratedBookDetail {
  id: number;
  title: string;
  topic: string;
  description: string | null;
  chapter_count: number;
  status: string;
  chapters: BookChapterInfo[];
}

export interface BookChunk {
  id: number;
  sentence_index: number;
  text: string;
  estimated_duration_ms: number;
  sequence_order: number;
}

export interface ChapterChunksResponse {
  book_id: number;
  chapter_number: number;
  chapter_title: string;
  chapter_status: string;
  chunks: BookChunk[];
}

export interface BookProgressData {
  book_id: number;
  current_chapter: number;
  current_chunk_id: number | null;
}

export async function generateBook(topic: string): Promise<GeneratedBookInfo> {
  const res = await fetch(`${API_BASE}/api/books/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Generation failed" }));
    throw new Error(err.detail || "Generation failed");
  }
  return res.json();
}

export async function pollBookReady(bookId: number, intervalMs = 1500, maxAttempts = 60): Promise<GeneratedBookDetail> {
  for (let i = 0; i < maxAttempts; i++) {
    const book = await getBook(bookId);
    if (book.status === "ready") return book;
    if (book.status === "failed") throw new Error("Book generation failed");
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Book generation timed out");
}

export async function listBooks(): Promise<GeneratedBookInfo[]> {
  const res = await fetchWithRetry(`${API_BASE}/api/books`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function getBook(id: number): Promise<GeneratedBookDetail> {
  const res = await fetchWithRetry(`${API_BASE}/api/books/${id}`);
  if (!res.ok) throw new Error("Book not found");
  return res.json();
}

export async function generateChapter(bookId: number, chapterNum: number): Promise<ChapterChunksResponse> {
  const res = await fetch(`${API_BASE}/api/books/${bookId}/chapters/${chapterNum}/generate`, {
    method: "POST",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Chapter generation failed" }));
    throw new Error(err.detail || "Chapter generation failed");
  }
  return res.json();
}

export async function pollChapterReady(bookId: number, chapterNum: number, intervalMs = 2000, maxAttempts = 90): Promise<ChapterChunksResponse> {
  for (let i = 0; i < maxAttempts; i++) {
    const data = await getChapterChunks(bookId, chapterNum);
    if (data.chapter_status === "ready") return data;
    if (data.chapter_status === "failed") throw new Error("Chapter generation failed");
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Chapter generation timed out");
}

export async function getChapterChunks(bookId: number, chapterNum: number): Promise<ChapterChunksResponse> {
  const res = await fetchWithRetry(`${API_BASE}/api/books/${bookId}/chapters/${chapterNum}/chunks`);
  if (!res.ok) throw new Error("Failed to fetch chapter chunks");
  return res.json();
}

export function getBookAudioUrl(bookId: number, chapterNumber: number, sequenceOrder: number): string {
  return `${API_BASE}/api/book-audio/${bookId}/${chapterNumber}/${sequenceOrder}`;
}

export async function getBookProgress(id: number): Promise<BookProgressData> {
  const res = await fetchWithRetry(`${API_BASE}/api/books/${id}/progress`);
  if (!res.ok) throw new Error("Failed to fetch book progress");
  return res.json();
}

export async function saveBookProgress(id: number, data: { current_chapter: number; current_chunk_id: number | null }): Promise<void> {
  await fetch(`${API_BASE}/api/books/${id}/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteBook(id: number): Promise<void> {
  await fetch(`${API_BASE}/api/books/${id}`, { method: "DELETE" });
}

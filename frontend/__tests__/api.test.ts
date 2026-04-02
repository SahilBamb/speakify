import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import {
  API_BASE,
  listDocuments,
  getDocument,
  getChunks,
  getProgress,
  listBooks,
  getBook,
  getBookProgress,
} from "@/lib/api";

beforeEach(() => {
  mockFetch.mockReset();
});

describe("API_BASE", () => {
  it("defaults to localhost", () => {
    expect(API_BASE).toBe("http://localhost:8000");
  });
});

describe("listDocuments", () => {
  it("fetches and returns documents", async () => {
    const docs = [{ id: 1, title: "Test" }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(docs),
    });

    const result = await listDocuments();
    expect(result).toEqual(docs);
    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/api/documents`,
      expect.objectContaining({}),
    );
  });

  it("throws on error response after retries exhausted", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(listDocuments()).rejects.toThrow("Failed to fetch documents");
  });
});

describe("getDocument", () => {
  it("fetches a single document", async () => {
    const doc = { id: 1, title: "Test", pages: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(doc),
    });

    const result = await getDocument(1);
    expect(result).toEqual(doc);
  });

  it("throws on 404", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(getDocument(999)).rejects.toThrow("Document not found");
  });
});

describe("getChunks", () => {
  it("fetches chunks for a document", async () => {
    const data = { document_id: 1, chunks: [{ id: 1, text: "Hello" }] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(data),
    });

    const result = await getChunks(1);
    expect(result.chunks).toHaveLength(1);
  });
});

describe("getProgress", () => {
  it("fetches reading progress", async () => {
    const progress = { document_id: 1, current_chunk_id: 5, current_page: 3 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(progress),
    });

    const result = await getProgress(1);
    expect(result.current_page).toBe(3);
  });
});

describe("listBooks", () => {
  it("fetches and returns books", async () => {
    const books = [{ id: 1, title: "AI Book" }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(books),
    });

    const result = await listBooks();
    expect(result).toEqual(books);
  });
});

describe("getBook", () => {
  it("fetches a single book", async () => {
    const book = { id: 1, title: "AI", chapters: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(book),
    });

    const result = await getBook(1);
    expect(result.title).toBe("AI");
  });
});

describe("getBookProgress", () => {
  it("fetches book progress", async () => {
    const progress = { book_id: 1, current_chapter: 2, current_chunk_id: 10 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(progress),
    });

    const result = await getBookProgress(1);
    expect(result.current_chapter).toBe(2);
  });
});

describe("retry behavior", () => {
  it("retries on 500 errors", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      });

    const result = await listDocuments();
    expect(result).toEqual([]);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("retries on network error", async () => {
    mockFetch
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      });

    const result = await listDocuments();
    expect(result).toEqual([]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

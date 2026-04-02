from pydantic import BaseModel, Field
from datetime import datetime


# ── Shared ──

class StatusResponse(BaseModel):
    status: str


# ── Documents ──

class UploadResponse(BaseModel):
    document_id: int
    status: str
    error: str | None = None


class DocumentListItem(BaseModel):
    id: int
    title: str
    original_filename: str
    status: str
    page_count: int
    created_at: str | None = None
    error_message: str | None = None


class PageDimension(BaseModel):
    page_number: int
    width: float
    height: float


class DocumentDetail(BaseModel):
    id: int
    title: str
    status: str
    page_count: int
    error_message: str | None = None
    pages: list[PageDimension]


class ChunkItem(BaseModel):
    id: int
    page: int
    paragraph_index: int
    sentence_index: int
    text: str
    bbox: list[float]
    char_count: int
    estimated_duration_ms: int
    sequence_order: int


class ChunksResponse(BaseModel):
    document_id: int
    chunks: list[ChunkItem]


class SaveProgressRequest(BaseModel):
    current_chunk_id: int | None = None
    current_page: int = 1


class ProgressResponse(BaseModel):
    document_id: int
    current_chunk_id: int | None = None
    current_page: int = 1


# ── Generated Books ──

class GenerateBookRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=500)


class BookChapterItem(BaseModel):
    number: int
    title: str
    summary: str
    status: str


class BookListItem(BaseModel):
    id: int
    title: str
    topic: str
    description: str | None = None
    chapter_count: int
    status: str
    created_at: str | None = None
    error_message: str | None = None


class BookDetail(BaseModel):
    id: int
    title: str
    topic: str
    description: str | None = None
    chapter_count: int
    status: str
    chapters: list[BookChapterItem]


class BookChunkItem(BaseModel):
    id: int
    sentence_index: int
    text: str
    estimated_duration_ms: int
    sequence_order: int


class ChapterChunksResponse(BaseModel):
    book_id: int
    chapter_number: int
    chapter_title: str
    chapter_status: str
    chunks: list[BookChunkItem]


class SaveBookProgressRequest(BaseModel):
    current_chapter: int = 1
    current_chunk_id: int | None = None


class BookProgressResponse(BaseModel):
    book_id: int
    current_chapter: int = 1
    current_chunk_id: int | None = None

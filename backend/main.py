import logging
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path
from datetime import datetime
import shutil
import threading
import time

from log_config import setup_logging, generate_request_id, request_id_var

setup_logging()
logger = logging.getLogger("speechify")

from database import (
    init_db, get_db, SessionLocal, Document, TextChunk, PageInfo, ReadingProgress,
    GeneratedBook, BookChapter, BookChunk as BookChunkModel, BookReadingProgress,
)
from processing import process_pdf, segment_sentences, estimate_duration_ms
from tts import (
    generate_audio_for_chunks, get_audio_path, cleanup_document_audio,
    generate_audio_for_book_chunks, get_book_audio_path, cleanup_book_audio,
)
from llm import generate_book_outline, generate_chapter_content
from schemas import (
    StatusResponse, UploadResponse, DocumentListItem, DocumentDetail,
    PageDimension, ChunkItem, ChunksResponse, SaveProgressRequest,
    ProgressResponse, GenerateBookRequest, BookChapterItem, BookListItem,
    BookDetail, BookChunkItem, ChapterChunksResponse, SaveBookProgressRequest,
    BookProgressResponse,
)

app = FastAPI(title="Speechify PDF Reader API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    rid = request.headers.get("X-Request-Id") or generate_request_id()
    request_id_var.set(rid)
    start = time.perf_counter()
    response = await call_next(request)
    elapsed = (time.perf_counter() - start) * 1000
    logger.info("%s %s %d %.0fms", request.method, request.url.path, response.status_code, elapsed)
    response.headers["X-Request-Id"] = rid
    return response

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


@app.on_event("startup")
def startup():
    init_db()


def _process_document_background(doc_id: int, file_path: str):
    """Runs PDF extraction + TTS in a background thread."""
    logger.info("Processing document %d from %s", doc_id, file_path)
    db = SessionLocal()
    try:
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if not doc:
            return

        chunks_data, pages_data, page_count = process_pdf(file_path)

        if not chunks_data:
            doc.status = "failed"
            doc.error_message = "No extractable text found in this PDF"
            doc.extractable_text = False
            db.commit()
            logger.warning("Document %d has no extractable text", doc_id)
            return

        for pi in pages_data:
            db.add(PageInfo(document_id=doc_id, **pi))

        logger.info("Generating TTS for %d chunks (doc %d)", len(chunks_data), doc_id)
        durations = generate_audio_for_chunks(doc_id, chunks_data)

        for chunk_data in chunks_data:
            actual_dur = durations.get(chunk_data["sequence_order"])
            if actual_dur is not None:
                chunk_data["estimated_duration_ms"] = actual_dur
            db.add(TextChunk(document_id=doc_id, **chunk_data))

        doc.status = "ready"
        doc.page_count = page_count
        db.commit()
        logger.info("Document %d ready (%d pages, %d chunks)", doc_id, page_count, len(chunks_data))

    except Exception as e:
        logger.exception("Document %d processing failed", doc_id)
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if doc:
            doc.status = "failed"
            doc.error_message = str(e)
            db.commit()
    finally:
        db.close()


@app.post("/api/upload", response_model=UploadResponse, status_code=202)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    doc = Document(
        title=file.filename.rsplit(".", 1)[0],
        original_filename=file.filename,
        storage_path="",
        status="processing",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    file_path = UPLOAD_DIR / f"{doc.id}.pdf"
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    doc.storage_path = str(file_path)
    db.commit()

    threading.Thread(
        target=_process_document_background,
        args=(doc.id, str(file_path)),
        daemon=True,
    ).start()

    return UploadResponse(document_id=doc.id, status="processing")


@app.get("/api/documents", response_model=list[DocumentListItem])
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    return [
        DocumentListItem(
            id=d.id,
            title=d.title,
            original_filename=d.original_filename,
            status=d.status,
            page_count=d.page_count,
            created_at=d.created_at.isoformat() if d.created_at else None,
            error_message=d.error_message,
        )
        for d in docs
    ]


@app.get("/api/documents/{doc_id}", response_model=DocumentDetail)
def get_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    pages = (
        db.query(PageInfo)
        .filter(PageInfo.document_id == doc_id)
        .order_by(PageInfo.page_number)
        .all()
    )
    return DocumentDetail(
        id=doc.id,
        title=doc.title,
        status=doc.status,
        page_count=doc.page_count,
        error_message=doc.error_message,
        pages=[
            PageDimension(page_number=p.page_number, width=p.width, height=p.height)
            for p in pages
        ],
    )


@app.get("/api/documents/{doc_id}/chunks", response_model=ChunksResponse)
def get_chunks(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    chunks = (
        db.query(TextChunk)
        .filter(TextChunk.document_id == doc_id)
        .order_by(TextChunk.sequence_order)
        .all()
    )
    return ChunksResponse(
        document_id=doc_id,
        chunks=[
            ChunkItem(
                id=c.id,
                page=c.page_number,
                paragraph_index=c.paragraph_index,
                sentence_index=c.sentence_index,
                text=c.text,
                bbox=[c.bbox_x1, c.bbox_y1, c.bbox_x2, c.bbox_y2],
                char_count=c.char_count,
                estimated_duration_ms=c.estimated_duration_ms,
                sequence_order=c.sequence_order,
            )
            for c in chunks
        ],
    )


@app.get("/api/documents/{doc_id}/pdf")
def serve_pdf(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = Path(doc.storage_path)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="PDF file not found")

    return FileResponse(
        path=str(file_path),
        media_type="application/pdf",
        filename=doc.original_filename,
        headers={"Access-Control-Allow-Origin": "http://localhost:3000"},
    )


@app.get("/api/audio/{doc_id}/{sequence_order}")
def serve_audio(doc_id: int, sequence_order: int):
    audio_path = get_audio_path(doc_id, sequence_order)
    if not audio_path.exists():
        raise HTTPException(status_code=404, detail="Audio not found")
    return FileResponse(
        path=str(audio_path),
        media_type="audio/wav",
        headers={"Access-Control-Allow-Origin": "http://localhost:3000"},
    )


@app.get("/api/documents/{doc_id}/progress", response_model=ProgressResponse)
def get_progress(doc_id: int, db: Session = Depends(get_db)):
    progress = db.query(ReadingProgress).filter(ReadingProgress.document_id == doc_id).first()
    if not progress:
        return ProgressResponse(document_id=doc_id, current_chunk_id=None, current_page=1)
    return ProgressResponse(
        document_id=doc_id,
        current_chunk_id=progress.current_chunk_id,
        current_page=progress.current_page,
    )


@app.post("/api/documents/{doc_id}/progress", response_model=StatusResponse)
def save_progress(doc_id: int, data: SaveProgressRequest, db: Session = Depends(get_db)):
    progress = db.query(ReadingProgress).filter(ReadingProgress.document_id == doc_id).first()
    if not progress:
        progress = ReadingProgress(document_id=doc_id)
        db.add(progress)
    progress.current_chunk_id = data.current_chunk_id
    progress.current_page = data.current_page
    progress.updated_at = datetime.utcnow()
    db.commit()
    return StatusResponse(status="saved")


@app.delete("/api/documents/{doc_id}", response_model=StatusResponse)
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = Path(doc.storage_path)
    if file_path.exists():
        file_path.unlink()

    cleanup_document_audio(doc_id)

    db.query(TextChunk).filter(TextChunk.document_id == doc_id).delete()
    db.query(PageInfo).filter(PageInfo.document_id == doc_id).delete()
    db.query(ReadingProgress).filter(ReadingProgress.document_id == doc_id).delete()
    db.query(Document).filter(Document.id == doc_id).delete()
    db.commit()
    return StatusResponse(status="deleted")


# ===================== Generated Books =====================


def _generate_book_background(book_id: int, topic: str):
    """Runs book outline generation in a background thread."""
    logger.info("Generating book outline for book %d, topic=%r", book_id, topic)
    db = SessionLocal()
    try:
        book = db.query(GeneratedBook).filter(GeneratedBook.id == book_id).first()
        if not book:
            return

        outline = generate_book_outline(topic)

        book.title = outline.get("title", topic)
        book.description = outline.get("description", "")
        book.chapter_count = len(outline.get("chapters", []))
        book.status = "ready"

        for ch in outline.get("chapters", []):
            db.add(BookChapter(
                book_id=book.id,
                chapter_number=ch["number"],
                title=ch["title"],
                summary=ch.get("summary", ""),
                status="pending",
            ))

        db.commit()
        logger.info("Book %d ready: %r (%d chapters)", book_id, book.title, book.chapter_count)
    except Exception as e:
        logger.exception("Book %d outline generation failed", book_id)
        book = db.query(GeneratedBook).filter(GeneratedBook.id == book_id).first()
        if book:
            book.status = "failed"
            book.error_message = str(e)
            db.commit()
    finally:
        db.close()


@app.post("/api/books/generate", response_model=BookListItem, status_code=202)
def create_book(data: GenerateBookRequest, db: Session = Depends(get_db)):
    topic = data.topic.strip()

    book = GeneratedBook(title=topic, topic=topic, status="generating_outline")
    db.add(book)
    db.commit()
    db.refresh(book)

    threading.Thread(
        target=_generate_book_background,
        args=(book.id, topic),
        daemon=True,
    ).start()

    return BookListItem(
        id=book.id,
        title=book.title,
        topic=book.topic,
        description=book.description,
        chapter_count=book.chapter_count,
        status=book.status,
        created_at=book.created_at.isoformat() if book.created_at else None,
        error_message=book.error_message,
    )


@app.get("/api/books", response_model=list[BookListItem])
def list_books(db: Session = Depends(get_db)):
    books = db.query(GeneratedBook).order_by(GeneratedBook.created_at.desc()).all()
    return [
        BookListItem(
            id=b.id,
            title=b.title,
            topic=b.topic,
            description=b.description,
            chapter_count=b.chapter_count,
            status=b.status,
            created_at=b.created_at.isoformat() if b.created_at else None,
            error_message=b.error_message,
        )
        for b in books
    ]


@app.get("/api/books/{book_id}", response_model=BookDetail)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(GeneratedBook).filter(GeneratedBook.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    chapters = (
        db.query(BookChapter)
        .filter(BookChapter.book_id == book_id)
        .order_by(BookChapter.chapter_number)
        .all()
    )
    return BookDetail(
        id=book.id,
        title=book.title,
        topic=book.topic,
        description=book.description,
        chapter_count=book.chapter_count,
        status=book.status,
        chapters=[
            BookChapterItem(number=c.chapter_number, title=c.title,
                            summary=c.summary or "", status=c.status)
            for c in chapters
        ],
    )


def _generate_chapter_background(book_id: int, chapter_num: int):
    """Runs chapter content generation + TTS in a background thread."""
    logger.info("Generating chapter %d for book %d", chapter_num, book_id)
    db = SessionLocal()
    try:
        book = db.query(GeneratedBook).filter(GeneratedBook.id == book_id).first()
        chapter = (
            db.query(BookChapter)
            .filter(BookChapter.book_id == book_id, BookChapter.chapter_number == chapter_num)
            .first()
        )
        if not book or not chapter:
            return

        prev_chapters = (
            db.query(BookChapter)
            .filter(BookChapter.book_id == book_id, BookChapter.chapter_number < chapter_num)
            .order_by(BookChapter.chapter_number)
            .all()
        )
        prev_context = "\n".join(
            f"Chapter {c.chapter_number} ({c.title}): {c.summary}"
            for c in prev_chapters
        )

        content = generate_chapter_content(
            book_title=book.title,
            chapter_number=chapter_num,
            chapter_title=chapter.title,
            chapter_summary=chapter.summary or "",
            previous_context=prev_context,
        )
        chapter.content = content

        paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
        chunks_data: list[dict] = []
        seq = 0
        for para in paragraphs:
            sentences = segment_sentences(para)
            for si, sentence in enumerate(sentences):
                seq += 1
                chunks_data.append({
                    "sentence_index": si,
                    "text": sentence,
                    "estimated_duration_ms": estimate_duration_ms(sentence),
                    "sequence_order": seq,
                })

        if chunks_data:
            logger.info("Generating TTS for %d chunks (book %d, ch %d)", len(chunks_data), book_id, chapter_num)
            durations = generate_audio_for_book_chunks(book_id, chapter_num, chunks_data)
            for cd in chunks_data:
                actual = durations.get(cd["sequence_order"])
                if actual is not None:
                    cd["estimated_duration_ms"] = actual
                db.add(BookChunkModel(
                    book_id=book_id,
                    chapter_number=chapter_num,
                    **cd,
                ))

        chapter.status = "ready"
        db.commit()
        logger.info("Chapter %d of book %d ready (%d chunks)", chapter_num, book_id, len(chunks_data))
    except Exception as e:
        logger.exception("Chapter %d of book %d failed", chapter_num, book_id)
        chapter = (
            db.query(BookChapter)
            .filter(BookChapter.book_id == book_id, BookChapter.chapter_number == chapter_num)
            .first()
        )
        if chapter:
            chapter.status = "failed"
            db.commit()
    finally:
        db.close()


@app.post("/api/books/{book_id}/chapters/{chapter_num}/generate", response_model=ChapterChunksResponse, status_code=202)
def gen_chapter(book_id: int, chapter_num: int, db: Session = Depends(get_db)):
    book = db.query(GeneratedBook).filter(GeneratedBook.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    chapter = (
        db.query(BookChapter)
        .filter(BookChapter.book_id == book_id, BookChapter.chapter_number == chapter_num)
        .first()
    )
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    if chapter.status == "ready":
        return _chapter_chunks_response(book_id, chapter_num, db)

    if chapter.status == "generating":
        return _chapter_chunks_response(book_id, chapter_num, db)

    chapter.status = "generating"
    db.commit()

    threading.Thread(
        target=_generate_chapter_background,
        args=(book_id, chapter_num),
        daemon=True,
    ).start()

    return _chapter_chunks_response(book_id, chapter_num, db)


@app.get("/api/books/{book_id}/chapters/{chapter_num}/chunks", response_model=ChapterChunksResponse)
def get_chapter_chunks(book_id: int, chapter_num: int, db: Session = Depends(get_db)):
    return _chapter_chunks_response(book_id, chapter_num, db)


def _chapter_chunks_response(book_id: int, chapter_num: int, db: Session) -> ChapterChunksResponse:
    chapter = (
        db.query(BookChapter)
        .filter(BookChapter.book_id == book_id, BookChapter.chapter_number == chapter_num)
        .first()
    )
    chunks = (
        db.query(BookChunkModel)
        .filter(BookChunkModel.book_id == book_id, BookChunkModel.chapter_number == chapter_num)
        .order_by(BookChunkModel.sequence_order)
        .all()
    )
    return ChapterChunksResponse(
        book_id=book_id,
        chapter_number=chapter_num,
        chapter_title=chapter.title if chapter else "",
        chapter_status=chapter.status if chapter else "pending",
        chunks=[
            BookChunkItem(
                id=c.id,
                sentence_index=c.sentence_index,
                text=c.text,
                estimated_duration_ms=c.estimated_duration_ms,
                sequence_order=c.sequence_order,
            )
            for c in chunks
        ],
    )


@app.get("/api/book-audio/{book_id}/{chapter_num}/{sequence_order}")
def serve_book_audio(book_id: int, chapter_num: int, sequence_order: int):
    audio_path = get_book_audio_path(book_id, chapter_num, sequence_order)
    if not audio_path.exists():
        raise HTTPException(status_code=404, detail="Audio not found")
    return FileResponse(
        path=str(audio_path),
        media_type="audio/wav",
        headers={"Access-Control-Allow-Origin": "http://localhost:3000"},
    )


@app.get("/api/books/{book_id}/progress", response_model=BookProgressResponse)
def get_book_progress(book_id: int, db: Session = Depends(get_db)):
    prog = db.query(BookReadingProgress).filter(BookReadingProgress.book_id == book_id).first()
    if not prog:
        return BookProgressResponse(book_id=book_id, current_chapter=1, current_chunk_id=None)
    return BookProgressResponse(
        book_id=book_id,
        current_chapter=prog.current_chapter,
        current_chunk_id=prog.current_chunk_id,
    )


@app.post("/api/books/{book_id}/progress", response_model=StatusResponse)
def save_book_progress(book_id: int, data: SaveBookProgressRequest, db: Session = Depends(get_db)):
    prog = db.query(BookReadingProgress).filter(BookReadingProgress.book_id == book_id).first()
    if not prog:
        prog = BookReadingProgress(book_id=book_id)
        db.add(prog)
    prog.current_chapter = data.current_chapter
    prog.current_chunk_id = data.current_chunk_id
    prog.updated_at = datetime.utcnow()
    db.commit()
    return StatusResponse(status="saved")


@app.delete("/api/books/{book_id}", response_model=StatusResponse)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(GeneratedBook).filter(GeneratedBook.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    cleanup_book_audio(book_id)

    db.query(BookChunkModel).filter(BookChunkModel.book_id == book_id).delete()
    db.query(BookChapter).filter(BookChapter.book_id == book_id).delete()
    db.query(BookReadingProgress).filter(BookReadingProgress.book_id == book_id).delete()
    db.query(GeneratedBook).filter(GeneratedBook.id == book_id).delete()
    db.commit()
    return StatusResponse(status="deleted")

from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
from pathlib import Path

DB_PATH = Path(__file__).parent / "speechify.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    storage_path = Column(String, nullable=False)
    status = Column(String, default="processing")
    page_count = Column(Integer, default=0)
    extractable_text = Column(Boolean, default=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class TextChunk(Base):
    __tablename__ = "text_chunks"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, nullable=False, index=True)
    page_number = Column(Integer, nullable=False)
    paragraph_index = Column(Integer, nullable=False)
    sentence_index = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    bbox_x1 = Column(Float, nullable=False)
    bbox_y1 = Column(Float, nullable=False)
    bbox_x2 = Column(Float, nullable=False)
    bbox_y2 = Column(Float, nullable=False)
    char_count = Column(Integer, nullable=False)
    estimated_duration_ms = Column(Integer, nullable=False)
    sequence_order = Column(Integer, nullable=False)


class PageInfo(Base):
    __tablename__ = "page_info"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, nullable=False, index=True)
    page_number = Column(Integer, nullable=False)
    width = Column(Float, nullable=False)
    height = Column(Float, nullable=False)


class ReadingProgress(Base):
    __tablename__ = "reading_progress"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, nullable=False, unique=True, index=True)
    current_chunk_id = Column(Integer, nullable=True)
    current_page = Column(Integer, default=1)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class GeneratedBook(Base):
    __tablename__ = "generated_books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    chapter_count = Column(Integer, default=0)
    status = Column(String, default="generating_outline")
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class BookChapter(Base):
    __tablename__ = "book_chapters"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, nullable=False, index=True)
    chapter_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    status = Column(String, default="pending")


class BookChunk(Base):
    __tablename__ = "book_chunks"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, nullable=False, index=True)
    chapter_number = Column(Integer, nullable=False)
    sentence_index = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    estimated_duration_ms = Column(Integer, nullable=False)
    sequence_order = Column(Integer, nullable=False)


class BookReadingProgress(Base):
    __tablename__ = "book_reading_progress"
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, nullable=False, unique=True, index=True)
    current_chapter = Column(Integer, default=1)
    current_chunk_id = Column(Integer, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

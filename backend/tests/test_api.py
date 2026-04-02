import sys
import io
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))


def _make_minimal_pdf() -> bytes:
    """Create a minimal valid PDF with text."""
    try:
        import fitz
        doc = fitz.open()
        page = doc.new_page()
        page.insert_text((72, 72), "Hello world. This is a test. Another sentence here.")
        data = doc.tobytes()
        doc.close()
        return data
    except Exception:
        return b"%PDF-1.0\n"


class TestDocumentUpload:
    def test_upload_pdf(self, client):
        pdf_bytes = _make_minimal_pdf()
        response = client.post(
            "/api/upload",
            files={"file": ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf")},
        )
        assert response.status_code == 202
        data = response.json()
        assert "document_id" in data
        assert data["status"] == "processing"

    def test_upload_non_pdf_rejected(self, client):
        response = client.post(
            "/api/upload",
            files={"file": ("test.txt", io.BytesIO(b"hello"), "text/plain")},
        )
        assert response.status_code == 400

    def test_list_documents(self, client):
        response = client.get("/api/documents")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_get_nonexistent_document(self, client):
        response = client.get("/api/documents/9999")
        assert response.status_code == 404


class TestDocumentProgress:
    def test_get_default_progress(self, client):
        response = client.get("/api/documents/1/progress")
        assert response.status_code == 200
        data = response.json()
        assert data["current_page"] == 1

    def test_save_and_retrieve_progress(self, client):
        pdf_bytes = _make_minimal_pdf()
        upload = client.post(
            "/api/upload",
            files={"file": ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf")},
        )
        doc_id = upload.json()["document_id"]

        client.post(
            f"/api/documents/{doc_id}/progress",
            json={"current_chunk_id": 5, "current_page": 3},
        )
        progress = client.get(f"/api/documents/{doc_id}/progress").json()
        assert progress["current_chunk_id"] == 5
        assert progress["current_page"] == 3


class TestBookGeneration:
    def test_generate_book_returns_202(self, client):
        response = client.post("/api/books/generate", json={"topic": "Testing"})
        assert response.status_code == 202
        data = response.json()
        assert data["status"] == "generating_outline"
        assert data["id"] is not None

    def test_generate_book_becomes_ready(self, client):
        response = client.post("/api/books/generate", json={"topic": "Testing"})
        book_id = response.json()["id"]

        for _ in range(30):
            detail = client.get(f"/api/books/{book_id}").json()
            if detail["status"] == "ready":
                break
            time.sleep(0.2)

        assert detail["status"] == "ready"
        assert detail["chapter_count"] == 2
        assert len(detail["chapters"]) == 2

    def test_list_books(self, client):
        response = client.get("/api/books")
        assert response.status_code == 200

    def test_empty_topic_rejected(self, client):
        response = client.post("/api/books/generate", json={"topic": ""})
        assert response.status_code == 422

    def test_generate_chapter(self, client):
        resp = client.post("/api/books/generate", json={"topic": "Test"})
        book_id = resp.json()["id"]

        for _ in range(30):
            detail = client.get(f"/api/books/{book_id}").json()
            if detail["status"] == "ready":
                break
            time.sleep(0.2)

        gen_resp = client.post(f"/api/books/{book_id}/chapters/1/generate")
        assert gen_resp.status_code == 202

        for _ in range(30):
            chunks = client.get(f"/api/books/{book_id}/chapters/1/chunks").json()
            if chunks["chapter_status"] == "ready":
                break
            time.sleep(0.2)

        assert chunks["chapter_status"] == "ready"
        assert len(chunks["chunks"]) > 0


class TestBookProgress:
    def test_default_book_progress(self, client):
        response = client.get("/api/books/1/progress")
        assert response.status_code == 200
        assert response.json()["current_chapter"] == 1

    def test_save_book_progress(self, client):
        resp = client.post("/api/books/generate", json={"topic": "Test"})
        book_id = resp.json()["id"]

        client.post(
            f"/api/books/{book_id}/progress",
            json={"current_chapter": 2, "current_chunk_id": 10},
        )
        progress = client.get(f"/api/books/{book_id}/progress").json()
        assert progress["current_chapter"] == 2
        assert progress["current_chunk_id"] == 10


class TestDeleteOperations:
    def test_delete_nonexistent_document(self, client):
        response = client.delete("/api/documents/9999")
        assert response.status_code == 404

    def test_delete_nonexistent_book(self, client):
        response = client.delete("/api/books/9999")
        assert response.status_code == 404

    def test_delete_book(self, client):
        resp = client.post("/api/books/generate", json={"topic": "ToDelete"})
        book_id = resp.json()["id"]

        del_resp = client.delete(f"/api/books/{book_id}")
        assert del_resp.status_code == 200
        assert del_resp.json()["status"] == "deleted"

        get_resp = client.get(f"/api/books/{book_id}")
        assert get_resp.status_code == 404

import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

_mock_voice = MagicMock()


def _mock_synthesize_to_wav(text: str, output_path: str) -> int:
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    import wave
    wf = wave.open(output_path, "wb")
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(22050)
    wf.writeframes(b"\x00\x00" * 2205)
    wf.close()
    return 100


@pytest.fixture(autouse=True)
def _mock_tts():
    with patch("tts.get_voice", return_value=_mock_voice), \
         patch("tts.synthesize_to_wav", side_effect=_mock_synthesize_to_wav):
        yield


@pytest.fixture(autouse=True)
def _mock_llm():
    outline = {
        "title": "Test Book",
        "description": "A test book",
        "chapters": [
            {"number": 1, "title": "Intro", "summary": "The beginning."},
            {"number": 2, "title": "Middle", "summary": "The middle."},
        ],
    }
    chapter_text = "This is a test sentence. Here is another one.\n\nA second paragraph here."

    mock_client = MagicMock()
    mock_choice = MagicMock()
    mock_choice.message.content = ""

    def create_side_effect(**kwargs):
        messages = kwargs.get("messages", [])
        user_msg = messages[-1]["content"] if messages else ""
        if "outline" in messages[0]["content"].lower():
            import json
            mock_choice.message.content = json.dumps(outline)
        else:
            mock_choice.message.content = chapter_text
        resp = MagicMock()
        resp.choices = [mock_choice]
        return resp

    mock_client.chat.completions.create = MagicMock(side_effect=create_side_effect)

    with patch("llm.get_client", return_value=mock_client):
        yield


@pytest.fixture()
def client(tmp_path):
    import database
    test_db = tmp_path / "test.db"
    database.DB_PATH = test_db
    database.DATABASE_URL = f"sqlite:///{test_db}"
    database.engine = database.create_engine(
        database.DATABASE_URL, connect_args={"check_same_thread": False}
    )
    new_session_local = database.sessionmaker(
        autocommit=False, autoflush=False, bind=database.engine
    )
    database.SessionLocal = new_session_local
    database.Base.metadata.create_all(bind=database.engine)

    import main
    main.SessionLocal = new_session_local
    main.UPLOAD_DIR = tmp_path / "uploads"
    main.UPLOAD_DIR.mkdir()

    import tts
    tts.AUDIO_DIR = tmp_path / "audio"
    tts.AUDIO_DIR.mkdir()

    from main import app
    with TestClient(app) as tc:
        yield tc

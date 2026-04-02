import wave
import shutil
from pathlib import Path

MODELS_DIR = Path(__file__).parent / "models"
AUDIO_DIR = Path(__file__).parent / "audio"
MODEL_NAME = "en_US-lessac-medium"

_voice = None


def get_voice():
    global _voice
    if _voice is None:
        from piper import PiperVoice
        model_path = MODELS_DIR / f"{MODEL_NAME}.onnx"
        if not model_path.exists():
            raise FileNotFoundError(
                f"Voice model not found at {model_path}. "
                "Download it from https://huggingface.co/rhasspy/piper-voices"
            )
        _voice = PiperVoice.load(str(model_path))
    return _voice


def synthesize_to_wav(text: str, output_path: str) -> int:
    """Synthesize text to a WAV file. Returns duration in milliseconds."""
    voice = get_voice()
    wav_file = wave.open(output_path, "wb")
    voice.synthesize_wav(text, wav_file)
    wav_file.close()

    with wave.open(output_path, "rb") as wf:
        frames = wf.getnframes()
        rate = wf.getframerate()
    return int(frames / rate * 1000)


def generate_audio_for_chunks(doc_id: int, chunks: list[dict]) -> dict[int, int]:
    """
    Generate audio for every chunk in a document.
    Returns {sequence_order: duration_ms}.
    """
    doc_dir = AUDIO_DIR / str(doc_id)
    doc_dir.mkdir(parents=True, exist_ok=True)

    durations: dict[int, int] = {}
    for chunk in chunks:
        seq = chunk["sequence_order"]
        path = doc_dir / f"{seq}.wav"
        duration = synthesize_to_wav(chunk["text"], str(path))
        durations[seq] = duration
    return durations


def get_audio_path(doc_id: int, sequence_order: int) -> Path:
    return AUDIO_DIR / str(doc_id) / f"{sequence_order}.wav"


def cleanup_document_audio(doc_id: int):
    doc_dir = AUDIO_DIR / str(doc_id)
    if doc_dir.exists():
        shutil.rmtree(doc_dir)


# --------------- Book audio helpers ---------------

def generate_audio_for_book_chunks(book_id: int, chapter_number: int, chunks: list[dict]) -> dict[int, int]:
    """Generate audio for book chunks. Returns {sequence_order: duration_ms}."""
    ch_dir = AUDIO_DIR / f"book_{book_id}" / f"ch{chapter_number}"
    ch_dir.mkdir(parents=True, exist_ok=True)

    durations: dict[int, int] = {}
    for chunk in chunks:
        seq = chunk["sequence_order"]
        path = ch_dir / f"{seq}.wav"
        duration = synthesize_to_wav(chunk["text"], str(path))
        durations[seq] = duration
    return durations


def get_book_audio_path(book_id: int, chapter_number: int, sequence_order: int) -> Path:
    return AUDIO_DIR / f"book_{book_id}" / f"ch{chapter_number}" / f"{sequence_order}.wav"


def cleanup_book_audio(book_id: int):
    book_dir = AUDIO_DIR / f"book_{book_id}"
    if book_dir.exists():
        shutil.rmtree(book_dir)

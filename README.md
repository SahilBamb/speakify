# Speakify

**Turn anything into audio you can feel.**

Speakify is a full-stack text-to-speech reader application that lets you upload PDFs or generate entire books with AI, then listen with real-time sentence highlighting.

## Features

- **PDF Upload & Listen** — Drop any PDF and start listening instantly with sentence-level highlighting
- **AI Book Generation** — Type any topic and get a full book generated chapter-by-chapter with GPT-4o-mini
- **Real-Time Highlighting** — Sentences light up as they're spoken; click any sentence to jump to it
- **Natural Voice (Piper TTS)** — High-quality offline text-to-speech with no API costs
- **Dark Mode** — Beautiful frosted glass UI in both light and dark themes
- **Reading Preferences** — Customizable font, size, line spacing, keyboard shortcuts, and more

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Python, FastAPI, SQLAlchemy + SQLite |
| TTS | Piper TTS (offline, local) |
| AI | OpenAI GPT-4o-mini |

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Download a Piper voice model into `backend/models/`:
```bash
mkdir -p models
# Download from https://huggingface.co/rhasspy/piper-voices
# Place en_US-lessac-medium.onnx and .json in models/
```

Start the server:
```bash
export OPENAI_API_KEY="your-key-here"  # only needed for book generation
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── backend/
│   ├── main.py          # FastAPI app & routes
│   ├── database.py      # SQLAlchemy models
│   ├── processing.py    # PDF text extraction
│   ├── tts.py           # Piper TTS integration
│   ├── llm.py           # OpenAI book generation
│   ├── schemas.py       # Pydantic models
│   ├── log_config.py    # Structured logging
│   └── tests/           # pytest suite
├── frontend/
│   ├── src/app/         # Next.js routes
│   ├── src/components/  # React components
│   ├── src/hooks/       # Custom hooks
│   └── src/lib/         # API client
└── ROADMAP.md           # Full product roadmap
```

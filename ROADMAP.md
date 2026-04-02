# Speechify — Full Product Roadmap

> Living document. Each phase builds on the previous.
> Stories are ordered by dependency within a phase. Execute sequentially.

---

## Phase 0 — Bug Fixes & Foundation Hardening
*Goal: Fix known issues, add guardrails, make the codebase resilient before adding features.*

| # | Story | Description |
|---|-------|-------------|
| 0.1 | **Fix book audio filename collisions** | Chapter generation resets `sequence_order` to 1..N per chapter, so later chapters overwrite earlier chapters' WAV files. Namespace audio files as `audio/book_{id}/ch{chapter}_{seq}.wav` and update all references (backend serve endpoint, frontend `getBookAudioUrl`, cleanup). |
| 0.2 | **Pydantic request/response models** | Replace loose `dict` request bodies with typed Pydantic `BaseModel` classes for every endpoint. Add response models for auto-generated OpenAPI docs. |
| 0.3 | **Centralize API base URL** | Extract the hardcoded `http://localhost:8000` into a single `const API_BASE` driven by `NEXT_PUBLIC_API_URL` env var with a localhost fallback. Update every `fetch` call and the `api.ts` module. |
| 0.4 | **Graceful error boundaries** | Add a React Error Boundary wrapper for the reader pages and a global 500 fallback page. Show user-friendly messages instead of white screens. |
| 0.5 | **Loading skeletons** | Replace every spinner with contextual skeleton loaders (pulse rectangles) for document list, book list, chapter text, and PDF pages. |
| 0.6 | **Backend background tasks** | Move PDF processing + TTS generation and chapter generation + TTS into FastAPI `BackgroundTasks` (or a simple task queue). Return 202 Accepted immediately; frontend polls a `/status` endpoint until ready. |
| 0.7 | **Retry & timeout logic** | Add exponential-backoff retry wrappers to all frontend `fetch` calls. Add server-side timeouts on LLM calls. |
| 0.8 | **Logging & observability** | Add structured logging (`loguru` or stdlib `logging`) to every backend module with request-id correlation. |
| 0.9 | **Unit & integration tests** | Create `backend/tests/` with pytest: test sentence segmentation, PDF processing (with a fixture PDF), TTS stub, LLM mock, and all API endpoints. Create `frontend/__tests__/` with Vitest + React Testing Library for key components. |

---

## Phase 1 — Enhanced Reading Experience
*Goal: Make reading delightful — dark mode, annotations, better navigation, accessibility.*

| # | Story | Description |
|---|-------|-------------|
| 1.1 | **Dark mode & theme toggle** | Add a system/light/dark theme toggle to the header. Use CSS custom properties for all colors. Persist preference in `localStorage`. Update the frosted glass classes to support both palettes. |
| 1.2 | **Reading preferences panel** | Slide-out settings drawer: font family (serif / sans / mono), font size (5 steps), line height, margin width. Persist in `localStorage`. Apply to both PDF overlay text and `TextReader`. |
| 1.3 | **PDF zoom & page navigation** | Add pinch-to-zoom (or +/- buttons), fit-width / fit-page toggles, and a page number input that jumps directly to a page. |
| 1.4 | **Word-level highlighting** | Upgrade TTS sync from sentence-level to word-level: split each sentence into words, estimate word timestamps from audio duration proportionally (or use Piper forced alignment if available). Highlight individual words as they play. |
| 1.5 | **Keyboard shortcuts** | Space = play/pause, Left/Right = prev/next sentence, Up/Down = speed, Escape = stop, N/P = next/prev chapter (books). Show a `?` hotkey cheatsheet modal. |
| 1.6 | **Table of contents sidebar** | For PDFs: attempt to extract ToC from PDF metadata; if none, generate one from heading-sized text blocks. For books: chapter list is already known. Show a collapsible sidebar with clickable entries. |
| 1.7 | **Bookmarks** | Let users bookmark any sentence (star icon on hover). Persist bookmarks in the database. Show a bookmarks panel in the ToC sidebar with jump-to-bookmark. |
| 1.8 | **Annotations & highlights** | Text selection creates a colored highlight (yellow / green / blue / pink). Optional note attached to each highlight. Persistent in database. Annotation sidebar lists all highlights with context. |
| 1.9 | **Mini-map / scroll indicator** | A thin vertical strip on the right edge showing document density, current viewport position, bookmarks, and highlights as colored dots. Clickable to jump. |
| 1.10 | **Mobile responsive layout** | Full responsive pass: stack playback controls, hide sidebar on mobile, swipe gestures for page/chapter navigation, touch-friendly tap targets. |

---

## Phase 2 — Multi-Format Support
*Goal: Read and listen to anything, not just PDFs and AI-generated text.*

| # | Story | Description |
|---|-------|-------------|
| 2.1 | **EPUB support** | Add `ebooklib` to backend. New `/api/upload` accepts `.epub`. Extract chapters, paragraphs, and sentences. Reuse existing TTS pipeline. New `EpubViewer` component renders styled HTML content with sentence highlights. |
| 2.2 | **DOCX support** | Add `python-docx` to backend. Parse `.docx` into paragraphs and sentences. Render in `TextReader` (reuse book reader). |
| 2.3 | **Markdown file support** | Accept `.md` uploads. Parse with `markdown-it` on the frontend. Render as styled HTML in a new `MarkdownReader` component. |
| 2.4 | **Web article reader (URL import)** | New "Paste URL" input on homepage. Backend uses `trafilatura` or `readability-lxml` to extract article text. Clean, segment, TTS, store like a document. |
| 2.5 | **Plain text & TXT support** | Accept `.txt` files. Simple paragraph + sentence splitting. Render in `TextReader`. |
| 2.6 | **OCR fallback for scanned PDFs** | Detect when PyMuPDF extracts zero text. Fall back to `pytesseract` + `pdf2image` for OCR. Warn user about quality. |
| 2.7 | **Unified content model** | Refactor database to a single `Content` → `ContentChunk` model that all formats feed into, with a `source_type` enum. Unify the reader pages into a single `/reader/[id]` route that auto-selects the right viewer component. |

---

## Phase 3 — Content Intelligence (AI Features)
*Goal: Use AI to help users understand, not just listen.*

| # | Story | Description |
|---|-------|-------------|
| 3.1 | **Document summarization** | Button in the reader header: "Summarize." Sends all text to GPT-4o-mini with a summarization prompt. Shows result in a slide-over panel. Cache the summary in the database. |
| 3.2 | **Chapter / section summaries** | For books and long PDFs: per-chapter or per-section summary auto-generated on demand. Shown as a collapsible block above each section. |
| 3.3 | **"Ask this document" chat** | Slide-out chat panel. User types a question; backend sends question + document text (or relevant chunks via naive keyword matching) to GPT-4o-mini. Streams response via SSE. Chat history persisted per document. |
| 3.4 | **Key terms & glossary** | Extract key terms from the document using the LLM. Show as clickable chips; clicking a term shows its definition (also LLM-generated) in a tooltip. Persist per document. |
| 3.5 | **Auto-generated quiz** | "Quiz me" button. LLM generates 5-10 multiple-choice questions from the content. Interactive quiz UI with score. Store results for the stats page. |
| 3.6 | **Smart reading suggestions** | After finishing a document or book, LLM suggests related topics or books. If the user clicks one, it auto-populates the book generator. |
| 3.7 | **Translation** | "Translate" button in the reader. Select target language. LLM translates the content chunk-by-chunk. Optionally re-generate TTS in the target language using a matching Piper voice model. |

---

## Phase 4 — Premium Voice Engine
*Goal: Professional, customizable voices. Audio export.*

| # | Story | Description |
|---|-------|-------------|
| 4.1 | **Multiple Piper voice models** | Download 4-5 Piper voices (male, female, different accents). Add a voice picker in reading preferences. Store selected voice per document. Re-generate audio on voice change (or cache per voice). |
| 4.2 | **Cloud TTS option (OpenAI TTS)** | Add OpenAI TTS (`tts-1` / `tts-1-hd`) as an alternative engine. User selects "Standard (local)" or "Premium (cloud)" in settings. Premium uses the OpenAI voices (alloy, echo, fable, onyx, nova, shimmer). |
| 4.3 | **ElevenLabs integration** | Optional ElevenLabs API key in settings. Offers their voice library. Stream audio chunks from the API. |
| 4.4 | **Audio export (MP3/M4A)** | "Download audio" button in the reader. Backend concatenates all WAV chunks, converts to MP3 using `pydub` + `ffmpeg`. Serves as a download. For books: export per-chapter or full book. |
| 4.5 | **Background listening mode** | When the user navigates away from the reader, audio keeps playing. Show a persistent mini-player bar at the bottom of all pages. Use a global audio context / zustand store. |
| 4.6 | **Podcast-style generation** | For AI books: option to generate a "podcast episode" — two AI hosts discuss each chapter in a conversational format. Uses NotebookLM-style prompt engineering. |

---

## Phase 5 — User Accounts & Cloud
*Goal: Multi-user support, persistent libraries, cross-device sync.*

| # | Story | Description |
|---|-------|-------------|
| 5.1 | **Authentication (NextAuth.js)** | Add NextAuth with email/password (credentials provider) and optional Google OAuth. JWT sessions. Protect all API routes. |
| 5.2 | **User-scoped data** | Add `user_id` FK to all database models. Filter all queries by authenticated user. Migrate existing data to a default user. |
| 5.3 | **User profile & settings** | Profile page: display name, avatar upload, email, preferred voice, theme, reading preferences. All synced to database. |
| 5.4 | **Cloud document storage (S3)** | Replace local `uploads/` and `audio/` directories with S3-compatible object storage (MinIO for dev, AWS S3 for prod). Signed URLs for private access. |
| 5.5 | **Reading statistics dashboard** | Dashboard page: total time listened, documents finished, words read, streak calendar, average speed, favorite genres. Aggregate from reading progress data. |
| 5.6 | **Library organization** | Folders / tags for documents and books. Drag-and-drop organization. Search across all content with full-text search. |
| 5.7 | **Cross-device sync** | Reading progress synced via the database. When opening on a new device, prompt "Continue where you left off?" with chapter/page/sentence context. |

---

## Phase 6 — Social & Discovery
*Goal: Community features — sharing, public library, collaborative reading.*

| # | Story | Description |
|---|-------|-------------|
| 6.1 | **Public book library** | Users can opt to publish their AI-generated books to a public catalog. Browse/search/filter public books by topic, rating, length. |
| 6.2 | **Ratings & reviews** | Star rating + text review on any public book. Sort by popularity, rating, newest. |
| 6.3 | **Reading lists** | Create named reading lists (like playlists). Add any document or book. Share via public link. |
| 6.4 | **Follow & activity feed** | Follow other users. See their recently published books and reading lists in an activity feed on the home page. |
| 6.5 | **Shared annotations** | Opt-in to share highlights/notes on public books. See other readers' annotations as a layer toggle in the reader. |
| 6.6 | **Reading groups** | Create a group, invite members, assign a book. Group chat panel. Track members' progress. Schedule discussions. |

---

## Phase 7 — Platform, DevOps & Production Readiness
*Goal: Ship it. Containerize, scale, monitor, deploy.*

| # | Story | Description |
|---|-------|-------------|
| 7.1 | **Docker Compose setup** | `Dockerfile` for backend (Python + Piper + ffmpeg), `Dockerfile` for frontend (Next.js standalone). `docker-compose.yml` orchestrates both + PostgreSQL + MinIO. One-command local dev. |
| 7.2 | **PostgreSQL migration** | Replace SQLite with PostgreSQL. Use Alembic for schema migrations. Data migration script for existing SQLite data. |
| 7.3 | **Redis caching** | Add Redis for: LLM response caching, session storage, rate limiting counters, job queue (if using Celery). |
| 7.4 | **Background job queue (Celery)** | Replace FastAPI BackgroundTasks with Celery + Redis for robust job processing. Tasks: PDF processing, TTS generation, LLM calls, audio export. |
| 7.5 | **Rate limiting & quotas** | Per-user rate limits on LLM endpoints (book generation, summaries, Q&A). Configurable daily/monthly quotas. `429 Too Many Requests` with retry headers. |
| 7.6 | **CI/CD pipeline** | GitHub Actions: lint (ruff + eslint), type-check (mypy + tsc), test (pytest + vitest), build, deploy. Branch protection rules. |
| 7.7 | **Monitoring & alerting** | Prometheus metrics endpoint. Grafana dashboards for request latency, error rates, TTS queue depth. Sentry for error tracking. |
| 7.8 | **CDN & performance** | Put static assets and generated audio behind a CDN (CloudFront). Add cache headers. Optimize frontend bundle: code splitting, dynamic imports, image optimization. |
| 7.9 | **Admin dashboard** | Protected `/admin` route. User management, content moderation, system stats, job queue monitoring, feature flags. |
| 7.10 | **Production deployment** | Deploy to AWS (ECS/Fargate or EC2) or Railway/Fly.io. SSL, custom domain, environment variable management, auto-scaling configuration. |

---

## Execution Order Summary

```
Phase 0  →  Foundation (fix bugs, tests, background tasks)
Phase 1  →  Reading UX (dark mode, annotations, keyboard, mobile)
Phase 2  →  Multi-Format (EPUB, DOCX, URL, OCR, unified model)
Phase 3  →  AI Intelligence (summaries, chat, quiz, glossary)
Phase 4  →  Premium Voice (multiple voices, cloud TTS, export)
Phase 5  →  User Accounts (auth, cloud storage, stats, sync)
Phase 6  →  Social (public library, reviews, reading groups)
Phase 7  →  Platform (Docker, Postgres, CI/CD, deploy)
```

Total: **8 phases, 56 stories**

---

## How to Execute

1. We work **one story at a time**, in order.
2. Each story is a self-contained unit of work: backend + frontend + tests if applicable.
3. After completing each story, we verify it works end-to-end before moving on.
4. Stories within a phase can occasionally be parallelized if they touch different parts of the stack.
5. At the end of each phase, we do a quick integration check to make sure everything still works together.

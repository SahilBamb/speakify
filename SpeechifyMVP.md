# PDF-to-Audiobook Web App MVP Design Document

## 1. Executive Summary

This document describes an MVP web application that allows a user to upload a PDF, extract readable text, generate synchronized audio playback, and visually follow along as the document is read aloud through real-time text highlighting.

The core user experience is:

1. User uploads a PDF.
2. The system extracts text and page structure.
3. The app displays the PDF in a reader interface.
4. The user presses **Play**.
5. The app reads the text aloud in a natural voice while highlighting the current sentence or phrase in sync with playback.
6. The user can pause, resume, seek, change speed, and jump to specific pages or sections.

The MVP is intentionally focused on a narrow but valuable use case: **turning text-based PDFs into a listenable, follow-along audiobook experience in the browser**.

---

## 2. Product Vision

### Goal

Help users consume long-form PDF content more easily by combining:

* document upload
* in-browser reading
* text-to-speech playback
* synchronized highlighting
* basic navigation and playback controls

### Target Users

The MVP is best suited for:

* students reading textbooks, papers, or handouts
* professionals reviewing reports, whitepapers, or manuals
* readers who prefer audio-assisted reading
* users who want multimodal reading support for focus and comprehension

### Core Value Proposition

"Upload any readable PDF and instantly listen while the text is highlighted as the document is read to you."

---

## 3. Product Scope

### In Scope for MVP

* user uploads PDF
* PDF text extraction
* display PDF pages in browser
* build a structured reading order from extracted text
* text-to-speech playback
* sentence or phrase-level highlighting during playback
* page auto-scroll / page focus while reading
* playback controls: play, pause, resume, stop, seek, restart
* speed adjustment
* voice selection from a small supported list
* persistence of reading progress per document
* support for standard text-based PDFs

### Out of Scope for MVP

* OCR for scanned/image-only PDFs as a primary flow
* EPUB, DOCX, web URL, or image ingestion
* advanced AI summarization/chat with document
* collaborative annotations
* note-taking and exports
* multilingual voice optimization beyond a small set
* highly polished mobile apps
* offline audio download for entire book
* human-quality audiobook narration with emotion controls

### Post-MVP Candidates

* OCR fallback for scanned PDFs
* chapter detection and table of contents parsing
* note-taking and bookmarking
* word-level highlighting with phoneme timing
* voice cloning / premium neural voices
* mobile-native apps
* background audio mode
* AI summaries and ask-the-book features

---

## 4. User Stories

### Primary User Stories

1. As a user, I want to upload a PDF so I can listen to it instead of reading manually.
2. As a user, I want the current text to be highlighted while the audio plays so I can visually follow along.
3. As a user, I want playback controls so I can pause, resume, skip, or change speed.
4. As a user, I want the reader to move through pages automatically so I do not have to manually track where the narration is.
5. As a user, I want the app to remember where I left off so I can continue later.

### Secondary User Stories

1. As a user, I want to click a sentence or paragraph and start playback from there.
2. As a user, I want to choose between available voices.
3. As a user, I want clear error handling if my PDF cannot be read.

---

## 5. MVP Requirements

## 5.1 Functional Requirements

### Upload and Processing

* User can upload a PDF from local device.
* System validates file type and file size.
* System stores the original PDF.
* System extracts text, page boundaries, and approximate reading order.
* System segments extracted text into paragraphs and sentences.
* System stores positional metadata that maps text segments to PDF page coordinates.

### Reader Experience

* User can view the PDF in a browser-based reader.
* User can start audio playback from the beginning or a chosen point.
* App highlights the currently spoken segment.
* App scrolls to the active page or segment.
* User can pause, resume, stop, rewind, fast-forward, and seek.
* User can adjust reading speed.
* User can choose an available TTS voice.

### Progress and Sessions

* System stores playback position per user per document.
* User can reopen a document and resume from the prior position.

### Error Handling

* If extraction quality is low, system warns the user.
* If a PDF is image-only, system informs the user that the document may not be readable in MVP.

## 5.2 Non-Functional Requirements

### Performance

* PDF upload should begin processing within seconds.
* Small-to-medium PDFs should be usable within 10 to 30 seconds.
* Playback interactions should feel immediate.
* Highlight synchronization should remain visually stable.

### Scalability

* Architecture should support many uploaded documents without blocking synchronous web requests.
* Processing should be asynchronous and job-based.

### Security

* PDFs must be isolated per user.
* Signed URLs or gated access should protect stored files.
* Basic content security and upload validation are required.

### Reliability

* Failed processing jobs should be retryable.
* Audio playback should degrade gracefully if timing metadata is imperfect.

---

## 6. Assumptions

1. MVP supports only **text-based PDFs** where selectable text already exists.
2. Sentence-level timing is sufficient for MVP; word-level timing is not required.
3. The initial product can rely on cloud TTS rather than building a custom speech model.
4. Highlighting can be synchronized using estimated timing or segment-based timing rather than true phoneme alignment.
5. A web-first experience is enough for initial validation.

---

## 7. High-Level Product Flow

### Step 1: Upload

User uploads PDF through the web UI.

### Step 2: Document Processing

Backend stores PDF and launches a processing job that:

* extracts text and layout metadata
* segments content into reading chunks
* computes positional references for each chunk
* optionally pre-generates audio in sections or uses on-demand TTS

### Step 3: Reader Initialization

Frontend loads:

* rendered PDF pages
* extracted text chunk metadata
* page/coordinate mapping
* playback metadata

### Step 4: Reading Session

When the user presses play:

* the player starts the current chunk audio
* the viewer highlights the active chunk
* the reader auto-scrolls as needed
* when a chunk finishes, the system advances to the next chunk

### Step 5: Resume

The app saves progress continuously and resumes later from the last chunk index and timestamp.

---

## 8. Core Technical Challenge

The hardest part of the MVP is not basic TTS. It is **maintaining synchronization between three layers**:

1. **PDF visual layer** — the page and its coordinates
2. **Extracted text layer** — paragraphs, lines, and sentences in logical reading order
3. **Audio playback layer** — timing of spoken segments

A usable MVP depends on stitching these three layers together in a stable way.

---

## 9. System Architecture

## 9.1 Recommended Stack

### Frontend

* **Next.js / React** for app shell and reader UI
* **PDF.js** for PDF rendering and text layer extraction support
* **TypeScript** for consistency
* **Tailwind CSS** for UI styling
* **Web Audio / HTMLAudioElement** for playback

### Backend

* **Python FastAPI** or **Node.js NestJS/Express**
* Recommendation: **FastAPI** because PDF parsing and document processing libraries are strong in Python

### Processing

* PDF extraction: **PyMuPDF** or **pdfplumber**, possibly combined with PDF.js metadata
* Sentence segmentation: **spaCy** or lightweight sentence tokenizer
* Job queue: **Celery + Redis** or **RQ + Redis**

### Storage

* Relational DB: **PostgreSQL**
* Object storage: **S3-compatible bucket** for PDFs and optional pre-generated audio chunks
* Cache / queue broker: **Redis**

### TTS

* Cloud provider TTS for MVP:

  * AWS Polly
  * Google Cloud Text-to-Speech
  * Azure AI Speech
* Recommendation: use one provider initially with a small set of supported voices

### Hosting

* Frontend on Vercel or similar
* Backend on AWS/GCP/Azure container service
* Object storage + Postgres + Redis managed services

---

## 9.2 Logical Components

1. **Web Client**

   * upload UI
   * PDF reader UI
   * highlight overlay
   * playback controls
   * session state

2. **API Service**

   * authentication
   * file upload initiation
   * document metadata retrieval
   * reading session state
   * playback metadata endpoints

3. **Document Processing Worker**

   * extract PDF text
   * normalize layout
   * segment text
   * compute bounding boxes
   * generate or prepare TTS chunks

4. **Storage Layer**

   * raw PDFs
   * processed metadata JSON
   * optional audio chunk files
   * user progress

5. **Playback Orchestrator**

   * returns current chunk list and durations
   * manages sequence progression
   * supports jumping to a chunk

---

## 10. Detailed Processing Pipeline

## 10.1 Upload Pipeline

### Input

* PDF file

### Validation

* MIME type must be application/pdf
* configurable max size, e.g. 100 MB
* virus/malware scan if required in production

### Output

* document record created
* file stored
* processing job queued

---

## 10.2 PDF Parsing Pipeline

The parser must produce two things:

1. logical text in reading order
2. geometric mapping back to the PDF

### Extraction Tasks

* detect number of pages
* extract page text blocks
* extract text spans and bounding boxes
* normalize whitespace and line breaks
* preserve page boundaries
* reconstruct paragraph/sentence order

### Example Internal Representation

```json
{
  "page": 12,
  "blocks": [
    {
      "block_id": "p12_b3",
      "bbox": [72, 180, 530, 260],
      "text": "This is the paragraph text...",
      "lines": [...]
    }
  ]
}
```

### Reading Order Strategy

For MVP, use a deterministic rule-based strategy:

* sort text blocks top-to-bottom, then left-to-right
* ignore headers/footers if repeated consistently
* merge lines into paragraphs based on spacing heuristics
* split paragraphs into sentences

This works acceptably for many single-column PDFs.

### Known Limitation

Multi-column layouts, footnotes, sidebars, and complex textbooks may break naive reading order. For MVP, document this limitation and prioritize standard book/report layouts.

---

## 10.3 Text Segmentation Pipeline

After extraction, transform paragraphs into chunks suitable for both playback and highlighting.

### Chunking Goals

Each chunk should:

* be short enough for responsive playback and highlighting
* map clearly to a visible region on page
* have predictable timing

### Recommended MVP Granularity

* **Sentence-level chunks** for synchronization
* merge ultra-short sentences when needed
* preserve paragraph grouping for navigation

### Chunk Data Model

```json
{
  "chunk_id": "doc123_p12_s8",
  "document_id": "doc123",
  "page": 12,
  "paragraph_index": 3,
  "sentence_index": 8,
  "text": "The system should highlight the current sentence during playback.",
  "bbox": [80, 202, 518, 225],
  "char_count": 68,
  "estimated_duration_ms": 2400,
  "audio_url": "...optional..."
}
```

---

## 10.4 TTS Pipeline

Two valid MVP approaches exist.

### Option A: Pre-generate Audio Per Chunk

When processing finishes:

* send each chunk to TTS
* store audio files per chunk or section
* store durations

#### Pros

* stable timing
* predictable highlighting
* lower runtime complexity
* easier resume/seek at chunk boundaries

#### Cons

* longer processing time after upload
* more storage cost
* many small audio files unless batched

### Option B: Generate Speech On Demand

At playback time:

* request TTS for the current chunk or section
* stream or fetch audio dynamically

#### Pros

* faster initial upload readiness
* lower precompute cost
* easier voice switching

#### Cons

* more runtime latency
* harder synchronization consistency
* more complex playback orchestration

### MVP Recommendation

Use a **hybrid** approach:

* pre-generate audio for chunk groups such as paragraph batches or page sections
* keep sentence-level timing metadata inside each group

This provides a smoother UX while limiting the number of stored files.

---

## 10.5 Timing and Highlight Synchronization

This is the core interaction layer.

### MVP Synchronization Strategy

Do not attempt true word-level alignment initially. Use **sentence-level timing**.

For each sentence chunk:

* determine audio duration from generated TTS response or estimated speech rate
* build a timeline
* trigger highlight transitions when the active chunk changes

### Timing Methods

#### Method 1: Exact Audio Duration Per Chunk

If each sentence is a separate audio clip, highlight exactly while that clip plays.

#### Method 2: Batched Audio + Internal Offsets

If several sentences are synthesized together, store offsets:

```json
{
  "audio_group_id": "g12_2",
  "duration_ms": 18000,
  "sentences": [
    {"chunk_id": "c1", "start_ms": 0, "end_ms": 2800},
    {"chunk_id": "c2", "start_ms": 2800, "end_ms": 5300}
  ]
}
```

### MVP Recommendation

Use **batched audio with sentence offset metadata** where possible. If the TTS vendor does not return alignment marks easily, estimate sentence timing by:

* character count
* punctuation weighting
* playback rate adjustment

Later, replace with speech marks / timing metadata from the TTS provider if available.

---

## 11. Frontend Reader Design

## 11.1 Main Layout

Recommended layout:

* left or center: PDF viewer
* bottom sticky area: playback controls
* optional right sidebar: queue / chapter / chunk navigation

### UI Areas

1. **Header**

   * app logo
   * document name
   * upload button
   * status badge (processing / ready / failed)

2. **Reader Pane**

   * rendered PDF pages
   * text highlight overlay
   * active page focus

3. **Playback Bar**

   * play/pause
   * restart
   * seek backward/forward
   * progress scrubber
   * speed selector
   * voice selector

4. **Optional Sidebar**

   * page list
   * sections
   * current sentence preview

---

## 11.2 Highlight Rendering

There are two main ways to highlight.

### Approach A: Use PDF.js Text Layer

Render text layer spans and apply CSS class to active spans.

#### Pros

* straightforward if extracted text matches PDF.js text spans
* native-looking highlight

#### Cons

* text extraction from backend may not match front-end span segmentation perfectly

### Approach B: Draw Highlight Overlay Using Bounding Boxes

Use stored bounding boxes and render semi-transparent absolutely positioned rectangles over the PDF canvas.

#### Pros

* backend-driven, stable geometry
* works even if text layer mismatch exists

#### Cons

* requires accurate coordinate transforms per zoom level

### MVP Recommendation

Use **bounding-box highlight overlays** because they align better with a backend-controlled chunk model.

---

## 11.3 Auto-Scroll Behavior

When the active chunk changes:

* if chunk is visible, do nothing
* if near viewport edge, softly scroll to center it
* if page changes, scroll to new page and then activate highlight

The movement should be smooth, not jumpy. A gentle scroll-to-active behavior matters a lot for perceived quality.

---

## 12. Backend API Design

## 12.1 Core Endpoints

### Authentication

* `POST /auth/signup`
* `POST /auth/login`
* `POST /auth/logout`

### Documents

* `POST /documents/upload`
* `GET /documents`
* `GET /documents/{id}`
* `GET /documents/{id}/status`
* `DELETE /documents/{id}`

### Reader Metadata

* `GET /documents/{id}/pages`
* `GET /documents/{id}/chunks`
* `GET /documents/{id}/audio-map`

### Playback

* `GET /documents/{id}/playback-session`
* `POST /documents/{id}/progress`
* `POST /documents/{id}/jump`

### Optional Streaming

* `GET /audio/{group_id}`

---

## 12.2 Example Response: Document Metadata

```json
{
  "id": "doc_123",
  "title": "Deep Learning Basics",
  "status": "ready",
  "page_count": 240,
  "processing_summary": {
    "extractable_text": true,
    "complex_layout_detected": false
  },
  "last_position": {
    "chunk_id": "doc123_p12_s8",
    "page": 12,
    "audio_offset_ms": 1200
  }
}
```

---

## 13. Data Model

## 13.1 Tables

### users

* id
* email
* password_hash
* created_at

### documents

* id
* user_id
* title
* original_filename
* storage_key
* status
* page_count
* language
* extractable_text
* created_at
* updated_at

### document_pages

* id
* document_id
* page_number
* width
* height
* image_preview_key optional

### text_chunks

* id
* document_id
* page_number
* paragraph_index
* sentence_index
* text
* bbox_x1
* bbox_y1
* bbox_x2
* bbox_y2
* char_count
* estimated_duration_ms
* audio_group_id nullable
* audio_start_ms nullable
* audio_end_ms nullable
* sequence_order

### audio_groups

* id
* document_id
* start_chunk_order
* end_chunk_order
* storage_key
* duration_ms
* voice_name
* playback_rate_base

### reading_progress

* id
* user_id
* document_id
* current_chunk_id
* current_page
* current_audio_group_id
* current_offset_ms
* updated_at

### processing_jobs

* id
* document_id
* status
* error_message
* started_at
* completed_at

---

## 14. Synchronization Design in Detail

### Problem

The frontend needs to know what to highlight at every playback moment.

### Solution

Use a **playback timeline state machine**.

### Playback State

* current audio group
* current audio time
* active chunk
* active page
* paused/playing/stopped
* playback rate

### Runtime Logic

1. Audio begins for group G.
2. Frontend polls or listens to audio time updates.
3. Frontend maps current time to chunk offset range.
4. Highlight updates to matching chunk.
5. If active chunk changes page, viewer scrolls.
6. When audio group ends, next group loads automatically.

### Pseudocode

```ts
onAudioTimeUpdate(currentMs) {
  const activeChunk = findChunkByOffset(audioGroupTimeline, currentMs)
  if (activeChunk.id !== currentActiveChunkId) {
    setActiveChunk(activeChunk)
    ensureChunkVisible(activeChunk)
  }
}
```

This is the heart of the experience.

---

## 15. PDF Highlight Coordinate System

PDF coordinate systems are tricky because:

* PDF origin may differ from DOM origin
* zoom changes layout scale
* rendering canvas dimensions can differ from original page dimensions

### Recommended Approach

Store original PDF-space bounding boxes for each chunk.
On the frontend:

* get current rendered page viewport dimensions
* compute scale factor
* transform stored bbox into screen coordinates
* render overlay rectangle

### Formula

If original page size is `(W_pdf, H_pdf)` and rendered size is `(W_dom, H_dom)`:

* `scaleX = W_dom / W_pdf`
* `scaleY = H_dom / H_pdf`
* transformed bbox = original bbox * scales

### Important Note

You may need to invert Y-axis depending on parser output format.

---

## 16. Handling Difficult PDFs

Not all PDFs behave the same.

### PDF Types

1. **Text-based standard PDFs** — ideal for MVP
2. **Scanned/image-only PDFs** — text unavailable without OCR
3. **Complex academic layouts** — columns, figures, footnotes
4. **Poorly encoded PDFs** — broken reading order or malformed spans

### MVP Handling Strategy

* detect whether extractable text exists
* run a simple complexity heuristic
* label documents as:

  * ready
  * low-confidence extraction
  * unsupported in MVP

### Example Heuristics

* too few text blocks relative to page count
* strange character ratios
* high overlap of text boxes
* strong evidence of multi-column layout

### UX Copy

"This PDF appears to have a complex or image-based layout. Reading may be inaccurate in the current version."

---

## 17. Voice and Playback Design

## 17.1 Voice Support

For MVP, support:

* 3 to 5 neural voices
* one default voice
* language restricted to English initially

## 17.2 Playback Controls

* play/pause
* stop
* skip back 10 seconds
* skip forward 10 seconds
* restart sentence
* jump to page
* speed: 0.75x, 1x, 1.25x, 1.5x, 2x

## 17.3 Seek Model

Best seek behavior for MVP:

* seeking snaps to nearest chunk boundary
* not arbitrary millisecond seeking inside a chunk unless alignment is very reliable

This reduces sync drift.

---

## 18. Authentication and Access Model

### MVP Recommendation

Require user accounts so each user has:

* private document library
* stored reading progress
* quota control

### Access Control

* document ownership enforced at API layer
* private bucket access via signed URLs or backend proxy
* audio and processed metadata protected similarly

---

## 19. Security Considerations

* validate upload MIME type and extension
* scan uploaded files where possible
* limit file size and page count
* protect against path traversal and unsafe filenames
* use signed object storage access
* rate limit upload and synthesis endpoints
* log processing failures without exposing internal traces to user
* encrypt sensitive data at rest where applicable

---

## 20. Observability and Analytics

Track the following:

* upload success rate
* processing success rate
* average time from upload to ready
* percentage of PDFs flagged as unsupported
* playback start rate
* average listening duration
* pause/resume frequency
* completion rate per document
* resume rate across sessions
* sync error events / highlight mismatches

These metrics will tell you whether the product is actually useful.

---

## 21. MVP Success Criteria

The MVP is successful if:

1. Users can upload a normal text-based PDF and start listening successfully.
2. Highlighting is good enough that users can visually follow along.
3. Playback is smooth enough for at least 20 to 60 minute reading sessions.
4. Resume works reliably.
5. Most support issues come from difficult PDFs rather than broken core flows.

### Suggested Quantitative Targets

* 80%+ successful processing rate for supported PDFs
* < 30 seconds median readiness time for medium documents
* < 2% session-breaking playback errors
* 40%+ of users resume a document after initial use

---

## 22. Tradeoffs and Key Decisions

## Decision 1: Sentence-Level vs Word-Level Highlighting

* **Choose sentence-level** for MVP.
* It is dramatically simpler and still creates a satisfying follow-along effect.

## Decision 2: Text-Based PDFs Only vs OCR Support

* **Choose text-based PDFs only** for MVP.
* OCR adds major complexity and error cases.

## Decision 3: Cloud TTS vs Custom LLM Voice Stack

* **Choose cloud TTS** for MVP.
* Building speech synthesis is unnecessary for validating the product.

## Decision 4: Bounding Box Overlay vs DOM Text Highlight

* **Choose bounding box overlay**.
* It is more controllable for synchronization.

## Decision 5: Async Processing vs Fully Synchronous Upload

* **Choose async job processing**.
* Better scalability and resilience.

---

## 23. Risks

### Technical Risks

* reading order errors for complex PDFs
* timing drift between speech and highlight
* PDF coordinate mapping bugs
* too many audio files causing orchestration issues
* browser playback inconsistencies

### Product Risks

* users upload many scanned PDFs and expect OCR
* highlight accuracy may feel "off" if chunk timing is estimated poorly
* value proposition may depend heavily on voice quality

### Mitigations

* clearly define supported PDFs
* build extraction confidence scoring
* start with small sentence chunks
* use pre-generated or semi-pre-generated audio
* instrument sync quality issues early

---

## 24. Suggested MVP Milestones

## Phase 1: Foundation

* authentication
* upload flow
* document storage
* async processing jobs
* PDF parsing proof of concept

## Phase 2: Reader Core

* PDF viewer
* chunk metadata API
* highlight overlay rendering
* basic play/pause TTS flow

## Phase 3: Synchronization

* audio grouping
* sentence timeline offsets
* auto-scroll to active chunk
* progress persistence

## Phase 4: Hardening

* unsupported PDF detection
* voice selection
* speed control
* analytics
* error handling polish

---

## 25. Example End-to-End Flow

### Upload

1. User uploads `biology_chapter_3.pdf`.
2. API stores file in object storage and creates document record.
3. Worker extracts text from 42 pages.
4. Worker builds 1,280 sentence chunks with page coordinates.
5. Worker batches chunks into 110 audio groups and synthesizes audio.
6. Document status becomes `ready`.

### Read

1. User opens document.
2. Frontend loads page previews and chunk metadata.
3. User clicks play.
4. Audio group 1 starts.
5. Chunk 1 is highlighted.
6. When chunk 2 begins, highlight moves.
7. Reader scrolls to next page when page boundary is reached.
8. User pauses at page 9.
9. Progress is saved.
10. User returns later and resumes from page 9.

---

## 26. Recommended MVP Build Plan

## Team Composition

* 1 frontend engineer
* 1 backend engineer
* 1 product-minded full-stack engineer or tech lead
* 1 designer optional but helpful

## Estimated Build Sequence

### Sprint 1

* auth
* upload flow
* S3/document storage
* document DB model
* processing job skeleton

### Sprint 2

* PDF parsing and chunk generation
* document status UI
* basic PDF viewer

### Sprint 3

* TTS generation
* playback engine
* chunk highlighting

### Sprint 4

* page auto-scroll
* progress persistence
* voice and speed controls
* failure handling

### Sprint 5

* QA against real PDFs
* sync tuning
* analytics
* deployment hardening

---

## 27. Future Architecture Evolution

Once the MVP proves demand, the architecture can evolve toward:

* OCR fallback pipeline for scanned PDFs
* chapter and semantic section detection using LLMs
* smarter reading order recovery for complex layouts
* word-level timing with provider speech marks
* AI summarization and ask-the-document experiences
* personalized reading voices and listening modes

At that stage, an LLM becomes more strategically useful for:

* structure recovery
* semantic chunking
* section title inference
* glossary detection
* smart skipping of references, citations, headers, and footnotes

For MVP, however, the product should rely primarily on deterministic PDF processing and conventional TTS.

---

## 28. Final Recommendation

The fastest path to a strong MVP is:

1. Support **text-based PDFs only**.
2. Use **PDF.js + backend PDF extraction**.
3. Segment into **sentence-level chunks**.
4. Store **page bounding boxes** for highlighting.
5. Use **cloud TTS** with grouped audio chunks.
6. Drive the UI with a **timeline-based playback state machine**.
7. Focus the first version on **accuracy, clarity, and stability**, not AI novelty.

The real product moat is not just "LLM + TTS." It is the quality of synchronization between **document structure, audio playback, and visual highlighting**.

That synchronization layer is the actual MVP.

---

## 29. Open Questions for Product Discovery

Before implementation, these questions should be answered:

1. What is the max supported PDF size and page count for MVP?
2. Will the app require sign-in before upload or allow guest trials?
3. Should audio be pre-generated entirely, partially, or on demand?
4. What level of layout complexity is acceptable for launch?
5. Which TTS provider best balances cost, latency, and voice quality?
6. Is mobile web a hard requirement at MVP stage?
7. Should users be able to click arbitrary text and start playback there immediately?
8. What pricing model will eventually matter: per document, per page, or subscription?

---

## 30. Suggested Technical Recommendation Summary

If building today, I would recommend:

* **Frontend:** Next.js + TypeScript + PDF.js + Tailwind
* **Backend:** FastAPI + PostgreSQL + Redis
* **Storage:** S3
* **Worker:** Celery
* **PDF parsing:** PyMuPDF
* **TTS:** AWS Polly or Google Cloud TTS
* **Highlight model:** sentence chunks with bounding box overlay
* **Playback model:** batched audio groups with per-sentence offsets

This combination is practical, relatively fast to build, and strong enough for an MVP that feels real.

---

## 31. Appendix: Minimal MVP API Contract

### Upload Response

```json
{
  "document_id": "doc_123",
  "status": "processing"
}
```

### Status Response

```json
{
  "document_id": "doc_123",
  "status": "ready",
  "progress": 100
}
```

### Chunks Response

```json
{
  "document_id": "doc_123",
  "chunks": [
    {
      "id": "c_1",
      "page": 1,
      "text": "Introduction to neural networks.",
      "bbox": [74, 152, 440, 176],
      "audio_group_id": "g_1",
      "audio_start_ms": 0,
      "audio_end_ms": 1900,
      "sequence_order": 1
    }
  ]
}
```

### Progress Update Request

```json
{
  "current_chunk_id": "c_381",
  "current_page": 18,
  "current_audio_group_id": "g_26",
  "current_offset_ms": 4200
}
```

---

## 32. Closing Note

This product does not need a frontier LLM to be impressive at MVP stage. The most important engineering work is:

* robust PDF extraction
* stable chunking
* accurate coordinate mapping
* smooth audio orchestration
* believable highlight synchronization

If those are done well, the app will already feel magical to users.

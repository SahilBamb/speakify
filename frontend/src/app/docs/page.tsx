import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Speakify Docs — Complete Feature Reference",
  description: "Everything you need to know about Speakify. Detailed documentation for every feature, from PDF upload to AI book generation.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "getting-started", label: "Getting Started" },
  { id: "pdf-upload", label: "PDF Upload & Processing" },
  { id: "pdf-reader", label: "PDF Reader" },
  { id: "book-generation", label: "AI Book Generation" },
  { id: "book-reader", label: "Book Reader" },
  { id: "playback", label: "Playback Controls" },
  { id: "highlighting", label: "Real-Time Highlighting" },
  { id: "tts", label: "Text-to-Speech (Piper TTS)" },
  { id: "themes", label: "Themes & Dark Mode" },
  { id: "reading-prefs", label: "Reading Preferences" },
  { id: "navigation", label: "Navigation & TOC" },
  { id: "keyboard", label: "Keyboard Shortcuts" },
  { id: "progress", label: "Progress Saving" },
  { id: "architecture", label: "Architecture" },
  { id: "api-reference", label: "API Reference" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      <div className="flex-1 flex max-w-6xl mx-auto w-full px-6 pt-8 pb-20 gap-10">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              On this page
            </p>
            {TOC.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="block px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile TOC */}
          <div className="lg:hidden mb-8">
            <details className="glass rounded-xl">
              <summary className="px-4 py-3 text-sm font-medium text-slate-600 cursor-pointer">
                Table of Contents
              </summary>
              <div className="px-4 pb-3 space-y-1">
                {TOC.map(({ id, label }) => (
                  <a key={id} href={`#${id}`} className="block py-1 text-sm text-slate-500 hover:text-indigo-600">
                    {label}
                  </a>
                ))}
              </div>
            </details>
          </div>

          <div className="space-y-16">
            {/* Overview */}
            <DocSection id="overview" title="Overview">
              <p>
                Speakify is an AI-powered text-to-speech reader application. It combines a <strong>Next.js frontend</strong> with
                a <strong>Python FastAPI backend</strong> to deliver two core experiences:
              </p>
              <ol>
                <li><strong>PDF Listening</strong> — Upload any PDF and listen to it read aloud with real-time sentence highlighting on the rendered pages.</li>
                <li><strong>AI Book Generation</strong> — Enter any topic and have an AI generate a complete multi-chapter book, then listen to it chapter by chapter.</li>
              </ol>
              <p>
                Both modes feature natural-sounding text-to-speech via <strong>Piper TTS</strong> (fully offline, no API costs),
                real-time highlighting, progress saving, dark mode, reading customization, and keyboard shortcuts.
              </p>
            </DocSection>

            {/* Getting Started */}
            <DocSection id="getting-started" title="Getting Started">
              <p>
                From the <Link href="/dashboard" className="text-indigo-500 hover:underline">Dashboard</Link>, choose
                between two tabs:
              </p>
              <ul>
                <li><strong>Upload PDF</strong> — Drag-and-drop or click to select a PDF file from your computer.</li>
                <li><strong>Listen to Any Book</strong> — Type a topic, title, or subject and click Generate.</li>
              </ul>
              <p>
                Both create a new entry in the list below. Once processing completes (status shows &quot;Ready&quot;),
                click on the item to open the reader.
              </p>
              <InfoBox>
                Processing happens in the background. You can navigate away and come back — the status auto-refreshes every 2 seconds.
              </InfoBox>
            </DocSection>

            {/* PDF Upload */}
            <DocSection id="pdf-upload" title="PDF Upload & Processing">
              <h3>Uploading</h3>
              <p>
                The upload zone accepts any <code>.pdf</code> file. Files are sent to the backend via multipart form upload.
                The backend stores the original PDF and begins processing immediately.
              </p>

              <h3>Processing Pipeline</h3>
              <p>Processing runs as a background task and involves several stages:</p>
              <ol>
                <li><strong>Text Extraction</strong> — PyMuPDF opens the PDF and extracts text blocks from each page, preserving spatial positioning.</li>
                <li><strong>Sentence Segmentation</strong> — Text is split into individual sentences using regex-based boundary detection that handles abbreviations and decimal numbers.</li>
                <li><strong>Bounding Box Calculation</strong> — Each sentence gets precise coordinates (x0, y0, x1, y1) on its PDF page for overlay highlighting.</li>
                <li><strong>Duration Estimation</strong> — Each sentence receives an estimated spoken duration based on character count.</li>
                <li><strong>Audio Generation</strong> — Piper TTS generates a WAV file for every sentence, stored on the server.</li>
              </ol>

              <h3>Document Management</h3>
              <p>
                From the dashboard, you can see all uploaded documents with their status. Clicking the trash icon deletes a document
                and its associated audio files. The list auto-refreshes while any document is still processing.
              </p>
            </DocSection>

            {/* PDF Reader */}
            <DocSection id="pdf-reader" title="PDF Reader">
              <p>
                The PDF reader renders the actual PDF pages using <code>react-pdf</code> and overlays sentence highlights
                on top of the rendered canvas.
              </p>

              <h3>Zoom Controls</h3>
              <p>
                A toolbar at the top provides zoom in/out buttons and a reset button. The zoom level affects both the PDF
                rendering and the highlight overlay positions. A page number input lets you jump directly to any page.
              </p>

              <h3>Highlight Overlays</h3>
              <p>
                Each sentence has a bounding box stored in the database. These are rendered as semi-transparent overlays
                on the PDF canvas. The active sentence (currently being read) gets a stronger highlight with a ring effect.
              </p>

              <h3>Auto-Scrolling</h3>
              <p>
                As playback progresses, the viewer automatically scrolls to keep the active sentence visible in the viewport.
              </p>
            </DocSection>

            {/* Book Generation */}
            <DocSection id="book-generation" title="AI Book Generation">
              <h3>How It Works</h3>
              <p>
                When you enter a topic and click Generate, the backend sends a request to OpenAI GPT-4o-mini to create
                a structured book outline:
              </p>
              <ol>
                <li>The <strong>outline generation</strong> returns a title, description, and a list of chapters (each with title and summary).</li>
                <li>The first chapter&apos;s <strong>content is generated immediately</strong> and split into sentences.</li>
                <li>Subsequent chapters are <strong>generated on-demand</strong> — only when you navigate to them.</li>
                <li>For each chapter, Piper TTS generates audio for every sentence.</li>
              </ol>

              <h3>Generation is Asynchronous</h3>
              <p>
                Both book outline and chapter content generation run as background tasks. The API returns immediately with
                a &quot;generating&quot; status, and the frontend polls until the content is ready. This prevents timeouts
                and keeps the UI responsive.
              </p>

              <InfoBox>
                LLM calls have a 120-second timeout. If generation fails, the status shows &quot;failed&quot; with an error
                message, and you can retry.
              </InfoBox>

              <h3>Book Management</h3>
              <p>
                Generated books appear in the list with their status. You can delete books you no longer need.
                The list auto-refreshes while any book is still generating.
              </p>
            </DocSection>

            {/* Book Reader */}
            <DocSection id="book-reader" title="Book Reader">
              <p>
                The book reader displays chapter content as flowing text (not rendered PDF pages). It includes:
              </p>
              <ul>
                <li><strong>Chapter navigation</strong> — Prev/Next buttons, a dropdown selector, and a table of contents sidebar.</li>
                <li><strong>Reading preferences</strong> — A panel to customize font, size, and line height (see <a href="#reading-prefs" className="text-indigo-500 hover:underline">Reading Preferences</a>).</li>
                <li><strong>Auto-advance</strong> — When playback reaches the end of a chapter, it automatically loads and plays the next one.</li>
              </ul>
              <p>
                If a chapter hasn&apos;t been generated yet, navigating to it triggers generation automatically with a loading state.
              </p>
            </DocSection>

            {/* Playback */}
            <DocSection id="playback" title="Playback Controls">
              <p>
                The playback bar appears at the bottom of both reader views and provides:
              </p>

              <table>
                <thead>
                  <tr>
                    <th>Control</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Play / Pause</td><td>Start or pause audio playback</td></tr>
                  <tr><td>Stop</td><td>Stop playback and reset to the beginning</td></tr>
                  <tr><td>Skip Forward</td><td>Jump to the next sentence</td></tr>
                  <tr><td>Skip Backward</td><td>Jump to the previous sentence</td></tr>
                  <tr><td>Speed Control</td><td>Cycle through 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x, 3x</td></tr>
                  <tr><td>Progress Bar</td><td>Shows position within the current sentence&apos;s audio</td></tr>
                  <tr><td>Sentence Counter</td><td>Shows current sentence number out of total</td></tr>
                </tbody>
              </table>

              <h3>Audio Preloading</h3>
              <p>
                When a sentence starts playing, the next sentence&apos;s audio is preloaded in the background.
                This ensures seamless, gapless transitions between sentences.
              </p>
            </DocSection>

            {/* Highlighting */}
            <DocSection id="highlighting" title="Real-Time Highlighting">
              <h3>PDF Mode</h3>
              <p>
                In the PDF reader, each sentence&apos;s bounding box is stored as <code>[x0, y0, x1, y1]</code> coordinates
                relative to the original PDF page dimensions. These are scaled by the current zoom level and rendered as
                absolutely-positioned overlays on the canvas.
              </p>
              <p>
                The active sentence uses a stronger highlight color with a ring effect. Non-active sentences get a subtle
                background tint when hovered.
              </p>

              <h3>Book Mode</h3>
              <p>
                In the text reader, sentences are rendered as individual <code>&lt;span&gt;</code> elements. The active
                sentence receives a highlight background class and the container auto-scrolls to keep it centered.
              </p>

              <h3>Click-to-Jump</h3>
              <p>
                In both modes, clicking on any sentence immediately jumps playback to that sentence. If audio is currently
                playing, it switches to the clicked sentence without interruption.
              </p>
            </DocSection>

            {/* TTS */}
            <DocSection id="tts" title="Text-to-Speech (Piper TTS)">
              <p>
                Speakify uses <a href="https://github.com/rhasspy/piper" className="text-indigo-500 hover:underline" target="_blank" rel="noopener noreferrer">Piper TTS</a>,
                a fast, local neural text-to-speech engine. Audio is generated server-side and served as WAV files.
              </p>

              <h3>Voice Model</h3>
              <p>
                The default voice is <code>en_US-lessac-medium</code>, which provides natural English speech. Voice models are
                ONNX files stored in the <code>backend/models/</code> directory. You can download alternative voices from the
                {" "}<a href="https://huggingface.co/rhasspy/piper-voices" className="text-indigo-500 hover:underline" target="_blank" rel="noopener noreferrer">Piper voices repository</a>.
              </p>

              <h3>Audio Storage</h3>
              <p>For PDFs, audio files are stored at:</p>
              <Pre>backend/audio/&lt;document_id&gt;/&lt;sequence_order&gt;.wav</Pre>
              <p>For generated books:</p>
              <Pre>backend/audio/book_&lt;book_id&gt;/ch&lt;chapter_number&gt;/&lt;sequence_order&gt;.wav</Pre>

              <h3>Why Offline TTS?</h3>
              <ul>
                <li><strong>No API costs</strong> — Generate unlimited audio without per-character fees.</li>
                <li><strong>No internet required</strong> — Works completely offline once models are downloaded.</li>
                <li><strong>Fast</strong> — Piper generates audio significantly faster than real-time.</li>
                <li><strong>Privacy</strong> — Your text never leaves your server.</li>
              </ul>
            </DocSection>

            {/* Themes */}
            <DocSection id="themes" title="Themes & Dark Mode">
              <p>
                Speakify includes a complete theming system with light and dark modes.
              </p>

              <h3>Theme Options</h3>
              <ul>
                <li><strong>Light</strong> — Pastel gradient background with white frosted glass panels.</li>
                <li><strong>Dark</strong> — Deep slate/purple gradient with semi-transparent dark panels.</li>
                <li><strong>System</strong> — Automatically matches your OS preference and updates in real time.</li>
              </ul>

              <h3>Implementation</h3>
              <p>
                The theme is managed via a React Context (<code>ThemeProvider</code>) that adds or removes the <code>dark</code> class
                on the root <code>&lt;html&gt;</code> element. All colors are defined as CSS custom properties that swap between light
                and dark values. The selection persists in <code>localStorage</code>.
              </p>
            </DocSection>

            {/* Reading Prefs */}
            <DocSection id="reading-prefs" title="Reading Preferences">
              <p>
                In the book reader, a slide-out panel lets you customize:
              </p>

              <table>
                <thead>
                  <tr>
                    <th>Setting</th>
                    <th>Options</th>
                    <th>Default</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Font Family</td><td>Inter, Georgia, System UI, Merriweather</td><td>Inter</td></tr>
                  <tr><td>Font Size</td><td>14px – 24px (2px steps)</td><td>18px</td></tr>
                  <tr><td>Line Height</td><td>1.4 – 2.2 (0.2 steps)</td><td>1.8</td></tr>
                </tbody>
              </table>

              <p>
                Preferences are stored in <code>localStorage</code> and restored on every visit. The panel closes when you click
                outside it.
              </p>
            </DocSection>

            {/* Navigation */}
            <DocSection id="navigation" title="Navigation & Table of Contents">
              <h3>Table of Contents Sidebar</h3>
              <p>
                Both the PDF reader and book reader include a collapsible sidebar showing the full document structure:
              </p>
              <ul>
                <li><strong>PDF</strong> — Lists every page with its number. The current page is highlighted.</li>
                <li><strong>Books</strong> — Lists every chapter with its title. The current chapter is highlighted.</li>
              </ul>
              <p>
                Click any entry to jump directly to that page or chapter. On mobile, the sidebar uses an overlay pattern that
                closes when you tap outside.
              </p>

              <h3>Chapter Controls (Books)</h3>
              <p>
                The book reader header includes Previous/Next buttons and a dropdown selector for quick chapter switching.
                If you navigate to an ungenerated chapter, it triggers generation automatically.
              </p>

              <h3>Page Controls (PDFs)</h3>
              <p>
                The PDF reader includes zoom in/out/reset buttons and a page number input for jumping to a specific page.
              </p>
            </DocSection>

            {/* Keyboard Shortcuts */}
            <DocSection id="keyboard" title="Keyboard Shortcuts">
              <p>
                Press <Kbd>?</Kbd> at any time in a reader to show the shortcuts modal. Available shortcuts:
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><Kbd>Space</Kbd></td><td>Play / Pause</td></tr>
                  <tr><td><Kbd>&rarr;</Kbd></td><td>Next sentence</td></tr>
                  <tr><td><Kbd>&larr;</Kbd></td><td>Previous sentence</td></tr>
                  <tr><td><Kbd>N</Kbd></td><td>Next chapter (books only)</td></tr>
                  <tr><td><Kbd>P</Kbd></td><td>Previous chapter (books only)</td></tr>
                  <tr><td><Kbd>?</Kbd></td><td>Toggle shortcuts help</td></tr>
                </tbody>
              </table>
            </DocSection>

            {/* Progress Saving */}
            <DocSection id="progress" title="Progress Saving">
              <p>
                Your reading position is saved automatically every 5 seconds and when you leave the reader.
              </p>
              <h3>PDF Progress</h3>
              <p>
                Stores the current chunk ID and page number. When you reopen a PDF, playback resumes from the exact
                sentence you left off on.
              </p>
              <h3>Book Progress</h3>
              <p>
                Stores the current chapter number and chunk ID. Reopening a book loads the correct chapter and
                positions you at the last sentence.
              </p>
            </DocSection>

            {/* Architecture */}
            <DocSection id="architecture" title="Architecture">
              <h3>Frontend</h3>
              <Pre>{`Next.js 16 (App Router) + React 19 + TypeScript
Tailwind CSS 4 for styling
react-pdf for PDF rendering
Custom hooks: usePlayback, useReadingPrefs, useKeyboardShortcuts
fetchWithRetry for resilient API calls`}</Pre>

              <h3>Backend</h3>
              <Pre>{`Python FastAPI
SQLAlchemy + SQLite for data persistence
PyMuPDF for PDF text extraction
Piper TTS for audio generation
OpenAI GPT-4o-mini for book generation
Background threading for long-running tasks
Structured logging with request-ID correlation`}</Pre>

              <h3>Data Flow</h3>
              <ol>
                <li>Frontend uploads PDF or requests book generation via REST API.</li>
                <li>Backend processes in a background thread, returning 202 Accepted.</li>
                <li>Frontend polls for completion status.</li>
                <li>Once ready, frontend fetches text chunks and streams audio per-sentence.</li>
                <li>Playback, highlighting, and progress saving all happen client-side.</li>
              </ol>
            </DocSection>

            {/* API Reference */}
            <DocSection id="api-reference" title="API Reference">
              <p>The backend exposes a REST API at <code>http://localhost:8000</code>. Key endpoints:</p>

              <h3>Documents (PDFs)</h3>
              <ApiEndpoint method="POST" path="/api/upload" description="Upload a PDF file (multipart form)" />
              <ApiEndpoint method="GET" path="/api/documents" description="List all documents with status" />
              <ApiEndpoint method="GET" path="/api/documents/:id" description="Get document detail with page dimensions" />
              <ApiEndpoint method="GET" path="/api/documents/:id/chunks" description="Get all text chunks for a document" />
              <ApiEndpoint method="GET" path="/api/documents/:id/pdf" description="Serve the original PDF file" />
              <ApiEndpoint method="GET" path="/api/audio/:doc_id/:sequence_order" description="Serve audio WAV for a sentence" />
              <ApiEndpoint method="GET" path="/api/documents/:id/progress" description="Get saved reading progress" />
              <ApiEndpoint method="POST" path="/api/documents/:id/progress" description="Save reading progress" />
              <ApiEndpoint method="DELETE" path="/api/documents/:id" description="Delete document and all associated data" />

              <h3>Books (AI-Generated)</h3>
              <ApiEndpoint method="POST" path="/api/books/generate" description="Generate a book from a topic (async, returns 202)" />
              <ApiEndpoint method="GET" path="/api/books" description="List all generated books" />
              <ApiEndpoint method="GET" path="/api/books/:id" description="Get book detail with chapter list" />
              <ApiEndpoint method="POST" path="/api/books/:id/chapters/:num/generate" description="Generate a chapter (async, returns 202)" />
              <ApiEndpoint method="GET" path="/api/books/:id/chapters/:num/chunks" description="Get chapter text chunks" />
              <ApiEndpoint method="GET" path="/api/book-audio/:id/:chapter/:sequence" description="Serve book audio WAV" />
              <ApiEndpoint method="GET" path="/api/books/:id/progress" description="Get saved book progress" />
              <ApiEndpoint method="POST" path="/api/books/:id/progress" description="Save book progress" />
              <ApiEndpoint method="DELETE" path="/api/books/:id" description="Delete book and all associated data" />
            </DocSection>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}

function DocSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 doc-section">
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-6 pb-3 border-b border-slate-200/60">
        {title}
      </h2>
      <div className="prose-speakify space-y-4">
        {children}
      </div>
    </section>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl px-5 py-4 text-sm text-slate-600 border-l-4 border-indigo-400/60">
      {children}
    </div>
  );
}

function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre className="glass rounded-xl px-5 py-4 text-xs font-mono text-slate-600 overflow-x-auto leading-relaxed">
      {children}
    </pre>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 shadow-sm">
      {children}
    </kbd>
  );
}

function ApiEndpoint({ method, path, description }: { method: string; path: string; description: string }) {
  const methodColor = method === "GET" ? "text-emerald-600 bg-emerald-50" :
    method === "POST" ? "text-indigo-600 bg-indigo-50" :
    "text-rose-600 bg-rose-50";
  return (
    <div className="flex items-start gap-3 py-2">
      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${methodColor} shrink-0 mt-0.5`}>
        {method}
      </span>
      <div className="min-w-0">
        <code className="text-sm text-slate-700 font-mono break-all">{path}</code>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

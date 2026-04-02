import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Speakify Docs",
  description: "Everything you need to know about Speakify. Detailed documentation for every feature.",
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

      <div className="flex-1 flex max-w-4xl mx-auto w-full px-6 pt-8 pb-20 gap-8">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-24 space-y-0.5">
            <p className="text-[10px] font-semibold text-theme-muted uppercase tracking-wider mb-3 px-3">
              On this page
            </p>
            {TOC.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="block px-3 py-1.5 rounded-lg text-xs text-theme-muted hover:text-theme-primary hover:bg-theme-hover transition-colors"
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
              <summary className="px-4 py-3 text-xs font-medium text-theme-secondary cursor-pointer">
                Table of Contents
              </summary>
              <div className="px-4 pb-3 grid grid-cols-2 gap-1">
                {TOC.map(({ id, label }) => (
                  <a key={id} href={`#${id}`} className="py-1 text-xs text-theme-muted hover:text-theme-primary transition-colors">
                    {label}
                  </a>
                ))}
              </div>
            </details>
          </div>

          <div className="space-y-12">
            <DocSection id="overview" title="Overview">
              <p>
                Speakify is an AI-powered text-to-speech reader. It combines a <strong>Next.js frontend</strong> with
                a <strong>Python FastAPI backend</strong> to deliver two core experiences:
              </p>
              <ol>
                <li><strong>PDF Listening</strong> — Upload any PDF and listen with real-time sentence highlighting.</li>
                <li><strong>AI Book Generation</strong> — Enter any topic and get a multi-chapter book, then listen chapter by chapter.</li>
              </ol>
              <p>
                Both modes feature natural text-to-speech via <strong>Piper TTS</strong> (fully offline),
                real-time highlighting, progress saving, dark mode, and keyboard shortcuts.
              </p>
            </DocSection>

            <DocSection id="getting-started" title="Getting Started">
              <p>
                From the <Link href="/dashboard" className="doc-link">Dashboard</Link>, choose between two tabs:
              </p>
              <ul>
                <li><strong>Upload PDF</strong> — Drag-and-drop or click to select a PDF.</li>
                <li><strong>Listen to Any Book</strong> — Type a topic and click Generate.</li>
              </ul>
              <p>
                Both create a new entry. Once processing completes (status &quot;Ready&quot;), click to open the reader.
              </p>
              <InfoBox>
                Processing runs in the background. The status auto-refreshes every 2 seconds.
              </InfoBox>
            </DocSection>

            <DocSection id="pdf-upload" title="PDF Upload & Processing">
              <h3>Uploading</h3>
              <p>
                The upload zone accepts any <code>.pdf</code> file via multipart form upload.
                The backend stores the PDF and begins processing immediately.
              </p>
              <h3>Processing Pipeline</h3>
              <ol>
                <li><strong>Text Extraction</strong> — PyMuPDF extracts text blocks from each page, preserving spatial positioning.</li>
                <li><strong>Sentence Segmentation</strong> — Regex-based boundary detection handles abbreviations and decimals.</li>
                <li><strong>Bounding Box Calculation</strong> — Precise coordinates for overlay highlighting.</li>
                <li><strong>Duration Estimation</strong> — Estimated spoken duration based on character count.</li>
                <li><strong>Audio Generation</strong> — Piper TTS generates a WAV file per sentence.</li>
              </ol>
              <h3>Document Management</h3>
              <p>
                Documents show on the dashboard with status. Delete via the trash icon. The list auto-refreshes while processing.
              </p>
            </DocSection>

            <DocSection id="pdf-reader" title="PDF Reader">
              <p>
                Renders PDF pages via <code>react-pdf</code> with sentence highlight overlays on the canvas.
              </p>
              <h3>Zoom Controls</h3>
              <p>
                Zoom in/out buttons and a reset button. A page number input for direct page jumps.
              </p>
              <h3>Highlight Overlays</h3>
              <p>
                Bounding boxes render as semi-transparent overlays. The active sentence gets a stronger highlight with a ring.
              </p>
              <h3>Auto-Scrolling</h3>
              <p>
                The viewer scrolls to keep the active sentence visible.
              </p>
            </DocSection>

            <DocSection id="book-generation" title="AI Book Generation">
              <h3>How It Works</h3>
              <ol>
                <li><strong>Outline generation</strong> returns a title, description, and chapter list.</li>
                <li>The first chapter&apos;s <strong>content is generated immediately</strong>.</li>
                <li>Subsequent chapters are <strong>generated on-demand</strong>.</li>
                <li>Piper TTS generates audio for every sentence.</li>
              </ol>
              <h3>Asynchronous Processing</h3>
              <p>
                Generation runs as background tasks. The API returns 202 immediately; the frontend polls until ready.
              </p>
              <InfoBox>
                LLM calls have a 120-second timeout. Failed generations show an error and can be retried.
              </InfoBox>
            </DocSection>

            <DocSection id="book-reader" title="Book Reader">
              <p>
                Displays chapter content as flowing text with:
              </p>
              <ul>
                <li><strong>Chapter navigation</strong> — Prev/Next buttons, dropdown, and table of contents sidebar.</li>
                <li><strong>Reading preferences</strong> — Font, size, and line height customization.</li>
                <li><strong>Auto-advance</strong> — Automatically plays the next chapter when one finishes.</li>
              </ul>
              <p>
                Navigating to an ungenerated chapter triggers generation automatically.
              </p>
            </DocSection>

            <DocSection id="playback" title="Playback Controls">
              <p>
                The playback bar appears at the bottom of both readers:
              </p>
              <table>
                <thead>
                  <tr><th>Control</th><th>Description</th></tr>
                </thead>
                <tbody>
                  <tr><td>Play / Pause</td><td>Start or pause audio</td></tr>
                  <tr><td>Stop</td><td>Stop and reset to beginning</td></tr>
                  <tr><td>Skip Forward / Back</td><td>Jump by sentence</td></tr>
                  <tr><td>Speed</td><td>0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x, 3x</td></tr>
                  <tr><td>Progress Bar</td><td>Position within current sentence</td></tr>
                </tbody>
              </table>
              <h3>Audio Preloading</h3>
              <p>
                The next sentence&apos;s audio preloads during playback for gapless transitions.
              </p>
            </DocSection>

            <DocSection id="highlighting" title="Real-Time Highlighting">
              <h3>PDF Mode</h3>
              <p>
                Bounding boxes (<code>[x0, y0, x1, y1]</code>) scale with zoom and render as overlays on the canvas.
              </p>
              <h3>Book Mode</h3>
              <p>
                Sentences are <code>&lt;span&gt;</code> elements. The active one receives a highlight class with auto-scroll.
              </p>
              <h3>Click-to-Jump</h3>
              <p>
                Click any sentence to jump playback to it immediately.
              </p>
            </DocSection>

            <DocSection id="tts" title="Text-to-Speech (Piper TTS)">
              <p>
                <a href="https://github.com/rhasspy/piper" className="doc-link" target="_blank" rel="noopener noreferrer">Piper TTS</a> runs
                locally — fast, offline, and free.
              </p>
              <h3>Voice Model</h3>
              <p>
                Default: <code>en_US-lessac-medium</code>. Models are ONNX files in <code>backend/models/</code>.
                Download alternatives from <a href="https://huggingface.co/rhasspy/piper-voices" className="doc-link" target="_blank" rel="noopener noreferrer">Piper voices</a>.
              </p>
              <h3>Audio Storage</h3>
              <Pre>PDFs:  backend/audio/&lt;doc_id&gt;/&lt;sequence&gt;.wav{"\n"}Books: backend/audio/book_&lt;book_id&gt;/ch&lt;num&gt;/&lt;sequence&gt;.wav</Pre>
              <h3>Why Offline?</h3>
              <ul>
                <li>No API costs — unlimited generation.</li>
                <li>No internet required once models are downloaded.</li>
                <li>Fast — generates faster than real-time.</li>
                <li>Private — text never leaves your server.</li>
              </ul>
            </DocSection>

            <DocSection id="themes" title="Themes & Dark Mode">
              <ul>
                <li><strong>Light</strong> — Pastel gradient + white frosted glass.</li>
                <li><strong>Dark</strong> — Deep gradient + dark frosted glass.</li>
                <li><strong>System</strong> — Auto-matches your OS preference.</li>
              </ul>
              <p>
                Managed via <code>ThemeProvider</code> context. Colors are CSS custom properties that swap between modes.
                Persists in <code>localStorage</code>.
              </p>
            </DocSection>

            <DocSection id="reading-prefs" title="Reading Preferences">
              <table>
                <thead>
                  <tr><th>Setting</th><th>Options</th><th>Default</th></tr>
                </thead>
                <tbody>
                  <tr><td>Font Family</td><td>Inter, Georgia, System UI, Merriweather</td><td>Inter</td></tr>
                  <tr><td>Font Size</td><td>14px – 24px</td><td>18px</td></tr>
                  <tr><td>Line Height</td><td>1.4 – 2.2</td><td>1.8</td></tr>
                </tbody>
              </table>
              <p>
                Accessible via the slide-out panel in the book reader. Stored in <code>localStorage</code>.
              </p>
            </DocSection>

            <DocSection id="navigation" title="Navigation & TOC">
              <h3>Table of Contents</h3>
              <ul>
                <li><strong>PDFs</strong> — Page numbers, current page highlighted.</li>
                <li><strong>Books</strong> — Chapter titles, current chapter highlighted.</li>
              </ul>
              <p>Click any entry to jump. Mobile uses an overlay pattern.</p>
              <h3>Chapter Controls</h3>
              <p>Prev/Next buttons and a dropdown selector for quick chapter switching.</p>
              <h3>PDF Controls</h3>
              <p>Zoom in/out/reset and a page number input.</p>
            </DocSection>

            <DocSection id="keyboard" title="Keyboard Shortcuts">
              <p>Press <Kbd>?</Kbd> in any reader to show the help modal.</p>
              <table>
                <thead>
                  <tr><th>Key</th><th>Action</th></tr>
                </thead>
                <tbody>
                  <tr><td><Kbd>Space</Kbd></td><td>Play / Pause</td></tr>
                  <tr><td><Kbd>&rarr;</Kbd></td><td>Next sentence</td></tr>
                  <tr><td><Kbd>&larr;</Kbd></td><td>Previous sentence</td></tr>
                  <tr><td><Kbd>N</Kbd></td><td>Next chapter</td></tr>
                  <tr><td><Kbd>P</Kbd></td><td>Previous chapter</td></tr>
                  <tr><td><Kbd>?</Kbd></td><td>Toggle help</td></tr>
                </tbody>
              </table>
            </DocSection>

            <DocSection id="progress" title="Progress Saving">
              <p>Position auto-saves every 5 seconds and on exit.</p>
              <ul>
                <li><strong>PDFs</strong> — Saves chunk ID and page number.</li>
                <li><strong>Books</strong> — Saves chapter number and chunk ID.</li>
              </ul>
              <p>Reopening a document resumes from the exact sentence.</p>
            </DocSection>

            <DocSection id="architecture" title="Architecture">
              <h3>Frontend</h3>
              <Pre>{`Next.js 16 (App Router) + React 19 + TypeScript
Tailwind CSS 4
react-pdf for PDF rendering
Custom hooks: usePlayback, useReadingPrefs, useKeyboardShortcuts
fetchWithRetry for resilient API calls`}</Pre>
              <h3>Backend</h3>
              <Pre>{`Python FastAPI
SQLAlchemy + SQLite
PyMuPDF for PDF extraction
Piper TTS for audio generation
OpenAI GPT-4o-mini for book generation
Background threading
Structured logging with request-ID correlation`}</Pre>
              <h3>Data Flow</h3>
              <ol>
                <li>Frontend uploads PDF or requests generation via REST API.</li>
                <li>Backend processes in a background thread (returns 202).</li>
                <li>Frontend polls for status.</li>
                <li>Once ready, fetches chunks and streams audio per-sentence.</li>
                <li>Playback, highlighting, and progress run client-side.</li>
              </ol>
            </DocSection>

            <DocSection id="api-reference" title="API Reference">
              <p>REST API at <code>http://localhost:8000</code>.</p>
              <h3>Documents (PDFs)</h3>
              <ApiEndpoint method="POST" path="/api/upload" description="Upload a PDF (multipart form)" />
              <ApiEndpoint method="GET" path="/api/documents" description="List all documents" />
              <ApiEndpoint method="GET" path="/api/documents/:id" description="Document detail with pages" />
              <ApiEndpoint method="GET" path="/api/documents/:id/chunks" description="Text chunks for a document" />
              <ApiEndpoint method="GET" path="/api/documents/:id/pdf" description="Serve the original PDF" />
              <ApiEndpoint method="GET" path="/api/audio/:id/:seq" description="Sentence audio WAV" />
              <ApiEndpoint method="GET" path="/api/documents/:id/progress" description="Reading progress" />
              <ApiEndpoint method="POST" path="/api/documents/:id/progress" description="Save progress" />
              <ApiEndpoint method="DELETE" path="/api/documents/:id" description="Delete document" />
              <h3>Books (AI-Generated)</h3>
              <ApiEndpoint method="POST" path="/api/books/generate" description="Generate a book (async, 202)" />
              <ApiEndpoint method="GET" path="/api/books" description="List all books" />
              <ApiEndpoint method="GET" path="/api/books/:id" description="Book detail with chapters" />
              <ApiEndpoint method="POST" path="/api/books/:id/chapters/:n/generate" description="Generate chapter (async, 202)" />
              <ApiEndpoint method="GET" path="/api/books/:id/chapters/:n/chunks" description="Chapter text chunks" />
              <ApiEndpoint method="GET" path="/api/book-audio/:id/:ch/:seq" description="Chapter audio WAV" />
              <ApiEndpoint method="GET" path="/api/books/:id/progress" description="Book progress" />
              <ApiEndpoint method="POST" path="/api/books/:id/progress" description="Save book progress" />
              <ApiEndpoint method="DELETE" path="/api/books/:id" description="Delete book" />
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
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-semibold text-theme-primary tracking-tight mb-4 pb-2 border-b border-white/40">
        {title}
      </h2>
      <div className="prose-speakify space-y-3">
        {children}
      </div>
    </section>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass rounded-lg px-4 py-3 text-xs text-theme-secondary border-l-3 border-indigo-400/50">
      {children}
    </div>
  );
}

function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre className="glass rounded-lg px-4 py-3 text-[11px] font-mono text-theme-secondary overflow-x-auto leading-relaxed">
      {children}
    </pre>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-block px-1.5 py-0.5 rounded glass-strong text-[10px] font-mono text-theme-secondary shadow-sm">
      {children}
    </kbd>
  );
}

function ApiEndpoint({ method, path, description }: { method: string; path: string; description: string }) {
  const methodColor = method === "GET"
    ? "text-emerald-600 bg-emerald-50/80"
    : method === "POST"
    ? "text-indigo-600 bg-indigo-50/80"
    : "text-rose-600 bg-rose-50/80";
  return (
    <div className="flex items-start gap-2.5 py-1.5">
      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${methodColor} shrink-0 mt-0.5`}>
        {method}
      </span>
      <div className="min-w-0">
        <code className="text-xs text-theme-secondary font-mono break-all">{path}</code>
        <p className="text-[11px] text-theme-muted mt-0.5">{description}</p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "What Is Speakify?",
  description: "See Speakify in action. Watch demos of PDF listening, AI book generation, real-time highlighting, and more.",
};

const FEATURES = [
  {
    id: "pdf-upload",
    title: "PDF Upload & Listen",
    subtitle: "Drop any PDF. Start listening instantly.",
    description:
      "Text is extracted from your PDF with precise page-level parsing, segmented into natural sentences, and converted to audio automatically. The entire pipeline runs in the background — just upload and press play.",
    details: [
      "Drag-and-drop or click to upload any PDF",
      "Automatic text extraction preserving reading order",
      "Smart sentence segmentation across paragraphs",
      "Background audio generation while you read",
    ],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    ),
  },
  {
    id: "ai-books",
    title: "AI Book Generation",
    subtitle: "Type a topic. Get a full book.",
    description:
      "Powered by GPT-4o-mini, Speakify generates complete book outlines from any topic — fiction, non-fiction, textbooks, you name it. Chapters are created on-demand as you read, so you never wait for content you haven't reached yet.",
    details: [
      "Enter any topic, title, or subject area",
      "AI generates a structured multi-chapter outline",
      "Chapters written on-demand as you progress",
      "Full TTS audio generated for each chapter",
    ],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    ),
  },
  {
    id: "highlighting",
    title: "Real-Time Highlighting",
    subtitle: "Every sentence lights up as it's spoken.",
    description:
      "As audio plays, the current sentence is highlighted in real time. For PDFs, bounding boxes overlay the exact sentence on the rendered page. For books, the text scrolls and highlights automatically. Click any sentence to jump to it.",
    details: [
      "Sentence-level highlighting synced to audio",
      "Precise bounding box overlays on PDF pages",
      "Auto-scrolling to keep the active sentence in view",
      "Click-to-jump to any sentence in the document",
    ],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
    ),
  },
  {
    id: "playback",
    title: "Playback Controls",
    subtitle: "Play, pause, skip, and adjust speed.",
    description:
      "Full control over your listening experience. Skip forward and backward by sentence, adjust speed from 0.5x to 3x, and see a progress timeline. Audio is preloaded ahead for seamless transitions between sentences.",
    details: [
      "Play / pause / stop with one click",
      "Skip forward and backward by sentence",
      "Speed: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x, 3x",
      "Preloaded audio for gapless playback",
    ],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    ),
  },
  {
    id: "reading-prefs",
    title: "Themes & Preferences",
    subtitle: "Make it yours.",
    description:
      "Switch between light and dark themes with the frosted glass UI adapting beautifully. Customize font, text size, and line spacing. All preferences persist across sessions.",
    details: [
      "Light / dark / system theme modes",
      "Customizable font family and size",
      "Adjustable line height",
      "Preferences saved to localStorage",
    ],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    ),
  },
  {
    id: "navigation",
    title: "Navigation & Shortcuts",
    subtitle: "Navigate with precision.",
    description:
      "A collapsible sidebar shows your full table of contents. Jump anywhere instantly. Control everything with keyboard shortcuts: Space to play/pause, arrows to skip, N/P for chapters.",
    details: [
      "Collapsible table of contents sidebar",
      "Chapter and page-level navigation",
      "Full keyboard shortcut support",
      "PDF zoom controls with page jump",
    ],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
    ),
  },
];

export default function WhatIsItPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      {/* Hero */}
      <section className="text-center px-6 pt-14 pb-10 sm:pt-20 sm:pb-14">
        <div className="max-w-2xl mx-auto space-y-3">
          <h1 className="text-2xl sm:text-3xl font-semibold text-theme-primary tracking-tight">
            What Is Speakify?
          </h1>
          <p className="text-sm text-theme-muted max-w-md mx-auto leading-relaxed">
            A full-stack AI text-to-speech reader. Here&apos;s every feature,
            with space for demos you can record.
          </p>
        </div>
      </section>

      {/* Quick jump */}
      <section className="px-6 pb-10">
        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-xl p-1 flex flex-wrap justify-center gap-1">
            {FEATURES.map((f) => (
              <a
                key={f.id}
                href={`#${f.id}`}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-theme-muted hover:text-theme-secondary hover:bg-theme-hover transition-all"
              >
                {f.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Feature sections */}
      <div className="flex-1 space-y-6 px-6 pb-16">
        {FEATURES.map((feature, i) => {
          const reversed = i % 2 !== 0;
          return (
            <section key={feature.id} id={feature.id} className="scroll-mt-24">
              <div className="max-w-3xl mx-auto">
                <div className="glass rounded-2xl p-6 sm:p-8">
                  <div className={`flex flex-col ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-6 lg:gap-10 items-start`}>
                    {/* Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg glass-strong flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-theme-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            {feature.icon}
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-base font-semibold text-theme-primary tracking-tight">{feature.title}</h2>
                          <p className="text-xs text-theme-muted">{feature.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-sm text-theme-muted leading-relaxed">
                        {feature.description}
                      </p>
                      <ul className="space-y-1.5">
                        {feature.details.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-xs text-theme-secondary">
                            <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Demo video placeholder */}
                    <div className="flex-1 w-full">
                      <div className="glass-strong rounded-xl overflow-hidden">
                        <div className="aspect-video flex flex-col items-center justify-center gap-3 p-6">
                          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                            <svg className="w-5 h-5 text-theme-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                          </div>
                          <p className="text-xs text-theme-muted">Demo coming soon</p>
                          <code className="text-[10px] glass rounded px-2 py-1 text-theme-muted font-mono">
                            /public/demos/{feature.id}.mp4
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <section className="px-6 pb-16">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-medium shadow-sm shadow-indigo-200/40 hover:shadow-md hover:shadow-indigo-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Try Speakify
            </Link>
            <Link
              href="/docs"
              className="px-6 py-2.5 rounded-xl glass text-theme-secondary text-sm font-medium hover:shadow-sm transition-all"
            >
              Read Docs
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

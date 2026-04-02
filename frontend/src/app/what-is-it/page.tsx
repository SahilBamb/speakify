import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "What Is Speakify? — Feature Demos",
  description: "See Speakify in action. Watch demos of PDF listening, AI book generation, real-time highlighting, and more.",
};

const FEATURES = [
  {
    id: "pdf-upload",
    badge: "Core Feature",
    title: "PDF Upload & Listen",
    subtitle: "Drop any PDF. Start listening instantly.",
    description:
      "Speakify extracts text from your PDF with precise page-level parsing using PyMuPDF, segments it into natural sentences, and generates high-quality audio for each one. The entire pipeline runs automatically — just upload and press play.",
    details: [
      "Drag-and-drop or click to upload any PDF",
      "Automatic text extraction preserving reading order",
      "Smart sentence segmentation across paragraphs",
      "Background audio generation while you read",
      "Support for multi-page documents of any length",
    ],
    color: "indigo",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    ),
  },
  {
    id: "ai-books",
    badge: "AI-Powered",
    title: "Generate Any Book with AI",
    subtitle: "Type a topic. Get a full book.",
    description:
      "Powered by OpenAI GPT-4o-mini, Speakify generates complete book outlines from any topic — fiction, non-fiction, textbooks, you name it. Chapters are created on-demand as you read, so you never wait for content you haven't reached yet.",
    details: [
      "Enter any topic, title, or subject area",
      "AI generates a structured multi-chapter outline",
      "Chapters written on-demand as you progress",
      "Full TTS audio generated for each chapter",
      "Supports fiction, non-fiction, educational content, and more",
    ],
    color: "purple",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    ),
  },
  {
    id: "highlighting",
    badge: "Reading Experience",
    title: "Real-Time Sentence Highlighting",
    subtitle: "Every word lights up as it's spoken.",
    description:
      "As audio plays, the current sentence is highlighted in real time with smooth transitions. For PDFs, bounding boxes overlay the exact sentence on the rendered page. For books, the text scrolls and highlights automatically. Click any sentence to jump directly to it.",
    details: [
      "Sentence-level highlighting synced to audio playback",
      "Precise bounding box overlays on PDF pages",
      "Auto-scrolling to keep the active sentence in view",
      "Click-to-jump to any sentence in the document",
      "Smooth transitions between sentences",
    ],
    color: "pink",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
    ),
  },
  {
    id: "playback",
    badge: "Audio Controls",
    title: "Full Playback Controls",
    subtitle: "Play, pause, skip, and adjust speed.",
    description:
      "The playback bar gives you full control over your listening experience. Play, pause, skip forward/backward by sentence, adjust playback speed from 0.5x to 3x, and see a progress timeline for the current sentence. Audio is preloaded ahead for seamless transitions.",
    details: [
      "Play / pause / stop with one click",
      "Skip forward and backward by sentence",
      "Adjustable speed: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x, 3x",
      "Progress bar showing position within current sentence",
      "Preloaded next-sentence audio for gapless playback",
    ],
    color: "emerald",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    ),
  },
  {
    id: "reading-prefs",
    badge: "Customization",
    title: "Reading Preferences & Themes",
    subtitle: "Make it yours. Light, dark, or custom.",
    description:
      "Switch between light and dark themes with the frosted glass UI adapting beautifully. Customize your reading font, text size, and line spacing. All preferences persist across sessions via local storage.",
    details: [
      "Light and dark mode with system auto-detection",
      "Frosted glass design that adapts to both themes",
      "Customizable font family (Inter, Georgia, system fonts)",
      "Adjustable font size (14px to 24px)",
      "Configurable line height (1.4 to 2.2)",
    ],
    color: "slate",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    ),
  },
  {
    id: "navigation",
    badge: "Navigation",
    title: "Table of Contents & Keyboard Shortcuts",
    subtitle: "Navigate with precision.",
    description:
      "A collapsible sidebar shows your full table of contents — page numbers for PDFs, chapter list for books. Jump anywhere instantly. Power users can control everything with keyboard shortcuts: Space to play/pause, arrows to skip, N/P for chapters, and ? for help.",
    details: [
      "Collapsible table of contents sidebar",
      "Page-level navigation for PDFs",
      "Chapter-level navigation for generated books",
      "Full keyboard shortcut support",
      "PDF zoom controls with page jump input",
    ],
    color: "amber",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
    ),
  },
];

const COLOR_MAP: Record<string, { bg: string; icon: string; badge: string; ring: string }> = {
  indigo: { bg: "bg-indigo-50", icon: "text-indigo-500", badge: "text-indigo-600 bg-indigo-50", ring: "ring-indigo-200" },
  purple: { bg: "bg-purple-50", icon: "text-purple-500", badge: "text-purple-600 bg-purple-50", ring: "ring-purple-200" },
  pink: { bg: "bg-pink-50", icon: "text-pink-500", badge: "text-pink-600 bg-pink-50", ring: "ring-pink-200" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-500", badge: "text-emerald-600 bg-emerald-50", ring: "ring-emerald-200" },
  slate: { bg: "bg-slate-100", icon: "text-slate-500", badge: "text-slate-600 bg-slate-100", ring: "ring-slate-200" },
  amber: { bg: "bg-amber-50", icon: "text-amber-500", badge: "text-amber-600 bg-amber-50", ring: "ring-amber-200" },
};

export default function WhatIsItPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      {/* Hero */}
      <section className="text-center px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight leading-[1.1]">
            What Is{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Speakify
            </span>
            ?
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            A full-stack AI text-to-speech reader. Here&apos;s every feature,
            explained with demos you can watch.
          </p>
        </div>
      </section>

      {/* Quick jump */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-4 flex flex-wrap justify-center gap-2">
            {FEATURES.map((f) => {
              const c = COLOR_MAP[f.color];
              return (
                <a
                  key={f.id}
                  href={`#${f.id}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${c.badge} hover:ring-2 ${c.ring} transition-all`}
                >
                  {f.title}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature sections */}
      <div className="flex-1">
        {FEATURES.map((feature, i) => {
          const c = COLOR_MAP[feature.color];
          const reversed = i % 2 !== 0;
          return (
            <section
              key={feature.id}
              id={feature.id}
              className="px-6 py-16 sm:py-24 scroll-mt-24"
            >
              <div className="max-w-5xl mx-auto">
                <div className={`flex flex-col ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-10 lg:gap-16 items-center`}>
                  {/* Info */}
                  <div className="flex-1 space-y-5">
                    <div className="space-y-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${c.badge}`}>
                        {feature.badge}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                        {feature.title}
                      </h2>
                      <p className="text-lg text-slate-500 leading-relaxed">
                        {feature.subtitle}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.details.map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-sm text-slate-600">
                          <svg className={`w-4 h-4 mt-0.5 shrink-0 ${c.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Demo video placeholder */}
                  <div className="flex-1 w-full">
                    <div className="glass-strong rounded-2xl shadow-lg shadow-indigo-100/20 overflow-hidden">
                      <div className="aspect-video flex flex-col items-center justify-center gap-4 p-8">
                        <div className={`w-16 h-16 rounded-2xl ${c.bg} flex items-center justify-center`}>
                          <svg className={`w-8 h-8 ${c.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            {feature.icon}
                          </svg>
                        </div>
                        <div className="text-center space-y-1.5">
                          <p className="text-sm font-medium text-slate-400">Demo Video</p>
                          <p className="text-xs text-slate-300">
                            Record and place your video at
                          </p>
                          <code className="text-[10px] glass rounded px-2 py-1 text-slate-400 font-mono block">
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
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-strong rounded-3xl p-10 sm:p-14 shadow-xl shadow-indigo-100/20 space-y-6">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              Try it yourself
            </h2>
            <p className="text-slate-500">
              No sign-up. No credit card. Just upload and listen.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-medium shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Launch Speakify
              </Link>
              <Link
                href="/docs"
                className="px-8 py-3.5 rounded-2xl glass text-slate-600 font-medium hover:shadow-md transition-all"
              >
                Read the Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 sm:py-32">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-indigo-600 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI-Powered Text-to-Speech
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 tracking-tight leading-[1.1]">
              Turn anything into
              <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                audio you can feel
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed">
              Upload PDFs, generate entire books with AI, and listen
              with real-time sentence highlighting. Your personal narrator,
              always ready.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-medium shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all text-base"
            >
              Get Started — It&apos;s Free
            </Link>
            <Link
              href="/what-is-it"
              className="px-8 py-3.5 rounded-2xl glass text-slate-600 font-medium hover:shadow-md transition-all text-base"
            >
              See How It Works
            </Link>
          </div>

          {/* Decorative floating card preview */}
          <div className="pt-8 sm:pt-16">
            <div className="glass-strong rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-100/30 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-300/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-300/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-300/80" />
                </div>
                <div className="flex-1 h-6 rounded-lg bg-slate-100/80 flex items-center px-3">
                  <span className="text-[10px] text-slate-400 font-mono">speakify</span>
                </div>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="h-3 rounded bg-slate-200/80 w-3/4 mb-2" />
                    <div className="h-2 rounded bg-slate-100 w-1/2" />
                  </div>
                  <span className="text-[10px] font-medium text-emerald-500 bg-emerald-50/80 px-2 py-0.5 rounded-full self-center">Ready</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="h-3 rounded bg-slate-200/80 w-2/3 mb-2" />
                    <div className="h-2 rounded bg-slate-100 w-2/5" />
                  </div>
                  <span className="text-[10px] font-medium text-emerald-500 bg-emerald-50/80 px-2 py-0.5 rounded-full self-center">Ready</span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100/80" />
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-200/50">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.14v14l11-7-11-7z" />
                  </svg>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100/80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
              Everything you need to listen smarter
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Powerful features designed to make reading effortless and accessible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />}
              title="PDF Upload & Listen"
              description="Drop any PDF and instantly start listening. Text is extracted, sentences are segmented, and audio is generated automatically."
              color="indigo"
            />
            <FeatureCard
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />}
              title="AI Book Generation"
              description="Type any topic and get a full book generated with AI. Chapters are created on-demand as you read through them."
              color="purple"
            />
            <FeatureCard
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />}
              title="Real-Time Highlighting"
              description="Follow along as each sentence lights up in sync with the audio. Click any sentence to jump right to it."
              color="pink"
            />
            <FeatureCard
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />}
              title="Natural Voice (Piper TTS)"
              description="High-quality offline text-to-speech powered by Piper. No API costs, no internet required for audio generation."
              color="emerald"
            />
            <FeatureCard
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />}
              title="Dark Mode"
              description="Beautiful frosted glass design in both light and dark themes. Automatically follows your system preference or set it manually."
              color="slate"
            />
            <FeatureCard
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />}
              title="Reading Preferences"
              description="Customize your experience with font choices, sizes, and line spacing. Plus keyboard shortcuts for power users."
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
              Three steps. That&apos;s it.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            <StepCard number="01" title="Upload or Generate" description="Drop a PDF or type a topic to generate a book with AI." />
            <StepCard number="02" title="Press Play" description="Hit play and listen. Every sentence highlights as it's spoken." />
            <StepCard number="03" title="Read Anywhere" description="Your progress is saved. Pick up exactly where you left off." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 sm:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-strong rounded-3xl p-10 sm:p-14 shadow-xl shadow-indigo-100/20 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
              Ready to start listening?
            </h2>
            <p className="text-slate-500">
              No sign-up required. Upload a PDF or generate a book in seconds.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-10 py-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-medium text-lg shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Launch Speakify
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  const bgMap: Record<string, string> = { indigo: "bg-indigo-50", purple: "bg-purple-50", pink: "bg-pink-50", emerald: "bg-emerald-50", slate: "bg-slate-100", amber: "bg-amber-50" };
  const iconMap: Record<string, string> = { indigo: "text-indigo-400", purple: "text-purple-400", pink: "text-pink-400", emerald: "text-emerald-400", slate: "text-slate-400", amber: "text-amber-400" };
  return (
    <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md hover:shadow-indigo-100/30 hover:scale-[1.01] transition-all duration-300">
      <div className={`w-11 h-11 rounded-xl ${bgMap[color]} flex items-center justify-center mb-4`}>
        <svg className={`w-5 h-5 ${iconMap[color]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{icon}</svg>
      </div>
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center space-y-3">
      <div className="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center mx-auto shadow-sm">
        <span className="text-lg font-bold bg-gradient-to-br from-indigo-500 to-purple-500 bg-clip-text text-transparent">{number}</span>
      </div>
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

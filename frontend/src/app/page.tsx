import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 sm:py-28">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-theme-primary tracking-tight leading-[1.15]">
            Turn anything into
            <br />
            <span className="text-zinc-900">
              audio you can feel
            </span>
          </h1>
          <p className="text-sm sm:text-base text-theme-muted max-w-md mx-auto leading-relaxed">
            Upload PDFs or generate books with AI. Listen with
            real-time sentence highlighting.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium shadow-sm shadow-zinc-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Get Started
            </Link>
            <Link
              href="/what-is-it"
              className="px-6 py-2.5 rounded-xl glass text-theme-secondary text-sm font-medium hover:shadow-sm transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20 sm:pb-28">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-theme-primary tracking-tight">
              Everything you need
            </h2>
            <p className="text-sm text-theme-muted">
              Simple tools for turning text into audio.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <FeatureCard
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />}
              title="PDF Upload"
              description="Drop a PDF and listen with sentence-level highlighting."
            />
            <FeatureCard
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />}
              title="AI Books"
              description="Generate full books on any topic, chapter by chapter."
            />
            <FeatureCard
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />}
              title="Live Highlighting"
              description="Sentences light up as they're spoken. Click to jump."
            />
            <FeatureCard
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />}
              title="Offline TTS"
              description="Piper TTS runs locally. No API costs, no internet needed."
            />
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 pb-20 sm:pb-28">
        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-2xl p-8 sm:p-10">
            <div className="grid sm:grid-cols-3 gap-8">
              <StepCard number="1" title="Upload or Generate" description="Drop a PDF or type a topic." />
              <StepCard number="2" title="Press Play" description="Audio plays with live highlighting." />
              <StepCard number="3" title="Pick Up Anytime" description="Progress saves automatically." />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-md mx-auto text-center space-y-4">
          <p className="text-sm text-theme-muted">
            No sign-up required.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium shadow-sm shadow-zinc-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Launch Speakify
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass rounded-xl p-5 hover:shadow-sm transition-all duration-200">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-lg glass-strong flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-theme-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{icon}</svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-theme-primary mb-1">{title}</h3>
          <p className="text-xs text-theme-muted leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center space-y-2">
      <div className="w-8 h-8 rounded-lg glass-strong flex items-center justify-center mx-auto">
        <span className="text-xs font-bold text-zinc-900">{number}</span>
      </div>
      <h3 className="text-sm font-semibold text-theme-primary">{title}</h3>
      <p className="text-xs text-theme-muted leading-relaxed">{description}</p>
    </div>
  );
}

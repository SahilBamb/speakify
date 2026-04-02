import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="px-6 py-8 border-t border-slate-200/40">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-600">Speakify</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/what-is-it" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            What Is It?
          </Link>
          <Link href="/docs" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Docs
          </Link>
          <Link href="/dashboard" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Dashboard
          </Link>
        </div>
        <p className="text-xs text-slate-400">
          Built with Next.js, FastAPI, Piper TTS &amp; OpenAI
        </p>
      </div>
    </footer>
  );
}

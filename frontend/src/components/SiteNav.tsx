"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/what-is-it", label: "What Is It?" },
  { href: "/docs", label: "Docs" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="glass-strong sticky top-0 z-50 shadow-sm shadow-black/[0.03]">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm shadow-indigo-200/50">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-theme-primary tracking-tight">Speakify</span>
          </Link>

          <div className="hidden sm:flex items-center">
            <div className="glass rounded-lg p-0.5 inline-flex gap-0.5">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      active
                        ? "glass-strong shadow-sm text-theme-primary"
                        : "text-theme-muted hover:text-theme-secondary"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="sm:hidden flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? "glass-strong text-theme-primary shadow-sm"
                      : "text-theme-muted hover:text-theme-secondary"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-medium shadow-sm shadow-indigo-200/40 hover:shadow-md hover:shadow-indigo-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Open App
          </Link>
        </div>
      </div>
    </nav>
  );
}

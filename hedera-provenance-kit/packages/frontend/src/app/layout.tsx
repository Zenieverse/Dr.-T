import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { ShieldCheck, Compass, FileCheck2, BookOpen, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hedera Provenance Kit | Scaffold-HBAR Template',
  description: 'Production-ready cryptographic provenance, RFC 8785 canonicalization, HCS anchoring, and Mirror Node verification.'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Hedera Provenance Kit
                </span>
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Scaffold-HBAR
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-1 sm:gap-4">
              <Link 
                href="/" 
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                Register
              </Link>
              <Link 
                href="/verify" 
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-1.5"
              >
                <FileCheck2 className="w-4 h-4 text-blue-400" />
                Verify
              </Link>
              <Link 
                href="/docs" 
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-purple-400" />
                Docs
              </Link>
              <a
                href="https://github.com/Zenieverse/hedera-provenance-kit"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              >
                GitHub
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-900/50 py-6 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>Hedera Provenance Kit • Community Scaffold-HBAR Template • MIT License</p>
            <p className="text-slate-400">Strict Zero-PHI Architecture: Cryptographic digests on HCS, confidential records remain off-chain.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

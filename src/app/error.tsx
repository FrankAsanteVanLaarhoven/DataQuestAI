'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected runtime error to telemetry
    try {
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'runtime_exception',
          message: error.message,
          digest: error.digest,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {}
  }, [error]);

  return (
    <div className="min-h-screen bg-[#08090e] text-zinc-100 flex items-center justify-center p-6 selection:bg-violet-500 selection:text-white">
      <div className="max-w-lg w-full bg-[#0f111a] border border-red-500/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-medium mb-6">
            <span>RUNTIME_ERROR</span>
            {error.digest && <span>• {error.digest}</span>}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            An Unexpected Exception Occurred
          </h2>

          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            The database engine encountered an unexpected state while executing the current operation. Your local schema state is preserved.
          </p>

          <div className="bg-[#090a0f] border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 mb-6 overflow-x-auto">
            <p className="text-red-400 font-semibold mb-1">Diagnostic Log:</p>
            <p className="text-zinc-400 break-words">{error.message || 'Unknown runtime error'}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => reset()}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-violet-600/20 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <span>Retry Operation</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 font-medium text-sm border border-zinc-700/60 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400"
            >
              Return to Canvas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#08090e] text-zinc-100 flex items-center justify-center p-6 selection:bg-violet-500 selection:text-white">
      <div className="max-w-xl w-full bg-[#0f111a] border border-zinc-800/80 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono font-medium mb-6">
            <span>SQLSTATE 42P01</span>
            <span>•</span>
            <span>HTTP 404</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Route or Schema Not Found
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
            The database route, architecture view, or canvas model you requested does not exist or has been relocated.
          </p>

          <div className="bg-[#090a0f] border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 mb-8 space-y-1">
            <p className="text-violet-400">EXPLAIN QUERY PLAN</p>
            <p className="text-zinc-500">-- SCAN REQUESTED_ROUTE (Result: 0 rows found)</p>
            <p className="text-emerald-400">-- STATUS: Recovery route available via root canvas</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-violet-600/20 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#08090e]"
            >
              <span>Return to Architecture Canvas</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/#catalog"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 font-medium text-sm border border-zinc-700/60 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#08090e]"
            >
              Explore Schemas
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

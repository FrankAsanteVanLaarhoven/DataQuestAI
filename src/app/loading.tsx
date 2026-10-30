export default function Loading() {
  return (
    <div className="min-h-screen bg-[#08090e] text-zinc-100 flex flex-col p-6 animate-pulse">
      {/* Header bar skeleton */}
      <div className="h-16 w-full border-b border-zinc-800/80 flex items-center justify-between px-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800/80" />
          <div className="w-32 h-5 rounded bg-zinc-800/80" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-8 rounded-lg bg-zinc-800/60" />
          <div className="w-28 h-8 rounded-lg bg-violet-900/30" />
        </div>
      </div>

      {/* Main workspace skeleton */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        {/* Left canvas pane */}
        <div className="lg:col-span-8 bg-[#0f111a] border border-zinc-800/60 rounded-2xl p-6 flex flex-col space-y-4">
          <div className="w-48 h-6 rounded bg-zinc-800/80" />
          <div className="w-96 h-4 rounded bg-zinc-800/40" />
          <div className="flex-1 min-h-[360px] bg-[#090a0f] rounded-xl border border-zinc-900 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-violet-500/40 border-t-violet-400 animate-spin" />
              <span className="text-xs font-mono text-zinc-500">Initializing Relational Architecture Engine...</span>
            </div>
          </div>
        </div>

        {/* Right side inspect pane */}
        <div className="lg:col-span-4 bg-[#0f111a] border border-zinc-800/60 rounded-2xl p-6 flex flex-col space-y-4">
          <div className="w-36 h-5 rounded bg-zinc-800/80" />
          <div className="h-28 rounded-xl bg-zinc-800/30" />
          <div className="h-44 rounded-xl bg-zinc-800/30" />
        </div>
      </div>
    </div>
  );
}

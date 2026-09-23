'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  Compass,
  Trophy,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  ShoppingCart,
  Search,
  BarChart2,
  Sparkles,
  Zap,
  Building2,
  ShieldCheck,
} from 'lucide-react';

export const MissionsView: React.FC = () => {
  const { missions, selectMission, setActiveTab } = useAppStore();

  const handleLaunch = (missionId: string) => {
    selectMission(missionId);
    setActiveTab('capstone');
  };

  const getMissionIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingCart':
        return <ShoppingCart className="w-5 h-5 text-indigo-500" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-emerald-500" />;
      case 'Search':
        return <Search className="w-5 h-5 text-blue-500" />;
      case 'BarChart2':
        return <BarChart2 className="w-5 h-5 text-violet-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-violet-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2 sm:p-4">
      {/* Apple-styled Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-black/[0.06] dark:border-white/[0.08] bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-indigo-600/10 dark:from-violet-500/[0.08] dark:via-purple-500/[0.06] dark:to-indigo-500/[0.08] backdrop-blur-2xl shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-2.5">
          <Compass className="w-3.5 h-3.5" /> Hands-On Industry Capstone Track
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Real-World Data Architecture Capstones
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
          Step into the role of Lead Data Architect across 4 real-world enterprise deployments. Solve hands-on transactional, clinical, streaming, and data warehouse challenges with simplified, intuitive visual guidance.
        </p>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((m) => (
          <div
            key={m.id}
            className="bg-white/80 dark:bg-[#111420]/80 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-violet-500/30 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 dark:bg-violet-400/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    {getMissionIcon(m.iconName)}
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20">
                      Mission {m.number} • {m.level}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  <Zap className="w-3.5 h-3.5 fill-amber-500/20" />
                  +{m.xpReward} XP
                </span>
              </div>

              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1.5 tracking-tight">
                {m.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
                {m.description}
              </p>

              <div className="space-y-2 mb-4 bg-zinc-50 dark:bg-white/[0.02] p-3 rounded-2xl border border-black/[0.04] dark:border-white/[0.05]">
                <h4 className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-500" />
                  Key Architecture Directives:
                </h4>
                <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5">
                  {m.instructions.map((inst, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0 mt-1.5" />
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress */}
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                <span>Verification Progress</span>
                <span className={m.progress === 100 ? 'text-emerald-500' : 'text-violet-600 dark:text-violet-400'}>
                  {m.progress}%
                </span>
              </div>
              <div className="w-full bg-black/[0.04] dark:bg-white/[0.06] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    m.progress === 100
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500'
                  }`}
                  style={{ width: `${m.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                {m.initialNodes.length} Canvas Primitives
              </span>

              {m.unlocked ? (
                <button
                  onClick={() => handleLaunch(m.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-95"
                >
                  Enter Workspace Canvas
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-white/[0.04] text-zinc-400 dark:text-zinc-600 font-semibold text-xs rounded-xl cursor-not-allowed border border-black/[0.04] dark:border-white/[0.04]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Locked (Complete Prior Missions)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

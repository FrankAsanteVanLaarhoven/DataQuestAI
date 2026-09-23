'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  BookOpen,
  ShoppingCart,
  Search,
  BarChart2,
  Lock,
  Trophy,
  CheckCircle2,
  Zap,
  Star,
  ShieldCheck,
  TrendingUp,
  Building2,
  Sparkles,
} from 'lucide-react';

export const MissionsSidebar: React.FC = () => {
  const { missions, activeMissionId, selectMission, badges } = useAppStore();

  const getMissionIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case 'ShoppingCart':
        return <ShoppingCart className="w-4 h-4 text-indigo-500" />;
      case 'Search':
        return <Search className="w-4 h-4 text-blue-500" />;
      case 'BarChart2':
        return <BarChart2 className="w-4 h-4 text-violet-500" />;
      default:
        return <BookOpen className="w-4 h-4 text-violet-500" />;
    }
  };

  const completedCount = missions.filter((m) => m.completed || m.progress === 100).length;
  const overallProgress = Math.round(
    missions.reduce((acc, m) => acc + m.progress, 0) / missions.length
  );

  const getBadgeIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Star className="w-3.5 h-3.5" />;
      case 1:
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 2:
        return <Zap className="w-3.5 h-3.5" />;
      case 3:
        return <TrendingUp className="w-3.5 h-3.5" />;
      case 4:
        return <Building2 className="w-3.5 h-3.5" />;
      default:
        return <Trophy className="w-3.5 h-3.5" />;
    }
  };

  return (
    <aside className="w-full lg:w-[280px] xl:w-[310px] shrink-0 flex flex-col gap-3">
      {/* Title */}
      <div className="flex items-center gap-2.5 px-1">
        <div className="w-6 h-6 rounded-lg bg-violet-500/10 dark:bg-violet-400/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center">
          <BookOpen className="w-3.5 h-3.5" />
        </div>
        <div>
          <h2 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Capstone Curriculum
          </h2>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
            Interactive mission track & challenge verifiers
          </p>
        </div>
      </div>

      {/* Mission Cards List */}
      <div className="space-y-2">
        {missions.map((mission) => {
          const isActive = mission.id === activeMissionId;
          return (
            <div
              key={mission.id}
              onClick={() => mission.unlocked && selectMission(mission.id)}
              className={`relative rounded-2xl p-3.5 transition-all duration-150 cursor-pointer border ${
                isActive
                  ? 'bg-white/90 dark:bg-[#141724]/90 border-violet-500/50 shadow-md shadow-violet-500/10 ring-1 ring-violet-500/40'
                  : mission.unlocked
                  ? 'bg-white/60 dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.06] hover:border-violet-500/30 hover:bg-white dark:hover:bg-white/[0.05]'
                  : 'bg-black/[0.02] dark:bg-white/[0.01] border-black/[0.04] dark:border-white/[0.04] opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isActive
                      ? 'bg-violet-500/10 dark:bg-violet-400/10 border-violet-500/20'
                      : 'bg-zinc-100/80 dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.06]'
                  }`}
                >
                  {getMissionIcon(mission.iconName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate tracking-tight">
                      {mission.number}. {mission.title}
                    </h3>
                    {mission.unlocked ? (
                      mission.progress === 100 ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <Trophy className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
                      )
                    ) : (
                      <Lock className="w-3 h-3 text-zinc-400 dark:text-zinc-600 shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5 leading-snug">
                    {mission.description}
                  </p>

                  {/* Level & XP Badge */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span
                      className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${
                        mission.level === 'Beginner'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : mission.level === 'Intermediate'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                      }`}
                    >
                      {mission.level}
                    </span>
                    <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 fill-amber-500/20" />
                      +{mission.xpReward} XP
                    </span>
                    <span className="ml-auto text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
                      {mission.progress}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-black/[0.04] dark:bg-white/[0.06] h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        mission.progress === 100
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                      }`}
                      style={{ width: `${mission.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Capstone Champion Card */}
      <div className="bg-white/80 dark:bg-[#111420]/80 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 dark:bg-violet-400/10 border border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Enterprise Certification
            </h4>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Complete curriculum to earn 3NF architect credential
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="flex items-center justify-between text-[11px] font-medium mt-3 text-zinc-700 dark:text-zinc-300">
          <span>Overall Completion</span>
          <span className="text-violet-600 dark:text-violet-400 font-semibold">{overallProgress}%</span>
        </div>
        <div className="w-full bg-black/[0.04] dark:bg-white/[0.06] h-1.5 rounded-full mt-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Badges preview row */}
        <div className="flex items-center justify-between gap-1.5 mt-3 pt-3 border-t border-black/[0.05] dark:border-white/[0.06]">
          {badges.map((b, idx) => (
            <div
              key={b.id}
              title={`${b.name}: ${b.description}`}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                b.unlocked
                  ? 'bg-violet-500/10 dark:bg-violet-400/10 text-violet-600 dark:text-violet-400 border border-violet-500/30 shadow-2xs'
                  : 'bg-black/[0.03] dark:bg-white/[0.03] text-zinc-400 dark:text-zinc-600 border border-black/[0.04] dark:border-white/[0.04]'
              }`}
            >
              {getBadgeIcon(idx)}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  BookOpen,
  ShoppingCart,
  Search,
  BarChart2,
  Lock,
  Unlock,
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  PlusCircle,
} from 'lucide-react';

export const MissionsSidebar: React.FC = () => {
  const { missions, activeMissionId, selectMission, badges } = useAppStore();

  const getMissionIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-emerald-600" />;
      case 'ShoppingCart':
        return <ShoppingCart className="w-5 h-5 text-indigo-600" />;
      case 'Search':
        return <Search className="w-5 h-5 text-blue-600" />;
      case 'BarChart2':
        return <BarChart2 className="w-5 h-5 text-purple-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-pink-600" />;
    }
  };

  const completedCount = missions.filter((m) => m.completed || m.progress === 100).length;
  const overallProgress = Math.round(
    missions.reduce((acc, m) => acc + m.progress, 0) / missions.length
  );

  return (
    <aside className="w-full lg:w-[280px] xl:w-[310px] shrink-0 flex flex-col gap-3">
      {/* Title */}
      <div className="flex items-center gap-2 px-1">
        <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            Capstone Missions
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Choose a mission, complete challenges, and build your mini data enterprise!
          </p>
        </div>
      </div>

      {/* Mission Cards List */}
      <div className="space-y-2.5">
        {missions.map((mission) => {
          const isActive = mission.id === activeMissionId;
          return (
            <div
              key={mission.id}
              onClick={() => mission.unlocked && selectMission(mission.id)}
              className={`relative rounded-2xl p-3.5 transition-all cursor-pointer border ${
                isActive
                  ? 'bg-white dark:bg-slate-900 border-pink-400 shadow-md shadow-pink-500/10 ring-2 ring-pink-400/30'
                  : mission.unlocked
                  ? 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-pink-200 hover:bg-white'
                  : 'bg-slate-100/60 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/60 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isActive
                      ? 'bg-pink-50 dark:bg-pink-950/60 border-pink-200 dark:border-pink-800'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {getMissionIcon(mission.iconName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {mission.number}. {mission.title}
                    </h3>
                    {mission.unlocked ? (
                      mission.progress === 100 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {mission.description}
                  </p>

                  {/* Level & XP Badge */}
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        mission.level === 'Beginner'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : mission.level === 'Intermediate'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      }`}
                    >
                      {mission.level}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                      ⭐ +{mission.xpReward} XP
                    </span>
                    <span className="ml-auto text-[10px] font-black text-slate-600 dark:text-slate-300">
                      {mission.progress}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        mission.progress === 100
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-pink-500 to-rose-500'
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
      <div className="mt-1 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-pink-950/20 dark:to-purple-950/20 border border-pink-200/80 dark:border-pink-900/50 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Capstone Champion</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Complete all missions to build your Mini Data Enterprise!
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="flex items-center justify-between text-[11px] font-bold mt-3 text-slate-700 dark:text-slate-300">
          <span>Enterprise Mastery</span>
          <span className="text-pink-600 font-extrabold">{overallProgress}%</span>
        </div>
        <div className="w-full bg-pink-200/60 dark:bg-pink-950 h-2 rounded-full mt-1 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 rounded-full transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Badges preview row */}
        <div className="flex items-center justify-between gap-1 mt-3.5 pt-3 border-t border-pink-200/60 dark:border-pink-900/40">
          {badges.map((b, idx) => (
            <div
              key={b.id}
              title={`${b.name}: ${b.description}`}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${
                b.unlocked
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 ring-1 ring-amber-300 dark:ring-amber-700 shadow-xs'
                  : 'bg-slate-200/70 dark:bg-slate-800 text-slate-400 opacity-50'
              }`}
            >
              {idx === 0 ? '⭐' : idx === 1 ? '🛡️' : idx === 2 ? '⚡' : idx === 3 ? '📈' : idx === 4 ? '🏛️' : '🏆'}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

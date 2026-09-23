'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  Compass,
  Trophy,
  CheckCircle,
  Lock,
  ArrowRight,
  BookOpen,
  ShoppingCart,
  Search,
  BarChart2,
  Sparkles,
} from 'lucide-react';

export const MissionsView: React.FC = () => {
  const { missions, selectMission, setActiveTab } = useAppStore();

  const handleLaunch = (missionId: string) => {
    selectMission(missionId);
    setActiveTab('capstone');
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2 sm:p-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2">
          <Compass className="w-3.5 h-3.5" /> Interactive Capstone Curriculum
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Enterprise Capstone Challenges
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-pink-100 max-w-xl">
          Solve real-world challenges step-by-step. Drag cards, connect relationships, write CRUD queries, and earn badges to become a Capstone Champion!
        </p>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((m) => (
          <div
            key={m.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                  Mission {m.number} • {m.level}
                </span>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  ⭐ +{m.xpReward} XP
                </span>
              </div>

              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mb-1">
                {m.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                {m.description}
              </p>

              <div className="space-y-2 mb-4">
                <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Key Directives:
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  {m.instructions.map((inst, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                      {inst}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                <span>Progress</span>
                <span className="text-pink-600">{m.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${m.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              {m.unlocked ? (
                <button
                  onClick={() => handleLaunch(m.id)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs rounded-xl shadow-xs hover:opacity-95 transition-all"
                >
                  Enter Workspace Canvas
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
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

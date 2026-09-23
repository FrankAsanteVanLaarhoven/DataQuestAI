'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { MissionsSidebar } from '@/components/MissionsSidebar';
import { ConceptToolbox } from '@/components/ConceptToolbox';
import { SystemCanvas } from '@/components/SystemCanvas';
import { CrudBuilder } from '@/components/CrudBuilder';
import { AnalyticsPreview } from '@/components/AnalyticsPreview';
import { LiveFeedSidebar } from '@/components/LiveFeedSidebar';
import { LearnRoadmap } from '@/components/LearnRoadmap';
import { CommunityGallery } from '@/components/CommunityGallery';
import { LeaderboardView } from '@/components/LeaderboardView';
import { MissionsView } from '@/components/MissionsView';
import { AnalyticsView } from '@/components/AnalyticsView';
import { translations, languages } from '@/lib/i18n';
import {
  MousePointer,
  Gamepad2,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  Database,
} from 'lucide-react';

export default function HomePage() {
  const { activeTab, theme, setTheme, language } = useAppStore();
  const t = translations[language] || translations.en;
  const currentLangMeta = languages.find((l) => l.code === language);
  const dir = currentLangMeta?.dir || 'ltr';

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('dataquest_theme');
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'vibrant' || savedTheme === 'blueprint')) {
        setTheme(savedTheme as any);
      }
    } catch {}
  }, [setTheme]);

  useEffect(() => {
    const isDark = theme === 'dark' || theme === 'blueprint';
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    document.body.className = `theme-${theme} ${isDark ? 'dark bg-[#070a13] text-slate-100' : 'bg-[#fbf8f5] text-slate-800'}`;
  }, [theme]);

  const isDarkTheme = theme === 'dark' || theme === 'blueprint';

  return (
    <div
      dir={dir}
      className={`min-h-screen flex flex-col transition-colors ${
        isDarkTheme ? 'dark bg-[#070a13] text-slate-100' : 'bg-[#fbf8f5] text-slate-800'
      }`}
    >
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1900px] mx-auto p-2 sm:p-4">
        {activeTab === 'capstone' && (
          <div className="space-y-3">
            {/* Apple Pro Enterprise Banner */}
            <div className="relative rounded-3xl apple-glass p-6 sm:p-7 shadow-xs overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {t.capstoneTitle}
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed">
                    {t.courseTagline || 'A database course end to end with illustrations, and gamification'}
                  </p>

                  {/* Refined Apple Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 font-medium shadow-2xs">
                      <MousePointer className="w-3 h-3 text-purple-500 opacity-80" />
                      {t.tagDrag}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 font-medium shadow-2xs">
                      <Gamepad2 className="w-3 h-3 text-indigo-500 opacity-80" />
                      {t.tagFeedback}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 font-medium shadow-2xs">
                      <TrendingUp className="w-3 h-3 text-blue-500 opacity-80" />
                      {t.tagResults}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 font-medium shadow-2xs">
                      <Award className="w-3 h-3 text-amber-500 opacity-80" />
                      {t.tagBadges}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200/80 dark:border-white/[0.08] text-zinc-700 dark:text-zinc-300 font-medium shadow-2xs">
                      <Users className="w-3 h-3 text-emerald-500 opacity-80" />
                      {t.tagImpact}
                    </span>
                  </div>
                </div>

                {/* Apple-style Architecture Telemetry Card (Replacing polygon mountain) */}
                <div className="hidden lg:flex items-center gap-4 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-zinc-200/80 dark:border-white/[0.08] p-3.5 rounded-2xl shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Engine Active
                    </div>
                    <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">SQLite 3.45 • WASM</p>
                    <span className="text-[10px] text-zinc-400 font-mono">3NF Verified • ACID On</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Column Layout matching Image 1 */}
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Left Column: Capstone Missions & Champion Card */}
              <MissionsSidebar />

              {/* Center Column: Toolbox, Canvas, CRUD Builder & Analytics */}
              <div className="flex-1 flex flex-col gap-3 min-w-0">
                <ConceptToolbox />
                <SystemCanvas />
                <CrudBuilder />
                <AnalyticsPreview />
              </div>

              {/* Right Column: Live Data Feed, Activity Timeline & AI Coach */}
              <LiveFeedSidebar />
            </div>
          </div>
        )}

        {activeTab === 'missions' && <MissionsView />}
        {activeTab === 'learn' && <LearnRoadmap />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'community' && <CommunityGallery />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
      </main>
    </div>
  );
}

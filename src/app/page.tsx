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
import { TeacherStudio } from '@/components/TeacherStudio';
import { SuperAdminConsole } from '@/components/SuperAdminConsole';
import { DigitalUniversitySimulation } from '@/components/DigitalUniversitySimulation';
import { ERDStudio } from '@/components/ERDStudio';
import { EnterpriseSplashScreen } from '@/components/EnterpriseSplashScreen';
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
  const { activeTab, theme, setTheme, language, hasEnteredConsole } = useAppStore();
  const t = translations[language] || translations.en;
  const currentLangMeta = languages.find((l) => l.code === language);
  const dir = currentLangMeta?.dir || 'ltr';

  const [systemIsDark, setSystemIsDark] = React.useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('dataquest_theme');
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'vibrant' || savedTheme === 'system')) {
        setTheme(savedTheme as any);
      }
    } catch {}
  }, [setTheme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isDarkTheme = theme === 'dark' || (theme === 'system' && systemIsDark);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkTheme) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#08090e';
      document.body.style.color = '#f8fafc';
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#fbf8f5';
      document.body.style.color = '#1e293b';
    }
  }, [isDarkTheme]);

  if (!hasEnteredConsole) {
    return (
      <div dir={dir} className="dark bg-[#05070e] text-slate-100 min-h-screen">
        <EnterpriseSplashScreen />
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className={`min-h-screen flex flex-col transition-colors ${
        isDarkTheme ? 'dark bg-[#08090e] text-zinc-100' : 'bg-[#fbf8f5] text-zinc-800'
      }`}
    >
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1900px] mx-auto p-2 sm:p-4">
        {activeTab === 'capstone' && (
          <div className="space-y-3">
            {/* Enterprise Header Banner */}
            <div className="relative rounded-3xl apple-glass p-6 sm:p-7 shadow-xs overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                      {t.capstoneTitle}
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-200 font-normal leading-relaxed">
                    {t.courseTagline || 'A database course end to end with illustrations, and gamification'}
                  </p>

                  {/* Core Platform Highlights */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.08] border border-zinc-200/80 dark:border-white/[0.12] text-zinc-700 dark:text-zinc-100 font-medium shadow-2xs">
                      <MousePointer className="w-3 h-3 text-purple-500 dark:text-purple-400 opacity-90" />
                      {t.tagDrag}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.08] border border-zinc-200/80 dark:border-white/[0.12] text-zinc-700 dark:text-zinc-100 font-medium shadow-2xs">
                      <Gamepad2 className="w-3 h-3 text-indigo-500 dark:text-indigo-400 opacity-90" />
                      {t.tagFeedback}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.08] border border-zinc-200/80 dark:border-white/[0.12] text-zinc-700 dark:text-zinc-100 font-medium shadow-2xs">
                      <TrendingUp className="w-3 h-3 text-blue-500 dark:text-blue-400 opacity-90" />
                      {t.tagResults}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.08] border border-zinc-200/80 dark:border-white/[0.12] text-zinc-700 dark:text-zinc-100 font-medium shadow-2xs">
                      <Award className="w-3 h-3 text-amber-500 dark:text-amber-400 opacity-90" />
                      {t.tagBadges}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.08] border border-zinc-200/80 dark:border-white/[0.12] text-zinc-700 dark:text-zinc-100 font-medium shadow-2xs">
                      <Users className="w-3 h-3 text-emerald-500 dark:text-emerald-400 opacity-90" />
                      {t.tagImpact}
                    </span>
                  </div>
                </div>

                {/* Real-time Architecture Telemetry Card */}
                <div className="hidden lg:flex items-center gap-4 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-zinc-200/80 dark:border-white/[0.08] p-3.5 rounded-2xl shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Engine Active
                    </div>
                    <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">DataQuest SQL • In-Memory AST</p>
                    <span className="text-[10px] text-zinc-400 font-mono">Relational Engine • 3NF &amp; PK Enforced</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Column Relational Studio Layout */}
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
        {activeTab === 'erd' && <ERDStudio />}
        {activeTab === 'learn' && <LearnRoadmap />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'community' && <CommunityGallery />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'teacher' && <TeacherStudio />}
        {activeTab === 'super_admin' && <SuperAdminConsole />}
        {activeTab === 'university' && <DigitalUniversitySimulation />}
      </main>
    </div>
  );
}

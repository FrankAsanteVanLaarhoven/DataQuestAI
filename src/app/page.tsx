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
} from 'lucide-react';

export default function HomePage() {
  const { activeTab, theme, language } = useAppStore();
  const t = translations[language] || translations.en;
  const currentLangMeta = languages.find((l) => l.code === language);
  const dir = currentLangMeta?.dir || 'ltr';

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-[#fbf8f5] dark:bg-[#090d16] text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1900px] mx-auto p-2 sm:p-4">
        {activeTab === 'capstone' && (
          <div className="space-y-3">
            {/* Capstone Game Banner matching Image 1 */}
            <div className="relative rounded-3xl bg-gradient-to-r from-pink-50 via-purple-50/70 to-indigo-50/60 dark:from-slate-900 dark:via-pink-950/20 dark:to-purple-950/20 border border-pink-200/80 dark:border-pink-900/60 px-6 py-4 shadow-xs overflow-hidden">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎉</span>
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                      {t.capstoneTitle}
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    {t.capstoneSubtitle}
                  </p>

                  {/* 5 Feature Badges matching Image 1 */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 shadow-2xs">
                      <MousePointer className="w-3.5 h-3.5 text-pink-600" />
                      {t.tagDrag}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 shadow-2xs">
                      <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />
                      {t.tagFeedback}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shadow-2xs">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      {t.tagResults}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 shadow-2xs">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      {t.tagBadges}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shadow-2xs">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      {t.tagImpact}
                    </span>
                  </div>
                </div>

                {/* Decorative Mountain Peaks with Flag matching Image 1 */}
                <div className="hidden lg:flex items-center justify-end pr-4">
                  <div className="relative w-48 h-20 flex items-end justify-center">
                    {/* Pink/Purple Mountain Vector Silhouette */}
                    <svg viewBox="0 0 160 80" className="w-full h-full drop-shadow-md">
                      <polygon points="10,80 45,25 75,80" fill="#a855f7" opacity="0.8" />
                      <polygon points="50,80 90,15 130,80" fill="#ec4899" opacity="0.9" />
                      <polygon points="105,80 135,30 160,80" fill="#6366f1" opacity="0.8" />
                      {/* Snowcaps */}
                      <polygon points="85,25 90,15 95,25 90,22" fill="#ffffff" />
                      {/* Flag on Peak */}
                      <line x1="90" y1="15" x2="90" y2="4" stroke="#e11d48" strokeWidth="1.5" />
                      <polygon points="90,4 98,7 90,10" fill="#e11d48" />
                    </svg>
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

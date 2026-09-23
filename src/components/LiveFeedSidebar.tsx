'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import {
  Radio,
  Play,
  Pause,
  Clock,
  Sparkles,
  Bot,
  Lightbulb,
  BookOpen,
  Code2,
  ArrowRight,
  Award,
  HelpCircle,
  CheckCircle2,
  X,
} from 'lucide-react';

export const LiveFeedSidebar: React.FC = () => {
  const {
    isLiveFeedRunning,
    toggleLiveFeed,
    dataFeedEvents,
    activityTimeline,
    aiCoachText,
    coachAction,
    language,
  } = useAppStore();

  const t = translations[language] || translations.en;

  const [inspectEvent, setInspectEvent] = useState<any | null>(null);

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'INSERT':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'SELECT':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'UPDATE':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'DELETE':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <aside className="w-full lg:w-[290px] xl:w-[320px] shrink-0 flex flex-col gap-3">
      {/* 1. Live Data Feed */}
      <div className="bg-white/80 dark:bg-[#111420]/80 backdrop-blur-2xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-3.5 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className={`w-3.5 h-3.5 ${isLiveFeedRunning ? 'text-emerald-500 animate-pulse' : 'text-zinc-400'}`} />
            <div>
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">{t.liveFeedTitle}</h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{t.liveFeedSubtitle}</p>
            </div>
          </div>

          {/* Live / Pause Button */}
          <button
            onClick={toggleLiveFeed}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border ${
              isLiveFeedRunning
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/[0.08]'
            }`}
          >
            {isLiveFeedRunning ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                {t.live}
              </>
            ) : (
              <>
                <Pause className="w-2.5 h-2.5" />
                {t.paused}
              </>
            )}
          </button>
        </div>

        {/* Streaming Events Table */}
        <div className="border border-black/[0.05] dark:border-white/[0.06] rounded-xl overflow-hidden text-[10px]">
          <div className="grid grid-cols-12 gap-1 px-2.5 py-1.5 bg-black/[0.02] dark:bg-white/[0.02] text-zinc-500 dark:text-zinc-400 font-medium border-b border-black/[0.05] dark:border-white/[0.06]">
            <span className="col-span-3">Time</span>
            <span className="col-span-3">Event</span>
            <span className="col-span-3">Table</span>
            <span className="col-span-3 text-right">Details</span>
          </div>

          <div className="max-h-[175px] overflow-y-auto divide-y divide-black/[0.04] dark:divide-white/[0.04]">
            {dataFeedEvents.map((evt, idx) => (
              <div
                key={`${evt.id}-${idx}`}
                onClick={() => setInspectEvent(evt)}
                className="grid grid-cols-12 gap-1 px-2.5 py-1.5 items-center hover:bg-black/[0.02] dark:hover:bg-white/[0.03] cursor-pointer transition-colors"
              >
                <span className="col-span-3 font-mono text-zinc-400 text-[9px]">{evt.time}</span>
                <span className="col-span-3">
                  <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold border ${getEventBadge(evt.event)}`}>
                    {evt.event}
                  </span>
                </span>
                <span className="col-span-3 font-medium text-zinc-700 dark:text-zinc-300 truncate">
                  {evt.table}
                </span>
                <span className="col-span-3 text-right font-normal text-zinc-500 dark:text-zinc-400 truncate">
                  {evt.details}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Activity Timeline */}
      <div className="bg-white/80 dark:bg-[#111420]/80 backdrop-blur-2xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-violet-500" />
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">{t.activityTitle}</h3>
          </div>
          <span className="text-[10px] font-medium text-violet-600 dark:text-violet-400 hover:underline cursor-pointer">
            {t.viewAll}
          </span>
        </div>

        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
          {activityTimeline.slice(0, 5).map((act) => (
            <div key={act.id} className="flex items-start gap-2 text-[11px]">
              <div className="mt-0.5">
                {act.type === 'badge' ? (
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                ) : act.type === 'hint' ? (
                  <Lightbulb className="w-3.5 h-3.5 text-violet-500" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-zinc-700 dark:text-zinc-300 font-normal leading-tight">
                  {act.message}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] font-mono text-zinc-400">{act.time}</span>
                  {act.xpAward && (
                    <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                      +{act.xpAward} XP
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI Architecture Copilot */}
      <div className="bg-white/80 dark:bg-[#111420]/80 backdrop-blur-2xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-3.5 shadow-sm">
        {/* Architect Header */}
        <div className="flex items-start gap-2.5 mb-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 dark:bg-violet-400/10 border border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 tracking-tight">
              {t.coachTitle}
            </h4>
            <p className="text-[10px] text-violet-600 dark:text-violet-400 font-medium">
              {t.coachSub}
            </p>
          </div>
        </div>

        {/* Coach Speech Box */}
        <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06] rounded-xl p-2.5 text-[11px] text-zinc-700 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
          {aiCoachText}
        </div>

        {/* 4 Instant Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5 mt-2.5">
          <button
            onClick={() => coachAction('hint')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] hover:bg-white dark:hover:bg-white/[0.07] text-[10px] font-medium text-zinc-700 dark:text-zinc-300 transition-all"
          >
            <Lightbulb className="w-3 h-3 text-amber-500" />
            {t.hintBtn}
          </button>

          <button
            onClick={() => coachAction('explain')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] hover:bg-white dark:hover:bg-white/[0.07] text-[10px] font-medium text-zinc-700 dark:text-zinc-300 transition-all"
          >
            <BookOpen className="w-3 h-3 text-violet-500" />
            {t.explainBtn}
          </button>

          <button
            onClick={() => coachAction('example')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] hover:bg-white dark:hover:bg-white/[0.07] text-[10px] font-medium text-zinc-700 dark:text-zinc-300 transition-all"
          >
            <Code2 className="w-3 h-3 text-blue-500" />
            {t.exampleBtn}
          </button>

          <button
            onClick={() => coachAction('next')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] hover:bg-white dark:hover:bg-white/[0.07] text-[10px] font-medium text-zinc-700 dark:text-zinc-300 transition-all"
          >
            <ArrowRight className="w-3 h-3 text-emerald-500" />
            {t.nextBtn}
          </button>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {inspectEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${getEventBadge(inspectEvent.event)}`}>
                {inspectEvent.event} TRANSACTION
              </span>
              <button onClick={() => setInspectEvent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-400">Timestamp:</span>
                <span className="font-mono font-bold">{inspectEvent.time}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-400">Table:</span>
                <span className="font-bold">{inspectEvent.table}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-400">Execution Time:</span>
                <span className="text-emerald-600 font-bold">{inspectEvent.durationMs || 3} ms</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Details:</span>
                <p className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg font-mono text-[11px]">
                  {inspectEvent.details}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

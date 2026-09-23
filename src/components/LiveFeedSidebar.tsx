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
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      case 'SELECT':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
      case 'UPDATE':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      case 'DELETE':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800';
    }
  };

  return (
    <aside className="w-full lg:w-[290px] xl:w-[320px] shrink-0 flex flex-col gap-3">
      {/* 1. Live Data Feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Radio className={`w-4 h-4 ${isLiveFeedRunning ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-100">{t.liveFeedTitle}</h3>
              <p className="text-[10px] text-slate-400">{t.liveFeedSubtitle}</p>
            </div>
          </div>

          {/* Live / Pause Button */}
          <button
            onClick={toggleLiveFeed}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all border ${
              isLiveFeedRunning
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800'
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
        <div className="border border-slate-100 dark:border-slate-800/80 rounded-xl overflow-hidden text-[10px]">
          <div className="grid grid-cols-12 gap-1 px-2 py-1.5 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
            <span className="col-span-3">Time</span>
            <span className="col-span-3">Event</span>
            <span className="col-span-3">Table</span>
            <span className="col-span-3 text-right">Details</span>
          </div>

          <div className="max-h-[175px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {dataFeedEvents.map((evt, idx) => (
              <div
                key={`${evt.id}-${idx}`}
                onClick={() => setInspectEvent(evt)}
                className="grid grid-cols-12 gap-1 px-2 py-1.5 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <span className="col-span-3 font-mono text-slate-400 text-[9px]">{evt.time}</span>
                <span className="col-span-3">
                  <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black border ${getEventBadge(evt.event)}`}>
                    {evt.event}
                  </span>
                </span>
                <span className="col-span-3 font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {evt.table}
                </span>
                <span className="col-span-3 text-right font-medium text-slate-500 dark:text-slate-400 truncate">
                  {evt.details}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Activity Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-500" />
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-100">{t.activityTitle}</h3>
          </div>
          <span className="text-[10px] font-bold text-pink-600 hover:underline cursor-pointer">
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
                  <Lightbulb className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-tight">
                  {act.message}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] font-mono text-slate-400">{act.time}</span>
                  {act.xpAward && (
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">
                      +{act.xpAward} XP
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI Learning Coach */}
      <div className="bg-gradient-to-br from-pink-50/90 via-purple-50/70 to-indigo-50/80 dark:from-slate-900 dark:via-pink-950/20 dark:to-purple-950/20 border border-pink-200/80 dark:border-pink-900/60 rounded-2xl p-3.5 shadow-sm">
        {/* Robot Header */}
        <div className="flex items-start gap-2.5 mb-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20 shrink-0 animate-pulse-glow">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              {t.coachTitle}
            </h4>
            <p className="text-[10px] text-pink-700 dark:text-pink-300 font-semibold">
              {t.coachSub}
            </p>
          </div>
        </div>

        {/* Coach Speech Bubble */}
        <div className="bg-white/90 dark:bg-slate-800/90 border border-pink-200/60 dark:border-pink-900/60 rounded-xl p-2.5 text-[11px] text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line shadow-2xs">
          {aiCoachText}
        </div>

        {/* 4 Instant Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5 mt-2.5">
          <button
            onClick={() => coachAction('hint')}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 hover:bg-amber-50 text-[10px] font-bold text-amber-700 dark:text-amber-300 transition-all shadow-2xs"
          >
            <Lightbulb className="w-3 h-3 text-amber-500" />
            {t.hintBtn}
          </button>

          <button
            onClick={() => coachAction('explain')}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 hover:bg-purple-50 text-[10px] font-bold text-purple-700 dark:text-purple-300 transition-all shadow-2xs"
          >
            <BookOpen className="w-3 h-3 text-purple-500" />
            {t.explainBtn}
          </button>

          <button
            onClick={() => coachAction('example')}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 hover:bg-blue-50 text-[10px] font-bold text-blue-700 dark:text-blue-300 transition-all shadow-2xs"
          >
            <Code2 className="w-3 h-3 text-blue-500" />
            {t.exampleBtn}
          </button>

          <button
            onClick={() => coachAction('next')}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 text-[10px] font-bold text-pink-700 dark:text-pink-300 transition-all shadow-2xs"
          >
            <ArrowRight className="w-3 h-3 text-pink-500" />
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

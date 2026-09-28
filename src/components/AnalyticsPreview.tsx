'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { telemetryService } from '@/lib/telemetry';
import {
  applyIngest,
  BOOK_CATEGORIES,
  BORROW_MONTHS,
  borrowPoints,
  HotMark,
  initialAnalyticsSnapshot,
  nextIngestEvent,
  roleShares,
  USER_ROLES,
  windowChangePercent,
  type AnalyticsSnapshot,
} from '@/lib/analytics-ingest';
import { BarChart3, Pause, Plus, TrendingUp } from 'lucide-react';

const BOOK_COLORS: Record<(typeof BOOK_CATEGORIES)[number], string> = {
  Fiction: 'bg-indigo-500',
  Science: 'bg-pink-500',
  History: 'bg-purple-500',
  Others: 'bg-rose-400',
};

const ROLE_STYLE: Record<(typeof USER_ROLES)[number], { stroke: string; dot: string }> = {
  Students: { stroke: '#3b82f6', dot: 'bg-blue-500' },
  Teachers: { stroke: '#ec4899', dot: 'bg-pink-500' },
  Staff: { stroke: '#10b981', dot: 'bg-emerald-500' },
  Others: { stroke: '#f59e0b', dot: 'bg-amber-500' },
};

const INGEST_MS = 1800;

export const AnalyticsPreview: React.FC = () => {
  const { awardXp, isLiveFeedRunning, toggleLiveFeed, dataFeedEvents, addFeedEvent } = useAppStore();
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot>(initialAnalyticsSnapshot);
  const [hot, setHot] = useState<HotMark | null>(null);
  const [latest, setLatest] = useState('Waiting for the first ingest.');
  const [ingested, setIngested] = useState(0);
  const [extraChart, setExtraChart] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState(telemetryService.getSummary().avgLatencyMs);
  const seenEventId = useRef<string | null>(null);
  const ingestCursor = useRef(0);

  useEffect(() => {
    return telemetryService.subscribe((summary) => {
      setLatencyMs(summary.avgLatencyMs);
    });
  }, []);

  useEffect(() => {
    const newest = dataFeedEvents[0];
    if (!newest) return;
    if (seenEventId.current === null) {
      seenEventId.current = newest.id;
      return;
    }
    if (seenEventId.current === newest.id) return;
    seenEventId.current = newest.id;
    setSnapshot((current) => {
      const next = applyIngest(current, newest);
      setHot(next.hot);
      return next.snapshot;
    });
    setLatest(`${newest.time} · ${newest.details}`);
    setIngested((count) => count + 1);
  }, [dataFeedEvents]);

  useEffect(() => {
    if (!hot) return;
    const timer = window.setTimeout(() => setHot(null), 900);
    return () => window.clearTimeout(timer);
  }, [hot]);

  useEffect(() => {
    if (!isLiveFeedRunning) return;
    const timer = window.setInterval(() => {
      const next = nextIngestEvent(ingestCursor.current);
      ingestCursor.current = next.cursor;
      addFeedEvent(next.event);
    }, INGEST_MS);
    return () => window.clearInterval(timer);
  }, [isLiveFeedRunning, addFeedEvent]);

  const bookTotal = BOOK_CATEGORIES.reduce((sum, name) => sum + snapshot.books[name], 0);
  const bookMax = Math.max(...BOOK_CATEGORIES.map((name) => snapshot.books[name]), 1);
  const change = windowChangePercent(snapshot.borrowings);
  const points = borrowPoints(snapshot.borrowings);
  const linePoints = points.map((point) => `${point.x},${point.y}`).join(' ');
  const areaPoints = `${linePoints} ${points[points.length - 1].x},75 ${points[0].x},75`;
  const userCounts = USER_ROLES.map((role) => snapshot.users[role]);
  const userTotal = userCounts.reduce((sum, count) => sum + count, 0);
  const shares = roleShares(userCounts);
  let dashOffset = 0;

  const handleAddChart = (chartName: string) => {
    setExtraChart(chartName);
    awardXp(15, `Added ${chartName} chart to dashboard`);
  };

  return (
    <div className="@container bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600 shrink-0">
            <BarChart3 className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-100">Analytics Preview</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate" aria-live="polite">
              {isLiveFeedRunning ? latest : 'Ingest paused. Resume to keep the charts moving.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleLiveFeed}
            aria-pressed={isLiveFeedRunning}
            className={`inline-flex items-center gap-1.5 h-9 px-2.5 rounded-xl text-xs font-bold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60 ${
              isLiveFeedRunning
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            {isLiveFeedRunning ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            ) : (
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            {isLiveFeedRunning ? `Live · ${ingested}` : 'Paused'}
          </button>
          <button
            type="button"
            onClick={() => handleAddChart('Query Latency KPI')}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Add to Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 @min-[520px]:grid-cols-2 @min-[960px]:grid-cols-4 gap-3">
        <div
          className={`rounded-xl border p-3 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between ${
            hot?.startsWith('book:')
              ? 'border-pink-400 dark:border-pink-500'
              : 'border-slate-200/80 dark:border-slate-800'
          }`}
          role="img"
          aria-label={`Books by category. ${BOOK_CATEGORIES.map((name) => `${name} ${snapshot.books[name]}`).join(', ')}. Total ${bookTotal}.`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">Books by Category</span>
            <span className="text-[9px] font-bold text-slate-400">Total: {bookTotal}</span>
          </div>
          <div className="h-24 flex items-end justify-between gap-2 px-1">
            {BOOK_CATEGORIES.map((label) => {
              const value = snapshot.books[label];
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-1 group min-w-0 h-full">
                  <span className={`text-[9px] font-bold text-slate-500 transition-opacity ${hot === `book:${label}` ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {value}
                  </span>
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className={`w-full ${BOOK_COLORS[label]} rounded-t-md transition-all duration-500 hover:brightness-110 shadow-2xs ${hot === `book:${label}` ? 'brightness-125' : ''}`}
                      style={{ height: `${Math.max(12, (value / bookMax) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 truncate w-full text-center">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`rounded-xl border p-3 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between ${
            hot === 'borrow' ? 'border-pink-400 dark:border-pink-500' : 'border-slate-200/80 dark:border-slate-800'
          }`}
          role="img"
          aria-label={`Monthly borrowings. ${BORROW_MONTHS.map((month, index) => `${month} ${snapshot.borrowings[index]}`).join(', ')}. Change ${change} percent.`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">Monthly Borrowings</span>
            <span className={`text-[9px] font-bold flex items-center gap-0.5 ${change >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              <TrendingUp className="w-2.5 h-2.5" aria-hidden="true" />
              {change >= 0 ? '+' : ''}
              {change}%
            </span>
          </div>
          <div className="h-24 relative flex items-center justify-center">
            <svg viewBox="0 0 200 80" className="w-full h-full overflow-visible" aria-hidden="true">
              <defs>
                <linearGradient id="analytics-borrow-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={areaPoints} fill="url(#analytics-borrow-fill)" />
              <polyline points={linePoints} fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {points.map((point, index) => (
                <circle
                  key={BORROW_MONTHS[index]}
                  cx={point.x}
                  cy={point.y}
                  r={index === points.length - 1 && hot === 'borrow' ? 5 : 3.5}
                  fill="#ffffff"
                  stroke="#ec4899"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
          <div className="grid grid-cols-6 text-[10px] font-semibold text-slate-400 text-center">
            {BORROW_MONTHS.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>

        <div
          className={`rounded-xl border p-3 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-2 ${
            hot?.startsWith('user:')
              ? 'border-pink-400 dark:border-pink-500'
              : 'border-slate-200/80 dark:border-slate-800'
          }`}
          role="img"
          aria-label={`Users. Total ${userTotal}. ${USER_ROLES.map((role, index) => `${role} ${shares[index]} percent`).join(', ')}.`}
        >
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90" aria-hidden="true">
              {USER_ROLES.map((role, index) => {
                const share = shares[index];
                const circle = (
                  <circle
                    key={role}
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke={ROLE_STYLE[role].stroke}
                    strokeWidth="4"
                    strokeDasharray={`${share} ${100 - share}`}
                    strokeDashoffset={-dashOffset}
                  />
                );
                dashOffset += share;
                return circle;
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black text-slate-800 dark:text-slate-100">{userTotal}</span>
              <span className="text-[7px] text-slate-400">Users</span>
            </div>
          </div>
          <div className="space-y-1 text-[9px] font-semibold flex-1 min-w-0">
            {USER_ROLES.map((role, index) => (
              <div key={role} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${ROLE_STYLE[role].dot}`} aria-hidden="true" />
                  <span className="truncate">{role}</span>
                </span>
                <span className={`font-bold ${hot === `user:${role}` ? 'text-pink-600 dark:text-pink-300' : 'text-slate-800 dark:text-slate-200'}`}>
                  {shares[index]}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {extraChart ? (
          <div className="rounded-xl border border-pink-300 dark:border-pink-800 p-3 bg-pink-50/40 dark:bg-pink-950/20 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-pink-700 dark:text-pink-300">{extraChart}</span>
              <span className="text-[9px] font-bold text-emerald-600">{isLiveFeedRunning ? 'Live' : 'Paused'}</span>
            </div>
            <div className="text-center py-2">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{latencyMs.toFixed(1)} ms</span>
              <p className="text-[9px] text-slate-500">Average execution time</p>
            </div>
            <div className="flex justify-between items-center text-[9px] font-bold text-pink-600">
              <span>{ingested} ingested</span>
              <button
                type="button"
                onClick={() => setExtraChart(null)}
                className="text-slate-400 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60 rounded-md px-1"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleAddChart('Database Cache Hit Ratio')}
            className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/30 dark:hover:bg-pink-950/20 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/60"
          >
            <BarChart3 className="w-6 h-6 text-slate-400 group-hover:text-pink-500 group-hover:scale-110 transition-all mb-1" aria-hidden="true" />
            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Drag a chart here</p>
            <p className="text-[9px] text-slate-400">(or click to add from library)</p>
          </button>
        )}
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Plus,
  Sliders,
  Sparkles,
  ArrowUpRight,
  PlusCircle,
} from 'lucide-react';

export const AnalyticsPreview: React.FC = () => {
  const { awardXp } = useAppStore();
  const [selectedRange, setSelectedRange] = useState('6M');
  const [extraChart, setExtraChart] = useState<string | null>(null);

  const handleAddChart = (chartName: string) => {
    setExtraChart(chartName);
    awardXp(15, `Added ${chartName} chart to dashboard`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-100">Analytics Preview</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Drag charts to your dashboard.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleAddChart('Query Latency KPI')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add to Dashboard
        </button>
      </div>

      {/* Grid of Interactive Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Books by Category (Bar Chart) */}
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">Books by Category</span>
            <span className="text-[9px] font-bold text-slate-400">Total: 445</span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-24 flex items-end justify-between gap-2 pt-2 px-1">
            {[
              { label: 'Fiction', val: 95, color: 'bg-indigo-500' },
              { label: 'Science', val: 145, color: 'bg-pink-500' },
              { label: 'History', val: 75, color: 'bg-purple-500' },
              { label: 'Others', val: 110, color: 'bg-rose-400' },
            ].map((bar) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.val}
                </span>
                <div
                  className={`w-full ${bar.color} rounded-t-md transition-all duration-500 hover:brightness-110 shadow-2xs`}
                  style={{ height: `${(bar.val / 160) * 100}%` }}
                />
                <span className="text-[8px] font-semibold text-slate-500 truncate w-full text-center">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Monthly Borrowings (Line Chart) */}
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">Monthly Borrowings</span>
            <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +24%
            </span>
          </div>

          {/* SVG Line chart with bezier curve */}
          <div className="h-24 relative flex items-center justify-center">
            <svg viewBox="0 0 200 80" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Fill under curve */}
              <polygon
                points="10,65 45,45 80,55 115,25 150,35 185,15 185,75 10,75"
                fill="url(#lineGrad)"
              />
              {/* Line */}
              <polyline
                points="10,65 45,45 80,55 115,25 150,35 185,15"
                fill="none"
                stroke="#ec4899"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots */}
              {[
                { cx: 10, cy: 65 },
                { cx: 45, cy: 45 },
                { cx: 80, cy: 55 },
                { cx: 115, cy: 25 },
                { cx: 150, cy: 35 },
                { cx: 185, cy: 15 },
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="3.5"
                  fill="#ffffff"
                  stroke="#ec4899"
                  strokeWidth="2"
                  className="hover:r-5 transition-all cursor-pointer"
                />
              ))}
            </svg>
          </div>

          <div className="flex justify-between text-[8px] font-semibold text-slate-400 px-1">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        {/* 3. User Types (Donut Chart) */}
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-2">
          {/* Donut graphic */}
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {/* Students (62%) */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="4"
                strokeDasharray="62 38"
                strokeDashoffset="0"
              />
              {/* Teachers (18%) */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#ec4899"
                strokeWidth="4"
                strokeDasharray="18 82"
                strokeDashoffset="-62"
              />
              {/* Staff (12%) */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="12 88"
                strokeDashoffset="-80"
              />
              {/* Others (8%) */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="4"
                strokeDasharray="8 92"
                strokeDashoffset="-92"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black text-slate-800 dark:text-slate-100">820</span>
              <span className="text-[7px] text-slate-400">Users</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1 text-[9px] font-semibold flex-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Students
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">62%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-pink-500" /> Teachers
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">18%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Staff
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">12%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Others
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">8%</span>
            </div>
          </div>
        </div>

        {/* 4. Drag Chart Slot / Custom Metric */}
        {extraChart ? (
          <div className="rounded-xl border border-pink-300 dark:border-pink-800 p-3 bg-pink-50/40 dark:bg-pink-950/20 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-pink-700 dark:text-pink-300">{extraChart}</span>
              <span className="text-[9px] font-bold text-emerald-600">Active</span>
            </div>
            <div className="text-center py-2">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100">1.8 ms</span>
              <p className="text-[9px] text-slate-500">Avg p99 Execution Time</p>
            </div>
            <div className="flex justify-between items-center text-[9px] font-bold text-pink-600">
              <span>99.98% Cache Hit</span>
              <button onClick={() => setExtraChart(null)} className="text-slate-400 hover:text-red-500">
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => handleAddChart('Database Cache Hit Ratio')}
            className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/30 transition-all group"
          >
            <BarChart3 className="w-6 h-6 text-slate-400 group-hover:text-pink-500 group-hover:scale-110 transition-all mb-1" />
            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Drag a chart here
            </p>
            <p className="text-[9px] text-slate-400">(or click to add from library)</p>
          </div>
        )}
      </div>
    </div>
  );
};

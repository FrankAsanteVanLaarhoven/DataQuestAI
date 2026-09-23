'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Database,
  Cpu,
  Zap,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2 sm:p-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2">
          <BarChart3 className="w-3.5 h-3.5" /> Enterprise Warehouse Telemetry
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          System Analytics & Star Schema Performance
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-blue-100 max-w-xl">
          Real-time metrics streaming from your simulated database cluster, indexing performance, and query execution plans.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Queries Executed', val: '148,290', icon: Database, color: 'text-blue-500', trend: '+18.4% today' },
          { label: 'Avg Query Latency (p95)', val: '2.14 ms', icon: Zap, color: 'text-amber-500', trend: '-0.3 ms faster' },
          { label: 'Cache Hit Ratio', val: '99.4%', icon: Activity, color: 'text-emerald-500', trend: 'Redis warm' },
          { label: 'Storage Utilized', val: '1.42 GB', icon: Layers, color: 'text-purple-500', trend: 'Partitioned' },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{kpi.val}</div>
              <span className="text-[10px] font-bold text-emerald-600 mt-1 block">{kpi.trend}</span>
            </div>
          );
        })}
      </div>

      {/* Star Schema Interactive Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              OLAP Star Schema: Retail Data Warehouse
            </h3>
            <p className="text-xs text-slate-500">
              Fact and Dimension tables optimized for analytical aggregations (SUM, AVG, GROUP BY).
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            Dimension Modeling
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <h4 className="font-bold text-xs text-blue-600 mb-1">DimDate</h4>
            <p className="text-[11px] text-slate-400 font-mono">DateKey (PK), DayOfWeek, Month, Quarter, Year</p>
          </div>

          <div className="p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-black text-xs text-indigo-700 dark:text-indigo-300">FactSales (Center)</h4>
              <span className="text-[9px] font-bold bg-indigo-200 dark:bg-indigo-900 text-indigo-800 px-1.5 py-0.5 rounded">
                Fact Table
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
              SaleID (PK)<br />
              DateKey (FK)<br />
              ProductKey (FK)<br />
              CustomerKey (FK)<br />
              QuantitySold, Revenue, TaxAmount
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <h4 className="font-bold text-xs text-purple-600 mb-1">DimProduct</h4>
            <p className="text-[11px] text-slate-400 font-mono">ProductKey (PK), SKU, Name, Category, UnitCost</p>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import {
  Activity,
  Server,
  Network,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  Cpu,
  Database,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface DevOpsOperationsLabProps {
  week: number;
}

export const DevOpsOperationsLab: React.FC<DevOpsOperationsLabProps> = ({ week }) => {
  const { awardXp, setActiveTab } = useAppStore();

  // Week 1: DORA Metrics State
  const [deployFrequencyDays, setDeployFrequencyDays] = useState(1); // 1 = daily
  const [leadTimeHours, setLeadTimeHours] = useState(2);
  const [changeFailureRatePercent, setChangeFailureRatePercent] = useState(5);
  const [timeToRestoreHours, setTimeToRestoreHours] = useState(0.5);

  // Week 6: Ticket Surge State
  const [trafficRps, setTrafficRps] = useState(10000);
  const [enableRedisCache, setEnableRedisCache] = useState(true);
  const [dbLoadPercent, setDbLoadPercent] = useState(8);

  // Week 8: Night Alert Distributed Trace State
  const [activeTraceId, setActiveTraceId] = useState('4bf92f3577b34da6a3ce929d0e0e4736');

  // Week 9: SRE Error Budget State
  const [sloTargetPercent, setSloTargetPercent] = useState(99.9);
  const [outageMinutesThisMonth, setOutageMinutesThisMonth] = useState(18);

  // Week 11: FinOps Cloud Cost State
  const [ec2InstanceCount, setEc2InstanceCount] = useState(20);
  const [cpuIdleAveragePercent, setCpuIdleAveragePercent] = useState(88);

  // Calculate DORA Tier
  const isDoraElite = deployFrequencyDays <= 1 && leadTimeHours < 24 && changeFailureRatePercent <= 15 && timeToRestoreHours < 1;

  const handleSimulateSurge = () => {
    sound.playClick();
    if (enableRedisCache) {
      setDbLoadPercent(8);
      sound.playSuccess();
      awardXp(25, 'Absorbed 10,000 RPS surge via Redis Cache-Aside');
    } else {
      setDbLoadPercent(100);
      sound.playError();
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              CSC3131 Development &amp; Operations of Systems Lab
              <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                Week {week}
              </span>
            </h3>
            <p className="text-xs text-cyan-200/80">DORA Metrics, Multi-Tier Systems, Traffic Surges &amp; SRE Observability</p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('foundry');
          }}
          className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" /> Open in Full Architecture Foundry
        </button>
      </div>

      {/* Week 1: Four DORA Metrics */}
      {week === 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">DORA Engineering Performance Cluster:</span>
            <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
              isDoraElite ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
            }`}>
              {isDoraElite ? '★ ELITE PERFORMER' : 'MEDIUM / LOW PERFORMER'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono">DEPLOY FREQUENCY</span>
              <span className="text-base font-bold text-cyan-300">{deployFrequencyDays <= 1 ? 'Multiple/Day' : `${deployFrequencyDays} Days`}</span>
              <span className="text-[10px] text-emerald-400 block font-mono">Elite: On-demand</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono">LEAD TIME FOR CHANGES</span>
              <span className="text-base font-bold text-cyan-300">{leadTimeHours} Hours</span>
              <span className="text-[10px] text-emerald-400 block font-mono">Elite: &lt; 1 Day</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono">CHANGE FAILURE RATE</span>
              <span className="text-base font-bold text-cyan-300">{changeFailureRatePercent}%</span>
              <span className="text-[10px] text-emerald-400 block font-mono">Elite: 0–15%</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono">TIME TO RESTORE</span>
              <span className="text-base font-bold text-cyan-300">{timeToRestoreHours} Hours</span>
              <span className="text-[10px] text-emerald-400 block font-mono">Elite: &lt; 1 Hour</span>
            </div>
          </div>
        </div>
      )}

      {/* Week 6: The 10:00 AM Ticket Surge */}
      {week === 6 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setEnableRedisCache(!enableRedisCache); sound.playClick(); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  enableRedisCache
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-rose-500 bg-rose-500/20 text-rose-300'
                }`}
              >
                {enableRedisCache ? '✓ Distributed Redis Cache: ACTIVE' : '⚠️ Direct Database Queries Only'}
              </button>
            </div>

            <button
              onClick={handleSimulateSurge}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Zap className="w-3.5 h-3.5" /> Simulate 10,000 RPS Ticket Rush
            </button>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300">Database Connection Pool Utilization:</span>
              <span className={`font-bold ${dbLoadPercent > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {dbLoadPercent}% {dbLoadPercent >= 100 ? '(CRASHED: Connection Limit Exceeded)' : '(Stable)'}
              </span>
            </div>

            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${dbLoadPercent > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${dbLoadPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-300">
              {enableRedisCache
                ? 'Redis absorbs 9,800 requests/sec in RAM ($O(1)$ lookups, sub-millisecond). Database pool handles only the remaining 2% cache misses smoothly.'
                : 'Catastrophic Failure: 10,000 incoming queries exhaust the 600-connection limit. PostgreSQL crashes with "FATAL: too many connections".'}
            </p>
          </div>
        </div>
      )}

      {/* Week 8: The 02:14 AM Night Alert & Distributed Tracing */}
      {week === 8 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Trace Context ID:</span>
            <span className="text-cyan-300 font-bold">{activeTraceId}</span>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="text-slate-400">Distributed Trace Span Waterfall (W3C Traceparent):</div>
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between p-2 rounded bg-cyan-900/30 border border-cyan-700/40">
                <span>GET /api/dispatch/couriers (Ingress Gateway)</span>
                <span className="text-cyan-200">12 ms</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-indigo-900/30 border border-indigo-700/40 ml-4">
                <span>DispatchService.verifyLocation() (App Tier)</span>
                <span className="text-indigo-200">45 ms</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-rose-950/40 border border-rose-700/40 ml-8 text-rose-300">
                <span>SQL: SELECT * FROM DriverLedger (Storage Timeout)</span>
                <span className="font-bold">504 Gateway Timeout (Crash Root Cause)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week 9: SRE SLO & Error Budget */}
      {week === 9 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-300">Target SLO (30 Days):</span>
              <div className="text-xl font-bold font-mono text-cyan-300">{sloTargetPercent}% Availability</div>
              <span className="text-[10px] text-slate-400 block">Allowable monthly downtime: 43.2 minutes</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-300">Consumed Downtime:</span>
              <div className="text-xl font-bold font-mono text-amber-300">{outageMinutesThisMonth} mins</div>
              <span className="text-[10px] text-emerald-400 block">Remaining Error Budget: 25.2 mins (58%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Default fallback for other weeks */}
      {week !== 1 && week !== 6 && week !== 8 && week !== 9 && (
        <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400">DevOps &amp; Cloud Operations Workbench</span>
            <span className="text-[10px] text-slate-400 font-mono">Status: Ready</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Practice site reliability engineering and systems operations. Verify DORA metrics, multi-tier isolation, and chaos recovery patterns according to Newcastle University CSC3131 rubrics.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => { sound.playSuccess(); awardXp(25, `Completed Week ${week} DevOps lab`); }}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Verify Operations Invariant (+25 XP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { realSqlLabEngine } from '@/lib/sql-lab-engine';
import { telemetryService } from '@/lib/telemetry';
import {
  Building2,
  Play,
  Pause,
  AlertTriangle,
  Zap,
  Activity,
  CheckCircle2,
  Sparkles,
  Search,
  BookOpen,
  DollarSign,
  GraduationCap,
  Users,
  Brain,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface CampusService {
  id: string;
  name: string;
  domain: string;
  icon: any;
  status: 'healthy' | 'degraded' | 'critical';
  qps: number;
  latencyMs: number;
  lastEvent: string;
}

interface ChaosIncident {
  id: string;
  title: string;
  department: string;
  symptom: string;
  rootCause: string;
  mitigationOptions: { label: string; action: string; isCorrect: boolean }[];
  resolved: boolean;
}

export const DigitalUniversitySimulation: React.FC = () => {
  const { awardXp } = useAppStore();
  const [isRunning, setIsRunning] = useState(false);
  const [chaosMode, setChaosMode] = useState(false);
  const [activeIncident, setActiveIncident] = useState<ChaosIncident | null>(null);
  const [ticker, setTicker] = useState(0);

  // 10 Campus Services
  const [services, setServices] = useState<CampusService[]>([
    { id: 'adm', name: 'Admissions & Enrollment', domain: 'Relational OLTP', icon: GraduationCap, status: 'healthy', qps: 142, latencyMs: 2.1, lastEvent: 'Enrolled student #S005 in CS101' },
    { id: 'stu', name: 'Student Information System', domain: 'Normalized 3NF', icon: Users, status: 'healthy', qps: 210, latencyMs: 1.8, lastEvent: 'Updated address for #S002' },
    { id: 'cou', name: 'Curriculum & Courses', domain: 'Catalog DB', icon: BookOpen, status: 'healthy', qps: 85, latencyMs: 1.4, lastEvent: 'Fetched syllabus for CSC1033' },
    { id: 'lib', name: 'Library & Lending Engine', domain: 'M:N Junction', icon: BookOpen, status: 'healthy', qps: 94, latencyMs: 2.3, lastEvent: 'Loan #L104 issued to #S001' },
    { id: 'pay', name: 'Student Tuition Payments', domain: 'ACID Ledger', icon: DollarSign, status: 'healthy', qps: 62, latencyMs: 3.2, lastEvent: 'Processed payment ref #PAY-882' },
    { id: 'acc', name: 'Campus Accommodation', domain: 'Entity-Relational', icon: Building2, status: 'healthy', qps: 45, latencyMs: 2.0, lastEvent: 'Room allocated in Castle Leazes' },
    { id: 'sea', name: 'Academic Search Engine', domain: 'Inverted Index', icon: Search, status: 'healthy', qps: 180, latencyMs: 4.5, lastEvent: 'Query: "database indexing"' },
    { id: 'ana', name: 'University Executive OLAP', domain: 'Star Schema', icon: Activity, status: 'healthy', qps: 28, latencyMs: 8.4, lastEvent: 'Aggregated Q1 retention KPI' },
    { id: 'ai', name: 'Campus AI Study Tutor', domain: 'Vector DB RAG', icon: Brain, status: 'healthy', qps: 115, latencyMs: 18.2, lastEvent: 'Synthesized 3NF explanation' },
    { id: 'gov', name: 'Data Ethics & Privacy Gate', domain: 'RBAC Policy', icon: ShieldCheck, status: 'healthy', qps: 340, latencyMs: 0.8, lastEvent: 'Audit: Masked medical notes' },
  ]);

  // Sim ticker
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTicker((prev) => prev + 1);

      // Random jitter on healthy services
      setServices((prev) =>
        prev.map((s) => ({
          ...s,
          qps: Math.max(10, Math.round(s.qps + (Math.random() * 20 - 10))),
          latencyMs: s.status === 'healthy' ? Math.max(0.5, Math.round((s.latencyMs + (Math.random() * 0.4 - 0.2)) * 10) / 10) : s.latencyMs,
        }))
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Chaos Mode Incident Trigger
  const triggerChaosIncident = () => {
    const incidents: ChaosIncident[] = [
      {
        id: 'inc_1',
        title: 'Freshers Week Traffic Surge: 10,000 Students Registering Simultaneously',
        department: 'Admissions & Enrollment',
        symptom: 'Admissions database latency escalated to 85ms! Connection pool exhausted with thread contention.',
        rootCause: 'Single master relational database handling both writes and read-heavy syllabus queries.',
        mitigationOptions: [
          { label: 'Provision Read Replicas & Connection Pooling', action: 'replicas', isCorrect: true },
          { label: 'Delete Student Table to free up RAM', action: 'drop', isCorrect: false },
          { label: 'Disable ACID transactions during registration', action: 'no_acid', isCorrect: false },
        ],
        resolved: false,
      },
      {
        id: 'inc_2',
        title: 'Information Retrieval Degradation: Search Engine Returning Irrelevant Noise',
        department: 'Academic Search Engine',
        symptom: 'Query for "research" returns 90,000 documents including cafeteria menus and football flyers.',
        rootCause: 'Stop-word filter was corrupted and Porter Stemmer was bypassed.',
        mitigationOptions: [
          { label: 'Rebuild Inverted Index with Stop-Words & Porter Stemmer', action: 'reindex', isCorrect: true },
          { label: 'Switch from Inverted Index to Full Table Scan', action: 'scan', isCorrect: false },
          { label: 'Force exact string matching only', action: 'exact', isCorrect: false },
        ],
        resolved: false,
      },
      {
        id: 'inc_3',
        title: 'GDPR Breach Alert: Student Clinical Records Visible in Library Loans',
        department: 'Data Ethics & Privacy Gate',
        symptom: 'Library desk terminal projected student medical diagnoses alongside borrowed book titles.',
        rootCause: 'Unrestricted JOIN on Student master table without column-level security projection.',
        mitigationOptions: [
          { label: 'Enforce Column-Level Projection & Purpose Limitation (GDPR Art. 5)', action: 'masking', isCorrect: true },
          { label: 'Encrypt the database with password "admin123"', action: 'weak_enc', isCorrect: false },
          { label: 'Make library loans completely anonymous', action: 'anon', isCorrect: false },
        ],
        resolved: false,
      },
    ];

    const chosen = incidents[Math.floor(Math.random() * incidents.length)];
    setActiveIncident(chosen);

    // Degrade target department
    setServices((prev) =>
      prev.map((s) =>
        s.name.includes(chosen.department.split(' ')[0])
          ? { ...s, status: 'critical', latencyMs: 78.4 }
          : s
      )
    );
  };

  const handleMitigate = (option: { label: string; action: string; isCorrect: boolean }) => {
    if (option.isCorrect) {
      awardXp(100, `Resolved Chaos Incident: ${activeIncident?.title}`);
      setServices((prev) =>
        prev.map((s) => ({ ...s, status: 'healthy', latencyMs: Math.round((Math.random() * 2 + 1) * 10) / 10 }))
      );
      setActiveIncident(null);
    } else {
      alert('Incorrect Architectural Mitigation! That action increases system vulnerability.');
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2 sm:p-4 text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" /> Ultimate Capstone Simulation
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Digital University: Live Enterprise Data Infrastructure
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-100 max-w-xl">
              All 10 campus systems connected live: Admissions, Student SIS, Courses, Library, Payments, Accommodation, Search, OLAP Warehouse, AI RAG, and Privacy Governance.
            </p>
          </div>

          {/* Simulation Controls */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-md active:scale-95 ${
                isRunning
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
              {isRunning ? 'Pause University' : 'RUN UNIVERSITY'}
            </button>

            <button
              onClick={() => {
                setChaosMode(true);
                setIsRunning(true);
                triggerChaosIncident();
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-xs transition-all shadow-md active:scale-95"
            >
              <Zap className="w-4 h-4" />
              Trigger Chaos Incident
            </button>
          </div>
        </div>
      </div>

      {/* Active Chaos Incident Alert Modal / Banner */}
      {activeIncident && (
        <div className="p-5 rounded-2xl bg-rose-950/80 border-2 border-rose-500 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-rose-400 animate-bounce" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 bg-rose-900 px-2 py-0.5 rounded">
                  CRITICAL INCIDENT • {activeIncident.department}
                </span>
                <h3 className="text-base font-black text-white mt-0.5">{activeIncident.title}</h3>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-rose-300">Reward: +100 XP</span>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-rose-900 text-xs text-rose-200 leading-relaxed font-mono">
            <strong>Incident Telemetry:</strong> {activeIncident.symptom}
            <div className="text-slate-400 text-[11px] mt-1 font-sans">
              <strong>Architectural Root Cause:</strong> {activeIncident.rootCause}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-200 block mb-2">
              Choose the correct architectural repair strategy:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {activeIncident.mitigationOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleMitigate(opt)}
                  className="p-3 bg-slate-900 hover:bg-rose-900/60 border border-slate-700 hover:border-rose-400 rounded-xl text-left text-xs font-bold text-slate-200 hover:text-white transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Campus Systems Grid (10 Departments) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {services.map((svc) => {
          const Icon = svc.icon;
          const isCritical = svc.status === 'critical';

          return (
            <div
              key={svc.id}
              className={`p-4 rounded-2xl bg-slate-900 border transition-all flex flex-col justify-between ${
                isCritical
                  ? 'border-rose-500 shadow-lg shadow-rose-500/20 ring-1 ring-rose-500'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] mb-2">
                  <div className={`p-1.5 rounded-lg ${isCritical ? 'bg-rose-950 text-rose-400' : 'bg-slate-800 text-indigo-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${
                    isCritical ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
                  }`}>
                    {svc.status.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white line-clamp-1">{svc.name}</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{svc.domain}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Throughput:</span>
                  <span className="text-white font-bold">{svc.qps} QPS</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Latency:</span>
                  <span className={isCritical ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {svc.latencyMs} ms
                  </span>
                </div>
                <p className="text-[9px] text-slate-500 font-sans truncate pt-1">{svc.lastEvent}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

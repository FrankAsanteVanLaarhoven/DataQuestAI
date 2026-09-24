'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { telemetryService, MisconceptionMetric } from '@/lib/telemetry';
import {
  GraduationCap,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Users,
  BookOpen,
  Send,
  Sliders,
  BarChart3,
  Clock,
  Zap,
} from 'lucide-react';

interface CustomMissionFormData {
  title: string;
  domain: string;
  objective: string;
  allowedComponents: string[];
  expectedModel: string;
  commonError: string;
  feedback: string;
  xpReward: number;
  timeMinutes: number;
}

export const TeacherStudio: React.FC = () => {
  const { user, awardXp } = useAppStore();
  const [activeTab, setActiveTab] = useState<'analytics' | 'builder' | 'gradebook'>('analytics');
  const [misconceptions, setMisconceptions] = useState<MisconceptionMetric[]>([]);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CustomMissionFormData>({
    title: 'Hospital Clinical Appointment Registry',
    domain: 'Healthcare / NHS',
    objective: 'Understand one-to-many (1:N) relationships and junction associative tables',
    allowedComponents: ['Entity', 'Attribute', 'Relationship', 'Primary Key', 'Foreign Key'],
    expectedModel: 'Patient (1) ── Books ──▶ Appointment (N) ◀── Attends ── (1) Doctor',
    commonError: 'Appointment classified as an attribute rather than an independent entity.',
    feedback: 'An appointment has its own identity, time stamp, and diagnosis attributes.',
    xpReward: 200,
    timeMinutes: 20,
  });

  useEffect(() => {
    const unsub = telemetryService.subscribe((summary) => {
      setMisconceptions(summary.misconceptions);
    });
    return unsub;
  }, []);

  const handleComponentToggle = (comp: string) => {
    setFormData((prev) => ({
      ...prev,
      allowedComponents: prev.allowedComponents.includes(comp)
        ? prev.allowedComponents.filter((c) => c !== comp)
        : [...prev.allowedComponents, comp],
    }));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishSuccess(true);
    awardXp(50, `Published custom mission: ${formData.title}`);
    setTimeout(() => setPublishSuccess(false), 4000);
  };

  // Mock Student Roster Gradebook
  const studentRoster = [
    { name: 'Alex Mercer', email: 'alex@dataquest.org', completed: 6, score: '94%', hintsUsed: 2, topMisconception: 'None (Mastered)' },
    { name: 'Ben Davis', email: 'ben@university.ac.uk', completed: 4, score: '78%', hintsUsed: 7, topMisconception: 'Entity vs Attribute' },
    { name: 'Cara Williams', email: 'cara@university.ac.uk', completed: 5, score: '88%', hintsUsed: 3, topMisconception: '1:N vs M:N Junctions' },
    { name: 'David Lee', email: 'david@university.ac.uk', completed: 3, score: '64%', hintsUsed: 11, topMisconception: 'Missing WHERE Clause' },
    { name: 'Elena Rostova', email: 'elena@dataquest.org', completed: 6, score: '96%', hintsUsed: 1, topMisconception: 'None (Mastered)' },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2 sm:p-4 text-white">
      {/* Teacher Studio Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5" /> Instructor &amp; Pedagogical Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Teacher Studio: Mission Authoring &amp; Class Analytics
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100 max-w-xl">
              Construct verified database modeling challenges without code, publish directly to learner dashboards, and inspect class-wide misconception telemetry.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-black/25 backdrop-blur-md rounded-2xl border border-white/20 self-start sm:self-center">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Class Misconceptions
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'builder'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Mission Builder
            </button>
            <button
              onClick={() => setActiveTab('gradebook')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'gradebook'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Roster &amp; Telemetry
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Class Misconceptions Analytics Dashboard */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Live Class Misconception Distribution
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time cognitive error telemetry gathered across all student canvas attempts and SQL executions.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-800 text-emerald-400">
                Active Cohort: 42 Students
              </span>
            </div>

            {/* Misconception Bars */}
            <div className="space-y-4 pt-2">
              {misconceptions.map((m) => (
                <div key={m.type} className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{m.label}</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {m.percentage}% of cohort ({m.count} incidents)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 rounded-full"
                      style={{ width: `${Math.max(10, m.percentage)}%` }}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] pt-1 text-slate-400">
                    <span><strong>Diagnostic:</strong> {m.description}</span>
                    <span className="text-emerald-300 font-mono"><strong>Remediation:</strong> {m.remediation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Visual Mission Builder */}
      {activeTab === 'builder' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Declarative Mission Builder
              </h3>
              <p className="text-xs text-slate-400">
                Design custom pedagogical exercises with rules, component constraints, and automated remediation.
              </p>
            </div>
            {publishSuccess && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500 text-xs font-bold animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Mission Published to Student Roster!
              </div>
            )}
          </div>

          <form onSubmit={handlePublish} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Mission Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Domain / Industry Context</label>
                <input
                  type="text"
                  required
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Learning Objective</label>
              <input
                type="text"
                required
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Allowed Components */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Allowed Toolbox Primitives:</label>
              <div className="flex flex-wrap gap-2">
                {['Entity', 'Attribute', 'Relationship', 'Primary Key', 'Foreign Key', 'SQL', 'NoSQL', 'Storage'].map((comp) => {
                  const active = formData.allowedComponents.includes(comp);
                  return (
                    <button
                      type="button"
                      key={comp}
                      onClick={() => handleComponentToggle(comp)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        active
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      {active ? '☑' : '☐'} {comp}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target Correct Model</label>
                <textarea
                  rows={2}
                  value={formData.expectedModel}
                  onChange={(e) => setFormData({ ...formData, expectedModel: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-xs text-cyan-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Common Misconception Trap &amp; Remediation</label>
                <textarea
                  rows={2}
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-amber-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span>XP Award: <strong className="text-emerald-400">+{formData.xpReward} XP</strong></span>
                <span>Estimated Time: <strong className="text-white">{formData.timeMinutes} mins</strong></span>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                Publish Mission to Students
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Student Roster & Gradebook */}
      {activeTab === 'gradebook' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Student Competence &amp; Mastery Roster
              </h3>
              <p className="text-xs text-slate-400">
                Detailed telemetry: completion rates, hint dependency, and individual misconception traps.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Student</th>
                  <th className="p-3">Missions Mastered</th>
                  <th className="p-3">Mastery Score</th>
                  <th className="p-3">Hint Dependency</th>
                  <th className="p-3">Top Diagnosed Misconception</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {studentRoster.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/60 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white font-sans">{s.name}</div>
                      <div className="text-[10px] text-slate-500">{s.email}</div>
                    </td>
                    <td className="p-3 text-slate-200">{s.completed} / 6</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800/60">
                        {s.score}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{s.hintsUsed} hints requested</td>
                    <td className="p-3 text-amber-400 font-sans">{s.topMisconception}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

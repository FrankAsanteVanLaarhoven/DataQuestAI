'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import {
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';

interface DissertationStudioLabProps {
  week: number;
}

export const DissertationStudioLab: React.FC<DissertationStudioLabProps> = ({ week }) => {
  const { awardXp } = useAppStore();

  // Week 1 - 3: URERC Ethics & GDPR State
  const [ethicsItems, setEthicsItems] = useState([
    { id: 'e1', label: 'Informed Consent Form & Participant Information Sheet (PIS)', checked: true },
    { id: 'e2', label: 'Data Protection Impact Assessment (DPIA) & GDPR Minimization', checked: true },
    { id: 'e3', label: 'Pseudonymization & Cryptographic Hashing of User IDs', checked: false },
    { id: 'e4', label: 'University Research Ethics Committee (URERC) SAgE Clearance', checked: false },
  ]);

  // Week 7 - 9: Statistical Significance State
  const [baselineP99] = useState(145);
  const [novelP99, setNovelP99] = useState(88);
  const [sampleSize, setSampleSize] = useState(10000);
  const [pValue, setPValue] = useState(0.001);

  // Week 10 - 12: Viva Voce Defense Simulator
  const [activeVivaQuestion, setActiveVivaQuestion] = useState(0);
  const [vivaFeedback, setVivaFeedback] = useState<string | null>(null);

  const vivaQuestions = [
    {
      examiner: 'Prof. Paul Watson',
      prompt: 'Your evaluation demonstrates an 88ms p99 latency on a 3-node cluster. What are the key threats to external validity if this architecture is scaled to 500 nodes across geo-distributed regions?',
      options: [
        'The architecture cannot run on 500 nodes because Java has a 64GB RAM limit.',
        'Network partitions, WAN packet loss, cross-region RTTs, and Raft consensus leader election timeouts will degrade latency, requiring WAN gossip and multi-region replication topologies.',
        'External validity only matters for medical software, not distributed computing systems.',
      ],
      correctIndex: 1,
      rationale: 'Examiners award top marks for recognizing cross-region WAN propagation delay and consensus quorum overheads as fundamental external validity boundaries.',
    },
    {
      examiner: 'Dr. Feng Dong',
      prompt: 'Why did you choose the non-parametric Mann-Whitney U test rather than a standard Student\'s t-test for evaluating response times?',
      options: [
        'Because the t-test was too difficult to compute in Python.',
        'Because response time and latency distributions exhibit heavy right tails and non-Gaussian skew, violating the normality assumptions required by the Student\'s t-test.',
        'Because the Mann-Whitney test always produces a p-value of 0.05.',
      ],
      correctIndex: 1,
      rationale: 'System latencies are non-Gaussian and heavily skewed by GC and queueing, rendering parametric t-tests statistically invalid.',
    },
  ];

  const toggleEthicsItem = (id: string) => {
    sound.playClick();
    const updated = ethicsItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setEthicsItems(updated);
    if (updated.every((item) => item.checked)) {
      sound.playSuccess();
      awardXp(30, 'Achieved 100% SAgE URERC Research Ethics Clearance');
    }
  };

  const handleAnswerViva = (index: number) => {
    sound.playClick();
    const q = vivaQuestions[activeVivaQuestion];
    if (index === q.correctIndex) {
      setVivaFeedback(`✔ EXCELLENT DEFENSE (First Class Mark): ${q.rationale}`);
      sound.playSuccess();
      awardXp(40, `Successfully defended viva thesis question against ${q.examiner}`);
    } else {
      setVivaFeedback('✖ REVISE DEFENSE: That response fails to address the underlying scientific validity criteria.');
      sound.playError();
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              CSC3095 Project & Dissertation Capstone Studio
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active Focus: Week {week} Research Governance, Empirical Evaluation & Viva Voce
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-700/60">
          40 Credits • Stage 3 Compulsory
        </span>
      </div>

      {/* Week 1 - 3: URERC Ethics Governance Checklist */}
      {week <= 3 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Newcastle University Research Ethics (URERC) & GDPR Compliance Gate
              </h5>
              <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                {ethicsItems.filter((i) => i.checked).length} / {ethicsItems.length} Approved
              </span>
            </div>

            <div className="space-y-2">
              {ethicsItems.map((item) => (
                <label
                  key={item.id}
                  onClick={() => toggleEthicsItem(item.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    item.checked
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200 font-semibold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    className="w-4 h-4 accent-emerald-600"
                  />
                  <span className="text-xs">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Week 7 - 9: Quantitative Benchmark & Statistical Significance */}
      {(week >= 7 && week <= 9) && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Quantitative Benchmarking: Baseline vs Novel Architecture
                </h5>
                <p className="text-[11px] text-slate-500">
                  N = {sampleSize.toLocaleString()} requests • Tail latency quantiles with 95% Confidence Intervals
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                p &lt; 0.001 (Statistically Significant)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Baseline (User-Space gRPC)
                </span>
                <span className="text-2xl font-black font-mono text-slate-800 dark:text-slate-200">
                  {baselineP99} ms
                </span>
                <span className="text-[11px] text-slate-400 block">
                  p99 Latency (Heavy tail under network congestion)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/40 space-y-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                  Novel (eBPF Kernel Acceleration)
                </span>
                <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {novelP99} ms
                </span>
                <span className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 block">
                  39.3% Latency Reduction (Hypothesis Proven)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week 10 - 12: Viva Voce Oral Defense Simulator */}
      {week >= 10 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Viva Voce Oral Defense Simulation: Interrogation by {vivaQuestions[activeVivaQuestion].examiner}
                </h5>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Question {activeVivaQuestion + 1} of {vivaQuestions.length}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 italic">
                "{vivaQuestions[activeVivaQuestion].prompt}"
              </p>
            </div>

            <div className="space-y-2">
              {vivaQuestions[activeVivaQuestion].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerViva(idx)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs text-slate-700 dark:text-slate-200 cursor-pointer transition-all"
                >
                  <span className="font-bold mr-2 text-amber-600">[{String.fromCharCode(65 + idx)}]</span>
                  {opt}
                </button>
              ))}
            </div>

            {vivaFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  vivaFeedback.startsWith('✔')
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                }`}
              >
                {vivaFeedback}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import {
  GitBranch,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Table,
  Cpu,
  ArrowRight,
  TrendingUp,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface AlgorithmAnalysisLabProps {
  week: number;
}

export const AlgorithmAnalysisLab: React.FC<AlgorithmAnalysisLabProps> = ({ week }) => {
  const { awardXp } = useAppStore();

  // Master Theorem State
  const [paramA, setParamA] = useState(4);
  const [paramB, setParamB] = useState(2);
  const [fnExponent, setFnExponent] = useState(2); // f(n) = O(n^d)

  // 0/1 Knapsack Dynamic Programming State
  const knapsackCapacity = 7;
  const items = [
    { id: 1, name: 'Item 1', weight: 1, val: 1 },
    { id: 2, name: 'Item 2', weight: 3, val: 4 },
    { id: 3, name: 'Item 3', weight: 4, val: 5 },
    { id: 4, name: 'Item 4', weight: 5, val: 7 },
  ];
  const [activeCell, setActiveCell] = useState<{ i: number; w: number } | null>(null);

  // Dijkstra Shortest Path State
  const [dijkstraStep, setDijkstraStep] = useState(0);
  const [visitedNodes, setVisitedNodes] = useState<string[]>(['A']);
  const [distances, setDistances] = useState<Record<string, number>>({ A: 0, B: 4, C: 2, D: Infinity, E: Infinity });

  // Calculate Master Theorem Case
  const log_b_a = Math.log(paramA) / Math.log(paramB);
  let masterCase = '';
  let asymptoticComplexity = '';

  if (Math.abs(fnExponent - log_b_a) < 0.001) {
    masterCase = 'Case 2 (Balanced)';
    asymptoticComplexity = `Θ(n^${fnExponent} * log n)`;
  } else if (fnExponent < log_b_a) {
    masterCase = 'Case 1 (Leaf / Subproblem Heavy)';
    asymptoticComplexity = `Θ(n^${log_b_a.toFixed(2)})`;
  } else {
    masterCase = 'Case 3 (Root / Divide Work Heavy)';
    asymptoticComplexity = `Θ(n^${fnExponent})`;
  }

  // Precompute Knapsack DP table V[i, w]
  const dpTable: number[][] = [];
  for (let i = 0; i <= items.length; i++) {
    dpTable[i] = [];
    for (let w = 0; w <= knapsackCapacity; w++) {
      if (i === 0 || w === 0) {
        dpTable[i][w] = 0;
      } else {
        const item = items[i - 1];
        if (item.weight <= w) {
          dpTable[i][w] = Math.max(dpTable[i - 1][w], dpTable[i - 1][w - item.weight] + item.val);
        } else {
          dpTable[i][w] = dpTable[i - 1][w];
        }
      }
    }
  }

  const handleStepDijkstra = () => {
    sound.playClick();
    if (dijkstraStep === 0) {
      setDijkstraStep(1);
      setVisitedNodes(['A', 'C']);
      setDistances({ A: 0, B: 3, C: 2, D: 10, E: 7 }); // relax via C
      sound.playSuccess();
      awardXp(15, 'Relaxed edges out of lowest cost node C (dist=2)');
    } else if (dijkstraStep === 1) {
      setDijkstraStep(2);
      setVisitedNodes(['A', 'C', 'B']);
      setDistances({ A: 0, B: 3, C: 2, D: 8, E: 7 }); // relax via B
      sound.playSuccess();
      awardXp(20, 'Relaxed edges out of node B (dist=3), improved path to D');
    } else if (dijkstraStep === 2) {
      setDijkstraStep(3);
      setVisitedNodes(['A', 'C', 'B', 'E', 'D']);
      setDistances({ A: 0, B: 3, C: 2, D: 8, E: 6 });
      sound.playSuccess();
      awardXp(25, 'Completed Dijkstra SSSP tree. All shortest paths proven optimal.');
    }
  };

  const handleResetDijkstra = () => {
    sound.playClick();
    setDijkstraStep(0);
    setVisitedNodes(['A']);
    setDistances({ A: 0, B: 4, C: 2, D: Infinity, E: Infinity });
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              CSC2032 Algorithm Design & Analysis Interactive Workbench
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active Focus: Week {week} Asymptotic Complexity & Algorithmic Optimality Lab
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-bold border border-indigo-300 dark:border-indigo-700/60">
          20 Credits • Stage 2 Core
        </span>
      </div>

      {/* Week 1 - 3: Master Theorem Interactive Recurrence Solver */}
      {week <= 3 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-4">
            <div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Master Theorem Recurrence Solver: T(n) = a * T(n/b) + Θ(n^d)
              </h5>
              <p className="text-[11px] text-slate-500">
                Adjust subproblem branch factor (a), division factor (b), and polynomial combination work (d)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <label className="text-[11px] font-mono text-slate-500 block mb-1">
                  Subproblems (a): {paramA}
                </label>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={paramA}
                  onChange={(e) => setParamA(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <label className="text-[11px] font-mono text-slate-500 block mb-1">
                  Division Factor (b): {paramB}
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={paramB}
                  onChange={(e) => setParamB(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <label className="text-[11px] font-mono text-slate-500 block mb-1">
                  Combine Exponent (d): {fnExponent}
                </label>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={fnExponent}
                  onChange={(e) => setFnExponent(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold block">
                  Critical Exponent: log_{paramB}({paramA}) = {log_b_a.toFixed(3)} vs d = {fnExponent}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Identified Condition: {masterCase}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">TIGHT ASYMPTOTIC RUNTIME</span>
                <span className="text-base font-black font-mono text-indigo-700 dark:text-indigo-300">
                  {asymptoticComplexity}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week 4 - 6: 0/1 Knapsack Dynamic Programming Table */}
      {(week >= 4 && week <= 6) && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  0/1 Knapsack Dynamic Programming Matrix V[i, w] (Capacity W = {knapsackCapacity})
                </h5>
                <p className="text-[11px] text-slate-500">
                  Recurrence: V[i, w] = max(V[i-1, w], V[i-1, w - w_i] + v_i) • Optimal Value: {dpTable[4][7]}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                Optimal Value = £{dpTable[4][7]}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse text-center">
                <thead>
                  <tr className="bg-slate-200/60 dark:bg-slate-800">
                    <th className="p-2 border border-slate-300 dark:border-slate-700">i \ w</th>
                    {Array.from({ length: knapsackCapacity + 1 }).map((_, w) => (
                      <th key={w} className="p-2 border border-slate-300 dark:border-slate-700">
                        {w}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dpTable.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 font-bold bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700">
                        {i === 0 ? 'Base (0)' : `Item ${i} (w=${items[i - 1].weight}, v=${items[i - 1].val})`}
                      </td>
                      {row.map((val, w) => {
                        const isOptimal = i === 4 && w === 7;
                        const isSelected = activeCell?.i === i && activeCell?.w === w;

                        return (
                          <td
                            key={w}
                            onClick={() => setActiveCell({ i, w })}
                            className={`p-2 border border-slate-300 dark:border-slate-700 cursor-pointer transition-all ${
                              isOptimal
                                ? 'bg-amber-100 dark:bg-amber-950/60 font-black text-amber-800 dark:text-amber-200'
                                : isSelected
                                ? 'bg-indigo-100 dark:bg-indigo-950/60 font-bold text-indigo-700 dark:text-indigo-300'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Backtracking path: V[4,7]=9 → V[3,7]=9 (skip Item 4) → V[3,7]-v3=4 at w=3 → {`{Item 2, Item 3}`}
            </div>
          </div>
        </div>
      )}

      {/* Week 7 - 12: Dijkstra Shortest Path Interactive Solver */}
      {week >= 7 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Dijkstra Single-Source Shortest Path (Source Node: A)
                </h5>
                <p className="text-[11px] text-slate-500">
                  Priority Queue greedy relaxations • Min-heap step {dijkstraStep}/3
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStepDijkstra}
                  disabled={dijkstraStep >= 3}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Play className="w-3.5 h-3.5" />
                  Step Dijkstra PQ
                </button>
                <button
                  onClick={handleResetDijkstra}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 pt-2">
              {['A', 'B', 'C', 'D', 'E'].map((node) => {
                const isVisited = visitedNodes.includes(node);
                const dist = distances[node];

                return (
                  <div
                    key={node}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isVisited
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100 block">
                      Node {node}
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      dist = {dist === Infinity ? '∞' : dist}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider block mt-1 font-semibold text-slate-400">
                      {isVisited ? 'Settled' : 'In Queue'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


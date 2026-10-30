'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import {
  Code,
  Layers,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Database,
  Hash,
  Terminal,
  Cpu,
} from 'lucide-react';

interface ProgrammingPortfolioLabProps {
  week: number;
}

export const ProgrammingPortfolioLab: React.FC<ProgrammingPortfolioLabProps> = ({ week }) => {
  const { awardXp } = useAppStore();

  // Week 1-2: Heap Allocation & Defensive Copying
  const [useDefensiveCopy, setUseDefensiveCopy] = useState(false);
  const [leakedMutationOccurred, setLeakedMutationOccurred] = useState(false);

  // Week 5: SOLID Violations Refactor
  const [lspFixApplied, setLspFixApplied] = useState(false);

  // Week 6: JUnit 5 Test Runner
  const [junitOutput, setJunitOutput] = useState<string[]>([]);
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  // Week 7: Linked List In-Place Reversal
  const [listNodes, setListNodes] = useState<number[]>([10, 20, 30, 40, 50]);
  const [isReversed, setIsReversed] = useState(false);

  // Week 9: Hash Map Collision Simulator
  const [hashTableCapacity] = useState(7);
  const [insertedKeys, setInsertedKeys] = useState<number[]>([10, 17, 24]);
  const [inputKey, setInputKey] = useState<string>('31');
  const [collisionMethod, setCollisionMethod] = useState<'chaining' | 'probing'>('chaining');

  // Week 10: Binary Search Tree In-Order
  const [bstRoot] = useState({
    val: 50,
    left: { val: 30, left: { val: 20 }, right: { val: 40 } },
    right: { val: 70, left: { val: 60 }, right: { val: 80 } },
  });

  const handleTestEncapsulation = () => {
    sound.playClick();
    if (useDefensiveCopy) {
      setLeakedMutationOccurred(false);
      sound.playSuccess();
      awardXp(20, 'Protected class invariant via defensive copying');
    } else {
      setLeakedMutationOccurred(true);
      sound.playError();
    }
  };

  const handleRunJUnit = () => {
    sound.playClick();
    const logs = [
      '⚡ Initializing JUnit 5 Jupiter Test Engine...',
      '✔ testDefaultConstructor_InitializesEmptyList() ... PASSED (1.2ms)',
      '✔ testDefensiveCopying_PreservesEncapsulation() ... PASSED (0.8ms)',
      '✔ testLiskovSubstitution_DoesNotThrowUnsupportedOperation() ... PASSED (1.5ms)',
      '✔ testBoundaryCapacity_ExpandsUnderHighLoadFactor() ... PASSED (2.1ms)',
      '✔ testConcurrentAccess_ThrowsConcurrentModificationException() ... PASSED (1.9ms)',
      '-------------------------------------------------------',
      'BUILD SUCCESS: 5/5 tests passed in 7.5ms (100% assertions satisfied)',
    ];
    setJunitOutput(logs);
    setAllTestsPassed(true);
    sound.playSuccess();
    awardXp(30, 'Executed 100% green JUnit 5 regression test suite');
  };

  const handleReverseLinkedList = () => {
    sound.playClick();
    const reversed = [...listNodes].reverse();
    setListNodes(reversed);
    setIsReversed(!isReversed);
    sound.playSuccess();
    awardXp(25, 'Executed in-place O(n) linked list pointer reversal');
  };

  const handleInsertHashKey = () => {
    const k = parseInt(inputKey.trim(), 10);
    if (isNaN(k)) return;
    sound.playClick();
    if (!insertedKeys.includes(k)) {
      setInsertedKeys([...insertedKeys, k]);
      sound.playSuccess();
      awardXp(15, `Inserted key ${k} (hash code ${k % hashTableCapacity}) into Hash Table`);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              CSC1036 Programming Portfolio Interactive Workbench
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active Focus: Week {week} Software Engineering & Object Modeling Sandbox
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700/60">
          30 Credits • Stage 1 Core
        </span>
      </div>

      {/* Week 1 - 4: Heap Memory & Defensive Copying */}
      {week <= 4 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Encapsulation & Mutability Defense Check
              </span>
              <button
                onClick={() => setUseDefensiveCopy(!useDefensiveCopy)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold border cursor-pointer transition-all ${
                  useDefensiveCopy
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                }`}
              >
                {useDefensiveCopy ? '✓ Defensive Copying Active' : '⚠ Raw Reference Leaked'}
              </button>
            </div>

            <div className="font-mono text-xs bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto">
              <span className="text-slate-400">// Invariant: Account.transactions list must not be altered externally</span>
              <br />
              <span className="text-purple-400">public</span> List&lt;Transaction&gt; getTransactions() &#123;
              <br />
              &nbsp;&nbsp;{useDefensiveCopy ? (
                <span className="text-emerald-400">return Collections.unmodifiableList(this.transactions); // SAFE</span>
              ) : (
                <span className="text-rose-400">return this.transactions; // LEAKS MUTABLE REFERENCE</span>
              )}
              <br />
              &#125;
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleTestEncapsulation}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                Simulate Malicious External Mutation (`caller.getTransactions().clear()`)
              </button>

              {leakedMutationOccurred && (
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Class Invariant Violated! Balance zeroed out.
                </span>
              )}
              {!leakedMutationOccurred && useDefensiveCopy && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Invariant Protected! UnsupportedOperationException raised.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Week 5 - 6: JUnit 5 Test Harness */}
      {(week === 5 || week === 6) && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  JUnit 5 Automated Regression Test Suite
                </h5>
                <p className="text-[11px] text-slate-500">
                  Parameterized assertion validation across edge cases, invariants, and null safety
                </p>
              </div>
              <button
                onClick={handleRunJUnit}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <Terminal className="w-3.5 h-3.5" />
                Run `mvn test` Suite
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-slate-200 space-y-1 min-h-[120px]">
              {junitOutput.length === 0 ? (
                <div className="text-slate-500 flex items-center gap-2 pt-8 justify-center">
                  <Code className="w-4 h-4" /> Click "Run mvn test Suite" to execute automated grading assertions...
                </div>
              ) : (
                junitOutput.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line.includes('PASSED')
                        ? 'text-emerald-400'
                        : line.includes('BUILD SUCCESS')
                        ? 'text-emerald-300 font-bold pt-2'
                        : 'text-slate-300'
                    }
                  >
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Week 7 - 8: Linear Data Structures (Linked List Reversal) */}
      {(week === 7 || week === 8) && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Singly Linked List Dynamic Pointer Reversal
                </h5>
                <p className="text-[11px] text-slate-500">
                  Time Complexity: O(n) • Auxiliary Space: O(1) in-place reference swaps
                </p>
              </div>
              <button
                onClick={handleReverseLinkedList}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reverse List In-Place
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800/40">
                HEAD
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              {listNodes.map((val, idx) => (
                <React.Fragment key={idx}>
                  <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-emerald-500/60 shadow-sm text-center">
                    <span className="text-[10px] text-slate-400 font-mono block">Node[{idx}]</span>
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">{val}</span>
                  </div>
                  {idx < listNodes.length - 1 ? (
                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-mono text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
                        NULL
                      </span>
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Week 9 - 12: Hash Table Collisions & BST Operations */}
      {week >= 9 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Hash Table Collision Resolution Simulator (Capacity = {hashTableCapacity})
                </h5>
                <p className="text-[11px] text-slate-500">
                  Hash function: h(k) = k mod {hashTableCapacity}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-20 px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center"
                />
                <button
                  onClick={handleInsertHashKey}
                  className="px-3 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer"
                >
                  Insert Key
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2">
              {Array.from({ length: hashTableCapacity }).map((_, bucketIdx) => {
                const keysInBucket = insertedKeys.filter((k) => k % hashTableCapacity === bucketIdx);
                const hasCollision = keysInBucket.length > 1;

                return (
                  <div
                    key={bucketIdx}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      hasCollision
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/60'
                        : keysInBucket.length > 0
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400 block">[{bucketIdx}]</span>
                    {keysInBucket.length === 0 ? (
                      <span className="text-[11px] text-slate-400 italic">empty</span>
                    ) : (
                      <div className="space-y-1">
                        {keysInBucket.map((k) => (
                          <div
                            key={k}
                            className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 rounded py-0.5 border border-slate-200 dark:border-slate-700"
                          >
                            {k}
                          </div>
                        ))}
                      </div>
                    )}
                    {hasCollision && (
                      <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 block mt-1">
                        Collision!
                      </span>
                    )}
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


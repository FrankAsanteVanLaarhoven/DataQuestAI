'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import { dbSimulator } from '@/lib/db-engine';
import { voiceEngine } from '@/lib/voice-engine';
import {
  BookOpen,
  CheckCircle,
  Database,
  Search,
  Layers,
  Cpu,
  ArrowRight,
  Code2,
  Table,
  FileCode,
  Image as ImageIcon,
  Key,
  Link2,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Play,
  RotateCcw,
  Check,
  X,
  Award,
  Zap,
  HelpCircle,
  Share2,
  GraduationCap,
  Trophy,
  Lightbulb,
  Volume2,
  Square,
} from 'lucide-react';

import { SearchEngineLab } from './labs/SearchEngineLab';
import { QueryExpansionLab } from './labs/QueryExpansionLab';
import { SemanticWebLab } from './labs/SemanticWebLab';
import { MetadataLab } from './labs/MetadataLab';
import { FacetedSearchLab } from './labs/FacetedSearchLab';
import { CloudScalingLab } from './labs/CloudScalingLab';
import { VectorAiLab } from './labs/VectorAiLab';
import { DataEthicsLab } from './labs/DataEthicsLab';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const chapterQuizzes: Record<number, QuizQuestion> = {
  1: {
    question: 'Which of the following best describes semi-structured data?',
    options: [
      'A strict relational table with predefined column types',
      'Data with self-describing tags or keys like JSON or XML',
      'Unparsed raw video, audio, or photographic pixels',
      'A paper ledger stored in a physical filing cabinet',
    ],
    correctIndex: 1,
    explanation:
      'Semi-structured data contains internal markers/tags (like keys in JSON or elements in XML) without requiring a rigid tabular schema.',
  },
  2: {
    question: 'What is the purpose of a Foreign Key (FK) in relational modeling?',
    options: [
      'To encrypt table contents from unauthorized users',
      'To establish a referential relationship linking to a Primary Key in another table',
      'To speed up arithmetic calculations on numerical columns',
      'To make every row in the table strictly read-only',
    ],
    correctIndex: 1,
    explanation:
      'A Foreign Key enforces referential integrity by pointing to the Primary Key of another table, ensuring related rows remain synchronized.',
  },
  3: {
    question: 'What is the primary condition required to achieve Third Normal Form (3NF)?',
    options: [
      'The database must run on at least three physical server nodes',
      'Tables must be in 2NF and eliminate all transitive dependencies (no non-key attribute depends on another non-key attribute)',
      'Every column must store arrays of multiple values in one row',
      'All table names must be fewer than three characters long',
    ],
    correctIndex: 1,
    explanation:
      '3NF requires a table to be in 2NF and have zero transitive dependencies: every non-key column must depend solely on the primary key.',
  },
  4: {
    question: 'Why are B-Tree indexes preferred over sequential full-table scans in databases?',
    options: [
      'They reduce search time from O(N) linear scan to O(log N) tree navigation',
      'They prevent users from running SELECT queries on weekends',
      'They compress the entire database onto floppy disks',
      'They remove all rows that do not contain numbers',
    ],
    correctIndex: 0,
    explanation:
      'A B-Tree keeps sorted keys in balanced nodes, allowing searches, insertions, and range queries in logarithmic time O(log N).',
  },
  5: {
    question: 'In ACID properties, what does "Atomicity" guarantee?',
    options: [
      'Data will be stored on subatomic particles',
      'All statements in a transaction succeed together, or all changes roll back completely (All-or-Nothing)',
      'Multiple transactions can read uncommitted dirty data simultaneously',
      'Queries automatically translate between SQL and Python',
    ],
    correctIndex: 1,
    explanation:
      'Atomicity ensures a transaction is indivisible: either every change is committed permanently, or in case of failure, everything is aborted and rolled back.',
  },
  6: {
    question: 'According to the CAP Theorem, which two properties can a distributed database guarantee during a network partition (P)?',
    options: [
      'Both Consistency and Availability simultaneously with zero tradeoffs',
      'Either Consistency (CP) OR Availability (AP), but not both at the exact same moment',
      'Only Performance and Encryption',
      'Neither, distributed databases always shut down during partitions',
    ],
    correctIndex: 1,
    explanation:
      'When a network partition (P) occurs, a distributed system must choose between guaranteeing fresh consistent reads (C) or responding to all requests (A).',
  },
};

export const LearnRoadmap: React.FC = () => {
  const { awardXp, explanationMode, setExplanationMode, competencies } = useAppStore();
  const [activeStep, setActiveStep] = useState(1);
  const [dataInspectorFormat, setDataInspectorFormat] = useState<'structured' | 'semi' | 'unstructured'>('structured');
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM Students WHERE Class = '10A'");
  const [sqlResult, setSqlResult] = useState<any[]>(
    dbSimulator.getTable('Students').filter((s: any) => s.Class === '10A')
  );
  const [sqlMessage, setSqlMessage] = useState('Query OK, 1 row in set.');

  // Gamification Quiz State
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState<Record<number, boolean>>({});
  const [showCertificate, setShowCertificate] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  useEffect(() => {
    const unsub = voiceEngine.subscribe((st) => {
      if (!st.isSpeaking) {
        setSpeakingText(null);
      }
    });
    return unsub;
  }, []);

  const handleToggleSpeak = (text: string) => {
    if (speakingText === text) {
      voiceEngine.stop();
      setSpeakingText(null);
    } else {
      setSpeakingText(text);
      voiceEngine.speak(text, {
        onComplete: () => setSpeakingText(null),
      });
    }
  };

  const runSql = () => {
    const res = dbSimulator.executeCustomSql(sqlQuery);
    if (res.data) {
      setSqlResult(res.data);
    }
    setSqlMessage(res.message);
    awardXp(15, 'Executed interactive SQL in Learn Module');
    sound.playClick();
  };

  const handleAnswerQuiz = (chapterNum: number, optionIndex: number) => {
    const quiz = chapterQuizzes[chapterNum];
    if (!quiz) return;

    setUserAnswers((prev) => ({ ...prev, [chapterNum]: optionIndex }));

    if (optionIndex === quiz.correctIndex) {
      sound.playSuccess();
      if (!quizCompleted[chapterNum]) {
        awardXp(50, `Mastered Chapter ${chapterNum} Knowledge Check`);
        setQuizCompleted((prev) => ({ ...prev, [chapterNum]: true }));
      }
    } else {
      sound.playError();
    }
  };

  const totalQuizzesPassed = Object.values(quizCompleted).filter(Boolean).length;

  const roadmapSteps = [
    { num: 1, title: 'What Data Is', desc: 'How computers store & represent data' },
    { num: 2, title: 'Database Building Blocks', desc: 'Tables, keys, entities & relations' },
    { num: 3, title: 'Relational DBs & SQL', desc: 'Queries, DDL, DML & Normalisation' },
    { num: 4, title: 'Search & Retrieval', desc: 'Indexing, crawling & metadata' },
    { num: 5, title: 'OLTP vs OLAP & ACID', desc: 'Transactions vs Analytical warehouses' },
    { num: 6, title: 'Big Data, AI & Ethics', desc: 'NoSQL, Vector DBs & compliance' },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2 sm:p-4">
      {/* Course Hero Banner matching Image 2 & User Specs */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> End-to-End Database Course
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-slate-950" /> With Illustrations & Gamification
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            A Complete Database Course: End-to-End with Illustrations & Gamification
          </h1>
          <p className="mt-2 text-sm sm:text-base text-pink-100 font-medium leading-relaxed">
            CSC1033 Topics Made Simple: Master data architecture from first principles to enterprise production — structured grids, Entity–Relationship Diagrams (ERDs), Third Normal Form (3NF) normalisation, B-Tree indexes, ACID (Atomic, Consistent, Isolated, Durable) transactions, and Artificial Intelligence (AI) vector stores.
          </p>

          {/* Gamification Milestone Bar */}
          <div className="mt-5 p-3.5 bg-black/25 backdrop-blur-md border border-white/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md">
                <Trophy className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-amber-200">Course Mastery Status:</span>
                  <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-full">
                    {totalQuizzesPassed}/6 Chapters Mastered
                  </span>
                </div>
                <p className="text-[11px] text-pink-100">
                  Earn +50 XP per chapter quiz. Complete all 6 to claim your DataQuestAI Database Architecture Completion Certificate!
                </p>
              </div>
            </div>

            {totalQuizzesPassed === 6 ? (
              <button
                onClick={() => setShowCertificate(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 shrink-0"
              >
                <GraduationCap className="w-4 h-4" /> View Certificate
              </button>
            ) : (
              <span className="text-[11px] font-bold text-pink-200 self-center">
                {6 - totalQuizzesPassed} quizzes remaining
              </span>
            )}
          </div>
        </div>

        {/* Technical Architecture Overview Card */}
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 items-center gap-4">
          <div className="p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-center shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2 text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-pink-100 block">
              CURRICULUM SPEC
            </span>
            <span className="text-[9px] font-semibold text-amber-300 uppercase block tracking-wider mt-0.5">
              Aligned to CSC1033 Topics
            </span>
          </div>
        </div>
      </div>

      {/* Competence-Based Progression Ladder (Beyond XP) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm text-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-amber-400 flex items-center gap-1.5">
              👑 Competence-Based Mastery Ladder
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">
              Skill Proofs Required • Beyond Points
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Unlocked: <strong className="text-emerald-400 font-mono">{competencies.filter((c) => c.unlocked).length}</strong> / {competencies.length} Tiers
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {competencies.map((comp) => (
            <div
              key={comp.id}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col justify-between ${
                comp.unlocked
                  ? 'bg-slate-800/80 border-emerald-500/60 shadow-xs'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-60'
              }`}
              title={`Required Proof: ${comp.requiredSkillProof}`}
            >
              <div>
                <span className="text-xl block mb-1">{comp.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-wider block text-slate-400">
                  Tier {comp.tier}
                </span>
                <h4 className="text-[10px] font-black text-white leading-tight mt-0.5 truncate">
                  {comp.title}
                </h4>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-800 text-[9px]">
                {comp.unlocked ? (
                  <span className="text-emerald-400 font-bold">✓ PROVEN</span>
                ) : (
                  <span className="text-amber-400 font-mono">🔒 LOCKED</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap Navigation Steps Row */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            Interactive Learning Syllabus
          </h2>
          <span className="text-xs font-bold text-pink-600">Goal: Understand databases end-to-end</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {roadmapSteps.map((step) => {
            const isCurrent = activeStep === step.num;
            const isPassed = quizCompleted[step.num];
            return (
              <button
                key={step.num}
                onClick={() => {
                  setActiveStep(step.num);
                  awardXp(5, `Viewed Chapter ${step.num}`);
                }}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isCurrent
                    ? 'bg-pink-50 dark:bg-pink-950/60 border-pink-400 ring-2 ring-pink-400/30 shadow-xs'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      isPassed
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isPassed ? '✓' : step.num}
                  </div>
                  {isPassed && <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">+50 XP</span>}
                </div>
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                  {step.title}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                  {step.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chapter 1: What Is Data? */}
      {activeStep === 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-pink-600 uppercase tracking-widest">Chapter 1 • Illustrated</span>
              <span className="text-[10px] font-bold bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full">Foundation</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              1. What Is Data & How Computers Store It
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              From microscopic bits and bytes to high-performance relational tables and document hierarchies.
            </p>

            {/* Scientifically Clean Dual-Layer Data Definition */}
            <div className="mt-4 space-y-3">
              <div className="p-3.5 bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900 rounded-2xl space-y-2">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <p className="text-pink-950 dark:text-pink-100 font-medium">
                        <strong>Data</strong> means information that we record so that we can store it, study it, change it, or use it later.
                      </p>
                      <p className="text-pink-800 dark:text-pink-300 text-[11px]">
                        A computer normally represents digital data using tiny electrical or magnetic values called <strong>bits</strong>. A bit can have one of two values: <code className="bg-pink-100 dark:bg-pink-900 px-1 py-0.5 rounded font-mono">0</code> or <code className="bg-pink-100 dark:bg-pink-900 px-1 py-0.5 rounded font-mono">1</code>.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleSpeak("Data means information that we record so that we can store it, study it, change it, or use it later. A computer normally represents digital data using tiny values called bits. A bit can have one of two values: 0 or 1. Real-world fact: Frank's age 38 is recorded as data, stored in memory, and represented as bits 00100110.")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/60 dark:hover:bg-pink-800 text-pink-700 dark:text-pink-300 text-[10px] font-bold transition-all shrink-0 cursor-pointer shadow-xs"
                    title="Listen to conversational voice explanation"
                  >
                    {speakingText?.startsWith("Data means") ? (
                      <>
                        <Square className="w-2.5 h-2.5 fill-current" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Concrete Chain of Learning */}
                <div className="pt-2 border-t border-pink-200/60 dark:border-pink-900/60 flex items-center flex-wrap gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-pink-200 dark:border-pink-800">
                    Real-world fact: Frank&apos;s age
                  </span>
                  <span className="text-pink-500">↓</span>
                  <span className="px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-pink-200 dark:border-pink-800 font-mono text-pink-600">
                    Value: 38
                  </span>
                  <span className="text-pink-500">↓</span>
                  <span className="px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-pink-200 dark:border-pink-800 text-purple-600">
                    Recorded data
                  </span>
                  <span className="text-pink-500">↓</span>
                  <span className="px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-pink-200 dark:border-pink-800 text-indigo-600">
                    Stored in memory
                  </span>
                  <span className="text-pink-500">↓</span>
                  <span className="px-2 py-1 bg-slate-950 text-emerald-400 rounded-lg font-mono text-[10px]">
                    Bits: 00100110
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Visual Comparison of the 3 Data Forms with SVG Illustrations */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Illustrated Architecture: The Three Forms of Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setDataInspectorFormat('structured')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  dataInspectorFormat === 'structured'
                    ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/30 ring-2 ring-pink-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-pink-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600">
                    <Table className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Structured Data</h4>
                    <span className="text-[10px] text-pink-600 font-bold">Relational Tables &amp; Structured Query Language (SQL)</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  Strict tabular schemas. Every record follows exact column data types and predefined integrity constraints.
                </p>

                {/* SVG Illustration: Relational Grid */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10px]">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-700 text-pink-400 font-bold">
                    <span>ID: INT</span>
                    <span>NAME: VARCHAR</span>
                    <span>XP: INT</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold">101</span>
                      <span>Alex Mercer</span>
                      <span className="text-emerald-400">2,350</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold">102</span>
                      <span>Elena Vance</span>
                      <span className="text-emerald-400">1,820</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setDataInspectorFormat('semi')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  dataInspectorFormat === 'semi'
                    ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 ring-2 ring-purple-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Semi-Structured Data</h4>
                    <span className="text-[10px] text-purple-600 font-bold">JSON, YAML, XML Hierarchies</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  Self-describing hierarchies (JavaScript Object Notation / Extensible Markup Language). Flexible keys where each item can possess different properties without schema migrations.
                </p>

                {/* SVG Illustration: JSON Tree */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10px] text-purple-300">
                  <div>{'{'}</div>
                  <div className="pl-2">
                    <span className="text-pink-400">&quot;user&quot;</span>: <span className="text-emerald-400">&quot;Alex&quot;</span>,
                  </div>
                  <div className="pl-2">
                    <span className="text-pink-400">&quot;skills&quot;</span>: [<span className="text-amber-300">&quot;SQL&quot;</span>, <span className="text-amber-300">&quot;ERD&quot;</span>]
                  </div>
                  <div>{'}'}</div>
                </div>
              </div>

              <div
                onClick={() => setDataInspectorFormat('unstructured')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  dataInspectorFormat === 'unstructured'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Unstructured Data</h4>
                    <span className="text-[10px] text-blue-600 font-bold">Blobs, Audio, Embeddings</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  No predefined conceptual model. Requires full-text indexing, vector search, or object stores (S3, GCS).
                </p>

                {/* SVG Illustration: Vector Embedding */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10px] text-blue-300 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span>768-dim Vector:</span>
                  </div>
                  <span className="text-slate-400">[0.24, -0.81, 0.95...]</span>
                </div>
              </div>
            </div>
          </div>

          {/* Illustrated Storage Tier Hierarchy Diagram */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" /> Illustrated Storage Hierarchy: Latency & Permanence
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-pink-200 dark:border-pink-900/60 text-center">
                <span className="text-[10px] font-extrabold uppercase text-pink-600 block">CPU Registers / L1</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">&lt; 1 ns</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Volatile • Fastest</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 text-center">
                <span className="text-[10px] font-extrabold uppercase text-purple-600 block">RAM (In-Memory)</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">~ 100 ns</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Redis / SQLite cache</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 text-center">
                <span className="text-[10px] font-extrabold uppercase text-blue-600 block">NVMe SSD</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">~ 100 μs</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Persistent disk I/O</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 text-center">
                <span className="text-[10px] font-extrabold uppercase text-amber-600 block">Cloud Cold Store</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">~ 10-100 ms</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Long-term lakehouse</span>
              </div>
            </div>
          </div>

          {/* Gamified Knowledge Check Quiz */}
          <QuizCheckpoint
            chapterNum={1}
            quiz={chapterQuizzes[1]}
            userAnswer={userAnswers[1]}
            isCompleted={!!quizCompleted[1]}
            onAnswer={(idx) => handleAnswerQuiz(1, idx)}
          />
        </div>
      )}

      {/* Chapter 2: Database Building Blocks & ERD Modeling */}
      {activeStep === 2 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-pink-600 uppercase tracking-widest">Chapter 2 • Illustrated</span>
              <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">ERD Modeling</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              2. Database Building Blocks: Tables, Keys, Entities & Relations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              How conceptual models become physical tables, and how Primary and Foreign Keys enforce referential integrity.
            </p>
          </div>

          {/* Illustrated ERD Diagram: Students -> Borrowing -> Books */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black tracking-wider uppercase text-pink-400 flex items-center gap-1.5">
                <Database className="w-4 h-4" /> Illustrated Relational Crow&apos;s Foot ERD Diagram
              </h3>
              <span className="text-[10px] font-bold bg-pink-950 text-pink-300 border border-pink-800 px-2 py-0.5 rounded-full">
                Many-to-Many via Junction Table
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Entity: Students */}
              <div className="bg-slate-900/90 rounded-2xl border-2 border-pink-500/80 p-3 shadow-lg">
                <div className="bg-pink-600 text-white font-extrabold text-xs px-3 py-1 rounded-lg text-center mb-2 flex items-center justify-between">
                  <span>Students (Entity)</span>
                  <span className="text-[9px] bg-pink-700 px-1.5 py-0.2 rounded">1</span>
                </div>
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between bg-pink-950/40 p-1.5 rounded text-pink-300 font-bold border border-pink-900/50">
                    <span className="flex items-center gap-1.5"><Key className="w-3 h-3 text-amber-400" /> StudentID</span>
                    <span className="text-slate-400">PK (INT)</span>
                  </div>
                  <div className="flex items-center justify-between p-1 text-slate-300">
                    <span>Name</span>
                    <span className="text-slate-500">VARCHAR(50)</span>
                  </div>
                  <div className="flex items-center justify-between p-1 text-slate-300">
                    <span>Email</span>
                    <span className="text-slate-500">VARCHAR(100)</span>
                  </div>
                </div>
              </div>

              {/* Junction Table: Borrowing with Crow's foot connectors */}
              <div className="bg-slate-900/90 rounded-2xl border-2 border-purple-500/80 p-3 shadow-lg relative">
                <div className="bg-purple-600 text-white font-extrabold text-xs px-3 py-1 rounded-lg text-center mb-2 flex items-center justify-between">
                  <span>Borrowing (Junction)</span>
                  <span className="text-[9px] bg-purple-700 px-1.5 py-0.2 rounded">N</span>
                </div>
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between bg-purple-950/40 p-1.5 rounded text-purple-300 font-bold border border-purple-900/50">
                    <span className="flex items-center gap-1.5"><Key className="w-3 h-3 text-amber-400" /> BorrowID</span>
                    <span className="text-slate-400">PK (INT)</span>
                  </div>
                  <div className="flex items-center justify-between bg-pink-950/30 p-1 text-pink-300 font-semibold border-b border-slate-800">
                    <span className="flex items-center gap-1.5"><Link2 className="w-3 h-3 text-pink-400" /> StudentID</span>
                    <span className="text-pink-400">FK (Students)</span>
                  </div>
                  <div className="flex items-center justify-between bg-indigo-950/30 p-1 text-indigo-300 font-semibold border-b border-slate-800">
                    <span className="flex items-center gap-1.5"><Link2 className="w-3 h-3 text-indigo-400" /> BookID</span>
                    <span className="text-indigo-400">FK (Books)</span>
                  </div>
                  <div className="flex items-center justify-between p-1 text-slate-300">
                    <span>LoanDate</span>
                    <span className="text-slate-500">DATE</span>
                  </div>
                </div>
              </div>

              {/* Entity: Books */}
              <div className="bg-slate-900/90 rounded-2xl border-2 border-indigo-500/80 p-3 shadow-lg">
                <div className="bg-indigo-600 text-white font-extrabold text-xs px-3 py-1 rounded-lg text-center mb-2 flex items-center justify-between">
                  <span>Books (Entity)</span>
                  <span className="text-[9px] bg-indigo-700 px-1.5 py-0.2 rounded">1</span>
                </div>
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between bg-indigo-950/40 p-1.5 rounded text-indigo-300 font-bold border border-indigo-900/50">
                    <span className="flex items-center gap-1.5"><Key className="w-3 h-3 text-amber-400" /> BookID</span>
                    <span className="text-slate-400">PK (INT)</span>
                  </div>
                  <div className="flex items-center justify-between p-1 text-slate-300">
                    <span>Title</span>
                    <span className="text-slate-500">VARCHAR(120)</span>
                  </div>
                  <div className="flex items-center justify-between p-1 text-slate-300">
                    <span>ISBN</span>
                    <span className="text-slate-500">VARCHAR(20)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-800 flex items-center justify-center gap-2">
              <span className="text-pink-400">1 Student</span> can borrow <span className="text-purple-400">Many Books</span> through the junction table without data redundancy.
            </div>

            {/* Dual-Layer Concept Explainer: Simple Mode vs Engineer Mode */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Dual-Layer Learning Explainer
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const text =
                        explanationMode === 'simple'
                          ? "A Primary Key is a value that uniquely identifies one row. Think of it like a student's unique school number. A Foreign Key is a link in one table that points to the Primary Key in another table. Think of it like writing your student number on your library book loan."
                          : "A Primary Key is a candidate key selected to enforce entity integrity and uniquely identify tuples within a relation. A Foreign Key is a referential constraint referencing a candidate key in a parent relation, enforcing relational integrity across tables.";
                      handleToggleSpeak(text);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-900/60 hover:bg-pink-800 text-pink-300 text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                    title="Listen to conversational explanation"
                  >
                    {speakingText?.startsWith("A Primary Key") ? (
                      <>
                        <Square className="w-2.5 h-2.5 fill-current" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px]">
                    <button
                      onClick={() => setExplanationMode('simple')}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                        explanationMode === 'simple'
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🧸 Simple Mode
                    </button>
                    <button
                      onClick={() => setExplanationMode('engineer')}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                        explanationMode === 'engineer'
                          ? 'bg-indigo-500 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚙️ Engineer Mode
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Primary Key Concept */}
                <div className={`p-3.5 rounded-xl border transition-all ${
                  explanationMode === 'simple'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-indigo-950/30 border-indigo-500/40 text-indigo-200'
                }`}>
                  <span className="text-[10px] font-black uppercase tracking-wider block mb-1">
                    {explanationMode === 'simple' ? '🧸 Primary Key (Simple)' : '⚙️ Primary Key (Formal CS)'}
                  </span>
                  <p className="text-xs leading-relaxed">
                    {explanationMode === 'simple'
                      ? '“A Primary Key is a value that uniquely identifies one row. Think of it like a student\'s unique school number.”'
                      : '“A Primary Key is a candidate key selected to enforce entity integrity and uniquely identify tuples within a relation.”'}
                  </p>
                </div>

                {/* Foreign Key Concept */}
                <div className={`p-3.5 rounded-xl border transition-all ${
                  explanationMode === 'simple'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-indigo-950/30 border-indigo-500/40 text-indigo-200'
                }`}>
                  <span className="text-[10px] font-black uppercase tracking-wider block mb-1">
                    {explanationMode === 'simple' ? '🧸 Foreign Key (Simple)' : '⚙️ Foreign Key (Formal CS)'}
                  </span>
                  <p className="text-xs leading-relaxed">
                    {explanationMode === 'simple'
                      ? '“A Foreign Key is a link in one table that points to the Primary Key in another table. Think of it like writing your student number on your library book loan.”'
                      : '“A Foreign Key is a referential constraint referencing a candidate key in a parent relation, enforcing relational integrity across tables.”'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gamified Knowledge Check Quiz */}
          <QuizCheckpoint
            chapterNum={2}
            quiz={chapterQuizzes[2]}
            userAnswer={userAnswers[2]}
            isCompleted={!!quizCompleted[2]}
            onAnswer={(idx) => handleAnswerQuiz(2, idx)}
          />
        </div>
      )}

      {/* Chapter 3: Relational DBs, SQL & Normalization */}
      {activeStep === 3 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-pink-600 uppercase tracking-widest">Chapter 3 • Illustrated</span>
              <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">SQL & Normalisation</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              3. Relational Databases, SQL Mastery & 3NF Normalisation
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Learn DDL, DML, relational calculus, and how normalisation eliminates insertion, update, and deletion anomalies.
            </p>
          </div>

          {/* Illustrated Step-by-Step Normalisation Infographic */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-violet-500 shrink-0" /> Illustrated Normalisation Pipeline: 1NF → 2NF → 3NF
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-pink-200 dark:border-pink-900 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 block mb-1">
                  1. First Normal Form (1NF)
                </span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Atomic Values &amp; Primary Key</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  No multi-valued cells. Each table cell contains exactly one scalar value; duplicate rows disallowed.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block mb-1">
                  2. Second Normal Form (2NF)
                </span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">No Partial Dependencies</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Must be in 1NF and all non-key columns must depend on the whole composite primary key, not a partial piece.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block mb-1">
                  3. Third Normal Form (3NF)
                </span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">No Transitive Dependencies</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Must be in 2NF and non-key attributes must never depend on other non-key attributes (e.g. ZipCode determining City).
                </p>
              </div>
            </div>
          </div>

          {/* Interactive SQL Terminal Sandbox with Real SQLite Engine */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-xl text-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-bold text-slate-300">Live SQL Lab Sandbox (In-Memory AST Relational Engine)</span>
              </div>
              <button
                onClick={runSql}
                className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white rounded-lg text-xs font-black shadow-xs cursor-pointer"
              >
                <Play className="w-3 h-3" />
                Execute Query (+15 XP)
              </button>
            </div>

            <textarea
              rows={2}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full bg-slate-900 text-pink-300 font-mono text-xs p-2.5 rounded-xl border border-slate-800 outline-hidden focus:border-pink-500"
            />

            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span>Result Table:</span>
                <span className="text-emerald-400 font-mono">{sqlMessage}</span>
              </div>

              {sqlResult.length > 0 ? (
                <div className="overflow-x-auto max-h-40">
                  <table className="w-full text-[11px] text-left font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-pink-400">
                        {Object.keys(sqlResult[0]).map((k) => (
                          <th key={k} className="p-1.5">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sqlResult.map((row, idx) => (
                        <tr key={idx} className="border-b border-slate-900/60 hover:bg-slate-900">
                          {Object.values(row).map((v: any, i) => (
                            <td key={i} className="p-1.5 text-slate-200">{String(v)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500 text-xs italic">No rows returned.</p>
              )}
            </div>
          </div>

          {/* Gamified Knowledge Check Quiz */}
          <QuizCheckpoint
            chapterNum={3}
            quiz={chapterQuizzes[3]}
            userAnswer={userAnswers[3]}
            isCompleted={!!quizCompleted[3]}
            onAnswer={(idx) => handleAnswerQuiz(3, idx)}
          />
        </div>
      )}

      {/* Chapter 4: Search & Information Retrieval */}
      {activeStep === 4 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-pink-600 uppercase tracking-widest">Chapter 4 • Illustrated</span>
              <span className="text-[10px] font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded-full">Indexing & Retrieval</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              4. Search Systems, B-Tree Indexes & Information Retrieval
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Why sequential scans become bottlenecks at scale and how B-Trees and Inverted Indexes deliver sub-millisecond lookups.
            </p>
          </div>

          {/* Illustrated B-Tree Index Hierarchy Diagram */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Search className="w-4 h-4" /> Illustrated B-Tree Index Structure (O(log N) Search)
            </h3>

            <div className="flex flex-col items-center gap-4 py-2">
              {/* Root Node */}
              <div className="p-2.5 rounded-xl bg-pink-950/80 border-2 border-pink-500 text-center font-mono text-xs shadow-md">
                <span className="text-[9px] uppercase font-bold text-pink-400 block mb-0.5">Root Node (Page 1)</span>
                <span className="text-white font-bold">[ 50 | 100 ]</span>
              </div>

              {/* Connecting Lines */}
              <div className="flex items-center justify-around w-full max-w-md text-slate-500 text-xs">
                <span>↙ (&lt;50)</span>
                <span>↓ (50..100)</span>
                <span>↘ (&gt;100)</span>
              </div>

              {/* Internal Branch Nodes */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-xl text-center font-mono text-[11px]">
                <div className="p-2 rounded-xl bg-purple-950/70 border border-purple-500">
                  <span className="text-[8px] text-purple-300 block">Branch 1</span>
                  <span>[ 20 | 35 ]</span>
                </div>
                <div className="p-2 rounded-xl bg-purple-950/70 border border-purple-500">
                  <span className="text-[8px] text-purple-300 block">Branch 2</span>
                  <span>[ 65 | 80 ]</span>
                </div>
                <div className="p-2 rounded-xl bg-purple-950/70 border border-purple-500">
                  <span className="text-[8px] text-purple-300 block">Branch 3</span>
                  <span>[ 120 | 150 ]</span>
                </div>
              </div>

              {/* Leaf Nodes holding Disk Pointers */}
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-700 w-full max-w-xl text-center text-[10px] text-slate-300">
                Leaf Nodes contain contiguous disk block pointers: <code className="text-emerald-400 font-bold">Disk Block #0x4A7</code>. Navigates 1,000,000 rows in just 3 disk seeks!
              </div>
            </div>
          </div>

          {/* Inverted Index Demonstration */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-sky-500 shrink-0" /> Inverted Index for Full-Text Search
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Google, Elasticsearch, and Lucene flip documents inside-out. Instead of scanning files, they maintain an inverted dictionary of tokens pointing to posting lists:
            </p>
            <div className="p-3 bg-slate-950 text-cyan-300 font-mono text-xs rounded-xl overflow-x-auto">
              <div>&quot;relational&quot;  ➔ [ Doc #10 (freq: 4), Doc #42 (freq: 1) ]</div>
              <div>&quot;transactions&quot;➔ [ Doc #12 (freq: 8), Doc #10 (freq: 2) ]</div>
              <div>&quot;normalisation&quot;➔ [ Doc #03 (freq: 5), Doc #42 (freq: 3) ]</div>
            </div>
          </div>

          {/* Interactive Search Engine Laboratory */}
          <SearchEngineLab />

          {/* Interactive Query Expansion Laboratory */}
          <QueryExpansionLab />

          {/* Interactive Semantic Web & Linked Data Laboratory */}
          <SemanticWebLab />

          {/* Interactive Metadata Architecture Laboratory */}
          <MetadataLab />

          {/* Interactive Faceted Search Laboratory */}
          <FacetedSearchLab />

          {/* Gamified Knowledge Check Quiz */}
          <QuizCheckpoint
            chapterNum={4}
            quiz={chapterQuizzes[4]}
            userAnswer={userAnswers[4]}
            isCompleted={!!quizCompleted[4]}
            onAnswer={(idx) => handleAnswerQuiz(4, idx)}
          />
        </div>
      )}

      {/* Chapter 5: OLTP vs OLAP & ACID Guarantees */}
      {activeStep === 5 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-pink-600 uppercase tracking-widest">Chapter 5 • Illustrated</span>
              <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">ACID & Storage Formats</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              5. Transactions, ACID Guarantees & OLTP vs OLAP Architectures
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              How financial systems guarantee zero lost transactions, and why analytical systems store data in columns instead of rows.
            </p>
          </div>

          {/* Illustrated ACID 4-Quadrant Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900">
              <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center font-black text-sm mb-2 shadow-sm">
                A
              </div>
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Atomicity</h4>
              <span className="text-[10px] font-bold text-pink-600">All-or-Nothing</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                If money leaves Account A but fails before entering Account B, the entire transaction is automatically rolled back.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900">
              <div className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center font-black text-sm mb-2 shadow-sm">
                C
              </div>
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Consistency</h4>
              <span className="text-[10px] font-bold text-purple-600">State Integrity</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Database transitions only from one valid state to another, strictly adhering to foreign keys, unique rules, and CHECK constraints.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
              <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black text-sm mb-2 shadow-sm">
                I
              </div>
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Isolation</h4>
              <span className="text-[10px] font-bold text-indigo-600">Concurrency Control</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Transactions execute concurrently without interfering. Avoids dirty reads and phantom reads using MVCC snapshots and locks.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm mb-2 shadow-sm">
                D
              </div>
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">Durability</h4>
              <span className="text-[10px] font-bold text-emerald-600">Crash Resilience</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Once committed, changes survive catastrophic server crashes and power outages via Write-Ahead Logs (WAL) flushed to disk.
              </p>
            </div>
          </div>

          {/* Row-Store vs Columnar-Store Comparison Illustration */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-700 dark:text-slate-200">
              Illustrated Storage Formats: Row-Store (OLTP) vs Columnar-Store (OLAP)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-pink-200 dark:border-pink-900">
                <span className="text-[10px] font-black uppercase text-pink-600 block mb-1">Row-Store (PostgreSQL, SQLite, MySQL)</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 mb-1">Row-Contiguous on Disk</p>
                <div className="p-2 bg-slate-950 text-pink-300 font-mono text-[10px] rounded-lg">
                  [Row1: ID, Name, Total] [Row2: ID, Name, Total]
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  Best for: Real-time user signups, shopping carts, single-record updates.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900">
                <span className="text-[10px] font-black uppercase text-purple-600 block mb-1">Column-Store (Snowflake, BigQuery, ClickHouse)</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 mb-1">Column-Contiguous on Disk</p>
                <div className="p-2 bg-slate-950 text-purple-300 font-mono text-[10px] rounded-lg">
                  [Column_Total: $10, $25, $80...] [Column_ID: 1, 2, 3...]
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  Best for: Calculating SUM() or AVG() across 500,000,000 rows in seconds with 90% compression.
                </p>
              </div>
            </div>
          </div>

          {/* Gamified Knowledge Check Quiz */}
          <QuizCheckpoint
            chapterNum={5}
            quiz={chapterQuizzes[5]}
            userAnswer={userAnswers[5]}
            isCompleted={!!quizCompleted[5]}
            onAnswer={(idx) => handleAnswerQuiz(5, idx)}
          />
        </div>
      )}

      {/* Chapter 6: Big Data, Vector DBs & Ethics */}
      {activeStep === 6 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-pink-600 uppercase tracking-widest">Chapter 6 • Illustrated</span>
              <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">Modern Horizons</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
              6. Big Data, NoSQL, AI Vector Databases & Enterprise Ethics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              How distributed clusters survive scale, how LLMs query embeddings, and the moral & legal duties of data architects.
            </p>
          </div>

          {/* Illustrated CAP Theorem Triangle */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-pink-400 shrink-0" /> Illustrated CAP Theorem Model
              </h3>
              <span className="text-[10px] font-bold bg-pink-950 text-pink-300 border border-pink-800 px-2 py-0.5 rounded-full">
                Choose Any 2
              </span>
            </div>

            <div className="relative flex flex-col items-center py-4">
              {/* Consistency Vertex */}
              <div className="p-2.5 rounded-xl bg-pink-900/60 border border-pink-400 text-center font-mono text-xs w-48 shadow-lg">
                <span className="font-extrabold text-pink-300 block">Consistency (C)</span>
                <span className="text-[10px] text-slate-300">Every read receives latest write</span>
              </div>

              {/* Triangle Body */}
              <div className="flex items-center justify-between w-full max-w-md my-4 px-4 text-xs font-mono text-slate-400">
                <span className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-pink-300">
                  CP: MongoDB, Spanner
                </span>
                <span className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-amber-300">
                  AP: Cassandra, Dynamo
                </span>
              </div>

              {/* Base Vertices */}
              <div className="flex items-center justify-between w-full max-w-lg gap-4">
                <div className="p-2.5 rounded-xl bg-purple-900/60 border border-purple-400 text-center font-mono text-xs flex-1">
                  <span className="font-extrabold text-purple-300 block">Availability (A)</span>
                  <span className="text-[10px] text-slate-300">Non-blocking responses</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-900/60 border border-blue-400 text-center font-mono text-xs flex-1">
                  <span className="font-extrabold text-blue-300 block">Partition Tolerance (P)</span>
                  <span className="text-[10px] text-slate-300">Survives dropped network packets</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Vector Embeddings & Ethics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-2">
                <Cpu className="w-3.5 h-3.5 text-violet-500 shrink-0" /> AI Vector Databases (RAG)
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                Modern AI apps embed unstructured sentences into high-dimensional vectors. Databases like Pinecone, pgvector, and Milvus compute <strong>Cosine Similarity</strong> to retrieve context for LLMs:
              </p>
              <div className="p-2.5 bg-slate-950 text-cyan-300 font-mono text-[10px] rounded-xl">
                CosineSim(q, doc) = (q · doc) / (||q|| * ||doc||)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Data Ethics &amp; Compliance (GDPR)
              </h4>
              <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5">
                <li>• <strong>Right to Erasure:</strong> Architect pipelines that cascade soft-deletes to hard-deletes.</li>
                <li>• <strong>Data Minimisation:</strong> Store only what is required to serve the request.</li>
                <li>• <strong>Encryption at Rest &amp; Transit:</strong> AES-256 for storage tables and TLS 1.3 for network wires.</li>
              </ul>
            </div>
          </div>

          {/* Cloud Computing Scalability Simulation */}
          <CloudScalingLab />

          {/* AI Vector Database & RAG Failure Diagnosis */}
          <VectorAiLab />

          {/* Consequential Data Ethics & GDPR Minimisation */}
          <DataEthicsLab />

          {/* Gamified Knowledge Check Quiz */}
          <QuizCheckpoint
            chapterNum={6}
            quiz={chapterQuizzes[6]}
            userAnswer={userAnswers[6]}
            isCompleted={!!quizCompleted[6]}
            onAnswer={(idx) => handleAnswerQuiz(6, idx)}
          />
        </div>
      )}

      {/* Course Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center relative shadow-2xl">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white flex items-center justify-center text-3xl mx-auto shadow-lg mb-3">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Certificate of Completion
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              DataQuestAI Database Architecture Completion Certificate
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Awarded for mastering all 6 chapters of the End-to-End Database Course with Illustrations and Gamification.
            </p>

            <div className="my-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs font-mono text-amber-900 dark:text-amber-200">
              <div>Credential ID: DQ-ARCH-{Date.now().toString(36).toUpperCase()}</div>
              <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-1">
                Verified Skills: ERD Modeling • 3NF Normalization • B-Trees • ACID • CAP Theorem
              </div>
            </div>

            <button
              onClick={() => setShowCertificate(false)}
              className="w-full py-2.5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:opacity-95 transition-all"
            >
              Awesome, Continue Exploring!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Gamified Quiz Checkpoint Component
interface QuizCheckpointProps {
  chapterNum: number;
  quiz: QuizQuestion;
  userAnswer?: number;
  isCompleted: boolean;
  onAnswer: (idx: number) => void;
}

const QuizCheckpoint: React.FC<QuizCheckpointProps> = ({
  chapterNum,
  quiz,
  userAnswer,
  isCompleted,
  onAnswer,
}) => {
  const isAnswered = userAnswer !== undefined;
  const isCorrect = isAnswered && userAnswer === quiz.correctIndex;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50/70 to-purple-50/70 dark:from-pink-950/20 dark:to-purple-950/20 border-2 border-pink-300 dark:border-pink-900/60 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-pink-500 text-white">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
              Chapter {chapterNum} Knowledge Check (Gamified Quiz)
            </h4>
            <span className="text-[10px] font-bold text-pink-600">Earn +50 XP on correct answer</span>
          </div>
        </div>
        {isCompleted && (
          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-300">
            <Check className="w-3 h-3" /> Mastered (+50 XP)
          </span>
        )}
      </div>

      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
        {quiz.question}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {quiz.options.map((opt, idx) => {
          const isSelected = userAnswer === idx;
          let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-pink-400';

          if (isAnswered) {
            if (idx === quiz.correctIndex) {
              btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold ring-2 ring-emerald-400/30';
            } else if (isSelected) {
              btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => onAnswer(idx)}
              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2 cursor-pointer ${btnStyle}`}
            >
              <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="leading-snug">{opt}</span>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div
          className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
            isCorrect
              ? 'bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              : 'bg-rose-100/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
          }`}
        >
          {isCorrect ? <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
          <div>
            <p className="font-bold">{isCorrect ? 'Correct! +50 XP Awarded' : 'Not quite. Try reviewing the explanation below:'}</p>
            <p className="text-[11px] mt-0.5">{quiz.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

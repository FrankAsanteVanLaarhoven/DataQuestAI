'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import { dbSimulator } from '@/lib/db-engine';
import { voiceEngine } from '@/lib/voice-engine';
import {
  CSC1033_WEEKS,
  WeekCurriculum,
  CANVAS_COURSE_METADATA,
  CANVAS_MODULES_70330,
  CanvasModuleTopic,
  CanvasItem,
  EXAM_QUESTIONS_70330,
} from '@/lib/csc1033-curriculum';
import {
  CSC1032_WEEKS,
  CANVAS_COURSE_METADATA_1032,
  CANVAS_MODULES_1032,
  EXAM_QUESTIONS_1032,
} from '@/lib/csc1032-curriculum';
import {
  BSC_COURSES,
  BSC_COURSE_LIST,
  getBscCourse,
  BscModuleCode,
} from '@/lib/bsc-courses';
import { SecureProgrammingLab } from './labs/SecureProgrammingLab';
import { SystemsImplementationLab } from './labs/SystemsImplementationLab';
import { SoftwareEngineeringLab } from './labs/SoftwareEngineeringLab';
import { DevOpsOperationsLab } from './labs/DevOpsOperationsLab';
import { ProgrammingPortfolioLab } from './labs/ProgrammingPortfolioLab';
import { AlgorithmAnalysisLab } from './labs/AlgorithmAnalysisLab';
import { DissertationStudioLab } from './labs/DissertationStudioLab';
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
  GraduationCap,
  Trophy,
  Lightbulb,
  Volume2,
  Square,
  Bookmark,
  Calendar,
  Shield,
  Activity,
  CheckCircle2,
  Terminal,
  ExternalLink,
  MapPin,
  Mail,
  Filter,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { SearchEngineLab } from './labs/SearchEngineLab';
import { QueryExpansionLab } from './labs/QueryExpansionLab';
import { SemanticWebLab } from './labs/SemanticWebLab';
import { MetadataLab } from './labs/MetadataLab';
import { FacetedSearchLab } from './labs/FacetedSearchLab';
import { CloudScalingLab } from './labs/CloudScalingLab';
import { VectorAiLab } from './labs/VectorAiLab';
import { DataEthicsLab } from './labs/DataEthicsLab';
import { ComputerSystemsLab } from './labs/ComputerSystemsLab';

export const LearnRoadmap: React.FC = () => {
  const {
    awardXp,
    explanationMode,
    setExplanationMode,
    competencies,
    user,
    activeModuleCode,
    setActiveModuleCode,
  } = useAppStore();
  const [activeWeek, setActiveWeek] = useState(1);
  const [dataInspectorFormat, setDataInspectorFormat] = useState<'structured' | 'semi' | 'unstructured'>('structured');
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM Students WHERE Class = '10A'");
  const [sqlResult, setSqlResult] = useState<any[]>(
    dbSimulator.getTable('Students').filter((s: any) => s.Class === '10A')
  );
  const [sqlMessage, setSqlMessage] = useState('Query OK, 1 row in set.');

  // Week 3 Relational Algebra Operator Selection
  const [relAlgebraOp, setRelAlgebraOp] = useState<'select' | 'project' | 'product'>('select');

  // Week 8 Transaction Simulation State
  const [accountABalance, setAccountABalance] = useState(1000);
  const [accountBBalance, setAccountBBalance] = useState(250);
  const [transferAmount, setTransferAmount] = useState(200);
  const [simulateCrash, setSimulateCrash] = useState(false);
  const [txnStatus, setTxnStatus] = useState<string | null>(null);

  // Gamification Quiz State across 12 Weeks (scoped by module)
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizCompleted, setQuizCompleted] = useState<Record<string, boolean>>({});
  const [showCertificate, setShowCertificate] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // Newcastle Canvas Course 70330 Navigation & Assessment States
  const [curriculumTab, setCurriculumTab] = useState<'weeks' | 'canvas' | 'assessment'>('weeks');
  const [canvasSemesterFilter, setCanvasSemesterFilter] = useState<'all' | '1' | '2' | 'assess'>('all');
  const [expandedCanvasModule, setExpandedCanvasModule] = useState<string | null>('mod_intro');
  const [examSection, setExamSection] = useState<'A' | 'B'>('A');
  const [revealedExamSolutions, setRevealedExamSolutions] = useState<Record<string, boolean>>({});
  const [courseworkSchemaInput, setCourseworkSchemaInput] = useState<string>(
    `CREATE TABLE Departments (\n  DepartmentID INT PRIMARY KEY,\n  DeptName VARCHAR(80) NOT NULL\n);\n\nCREATE TABLE Students (\n  StudentID INT PRIMARY KEY,\n  Name VARCHAR(60) NOT NULL,\n  DepartmentID INT REFERENCES Departments(DepartmentID)\n);\n\nCREATE TABLE Books (\n  BookID INT PRIMARY KEY,\n  Title VARCHAR(120) NOT NULL\n);\n\nCREATE TABLE Loans (\n  LoanID INT PRIMARY KEY,\n  StudentID INT REFERENCES Students(StudentID),\n  BookID INT REFERENCES Books(BookID),\n  LoanDate DATE NOT NULL\n);`
  );
  const [courseworkValidationResult, setCourseworkValidationResult] = useState<{
    valid: boolean;
    checks: { title: string; pass: boolean; note: string }[];
  } | null>(null);

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

  const handleAnswerQuiz = (weekNum: number, optionIndex: number) => {
    const course = getBscCourse(activeModuleCode);
    const weekData = course.weeks.find((w) => w.week === weekNum);
    if (!weekData) return;

    const quizKey = `${activeModuleCode}_${weekNum}`;
    setUserAnswers((prev) => ({ ...prev, [quizKey]: optionIndex }));

    if (optionIndex === weekData.quiz.correctIndex) {
      sound.playSuccess();
      if (!quizCompleted[quizKey]) {
        awardXp(50, `Mastered ${activeModuleCode} Week ${weekNum} Knowledge Check`);
        setQuizCompleted((prev) => ({ ...prev, [quizKey]: true }));
      }
    } else {
      sound.playError();
    }
  };

  const handleExecuteTransaction = () => {
    sound.playClick();
    if (simulateCrash) {
      sound.playError();
      setTxnStatus('CRASH INJECTED! Power loss after Step 1. WAL Engine engaged: ROLLBACK to previous consistent snapshot. Zero funds lost.');
      return;
    }
    if (accountABalance < transferAmount) {
      sound.playError();
      setTxnStatus('TRANSACTION REJECTED: Insufficient funds in Account A. Invariant check failed.');
      return;
    }
    setAccountABalance((prev) => prev - transferAmount);
    setAccountBBalance((prev) => prev + transferAmount);
    sound.playSuccess();
    setTxnStatus(`TRANSACTION COMMITTED: Successfully debited £${transferAmount} from A and credited to B. WAL flushed to disk.`);
    awardXp(20, 'Executed ACID Transaction with WAL');
  };

  const handleValidateCoursework = () => {
    sound.playClick();
    const hasPK = courseworkSchemaInput.includes('PRIMARY KEY');
    const hasFK = courseworkSchemaInput.includes('REFERENCES') || courseworkSchemaInput.includes('FOREIGN KEY');
    const has3NF = !courseworkSchemaInput.toLowerCase().includes('zip_city') && courseworkSchemaInput.includes('DepartmentID');
    const hasNotNull = courseworkSchemaInput.includes('NOT NULL');

    const checks = [
      {
        title: 'Primary Key Uniqueness Enforcement',
        pass: hasPK,
        note: hasPK ? 'Entity identifiers defined with PRIMARY KEY on each relation.' : 'Missing PRIMARY KEY on one or more relations.',
      },
      {
        title: 'Referential Integrity & Foreign Key Links',
        pass: hasFK,
        note: hasFK ? 'Foreign key references established across parent-child relations.' : 'Missing REFERENCES/FOREIGN KEY definitions.',
      },
      {
        title: 'Domain & NOT NULL Constraints',
        pass: hasNotNull,
        note: hasNotNull ? 'Mandatory attributes protected against NULL corruption.' : 'Consider adding NOT NULL constraints on critical columns.',
      },
      {
        title: '3NF Relational Decomposition',
        pass: has3NF,
        note: has3NF ? 'Relations decomposed into 3NF without transitive dependencies.' : 'Potential transitive dependency detected.',
      },
    ];

    const allPass = checks.every((c) => c.pass);
    if (allPass) {
      sound.playSuccess();
      awardXp(35, 'Verified Coursework Relational Schema in Validator');
    } else {
      sound.playError();
    }

    setCourseworkValidationResult({
      valid: allPass,
      checks,
    });
  };

  const toggleExamSolution = (id: string) => {
    sound.playClick();
    setRevealedExamSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const is1032 = activeModuleCode === 'CSC1032';
  const currentCourse = getBscCourse(activeModuleCode);
  const currentWeeks = currentCourse.weeks;
  const currentCanvasMetadata = currentCourse.metadata;
  const currentCanvasModules = currentCourse.canvasModules;
  const currentExamQuestions = currentCourse.examQuestions;

  const totalQuizzesPassed = currentWeeks.filter((w) => quizCompleted[`${activeModuleCode}_${w.week}`]).length;
  const currentWeekData = currentWeeks.find((w) => w.week === activeWeek) || currentWeeks[0];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2 sm:p-4">
      {/* Newcastle BSc Computing Science Modules Header Selector */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-sm space-y-2">
        <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-400">
          <span className="font-bold uppercase tracking-wider text-slate-300">Newcastle University • BSc Computing Science Modules</span>
          <span className="hidden sm:inline">All 12-Week Syllabi &amp; Canvas VLE Sync</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {BSC_COURSE_LIST.map((c) => {
            const isSelected = activeModuleCode === c.moduleCode;
            return (
              <button
                key={c.moduleCode}
                onClick={() => {
                  setActiveModuleCode(c.moduleCode);
                  setActiveWeek(1);
                  setExpandedCanvasModule(null);
                  sound.playClick();
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-purple-500 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 shadow-md ring-1 ring-purple-500/50'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {c.stage} • {c.moduleCode}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Canvas #{c.canvasCourseId}
                  </span>
                </div>

                <div className="text-xs font-bold text-white line-clamp-1">
                  {c.moduleTitle}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{c.credits} Credits</span>
                  <span className="text-emerald-400 font-semibold">12 Weeks Ready</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Course Hero Banner with Module Weekly Accreditation */}
      <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden bg-gradient-to-r ${currentCourse.colorTheme}`}>
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Complete 12-Week {currentCourse.moduleCode} Curriculum
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-slate-950" /> {currentCourse.stage} Core • {currentCourse.credits} Credits
            </div>
            <a
              href={currentCourse.canvasUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 border border-white/30 text-white text-xs font-mono font-bold transition-all shadow-sm"
            >
              <span>Canvas #{currentCourse.canvasCourseId}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {currentCourse.moduleCode}: {currentCourse.moduleTitle}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/90 font-medium leading-relaxed">
            {currentCourse.tagline}
          </p>

          {/* Course Mastery Progress Bar */}
          <div className="mt-5 p-3.5 bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md">
                <Trophy className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-amber-200">Semester Progress:</span>
                  <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-full">
                    {totalQuizzesPassed}/12 Weeks Mastered
                  </span>
                </div>
                <p className="text-[11px] text-white/80">
                  Earn +50 XP per weekly knowledge check. Complete all 12 weeks to unlock your verified {currentCourse.moduleCode} Course Certificate!
                </p>
              </div>
            </div>

            {totalQuizzesPassed === 12 ? (
              <button
                onClick={() => setShowCertificate(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" /> View Verified Certificate
              </button>
            ) : (
              <span className="text-[11px] font-bold text-pink-200 self-center">
                {12 - totalQuizzesPassed} weekly milestones remaining
              </span>
            )}
          </div>
        </div>

        {/* Top-Right Badge */}
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 items-center gap-4">
          <div className="p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-center shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2 text-white">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-pink-100 block">
              {activeModuleCode} SYLLABUS
            </span>
            <span className="text-[9px] font-semibold text-amber-300 uppercase block tracking-wider mt-0.5">
              12 Weeks Complete Order
            </span>
          </div>
        </div>
      </div>

      {/* Competence Mastery Ladder */}
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

      {/* Curriculum View Switcher: Weekly Syllabus vs Canvas 70330 Modules vs Coursework & Exam Hub */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <button
          onClick={() => {
            setCurriculumTab('weeks');
            sound.playClick();
          }}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            curriculumTab === 'weeks'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" /> 12-Week Interactive Syllabus
        </button>
        <button
          onClick={() => {
            setCurriculumTab('canvas');
            sound.playClick();
          }}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            curriculumTab === 'canvas'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Newcastle Canvas Course 70330 Modules
        </button>
        <button
          onClick={() => {
            setCurriculumTab('assessment');
            sound.playClick();
          }}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            curriculumTab === 'assessment'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Coursework (50%) &amp; Exam (50%) Hub
        </button>
      </div>

      {curriculumTab === 'weeks' && (
        <>
          {/* 12-Week Semester Sequence Selector Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 px-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h2 className="text-sm font-black text-slate-800 dark:text-slate-100">
                  {activeModuleCode} Weekly Course Order (Weeks 1 to 12)
                </h2>
          </div>
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">
            Active: Week {activeWeek} of 12
          </span>
        </div>

        {/* 12 Weekly Nav Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-1.5">
          {currentWeeks.map((w) => {
            const isCurrent = activeWeek === w.week;
            const isPassed = quizCompleted[`${activeModuleCode}_${w.week}`];
            return (
              <button
                key={w.week}
                onClick={() => {
                  setActiveWeek(w.week);
                  awardXp(5, `Navigated to Week ${w.week}`);
                  sound.playClick();
                }}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer relative ${
                  isCurrent
                    ? 'bg-purple-50 dark:bg-purple-950/70 border-purple-500 ring-2 ring-purple-500/30 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isPassed
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isPassed ? '✓' : w.week}
                  </span>
                  {isPassed && <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400">+50</span>}
                </div>
                <p className="text-[10px] font-bold truncate text-slate-800 dark:text-slate-100">
                  Week {w.week}
                </p>
                <p className="text-[8px] text-slate-400 truncate mt-0.5">
                  {w.badge}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Week Content Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        {/* Week Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-widest">
                CSC1033 • Week {currentWeekData.week} of 12
              </span>
              <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                {currentWeekData.badge}
              </span>
            </div>

            {/* Voice Audio Listen Button */}
            <button
              onClick={() => handleToggleSpeak(currentWeekData.narration)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer"
            >
              {speakingText === currentWeekData.narration ? (
                <>
                  <Square className="w-3 h-3 fill-current text-rose-500" />
                  <span>Stop Voice Narration</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to Week {currentWeekData.week} Narration</span>
                </>
              )}
            </button>
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
            {currentWeekData.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {currentWeekData.tagline}
          </p>
        </div>

        {/* ALWAYS PRESENT: Authoritative Academic & Enterprise Reference Point Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-300">
                Authoritative Academic &amp; Industry Reference Point
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              Week {currentWeekData.week} Benchmark
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Academic Literature */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[11px]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Primary Academic Literature</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {currentWeekData.referencePoint.academic}
              </p>
            </div>

            {/* Curriculum Specification Standard */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{activeModuleCode} Syllabus Alignment</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug font-mono">
                {currentWeekData.accreditedSpec}
              </p>
            </div>

            {/* Enterprise Benchmark */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <Cpu className="w-3.5 h-3.5" />
                <span>Enterprise Production Benchmark</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {currentWeekData.referencePoint.enterprise}
              </p>
            </div>
          </div>
        </div>

        {/* Dual-Layer Pedagogical Explanation */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Pedagogical Explanation ({explanationMode === 'simple' ? 'Simple Analogy Mode' : 'Formal CS Mode'})
            </span>
            <button
              onClick={() => setExplanationMode(explanationMode === 'simple' ? 'engineer' : 'simple')}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 cursor-pointer"
            >
              Switch to {explanationMode === 'simple' ? 'Engineer' : 'Simple'}
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {explanationMode === 'simple'
              ? currentWeekData.pedagogy.simple
              : currentWeekData.pedagogy.engineer}
          </p>
        </div>

        {/* REAL LIVE INTERACTIVE CAPSTONE BY WEEK */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Week {currentWeekData.week} Live Interactive Capstone: {currentWeekData.capstone.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">
            {currentWeekData.capstone.description}
          </p>

          {activeModuleCode === 'CSC1032' ? (
            <ComputerSystemsLab week={activeWeek} />
          ) : activeModuleCode === 'CSC1036' ? (
            <ProgrammingPortfolioLab week={activeWeek} />
          ) : activeModuleCode === 'CSC2031' ? (
            <SecureProgrammingLab week={activeWeek} />
          ) : activeModuleCode === 'CSC2032' ? (
            <AlgorithmAnalysisLab week={activeWeek} />
          ) : activeModuleCode === 'CSC2035' ? (
            <SystemsImplementationLab week={activeWeek} />
          ) : activeModuleCode === 'CSC2033' ? (
            <SoftwareEngineeringLab week={activeWeek} />
          ) : activeModuleCode === 'CSC3095' ? (
            <DissertationStudioLab week={activeWeek} />
          ) : activeModuleCode === 'CSC3131' ? (
            <DevOpsOperationsLab week={activeWeek} />
          ) : (
            <>
              {/* WEEK 1 CAPSTONE: Multi-Format Data Inspector & Bitstream */}
              {activeWeek === 1 && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDataInspectorFormat('structured')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    dataInspectorFormat === 'structured'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Structured (Tabular SQL)
                </button>
                <button
                  onClick={() => setDataInspectorFormat('semi')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    dataInspectorFormat === 'semi'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Semi-Structured (JSON Document)
                </button>
                <button
                  onClick={() => setDataInspectorFormat('unstructured')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    dataInspectorFormat === 'unstructured'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Unstructured (Raw Bytes / Media)
                </button>
              </div>

              {dataInspectorFormat === 'structured' && (
                <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto">
                  <div className="text-purple-400 font-bold mb-2">// Tabular Schema: Fixed Columns &amp; Types</div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="p-2">StudentID (INT)</th>
                        <th className="p-2">Name (VARCHAR)</th>
                        <th className="p-2">Age (INT)</th>
                        <th className="p-2">Enrolled (BOOLEAN)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-900">
                        <td className="p-2 text-amber-300">101</td>
                        <td className="p-2">Alex Mercer</td>
                        <td className="p-2">21</td>
                        <td className="p-2 text-emerald-400">TRUE</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-amber-300">102</td>
                        <td className="p-2">Elena Rostova</td>
                        <td className="p-2">24</td>
                        <td className="p-2 text-emerald-400">TRUE</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {dataInspectorFormat === 'semi' && (
                <div className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto">
                  <div className="text-purple-400 font-bold mb-2">// JSON Schema-Less Document: Embedded Tags</div>
                  <pre>{`{
  "studentId": 101,
  "name": "Alex Mercer",
  "transcripts": [
    { "course": "CSC1033", "grade": "1st Class", "credits": 20 },
    { "course": "CSC1034", "grade": "Distinction", "credits": 20 }
  ],
  "preferences": { "pedagogy": "visual", "audioNarration": true }
}`}</pre>
                </div>
              )}

              {dataInspectorFormat === 'unstructured' && (
                <div className="p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto space-y-2">
                  <div className="text-purple-400 font-bold">// Raw Binary Media Payload: Hexadecimal Stream</div>
                  <p className="text-slate-400 text-[11px]">89 50 4E 47 0D 0A 1A 0A 00 00 00 0D 49 48 44 52 00 00 04 00 00 00 03 00 08 06 00 00 00</p>
                  <div className="text-slate-500 text-[10px]">Interpreted by browser canvas decoder as PNG bitmap. Unsearchable without secondary metadata.</div>
                </div>
              )}
            </div>
          )}

          {/* WEEK 2 CAPSTONE: Crow's Foot ERD Builder */}
          {activeWeek === 2 && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Students Entity */}
                <div className="p-3 bg-slate-900 rounded-xl border border-pink-500/60">
                  <div className="bg-pink-600 text-white font-bold text-xs p-1.5 rounded text-center mb-2">
                    Students (Entity)
                  </div>
                  <div className="font-mono text-[11px] space-y-1">
                    <div className="flex justify-between text-amber-300 font-bold">
                      <span>🔑 StudentID</span>
                      <span>PK (INT)</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Name</span>
                      <span>VARCHAR(60)</span>
                    </div>
                  </div>
                </div>

                {/* Junction Entity */}
                <div className="p-3 bg-slate-900 rounded-xl border border-purple-500/60">
                  <div className="bg-purple-600 text-white font-bold text-xs p-1.5 rounded text-center mb-2">
                    Loans (Junction Table)
                  </div>
                  <div className="font-mono text-[11px] space-y-1">
                    <div className="flex justify-between text-amber-300 font-bold">
                      <span>🔑 LoanID</span>
                      <span>PK (INT)</span>
                    </div>
                    <div className="flex justify-between text-pink-400">
                      <span>🔗 StudentID</span>
                      <span>FK (Students)</span>
                    </div>
                    <div className="flex justify-between text-indigo-400">
                      <span>🔗 BookID</span>
                      <span>FK (Books)</span>
                    </div>
                  </div>
                </div>

                {/* Books Entity */}
                <div className="p-3 bg-slate-900 rounded-xl border border-indigo-500/60">
                  <div className="bg-indigo-600 text-white font-bold text-xs p-1.5 rounded text-center mb-2">
                    Books (Entity)
                  </div>
                  <div className="font-mono text-[11px] space-y-1">
                    <div className="flex justify-between text-amber-300 font-bold">
                      <span>🔑 BookID</span>
                      <span>PK (INT)</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Title</span>
                      <span>VARCHAR(100)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WEEK 3 CAPSTONE: Relational Algebra Operators */}
          {activeWeek === 3 && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setRelAlgebraOp('select')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                    relAlgebraOp === 'select' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Selection: σ (Class=&apos;10A&apos;)(Students)
                </button>
                <button
                  onClick={() => setRelAlgebraOp('project')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                    relAlgebraOp === 'project' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Projection: π (StudentID, Name)(Students)
                </button>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-indigo-300">
                {relAlgebraOp === 'select'
                  ? 'Output Relation: { <101, "Alex Mercer", "10A"> } (Filtered 1 matching tuple)'
                  : 'Output Relation: { <101, "Alex Mercer">, <102, "Elena Rostova">, <103, "Marcus Vance"> } (2 attributes projected)'}
              </div>
            </div>
          )}

          {/* WEEK 4 CAPSTONE: SQL DDL & DML Mutations */}
          {activeWeek === 4 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-xl text-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-pink-500" />
                  Live SQL Mutation Sandbox (DDL &amp; DML Engine)
                </span>
                <button
                  onClick={runSql}
                  className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Execute Query (+15 XP)
                </button>
              </div>
              <textarea
                rows={2}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="w-full bg-slate-900 text-pink-300 font-mono text-xs p-2.5 rounded-xl border border-slate-800"
              />
              <div className="text-emerald-400 font-mono text-xs">{sqlMessage}</div>
            </div>
          )}

          {/* WEEK 5 CAPSTONE: Relational Joins */}
          {activeWeek === 5 && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const q = "SELECT Orders.OrderID, Customers.Name, Orders.Total, Orders.Status FROM Orders JOIN Customers ON Orders.CustomerID = Customers.CustomerID";
                    setSqlQuery(q);
                    const res = dbSimulator.executeCustomSql(q);
                    if (res.data) setSqlResult(res.data);
                    setSqlMessage(res.message);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-pink-950/60 border border-pink-800 text-xs font-mono font-bold text-pink-300 hover:bg-pink-900 cursor-pointer"
                >
                  Orders ⨝ Customers (INNER JOIN)
                </button>
                <button
                  onClick={() => {
                    const q = "SELECT Students.StudentID, Students.Name, Loans.LoanID, Loans.Status FROM Students LEFT JOIN Loans ON Students.StudentID = Loans.StudentID";
                    setSqlQuery(q);
                    const res = dbSimulator.executeCustomSql(q);
                    if (res.data) setSqlResult(res.data);
                    setSqlMessage(res.message);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800 text-xs font-mono font-bold text-purple-300 hover:bg-purple-900 cursor-pointer"
                >
                  Students ⟕ Loans (LEFT JOIN)
                </button>
                <button
                  onClick={() => {
                    const q = "EXPLAIN SELECT Orders.OrderID, Customers.Name FROM Orders JOIN Customers ON Orders.CustomerID = Customers.CustomerID";
                    setSqlQuery(q);
                    const res = dbSimulator.executeCustomSql(q);
                    if (res.data) setSqlResult(res.data);
                    setSqlMessage(res.message);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800 text-xs font-mono font-bold text-indigo-300 hover:bg-indigo-900 cursor-pointer"
                >
                  EXPLAIN Hash Join Plan
                </button>
              </div>

              {sqlResult.length > 0 && (
                <div className="overflow-x-auto max-h-40 border border-slate-800 rounded-xl p-2 bg-slate-900">
                  <table className="w-full text-[11px] font-mono">
                    <thead>
                      <tr className="text-pink-400 border-b border-slate-800">
                        {Object.keys(sqlResult[0]).map((k) => (
                          <th key={k} className="p-1 text-left">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sqlResult.map((r, i) => (
                        <tr key={i} className="border-b border-slate-800/40">
                          {Object.values(r).map((v: any, j) => (
                            <td key={j} className="p-1">{String(v)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* WEEK 6 CAPSTONE: Normalization */}
          {activeWeek === 6 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-pink-500/40 text-slate-100">
                <span className="text-[10px] font-bold uppercase text-pink-400">1NF: Atomic Cells</span>
                <p className="text-xs mt-1">Disallow multi-valued arrays. Every attribute contains exactly one scalar value.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/40 text-slate-100">
                <span className="text-[10px] font-bold uppercase text-purple-400">2NF: No Partial Key Dependencies</span>
                <p className="text-xs mt-1">Non-prime attributes must depend on the entire candidate key, not a partial fragment.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-slate-100">
                <span className="text-[10px] font-bold uppercase text-emerald-400">3NF: No Transitive Dependencies</span>
                <p className="text-xs mt-1">Non-prime attributes must never determine other non-prime attributes (e.g. Zip → City).</p>
              </div>
            </div>
          )}

          {/* WEEK 7 CAPSTONE: B-Tree Index Hierarchy */}
          {activeWeek === 7 && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white text-center space-y-3">
              <div className="p-2 rounded-xl bg-purple-900/60 border border-purple-400 inline-block font-mono text-xs font-bold">
                Root Node [ Key: 50 | 100 ]
              </div>
              <div className="flex justify-around text-slate-400 text-xs">
                <span>↙ (&lt; 50)</span>
                <span>↓ (50..100)</span>
                <span>↘ (&gt; 100)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto font-mono text-xs">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">[ 20 | 35 ]</div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">[ 65 | 80 ]</div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">[ 120 | 150 ]</div>
              </div>
              <p className="text-xs text-emerald-400 font-mono">
                Logarithmic efficiency: Navigates 1,000,000 tuples in ~3 disk seeks instead of 1,000,000 table scans!
              </p>
            </div>
          )}

          {/* WEEK 8 CAPSTONE: Financial ACID Transactions & WAL */}
          {activeWeek === 8 && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400">Account A Balance</span>
                  <p className="text-xl font-black text-amber-400 mt-1 font-mono">£{accountABalance}</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-400">Account B Balance</span>
                  <p className="text-xl font-black text-emerald-400 mt-1 font-mono">£{accountBBalance}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulateCrash}
                    onChange={(e) => setSimulateCrash(e.target.checked)}
                    className="rounded text-rose-500"
                  />
                  <span>Simulate Unexpected Server Crash During Transfer</span>
                </label>

                <button
                  onClick={handleExecuteTransaction}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Execute Transfer (£{transferAmount})
                </button>
              </div>

              {txnStatus && (
                <div className={`p-3 rounded-xl text-xs font-mono ${simulateCrash ? 'bg-rose-950/60 text-rose-300 border border-rose-800' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'}`}>
                  {txnStatus}
                </div>
              )}
            </div>
          )}

          {/* WEEK 9 CAPSTONE: Live Search Engine Lab */}
          {activeWeek === 9 && <SearchEngineLab />}

          {/* WEEK 10 CAPSTONE: Metadata, Faceted Search & Semantic Linked Data */}
          {activeWeek === 10 && (
            <div className="space-y-4">
              <MetadataLab />
              <FacetedSearchLab />
              <QueryExpansionLab />
              <SemanticWebLab />
            </div>
          )}

          {/* WEEK 11 CAPSTONE: High-Concurrency Cloud Scalability */}
          {activeWeek === 11 && <CloudScalingLab />}

          {/* WEEK 12 CAPSTONE: GDPR Compliance & Vector AI Lab */}
          {activeWeek === 12 && (
            <div className="space-y-4">
              <DataEthicsLab />
              <VectorAiLab />
            </div>
          )}
            </>
          )}
        </div>

        {/* Weekly Knowledge Check Quiz Checkpoint */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 to-indigo-50/70 dark:from-purple-950/20 dark:to-indigo-950/20 border-2 border-purple-300 dark:border-purple-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-purple-600 text-white">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
                  Week {currentWeekData.week} Mastery Knowledge Check
                </h4>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                  Earn +50 XP on correct answer
                </span>
              </div>
            </div>
            {(() => {
              const quizKey = `${activeModuleCode}_${currentWeekData.week}`;
              const userAnswer = userAnswers[quizKey];
              const isCorrect = userAnswer !== undefined && userAnswer === currentWeekData.quiz.correctIndex;
              return isCorrect ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-300">
                  <Check className="w-3 h-3" /> Mastered (+50 XP)
                </span>
              ) : null;
            })()}
          </div>

          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {currentWeekData.quiz.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(() => {
              const quizKey = `${activeModuleCode}_${currentWeekData.week}`;
              const userAnswer = userAnswers[quizKey];
              const isAnswered = userAnswer !== undefined;

              return currentWeekData.quiz.options.map((opt, idx) => {
                const isSelected = userAnswer === idx;
                let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400';

                if (isAnswered) {
                  if (idx === currentWeekData.quiz.correctIndex) {
                    btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold ring-2 ring-emerald-400/30';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerQuiz(currentWeekData.week, idx)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </button>
                );
              });
            })()}
          </div>

          {(() => {
            const quizKey = `${activeModuleCode}_${currentWeekData.week}`;
            const userAnswer = userAnswers[quizKey];
            if (userAnswer === undefined) return null;
            const isCorrect = userAnswer === currentWeekData.quiz.correctIndex;

            return (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  isCorrect
                    ? 'bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-100/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                }`}
              >
                {isCorrect ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">
                    {isCorrect
                      ? 'Correct! +50 XP Awarded'
                      : 'Not quite. Check the academic explanation below:'}
                  </p>
                  <p className="text-[11px] mt-0.5">{currentWeekData.quiz.explanation}</p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
        </>
      )}

      {/* Newcastle Canvas Course Modules View */}
      {curriculumTab === 'canvas' && (
        <div className="space-y-6">
          {/* Canvas Course Overview & Administrative Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {currentCanvasMetadata.academicInstitution}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                    Course ID: {currentCanvasMetadata.courseId} • 20 Credits
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                    {currentCanvasMetadata.academicYear}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {currentCanvasMetadata.moduleCode}: {currentCanvasMetadata.moduleTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Official Newcastle University syllabus module hosted on Canvas VLE. Complete curriculum integration covering lecture slide decks, practical laboratory specifications, staff drop-ins, and assessment guidelines.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={currentCanvasMetadata.canvasUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-md transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" /> Open Official Canvas Portal
                  </a>
                  <button
                    onClick={() => {
                      setCurriculumTab('assessment');
                      sound.playClick();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-amber-400" /> View 50% CW &amp; 50% Exam Specs
                  </button>
                </div>
              </div>

              {/* Staff Directory Quick Card */}
              <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-4 lg:w-80 shrink-0 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-amber-400 border-b border-slate-700 pb-2">
                  <Mail className="w-4 h-4" /> Teaching Team &amp; Contacts
                </div>
                <div className="space-y-2 text-xs">
                  {(currentCanvasMetadata?.staff || []).map((member: any) => (
                    <div key={member.name} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>{member.name}</span>
                        <a
                          href={`mailto:${member.email}`}
                          className="text-[10px] text-purple-400 hover:underline"
                        >
                          Email
                        </a>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{member.role}</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">{member.office}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timetable & Venue Banner */}
            <div className="mt-6 pt-4 border-t border-indigo-900/40 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Weekly Lectures
                </span>
                <p className="text-slate-300 font-medium">
                  {currentCanvasMetadata?.timetable?.lectures ||
                   currentCanvasMetadata?.timetable?.semester1?.lectures ||
                   'Tuesdays & Thursdays • Urban Sciences Building (USB)'}
                </p>
                <p className="text-slate-400 text-[11px]">
                  {currentCanvasMetadata?.timetable?.practicals ||
                   currentCanvasMetadata?.timetable?.semester1?.practicals ||
                   'USB Floor 3 Flat Floor Teaching Space'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Practicals &amp; Drop-ins
                </span>
                <p className="text-slate-300 font-medium">
                  {currentCanvasMetadata?.timetable?.surgeries ||
                   currentCanvasMetadata?.timetable?.semester2?.lectures ||
                   'Weekly Surgery & Lab Demonstrator Support'}
                </p>
                <p className="text-slate-400 text-[11px]">
                  {currentCanvasMetadata?.timetable?.semester2?.practicals ||
                   'Urban Sciences Building (USB) Computing Labs'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5" /> Recommended Texts
                </span>
                <p className="text-slate-300 text-[11px] leading-tight">
                  {Array.isArray(currentCanvasMetadata?.recommendedTexts) && currentCanvasMetadata.recommendedTexts.length > 0
                    ? currentCanvasMetadata.recommendedTexts.join(' • ')
                    : 'Official Newcastle University Module Reading List & Academic Papers'}
                </p>
              </div>
            </div>
          </div>

          {/* Module Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                Filter Canvas Modules:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: `All Modules (${currentCanvasModules.length})` },
                { id: '1', label: is1032 ? 'Foundations & Circuits' : 'Semester 1 (Database Systems)' },
                { id: '2', label: is1032 ? 'Architecture & Memory' : 'Semester 2 (Information Retrieval)' },
                { id: 'assess', label: 'Coursework & Exam Prep' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setCanvasSemesterFilter(f.id as any);
                    sound.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    canvasSemesterFilter === f.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Modules List */}
          <div className="space-y-3">
            {currentCanvasModules.filter((mod) => {
              const code = mod.code || `MODULE-${mod.moduleNumber || mod.associatedWeek}`;
              if (canvasSemesterFilter === '1') return (mod.associatedWeek <= 5) && !code.startsWith('ASSESS');
              if (canvasSemesterFilter === '2') return (mod.associatedWeek > 5) && !code.startsWith('ASSESS');
              if (canvasSemesterFilter === 'assess') return code.startsWith('ASSESS') || code === 'MODULE-0';
              return true;
            }).map((mod) => {
              const modId = mod.id || `mod_${mod.moduleNumber || mod.associatedWeek}`;
              const modCode = mod.code || `MOD-${mod.moduleNumber || mod.associatedWeek}`;
              const isExpanded = expandedCanvasModule === modId;
              return (
                <div
                  key={modId}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-all hover:border-purple-300 dark:hover:border-purple-800"
                >
                  {/* Module Card Summary Header */}
                  <div
                    onClick={() => {
                      setExpandedCanvasModule(isExpanded ? null : modId);
                      sound.playClick();
                    }}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                        {modCode.replace('TOPIC-', 'T').replace('MODULE-', 'M').replace('ASSESS-', 'A')}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {modCode}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                            Semester {mod.semester || 1}
                          </span>
                          {mod.slideDeck && (
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                              {mod.slideDeck}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                          {mod.title}
                        </h3>
                        {mod.subtitle && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {mod.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden md:block">
                        {mod.items.length} Canvas Items
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Module Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 dark:border-slate-800 p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-950/30 space-y-4">
                      {/* Metadata bar */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Lecturer &amp; Timetable</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{mod.lecturer || 'School of Computing Faculty'}</span>
                          <span className="text-[11px] text-slate-500 block">{mod.schedule || 'Scheduled Canvas Delivery'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Lab Venue &amp; Slides</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{mod.practicalVenue || 'Urban Sciences Building (USB)'}</span>
                          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-mono block">{mod.slideDeck || 'Interactive Canvas Spec'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Reading Reference</span>
                          <span className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2">{mod.readingReference || 'Official Module Reading List'}</span>
                        </div>
                      </div>

                      {/* Items Checklist */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                          Canvas Learning Activities &amp; Practical Resources:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {mod.items.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5"
                            >
                              <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                                {item.type === 'lecture' && <BookOpen className="w-3.5 h-3.5" />}
                                {item.type === 'practical' && <Terminal className="w-3.5 h-3.5" />}
                                {item.type === 'reading' && <Bookmark className="w-3.5 h-3.5" />}
                                {item.type === 'assessment' && <GraduationCap className="w-3.5 h-3.5" />}
                                {item.type === 'dropin' && <Clock className="w-3.5 h-3.5" />}
                                {item.type === 'guide' && <FileText className="w-3.5 h-3.5" />}
                              </div>

                              <div className="space-y-0.5 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-800 dark:text-slate-200">
                                    {item.title}
                                  </span>
                                  {item.durationOrRoom && (
                                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                                      {item.durationOrRoom}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                  {item.details}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] text-slate-400">
                          Associated Roadmap Week: <strong>Week {mod.associatedWeek}</strong>
                        </span>
                        <button
                          onClick={() => {
                            setActiveWeek(mod.associatedWeek);
                            setCurriculumTab('weeks');
                            sound.playSuccess();
                            awardXp(10, `Launched interactive lab for Canvas module ${mod.code}`);
                          }}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" /> Launch Live Week {mod.associatedWeek} Lab &amp; Quiz
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Coursework (50%) & Formal Written Exam (50%) Hub */}
      {curriculumTab === 'assessment' && (
        <div className="space-y-6">
          {/* Assessment Header Card */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
            <div className="max-w-3xl space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/20 text-white text-xs font-black uppercase tracking-wider">
                  {activeModuleCode} Official Assessment Architecture
                </span>
                <span className="px-3 py-1 rounded-full bg-white text-slate-950 text-xs font-black">
                  50% Coursework + 50% Written Examination
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Coursework Portfolio &amp; Written Exam Simulation Hub
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
                Complete guidance for your {activeModuleCode} module assessments. Test your implementations against our interactive validators, and practice formal university exam problems with verified step-by-step model derivations.
              </p>
            </div>
          </div>

          {/* Section 1: Semester 1 Coursework (50%) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider">
                    50% Weighting • Semester 1
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {is1032
                      ? 'Computer Systems Architecture & Assembly Lab Portfolio'
                      : 'Database Design & Implementation Coursework Portfolio'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {is1032
                    ? 'Deliverables: Digital logic minimization, 4-bit ALU adder design, assembly subroutine calling conventions, and cache locality profiling.'
                    : 'Deliverables: Requirement elicitation, Crow’s foot ERD, 3NF decomposition, SQL DDL script with integrity constraints, tuple seeding, and 5 analytical queries.'}
                </p>
              </div>

              <span className="text-xs font-bold text-slate-400">
                Deadline: Semester 1 Teaching Week 10
              </span>
            </div>

            {/* Coursework Deliverables Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {is1032 ? '1. Digital Logic Design' : '1. Conceptual ERD'}
                </span>
                <p className="text-[11px] text-slate-500">
                  {is1032
                    ? 'Truth tables and circuit synthesis minimizing gates using De Morgan’s laws.'
                    : 'Crow’s foot notation with mandatory/optional multiplicities and primary identifiers.'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {is1032 ? '2. 4-Bit ALU Subsystem' : '2. 3NF Decomposition'}
                </span>
                <p className="text-[11px] text-slate-500">
                  {is1032
                    ? 'Ripple-carry adder design with carry propagation delay and overflow flags.'
                    : 'Documented functional dependencies proving 1NF, 2NF, and 3NF without transitive anomalies.'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {is1032 ? '3. Assembly Subroutines' : '3. SQL DDL Implementation'}
                </span>
                <p className="text-[11px] text-slate-500">
                  {is1032
                    ? 'Subroutines implementing caller/callee-saved registers, PUSH/POP frames, and RET.'
                    : 'CREATE TABLE scripts specifying PRIMARY KEY, FOREIGN KEY, and NOT NULL constraints.'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {is1032 ? '4. Memory Hierarchy' : '4. Analytical Queries'}
                </span>
                <p className="text-[11px] text-slate-500">
                  {is1032
                    ? 'Cache address parsing, hit rate derivations, and spatial/temporal locality benchmarks.'
                    : '5 business questions answered using multi-table JOINs, GROUP BY HAVING, and subqueries.'}
                </p>
              </div>
            </div>

            {/* Interactive Coursework Schema / Code Validator */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-purple-200 dark:border-purple-900/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {is1032 ? 'Interactive Assembly & RTL Logic Validator' : 'Interactive Coursework Relational Schema Validator'}
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400">
                  Pre-submission automated integrity sanity check
                </span>
              </div>

              <textarea
                value={courseworkSchemaInput}
                onChange={(e) => setCourseworkSchemaInput(e.target.value)}
                rows={7}
                className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={is1032 ? "Paste your assembly routines or HDL modules here..." : "Paste your CREATE TABLE scripts here..."}
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleValidateCoursework}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" /> Run Coursework Validation (+35 XP)
                </button>
                <span className="text-[11px] text-slate-500">
                  Automated verification and syntax inspection
                </span>
              </div>

              {courseworkValidationResult && (
                <div className="space-y-2 pt-2 animate-in fade-in">
                  <div
                    className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      courseworkValidationResult.valid
                        ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    {courseworkValidationResult.valid ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>
                      {courseworkValidationResult.valid
                        ? 'Excellent! Coursework portfolio code meets foundational university standards.'
                        : 'Validation warnings detected. Review checks below:'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {courseworkValidationResult.checks.map((check, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border flex items-start gap-2 ${
                          check.pass
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                            : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                        }`}
                      >
                        {check.pass ? (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <strong className="block">{check.title}</strong>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{check.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Formal Written Examination Practice (50%) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-[10px] font-black uppercase tracking-wider">
                    50% Weighting • 1.5 Hours
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {is1032
                      ? 'Formal 1.5-Hour Digital Exam Simulator (Inspera)'
                      : 'Formal 1.5-Hour Written Examination Simulator'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {is1032
                    ? 'Format: Section A (Data Representation & Digital Logic) + Section B (Processor Architecture, Assembly, and Memory Hierarchy).'
                    : 'Format: Section A (Relational Database Systems) + Section B (Information Retrieval & Search Architecture).'}
                </p>
              </div>

              {/* Section Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => {
                    setExamSection('A');
                    sound.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    examSection === 'A'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {is1032 ? 'Section A: Number Systems & Logic' : 'Section A: Relational Databases'}
                </button>
                <button
                  onClick={() => {
                    setExamSection('B');
                    sound.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    examSection === 'B'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {is1032 ? 'Section B: Architecture & Memory' : 'Section B: Information Retrieval'}
                </button>
              </div>
            </div>

            {/* Questions for Active Exam Section */}
            <div className="space-y-4">
              {currentExamQuestions[examSection].map((q, idx) => {
                const isRevealed = !!revealedExamSolutions[q.id];
                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-black">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                          {q.topic || q.title}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                        [{q.marks} Marks]
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-line space-y-2">
                      <p>{q.question || q.scenario}</p>
                      {q.tasks && q.tasks.length > 0 && (
                        <div className="mt-2 pl-3 border-l-2 border-purple-500/50 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Required Tasks:</span>
                          {q.tasks.map((task: string, tIdx: number) => (
                            <div key={tIdx} className="text-[11px] text-slate-300">
                              • {task}
                            </div>
                          ))}
                        </div>
                      )}
                      {q.subQuestions && q.subQuestions.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {q.subQuestions.map((sq, sqIdx) => (
                            <div key={sqIdx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                              <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                                <span>Part {sq.part}</span>
                                <span className="font-mono text-slate-400">[{sq.marks} Marks]</span>
                              </div>
                              <p className="text-[11px] text-slate-300">{sq.prompt}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => toggleExamSolution(q.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isRevealed
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-xs'
                        }`}
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        {isRevealed ? 'Hide Model Derivation' : 'Reveal Model Answer & Derivation'}
                      </button>

                      <span className="text-[10px] text-slate-400 font-mono">
                        Question Ref: {activeModuleCode}-{examSection}{idx + 1}
                      </span>
                    </div>

                    {isRevealed && (
                      <div className="mt-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-950 dark:text-purple-200 space-y-2 animate-in fade-in">
                        <div className="font-black text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Academic Model Solution &amp; Step Derivation:
                        </div>
                        {q.solution && (
                          <div className="font-mono text-[11px] leading-relaxed whitespace-pre-line bg-white/70 dark:bg-slate-900/70 p-3 rounded-lg border border-purple-200/50 dark:border-purple-900/50">
                            {q.solution}
                          </div>
                        )}
                        {q.modelAnswer && !q.subQuestions && (
                          <div className="font-mono text-[11px] leading-relaxed whitespace-pre-line bg-white/70 dark:bg-slate-900/70 p-3 rounded-lg border border-purple-200/50 dark:border-purple-900/50">
                            {q.modelAnswer}
                          </div>
                        )}
                        {q.subQuestions && q.subQuestions.length > 0 && (
                          <div className="space-y-2">
                            {q.subQuestions.map((sq, sqIdx) => (
                              <div key={sqIdx} className="p-3 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-purple-200/50 dark:border-purple-900/50 space-y-1 font-mono text-[11px]">
                                <div className="font-bold text-purple-600 dark:text-purple-400">Part {sq.part} Model Answer:</div>
                                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{sq.modelAnswer}</div>
                                {sq.markingCriteria && sq.markingCriteria.length > 0 && (
                                  <div className="pt-1 border-t border-slate-700/50 text-[10px] text-amber-500 font-sans">
                                    <span className="font-bold block">Marking Rubric:</span>
                                    {sq.markingCriteria.map((crit, cIdx) => (
                                      <div key={cIdx}>• {crit}</div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Verified 12-Week Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center relative shadow-2xl">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-purple-600 to-indigo-600 text-white flex items-center justify-center text-3xl mx-auto shadow-lg mb-3">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Verified Academic Credential
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {is1032
                ? 'CSC1032 Computer Systems Design & Architecture Certificate'
                : 'CSC1033 Database Architecture & IR Completion Certificate'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Awarded to <strong className="text-purple-600 dark:text-purple-400">{user.name}</strong> for completing all 12 accredited weeks of the {activeModuleCode} curriculum with verified capstone proof.
            </p>

            <div className="my-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs font-mono text-amber-900 dark:text-amber-200 text-left space-y-1">
              <div className="font-bold">Module: {activeModuleCode} (12 Weeks Complete)</div>
              <div>Credential ID: DQ-{activeModuleCode}-{Date.now().toString(36).toUpperCase()}</div>
              <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-1">
                {is1032
                  ? 'Verified: Two’s Complement • IEEE 754 Floating Point • Logic Minimization • Ripple-Carry ALUs • Von Neumann Datapath • ISA Assembly • Call Stacks • Cache Partitioning • Virtual Memory MMU • Process Scheduling'
                  : 'Verified: Relational Algebra • 3NF Normalization • B-Tree Indexing • ACID • Search Inverted Postings • W3C Semantic Web • Cloud Scalability • UK GDPR Ethics • Vector Embeddings'}
              </div>
            </div>

            <button
              onClick={() => setShowCertificate(false)}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:opacity-95 transition-all cursor-pointer"
            >
              Continue Exploring DataQuest
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

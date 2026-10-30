'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import {
  Users,
  GitBranch,
  CheckCircle2,
  AlertOctagon,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  FileCode,
  Zap,
} from 'lucide-react';

interface SoftwareEngineeringLabProps {
  week: number;
}

export const SoftwareEngineeringLab: React.FC<SoftwareEngineeringLabProps> = ({ week }) => {
  const { awardXp } = useAppStore();

  // Week 1: Sprint Velocity & Story Point State
  const [plannedPoints, setPlannedPoints] = useState(38);
  const [completedPoints, setCompletedPoints] = useState(34);

  // Week 2: Gherkin BDD State
  const [userStoryRole, setUserStoryRole] = useState('student');
  const [userStoryAction, setUserStoryAction] = useState('renew library books online');
  const [userStoryBenefit, setUserStoryBenefit] = useState('avoid late return penalties');

  // Week 3: UML Class Relationship State
  const [selectedRel, setSelectedRel] = useState<'association' | 'aggregation' | 'composition'>('composition');

  // Week 5: Git Conflict State
  const [conflictResolved, setConflictResolved] = useState(false);

  // Week 7: Andon Cord CI State
  const [ciStage, setCiStage] = useState<'IDLE' | 'LINT' | 'SAST' | 'TEST' | 'BUILD' | 'GREEN' | 'HALTED'>('IDLE');
  const [injectSecretLeak, setInjectSecretLeak] = useState(false);
  const [injectFailingTest, setInjectFailingTest] = useState(false);

  // Week 10: Blue-Green Deployment State
  const [activeDeploymentColor, setActiveDeploymentColor] = useState<'BLUE' | 'GREEN'>('BLUE');

  const handleRunCiPipeline = () => {
    sound.playClick();
    setCiStage('LINT');

    setTimeout(() => {
      setCiStage('SAST');
      if (injectSecretLeak) {
        setCiStage('HALTED');
        sound.playError();
        return;
      }

      setTimeout(() => {
        setCiStage('TEST');
        if (injectFailingTest) {
          setCiStage('HALTED');
          sound.playError();
          return;
        }

        setTimeout(() => {
          setCiStage('BUILD');
          setTimeout(() => {
            setCiStage('GREEN');
            sound.playSuccess();
            awardXp(30, 'Executed Green CI/CD Pipeline');
          }, 400);
        }, 400);
      }, 400);
    }, 400);
  };

  return (
    <div className="rounded-2xl border border-pink-500/30 bg-pink-950/20 p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              CSC2033 Software Engineering Team Project Lab
              <span className="text-[10px] font-mono uppercase bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/30">
                Week {week}
              </span>
            </h3>
            <p className="text-xs text-pink-200/80">Agile Lifecycles, UML Modeling, Trunk-Based Git, and the CI Andon Cord</p>
          </div>
        </div>
      </div>

      {/* Week 2: User Stories & BDD */}
      {week === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">As a (Persona):</label>
              <input
                type="text"
                value={userStoryRole}
                onChange={(e) => setUserStoryRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-slate-700 text-xs font-mono text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">I want to (Action):</label>
              <input
                type="text"
                value={userStoryAction}
                onChange={(e) => setUserStoryAction(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-slate-700 text-xs font-mono text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">So that (Benefit):</label>
              <input
                type="text"
                value={userStoryBenefit}
                onChange={(e) => setUserStoryBenefit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-slate-700 text-xs font-mono text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-slate-800 font-mono text-xs text-pink-200 space-y-2">
            <div className="text-slate-400 font-bold">Generated BDD Gherkin Feature Specification:</div>
            <div>
              Scenario: Online Book Renewal<br />
              &nbsp;&nbsp;Given a logged-in {userStoryRole} with an active book loan<br />
              &nbsp;&nbsp;When they request to {userStoryAction}<br />
              &nbsp;&nbsp;Then the due date is extended by 14 days<br />
              &nbsp;&nbsp;And they {userStoryBenefit}
            </div>
          </div>
        </div>
      )}

      {/* Week 3: UML Class Relationships */}
      {week === 3 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-300">Select a relationship type to inspect UML notation and lifecycle coupling semantics:</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'association', name: 'Association', sym: '───▶', desc: 'Peer relationship ("knows-a")' },
              { id: 'aggregation', name: 'Aggregation', sym: '◇───', desc: 'Weak container ("has-a", hollow diamond)' },
              { id: 'composition', name: 'Composition', sym: '◆───', desc: 'Coincident lifecycle ("part-of", solid diamond)' },
            ].map((rel) => (
              <button
                key={rel.id}
                onClick={() => { setSelectedRel(rel.id as any); sound.playClick(); }}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedRel === rel.id ? 'border-pink-500 bg-pink-500/20 text-white font-bold' : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                <div className="text-base font-mono">{rel.sym}</div>
                <div className="text-xs mt-1">{rel.name}</div>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-slate-800 font-mono text-xs space-y-2">
            <div className="text-pink-300 font-bold">Lifecycle Coupling Semantics:</div>
            <p className="text-slate-200 font-sans">
              {selectedRel === 'composition' && 'Composition (◆): High lifecycle coupling. The child object cannot exist without the parent. If UniversityBuilding is demolished, Classroom ceases to exist.'}
              {selectedRel === 'aggregation' && 'Aggregation (◇): Weak container relationship. The child part exists independently. If University closes, Student entities continue to exist independently.'}
              {selectedRel === 'association' && 'Association (──▶): Structural relationship where objects communicate through message passing or function calls without ownership.'}
            </p>
          </div>
        </div>
      )}

      {/* Week 7: Continuous Integration & Andon Cord */}
      {week === 7 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setInjectSecretLeak(!injectSecretLeak); sound.playClick(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  injectSecretLeak ? 'border-rose-500 bg-rose-500/20 text-rose-300' : 'border-slate-700 bg-slate-900 text-slate-400'
                }`}
              >
                {injectSecretLeak ? '⚠️ Leaked AWS Secret (Active)' : 'Normal Code (Clean)'}
              </button>
              <button
                onClick={() => { setInjectFailingTest(!injectFailingTest); sound.playClick(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  injectFailingTest ? 'border-rose-500 bg-rose-500/20 text-rose-300' : 'border-slate-700 bg-slate-900 text-slate-400'
                }`}
              >
                {injectFailingTest ? '⚠️ Failing Unit Test (Active)' : 'All Tests Pass'}
              </button>
            </div>

            <button
              onClick={handleRunCiPipeline}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-3.5 h-3.5" /> Trigger CI Pipeline Run
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
            <div className={`p-2.5 rounded-xl border ${ciStage === 'LINT' || ciStage === 'SAST' || ciStage === 'TEST' || ciStage === 'BUILD' || ciStage === 'GREEN' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
              1. LINT
            </div>
            <div className={`p-2.5 rounded-xl border ${ciStage === 'HALTED' && injectSecretLeak ? 'border-rose-500 bg-rose-500/30 text-rose-300 font-bold' : ciStage === 'SAST' || ciStage === 'TEST' || ciStage === 'BUILD' || ciStage === 'GREEN' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
              2. SAST SCAN
            </div>
            <div className={`p-2.5 rounded-xl border ${ciStage === 'HALTED' && injectFailingTest ? 'border-rose-500 bg-rose-500/30 text-rose-300 font-bold' : ciStage === 'TEST' || ciStage === 'BUILD' || ciStage === 'GREEN' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
              3. UNIT TESTS
            </div>
            <div className={`p-2.5 rounded-xl border ${ciStage === 'BUILD' || ciStage === 'GREEN' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
              4. BUILD
            </div>
          </div>

          {ciStage === 'HALTED' && (
            <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 font-mono text-xs flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
              <span>ANDON CORD PULLED! Automated quality gate failed. Pipeline halted and pull request merge blocked.</span>
            </div>
          )}

          {ciStage === 'GREEN' && (
            <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-mono text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>CI PIPELINE GREEN! All 4 stages passed verification. Pull request ready for peer code review.</span>
            </div>
          )}
        </div>
      )}

      {/* Week 10: Blue-Green Deployments */}
      {week === 10 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Active Production Routing Color:</span>
            <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
              activeDeploymentColor === 'BLUE' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              Live Traffic: {activeDeploymentColor} ENV
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${activeDeploymentColor === 'BLUE' ? 'border-blue-500 bg-blue-950/30 shadow-md' : 'border-slate-800 bg-slate-900/40 opacity-50'}`}>
              <div className="text-xs font-bold text-blue-400">BLUE Environment (v1.4.0)</div>
              <p className="text-[11px] text-slate-400 mt-1">Existing stable release receiving production user traffic.</p>
            </div>
            <div className={`p-4 rounded-xl border ${activeDeploymentColor === 'GREEN' ? 'border-emerald-500 bg-emerald-950/30 shadow-md' : 'border-slate-800 bg-slate-900/40 opacity-50'}`}>
              <div className="text-xs font-bold text-emerald-400">GREEN Environment (v1.5.0)</div>
              <p className="text-[11px] text-slate-400 mt-1">New release tested and warmed up; ready for traffic flip.</p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveDeploymentColor(activeDeploymentColor === 'BLUE' ? 'GREEN' : 'BLUE');
              sound.playSuccess();
              awardXp(25, 'Executed Zero-Downtime Blue-Green Switch');
            }}
            className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Flip Router Switch to {activeDeploymentColor === 'BLUE' ? 'GREEN' : 'BLUE'}
          </button>
        </div>
      )}

      {/* Default Fallback for other weeks */}
      {week !== 2 && week !== 3 && week !== 7 && week !== 10 && (
        <div className="p-4 rounded-xl bg-black/40 border border-pink-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-400">Software Engineering Team Workbench</span>
            <span className="text-[10px] text-slate-400 font-mono">Status: Ready</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Practice collaborative software engineering techniques. Estimate story points, author automated test fixtures, and review peer code pull requests according to Newcastle University CSC2033 rubrics.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => { sound.playSuccess(); awardXp(25, `Completed Week ${week} software engineering lab`); }}
              className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Verify Sprint Invariant (+25 XP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


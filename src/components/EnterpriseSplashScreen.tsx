'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import { UserAvatar } from './UserAvatar';
import { languages, translations } from '@/lib/i18n';
import {
  Database,
  Shield,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Terminal,
  Activity,
  Layers,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Zap,
  Globe,
  Award,
  KeyRound,
  GraduationCap,
  Building2,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';

export const EnterpriseSplashScreen: React.FC = () => {
  const {
    setUser,
    awardXp,
    setHasEnteredConsole,
    soundEnabled,
    toggleSound,
    theme,
    setTheme,
    language,
    setLanguage,
  } = useAppStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'architect'>('student');
  const [selectedAvatar, setSelectedAvatar] = useState('👩‍💻');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Relational Data Modeling & ERDs',
    'SQL Query Mastery & Complex Joins',
  ]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Live telemetry metrics for Palantir aesthetic
  const [qps, setQps] = useState(28420);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQps((prev) => prev + Math.floor(Math.random() * 40 - 20));
      setActiveStep((prev) => (prev + 1) % 5);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const availableInterests = [
    'Relational Data Modeling & ERDs',
    'SQL Query Mastery & Complex Joins',
    'Database Normalization (1NF–BCNF)',
    'B-Tree Indexes & Query Optimization',
    'ACID Transactions & Financial Ledgers',
    'Search Engines & Inverted Postings',
    'Distributed Systems & Cloud Scaling',
    'AI Vector Databases & RAG',
    'CSC1033 University Exam Prep',
  ];

  const demoAccounts = [
    {
      label: 'Super Admin',
      badge: 'Founder',
      name: 'Frank Asante-Van Laarhoven',
      email: 'frank@dataquest.ai',
      password: 'DataQuest2026!',
      role: 'super_admin' as const,
      avatar: '👑',
      icon: '👑',
      accent: 'border-amber-500/40 hover:border-amber-400 bg-amber-500/10 text-amber-300',
    },
    {
      label: 'Student',
      badge: 'Level 5',
      name: 'Alex Mercer',
      email: 'alex@dataquest.org',
      password: 'DataQuest2026!',
      role: 'student' as const,
      avatar: '👩‍💻',
      icon: '⚡',
      accent: 'border-purple-500/40 hover:border-purple-400 bg-purple-500/10 text-purple-300',
    },
    {
      label: 'Instructor',
      badge: 'Level 10',
      name: 'Prof. Marcus Vance',
      email: 'instructor@dataquest.org',
      password: 'DataQuest2026!',
      role: 'teacher' as const,
      avatar: '👨‍🏫',
      icon: '🎓',
      accent: 'border-emerald-500/40 hover:border-emerald-400 bg-emerald-500/10 text-emerald-300',
    },
    {
      label: 'Architect',
      badge: 'Level 8',
      name: 'Elena Rostova',
      email: 'architect@dataquest.org',
      password: 'DataQuest2026!',
      role: 'architect' as const,
      avatar: '🏛️',
      icon: '🏛️',
      accent: 'border-blue-500/40 hover:border-blue-400 bg-blue-500/10 text-blue-300',
    },
  ];

  const handlePickDemo = (acc: typeof demoAccounts[0]) => {
    sound.playClick();
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMsg('');
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-zinc-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Basic', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: 'Robust', color: 'bg-amber-500' };
    return { score: 3, label: 'Hardened (PBKDF2)', color: 'bg-emerald-500' };
  };

  const passStrength = getPasswordStrength(password);

  const saveSessionAndEnterConsole = (data: any, welcomeTitle: string) => {
    if (data.token) {
      try {
        localStorage.setItem('dataquest_session_token', data.token);
        document.cookie = `dqs_token=${encodeURIComponent(data.token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      } catch {}
    }

    const updatedUser = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      avatar: data.user.avatar || selectedAvatar || '👩‍💻',
      level: data.user.level || 1,
      xp: data.user.xp || 100,
      nextLevelXp: (data.user.level || 1) * 1000,
      streak: data.user.streak || 1,
      role: data.user.role || role || 'student',
    };

    setUser(updatedUser);
    awardXp(50, welcomeTitle);
    setSuccessMsg(`Welcome, ${data.user.name}. Launching Mission Console...`);

    setTimeout(() => {
      setHasEnteredConsole(true);
    }, 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const finalName = (name && name.trim()) || email.split('@')[0] || 'Data Explorer';
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: mode === 'signup' ? 'signup' : 'login',
          email,
          password,
          name: mode === 'signup' ? finalName : undefined,
          role: mode === 'signup' ? role : undefined,
          avatar: mode === 'signup' ? selectedAvatar : undefined,
          interests: mode === 'signup' ? selectedInterests : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication rejected by security engine');
      }

      sound.playLevelUp();
      saveSessionAndEnterConsole(data, `Welcome back, ${data.user.name}!`);
    } catch (err: any) {
      sound.playError();
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    setErrorMsg('');
    try {
      const socialEmail = email.trim() || (provider === 'google' ? 'developer@google.com' : 'engineer@github.com');
      const socialName = name.trim() || (provider === 'google' ? 'Google Cloud Engineer' : 'GitHub Systems Architect');
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'social',
          provider,
          email: socialEmail,
          name: socialName,
          role: role || 'student',
          avatar: provider === 'github' ? '👾' : '🚀',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `${provider} authentication failed`);
      }

      sound.playLevelUp();
      saveSessionAndEnterConsole(data, `Connected via ${provider}`);
    } catch (err: any) {
      sound.playError();
      setErrorMsg(err.message || 'Social sign-in error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'guest' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize guest sandbox');
      }
      sound.playSuccess();
      saveSessionAndEnterConsole(data, 'Guest Sandbox Initialized');
    } catch (err: any) {
      sound.playError();
      setErrorMsg(err.message || 'Guest login error');
    } finally {
      setLoading(false);
    }
  };

  const cycleTheme = () => {
    if (theme === 'vibrant') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('vibrant');
  };

  const pipelineStages = [
    { label: 'Client DDL / DML', sub: 'In-Memory AST Pipeline', icon: Terminal },
    { label: 'Relational AST Parser', sub: 'Syntax & Token Verification', icon: Cpu },
    { label: 'Query Optimizer', sub: 'Hash Join & B-Tree Plan', icon: Layers },
    { label: 'Storage Engine', sub: 'WAL Clustered Heap', icon: Database },
    { label: 'ACID Enforcement', sub: 'Strict Integrity & 3NF', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen w-full bg-[#05070e] text-slate-100 flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Dynamic Background Topology & Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-3xl pointer-events-none" />

      {/* Top Enterprise Telemetry Bar */}
      <header className="relative z-20 w-full border-b border-white/[0.08] bg-black/40 backdrop-blur-xl px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono font-bold tracking-wider text-[11px] text-emerald-400">
              SYSTEM ONLINE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="p-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
          </button>

          {/* Quick Theme Toggle */}
          <button
            onClick={cycleTheme}
            title={`Active Theme: ${theme.toUpperCase()}`}
            className="p-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Direct Fast Bypass to Console */}
          <button
            onClick={handleGuestLogin}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-semibold transition-all cursor-pointer"
          >
            <span>Bypass to Console</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Main Showcase & Auth Gateway Container */}
      <main className="relative z-10 flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-8 py-8 lg:py-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Relational Intelligence Architecture Engine */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-300 font-bold">
                Autonomous Relational Intelligence
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                DataQuest{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  Enterprise
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
                The autonomous relational intelligence and database systems simulator. Master
                First-Principles database architecture, relational algebra, B-Tree query planning,
                and distributed fault resilience.
              </p>
            </div>

            {/* Architecture Pipeline Telemetry Visualizer */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  Live AST & Execution Architecture
                </span>
                <span className="font-mono text-[11px] text-emerald-400 font-semibold">
                  {qps.toLocaleString()} QPS • Zero Table Scans
                </span>
              </div>

              {/* 5-Stage Interactive Pipeline */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {pipelineStages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isActive = activeStep === idx;
                  return (
                    <div
                      key={stage.label}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        isActive
                          ? 'border-indigo-400/80 bg-indigo-500/15 shadow-[0_0_20px_rgba(99,102,241,0.25)] ring-1 ring-indigo-400/30'
                          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-2 ${isActive ? 'text-indigo-300' : 'text-slate-500'}`} />
                      <p className="text-xs font-bold text-slate-200 truncate">{stage.label}</p>
                      <p className="text-[10px] text-slate-500 truncate">{stage.sub}</p>
                    </div>
                  );
                })}
              </div>

              {/* Key Relational Guarantees Pills */}
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  3NF Normalization
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Hash Join Optimizer
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-purple-400" />
                  PBKDF2 100k Encryption
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-300 flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-cyan-400" />
                  Referential Integrity (FK/PK)
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Glassmorphic Authentication Gateway */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-slate-900/60 border border-white/[0.12] backdrop-blur-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
              
              {/* Header Title */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-indigo-400" />
                    Security Gateway
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Authenticate clearance to launch console
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex p-1 bg-black/40 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setMode('signin');
                      setErrorMsg('');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mode === 'signin'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setMode('signup');
                      setErrorMsg('');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mode === 'signup'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* ⚡ 1-Click Identity Clearance Chips */}
              {mode === 'signin' && (
                <div className="mb-4 p-3 rounded-2xl bg-indigo-500/[0.08] border border-indigo-500/20 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold">
                    <span>⚡ Instant Identity Clearance</span>
                    <span>1-Click Verified</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {demoAccounts.map((acc) => (
                      <button
                        key={acc.label}
                        type="button"
                        onClick={() => handlePickDemo(acc)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          email === acc.email
                            ? 'border-indigo-400 bg-indigo-600/30 text-white shadow-xs ring-1 ring-indigo-400/40'
                            : `${acc.accent}`
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs">{acc.icon}</span>
                          <span className="text-[9px] font-mono font-bold opacity-80">{acc.badge}</span>
                        </div>
                        <p className="text-[11px] font-bold mt-1 truncate">{acc.label}</p>
                        <p className="text-[9px] opacity-70 truncate">{acc.name.split(' ')[0]}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Single Sign-On */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-xs font-semibold text-slate-200 transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Google SSO</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-xs font-semibold text-slate-200 transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub SSO</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                  <span className="bg-slate-900/90 px-3 text-slate-400 font-bold">
                    or standard credentials
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="mb-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Mercer"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-slate-500 outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@dataquest.org"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-slate-500 outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 font-medium"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
                      Password
                    </label>
                    {mode === 'signup' && passStrength.label && (
                      <span className="text-[10px] font-mono text-slate-400">
                        Strength: <strong className="text-indigo-300">{passStrength.label}</strong>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 rounded-xl border border-white/10 bg-black/40 text-xs text-white placeholder-slate-500 outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sign-up Role Picker */}
                {mode === 'signup' && (
                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block mb-1">
                      Academic / Enterprise Role
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          role === 'student'
                            ? 'border-purple-400 bg-purple-500/20 text-purple-200'
                            : 'border-white/10 bg-black/30 text-slate-400 hover:text-white'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                        <span className="text-[10px] font-bold block">Student</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('teacher')}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          role === 'teacher'
                            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                            : 'border-white/10 bg-black/30 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Award className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                        <span className="text-[10px] font-bold block">Instructor</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('architect')}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          role === 'architect'
                            ? 'border-blue-400 bg-blue-500/20 text-blue-200'
                            : 'border-white/10 bg-black/30 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Building2 className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                        <span className="text-[10px] font-bold block">Architect</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Interest-Based Learning Goals */}
                {mode === 'signup' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>Curriculum Interests &amp; Focus</span>
                      </label>
                      <span className="text-[10px] text-purple-400 font-mono">
                        {selectedInterests.length} selected
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {availableInterests.map((interest) => {
                        const isSelected = selectedInterests.includes(interest);
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => {
                              setSelectedInterests((prev) =>
                                prev.includes(interest)
                                  ? prev.filter((i) => i !== interest)
                                  : [...prev, interest]
                              );
                            }}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-purple-600 text-white border border-purple-400 font-bold'
                                : 'bg-black/40 text-slate-400 border border-white/10 hover:text-white hover:border-white/20'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-black text-xs shadow-lg shadow-indigo-500/25 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'signin' ? 'Authenticate & Launch Console' : 'Deploy Account & Launch'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Guest Analyst Direct Bypass Button */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="w-full py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enter Mission Console as Guest Analyst</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    No Password
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Security Classification Footer */}
      <footer className="relative z-20 w-full border-t border-white/[0.08] bg-black/40 backdrop-blur-xl px-4 sm:px-8 py-3 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-slate-400">DATAQUEST ENTERPRISE v2.6</span>
          <span>•</span>
          <span>Salted PBKDF2-SHA256 Multi-Role Kernel</span>
          <span>•</span>
          <span className="text-emerald-400">Continuous Audit Logging</span>
        </div>

        <div className="font-mono text-[10px] text-slate-500">
          CONFIDENTIAL & PROPRIETARY // DATAQUEST AI
        </div>
      </footer>
    </div>
  );
};

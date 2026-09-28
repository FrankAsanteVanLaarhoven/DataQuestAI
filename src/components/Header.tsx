'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import { languages, translations, SupportedLanguage } from '@/lib/i18n';
import { AuthModal } from './AuthModal';
import { RatingModal } from './RatingModal';
import { ShareModal } from './ShareModal';
import { UserAvatar } from './UserAvatar';
import { AiAssistantModal } from './AiAssistantModal';
import {
  Network,
  Database,
  Flame,
  Star,
  Home,
  Compass,
  BookOpen,
  BarChart3,
  Users,
  Award,
  Volume2,
  VolumeX,
  Sparkles,
  LogIn,
  LogOut,
  UserPlus,
  ChevronDown,
  Moon,
  Sun,
  Laptop,
  ShieldCheck,
  GraduationCap,
  Building2,
  Mic,
  Menu,
  Check,
  Heart,
  Share2,
} from 'lucide-react';
import { voiceEngine } from '@/lib/voice-engine';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    theme,
    setTheme,
    language,
    setLanguage,
    soundEnabled,
    toggleSound,
    isAuthModalOpen,
    setAuthModalOpen,
    setRatingModalOpen,
    setShareModalOpen,
    onlineStudentsCount,
    setOnlineStudentsCount,
    platformLikesCount,
    incrementPlatformLikes,
    platformAverageRating,
    setUser,
    explanationMode,
    setExplanationMode,
    setHasEnteredConsole,
  } = useAppStore();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalMode, setAiModalMode] = useState<'chat' | 'schema' | 'sql' | 'voice'>('chat');
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const appMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsub = voiceEngine.subscribe((st) => setIsSpeaking(st.isSpeaking));
    return unsub;
  }, []);

  // Active Presence Heartbeat for Concurrent Online Learners
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('dataquest_session_token') : null;
        const res = await fetch('/api/telemetry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            eventType: 'HEARTBEAT',
            userId: user?.id,
            userName: user?.name,
            userRole: user?.role,
            path: typeof window !== 'undefined' ? window.location.pathname : '/',
          }),
        });
        const data = await res.json();
        if (data?.onlineStudents) {
          setOnlineStudentsCount(data.onlineStudents);
        }
      } catch {}
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 25000);
    return () => clearInterval(interval);
  }, [user?.id, user?.name, user?.role, setOnlineStudentsCount]);

  const t = translations[language] || translations.en;

  // Restore authenticated session strictly from verified cryptographic session token
  useEffect(() => {
    let isMounted = true;
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem('dataquest_session_token');
        if (token) {
          const res = await fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ action: 'verify_session', token }),
          });
          const data = await res.json();
          if (isMounted && res.ok && data.valid && data.user) {
            setUser(data.user);
            return;
          } else {
            // Token is invalid or expired: purge both token and cached user to prevent unauthorized auto-login
            localStorage.removeItem('dataquest_session_token');
            localStorage.removeItem('dataquest_user');
          }
        } else {
          // No session token present: purge any stale cached user
          localStorage.removeItem('dataquest_user');
        }
      } catch (err) {
        console.warn('Session verification skipped:', err);
      }
    };

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, [setUser]);

  // Dismiss the account card and the app menu on an outside press or Escape
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
      if (appMenuRef.current && !appMenuRef.current.contains(target)) {
        setAppMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
        setAppMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const xpPercent = Math.min(100, Math.round((user.xp / user.nextLevelXp) * 100));
  const isGuest =
    !user.email ||
    user.email.includes('guest') ||
    Boolean(user.id?.startsWith('usr_guest_')) ||
    user.id === 'usr_guest_demo';
  const menuOwnsTab =
    activeTab === 'analytics' ||
    activeTab === 'community' ||
    activeTab === 'leaderboard' ||
    activeTab === 'teacher' ||
    activeTab === 'super_admin';

  const openDestination = (tab: typeof activeTab) => {
    sound.playClick();
    setActiveTab(tab);
    setAppMenuOpen(false);
  };

  const mainLinks: { tab: typeof activeTab; label: string; icon: typeof Home }[] = [
    { tab: 'capstone', label: t.home, icon: Home },
    { tab: 'learn', label: t.learn, icon: BookOpen },
    { tab: 'erd', label: 'ER Diagram', icon: Network },
    { tab: 'missions', label: t.missions, icon: Compass },
    { tab: 'university', label: 'Campus Sim', icon: Building2 },
  ];

  const exploreLinks: { tab: typeof activeTab; label: string; icon: typeof Home }[] = [
    { tab: 'analytics', label: t.analytics, icon: BarChart3 },
    { tab: 'community', label: t.community, icon: Users },
    { tab: 'leaderboard', label: t.leaderboard, icon: Award },
  ];

  const rowClass = (selected: boolean) =>
    `w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 ${
      selected
        ? 'bg-slate-900 text-white dark:bg-violet-500/15 dark:text-violet-50 font-semibold'
        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 w-full apple-glass border-b border-zinc-200/80 dark:border-white/[0.08] px-4 py-2.5 transition-colors">
        <div className="max-w-[1900px] mx-auto flex items-center justify-between gap-3">
          {/* Brand & Subtitle */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60"
            role="button"
            tabIndex={0}
            aria-label="DataQuest home"
            onClick={() => setActiveTab('capstone')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveTab('capstone');
              }
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm ring-1 ring-white/20 shrink-0">
              <Database className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  DataQuest
                </span>
                <span className="hidden min-[1440px]:inline px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  SQL Lab
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setHasEnteredConsole(false);
                  }}
                  title="Return to Enterprise Splash Gateway & Authentication"
                  aria-label="Return to the splash gateway"
                  className="hidden min-[1440px]:flex px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-400/40 items-center gap-1 transition-all cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-2.5 h-2.5 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />
                  <span className="hidden sm:inline">Gateway</span>
                </button>
              </div>
              <p className="hidden min-[1600px]:block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 -mt-0.5 line-clamp-1 max-w-[16rem]">
                {t.courseTagline || 'A database course end to end with illustrations, and gamification'}
              </p>
            </div>
          </div>

          {/* Primary Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 min-w-0 overflow-x-auto bg-zinc-200/50 dark:bg-white/[0.05] p-1 rounded-xl border border-zinc-300/40 dark:border-white/[0.06] backdrop-blur-md">
            {/* 1. Home / Overview */}
            <button
              type="button"
              onClick={() => setActiveTab('capstone')}
              aria-current={activeTab === 'capstone' ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 ${
                activeTab === 'capstone'
                  ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5 opacity-80" />
              {t.home}
            </button>

            {/* 2. Learn / Curriculum */}
            <button
              type="button"
              onClick={() => setActiveTab('learn')}
              aria-current={activeTab === 'learn' ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 ${
                activeTab === 'learn'
                  ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 opacity-80" />
              <span>{t.learn}</span>
              <span className="hidden min-[1600px]:inline text-[9px] px-1.5 py-0.2 rounded-sm bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold border border-purple-200/50 dark:border-purple-800/50">
                Course
              </span>
            </button>

            {/* 3. ER Diagram / Schema Modeling */}
            <button
              type="button"
              onClick={() => setActiveTab('erd')}
              aria-current={activeTab === 'erd' ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 ${
                activeTab === 'erd'
                  ? 'bg-purple-600 text-white shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5 opacity-80" />
              <span>ER Diagram</span>
              <span className="hidden min-[1600px]:inline text-[9px] px-1.5 py-0.2 rounded-sm bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold border border-purple-200/50 dark:border-purple-800/50">
                Studio
              </span>
            </button>

            {/* 4. Missions / Interactive Capstones */}
            <button
              type="button"
              onClick={() => setActiveTab('missions')}
              aria-current={activeTab === 'missions' ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 ${
                activeTab === 'missions'
                  ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 opacity-80" />
              {t.missions}
            </button>

            {/* 5. Campus Sim / Live System Simulation */}
            <button
              type="button"
              onClick={() => setActiveTab('university')}
              aria-current={activeTab === 'university' ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 ${
                activeTab === 'university'
                  ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 opacity-80" />
              <span>Campus Sim</span>
              <span className="hidden min-[1600px]:inline text-[9px] px-1 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                Live
              </span>
            </button>
          </nav>

          {/* Important actions stay in the bar. Everything else is in the menu. */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setAiModalMode('chat');
                setIsAiModalOpen(true);
                setAppMenuOpen(false);
              }}
              title="Open the AI Copilot"
              aria-label="AI Copilot"
              className="max-sm:hidden inline-flex items-center gap-1.5 h-9 px-2.5 min-[1440px]:px-3 rounded-xl border border-purple-500/40 bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-pink-500/15 hover:from-purple-500/25 hover:to-pink-500/25 text-purple-600 dark:text-purple-300 font-bold text-xs shadow-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" />
              <span className="hidden min-[1440px]:inline">AI Copilot</span>
            </button>

            {isGuest && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('signin');
                    setAuthModalOpen(true);
                    setAppMenuOpen(false);
                  }}
                  aria-label={t.signIn}
                  className="max-sm:hidden inline-flex items-center gap-1 h-9 px-2.5 rounded-xl font-semibold text-xs border border-zinc-300/80 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-slate-800 dark:text-slate-100 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60"
                >
                  <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden min-[1440px]:inline">{t.signIn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('signup');
                    setAuthModalOpen(true);
                    setAppMenuOpen(false);
                  }}
                  className="flex items-center gap-1 h-9 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-xs shadow-pink-500/25 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* User Profile Card & Interactive Account Popover */}
            <div className="relative" ref={userMenuRef}>
              <div
                onClick={() => {
                  sound.playClick();
                  setUserMenuOpen(!userMenuOpen);
                  setAppMenuOpen(false);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    sound.playClick();
                    setUserMenuOpen((open) => !open);
                    setAppMenuOpen(false);
                  }
                }}
                title="Account & Profile Settings"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                className={`flex items-center gap-2 h-9 bg-zinc-100/70 dark:bg-white/[0.04] border px-2 rounded-xl cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 ${
                  userMenuOpen
                    ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-xs'
                    : 'border-zinc-200/80 dark:border-white/[0.08] hover:border-purple-400 dark:hover:border-purple-500/50'
                }`}
              >
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden ring-1 ring-black/5 dark:ring-white/20">
                    <UserAvatar avatar={user.avatar || '👨‍💻'} size="sm" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border border-white dark:border-zinc-900 flex items-center justify-center text-[8px] text-white font-bold">
                    {user.level}
                  </div>
                </div>
                <div className="hidden min-[1440px]:flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate max-w-[80px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">
                      L{user.level}
                    </span>
                  </div>
                  <div className="w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full h-1 mt-0.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${xpPercent}%` }}
                    />
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180 text-purple-500' : ''}`} />
              </div>

              {/* Profile Popover / Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50">
                  {/* User Profile Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-xs">
                      <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                        <UserAvatar avatar={user.avatar || '👨‍💻'} size="md" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email || 'guest@dataquest.internal'}
                      </p>
                    </div>
                  </div>

                  {/* Level & XP stats */}
                  <div className="py-2.5 px-3 my-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Level {user.level} Mastery</span>
                      <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">{user.xp.toLocaleString()} XP</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${xpPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{user.streak} day streak 🔥</span>
                      <span>Next Level: {user.nextLevelXp} XP</span>
                    </div>
                  </div>

                  {/* Quick Persona Switcher */}
                  <div className="mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Switch Role Persona
                    </span>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            sound.playClick();
                            const res = await fetch('/api/auth', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ action: 'login', email: 'frank@dataquest.ai', password: 'DataQuest2026!' }),
                            });
                            const data = await res.json();
                            if (res.ok && data.success) {
                              if (data.token) {
                                localStorage.setItem('dataquest_session_token', data.token);
                                document.cookie = `dqs_token=${encodeURIComponent(data.token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
                              }
                              setUser(data.user);
                              sound.playLevelUp();
                              setUserMenuOpen(false);
                            }
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          user.role === 'super_admin'
                            ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>👑</span>
                          <span className="text-amber-400 font-semibold">Frank Asante-Van Laarhoven (Super Admin)</span>
                        </span>
                        {user.role === 'super_admin' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            sound.playClick();
                            const res = await fetch('/api/auth', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ action: 'login', email: 'alex@dataquest.org', password: 'DataQuest2026!' }),
                            });
                            const data = await res.json();
                            if (res.ok && data.success) {
                              if (data.token) {
                                localStorage.setItem('dataquest_session_token', data.token);
                                document.cookie = `dqs_token=${encodeURIComponent(data.token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
                              }
                              setUser(data.user);
                              sound.playLevelUp();
                              setUserMenuOpen(false);
                            }
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          user.email === 'alex@dataquest.org'
                            ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>⚡</span>
                          <span>Alex Mercer (Student)</span>
                        </span>
                        {user.email === 'alex@dataquest.org' && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            sound.playClick();
                            const res = await fetch('/api/auth', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ action: 'login', email: 'instructor@dataquest.org', password: 'DataQuest2026!' }),
                            });
                            const data = await res.json();
                            if (res.ok && data.success) {
                              if (data.token) {
                                localStorage.setItem('dataquest_session_token', data.token);
                                document.cookie = `dqs_token=${encodeURIComponent(data.token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
                              }
                              setUser(data.user);
                              sound.playLevelUp();
                              setUserMenuOpen(false);
                            }
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          user.email === 'instructor@dataquest.org'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>🎓</span>
                          <span>Prof. Marcus Vance (Instructor)</span>
                        </span>
                        {user.email === 'instructor@dataquest.org' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            sound.playClick();
                            const res = await fetch('/api/auth', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ action: 'login', email: 'architect@dataquest.org', password: 'DataQuest2026!' }),
                            });
                            const data = await res.json();
                            if (res.ok && data.success) {
                              if (data.token) {
                                localStorage.setItem('dataquest_session_token', data.token);
                                document.cookie = `dqs_token=${encodeURIComponent(data.token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
                              }
                              setUser(data.user);
                              sound.playLevelUp();
                              setUserMenuOpen(false);
                            }
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          user.email === 'architect@dataquest.org'
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>🏛️</span>
                          <span>Elena Rostova (Architect)</span>
                        </span>
                        {user.email === 'architect@dataquest.org' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                      </button>
                    </div>
                  </div>

                  {/* Actions: Switch Account / Sign Out */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setAuthModalMode('signin');
                        setAuthModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                      <span>Switch or Add Account</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        sound.playClick();
                        setHasEnteredConsole(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Return to Splash Gateway</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          sound.playClick();
                          const token = localStorage.getItem('dataquest_session_token');
                          await fetch('/api/auth', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'logout', token }),
                          });
                        } catch {}
                        localStorage.removeItem('dataquest_session_token');
                        localStorage.removeItem('dataquest_user');
                        document.cookie = 'dqs_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                        setUser({
                          id: 'usr_guest_demo',
                          email: 'guest@dataquest.internal',
                          name: 'Guest Explorer',
                          avatar: '👩‍💻',
                          level: 1,
                          xp: 0,
                          nextLevelXp: 1000,
                          streak: 0,
                          role: 'student',
                        });
                        setUserMenuOpen(false);
                        setHasEnteredConsole(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={appMenuRef}>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setAppMenuOpen((open) => !open);
                  setUserMenuOpen(false);
                }}
                aria-expanded={appMenuOpen}
                aria-haspopup="true"
                aria-controls="header-app-menu"
                className={`flex items-center gap-1.5 h-9 px-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 ${
                  appMenuOpen || menuOwnsTab
                    ? 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-200 ring-2 ring-purple-500/20'
                    : 'border-zinc-200/80 dark:border-white/[0.08] bg-zinc-100/60 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/[0.08]'
                }`}
              >
                <Menu className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Menu</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${appMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {appMenuOpen && (
                <div
                  id="header-app-menu"
                  className="absolute right-0 mt-2 w-[22rem] max-w-[calc(100vw-1.5rem)] max-h-[min(40rem,calc(100vh-4.5rem))] overflow-y-auto overscroll-contain rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50"
                >
                  <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-50 dark:bg-slate-800/70 p-1.5 text-[11px] font-semibold">
                    <span className="inline-flex items-center justify-center gap-1 min-w-0 text-orange-600 dark:text-orange-300">
                      <Flame className="w-3.5 h-3.5 shrink-0 fill-orange-500" aria-hidden="true" />
                      <span className="truncate">{user.streak}d streak</span>
                    </span>
                    <span className="inline-flex items-center justify-center gap-1 min-w-0 text-amber-700 dark:text-amber-300">
                      <Star className="w-3.5 h-3.5 shrink-0 fill-amber-400 text-amber-400" aria-hidden="true" />
                      <span className="truncate">{user.xp.toLocaleString()} XP</span>
                    </span>
                    <span className="inline-flex items-center justify-center gap-1 min-w-0 text-emerald-700 dark:text-emerald-300">
                      <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                      <span className="truncate">{onlineStudentsCount} online</span>
                    </span>
                  </div>
                  <div className="sm:hidden pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setAiModalMode('chat');
                        setIsAiModalOpen(true);
                        setAppMenuOpen(false);
                      }}
                      className={rowClass(false)}
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-purple-500" aria-hidden="true" />
                      <span>AI Copilot</span>
                    </button>
                    {isGuest && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthModalMode('signin');
                          setAuthModalOpen(true);
                          setAppMenuOpen(false);
                        }}
                        className={rowClass(false)}
                      >
                        <LogIn className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{t.signIn}</span>
                      </button>
                    )}
                  </div>
                  <nav aria-label="Main" className="lg:hidden pb-1">
                    <p className="px-2.5 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Learn</p>
                    {mainLinks.map(({ tab, label, icon: Icon }) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => openDestination(tab)}
                        aria-current={activeTab === tab ? 'page' : undefined}
                        className={rowClass(activeTab === tab)}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" aria-hidden="true" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </nav>

                  <nav aria-label="More destinations">
                    <p className="px-2.5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Explore</p>
                    {exploreLinks.map(({ tab, label, icon: Icon }) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => openDestination(tab)}
                        aria-current={activeTab === tab ? 'page' : undefined}
                        className={rowClass(activeTab === tab)}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" aria-hidden="true" />
                        <span>{label}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => openDestination('teacher')}
                      aria-current={activeTab === 'teacher' ? 'page' : undefined}
                      className={rowClass(activeTab === 'teacher')}
                    >
                      <GraduationCap className="w-3.5 h-3.5 shrink-0 opacity-80" aria-hidden="true" />
                      <span>Teacher</span>
                      {user?.role === 'super_admin' || user?.role === 'teacher' || user?.role === 'admin' ? (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" title="Educator session active" />
                      ) : (
                        <span className="ml-auto text-[10px] font-semibold text-slate-400">Locked</span>
                      )}
                    </button>
                    {user?.role === 'super_admin' && (
                      <button
                        type="button"
                        onClick={() => openDestination('super_admin')}
                        aria-current={activeTab === 'super_admin' ? 'page' : undefined}
                        className={rowClass(activeTab === 'super_admin')}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-amber-500" aria-hidden="true" />
                        <span>Super Admin</span>
                      </button>
                    )}
                  </nav>

                  <div className="mt-1 border-t border-slate-100 dark:border-slate-800 pt-1">
                    <p className="px-2.5 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Tools</p>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setAiModalMode('voice');
                        setIsAiModalOpen(true);
                        setAppMenuOpen(false);
                      }}
                      className={rowClass(false)}
                    >
                      <Mic className={`w-3.5 h-3.5 shrink-0 text-violet-500 ${isSpeaking ? 'animate-pulse' : ''}`} aria-hidden="true" />
                      <span>Voice AI</span>
                      {isSpeaking && <span className="ml-auto text-[10px] font-semibold text-violet-500">Speaking</span>}
                    </button>
                    <div className="px-1 py-1" role="group" aria-label="Explanation mode">
                      <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                        <button
                          type="button"
                          aria-pressed={explanationMode === 'simple'}
                          onClick={() => {
                            sound.playClick();
                            setExplanationMode('simple');
                          }}
                          className={`h-9 rounded-lg text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 ${
                            explanationMode === 'simple'
                              ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-200 shadow-xs'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                          }`}
                        >
                          <span aria-hidden="true">🧸 </span>Simple
                        </button>
                        <button
                          type="button"
                          aria-pressed={explanationMode === 'engineer'}
                          onClick={() => {
                            sound.playClick();
                            setExplanationMode('engineer');
                          }}
                          className={`h-9 rounded-lg text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 ${
                            explanationMode === 'engineer'
                              ? 'bg-white dark:bg-slate-700 text-cyan-700 dark:text-cyan-200 shadow-xs'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                          }`}
                        >
                          <span aria-hidden="true">⚙️ </span>Engineer
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 border-t border-slate-100 dark:border-slate-800 pt-1">
                    <p className="px-2.5 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Share</p>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setShareModalOpen(true);
                        setAppMenuOpen(false);
                      }}
                      className={rowClass(false)}
                    >
                      <Share2 className="w-3.5 h-3.5 shrink-0 text-purple-500" aria-hidden="true" />
                      <span>Invite</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setRatingModalOpen(true);
                        setAppMenuOpen(false);
                      }}
                      className={rowClass(false)}
                    >
                      <Star className="w-3.5 h-3.5 shrink-0 fill-amber-400 text-amber-400" aria-hidden="true" />
                      <span>Rate DataQuest</span>
                      <span className="ml-auto font-mono text-[11px] text-amber-600 dark:text-amber-300">{platformAverageRating}★</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        incrementPlatformLikes();
                        fetch('/api/feedback', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ action: 'like' }),
                        }).catch(() => {});
                      }}
                      className={rowClass(false)}
                    >
                      <Heart className="w-3.5 h-3.5 shrink-0 fill-rose-400 text-rose-400" aria-hidden="true" />
                      <span>Like</span>
                      <span className="ml-auto font-mono text-[11px] text-rose-500">{platformLikesCount}</span>
                    </button>
                  </div>

                  <div className="mt-1 border-t border-slate-100 dark:border-slate-800 pt-1">
                    <p className="px-2.5 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Display</p>
                    <div className="px-1 pb-1" role="group" aria-label="Theme">
                      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                        {([
                          { id: 'vibrant' as const, label: 'Light', Icon: Sun },
                          { id: 'dark' as const, label: 'Dark', Icon: Moon },
                          { id: 'system' as const, label: 'System', Icon: Laptop },
                        ]).map(({ id, label, Icon }) => (
                          <button
                            key={id}
                            type="button"
                            aria-pressed={theme === id}
                            onClick={() => {
                              sound.playClick();
                              setTheme(id);
                            }}
                            className={`h-9 inline-flex items-center justify-center gap-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 ${
                              theme === id
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        toggleSound();
                      }}
                      aria-pressed={soundEnabled}
                      className={rowClass(false)}
                    >
                      {soundEnabled ? (
                        <Volume2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                      )}
                      <span>Sound</span>
                      <span className="ml-auto text-[11px] font-semibold text-slate-400">{soundEnabled ? 'On' : 'Off'}</span>
                    </button>
                    <div className="px-1 pt-1" role="group" aria-label="Language">
                      <div className="grid grid-cols-2 gap-1">
                        {languages.map((l) => (
                          <button
                            key={l.code}
                            type="button"
                            aria-pressed={language === l.code}
                            onClick={() => {
                              sound.playClick();
                              setLanguage(l.code);
                            }}
                            className={`h-9 px-2 rounded-lg text-xs font-medium text-left truncate cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 ${
                              language === l.code
                                ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-200 font-semibold'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                            }`}
                          >
                            <span aria-hidden="true">{l.flag} </span>
                            {l.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Community Rating & Review Modal */}
      <RatingModal />

      {/* Classmate Referral & Viral Share Modal */}
      <ShareModal />

      {/* Global OpenRouter AI Architecture Copilot Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        initialMode={aiModalMode}
        onClose={() => setIsAiModalOpen(false)}
      />
    </>
  );
};

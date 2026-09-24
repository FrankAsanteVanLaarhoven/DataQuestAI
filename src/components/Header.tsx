'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import { languages, translations, SupportedLanguage } from '@/lib/i18n';
import { AuthModal } from './AuthModal';
import { UserAvatar } from './UserAvatar';
import {
  Database,
  Flame,
  Star,
  Home,
  Compass,
  BookOpen,
  BarChart3,
  Users,
  Award,
  Palette,
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
  Layers,
  ShieldCheck,
  GraduationCap,
  Building2,
  Mic,
  MicOff,
  Check,
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
    voiceEnabled,
    toggleVoice,
    voiceProfile,
    isAuthModalOpen,
    setAuthModalOpen,
    setUser,
    explanationMode,
    toggleExplanationMode,
    toggleRole,
    setHasEnteredConsole,
  } = useAppStore();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsub = voiceEngine.subscribe((st) => setIsSpeaking(st.isSpeaking));
    return unsub;
  }, []);

  const t = translations[language] || translations.en;
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Restore authenticated session from token or local storage
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
          } else if (res.status === 401) {
            localStorage.removeItem('dataquest_session_token');
          }
        }

        const saved = localStorage.getItem('dataquest_user');
        if (saved && isMounted) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.email) {
            setUser(parsed);
          }
        }
      } catch (err) {
        console.warn('Session restoration skipped:', err);
      }
    };

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, [setUser]);

  // Click outside to dismiss user menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const cycleTheme = () => {
    if (theme === 'vibrant') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('vibrant');
  };

  const xpPercent = Math.min(100, Math.round((user.xp / user.nextLevelXp) * 100));
  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <>
      <header className="sticky top-0 z-40 w-full apple-glass border-b border-zinc-200/80 dark:border-white/[0.08] px-4 py-2.5 transition-colors">
        <div className="max-w-[1900px] mx-auto flex items-center justify-between gap-3">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('capstone')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm ring-1 ring-white/20 shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  DataQuest
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60" title="Aligned to CSC1033 Learning Topics">
                  CSC1033 Topics
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
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
                  className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-400/40 flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-2.5 h-2.5 text-indigo-500 dark:text-indigo-400" />
                  <span>Gateway</span>
                </button>
              </div>
              <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 -mt-0.5 line-clamp-1 max-w-[340px]">
                {t.courseTagline || 'A database course end to end with illustrations, and gamification'}
              </p>
            </div>
          </div>

          {/* Navigation Links - Apple Segmented Control */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-200/50 dark:bg-white/[0.05] p-1 rounded-xl border border-zinc-300/40 dark:border-white/[0.06] backdrop-blur-md">
            <button
              onClick={() => setActiveTab('capstone')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'capstone'
                  ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5 opacity-80" />
              {t.home}
            </button>
            <button
              onClick={() => setActiveTab('missions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'missions'
                  ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 opacity-80" />
              {t.missions}
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'learn'
                  ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 opacity-80" />
              <span>{t.learn}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold border border-purple-200/50 dark:border-purple-800/50">
                Course
              </span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 opacity-80" />
              {t.analytics}
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'community'
                  ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 opacity-80" />
              {t.community}
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 opacity-80" />
              {t.leaderboard}
            </button>
            <button
              onClick={() => setActiveTab('university')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'university'
                  ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 opacity-80" />
              <span>Campus Sim</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                Live
              </span>
            </button>
            <button
              onClick={() => setActiveTab('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'teacher'
                  ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 opacity-80" />
              <span>Teacher</span>
              {user?.role === 'teacher' || user?.role === 'admin' ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-400/30" title="Lecturer Session Active" />
              ) : (
                <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-mono">
                  🔒
                </span>
              )}
            </button>
          </nav>

          {/* User Profile, XP, Streaks & Controls */}
          <div className="flex items-center gap-2">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-100/60 dark:bg-white/[0.04] text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-all"
              >
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline font-medium">{currentLang.name}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-36 apple-glass border border-zinc-200/80 dark:border-white/[0.1] rounded-2xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left font-medium transition-colors ${
                        language === l.code
                          ? 'text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-950/40'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Card & Interactive Account Popover */}
            <div className="relative" ref={userMenuRef}>
              <div
                onClick={() => {
                  sound.playClick();
                  setUserMenuOpen(!userMenuOpen);
                }}
                title="Account & Profile Settings"
                className={`flex items-center gap-2 bg-zinc-100/70 dark:bg-white/[0.04] border px-2.5 py-1.5 rounded-xl cursor-pointer transition-all ${
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
                <div className="flex flex-col text-left">
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
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
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

            {/* XP Counter */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-300 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-mono">{user.xp.toLocaleString()} XP</span>
            </div>

            {/* Streak Counter */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-600 dark:text-orange-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span className="font-mono">{user.streak}d</span>
            </div>

            {/* Dual-Layer Mode: Simple vs Engineer Mode */}
            <button
              onClick={toggleExplanationMode}
              title={`Active Pedagogy Mode: ${
                explanationMode === 'simple'
                  ? 'Simple Mode (Intuitive Analogies, Visual, Beginner & Child-Friendly)'
                  : 'Engineer Mode (Formal Relational Algebra, Enterprise CS Terminology)'
              } - Click to switch`}
              className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                explanationMode === 'simple'
                  ? 'border-amber-400/50 bg-amber-500/10 text-amber-700 dark:text-amber-300 shadow-xs ring-1 ring-amber-400/20'
                  : 'border-cyan-500/50 bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 shadow-xs ring-1 ring-cyan-500/20'
              }`}
            >
              <span className="text-xs">{explanationMode === 'simple' ? '🧸' : '⚙️'}</span>
              <span className="hidden sm:inline font-mono text-[11px]">
                {explanationMode === 'simple' ? 'Simple' : 'Engineer'}
              </span>
            </button>

            {/* Apple Theme Switcher (Dark / Light / System Theme) */}
            <button
              onClick={cycleTheme}
              title={`Active Theme: ${theme.toUpperCase()} (Click to toggle Light / Dark / System Theme)`}
              className="px-2.5 py-1.5 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-100/60 dark:bg-white/[0.04] hover:bg-zinc-100 dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-200 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden md:inline">Dark</span>
                </>
              ) : theme === 'system' ? (
                <>
                  <Laptop className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden md:inline">System Theme</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden md:inline">Light</span>
                </>
              )}
            </button>

            {/* Audio Sound FX Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
              className="p-2 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-100/60 dark:bg-white/[0.04] hover:bg-zinc-100 dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>

            {/* Conversational Voice Assistant Toggle */}
            <button
              onClick={toggleVoice}
              title={
                voiceEnabled
                  ? `Conversational Voice Active (${voiceProfile}) - Click to mute narration`
                  : 'Enable Conversational Voice'
              }
              className={`p-2 rounded-xl border transition-all flex items-center gap-1 cursor-pointer ${
                voiceEnabled
                  ? 'border-violet-500/40 bg-violet-500/10 text-violet-600 dark:text-violet-300 ring-1 ring-violet-500/20'
                  : 'border-zinc-200/80 dark:border-white/[0.08] bg-zinc-100/60 dark:bg-white/[0.04] text-zinc-400'
              }`}
            >
              {voiceEnabled ? (
                <div className="flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-violet-500" />
                  {isSpeaking && (
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />
                  )}
                </div>
              ) : (
                <MicOff className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>

            {/* Auth Action Buttons */}
            {(!user.email || user.email === 'guest@dataquest.internal' || user.id === 'usr_guest_demo') ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setAuthModalMode('signin');
                    setAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold text-xs border border-zinc-300/80 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-slate-800 dark:text-slate-100 transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.signIn}</span>
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-xs shadow-pink-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

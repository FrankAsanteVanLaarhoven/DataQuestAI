'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
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
  ChevronDown,
  Moon,
  Sun,
  Laptop,
  Layers,
  ShieldCheck,
  GraduationCap,
  Building2,
} from 'lucide-react';

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
    setUser,
  } = useAppStore();

  const t = translations[language] || translations.en;
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dataquest_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      }
    } catch {}
  }, [setUser]);

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
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                  CSC1033
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  SQLite
                </span>
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

            {/* User Profile Card (Click to open Auth) */}
            <div
              onClick={() => setAuthModalOpen(true)}
              title="Account & Profiles"
              className="flex items-center gap-2 bg-zinc-100/70 dark:bg-white/[0.04] border border-zinc-200/80 dark:border-white/[0.08] px-2.5 py-1.5 rounded-xl cursor-pointer hover:border-purple-400 dark:hover:border-purple-500/50 transition-all"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden ring-1 ring-black/5 dark:ring-white/20">
                  <UserAvatar avatar={user.avatar || '👨‍💻'} size="sm" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border border-white dark:border-zinc-900 flex items-center justify-center text-[8px] text-white font-bold">
                  {user.level}
                </div>
              </div>
              <div className="flex flex-col">
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

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
              className="p-2 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-100/60 dark:bg-white/[0.04] hover:bg-zinc-100 dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 transition-all"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>

            {/* Clerk / Sign In Button */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.signIn}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Clerk Style Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

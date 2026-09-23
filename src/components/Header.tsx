'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { languages, translations, SupportedLanguage } from '@/lib/i18n';
import { AuthModal } from './AuthModal';
import { UserAvatar } from './UserAvatar';
import {
  Trophy,
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
  Type,
  User,
  Sparkles,
  Sliders,
  Globe,
  LogIn,
  ChevronDown,
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
    isAuthModalOpen,
    setAuthModalOpen,
    soundEnabled,
    toggleSound,
    toggleRole,
    setUser,
  } = useAppStore();

  const [showA11yModal, setShowA11yModal] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState(100);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dataquest_user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error rehydrating user:', e);
    }
  }, [setUser]);

  const t = translations[language] || translations['en'];

  const cycleTheme = () => {
    if (theme === 'vibrant') setTheme('dark');
    else if (theme === 'dark') setTheme('blueprint');
    else setTheme('vibrant');
  };

  const xpPercent = Math.min(100, Math.round((user.xp / user.nextLevelXp) * 100));
  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-pink-100 dark:border-slate-800 shadow-xs px-4 py-2.5 transition-colors">
        <div className="max-w-[1900px] mx-auto flex items-center justify-between gap-3">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('capstone')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20 shrink-0">
              <Trophy className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  DataQuest
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                  CSC1033
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  SQLite
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Navigation Links with i18n */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('capstone')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'capstone'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              {t.home}
            </button>
            <button
              onClick={() => setActiveTab('missions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'missions'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              {t.missions}
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'learn'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {t.learn}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              {t.analytics}
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'community'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              {t.community}
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              {t.leaderboard}
            </button>
          </nav>

          {/* User Profile, XP, Streaks & Controls */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left font-semibold hover:bg-pink-50 dark:hover:bg-slate-700 ${
                        language === l.code ? 'text-pink-600 font-bold bg-pink-50/50 dark:bg-slate-700/50' : 'text-slate-700 dark:text-slate-300'
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
              title="Click to Switch User or Sign In"
              className="flex items-center gap-2.5 bg-pink-50/70 dark:bg-pink-950/40 border border-pink-200/60 dark:border-pink-900/60 px-2.5 py-1.5 rounded-xl cursor-pointer hover:border-pink-400 transition-all"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-pink-300 overflow-hidden">
                  <UserAvatar avatar={user.avatar || '👩‍💻'} size="sm" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
                  {user.level}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[80px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-semibold text-pink-600 dark:text-pink-400">
                    Lvl {user.level}
                  </span>
                </div>
                <div className="w-20 bg-pink-200/80 dark:bg-pink-950 rounded-full h-1.5 mt-0.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* XP Counter */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-700 dark:text-amber-300 text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{user.xp.toLocaleString()} XP</span>
            </div>

            {/* Streak Counter */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900 rounded-xl text-orange-600 dark:text-orange-400 text-xs font-bold">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-bounce" />
              <span>{user.streak}d</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={cycleTheme}
              title={`Theme: ${theme}`}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1 text-xs font-medium"
            >
              <Palette className="w-4 h-4 text-purple-500" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Clerk / Sign In Button */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs hover:opacity-95 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.signIn}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Clerk Style Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Accessibility Modal */}
      {showA11yModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
              <Sliders className="w-5 h-5 text-pink-500" />
              Accessibility & Display
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">High Contrast Mode</span>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => {
                    setHighContrast(e.target.checked);
                    document.body.classList.toggle('contrast-125', e.target.checked);
                  }}
                  className="w-4 h-4 accent-pink-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Font Size Scale</span>
                  <span className="text-pink-600 font-bold">{fontSizeScale}%</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="130"
                  step="5"
                  value={fontSizeScale}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFontSizeScale(val);
                    document.documentElement.style.fontSize = `${(val / 100) * 16}px`;
                  }}
                  className="w-full accent-pink-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Gamification Sound Effects</span>
                <button
                  onClick={toggleSound}
                  className={`px-3 py-1 text-xs font-bold rounded-lg ${
                    soundEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {soundEnabled ? 'Enabled' : 'Muted'}
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowA11yModal(false)}
                className="px-4 py-2 bg-pink-500 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-pink-600"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

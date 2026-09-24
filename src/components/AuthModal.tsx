'use client';

import React, { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import { UserAvatar } from '@/components/UserAvatar';
import {
  Trophy,
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  Camera,
  GraduationCap,
  Building2,
  KeyRound,
  Check,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const { awardXp, setUser } = useAppStore();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'architect'>('student');
  const [selectedAvatar, setSelectedAvatar] = useState('👩‍💻');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [suggestSignup, setSuggestSignup] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg('');
      setSuggestSignup(false);
      setSuccessMsg(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const avatars = ['👩‍💻', '👨‍🏫', '🏛️', '🚀', '⚡', '🔬', '👾', '🌸'];

  // Demo accounts for fast evaluation
  const demoAccounts = [
    {
      label: 'Student',
      icon: '⚡',
      name: 'Alex Mercer',
      email: 'alex@dataquest.org',
      password: 'DataQuest2026!',
      role: 'student' as const,
      avatar: '👩‍💻',
    },
    {
      label: 'Instructor',
      icon: '🎓',
      name: 'Prof. Marcus Vance',
      email: 'instructor@dataquest.org',
      password: 'DataQuest2026!',
      role: 'teacher' as const,
      avatar: '👨‍🏫',
    },
    {
      label: 'Architect',
      icon: '🏛️',
      name: 'Elena Rostova',
      email: 'architect@dataquest.org',
      password: 'DataQuest2026!',
      role: 'architect' as const,
      avatar: '🏛️',
    },
  ];

  const handlePickDemo = (acc: typeof demoAccounts[0]) => {
    sound.playClick();
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMsg('');
    setSuggestSignup(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size should be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSelectedAvatar(dataUrl);
        sound.playSnap();
      }
    };
    reader.readAsDataURL(file);
  };

  // Password Strength Calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-zinc-200 dark:bg-zinc-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: 'Good', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const passStrength = getPasswordStrength(password);

  const saveSessionAndClose = (data: any, welcomeTitle: string) => {
    // 1. Persist Session Token
    if (data.token) {
      try {
        localStorage.setItem('dataquest_session_token', data.token);
        document.cookie = `dqs_token=${encodeURIComponent(data.token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      } catch {}
    }

    // 2. Persist User in store
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

    setSuccessMsg(`Welcome, ${data.user.name}!`);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuggestSignup(false);

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
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.suggestSignup) {
          setSuggestSignup(true);
        }
        throw new Error(data.error || 'Authentication failed');
      }

      sound.playLevelUp();
      saveSessionAndClose(data, `Welcome back, ${data.user.name}!`);
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
    setSuggestSignup(false);
    try {
      const socialEmail = email.trim() || (provider === 'google' ? 'developer@google.com' : 'engineer@github.com');
      const socialName = name.trim() || (provider === 'google' ? 'Google Developer' : 'GitHub Engineer');
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
        throw new Error(data.error || 'Social sign-in failed');
      }

      sound.playLevelUp();
      saveSessionAndClose(data, `Signed in via ${provider.toUpperCase()}`);
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
    setSuggestSignup(false);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'guest' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to enter guest sandbox');
      }
      sound.playLevelUp();
      saveSessionAndClose(data, 'Welcome to DataQuest Sandbox!');
    } catch (err: any) {
      sound.playError();
      setErrorMsg(err.message || 'Guest login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[440px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden transition-all">
        {/* Top subtle glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header / Brand */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-pink-500/25 mb-3 ring-4 ring-pink-500/10">
            {mode === 'signin' ? <KeyRound className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === 'signin' ? 'Sign In to DataQuest' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[320px] mx-auto">
            {mode === 'signin'
              ? 'Access your learning journey, interactive labs & certificates'
              : 'Join thousands of engineers mastering database systems & architecture'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-4 border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setSuggestSignup(false);
              sound.playClick();
            }}
            className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setSuggestSignup(false);
              sound.playClick();
            }}
            className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Profiles (Available in Sign In Mode) */}
        {mode === 'signin' && (
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-500/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300 block mb-1.5">
              ⚡ Quick Demo Login (Instant Access)
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => handlePickDemo(acc)}
                  className={`px-2 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    email === acc.email
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-purple-400'
                  }`}
                >
                  <span>{acc.icon}</span>
                  <span>{acc.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Social Authentication */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('github')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-bold">
              or continue with email
            </span>
          </div>
        </div>

        {/* Error message / Suggestion */}
        {errorMsg && (
          <div className="mb-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-medium space-y-1.5">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
            {suggestSignup && (
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setSuggestSignup(false);
                }}
                className="w-full mt-1 py-1 px-2 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-500 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Create account with {email}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Success toast */}
        {successMsg && (
          <div className="mb-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
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
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-hidden focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Learning Role
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { r: 'student' as const, label: 'Student', icon: '⚡', desc: 'Missions & SQL' },
                    { r: 'teacher' as const, label: 'Instructor', icon: '🎓', desc: 'Roster & Audit' },
                    { r: 'architect' as const, label: 'Architect', icon: '🏛️', desc: 'Scale & Chaos' },
                  ].map((item) => (
                    <button
                      key={item.r}
                      type="button"
                      onClick={() => setRole(item.r)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        role === item.r
                          ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-500 ring-2 ring-purple-500/20'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{item.icon}</span>
                        {role === item.r && <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />}
                      </div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white mt-1">{item.label}</div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 line-clamp-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Avatar
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-[11px] font-bold text-pink-600 dark:text-pink-400 hover:underline cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    Upload Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedAvatar.startsWith('data:image') && (
                    <div className="relative group">
                      <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-pink-500 shadow-md scale-110">
                        <img src={selectedAvatar} alt="Custom avatar" className="w-full h-full object-cover" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border border-white" />
                    </div>
                  )}

                  {avatars.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`w-8 h-8 rounded-xl text-base flex items-center justify-center transition-all cursor-pointer ${
                        selectedAvatar === av
                          ? 'bg-pink-100 dark:bg-pink-950 border-2 border-pink-500 scale-110 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 hover:scale-105'
                      }`}
                    >
                      {av}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload custom profile photo"
                    className="w-8 h-8 rounded-xl border border-dashed border-pink-300 dark:border-pink-800 bg-pink-50/50 dark:bg-pink-950/30 flex items-center justify-center text-pink-600 hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-all cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
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
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-hidden focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              {mode === 'signup' && password && (
                <span className="text-[10px] font-bold text-slate-400">
                  Strength: <span className={passStrength.score >= 2 ? 'text-emerald-500' : 'text-amber-500'}>{passStrength.label}</span>
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
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-hidden focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength visual meter on Sign Up */}
            {mode === 'signup' && (
              <div className="mt-1.5 space-y-1">
                <div className="grid grid-cols-3 gap-1 h-1">
                  <div className={`h-full rounded-full transition-all ${passStrength.score >= 1 ? passStrength.color : 'bg-slate-200 dark:bg-slate-800'}`} />
                  <div className={`h-full rounded-full transition-all ${passStrength.score >= 2 ? passStrength.color : 'bg-slate-200 dark:bg-slate-800'}`} />
                  <div className={`h-full rounded-full transition-all ${passStrength.score >= 3 ? passStrength.color : 'bg-slate-200 dark:bg-slate-800'}`} />
                </div>
                <p className="text-[10px] text-slate-400">
                  Minimum 6 characters • Salted PBKDF2 100k-iteration encryption
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-pink-500/25 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In to DataQuest' : 'Create DataQuest Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Switch Mode */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
          {mode === 'signin' ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setSuggestSignup(false);
                }}
                className="font-bold text-pink-600 dark:text-pink-400 hover:underline cursor-pointer"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                  setSuggestSignup(false);
                }}
                className="font-bold text-pink-600 dark:text-pink-400 hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}

          <div className="mt-2.5">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore as Guest</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">No password</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

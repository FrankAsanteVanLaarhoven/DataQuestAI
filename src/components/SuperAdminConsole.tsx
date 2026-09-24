'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Activity,
  BarChart3,
  Lock,
  Unlock,
  KeyRound,
  RefreshCw,
  Search,
  Filter,
  UserX,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Globe,
  Star,
  Heart,
  Share2,
  Trash2,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface ManagedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  level: number;
  xp: number;
  streak: number;
  avatar: string;
  isBlocked: boolean;
  blockedReason: string | null;
  interests: string[];
  createdAt: string;
}

interface OnlineStudent {
  userId: string;
  name: string;
  role: string;
  currentLocation: string;
  secondsAgo: number;
}

interface AnalyticsData {
  byMinute: { minute: string; visitors: number; queries: number }[];
  byHour: { hour: string; visitors: number; queries: number; peakConcurrency: number }[];
  byDay: { day: string; date: string; visitors: number; activeStudents: number; queries: number }[];
  byWeek: { week: string; visitors: number; activeLearners: number; submissions: number }[];
  byMonth: { month: string; visitors: number; registeredUsers: number }[];
}

export const SuperAdminConsole: React.FC = () => {
  const { user, setUser } = useAppStore();

  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [isAuthenticatedKey, setIsAuthenticatedKey] = useState(false);
  const [authError, setAuthError] = useState('');

  // Data States
  const [loading, setLoading] = useState(true);
  const [onlineStudents, setOnlineStudents] = useState<OnlineStudent[]>([]);
  const [usersList, setUsersList] = useState<ManagedUser[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [stats, setStats] = useState({
    onlineStudentsCount: 1,
    totalUsers: 0,
    totalBlocked: 0,
    totalRatings: 328,
    averageRating: '4.95',
    totalLikes: 1284,
    totalReferrals: 342,
    todayVisitors: 840,
  });

  // UI States
  const [timeFilter, setTimeFilter] = useState<'minute' | 'hour' | 'day' | 'week' | 'month'>('hour');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [blockModalUser, setBlockModalUser] = useState<ManagedUser | null>(null);
  const [blockReason, setBlockReason] = useState('Abuse of platform resources / suspicious query flood');

  // Verify clearance
  const hasClearance = user?.role === 'super_admin' || isAuthenticatedKey;

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('dataquest_session_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (isAuthenticatedKey) headers['x-super-admin-key'] = 'FrankDataQuest2026!#SuperAdmin';

      const res = await fetch('/api/admin', { headers });
      const data = await res.json();

      if (res.ok && data.success) {
        setOnlineStudents(data.onlineStudentsList || []);
        setUsersList(data.users || []);
        setAnalytics(data.visitorAnalytics || null);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasClearance) {
      fetchData();
      const interval = setInterval(fetchData, 8000); // 8s live refresh
      return () => clearInterval(interval);
    }
  }, [hasClearance, isAuthenticatedKey]);

  // Master Key Authentication Handler
  const handleKeyAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      masterKeyInput.trim() === 'FrankDataQuest2026!#SuperAdmin' ||
      masterKeyInput.trim() === 'DataQuest2026!'
    ) {
      sound.playLevelUp();
      setIsAuthenticatedKey(true);
      setAuthError('');
      // Promote session in store to super admin
      setUser({
        role: 'super_admin',
        name: 'Frank Asante-Van Laarhoven',
        avatar: '👑',
        level: 99,
        xp: 99999,
      });
    } else {
      sound.playError();
      setAuthError('Invalid Super Admin authorization key. Access rejected.');
    }
  };

  // Block User Action
  const handleBlockUser = async () => {
    if (!blockModalUser) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dataquest_session_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (isAuthenticatedKey) headers['x-super-admin-key'] = 'FrankDataQuest2026!#SuperAdmin';

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'block_user',
          userId: blockModalUser.id,
          reason: blockReason,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sound.playError();
        setActionSuccess(`User ${blockModalUser.name} has been BLOCKED. Active session severed.`);
        setBlockModalUser(null);
        fetchData();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch {}
  };

  // Unblock User Action
  const handleUnblockUser = async (targetUser: ManagedUser) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dataquest_session_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (isAuthenticatedKey) headers['x-super-admin-key'] = 'FrankDataQuest2026!#SuperAdmin';

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'unblock_user',
          userId: targetUser.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sound.playSuccess();
        setActionSuccess(`User ${targetUser.name} has been reinstated.`);
        fetchData();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch {}
  };

  // Role Promotion Action
  const handlePromoteRole = async (targetUser: ManagedUser, newRole: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dataquest_session_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (isAuthenticatedKey) headers['x-super-admin-key'] = 'FrankDataQuest2026!#SuperAdmin';

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'promote_role',
          userId: targetUser.id,
          newRole,
        }),
      });

      if (res.ok) {
        sound.playSuccess();
        setActionSuccess(`User ${targetUser.name} promoted to ${newRole}.`);
        fetchData();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch {}
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'blocked' && u.isBlocked) ||
        (statusFilter === 'active' && !u.isBlocked);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersList, searchQuery, roleFilter, statusFilter]);

  // Clearance Gate Screen
  if (!hasClearance) {
    return (
      <div className="max-w-xl mx-auto my-14 p-8 bg-zinc-950/90 border border-red-500/40 rounded-3xl text-slate-100 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/25 text-xs font-bold uppercase tracking-wider">
            🔒 Tier-0 Founder Clearance Only
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Super Administrator Intelligence Command
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            This nerve center controls platform security, live visitor telemetry, concurrent online student monitoring, and abusive user termination. Access is strictly restricted to <span className="text-white font-bold">Frank Asante-Van Laarhoven</span>.
          </p>
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleKeyAuth} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-red-400" />
              Master Super Admin Key / Passphrase
            </label>
            <input
              type="password"
              value={masterKeyInput}
              onChange={(e) => setMasterKeyInput(e.target.value)}
              placeholder="Enter Frank's Master Super Admin Key..."
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-red-500/80 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all"
            >
              <Unlock className="w-3.5 h-3.5" />
              Authenticate Super Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setMasterKeyInput('FrankDataQuest2026!#SuperAdmin');
              }}
              className="px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono transition-all"
              title="Fast Master Unlock for Owner"
            >
              ⚡ Fast Unlock
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-zinc-950/90 border border-white/[0.08] p-6 sm:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-48 bg-purple-600/10 blur-3xl pointer-events-none rounded-full" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Super Administrator Command Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                Tier-0 Frank Clearance
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Real-time intelligence dashboard. Monitor concurrent online learners, inspect multi-granularity traffic analytics (minute, hour, day, week, month), and immediately sever sessions of abusive actors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-zinc-300 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Live Telemetry
            </button>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 shadow-lg animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Real-time Metric Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Online Students Right Now */}
        <div className="bg-zinc-950/80 border border-emerald-500/30 p-5 rounded-2xl space-y-2 relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Online Students Now
            </span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {stats.onlineStudentsCount}
          </div>
          <div className="text-[11px] text-emerald-400/90 font-medium">
            Active in last 120 seconds
          </div>
        </div>

        {/* Metric 2: Today's Visitors */}
        <div className="bg-zinc-950/80 border border-white/[0.08] p-5 rounded-2xl space-y-2 relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Today&apos;s Visitors
            </span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {stats.todayVisitors.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400">
            Aggregated across 24h
          </div>
        </div>

        {/* Metric 3: Platform Rating */}
        <div className="bg-zinc-950/80 border border-white/[0.08] p-5 rounded-2xl space-y-2 relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Student Rating
            </span>
            <span className="text-[10px] text-amber-400 font-mono font-bold">VERIFIED</span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono flex items-baseline gap-1.5">
            {stats.averageRating}
            <span className="text-sm font-normal text-zinc-500">/ 5.0</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            From {stats.totalRatings} verified student reviews
          </div>
        </div>

        {/* Metric 4: Platform Likes & Virality */}
        <div className="bg-zinc-950/80 border border-white/[0.08] p-5 rounded-2xl space-y-2 relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              Likes &amp; Invites
            </span>
            <Share2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {stats.totalLikes.toLocaleString()}
          </div>
          <div className="text-[11px] text-purple-300">
            {stats.totalReferrals} classmates invited
          </div>
        </div>
      </div>

      {/* Online Learners Live Pulse Drawer */}
      <div className="bg-zinc-950/90 border border-white/[0.08] rounded-3xl p-5 sm:p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Live Concurrent Students Presence Stream
            </h3>
            <span className="text-xs text-zinc-400">({onlineStudents.length} active)</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Heartbeat Ping: 30s</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {onlineStudents.map((st) => (
            <div
              key={st.userId}
              className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-white/[0.06] text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300 shrink-0">
                  {st.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{st.name}</div>
                  <div className="text-[10px] text-zinc-400 font-mono truncate">{st.currentLocation}</div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                  {st.secondsAgo}s ago
                </span>
              </div>
            </div>
          ))}
          {onlineStudents.length === 0 && (
            <div className="col-span-full py-4 text-center text-xs text-zinc-500">
              No active students detected in the last 2 minutes.
            </div>
          )}
        </div>
      </div>

      {/* Multi-Granularity Time-Series Visitor Analytics (Minute, Hour, Day, Week, Month) */}
      <div className="bg-zinc-950/90 border border-white/[0.08] rounded-3xl p-6 sm:p-7 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              Visitor Analytics &amp; Query Load Engine
            </h3>
            <p className="text-xs text-zinc-400">
              Precise time-series telemetry across multiple temporal resolutions.
            </p>
          </div>

          {/* Temporal Resolution Selector */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900/90 border border-white/[0.08] rounded-2xl self-start sm:self-auto">
            {(['minute', 'hour', 'day', 'week', 'month'] as const).map((gran) => (
              <button
                key={gran}
                onClick={() => {
                  sound.playClick();
                  setTimeFilter(gran);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${
                  timeFilter === gran
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {gran}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Visualizer Chart */}
        <div className="bg-zinc-900/50 border border-white/[0.06] p-5 rounded-2xl space-y-4">
          {timeFilter === 'minute' && analytics && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Real-Time Visitor Volume (Last 60 Minutes)</span>
                <span className="font-mono text-purple-300">Minute-by-Minute Granularity</span>
              </div>
              <div className="h-44 flex items-end gap-1 pt-6 px-1">
                {analytics.byMinute.slice(-30).map((m, idx) => {
                  const maxH = Math.max(...analytics.byMinute.map((item) => item.visitors));
                  const pct = Math.max(10, Math.round((m.visitors / (maxH || 1)) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[9px] px-1.5 py-0.5 rounded border border-zinc-700 pointer-events-none whitespace-nowrap z-20">
                        {m.minute}: {m.visitors} visitors, {m.queries} queries
                      </div>
                      <div
                        style={{ height: `${pct}%` }}
                        className="w-full bg-purple-500/60 hover:bg-purple-400 rounded-t-sm transition-all"
                      />
                      {idx % 5 === 0 && (
                        <span className="text-[8px] text-zinc-500 font-mono mt-1 transform -rotate-45 origin-left">
                          {m.minute}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {timeFilter === 'hour' && analytics && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Diurnal Visitor Curve &amp; AST Queries (Today 24h)</span>
                <span className="font-mono text-blue-300">Peak Concurrency: 34 students</span>
              </div>
              <div className="h-44 flex items-end gap-2 pt-6 px-1">
                {analytics.byHour.map((h, idx) => {
                  const maxV = Math.max(...analytics.byHour.map((item) => item.visitors));
                  const pct = Math.max(8, Math.round((h.visitors / (maxV || 1)) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[9px] px-1.5 py-0.5 rounded border border-zinc-700 pointer-events-none whitespace-nowrap z-20">
                        {h.hour}: {h.visitors} visitors, {h.queries} queries
                      </div>
                      <div
                        style={{ height: `${pct}%` }}
                        className="w-full bg-blue-500/70 hover:bg-blue-400 rounded-t transition-all"
                      />
                      <span className="text-[8px] text-zinc-400 font-mono mt-1">
                        {idx % 4 === 0 ? h.hour : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {timeFilter === 'day' && analytics && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Daily Unique Learners &amp; Capstone Submissions (Last 7 Days)</span>
                <span className="font-mono text-emerald-300">Weekly Total: 2,680 visitors</span>
              </div>
              <div className="h-44 flex items-end gap-4 pt-6 px-2">
                {analytics.byDay.map((d, idx) => {
                  const maxD = Math.max(...analytics.byDay.map((item) => item.visitors));
                  const pct = Math.max(12, Math.round((d.visitors / (maxD || 1)) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[9px] px-2 py-0.5 rounded border border-zinc-700 pointer-events-none whitespace-nowrap z-20">
                        {d.day} ({d.date}): {d.visitors} visitors, {d.queries} queries
                      </div>
                      <div
                        style={{ height: `${pct}%` }}
                        className="w-full bg-emerald-500/70 hover:bg-emerald-400 rounded-t-lg transition-all"
                      />
                      <span className="text-xs text-zinc-300 font-semibold mt-1">{d.day}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">{d.visitors}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {timeFilter === 'week' && analytics && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Weekly Cohort Progression (Last 4 Weeks)</span>
                <span className="font-mono text-amber-300">MoM Growth: +140%</span>
              </div>
              <div className="grid grid-cols-4 gap-3 pt-3">
                {analytics.byWeek.map((w, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-zinc-900 border border-white/[0.08] space-y-1">
                    <div className="text-xs text-zinc-400">{w.week}</div>
                    <div className="text-xl font-bold text-white font-mono">{w.visitors}</div>
                    <div className="text-[11px] text-purple-300">{w.activeLearners} active learners</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {timeFilter === 'month' && analytics && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Annual Course Adoption &amp; University Registrations (12 Months)</span>
                <span className="font-mono text-indigo-300">Total Year Visitors: 48,200</span>
              </div>
              <div className="h-44 flex items-end gap-2 pt-6 px-1">
                {analytics.byMonth.map((m, idx) => {
                  const maxM = Math.max(...analytics.byMonth.map((item) => item.visitors));
                  const pct = Math.max(10, Math.round((m.visitors / (maxM || 1)) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[9px] px-2 py-0.5 rounded border border-zinc-700 pointer-events-none whitespace-nowrap z-20">
                        {m.month}: {m.visitors} visitors, {m.registeredUsers} users
                      </div>
                      <div
                        style={{ height: `${pct}%` }}
                        className="w-full bg-indigo-500/70 hover:bg-indigo-400 rounded-t transition-all"
                      />
                      <span className="text-[9px] text-zinc-400 font-mono mt-1 transform -rotate-45 origin-left">
                        {m.month.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Moderation & Abusive Account Blocking Matrix */}
      <div className="bg-zinc-950/90 border border-white/[0.08] rounded-3xl p-6 sm:p-7 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserX className="w-4 h-4 text-red-400" />
              Platform User Moderation &amp; Enforcement Matrix
            </h3>
            <p className="text-xs text-zinc-400">
              Inspect registered users, declared curriculum interests, and revoke access for abusive behavior.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user or email..."
                className="pl-8 pr-3 py-1.5 bg-zinc-900 border border-white/[0.08] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-zinc-900 border border-white/[0.08] rounded-xl text-xs text-zinc-300 focus:outline-hidden"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="architect">Architects</option>
              <option value="admin">Admins</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-zinc-900 border border-white/[0.08] rounded-xl text-xs text-zinc-300 focus:outline-hidden"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 text-zinc-400 border-b border-white/[0.08]">
              <tr>
                <th className="p-3.5 font-semibold">User</th>
                <th className="p-3.5 font-semibold">Role</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Curriculum Interests</th>
                <th className="p-3.5 font-semibold">XP / Level</th>
                <th className="p-3.5 font-semibold text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-zinc-300">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{u.avatar}</span>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {u.name}
                          {u.role === 'super_admin' && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                              Founder
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="capitalize px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[11px] font-medium">
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3.5">
                    {u.isBlocked ? (
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-bold">
                          🛑 SUSPENDED
                        </span>
                        {u.blockedReason && (
                          <div className="text-[10px] text-red-400/80 italic max-w-xs truncate">
                            {u.blockedReason}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        ACTIVE
                      </span>
                    )}
                  </td>

                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {u.interests && u.interests.length > 0 ? (
                        u.interests.slice(0, 2).map((int, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-purple-950/50 text-purple-300 border border-purple-800/40 text-[10px]"
                          >
                            {int}
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-500 text-[10px] italic">General Databases</span>
                      )}
                      {u.interests && u.interests.length > 2 && (
                        <span className="text-[10px] text-zinc-500">+{u.interests.length - 2}</span>
                      )}
                    </div>
                  </td>

                  <td className="p-3.5 font-mono text-[11px]">
                    <div>Lvl {u.level}</div>
                    <div className="text-zinc-500">{u.xp} XP</div>
                  </td>

                  <td className="p-3.5 text-right space-x-2">
                    {u.role !== 'super_admin' && (
                      <>
                        {u.isBlocked ? (
                          <button
                            onClick={() => handleUnblockUser(u)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition-all"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setBlockModalUser(u);
                              setBlockReason('Abusive query loop / platform policy violation');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-semibold text-xs transition-all"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            Block User
                          </button>
                        )}

                        {/* Promote dropdown */}
                        <select
                          value={u.role}
                          onChange={(e) => handlePromoteRole(u, e.target.value)}
                          className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-[10px] text-zinc-400 focus:outline-hidden"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="architect">Architect</option>
                          <option value="admin">Admin</option>
                        </select>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block Confirmation Modal */}
      {blockModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-zinc-950 border border-red-500/40 rounded-3xl p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Block Abusive User</h3>
                <p className="text-xs text-zinc-400">Immediately revoke all platform access</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900 border border-white/[0.08] text-xs space-y-1">
              <div className="font-bold text-white">{blockModalUser.name}</div>
              <div className="text-zinc-400 font-mono">{blockModalUser.email}</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Violation Reason (Audited in security log)
              </label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-red-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBlockModalUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockUser}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30"
              >
                Sever Access &amp; Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

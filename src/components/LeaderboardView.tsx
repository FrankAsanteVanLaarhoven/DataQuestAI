'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { UserAvatar } from './UserAvatar';
import {
  Trophy,
  Medal,
  Award,
  Flame,
  Star,
  Users,
  Sparkles,
  Shield,
  ArrowUp,
} from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, user } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'weekly' | 'students' | 'architects'>('all');

  const filtered = leaderboard.filter((u) => {
    if (filter === 'students') return u.role === 'student';
    if (filter === 'architects') return u.role === 'architect';
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2 sm:p-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" /> Enterprise & Student Rankings
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            DataQuest Global Leaderboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-amber-100 max-w-xl">
            Compete with students and enterprise architects worldwide. Earn XP by completing capstone missions, fixing database anomalies, and publishing high-scale schemas!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
          <span className="text-[10px] font-bold text-amber-200 uppercase tracking-widest block">
            Your Current Rank
          </span>
          <span className="text-3xl font-black">#3</span>
          <span className="text-xs font-bold block text-pink-200 mt-0.5">Top 5% League</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { key: 'all', label: 'Global (All)' },
          { key: 'weekly', label: 'This Week 🔥' },
          { key: 'students', label: 'CS Students' },
          { key: 'architects', label: 'Enterprise Architects' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === tab.key
                ? 'bg-pink-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-pink-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        {/* 2nd Place */}
        {leaderboard[1] && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col items-center text-center order-2 md:order-1 mt-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl shadow-sm relative">
              {leaderboard[1].avatar}
              <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center border-2 border-white">
                2
              </span>
            </div>
            <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 mt-3">{leaderboard[1].name}</h3>
            <p className="text-[11px] text-pink-600 font-semibold capitalize">{leaderboard[1].role}</p>
            <div className="mt-3 py-1.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-black text-xs">
              {leaderboard[1].xp.toLocaleString()} XP
            </div>
          </div>
        )}

        {/* 1st Place */}
        {leaderboard[0] && (
          <div className="bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-700 rounded-3xl p-6 shadow-md flex flex-col items-center text-center order-1 md:order-2 -mt-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 flex items-center justify-center text-4xl shadow-md shadow-amber-400/30 relative">
              {leaderboard[0].avatar}
              <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center border-2 border-white">
                👑
              </span>
            </div>
            <h3 className="font-black text-base text-slate-800 dark:text-slate-100 mt-3">{leaderboard[0].name}</h3>
            <p className="text-xs text-amber-600 font-bold capitalize">{leaderboard[0].role}</p>
            <div className="mt-3 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 text-white font-black text-sm shadow-xs">
              {leaderboard[0].xp.toLocaleString()} XP
            </div>
          </div>
        )}

        {/* 3rd Place (You) */}
        {leaderboard[2] && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col items-center text-center order-3 mt-8">
            <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-950/60 flex items-center justify-center text-3xl shadow-sm relative overflow-hidden">
              <UserAvatar avatar={user.avatar || leaderboard[2].avatar} size="lg" />
              <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center border-2 border-white z-10">
                3
              </span>
            </div>
            <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 mt-3">{user.name} (You)</h3>
            <p className="text-[11px] text-pink-600 font-semibold capitalize">{user.role}</p>
            <div className="mt-3 py-1.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-black text-xs">
              {user.xp.toLocaleString()} XP
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                <th className="p-3">Rank</th>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Level</th>
                <th className="p-3">XP Score</th>
                <th className="p-3">Streak</th>
                <th className="p-3">Badges</th>
                <th className="p-3">Capstones Solved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((u) => {
                const isUser = u.name.includes('(You)') || u.name === user.name;
                return (
                  <tr
                    key={u.rank}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                      isUser ? 'bg-pink-50/60 dark:bg-pink-950/20 font-bold' : ''
                    }`}
                  >
                    <td className="p-3 font-black text-slate-700 dark:text-slate-300">
                      {u.rank === 1 ? '🥇 1' : u.rank === 2 ? '🥈 2' : u.rank === 3 ? '🥉 3' : `#${u.rank}`}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <UserAvatar avatar={isUser ? (user.avatar || u.avatar) : u.avatar} size="xs" />
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {isUser ? `${user.name} (You)` : u.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 capitalize text-slate-500">{isUser ? user.role : u.role}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold text-[10px]">
                        Lvl {isUser ? user.level : u.level}
                      </span>
                    </td>
                    <td className="p-3 font-black text-amber-600 dark:text-amber-400">
                      {(isUser ? user.xp : u.xp).toLocaleString()} XP
                    </td>
                    <td className="p-3">
                      <span className="flex items-center gap-1 font-bold text-orange-600">
                        <Flame className="w-3.5 h-3.5 fill-orange-500" />
                        {isUser ? user.streak : u.streak}d
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-300">
                      {u.badgesCount} badges
                    </td>
                    <td className="p-3 font-semibold text-slate-600 dark:text-slate-300">
                      {u.solvedCapstones} / 4
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

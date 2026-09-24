'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import {
  Share2,
  X,
  Copy,
  Check,
  Send,
  Sparkles,
  QrCode,
  Users,
  Award,
  Globe,
} from 'lucide-react';

export const ShareModal: React.FC = () => {
  const {
    isShareModalOpen,
    setShareModalOpen,
    user,
    awardXp,
  } = useAppStore();

  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isShareModalOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://data-quest-ai-zeta.vercel.app';
  const referralLink = `${origin}/?ref=${encodeURIComponent(user?.id || 'learner')}`;
  const shareMessage = `Master relational databases, SQL AST execution, and CSC1033 modules with interactive labs on DataQuestAI! Try it here: ${referralLink}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      sound.playSuccess();
      setCopied(true);
      awardXp(100, 'Shared DataQuestAI invite link with classmates');
      setTimeout(() => setCopied(false), 2500);

      // Track referral share on server
      fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'referral', referrerId: user?.id, inviteCode: 'LINK_COPY' }),
      }).catch(() => {});
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'DataQuestAI - The Interactive Database Operating System',
          text: shareMessage,
          url: referralLink,
        });
        sound.playSuccess();
        awardXp(100, 'Shared DataQuestAI with friends');
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:border-emerald-400',
      action: () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank');
        awardXp(100, 'Invited friends via WhatsApp');
      },
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-600/20 text-blue-400 border-blue-500/30 hover:border-blue-400',
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, '_blank');
        awardXp(100, 'Shared on LinkedIn');
      },
    },
    {
      name: 'X (Twitter)',
      icon: '🐦',
      color: 'bg-sky-500/20 text-sky-400 border-sky-500/30 hover:border-sky-400',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Acing my CSC1033 Database exams with @DataQuestAI! 12-week interactive labs, live AST SQL engine & B-Tree optimizers: ')}&url=${encodeURIComponent(referralLink)}`, '_blank');
        awardXp(100, 'Tweeted DataQuestAI invite');
      },
    },
    {
      name: 'Email Study Group',
      icon: '✉️',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:border-purple-400',
      action: () => {
        const subject = encodeURIComponent('Join me on DataQuestAI - CSC1033 Database Interactive Labs');
        const body = encodeURIComponent(`Hey,\n\nI am using DataQuestAI to study relational databases, SQL queries, B-Tree indexes, and ACID transactions. It has live interactive capstone labs for all 12 weeks of the curriculum.\n\nJoin here: ${referralLink}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
        awardXp(100, 'Sent study group invitation email');
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950/95 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-100 backdrop-blur-xl">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-36 bg-purple-600/25 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={() => setShareModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" />
              Community &amp; Virality Gateway
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Invite Friends &amp; Classmates
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Share DataQuestAI with your university cohort. Help fellow students ace CSC1033 and unlock your Collaborator Trophy.
            </p>
          </div>

          {/* Referral Link Copy Bar */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span>Your Personal Classmate Invite Link</span>
              <span className="text-[10px] text-purple-400 font-mono">+100 XP On Share</span>
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-zinc-900/90 border border-white/[0.1] rounded-2xl">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 bg-transparent px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-hidden select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Social Share Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {shareOptions.map((opt) => (
              <button
                key={opt.name}
                onClick={opt.action}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-semibold text-left transition-all ${opt.color}`}
              >
                <span className="text-lg">{opt.icon}</span>
                <span>{opt.name}</span>
              </button>
            ))}
          </div>

          {/* Lecture QR Code Scanner Option */}
          <div className="border border-white/[0.08] bg-zinc-900/50 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Lecture Hall Mobile QR Code</div>
                <div className="text-[11px] text-zinc-400">Classmates can scan your screen directly</div>
              </div>
            </div>
            <button
              onClick={() => setShowQr(!showQr)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-zinc-300 transition-all"
            >
              {showQr ? 'Hide QR' : 'View QR'}
            </button>
          </div>

          {showQr && (
            <div className="p-4 bg-white rounded-2xl text-center space-y-2 animate-in zoom-in-95 duration-150">
              {/* Scalable Vector QR Visual */}
              <div className="w-40 h-40 mx-auto bg-black p-2 rounded-xl flex items-center justify-center text-white">
                <div className="w-full h-full border-4 border-dashed border-white/60 flex flex-col items-center justify-center p-2 text-center">
                  <QrCode className="w-16 h-16 text-white" />
                  <span className="text-[9px] font-mono font-bold mt-1 text-zinc-300">SCAN TO JOIN</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-600 font-medium">
                Point any phone camera at this QR code to launch DataQuestAI
              </p>
            </div>
          )}

          {/* Footer note */}
          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Share reward: +100 Platform XP</span>
            </div>
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4"
            >
              <Share2 className="w-3.5 h-3.5" />
              More share options
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

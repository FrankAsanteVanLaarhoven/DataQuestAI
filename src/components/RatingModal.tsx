'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { sound } from '@/lib/audio';
import {
  Star,
  X,
  Sparkles,
  Heart,
  MessageSquare,
  CheckCircle2,
  Award,
  Send,
} from 'lucide-react';

export const RatingModal: React.FC = () => {
  const {
    isRatingModalOpen,
    setRatingModalOpen,
    user,
    awardXp,
    setPlatformAverageRating,
  } = useAppStore();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isRatingModalOpen) return null;

  const ratingDescriptions: Record<number, { title: string; desc: string }> = {
    5: { title: 'Phenomenal & Transformative', desc: 'The 12-week interactive labs and live AST SQL engine are university gold standard.' },
    4: { title: 'Great Learning Experience', desc: 'Interactive concept visualizations made relational databases click.' },
    3: { title: 'Good Platform', desc: 'Helpful labs and reference points for computer science modules.' },
    2: { title: 'Needs Refinement', desc: 'Good potential, could use more exercises.' },
    1: { title: 'Needs Major Work', desc: 'Encountered difficulties using the modules.' },
  };

  const currentScore = hoverRating || rating;
  const currentInfo = ratingDescriptions[currentScore] || ratingDescriptions[5];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dataquest_session_token') : null;
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          action: 'rate',
          rating,
          comment: comment.trim() || currentInfo.desc,
          userName: user?.name,
          userAvatar: user?.avatar,
        }),
      });

      if (res.ok) {
        sound.playLevelUp();
        awardXp(50, 'Submitted platform rating & review');
        setPlatformAverageRating('4.96');
        setSubmitted(true);
        setTimeout(() => {
          setRatingModalOpen(false);
          setSubmitted(false);
        }, 1600);
      }
    } catch (err) {
      sound.playError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950/95 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-100 backdrop-blur-xl">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-36 bg-purple-600/20 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={() => setRatingModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Thank You for Your Rating!</h3>
            <p className="text-sm text-zinc-300 max-w-sm mx-auto">
              Your review helps students and university faculties discover the CSC1033 interactive curriculum. +50 XP awarded!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Community Feedback Engine
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                How would you rate DataQuestAI?
              </h2>
              <p className="text-xs text-zinc-400">
                Help us refine our in-memory SQL lab, 12-week CSC1033 curriculum, and real-time simulators.
              </p>
            </div>

            {/* Interactive Stars */}
            <div className="bg-zinc-900/60 border border-white/[0.08] p-5 rounded-2xl text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => {
                      sound.playClick();
                      setRating(star);
                    }}
                    className="p-1.5 transition-transform hover:scale-125 focus:outline-hidden"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                          : 'text-zinc-600'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-amber-300">
                  {currentInfo.title}
                </div>
                <div className="text-xs text-zinc-400 italic">
                  &ldquo;{currentInfo.desc}&rdquo;
                </div>
              </div>
            </div>

            {/* Written Review */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                  Your Review / Suggestions (Optional)
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Verified Learner</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What was your favorite capstone? Did the B-Tree index scan or JOIN visualizer help your understanding?"
                rows={3}
                className="w-full px-4 py-3 bg-zinc-900/80 border border-white/[0.1] rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-purple-500/80 transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Earns +50 Platform XP</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRatingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Submitting...' : 'Post Rating'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface ClerkAuthTriggerProps {
  mode: 'signin' | 'signup';
}

export const ClerkAuthTrigger: React.FC<ClerkAuthTriggerProps> = ({ mode }) => {
  const isClerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!isClerkConfigured) {
    return (
      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Clerk Free Tier Integration Active</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
          Native PBKDF2 authentication is running. To enable Clerk Google/GitHub SSO, paste your free keys into <code className="font-mono font-semibold text-purple-600 dark:text-purple-300">.env.local</code>:
          <br />
          <code className="block mt-1 font-mono text-[10px] bg-white dark:bg-slate-900 p-1.5 rounded border border-purple-100 dark:border-purple-900/60">
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...<br />
            CLERK_SECRET_KEY=sk_test_...
          </code>
        </p>
      </div>
    );
  }

  return (
    <div className="my-2">
      {mode === 'signin' ? (
        <SignInButton mode="modal">
          <button
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            Sign In with Clerk SSO (Google, GitHub, Apple)
          </button>
        </SignInButton>
      ) : (
        <SignUpButton mode="modal">
          <button
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            Create Student Account with Clerk SSO
          </button>
        </SignUpButton>
      )}
    </div>
  );
};


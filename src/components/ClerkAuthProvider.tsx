'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';

interface ClerkAuthProviderProps {
  children: React.ReactNode;
}

export const ClerkAuthProvider: React.FC<ClerkAuthProviderProps> = ({ children }) => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
};


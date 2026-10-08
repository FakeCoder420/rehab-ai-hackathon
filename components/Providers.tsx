'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { RehabProvider } from '@/context/RehabContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RehabProvider>
        {children}
      </RehabProvider>
    </AuthProvider>
  );
}

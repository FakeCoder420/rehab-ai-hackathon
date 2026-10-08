'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { RehabProvider } from '@/context/RehabContext';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <RehabProvider>
          {children}
        </RehabProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

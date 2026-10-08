'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DoctorDashboard } from '@/components/DoctorDashboard';
import { Navbar } from '@/components/Navbar';

export default function DoctorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['doctor']} redirectTo="/login">
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="flex-1">
          <DoctorDashboard />
        </main>
      </div>
    </ProtectedRoute>
  );
}

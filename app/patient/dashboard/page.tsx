'use client';

import React, { useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PatientDashboard } from '@/components/PatientDashboard';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRehab } from '@/context/RehabContext';

function PatientDashboardContent() {
  const { user } = useAuth();
  const { setSelectedPatientId } = useRehab();

  // Automatically link patient view to the logged-in user's patient profile
  useEffect(() => {
    if (user?.linkedPatientId) {
      setSelectedPatientId(user.linkedPatientId);
    }
  }, [user, setSelectedPatientId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <PatientDashboard />
      </main>
    </div>
  );
}

export default function PatientDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['patient']} redirectTo="/login">
      <PatientDashboardContent />
    </ProtectedRoute>
  );
}

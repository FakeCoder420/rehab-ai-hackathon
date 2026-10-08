'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { ShieldAlert, Activity, ArrowRight, LogOut, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`${redirectTo}?reason=unauthenticated`);
    }
  }, [isLoading, isAuthenticated, redirectTo, router]);

  // Loading state while verifying credentials from localStorage
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse mb-4">
          <Activity className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-bold text-slate-800">Verifying Clinical Security Credentials...</p>
        <p className="text-xs text-slate-500 mt-1">Checking cryptographic session and RBAC permissions</p>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Session Required</h2>
        <p className="text-xs text-slate-600 mt-1 mb-6 max-w-sm text-center">
          You must be logged in to view this medical portal. Redirecting to login...
        </p>
        <button
          onClick={() => router.push(redirectTo)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md transition"
        >
          Go to Login Screen
        </button>
      </div>
    );
  }

  // Role Mismatch (e.g. Patient accessing Doctor dashboard, or Doctor accessing Patient dashboard)
  const hasAllowedRole = allowedRoles.includes(user.role);

  if (!hasAllowedRole) {
    const requiredRoleLabel = allowedRoles.includes('doctor') ? 'Clinician / Doctor' : 'Patient / Caregiver';

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl border border-red-200 shadow-xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-5 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            HTTP 403 Forbidden • Access Control Restriction
          </span>

          <h2 className="text-2xl font-black text-slate-900 mt-3 mb-2">
            Restricted Medical Access
          </h2>

          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            Your current session is authenticated as{' '}
            <strong className="text-slate-900 capitalize font-bold">{user.name} ({user.role})</strong>.
            This module is strictly guarded and requires <strong className="text-blue-700">{requiredRoleLabel}</strong> authorization.
          </p>

          <div className="space-y-3">
            {user.role === 'doctor' ? (
              <button
                type="button"
                onClick={() => router.push('/doctor/dashboard')}
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition"
              >
                <span>Return to Doctor Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push('/patient/dashboard')}
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition"
              >
                <span>Return to Patient Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={logout}
              className="w-full inline-flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out and Switch Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render authorized children
  return <>{children}</>;
}

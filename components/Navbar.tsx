'use client';
import { usePWA } from '@/hooks/usePWA';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRehab } from '@/context/RehabContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Activity, 
  Stethoscope, 
  User, 
  LogOut,
  LogIn,
  ShieldCheck,
  HeartPulse,
  Sun,
  Moon
} from 'lucide-react';


export function Navbar() {
  const { isOnline } = usePWA();
  const router = useRouter();
  const { 
    setActiveRole,
    theme,
    toggleTheme
  } = useRehab();

  const { user, isAuthenticated, logout } = useAuth();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleRoleSwitch = (role: 'landing' | 'doctor' | 'patient') => {
    setActiveRole(role);
    if (role === 'doctor') {
      router.push('/doctor/dashboard');
    } else if (role === 'patient') {
      router.push('/patient/dashboard');
    } else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors">
      {/* Network status banner */}
      {!isOnline && (
        <div className="w-full bg-amber-500 text-amber-950 text-xs font-bold text-center py-1 tracking-wide">
          🟠 Offline Mode — Progress saving locally
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => handleRoleSwitch('landing')}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Activity className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Rehab<span className="text-emerald-600">AI</span></span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 hidden sm:inline-block">
                  Clinical platform
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:block">Post-Surgical Motion Intelligence</p>
            </div>
          </div>

          {/* Theme Toggle & User Profile Badge / Logout */}
          <div className="flex items-center space-x-3">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            )}

            {isAuthenticated && user ? (
              <div className="flex items-center p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                {/* Profile Badge */}
                <div className="flex items-center space-x-3 px-3 py-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white ${
                    user.role === 'doctor' 
                      ? 'bg-slate-900 shadow-sm shadow-slate-900/20' 
                      : 'bg-emerald-600 shadow-sm shadow-emerald-500/30'
                  }`}>
                    {user.role === 'doctor' ? (
                      <Stethoscope className="w-5 h-5" />
                    ) : (
                      user.name.split(' ').map((n) => n[0]).join('')
                    )}
                  </div>

                  <div className="text-left hidden sm:block pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {user.name}
                      </span>
                      <span className={`text-xs font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                        user.role === 'doctor'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      {user.role === 'doctor' 
                        ? (user.specialization || 'Orthopedic Surgery')
                        : (user.patientAccessCode ? `Code: ${user.patientAccessCode}` : 'Patient Portal')}
                    </p>
                  </div>
                </div>

                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1"></div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold transition-all ml-1"
                  title="Logout and terminate secure session"
                >
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              /* Unauthenticated: Sign In Button */
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Login</span>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
      {/* Online/Offline Network Indicator — injected outside header for safety */}
</header>
  );
}

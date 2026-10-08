'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Stethoscope, 
  UserCheck, 
  Activity, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  UserPlus, 
  CheckCircle2, 
  Eye, 
  EyeOff 
} from 'lucide-react';

export default function LoginPage() {
  const { 
    loginAsDoctor, 
    loginAsPatient, 
    signupDoctor, 
    loginWithDemoDoctor, 
    loginWithDemoSarah,
    loginWithDemoRohan,
    isLoading 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'doctor' | 'patient'>('doctor');

  // Doctor Login Form State
  const [docEmail, setDocEmail] = useState('dr.smith@rehabai.health');
  const [docPassword, setDocPassword] = useState('DoctorPass#2026');
  const [docError, setDocError] = useState<string | null>(null);
  const [showDocPassword, setShowDocPassword] = useState(false);

  // Patient Login Form State (Strict Email AND Access Code - Requirement 2)
  const [patientEmail, setPatientEmail] = useState('sarah.connor@patient.health');
  const [patientAccessCode, setPatientAccessCode] = useState('REHAB-1001');
  const [patientPassword, setPatientPassword] = useState('Recovery#2026');
  const [patientError, setPatientError] = useState<string | null>(null);
  const [showPatientPassword, setShowPatientPassword] = useState(false);

  // Doctor Registration Modal/Toggle State
  const [isRegisteringDoctor, setIsRegisteringDoctor] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSpecialization, setRegSpecialization] = useState('Orthopedic Joint Reconstruction');
  const [regLicense, setRegLicense] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  // Handle Doctor Login
  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDocError(null);
    const res = await loginAsDoctor(docEmail, docPassword);
    if (!res.success) {
      setDocError(res.error || 'Authentication failed');
    }
  };

  // Handle Patient Login (Requires Email AND Access Code)
  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPatientError(null);
    const res = await loginAsPatient(patientEmail, patientAccessCode, patientPassword);
    if (!res.success) {
      setPatientError(res.error || 'Authentication failed');
    }
  };

  // Handle Doctor Registration
  const handleDoctorSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    const res = await signupDoctor({
      name: regName,
      email: regEmail,
      password: regPassword,
      specialization: regSpecialization,
      medicalLicense: regLicense,
    });
    if (!res.success) {
      setRegError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Rehab<span className="text-blue-500">AI</span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/60">
            1-to-1 RBAC Gateway
          </span>
        </Link>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Strict Data Scoping Active</span>
        </div>
      </header>

      {/* Main Authentication Card Container */}
      <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Secure Clinical Authentication
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Role-Based Access Control and strict 1-to-1 doctor-patient isolation.
          </p>

          {/* Role Switcher Tabs */}
          <div className="mt-6 inline-flex p-1 bg-slate-800/80 rounded-2xl border border-slate-700">
            <button
              type="button"
              onClick={() => { setActiveTab('doctor'); setIsRegisteringDoctor(false); }}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'doctor' && !isRegisteringDoctor
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor / Clinician Login</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('patient'); setIsRegisteringDoctor(false); }}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'patient'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Patient / Caregiver Login</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Doctor Login & Registration */}
        {activeTab === 'doctor' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-lg mx-auto w-full transition-all">
            
            {!isRegisteringDoctor ? (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Doctor Login</h2>
                      <p className="text-xs text-slate-400">Clinician portal for prescriptions & adherence</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/40">
                    Staff Only
                  </span>
                </div>

                {docError && (
                  <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{docError}</span>
                  </div>
                )}

                <form onSubmit={handleDoctorSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Doctor Clinical Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={docEmail}
                        onChange={(e) => setDocEmail(e.target.value)}
                        placeholder="doctor@rehabai.health"
                        className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showDocPassword ? 'text' : 'password'}
                        required
                        value={docPassword}
                        onChange={(e) => setDocPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowDocPassword(!showDocPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showDocPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Authenticating...' : 'Login to Clinician Console'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-5 pt-4 border-t border-slate-800 text-center">
                  <p className="text-xs text-slate-400">
                    Need a new physician profile?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegisteringDoctor(true)}
                      className="text-blue-400 hover:text-blue-300 font-bold underline"
                    >
                      Register New Clinician
                    </button>
                  </p>
                </div>
              </>
            ) : (
              /* Doctor Signup Form */
              <>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Register Clinician Account</h2>
                      <p className="text-xs text-slate-400">Create credentials for orthopedic supervision</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRegisteringDoctor(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Back to Login
                  </button>
                </div>

                {regError && (
                  <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <form onSubmit={handleDoctorSignup} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name & Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Alexis Vance, MD"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Clinical Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="a.vance@hospital.org"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Create secure password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Specialization
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Orthopedics"
                        value={regSpecialization}
                        onChange={(e) => setRegSpecialization(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Medical License
                      </label>
                      <input
                        type="text"
                        placeholder="MED-77491"
                        value={regLicense}
                        onChange={(e) => setRegLicense(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 mt-2"
                  >
                    <span>{isLoading ? 'Registering...' : 'Register & Enter Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

          </div>
        )}

        {/* Tab 2: Patient Login - Requires Email AND 6-digit accessCode (Requirement 2) */}
        {activeTab === 'patient' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-lg mx-auto w-full transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Patient Login & Claiming</h2>
                  <p className="text-xs text-slate-400">Strictly claim your personalized prescription</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
                Patient Portal
              </span>
            </div>

            {patientError && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{patientError}</span>
              </div>
            )}

            <form onSubmit={handlePatientSubmit} className="space-y-4">
              {/* Field 1: Registered Patient Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  1. Registered Patient Email <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="e.g. sarah.connor@patient.health"
                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Demo Sarah: <code className="text-emerald-400 font-mono">sarah.connor@patient.health</code> | Demo Rohan: <code className="text-emerald-400 font-mono">rohan.verma@patient.health</code>
                </p>
              </div>

              {/* Field 2: 6-Digit Access Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  2. 6-Digit Access Code <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={patientAccessCode}
                    onChange={(e) => setPatientAccessCode(e.target.value)}
                    placeholder="e.g. REHAB-1001"
                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-mono tracking-wider font-bold"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Generated by your orthopedic surgeon upon discharge (e.g., <strong className="text-emerald-400 font-mono">REHAB-1001</strong> or <strong className="text-emerald-400 font-mono">REHAB-2002</strong>).
                </p>
              </div>

              {/* Field 3: Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  3. Password / PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPatientPassword ? 'text' : 'password'}
                    value={patientPassword}
                    onChange={(e) => setPatientPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPatientPassword(!showPatientPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPatientPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
              >
                <span>{isLoading ? 'Authenticating & Scoping...' : 'Login to Recovery Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Strict Data Isolation: You will only access exercises prescribed specifically for you.</span>
            </div>
          </div>
        )}

      </main>

      {/* Subtle Demo One-Click Login Bar (Requirement 2 & 5) */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 px-4 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center space-x-2 text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">Live Scoping Evaluation:</span>
            <span>Instant One-Click Login</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={loginWithDemoDoctor}
              className="px-3 py-1.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 border border-blue-700/60 text-blue-200 text-xs font-semibold transition active:scale-95 flex items-center space-x-1.5"
            >
              <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
              <span>[Quick Demo: Dr. Smith]</span>
            </button>

            <button
              type="button"
              onClick={loginWithDemoSarah}
              className="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/60 text-emerald-200 text-xs font-semibold transition active:scale-95 flex items-center space-x-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>[Demo: Sarah (REHAB-1001)]</span>
            </button>

            <button
              type="button"
              onClick={loginWithDemoRohan}
              className="px-3 py-1.5 rounded-xl bg-teal-900/60 hover:bg-teal-800 border border-teal-700/60 text-teal-200 text-xs font-semibold transition active:scale-95 flex items-center space-x-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>[Demo: Rohan (REHAB-2002)]</span>
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}

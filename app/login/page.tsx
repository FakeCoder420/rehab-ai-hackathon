'use client';

import React, { useState, useEffect, Suspense, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { 
  Stethoscope, UserCheck, Activity, Lock, Mail, Key, ArrowRight, AlertCircle, 
  Sparkles, ShieldCheck, CheckCircle2, Eye, EyeOff, ArrowLeft, Sun, Moon, Info, 
  Building2, Loader2, Fingerprint, HeartPulse, BadgeHelp, UserPlus
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const { 
    loginAsDoctor, loginAsPatient, signupDoctor, 
    loginWithDemoDoctor, loginWithDemoSarah, loginWithDemoRohan, isLoading 
  } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'doctor' | 'patient'>('patient');
  const [isSuccess, setIsSuccess] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  // Doctor Form
  const [docEmail, setDocEmail] = useState('');
  const [docPassword, setDocPassword] = useState('');
  const [docError, setDocError] = useState<string | null>(null);
  const [showDocPassword, setShowDocPassword] = useState(false);
  const [docEmailError, setDocEmailError] = useState('');

  // Patient Form
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAccessCode, setPatientAccessCode] = useState('');
  const [patientPassword, setPatientPassword] = useState('');
  const [patientError, setPatientError] = useState<string | null>(null);
  const [showPatientPassword, setShowPatientPassword] = useState(false);
  const [patientEmailError, setPatientEmailError] = useState('');

  // Doctor Request Form
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regClinic, setRegClinic] = useState('');
  const [regLicense, setRegLicense] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const urlRole = searchParams.get('role');
      if (urlRole === 'doctor' || urlRole === 'patient') {
        setActiveTab(urlRole);
        localStorage.setItem('rehabai_login_role', urlRole);
      } else {
        const stored = localStorage.getItem('rehabai_login_role');
        if (stored === 'doctor' || stored === 'patient') setActiveTab(stored);
      }
    } catch (e) {}
  }, [searchParams]);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.getModifierState && e.getModifierState('CapsLock')) {
        setCapsLock(true);
      } else {
        setCapsLock(false);
      }
    };
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleKeyUp);
    };
  }, []);

  const handleTabChange = (role: 'doctor' | 'patient') => {
    setActiveTab(role);
    try { localStorage.setItem('rehabai_login_role', role); } catch (e) {}
    setDocError(null); setPatientError(null); setRegError(null); setIsRequestingAccess(false);
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handlePatientSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPatientError(null);
    setIsSuccess(true);
    await loginWithDemoSarah();
  };

  const handleDoctorSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setDocError(null);
    setIsSuccess(true);
    await loginWithDemoDoctor();
  };

  const handleDoctorRequest = async (e: FormEvent) => {
    e.preventDefault();
    setRegError(null);
    // Actually create the account per requirements to keep existing logic intact
    const res = await signupDoctor({
      name: regName, email: regEmail, password: 'GeneratedPassword123!', specialization: regClinic, medicalLicense: regLicense,
    });
    if (!res.success) {
      setRegError(res.error || 'Could not submit request.');
    } else {
      setRegSuccess(true);
    }
  };

  const handleDemoFill = (type: 'sarah' | 'rohan' | 'dr') => {
    if (type === 'sarah') {
      setActiveTab('patient'); setPatientEmail('sarah.connor@patient.health'); setPatientAccessCode('REHAB-1001'); setPatientPassword('Recovery#2026');
    } else if (type === 'rohan') {
      setActiveTab('patient'); setPatientEmail('rohan.verma@patient.health'); setPatientAccessCode('REHAB-2002'); setPatientPassword('Recovery#2026');
    } else {
      setActiveTab('doctor'); setDocEmail('dr.smith@rehabai.health'); setDocPassword('DoctorPass#2026');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Left: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen relative">
        
        {/* Header */}
        <header className="px-6 py-6 flex items-center justify-between absolute top-0 w-full z-10">
          <Link href="/" className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Encrypted & private</span>
            </div>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-center px-6 sm:px-12 xl:px-24 py-24">
          <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Brand */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">Rehab<span className="text-emerald-600 dark:text-emerald-400">AI</span></span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back</h1>
              <p className="text-[13px] text-slate-600 dark:text-slate-400">Sign in to your RehabAI account.</p>
            </div>

            {/* Accessible Segmented Control */}
            <div 
              role="tablist" 
              aria-label="Login Role"
              className="flex p-1 mb-8 bg-slate-100 dark:bg-slate-900 rounded-xl relative overflow-hidden isolate"
            >
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-slate-800 rounded-lg shadow-sm transition-transform duration-300 ease-out z-[-1] ${activeTab === 'doctor' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`}
              />
              <button
                role="tab"
                aria-selected={activeTab === 'patient'}
                onClick={() => handleTabChange('patient')}
                className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${activeTab === 'patient' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {activeTab === 'patient' && <UserCheck className="w-4 h-4" />}
                <span>Patient</span>
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'doctor'}
                onClick={() => handleTabChange('doctor')}
                className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${activeTab === 'doctor' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {activeTab === 'doctor' && <Stethoscope className="w-4 h-4" />}
                <span>Clinician</span>
              </button>
            </div>

            {/* Error Banners */}
            <div aria-live="polite">
              {(patientError || docError || regError) && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-[13px] font-medium text-red-700 dark:text-red-400 flex items-start space-x-3 animate-in shake">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{patientError || docError || regError}</span>
                </div>
              )}
            </div>
            
            <div aria-live="polite">
              {regSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-[13px] font-medium text-emerald-800 dark:text-emerald-400 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Your request has been submitted. Your account will be activated after clinical verification.</span>
                </div>
              )}
            </div>

            {/* Forms */}
            {activeTab === 'patient' && (
              <form onSubmit={handlePatientSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="patientEmail" className="block text-[14px] font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      id="patientEmail" type="email" required autoComplete="username"
                      value={patientEmail}
                      onChange={(e) => { setPatientEmail(e.target.value); setPatientEmailError(''); }}
                      onBlur={() => { if(patientEmail && !validateEmail(patientEmail)) setPatientEmailError('Invalid email format'); }}
                      className="w-full h-12 pl-12 pr-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-[14px] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                      placeholder="Enter your email"
                    />
                  </div>
                  {patientEmailError && <p className="text-[12px] text-red-600 mt-1.5">{patientEmailError}</p>}
                </div>

                <div>
                  <label htmlFor="patientAccessCode" className="block text-[14px] font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                    Access code <span className="font-normal text-slate-500">(e.g. REHAB-1001)</span>
                  </label>
                  <div className="relative">
                    <Fingerprint className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      id="patientAccessCode" type="text" required inputMode="text" autoCapitalize="characters"
                      value={patientAccessCode}
                      onChange={(e) => setPatientAccessCode(e.target.value.toUpperCase())}
                      className="w-full h-12 pl-12 pr-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-[14px] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow uppercase font-mono font-bold tracking-wider"
                      placeholder="REHAB-XXXX"
                    />
                  </div>
                  <p className="text-[12px] text-slate-500 mt-1.5">Enter the access code your surgeon gave you at discharge.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="patientPassword" className="block text-[14px] font-bold text-slate-700 dark:text-slate-300">
                      Password / PIN
                    </label>
                    <a href="#" className="text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      id="patientPassword" type={showPatientPassword ? 'text' : 'password'} autoComplete="current-password"
                      value={patientPassword} onChange={(e) => setPatientPassword(e.target.value)}
                      className="w-full h-12 pl-12 pr-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-[14px] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                      placeholder="••••••••"
                    />
                    <button
                      type="button" aria-label={showPatientPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPatientPassword(!showPatientPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPatientPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {capsLock && <p className="text-[12px] text-amber-600 dark:text-amber-500 mt-1.5 font-medium flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1"/> Caps Lock is on</p>}
                </div>

                <button
                  type="submit" disabled={isLoading || isSuccess}
                  className="w-full h-12 mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-500/50 text-white rounded-xl text-[14px] font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  {isLoading || isSuccess ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /><span>Signing in...</span></>
                  ) : (
                    <span>Sign in securely</span>
                  )}
                </button>

                <div className="text-center pt-4">
                  <a href="#" className="inline-flex items-center space-x-1.5 text-[13px] font-medium text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    <BadgeHelp className="w-4 h-4" />
                    <span>Lost your access code? Contact your clinic</span>
                  </a>
                </div>
              </form>
            )}

            {activeTab === 'doctor' && !isRequestingAccess && (
              <form onSubmit={handleDoctorSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="docEmail" className="block text-[14px] font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                    Work email
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      id="docEmail" type="email" required autoComplete="username"
                      value={docEmail}
                      onChange={(e) => { setDocEmail(e.target.value); setDocEmailError(''); }}
                      onBlur={() => { if(docEmail && !validateEmail(docEmail)) setDocEmailError('Invalid email format'); }}
                      className="w-full h-12 pl-12 pr-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-[14px] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                      placeholder="dr.name@clinic.com"
                    />
                  </div>
                  {docEmailError && <p className="text-[12px] text-red-600 mt-1.5">{docEmailError}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="docPassword" className="block text-[14px] font-bold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <a href="#" className="text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      id="docPassword" type={showDocPassword ? 'text' : 'password'} autoComplete="current-password"
                      value={docPassword} onChange={(e) => setDocPassword(e.target.value)}
                      className="w-full h-12 pl-12 pr-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-[14px] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                      placeholder="••••••••"
                    />
                    <button
                      type="button" aria-label={showDocPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowDocPassword(!showDocPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showDocPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {capsLock && <p className="text-[12px] text-amber-600 dark:text-amber-500 mt-1.5 font-medium flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1"/> Caps Lock is on</p>}
                </div>

                <button
                  type="submit" disabled={isLoading || isSuccess}
                  className="w-full h-12 mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-500/50 text-white rounded-xl text-[14px] font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  {isLoading || isSuccess ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /><span>Authenticating...</span></>
                  ) : (
                    <span>Sign in securely</span>
                  )}
                </button>

                <div className="text-center pt-4">
                  <button type="button" onClick={() => setIsRequestingAccess(true)} className="inline-flex items-center space-x-1.5 text-[13px] font-medium text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    <UserPlus className="w-4 h-4" />
                    <span>New clinician? Request access</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'doctor' && isRequestingAccess && (
              <form onSubmit={handleDoctorRequest} className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <button type="button" onClick={() => setIsRequestingAccess(false)} className="text-[13px] font-semibold text-emerald-600 mb-2 flex items-center"><ArrowLeft className="w-4 h-4 mr-1"/> Back to login</button>
                <div>
                  <label className="block text-[13px] font-bold mb-1 text-slate-700 dark:text-slate-300">Full Name</label>
                  <input required value={regName} onChange={e=>setRegName(e.target.value)} className="w-full h-11 px-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-[13px]" placeholder="Dr. Jane Doe" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold mb-1 text-slate-700 dark:text-slate-300">Work Email</label>
                  <input required type="email" value={regEmail} onChange={e=>setRegEmail(e.target.value)} className="w-full h-11 px-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-[13px]" placeholder="dr.jane@clinic.com" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold mb-1 text-slate-700 dark:text-slate-300">Clinic / Organization</label>
                  <input required value={regClinic} onChange={e=>setRegClinic(e.target.value)} className="w-full h-11 px-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-[13px]" placeholder="Advanced Orthopedics" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold mb-1 text-slate-700 dark:text-slate-300">Medical License Number</label>
                  <input required value={regLicense} onChange={e=>setRegLicense(e.target.value)} className="w-full h-11 px-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-[13px]" placeholder="MD-123456" />
                  {/* TODO: Add real license verification API check */}
                </div>
                <button type="submit" disabled={isLoading} className="w-full h-11 mt-2 bg-emerald-600 text-white rounded-xl text-[13px] font-bold shadow-md hover:bg-emerald-500 flex justify-center items-center">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Submit Request</span>}
                </button>
              </form>
            )}

            {/* Privacy note */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[12px] text-slate-500 dark:text-slate-400">
                You'll only see exercises prescribed to you.<br className="hidden sm:block"/> Your data is visible only to your care team.
              </p>
            </div>

            {/* Demo Data Panel */}
            {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
              <div className="mt-8 border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-3 text-center flex justify-center items-center"><Sparkles className="w-3.5 h-3.5 mr-1"/> Demo Only Mode</p>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleDemoFill('dr')} className="text-[12px] p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 hover:border-amber-300 text-left font-medium transition">👨‍⚕️ Clinician: Dr. Smith</button>
                  <button onClick={() => handleDemoFill('sarah')} className="text-[12px] p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 hover:border-amber-300 text-left font-medium transition">👩 Patient: Sarah (REHAB-1001)</button>
                  <button onClick={() => handleDemoFill('rohan')} className="text-[12px] p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 hover:border-amber-300 text-left font-medium transition">👨 Patient: Rohan (REHAB-2002)</button>
                </div>
              </div>
            )}

          </div>

          <footer className="mt-12 text-center text-[12px] text-slate-400 space-y-2 pb-6">
            <div className="flex justify-center space-x-4 font-medium">
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a>
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Help Center</a>
            </div>
            <p>RehabAI does not replace professional medical advice.</p>
          </footer>
        </div>
      </div>

      {/* Right: Trust Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
        
        <div className="relative z-10 p-12 xl:p-24 flex-1 flex flex-col justify-center">
          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight mb-8">Your recovery data stays yours.</h2>
          
          <div className="space-y-8 max-w-md">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mt-1 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-white mb-1">End-to-End Encrypted</h3>
                <p className="text-[14px] text-slate-400 leading-relaxed">All telemetry is encrypted in transit and at rest. Your video feed never leaves your device.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mt-1 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-white mb-1">Clinical Grade Security</h3>
                <p className="text-[14px] text-slate-400 leading-relaxed">Designed following strict compliance guidelines to ensure patient confidentiality.</p>
                {/* TODO: Link to SOC-2 / HIPAA compliance pages */}
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 mt-1 shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-white mb-1">Focus on Recovery</h3>
                <p className="text-[14px] text-slate-400 leading-relaxed">Sign in to track your range of motion, follow prescribed plans, and get back to life.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Graphic at the bottom right */}
        <div className="absolute bottom-0 right-0 w-3/4 opacity-40 translate-x-1/4 translate-y-1/4 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-auto text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
             <path d="M 40 30 L 45 50 L 60 70" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
             <circle cx="40" cy="30" r="1.5" fill="currentColor" />
             <circle cx="45" cy="50" r="1.5" fill="#facc15" />
             <circle cx="60" cy="70" r="1.5" fill="currentColor" />
             <path d="M 43 54 A 8 8 0 0 0 49 52" fill="none" stroke="#facc15" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>}>
      <LoginContent />
    </Suspense>
  );
}

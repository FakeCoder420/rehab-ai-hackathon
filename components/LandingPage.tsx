'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRehab } from '@/context/RehabContext';
import { 
  ShieldCheck, 
  HeartPulse, 
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Stethoscope,
  Smartphone,
  Video,
  Hospital
} from 'lucide-react';

export function LandingPage() {
  const router = useRouter();
  const { setActiveRole } = useRehab();
  const { user } = useAuth();

  const handleDoctorClick = () => {
    setActiveRole('doctor');
    if (user?.role === 'doctor') {
      router.push('/doctor/dashboard');
    } else {
      router.push('/login');
    }
  };

  const handlePatientClick = () => {
    setActiveRole('patient');
    if (user?.role === 'patient') {
      router.push('/patient/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. PREMIUM SPLIT HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white pt-20 pb-16 lg:pt-32 lg:pb-24">
        {/* Subtle mesh/glow */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-gradient-to-bl from-teal-100/40 via-emerald-50/40 to-transparent blur-3xl rounded-full -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-100/40 to-transparent blur-3xl rounded-full -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left side: Copy & CTAs */}
            <div className="space-y-8 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-100/50 border border-emerald-200/50 text-sm font-medium text-emerald-800 shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Award-Winning Post-Op Intelligence</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Accelerate Recovery with <br className="hidden sm:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                  Motion Intelligence
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
                Bridging the gap between orthopedic surgeons and patients through clinically-guided AI tracking, real-time telemetry, and personalized rehab schedules.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleDoctorClick}
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-200 bg-emerald-600 border border-transparent rounded-full shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:scale-105 hover:shadow-xl hover:shadow-emerald-600/40 active:scale-100"
                >
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Clinician Portal
                </button>
                <button
                  onClick={handlePatientClick}
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold transition-all duration-200 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full hover:bg-emerald-100 hover:border-emerald-300 active:scale-95"
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Patient Recovery
                </button>
              </div>
            </div>

            {/* Right side: Visuals & Glassmorphism */}
            <div className="relative lg:ml-10">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                <img 
                  src="/hero-image.png" 
                  alt="Rehab Therapy" 
                  className="object-cover h-[500px] w-full transform hover:scale-105 transition-transform duration-700" 
                />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-64 bg-white/80 backdrop-blur-xl border border-white/40 p-4 rounded-2xl shadow-xl transform translate-y-2 hover:-translate-y-0 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">Recovery Score</span>
                    <div className="flex items-center text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full text-xs font-bold">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12%
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">84</span>
                    <span className="text-sm font-medium text-slate-500">/ 100</span>
                  </div>
                  <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-1.5 rounded-full w-[84%]"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF / TRUST BANNER */}
      <section className="bg-slate-50 border-y border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">
            Trusted by Leading Healthcare Providers
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-lg">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              HIPAA Compliant
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-bold text-lg">
              <Hospital className="w-6 h-6 text-emerald-600" />
              Top 100 Clinics
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-bold text-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              FDA Cleared Tech
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-bold text-lg">
              <HeartPulse className="w-6 h-6 text-emerald-600" />
              SOC2 Certified
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID FEATURES SECTION */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Next-Generation <br className="md:hidden" />
              <span className="text-emerald-600">Rehabilitation</span>
            </h2>
            <p className="text-lg text-slate-600">
              A complete ecosystem designed to optimize patient outcomes through intelligent tracking and seamless clinical communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Computer Vision (2 cols) */}
            <div className="md:col-span-2 group relative overflow-hidden bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
                  alt="Computer Vision Analysis" 
                  className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent"></div>
              </div>
              <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full justify-end">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 border border-emerald-100 text-emerald-600">
                  <Video className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Computer Vision Telemetry</h3>
                <p className="text-slate-600 max-w-md leading-relaxed">
                  Real-time joint angle calculation and rep counting. Our AI analyzes kinematics locally on the device without storing or transmitting raw video, ensuring strict privacy.
                </p>
              </div>
            </div>

            {/* Card 2: Zero Hardware (1 col) */}
            <div className="group bg-emerald-600 rounded-3xl p-8 sm:p-10 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-600/30">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/50 flex items-center justify-center mb-6 border border-emerald-400/50">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Zero-Hardware Needed</h3>
              <p className="text-emerald-50 leading-relaxed">
                Patients use their own smartphone, tablet, or laptop camera. No expensive wearables, sensors, or complex setups required.
              </p>
            </div>

            {/* Card 3: Clinician Oversight (1 col) */}
            <div className="group bg-slate-50 rounded-3xl border border-slate-100 p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-200">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 border border-teal-100 text-teal-600">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Clinician Oversight</h3>
              <p className="text-slate-600 leading-relaxed">
                Surgeons and PTs can monitor cohorts, assign specific therapeutic protocols, and intervene when recovery metrics stall.
              </p>
            </div>

            {/* Card 4: Automated Analytics (2 cols) */}
            <div className="md:col-span-2 group relative overflow-hidden bg-slate-900 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/20 text-white">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" 
                  alt="Analytics Dashboard" 
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
              </div>
              <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full justify-center w-full md:w-2/3">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 border border-slate-700 text-emerald-400">
                  <Activity className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Automated Adherence Analytics</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Track longitudinal recovery data. Our platform aggregates session compliance, pain scores, and ROM progress into actionable insights for the clinical team.
                </p>
                <div className="flex items-center text-emerald-400 font-semibold text-sm group-hover:text-emerald-300 transition-colors">
                  Explore Analytics Dashboard <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FOOTER / FINAL CTA */}
      <footer className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to transform post-surgical care?
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Join the leading orthopedic clinics using AI to bridge the gap between surgery and full mobility.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleDoctorClick}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-bold text-lg transition-colors shadow-lg shadow-emerald-500/25"
            >
              Get Started as Clinician
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 relative z-10">
          <p>© 2026 RehabAI. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">HIPAA Compliance</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Activity, ArrowRight, ShieldCheck, Camera, LineChart, Users, ChevronDown, CheckCircle2, HeartPulse, PlayCircle, Lock
} from 'lucide-react';

export function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  // States for animations & FAQ
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCTA = () => {
    if (isAuthenticated && user) {
      router.push(user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } else {
      router.push('/login');
    }
  };

  const faqs = [
    { q: "Is the AI tracking accurate?", a: "Our proprietary computer vision models track 33 3D skeletal landmarks at 30fps, providing sub-degree accuracy for joint articulation angles." },
    { q: "Do patients need special hardware?", a: "No. RehabAI runs entirely in the browser and works seamlessly with any standard laptop, tablet, or smartphone webcam." },
    { q: "How is patient data protected?", a: "All computer vision processing happens on-device in the browser (Edge AI). No raw video is ever recorded, stored, or transmitted to our servers." }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-900 dark:selection:text-emerald-100">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden flex items-center justify-center">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-400/10 dark:bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text */}
            <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Next-Gen Tele-Rehab Platform</span>
              </div>

              {/* Fluid Typography using Tailwind arbitrary values or clamp */}
              <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Accelerate Recovery with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34d399] to-[#2dd4bf]">Motion Intelligence</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Transform patient outcomes with real-time AI skeletal tracking. Guide exercises, monitor adherence, and adjust protocols remotely—using just a standard webcam.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-2">
                <button 
                  onClick={handleCTA}
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
                >
                  <span>Clinician Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleCTA}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 border border-slate-200 dark:border-slate-700"
                >
                  <span>Patient Recovery</span>
                </button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">No wearables required. Works natively in the browser.</p>
            </div>

            {/* Right Column: Hero Visuals */}
            <div className="lg:col-span-6 relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center justify-center">
              {/* Simulated Skeleton/Camera overlay */}
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                {/* Simulated Webcam Feed */}
                <div className="w-full h-full opacity-40 bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
                
                {/* SVG Skeleton Overlay */}
                <svg className="absolute inset-0 w-full h-full text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                  <path d="M 40 30 L 45 50 L 60 70" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="40" cy="30" r="1.5" fill="currentColor" />
                  <circle cx="45" cy="50" r="1.5" fill="#facc15" />
                  <circle cx="60" cy="70" r="1.5" fill="currentColor" />
                  {/* Angle Arc */}
                  <path d="M 43 54 A 8 8 0 0 0 49 52" fill="none" stroke="#facc15" strokeWidth="0.5" />
                </svg>

                {/* Tracking UI Overlay */}
                <div className="absolute top-6 left-6 bg-slate-950/80 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-xl">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-1"><Activity className="w-4 h-4"/> <span>KNEE ANGLE</span></div>
                  <div className="text-4xl font-mono text-white tracking-tighter">165°</div>
                </div>
                <div className="absolute top-6 right-6 bg-slate-950/80 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-xl text-right">
                  <div className="flex items-center justify-end space-x-2 text-emerald-400 font-bold mb-1"><span>REPS</span></div>
                  <div className="text-4xl font-mono text-white tracking-tighter">8<span className="text-lg text-slate-500">/10</span></div>
                </div>
              </div>

              {/* Glassmorphism Floating Score Card */}
              <div className="absolute -bottom-6 -left-6 sm:bottom-8 sm:-left-12 bg-white dark:bg-slate-900/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-5 rounded-2xl shadow-2xl w-64 transform transition-all duration-700 translate-y-0 opacity-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">Recovery Score</p>
                    <h3 className="text-3xl font-extrabold text-white mt-1">94</h3>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30">+12%</span>
                </div>
                <div className="w-full bg-slate-900/50 rounded-full h-2 mb-1 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full w-[94%]" />
                </div>
                <p className="text-[10px] text-slate-300">Top 5% of cohort</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUSTED BY LOGOS */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">Designed for Clinical Excellence</p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 opacity-70 grayscale">
            {/* TODO: Replace placeholders with actual credentials/logos */}
            <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-300 font-bold text-xl"><ShieldCheck className="w-6 h-6"/><span>HIPAA Compliant</span></div>
            <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-300 font-bold text-xl"><Lock className="w-6 h-6"/><span>SOC-2 Ready</span></div>
            <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-300 font-bold text-xl"><Activity className="w-6 h-6"/><span>EHR Integrable</span></div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Seamless Clinical Workflow</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">From prescription to recovery, RehabAI bridges the gap between clinical visits with continuous remote monitoring.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-200 via-emerald-200 to-slate-200 dark:from-slate-800 dark:via-emerald-800 dark:to-slate-800 -z-10" />

            {[
              { num: 1, title: "Surgeon Assigns Protocol", desc: "Select evidence-based rehab exercises from the library and customize target reps and angles." },
              { num: 2, title: "Patient Exercises at Home", desc: "Patient opens the link on their laptop. AI tracks form in real-time and provides live voice feedback." },
              { num: 3, title: "Clinician Reviews Analytics", desc: "Dashboard highlights adherence, pain reports, and joint mobility trends to inform the next visit." }
            ].map((step) => (
              <div key={step.num} className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center relative group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-950 border-2 border-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-6 shadow-lg shadow-emerald-500/20">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES BENTO GRID */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Platform Capabilities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {/* Bento Card 1: Edge AI */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-colors flex flex-col justify-between">
              <div>
                <Camera className="w-10 h-10 text-emerald-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">On-Device Edge AI</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">Our lightweight MediaPipe models run directly in the browser at 30+ FPS. No raw video is sent to the cloud, ensuring zero latency and 100% privacy.</p>
              </div>
            </div>

            {/* Bento Card 2: Voice Coach */}
            <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-colors flex flex-col justify-between">
              <div>
                <PlayCircle className="w-10 h-10 text-teal-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Interactive Voice Coach</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Patients receive real-time auditory feedback to correct form and count reps automatically.</p>
              </div>
            </div>

            {/* Bento Card 3: Analytics */}
            <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-colors flex flex-col justify-between">
              <div>
                <LineChart className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Mobility Analytics</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Track Range of Motion (ROM) progression over weeks to objectively measure surgical recovery.</p>
              </div>
            </div>

            {/* Bento Card 4: Cohort Oversight */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[24px] p-8 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-colors flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <Users className="w-10 h-10 text-indigo-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Population Oversight</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">Instantly identify which patients are falling behind their protocol or experiencing pain, allowing for proactive clinical interventions.</p>
              </div>
              
              {/* Mini UI Mock */}
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-[400px] h-[200px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-tl-3xl p-6 opacity-60">
                <div className="space-y-4">
                  <div className="h-10 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center px-4"><span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span><div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div></div>
                  <div className="h-10 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center px-4"><span className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></span><div className="h-2 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRIVACY & SAFETY */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Uncompromising Privacy & Security</h2>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            RehabAI was built from the ground up for healthcare. By utilizing on-device machine learning, <strong>we never record, upload, or store video feeds.</strong> Only anonymous telemetry data (joint coordinates and reps) is securely transmitted via end-to-end encryption.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-slate-800 rounded-full text-sm font-semibold text-slate-300 border border-slate-700">Role-Based Access Control</span>
            <span className="px-4 py-2 bg-slate-800 rounded-full text-sm font-semibold text-slate-300 border border-slate-700">No Video Storage</span>
            <span className="px-4 py-2 bg-slate-800 rounded-full text-sm font-semibold text-slate-300 border border-slate-700">Encrypted Telemetry</span>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-10 text-center text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800 transition-colors"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA & FOOTER */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white">Ready to elevate patient recovery?</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">Join the leading orthopedic clinics using RehabAI to deliver superior post-op outcomes and prevent readmissions.</p>
          <button 
            onClick={handleCTA}
            className="px-10 py-5 bg-slate-900 dark:bg-white dark:bg-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 dark:text-white rounded-2xl font-bold shadow-xl transition-transform hover:scale-105"
          >
            Access Clinical Portal
          </button>
          
          <div className="mt-24 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Activity className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-slate-900 dark:text-white">RehabAI</span>
            </div>
            <p>© 2026 RehabAI Technologies. All rights reserved.</p>
            <p className="mt-4 md:mt-0 text-xs max-w-xs text-center md:text-right">
              Disclaimer: RehabAI is a clinical tool. Not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

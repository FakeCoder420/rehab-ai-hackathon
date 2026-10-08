'use client';

import React from 'react';
import { RehabProvider, useRehab } from '@/context/RehabContext';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';
import { DoctorDashboard } from '@/components/DoctorDashboard';
import { PatientDashboard } from '@/components/PatientDashboard';
import { ShieldCheck, HeartPulse } from 'lucide-react';

function RehabAppContent() {
  const { activeRole } = useRehab();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1">
        {activeRole === 'landing' && <LandingPage />}
        {activeRole === 'doctor' && <DoctorDashboard />}
        {activeRole === 'patient' && <PatientDashboard />}
      </main>

      {/* Clinical Grade Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <HeartPulse className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">Rehab AI Tele-Rehabilitation Suite</span>
            <span>• Block 1 Architectural Delivery</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>HIPAA Compliant Protocol</span>
            </span>
            <span>•</span>
            <span>Motion Intelligence Engine v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Page() {
  return <RehabAppContent />;
}

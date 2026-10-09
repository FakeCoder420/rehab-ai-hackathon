'use client';

import React, { useState } from 'react';
import { useRehab } from '@/context/RehabContext';
import { Patient } from '@/types/rehab';
import { 
  TrendingUp, 
  Activity, 
  HeartPulse, 
  Calendar, 
  ShieldCheck, 
  Camera, 
  Target, 
  AlertTriangle,
  Award,
  ChevronRight,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

interface TrackReportsViewProps {
  patients: Patient[];
}

export function TrackReportsView({ patients }: TrackReportsViewProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients[0]?.id || 'pat-sarah-1'
  );

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Mock Longitudinal Recovery Telemetry Data
  const recoveryTrajectoryData = [
    { day: 'Day 1', painScore: 8.2, romAngle: 25, adherence: 60, aiAccuracy: 92 },
    { day: 'Day 4', painScore: 7.1, romAngle: 38, adherence: 75, aiAccuracy: 94 },
    { day: 'Day 7', painScore: 5.8, romAngle: 55, adherence: 85, aiAccuracy: 96 },
    { day: 'Day 10', painScore: 4.4, romAngle: 72, adherence: 90, aiAccuracy: 97 },
    { day: 'Day 14', painScore: 3.2, romAngle: 88, adherence: 95, aiAccuracy: 98 },
    { day: 'Day 18', painScore: 2.1, romAngle: 96, adherence: 98, aiAccuracy: 98 },
  ];

  const weeklyCadenceData = [
    { day: 'Mon', completed: 3, target: 3 },
    { day: 'Tue', completed: 3, target: 3 },
    { day: 'Wed', completed: 2, target: 3 },
    { day: 'Thu', completed: 3, target: 3 },
    { day: 'Fri', completed: 3, target: 3 },
    { day: 'Sat', completed: 2, target: 2 },
    { day: 'Sun', completed: 2, target: 2 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Patient Selector Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Biomechanical & Adherence Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Patient Track Reports & Telemetry
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time visual analog pain curves, Computer Vision joint degrees, and recovery milestones.
          </p>
        </div>

        {/* Patient Picker */}
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Select Patient:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 shadow-2xs"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.accessCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Current Recovery Week</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Week {activePatient?.recoveryWeek || 3}</p>
          <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">Surgical: {activePatient?.surgeryType.split('(')[0]}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Pain Index Trend (VAS)</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">2.1 <span className="text-xs font-normal text-slate-400">/ 10</span></p>
          <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">-74% reduction since Day 1</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Peak ROM Articulation</span>
          <p className="text-2xl font-black text-blue-600 mt-1">96° <span className="text-xs font-normal text-slate-400">flexion</span></p>
          <span className="text-xs text-blue-600 font-semibold mt-0.5 block">Target 90° achieved</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">AI Pose Estimation Accuracy</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">97.8%</p>
          <span className="text-xs text-indigo-600 font-semibold mt-0.5 block">33 Keypoint Tracking Confidence</span>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Joint Range of Motion (ROM) & Pain Reduction Curves */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Range of Motion (ROM) vs. Pain Curve (VAS)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Dual-axis progression over 18 post-op days</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Optimal Recovery
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recoveryTrajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="romAngle" name="ROM Angle (°)" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="painScore" name="Pain Level (0-10)" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Daily Exercise Session Cadence */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Weekly Prescription Adherence Cadence</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Prescribed vs. Completed daily exercise sessions</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              92% Weekly Rate
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCadenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="completed" name="Completed Sessions" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Target Prescriptions" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* AI Clinical Summary */}
      <div className="mt-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-blue-400 mb-3">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">AI Weekly Auto-Summary</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Recovery Progressing Ahead of Baseline</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Patient <strong className="text-white">{activePatient?.name}</strong> demonstrates excellent adherence ({recoveryTrajectoryData[recoveryTrajectoryData.length-1].adherence}%) over the past 14 days. 
              Knee flexion has improved significantly from 25° to <strong className="text-blue-400">{recoveryTrajectoryData[recoveryTrajectoryData.length-1].romAngle}°</strong>, passing the clinical milestone for Week 3. 
              Reported pain levels (VAS) have dropped consistently to {recoveryTrajectoryData[recoveryTrajectoryData.length-1].painScore}/10. 
            </p>
            <div className="mt-4 p-3 bg-slate-950/50 border border-slate-700 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">AI Recommendation</span>
              <span className="text-sm">Patient is ready to transition from passive ROM to active resistance exercises. Consider adding 'Mini Wall Squats' to the routine.</span>
            </div>
          </div>
          
          {/* Export Action */}
          <div className="flex-shrink-0">
            <button className="flex items-center space-x-2 px-5 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-sm font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>Export EMR Report (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Raw Telemetry Data Table */}
      <div className="mt-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-slate-500" />
            <span>Session-by-Session Telemetry Log</span>
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Exercise Protocol</th>
                <th className="px-6 py-4">Compliance</th>
                <th className="px-6 py-4">Peak Angle</th>
                <th className="px-6 py-4">Pain (VAS)</th>
                <th className="px-6 py-4">AI Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 font-medium">
              {[
                { date: 'Oct 9, 2026', ex: 'Seated Knee Extension', comp: '10/10 Reps', angle: '96°', pain: '2', conf: '98%' },
                { date: 'Oct 8, 2026', ex: 'Ankle Pumps', comp: '15/15 Reps', angle: 'N/A', pain: '1', conf: '99%' },
                { date: 'Oct 8, 2026', ex: 'Seated Knee Extension', comp: '10/10 Reps', angle: '94°', pain: '2', conf: '97%' },
                { date: 'Oct 6, 2026', ex: 'Heel Slides', comp: '8/10 Reps', angle: '88°', pain: '4', conf: '95%' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">{row.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{row.ex}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black">{row.comp}</span>
                  </td>
                  <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-bold">{row.angle}</td>
                  <td className="px-6 py-4">{row.pain}/10</td>
                  <td className="px-6 py-4 text-slate-500">{row.conf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

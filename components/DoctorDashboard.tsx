'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRehab } from '@/context/RehabContext';
import { useAuth } from '@/context/AuthContext';
import { CreatePatientModal } from './CreatePatientModal';
import { Patient, ScheduledTask } from '@/types/rehab';
import { 
  Users, Activity, UserPlus, Search, Calendar, Clock, Phone, Globe, CheckCircle2, 
  AlertCircle, ChevronRight, TrendingUp, Stethoscope, Filter, Sparkles, Award,
  Key, PlusCircle, X, FileCheck, Send, BookOpen, Dumbbell, Sun, Moon,
  LayoutDashboard, Menu, Settings, MessageSquare, LogOut, SearchIcon, ArrowUpRight, ArrowDownRight,
  MoreVertical, Eye, HeartPulse
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';
import { ExerciseLibrary } from './doctor/ExerciseLibrary';
import { TrackReportsView } from './doctor/TrackReportsView';

export function DoctorDashboard() {
  const { user, logout } = useAuth();
  const { 
    patients, exercises, scheduledTasks, assignExerciseToPatient,
    setActiveRole, setSelectedPatientId 
  } = useRehab();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'roster' | 'library' | 'reports'>('roster');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'knee' | 'shoulder' | 'acl'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [inspectedPatientId, setInspectedPatientId] = useState<string | null>(null);
  
  const currentDoctorId = user?.id || 'doc-1';
  const doctorPatients = useMemo(() => patients.filter((p) => p.doctorId === currentDoctorId), [patients, currentDoctorId]);
  const doctorTasks = useMemo(() => scheduledTasks.filter((t) => t.doctorId === currentDoctorId), [scheduledTasks, currentDoctorId]);
  
  const activePatients = doctorPatients.length;
  const completedTasks = doctorTasks.filter((t) => t.status === 'completed').length;
  const adherenceRate = doctorTasks.length > 0 ? Math.round((completedTasks / doctorTasks.length) * 100) : 0;
  
  const needsAttention = useMemo(() => doctorPatients.filter(p => {
    const pTasks = doctorTasks.filter(t => t.patientId === p.id);
    if(pTasks.length === 0) return false;
    const completed = pTasks.filter(t => t.status === 'completed').length;
    const rate = completed / pTasks.length;
    return rate < 0.5 || (p as any).lastPainScore || 0 > 6;
  }), [doctorPatients, doctorTasks]);

  const filteredPatients = useMemo(() => {
    return doctorPatients.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(q) || p.surgeryType.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (selectedFilter !== 'all' && !p.surgeryType.toLowerCase().includes(selectedFilter)) return false;
      return true;
    });
  }, [doctorPatients, searchQuery, selectedFilter]);

  const handleOpenPatientView = (id: string) => {
    setSelectedPatientId(id);
    setActiveRole('patient');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <aside className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 flex items-center justify-between md:block">
          
          <button className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800" onClick={() => setIsMobileMenuOpen(false)}><X className="w-5 h-5"/></button>
        </div>
        
        <nav className="px-4 py-4 space-y-1">
          <button onClick={() => setActiveTab('roster')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${activeTab === 'roster' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Users className="w-5 h-5" /> <span>Patient Roster</span>
          </button>
          <button onClick={() => setActiveTab('library')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${activeTab === 'library' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <BookOpen className="w-5 h-5" /> <span>Exercise Library</span>
          </button>
          <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${activeTab === 'reports' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <TrendingUp className="w-5 h-5" /> <span>Clinical Reports</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 lg:p-10">
          <div className="max-w-[1440px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {activeTab === 'roster' && (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Patients</p>
                      <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg"><Users className="w-4 h-4"/></div>
                    </div>
                    <div className="flex items-end space-x-2">
                      <h3 className="text-3xl font-extrabold">{activePatients}</h3>
                      <span className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center mb-1"><ArrowUpRight className="w-3 h-3 mr-0.5"/> 2 this week</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-5 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cohort Adherence</p>
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg"><TrendingUp className="w-4 h-4"/></div>
                    </div>
                    <div className="flex items-end space-x-2">
                      <h3 className="text-3xl font-extrabold">{adherenceRate}%</h3>
                      {adherenceRate >= 80 ? (
                        <span className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center mb-1"><ArrowUpRight className="w-3 h-3 mr-0.5"/> Excellent</span>
                      ) : (
                        <span className="text-[13px] font-semibold text-amber-600 dark:text-amber-500 flex items-center mb-1"><ArrowDownRight className="w-3 h-3 mr-0.5"/> Warning</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-5 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Needs Attention</p>
                      <div className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg"><AlertCircle className="w-4 h-4"/></div>
                    </div>
                    <div className="flex items-end space-x-2">
                      <h3 className="text-3xl font-extrabold text-red-600 dark:text-red-400">{needsAttention.length}</h3>
                      <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mb-1">patients at risk</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-5 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sessions Today</p>
                      <div className="p-2 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg"><CheckCircle2 className="w-4 h-4"/></div>
                    </div>
                    <div className="flex items-end space-x-2">
                      <h3 className="text-3xl font-extrabold">{completedTasks}</h3>
                      <span className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center mb-1"><ArrowUpRight className="w-3 h-3 mr-0.5"/> 14%</span>
                    </div>
                  </div>
                </div>

                {/* Needs Attention Panel */}
                {needsAttention.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-[24px] p-6">
                    <h3 className="text-[16px] font-bold text-red-800 dark:text-red-400 flex items-center mb-4"><AlertCircle className="w-5 h-5 mr-2"/> Clinical Attention Required</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {needsAttention.map(p => (
                        <div key={p.id} className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 rounded-xl p-4 shadow-sm flex justify-between items-center cursor-pointer hover:border-red-300 dark:hover:border-red-800 transition-colors" onClick={() => setInspectedPatientId(p.id)}>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold flex items-center justify-center text-sm shrink-0">
                              {p.name.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-slate-900 dark:text-white">{p.name}</p>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <span className="text-[11px] font-bold px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded uppercase tracking-wider">{(p as any).lastPainScore || 0 > 6 ? 'High Pain' : 'Low Adherence'}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filters & Actions Header */}
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">

                <div className="relative w-full sm:w-64 lg:w-80 group mb-4 sm:mb-0">
                  <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    id="global-search" type="text" placeholder="Search patients (Cmd+K)..." 
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500/50 rounded-xl text-[14px] placeholder-slate-400 transition-all focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                  />
                </div>
</div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {['all', 'knee', 'shoulder', 'acl'].map((f) => (
                      <button key={f} onClick={() => setSelectedFilter(f as any)} className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all shadow-sm ${selectedFilter === f ? 'bg-emerald-600 text-white shadow-emerald-500/25' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'}`}>
                        {f === 'all' ? 'All Patients' : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 border border-transparent dark:border-slate-700 rounded-full text-[14px] font-bold hover:bg-slate-800 dark:hover:bg-slate-700 hover:scale-105 transition-all shadow-md">
                      <PlusCircle className="w-4 h-4" /> <span>Create Prescription</span>
                    </button>
                  </div>
                </div>

                {/* Patient Roster Grid */}
                {filteredPatients.length === 0 ? (
                  <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] border-dashed">
                    <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No patients found</h3>
                    <p className="text-[14px] text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">You don't have any patients matching this filter criteria.</p>
                    <button onClick={() => setIsModalOpen(true)} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[14px] font-bold shadow-md hover:bg-emerald-500 transition-colors">
                      Create your first patient
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPatients.map((p) => {
                      const pTasks = doctorTasks.filter(t => t.patientId === p.id);
                      const comp = pTasks.filter(t => t.status === 'completed').length;
                      const rate = pTasks.length > 0 ? (comp / pTasks.length) : 0;
                      
                      let statusText = 'On Track';
                      let statusColors = 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20';
                      if (rate < 0.5) { statusText = 'At Risk'; statusColors = 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-500/20'; }
                      else if (rate < 0.8) { statusText = 'Review'; statusColors = 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20'; }

                      return (
                        <div key={p.id} onClick={() => setInspectedPatientId(p.id)} className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer group flex flex-col h-full">
                          
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 shrink-0">
                                {p.name.split(' ').map(n=>n[0]).join('')}
                              </div>
                              <div>
                                <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">{p.name}</h3>
                                <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{p.surgeryType}</p>
                              </div>
                            </div>
                            <button className="text-slate-400 group-hover:text-emerald-500 transition-colors"><MoreVertical className="w-5 h-5"/></button>
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Week 3 Post-Op</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColors}`}>{statusText}</span>
                          </div>

                          <div className="mt-auto space-y-4">
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Adherence</p>
                                <p className="text-xl font-extrabold text-slate-900 dark:text-white">{Math.round(rate * 100)}%</p>
                              </div>
                              <div className="w-12 h-12 relative flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90 transform">
                                  <circle cx="24" cy="24" r="20" className="text-slate-100 dark:text-slate-200" strokeWidth="4" stroke="currentColor" fill="none" />
                                  <circle cx="24" cy="24" r="20" className={rate >= 0.8 ? 'text-emerald-500' : rate >= 0.5 ? 'text-amber-500' : 'text-red-500'} strokeWidth="4" strokeDasharray={125} strokeDashoffset={125 - (125 * rate)} strokeLinecap="round" stroke="currentColor" fill="none" />
                                </svg>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[12px] text-slate-500 dark:text-slate-400 font-medium">
                              <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5"/> Last session: 2h ago</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            )}

            {activeTab === 'library' && (
              <div className="mt-6">
                <ExerciseLibrary />
              </div>
            )}
            
            {/* Tab 3: Clinical Reports */}
            {activeTab === 'reports' && (
              <div className="animate-in fade-in duration-300">
                {patients.length > 0 ? (
                  <TrackReportsView patients={patients} />
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <TrendingUp className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Insufficient Data</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                      Please add patients and wait for them to log exercise sessions before viewing clinical telemetry reports.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Patient Drawer (Inspection) */}
      {inspectedPatientId && (
        <>
          <div className="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/60 backdrop-blur-sm z-50 animate-in fade-in" onClick={() => setInspectedPatientId(null)} />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300 flex flex-col">
            
            {(() => {
              const p = patients.find(x => x.id === inspectedPatientId);
              if (!p) return null;
              
              const pTasks = doctorTasks.filter(t => t.patientId === p.id);
              const comp = pTasks.filter(t => t.status === 'completed').length;
              const rate = pTasks.length > 0 ? (comp / pTasks.length) : 0;
              
              return (
                <>
                  <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50 dark:bg-slate-900/50 shrink-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-lg text-slate-700 dark:text-slate-300">
                        {p.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{p.name}</h2>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">{p.surgeryType}</p>
                      </div>
                    </div>
                    <button onClick={() => setInspectedPatientId(null)} className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white shadow-sm border border-slate-200 dark:border-slate-700"><X className="w-5 h-5"/></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Adherence</p>
                        <p className={`text-2xl font-extrabold ${rate >= 0.8 ? 'text-emerald-600' : rate >= 0.5 ? 'text-amber-500' : 'text-red-500'}`}>{Math.round(rate * 100)}%</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pain Score</p>
                        <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{(p as any).lastPainScore || 0} <span className="text-sm font-medium text-slate-500">/10</span></p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center"><Activity className="w-4 h-4 mr-2"/> Range of Motion</h4>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-2"><span>Knee Flexion</span> <span>95° / Target 120°</span></div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full w-[79%]" />
                        </div>
                      </div>

                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center"><TrendingUp className="w-4 h-4 mr-2"/> Patient Progress</h4>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            { day: 'Day 1', adherence: 60, formScore: 85 },
                            { day: 'Day 4', adherence: 75, formScore: 88 },
                            { day: 'Day 7', adherence: 90, formScore: 92 },
                            { day: 'Day 10', adherence: 95, formScore: 96 }
                          ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                              itemStyle={{ color: '#f8fafc' }}
                            />
                            <Line type="monotone" dataKey="adherence" name="Adherence %" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="formScore" name="Form Score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    </div>

                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center"><BookOpen className="w-4 h-4 mr-2"/> Active Prescription</h4>
                      <div className="space-y-3">
                        {pTasks.length === 0 ? <p className="text-sm text-slate-500">No active exercises.</p> : pTasks.map((t, idx) => {
                          const ex = exercises.find(e => e.id === t.exerciseId);
                          return (
                            <div key={idx} className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0"><Dumbbell className="w-5 h-5"/></div>
                                <div>
                                  <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight">{ex?.name}</p>
                                  <p className="text-[11px] text-slate-500">{t.targetReps} reps · {t.targetSets} sets</p>
                                </div>
                              </div>
                              {t.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500"/> : <Clock className="w-5 h-5 text-slate-300"/>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 grid grid-cols-2 gap-4">
                    <button onClick={() => { setInspectedPatientId(null); handleOpenPatientView(p.id); }} className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-[13px] hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center"><Eye className="w-4 h-4 mr-2"/> View Portal</button>
                    <button className="px-4 py-3 bg-slate-900 dark:bg-slate-900 text-white dark:text-white rounded-xl font-bold text-[13px] hover:scale-105 transition shadow-md flex items-center justify-center"><MessageSquare className="w-4 h-4 mr-2"/> Message</button>
                  </div>
                </>
              )
            })()}
          </div>
        </>
      )}

      {isModalOpen && (
        <CreatePatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

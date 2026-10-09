'use client';

import React, { useState, useMemo } from 'react';
import { useRehab } from '@/context/RehabContext';
import { useAuth } from '@/context/AuthContext';
import { ScheduledTask } from '@/types/rehab';
import { VisionSessionModal } from './VisionSessionModal';
import { 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Activity, 
  Phone, 
  Globe, 
  ChevronRight, 
  HeartPulse, 
  RotateCcw,
  Sparkles,
  Info,
  CalendarDays,
  ShieldCheck,
  Lock,
  Dumbbell,
  Trophy,
  Flame,
  Star,
  X
} from 'lucide-react';
import { ExerciseLibrary, EXERCISES } from './doctor/ExerciseLibrary';

export function PatientDashboard() {
  const { user } = useAuth();
  const { 
    patients, 
    scheduledTasks, 
    selectedPatientId, 
    setSelectedPatientId, 
    toggleTaskStatus 
  } = useRehab();

  const [activeSessionTask, setActiveSessionTask] = useState<ScheduledTask | null>(null);
  const [activeTab, setActiveTab] = useState<'schedule' | 'library'>('schedule');

  const activityHistory = useMemo(() => [
    { id: 1, date: 'Oct 3', day: 'Tue', status: 'completed', rom: '82°', pain: '4/10', exercises: 2 },
    { id: 2, date: 'Oct 4', day: 'Wed', status: 'completed', rom: '85°', pain: '3/10', exercises: 3 },
    { id: 3, date: 'Oct 5', day: 'Thu', status: 'missed', rom: '-', pain: '-', exercises: 0 },
    { id: 4, date: 'Oct 6', day: 'Fri', status: 'completed', rom: '88°', pain: '3/10', exercises: 2 },
    { id: 5, date: 'Oct 7', day: 'Sat', status: 'completed', rom: '92°', pain: '2/10', exercises: 3 },
    { id: 6, date: 'Oct 8', day: 'Sun', status: 'completed', rom: '95°', pain: '2/10', exercises: 2 },
    { id: 7, date: 'Oct 9', day: 'Mon', status: 'today', rom: 'Pending', pain: '-', exercises: 2 },
  ], []);

  const [selectedHistory, setSelectedHistory] = useState(activityHistory[5]);


  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'library') {
        setActiveTab('library');
      }

      const handleTabSwitch = (e: Event) => {
        const customEvt = e as CustomEvent<string>;
        if (customEvt.detail === 'library') {
          setActiveTab('library');
        } else if (customEvt.detail === 'schedule') {
          setActiveTab('schedule');
        }
      };

      window.addEventListener('switch-patient-tab', handleTabSwitch);
      return () => {
        window.removeEventListener('switch-patient-tab', handleTabSwitch);
      };
    }
  }, []);

  const isPatientLoggedIn = user?.role === 'patient';
  const effectivePatientId = isPatientLoggedIn && user.linkedPatientId 
    ? user.linkedPatientId 
    : selectedPatientId;

  const currentPatient = useMemo(() => {
    return patients.find((p) => p.id === effectivePatientId) || patients[0];
  }, [patients, effectivePatientId]);

  const isolatedTasks = useMemo(() => {
    if (!currentPatient) return [];
    return scheduledTasks
      .filter((t) => t.patientId === currentPatient.id)
      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
  }, [scheduledTasks, currentPatient]);

  if (!currentPatient) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 dark:text-slate-400">No patient record linked to this account.</p>
      </div>
    );
  }

  const totalTasks = isolatedTasks.length;
  const completedTasks = isolatedTasks.filter((t) => t.status === 'completed').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const handleStartSession = (task: ScheduledTask) => {
    setActiveSessionTask(task);
  };

  const handleSessionComplete = (taskId: string) => {
    const task = isolatedTasks.find((t) => t.id === taskId);
    if (task && task.status === 'pending') {
      toggleTaskStatus(taskId);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900/70 pb-20">
      
      {/* 1. Patient Profile Summary Bar & Recovery Score */}
      <section className="bg-gradient-to-r from-emerald-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-emerald-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Profile & Info (Spans 2 cols) */}
            <div className="lg:col-span-2 flex flex-col justify-between">
              
              <div className="flex items-start space-x-5">
                {/* Bigger, Bolder Avatar */}
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-emerald-600/30 flex-shrink-0 border-4 border-white">
                  {currentPatient.name.split(' ').map((n) => n[0]).join('')}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {currentPatient.name}
                    </h1>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1 shadow-sm">
                      <HeartPulse className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      <span>Recovery Week {currentPatient.recoveryWeek} Post-Op</span>
                    </span>
                    {!isPatientLoggedIn && (
                      <div className="flex items-center space-x-2 bg-white dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                        <select
                          value={effectivePatientId}
                          onChange={(e) => setSelectedPatientId(e.target.value)}
                          className="text-xs font-bold bg-transparent px-2 py-0.5 text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          {patients.map((p) => (
                            <option key={p.id} value={p.id}>View: {p.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Encouraging Text */}
                  <p className="text-sm font-semibold text-emerald-700 mt-2 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>You're doing great, {currentPatient.name.split(' ')[0]}! Keep up the momentum today.</span>
                  </p>

                  {/* Cleaned up Info Grid (2-column on desktop) */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl border border-emerald-100/50 dark:border-slate-700 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-4 h-4 text-teal-600" />
                      <span><strong className="dark:text-white">Procedure:</strong> {currentPatient.surgeryType}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span><strong className="dark:text-white">Date:</strong> {currentPatient.surgeryDate}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-teal-600" />
                      <span><strong className="dark:text-white">Caregiver:</strong> {currentPatient.caregiverContact}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      <span><strong className="dark:text-white">Isolation:</strong> Active & Secure</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adherence Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Today's Prescribed Routine Adherence</span>
                  </span>
                  <span className="text-slate-900 dark:text-white">
                    {completedTasks} of {totalTasks} Sessions ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-white dark:bg-slate-800 border border-emerald-100 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${
                      progressPercent === 100
                        ? 'bg-emerald-500'
                        : progressPercent > 0
                        ? 'bg-gradient-to-r from-teal-400 to-emerald-500'
                        : 'bg-slate-300'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Recovery Score Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-emerald-100 shadow-xl shadow-emerald-900/5 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-emerald-500"></div>
              
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Recovery Score</h3>
              </div>
              
              <div className="relative flex items-center justify-center mb-2">
                <div className="w-28 h-28 rounded-full border-8 border-emerald-50 flex items-center justify-center relative shadow-inner">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="46%" className="stroke-current text-emerald-500" strokeWidth="8" fill="transparent" strokeDasharray="289" strokeDashoffset="46" strokeLinecap="round" />
                  </svg>
                  <div className="flex flex-col items-center z-10">
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">84</span>
                  </div>
                </div>
              </div>
              
              <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 font-bold px-4 mb-5 uppercase tracking-wider">
                Based on adherence & AI analytics
              </p>

              {/* Rehab Timeline Progress */}
              <div className="w-full mt-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 px-1">
                  <span>Wk 1</span>
                  <span>Wk 2</span>
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 rounded">Wk 3</span>
                  <span>Wk 4</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div className="h-full bg-emerald-500 w-1/4 border-r-2 border-emerald-600"></div>
                  <div className="h-full bg-emerald-500 w-1/4 border-r-2 border-emerald-600"></div>
                  <div className="h-full bg-emerald-400 w-1/4 animate-pulse relative">
                     <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-600"></div>
                  </div>
                  <div className="h-full bg-transparent w-1/4"></div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Recovery Streak & Activity Timeline */}
      <section className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Streak Counter */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              <span>Activity Timeline</span>
            </h3>
            <div className="flex items-center space-x-2 bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800/60 px-3 py-1.5 rounded-full shadow-sm">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-black text-amber-700 dark:text-amber-400">3 Day Streak!</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Horizontal Scrollable Timeline Strip */}
            <div className="lg:col-span-2 flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {activityHistory.map((log) => (
                <button
                  key={log.id}
                  onClick={() => setSelectedHistory(log)}
                  className={`flex flex-col items-center justify-center min-w-[4rem] sm:min-w-[5rem] py-3 rounded-2xl border-2 transition-all ${
                    selectedHistory.id === log.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-md transform scale-105'
                      : 'border-transparent bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{log.day}</span>
                  <span className={`text-lg font-black mt-0.5 ${selectedHistory.id === log.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {log.date.split(' ')[1]}
                  </span>
                  <div className="mt-2">
                    {log.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : log.status === 'missed' ? (
                      <X className="w-4 h-4 text-rose-500" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 block mt-1"></span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Right: Selected Day Details Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col justify-center">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedHistory.date} Summary</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                  selectedHistory.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 
                  selectedHistory.status === 'missed' ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400' : 
                  'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {selectedHistory.status}
                </span>
              </div>
              
              {selectedHistory.status === 'missed' ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">No exercises logged on this day. Streak was broken.</p>
              ) : selectedHistory.status === 'today' ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">Sessions are pending for today. Scroll down to start.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold">Sessions</span>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200">{selectedHistory.exercises} Completed</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold">Peak ROM</span>
                    <p className="text-sm font-black text-blue-600 dark:text-blue-400">{selectedHistory.rom}</p>
                  </div>
                  <div className="col-span-2 mt-1 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center space-x-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Avg Pain Score: {selectedHistory.pain}</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Tab Navigation: Schedule vs Exercise Library */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-3 py-2.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'schedule'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Prescribed Schedule</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                activeTab === 'schedule' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {isolatedTasks.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'library'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Exercise Library</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Daily Schedule View */}
      {activeTab === 'schedule' && (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Schedule Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black text-emerald-600 uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>Next Action Required</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Your Daily Routine for {todayFormatted}
            </h2>
          </div>
        </div>

        {/* Schedule Cards / Time Grid */}
        {isolatedTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Rest and recover!</h3>
            <p className="text-[14px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2">
              You have no scheduled exercises today. Take this time to rest and let your body heal. You're doing great!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {isolatedTasks.map((task, index) => {
              const isCompleted = task.status === 'completed';
              // Find matching exercise to get the thumbnail image
              const matchedExercise = EXERCISES.find(ex => ex.id === task.exerciseId || ex.title === task.exerciseName);
              const thumbUrl = matchedExercise?.image_url || 'https://placehold.co/100x100/eeeeee/999999?text=Exercise';

              return (
                <div
                  key={task.id}
                  className={`relative bg-white dark:bg-slate-800 rounded-3xl transition-all duration-300 p-5 sm:p-6 shadow-sm overflow-hidden ${
                    isCompleted
                      ? 'border border-slate-200 dark:border-slate-700 opacity-75 bg-slate-50 dark:bg-slate-900/50 grayscale-[20%]'
                      : 'border-l-8 border-emerald-500 border-y border-r border-slate-200 dark:border-slate-700 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Left: Time Slot Pill, Thumbnail & Exercise Details */}
                    <div className="flex items-center space-x-5 flex-1">
                      
                      {/* Scheduled Time Slot Badge */}
                      <div className="hidden sm:flex flex-col items-center justify-center w-28 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex-shrink-0 transition-colors">
                        <Clock className="w-4 h-4 text-emerald-600 mb-1" />
                        <span className="text-xs font-black text-slate-900 dark:text-white text-center leading-tight">
                          {task.timeSlot}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase">Session {index + 1}</span>
                      </div>

                      {/* Thumbnail Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
                        <img 
                          src={thumbUrl} 
                          alt={task.exerciseName} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Exercise Name & Target Reps/Sets */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className={`text-lg sm:text-xl font-extrabold ${isCompleted ? 'text-slate-700' : 'text-slate-900 dark:text-white'}`}>
                            {task.exerciseName}
                          </h3>
                          
                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-black ${
                              isCompleted
                                ? 'bg-slate-200 text-slate-600 dark:text-slate-400'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse'
                            }`}
                          >
                            {isCompleted ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                <span>Completed</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 mr-1 fill-current" />
                                <span>Up Next</span>
                              </>
                            )}
                          </span>
                        </div>

                        {/* Targets Chips */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                            Target: {task.targetReps} Reps
                          </span>
                          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                            Sets: {task.targetSets || 3}
                          </span>
                          {task.completedAt && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>Logged at {task.completedAt}</span>
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col items-stretch sm:items-end gap-3 pt-4 lg:pt-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-slate-100 flex-shrink-0">
                      
                      {/* "Start Exercise Session" Button */}
                      <button
                        type="button"
                        onClick={() => handleStartSession(task)}
                        className={`inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-black text-sm transition-all duration-300 w-full sm:w-auto ${
                          isCompleted
                            ? 'border-2 border-slate-300 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 hover:-translate-y-1'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <RotateCcw className="w-4 h-4" />
                            <span>Review / Retake</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 fill-current" />
                            <span className="tracking-wide">START SESSION</span>
                          </>
                        )}
                      </button>

                      {/* Manual Quick Status Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleTaskStatus(task.id)}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:text-slate-400 underline text-center sm:text-right"
                      >
                        {isCompleted ? 'Mark as pending' : 'Quick mark as done (skip video)'}
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Post-Op Safety Note Callout */}
        <div className="mt-8 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-blue-100 shadow-sm flex items-start space-x-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <div className="p-2 bg-blue-50 rounded-full flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div className="leading-relaxed mt-0.5">
            <strong className="text-slate-800 dark:text-slate-200">Safety Notice:</strong> If you experience sharp, sudden pain or excessive swelling during your session, immediately stop and contact your care team at <strong className="text-blue-700">{currentPatient.caregiverContact}</strong>.
          </div>
        </div>

      </main>
      )}

      {/* Exercise Library View */}
      {activeTab === 'library' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <ExerciseLibrary />
        </main>
      )}

      {/* Interactive AI Session HUD Modal */}
      <VisionSessionModal
        isOpen={Boolean(activeSessionTask)}
        onClose={() => setActiveSessionTask(null)}
        exerciseName={activeSessionTask?.exerciseName}
        targetReps={activeSessionTask?.targetReps}
      />

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRehab } from '@/context/RehabContext';
import { useAuth } from '@/context/AuthContext';
import { CreatePatientModal } from './CreatePatientModal';
import { Patient, ScheduledTask } from '@/types/rehab';
import { 
  Users, 
  Activity, 
  UserPlus, 
  Search, 
  Calendar, 
  Clock, 
  Phone, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  TrendingUp, 
  Stethoscope, 
  Filter, 
  Sparkles, 
  Award,
  Key,
  PlusCircle,
  X,
  FileCheck,
  Send,
  BookOpen,
  Dumbbell,
  Sun,
  Moon
} from 'lucide-react';
import { ExerciseLibrary } from './doctor/ExerciseLibrary';

export function DoctorDashboard() {
  const { user } = useAuth();
  const { 
    patients, 
    exercises,
    scheduledTasks, 
    assignExerciseToPatient,
    setActiveRole, 
    setSelectedPatientId 
  } = useRehab();

  const [activeTab, setActiveTab] = useState<'roster' | 'library'>('roster');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'knee' | 'shoulder' | 'acl'>('all');
  const [notification, setNotification] = useState<string | null>(null);

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
        } else if (customEvt.detail === 'roster') {
          setActiveTab('roster');
        }
      };

      window.addEventListener('switch-doctor-tab', handleTabSwitch);
      return () => {
        window.removeEventListener('switch-doctor-tab', handleTabSwitch);
      };
    }
  }, []);

  const [inspectedPatient, setInspectedPatient] = useState<Patient | null>(null);
  const [showAddExerciseForm, setShowAddExerciseForm] = useState(false);
  const [selectedExerciseIdToAdd, setSelectedExerciseIdToAdd] = useState('ex-4');
  const [selectedTimeSlotToAdd, setSelectedTimeSlotToAdd] = useState('Evening 06:00 PM');

  const currentDoctorId = user?.id || 'doc-1';
  const doctorPatients = patients.filter((p) => p.doctorId === currentDoctorId);

  const doctorTasks = scheduledTasks.filter((t) => t.doctorId === currentDoctorId);
  const doctorCompleted = doctorTasks.filter((t) => t.status === 'completed').length;
  const doctorCompliance = doctorTasks.length > 0 ? Math.round((doctorCompleted / doctorTasks.length) * 100) : 0;

  const filteredPatients = doctorPatients.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.surgeryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.accessCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'knee') {
      return patient.surgeryType.toLowerCase().includes('knee') || patient.surgeryType.toLowerCase().includes('tka');
    }
    if (selectedFilter === 'shoulder') {
      return patient.surgeryType.toLowerCase().includes('shoulder') || patient.surgeryType.toLowerCase().includes('rotator');
    }
    if (selectedFilter === 'acl') {
      return patient.surgeryType.toLowerCase().includes('acl');
    }

    return true;
  });

  const handlePatientCreated = (newPatientId: string, credentials?: { accessCode: string; tempPassword: string }) => {
    const p = patients.find((item) => item.id === newPatientId);
    const codeNotice = credentials ? ` (Access Code: ${credentials.accessCode})` : '';
    setNotification(`Successfully registered and prescribed protocol for ${p?.name || 'new patient'}${codeNotice}`);
    setTimeout(() => setNotification(null), 6000);
  };

  const handleOpenPatientView = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveRole('patient');
  };

  const handleAssignExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectedPatient) return;

    assignExerciseToPatient(
      inspectedPatient.id,
      selectedExerciseIdToAdd,
      selectedTimeSlotToAdd,
      currentDoctorId
    );

    const exName = exercises.find((ex) => ex.id === selectedExerciseIdToAdd)?.name || 'Exercise';
    setNotification(`Dynamically assigned "${exName}" to ${inspectedPatient.name}'s schedule!`);
    setShowAddExerciseForm(false);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/60 pb-16">
      
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Clinician Oversight Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Rehabilitation protocol oversight and patient therapy tracking.
              </p>
            </div>

            {/* "+ Create New Patient" CTA Button */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Create New Patient</span>
              </button>
            </div>
          </div>

          {/* Notification banner */}
          {notification && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{notification}</span>
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="text-emerald-700 hover:text-emerald-950 font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* 3 Main Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            
            {/* Stat 1: Patients */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 to-white border border-slate-200 border-l-4 border-l-blue-500 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Patients</p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-extrabold text-slate-900">{doctorPatients.length}</span>
                  <span className="text-xs font-medium text-blue-600">Active Cohort</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 2: Adherence */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/50 to-white border border-slate-200 border-l-4 border-l-emerald-500 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Adherence</p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-extrabold text-slate-900">{doctorCompliance}%</span>
                  <span className="text-xs font-medium text-emerald-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> High
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 3: Tasks */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/50 to-white border border-slate-200 border-l-4 border-l-indigo-500 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tasks</p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {doctorCompleted} / {doctorTasks.length}
                  </span>
                  <span className="text-xs font-medium text-slate-500">completed</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-3 py-2.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'roster'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Patient Roster</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'roster' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {doctorPatients.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'library'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Exercise Library</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Patient Roster & Analytics */}
      {activeTab === 'roster' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Controls Bar: Search & Category filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, surgery, or access code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({doctorPatients.length})
            </button>
            <button
              onClick={() => setSelectedFilter('knee')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedFilter === 'knee'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Knee
            </button>
            <button
              onClick={() => setSelectedFilter('shoulder')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedFilter === 'shoulder'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Shoulder
            </button>
            <button
              onClick={() => setSelectedFilter('acl')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedFilter === 'acl'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              ACL
            </button>
          </div>
        </div>

        {/* List of Patients created by this doctor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Patients Linked to You ({filteredPatients.length})
            </h2>
            <span className="text-xs text-slate-500 hidden sm:block">
              Click any card to inspect compliance & dynamically assign exercises
            </span>
          </div>

          {filteredPatients.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No patients found for this doctor account.</p>
              <p className="text-xs text-slate-500 mt-1">Click "+ Create New Patient" above to assign your first patient.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPatients.map((patient) => {
                const patientTasks = scheduledTasks.filter((t) => t.patientId === patient.id);
                const completedCount = patientTasks.filter((t) => t.status === 'completed').length;
                const totalCount = patientTasks.length;
                const patientCompliance = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                return (
                  <div
                    key={patient.id}
                    onClick={() => setInspectedPatient(patient)}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* Patient Card Top */}
                      <div className="flex flex-row items-start justify-between mb-4">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2.5">
                            {/* EMR Status Indicator */}
                            {patientCompliance < 50 ? (
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                              </span>
                            ) : (
                              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                            )}
                            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                              {patient.name}
                            </h3>
                            <span className="text-sm font-semibold text-slate-500 hidden sm:inline-block">Age {patient.age}</span>
                          </div>
                          <p className="text-xs font-semibold text-emerald-700 mt-1 ml-5">
                            {patient.surgeryType}
                          </p>
                        </div>

                        {/* ID Pill */}
                        <div className="flex flex-col items-end">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-mono font-bold tracking-widest border border-slate-200">
                            ID: {patient.accessCode}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400 mt-1.5">
                            Week {patient.recoveryWeek} Post-Op
                          </span>
                        </div>
                      </div>

                      {/* Caregiver & Language */}
                      <div className="p-3 bg-slate-50/80 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 mb-5 border border-slate-100">
                        <div className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium">{patient.caregiverContact}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700">{patient.language}</span>
                        </div>
                      </div>

                      {/* Assigned Routines List */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Assigned Prescriptions ({patientTasks.length})
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            Adherence: <strong className="text-slate-800">{completedCount}/{totalCount}</strong> ({patientCompliance}%)
                          </span>
                        </div>

                        {/* Progress Bar (EMR Sleek) */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200/50">
                          <div
                            className={`h-full transition-all duration-500 ${
                              patientCompliance >= 50 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${patientCompliance}%` }}
                          />
                        </div>

                        {/* Routine items chips */}
                        <div className="space-y-2.5">
                          {patientTasks.length === 0 ? (
                            <p className="text-xs text-slate-400 italic px-1">No exercises assigned yet.</p>
                          ) : (
                            patientTasks.map((task) => {
                              const isMorning = task.timeSlot.toLowerCase().includes('morning');
                              const isEvening = task.timeSlot.toLowerCase().includes('evening') || task.timeSlot.toLowerCase().includes('night');
                              
                              return (
                              <div
                                key={task.id}
                                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/80 text-xs transition-colors hover:bg-slate-100/60"
                              >
                                <div className="flex items-center space-x-3">
                                  {isMorning ? (
                                    <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                  ) : isEvening ? (
                                    <Moon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                  )}
                                  <div>
                                    <span className="font-bold text-slate-800">{task.exerciseName}</span>
                                    <span className="text-slate-500 ml-1.5 font-medium">
                                      ({task.targetReps} reps)
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center">
                                  <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                    task.status === 'completed'
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {task.status}
                                  </span>
                                </div>
                              </div>
                            )})
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium group-hover:text-emerald-600 transition-colors">
                        Click card to inspect & manage
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPatientView(patient.id);
                        }}
                        className="inline-flex items-center space-x-1 font-bold text-slate-700 hover:text-emerald-700 py-1.5 px-3 rounded-lg hover:bg-emerald-50 transition"
                      >
                        <span>Preview Patient Portal</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
      )}

      {/* Exercise Library View */}
      {activeTab === 'library' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <ExerciseLibrary />
        </div>
      )}

      {/* Inspected Patient Detail Drawer / Modal */}
      {inspectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-5 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold">{inspectedPatient.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-mono font-bold">
                    {inspectedPatient.accessCode}
                  </span>
                </div>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Procedure: {inspectedPatient.surgeryType} • Week {inspectedPatient.recoveryWeek} Post-Op
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setInspectedPatient(null); setShowAddExerciseForm(false); }}
                className="p-1 rounded-lg hover:bg-white/10 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[calc(80vh-6rem)] overflow-y-auto">
              
              {/* Patient Live Compliance Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Exercises</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">
                    {scheduledTasks.filter((t) => t.patientId === inspectedPatient.id).length} Prescribed
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase text-emerald-700">Completed Today</span>
                  <p className="text-lg font-bold text-emerald-800 mt-0.5">
                    {scheduledTasks.filter((t) => t.patientId === inspectedPatient.id && t.status === 'completed').length} Sessions
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase text-blue-700">Caregiver Contact</span>
                  <p className="text-xs font-bold text-blue-900 truncate mt-0.5">
                    {inspectedPatient.caregiverContact}
                  </p>
                </div>
              </div>

              {/* Assigned Exercise List for Inspected Patient */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Assigned Therapy Schedule
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddExerciseForm(!showAddExerciseForm)}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-800"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Add New Exercise</span>
                  </button>
                </div>

                {/* Inline Exercise Assignment Form */}
                {showAddExerciseForm && (
                  <form onSubmit={handleAssignExercise} className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 mb-4 animate-in fade-in">
                    <h5 className="text-xs font-bold text-emerald-900">Assign Additional Exercise (Real-Time Sync)</h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Select Exercise</label>
                        <select
                          value={selectedExerciseIdToAdd}
                          onChange={(e) => setSelectedExerciseIdToAdd(e.target.value)}
                          className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                        >
                          {exercises.map((ex) => (
                            <option key={ex.id} value={ex.id}>
                              {ex.name} ({ex.targetReps} reps)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Scheduled Time Slot</label>
                        <select
                          value={selectedTimeSlotToAdd}
                          onChange={(e) => setSelectedTimeSlotToAdd(e.target.value)}
                          className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                        >
                          <option value="Morning 08:30 AM">Morning 08:30 AM</option>
                          <option value="Morning 10:00 AM">Morning 10:00 AM</option>
                          <option value="Afternoon 02:00 PM">Afternoon 02:00 PM</option>
                          <option value="Evening 06:00 PM">Evening 06:00 PM</option>
                          <option value="Night 08:30 PM">Night 08:30 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddExerciseForm(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Push to Patient Schedule Now</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Existing Tasks */}
                <div className="space-y-2">
                  {scheduledTasks
                    .filter((t) => t.patientId === inspectedPatient.id)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-3">
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          )}
                          <div>
                            <span className="font-bold text-slate-900">{task.exerciseName}</span>
                            <span className="text-slate-500 ml-2 font-normal">
                              Target: {task.targetReps} reps • {task.timeSlot}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          task.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Doctor ID: {inspectedPatient.doctorId} • Patient ID: {inspectedPatient.id}
              </span>
              <button
                type="button"
                onClick={() => {
                  handleOpenPatientView(inspectedPatient.id);
                  setInspectedPatient(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
              >
                Open in Patient Portal
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Create Patient Modal instance */}
      <CreatePatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePatientCreated}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRehab } from '@/context/RehabContext';
import { Exercise } from '@/types/rehab';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { 
  Search, 
  Filter, 
  Video, 
  Activity, 
  Compass, 
  Target, 
  Clock, 
  Eye, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface ExerciseLibraryHubProps {
  onPrescribeExercise?: (exercise: Exercise) => void;
}

export function ExerciseLibraryHub({ onPrescribeExercise }: ExerciseLibraryHubProps) {
  const { exercises } = useRehab();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJoint, setSelectedJoint] = useState<'all' | 'knee' | 'shoulder' | 'ankle' | 'hip'>('all');
  const [activeModalExercise, setActiveModalExercise] = useState<Exercise | null>(null);

  // Filter exercises by query and anatomy
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ex.indications && ex.indications.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedJoint === 'knee') {
      return ex.name.toLowerCase().includes('knee') || ex.name.toLowerCase().includes('leg') || ex.name.toLowerCase().includes('heel');
    }
    if (selectedJoint === 'shoulder') {
      return ex.name.toLowerCase().includes('shoulder') || ex.name.toLowerCase().includes('pendulum') || ex.name.toLowerCase().includes('arm') || ex.name.toLowerCase().includes('wall');
    }
    if (selectedJoint === 'ankle') {
      return ex.name.toLowerCase().includes('ankle') || ex.category.toLowerCase().includes('ankle');
    }
    if (selectedJoint === 'hip') {
      return ex.name.toLowerCase().includes('hip') || ex.name.toLowerCase().includes('leg');
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Controls & Category Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Clinical Motion Catalog</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Full Exercise Reference Hub
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive biomechanical protocols, Computer Vision target angles, and surgical indications.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search exercise, muscle, or protocol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition"
            />
          </div>

        </div>

        {/* Anatomy Quick Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 flex items-center space-x-1 flex-shrink-0 mr-1">
            <Filter className="w-3 h-3" />
            <span>Anatomy:</span>
          </span>

          <button
            onClick={() => setSelectedJoint('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex-shrink-0 ${
              selectedJoint === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Protocols ({exercises.length})
          </button>

          <button
            onClick={() => setSelectedJoint('knee')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex-shrink-0 ${
              selectedJoint === 'knee'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Knee Complex
          </button>

          <button
            onClick={() => setSelectedJoint('shoulder')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex-shrink-0 ${
              selectedJoint === 'shoulder'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Shoulder & Scapula
          </button>

          <button
            onClick={() => setSelectedJoint('ankle')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex-shrink-0 ${
              selectedJoint === 'ankle'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Ankle & Calf
          </button>

          <button
            onClick={() => setSelectedJoint('hip')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex-shrink-0 ${
              selectedJoint === 'hip'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Hip Joint
          </button>
        </div>
      </div>

      {/* Grid of Exercise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => {
          return (
            <div
              key={exercise.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Simulated Thumbnail / Video Preview Banner */}
                <div 
                  onClick={() => setActiveModalExercise(exercise)}
                  className="relative h-44 w-full bg-slate-950 flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  {/* Subtle Grid overlay */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Pose estimation silhouette container */}
                  <div className="relative z-10 flex flex-col items-center group-hover:scale-105 transition-transform duration-200">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center mb-1.5 shadow-md shadow-blue-500/20">
                      <Video className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span className="text-[11px] font-mono text-cyan-300 font-semibold tracking-wider">
                      AI MOTION PROTOCOL
                    </span>
                  </div>

                  {/* Category Pill on top left */}
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-xl px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                    {exercise.category}
                  </div>

                  {/* Play badge on hover */}
                  <div className="absolute bottom-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-md opacity-90 group-hover:opacity-100 flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>Inspect</span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {exercise.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {exercise.instructions}
                    </p>
                  </div>

                  {/* Target Joint Angle Metric (Requirement 1) */}
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs text-blue-900 font-semibold">
                      <Compass className="w-4 h-4 text-blue-600" />
                      <span>Target Articulation:</span>
                    </div>
                    <span className="text-xs font-black font-mono text-blue-700">
                      {exercise.targetAngle || '0° - 90°'}
                    </span>
                  </div>

                  {/* Targeted Muscles Pills */}
                  {exercise.primaryMuscles && (
                    <div className="flex flex-wrap gap-1">
                      {exercise.primaryMuscles.slice(0, 2).map((m, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold"
                        >
                          {m}
                        </span>
                      ))}
                      {exercise.primaryMuscles.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-semibold">
                          +{exercise.primaryMuscles.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Benchmarks Strip */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Target className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exercise.targetReps} reps × {exercise.targetSets} sets</span>
                    </div>

                    <div className="flex items-center space-x-1 text-slate-500 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{exercise.defaultTimeSlot.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Bottom CTA Button */}
              <div className="px-5 pb-5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalExercise(exercise)}
                  className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-xs font-bold transition-all duration-150"
                >
                  <span>View Details & Motion Model</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Exercise Detail Modal Instance */}
      <ExerciseDetailModal
        exercise={activeModalExercise}
        isOpen={Boolean(activeModalExercise)}
        onClose={() => setActiveModalExercise(null)}
        onSelectForPrescription={onPrescribeExercise}
      />

    </div>
  );
}

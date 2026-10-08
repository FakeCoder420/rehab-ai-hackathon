'use client';

import React from 'react';
import { Exercise } from '@/types/rehab';
import { 
  CheckSquare, 
  Square, 
  Clock, 
  Sparkles, 
  RotateCcw, 
  Layers, 
  Target, 
  ChevronDown, 
  ChevronUp,
  Activity
} from 'lucide-react';

export interface ExercisePrescriptionConfig {
  exerciseId: string;
  reps: number;
  sets: number;
  timeSlot: string;
}

interface CompactExerciseSelectorProps {
  exercises: Exercise[];
  selectedExerciseIds: string[];
  prescriptionConfigs: Record<string, { reps: number; sets: number; timeSlot: string }>;
  onToggleExercise: (exerciseId: string) => void;
  onUpdateConfig: (exerciseId: string, updates: Partial<{ reps: number; sets: number; timeSlot: string }>) => void;
  onApplyPreset: (presetName: 'acl-knee' | 'shoulder') => void;
  onClearAll: () => void;
}

const COMMON_SLOTS = [
  'Morning 09:00 AM',
  'Morning 10:30 AM',
  'Afternoon 01:00 PM',
  'Afternoon 03:30 PM',
  'Evening 05:00 PM',
  'Evening 06:30 PM',
  'Night 08:30 PM',
];

export function CompactExerciseSelector({
  exercises,
  selectedExerciseIds,
  prescriptionConfigs,
  onToggleExercise,
  onUpdateConfig,
  onApplyPreset,
  onClearAll,
}: CompactExerciseSelectorProps) {
  return (
    <div className="space-y-3.5">
      
      {/* 1-Click Protocol Preset Header Row (Requirement 2) */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Clinical Presets:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onApplyPreset('acl-knee')}
              className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition active:scale-95"
            >
              [+ Apply ACL Knee Protocol]
            </button>

            <button
              type="button"
              onClick={() => onApplyPreset('shoulder')}
              className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition active:scale-95"
            >
              [+ Apply Shoulder Protocol]
            </button>

            {selectedExerciseIds.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="px-2 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition"
                title="Reset selection"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Selected Counter & Guidance */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Check exercises to customize rep cadence & schedule slots:</span>
        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
          {selectedExerciseIds.length} Selected
        </span>
      </div>

      {/* Compact Scrollable List of Exercises */}
      <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 border border-slate-200 rounded-2xl p-2 bg-white">
        {exercises.map((exercise) => {
          const isSelected = selectedExerciseIds.includes(exercise.id);
          const config = prescriptionConfigs[exercise.id] || {
            reps: exercise.targetReps,
            sets: exercise.targetSets,
            timeSlot: exercise.defaultTimeSlot || 'Morning 09:00 AM',
          };

          return (
            <div
              key={exercise.id}
              className={`rounded-xl border transition-all duration-150 overflow-hidden ${
                isSelected
                  ? 'border-blue-400 bg-blue-50/40 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Exercise Row Header */}
              <div
                className="p-3 flex items-center justify-between cursor-pointer select-none"
                onClick={() => onToggleExercise(exercise.id)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-blue-600 flex-shrink-0">
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 fill-blue-50" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{exercise.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-slate-100 text-slate-600">
                        {exercise.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {exercise.targetAngle || '0° - 90°'} • Benchmark: {exercise.targetReps} reps × {exercise.targetSets} sets
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-400 flex items-center space-x-1">
                  {isSelected ? (
                    <span className="text-[11px] font-bold text-blue-600">Active</span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Add</span>
                  )}
                </div>
              </div>

              {/* Expanded Inline Input Controls (when checked) */}
              {isSelected && (
                <div className="px-3 pb-3 pt-1 border-t border-blue-200/60 bg-blue-50/60 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1.5">
                    
                    {/* Control 1: Target Reps */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center space-x-1">
                        <Target className="w-3 h-3 text-blue-600" />
                        <span>Target Reps</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={config.reps}
                        onChange={(e) => onUpdateConfig(exercise.id, { reps: Number(e.target.value) || 1 })}
                        className="w-full text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Control 2: Target Sets */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center space-x-1">
                        <Layers className="w-3 h-3 text-indigo-600" />
                        <span>Target Sets</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={config.sets}
                        onChange={(e) => onUpdateConfig(exercise.id, { sets: Number(e.target.value) || 1 })}
                        className="w-full text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Control 3: Time Slot Picker */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>Daily Time Slot</span>
                      </label>
                      <select
                        value={config.timeSlot}
                        onChange={(e) => onUpdateConfig(exercise.id, { timeSlot: e.target.value })}
                        className="w-full text-xs font-medium px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        {COMMON_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}

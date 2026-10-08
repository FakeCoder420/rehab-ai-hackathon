'use client';

import React, { useState } from 'react';
import { Exercise } from '@/types/rehab';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Activity, 
  Info, 
  Compass, 
  Target, 
  Clock, 
  Sparkles,
  Camera,
  Layers,
  ShieldCheck,
  Video
} from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForPrescription?: (exercise: Exercise) => void;
}

export function ExerciseDetailModal({
  exercise,
  isOpen,
  onClose,
  onSelectForPrescription,
}: ExerciseDetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [scrubberPosition, setScrubberPosition] = useState(38);

  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-tight">{exercise.name}</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {exercise.category}
                </span>
              </div>
              <p className="text-xs text-slate-400">Clinical Reference Protocol & Motion Landmark Specs</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Video Guide Preview Container */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner group">
            
            {/* Viewport simulation */}
            <div className="relative h-60 sm:h-72 w-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-black">
              {/* Grid backdrop */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

              {/* Pose Landmark Graphic */}
              <div className="relative z-10 flex flex-col items-center text-center p-4">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-cyan-400/60 flex items-center justify-center relative mb-2">
                  <Camera className="w-8 h-8 text-cyan-400" />
                  {showSkeleton && (
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-ping opacity-30" />
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-300">
                  {exercise.name} — Real-Time Pose Model
                </span>
                <span className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  AI Landmark Detection: 33 Joint Tracking Nodes Active
                </span>
              </div>

              {/* Angle Metric HUD Badge */}
              <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md border border-cyan-500/40 rounded-xl px-3 py-1.5 text-left">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Target Joint Range</span>
                <span className="text-sm font-black text-white font-mono">{exercise.targetAngle || '0° - 90°'}</span>
              </div>

              {/* Live Overlay Status */}
              <div className="absolute top-3 right-3 flex items-center space-x-1.5 px-2.5 py-1 bg-slate-900/80 rounded-full border border-slate-700 text-[10px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>60 FPS Vision Feed</span>
              </div>

              {/* Scrubber & Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                    title={isPlaying ? 'Pause simulation' : 'Play simulation'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setShowSkeleton(!showSkeleton)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition ${
                      showSkeleton 
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' 
                        : 'bg-white/5 border-slate-700 text-slate-400'
                    }`}
                  >
                    Skeleton Overlay: {showSkeleton ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Simulated Scrubber */}
                <div className="flex-1 mx-4">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${scrubberPosition}%` }}
                    />
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-400">00:08 / 00:24</span>
              </div>
            </div>

          </div>

          {/* Clinical Benchmarks Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center space-x-1">
                <Target className="w-3 h-3 text-blue-600 mr-1" />
                <span>Target Reps</span>
              </span>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">{exercise.targetReps} Repetitions</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center space-x-1">
                <Layers className="w-3 h-3 text-indigo-600 mr-1" />
                <span>Target Sets</span>
              </span>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">{exercise.targetSets} Sets Daily</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-emerald-600 mr-1" />
                <span>Default Slot</span>
              </span>
              <p className="text-xs font-bold text-slate-900 mt-1 truncate">{exercise.defaultTimeSlot}</p>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-bold uppercase text-blue-700 flex items-center space-x-1">
                <Compass className="w-3 h-3 mr-1" />
                <span>Angle Range</span>
              </span>
              <p className="text-xs font-bold text-blue-900 mt-1 font-mono">{exercise.targetAngle || '0° - 90°'}</p>
            </div>
          </div>

          {/* Post-Surgical Indications & Targeted Muscles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Indications */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Post-Surgical Indications</span>
              </div>
              <p className="text-sm font-semibold text-emerald-950">
                {exercise.indications || 'Post-Operative Lower & Upper Limb Tele-Rehabilitation'}
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Prescribed for early-stage passive to active-assisted mobility and neuromuscular re-education.
              </p>
            </div>

            {/* Targeted Muscles */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span>Primary Muscles Targeted</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(exercise.primaryMuscles || ['Quadriceps', 'Joint Stabilizers']).map((muscle, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-900 text-xs font-semibold shadow-2xs"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Step-by-Step Clinical Instructions</span>
            </h4>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              {exercise.instructions}
            </p>

            {exercise.steps && exercise.steps.length > 0 && (
              <div className="space-y-2">
                {exercise.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-start space-x-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 font-medium leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Close Reference
          </button>

          {onSelectForPrescription && (
            <button
              type="button"
              onClick={() => {
                onSelectForPrescription(exercise);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Add to Patient Prescription</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

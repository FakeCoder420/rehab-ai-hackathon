'use client';

import React, { useState, useEffect } from 'react';
import { ScheduledTask } from '@/types/rehab';
import { 
  X, 
  Camera, 
  Play, 
  CheckCircle, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  AlertCircle, 
  Maximize2,
  Sparkles,
  Activity,
  Heart
} from 'lucide-react';

interface ExerciseSessionModalProps {
  isOpen: boolean;
  task: ScheduledTask | null;
  onClose: () => void;
  onComplete: (taskId: string) => void;
}

export function ExerciseSessionModal({
  isOpen,
  task,
  onClose,
  onComplete,
}: ExerciseSessionModalProps) {
  const [currentReps, setCurrentReps] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(85);
  const [feedback, setFeedback] = useState('Maintain upright posture. Slowly extend knee until level.');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    if (isOpen && task) {
      setCurrentReps(task.status === 'completed' ? task.targetReps : 0);
    }
  }, [isOpen, task]);

  // Simulated Computer Vision pose angle oscillation
  useEffect(() => {
    if (!isOpen || !isSimulating) return;

    const interval = setInterval(() => {
      setCurrentAngle((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        const newAngle = Math.min(175, Math.max(70, prev + delta));
        
        if (newAngle >= 160) {
          setFeedback('Excellent full extension! Hold for 2 seconds.');
        } else if (newAngle < 90) {
          setFeedback('Raise leg higher to engage the quadricep.');
        } else {
          setFeedback('Good smooth cadence. Controlled descent.');
        }
        return newAngle;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isOpen, isSimulating]);

  if (!isOpen || !task) return null;

  const targetReps = task.targetReps || 10;
  const progressPercent = Math.min(100, Math.round((currentReps / targetReps) * 100));

  const handleIncrementRep = () => {
    if (currentReps < targetReps) {
      setCurrentReps((prev) => prev + 1);
    }
  };

  const handleFinishAndSave = () => {
    onComplete(task.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Session Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>{task.exerciseName}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  AI Vision Session
                </span>
              </h3>
              <p className="text-xs text-slate-400">Scheduled: {task.timeSlot} • Target: {task.targetReps} Reps ({task.targetSets || 3} Sets)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title={audioEnabled ? 'Mute AI voice cues' : 'Enable AI voice cues'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Viewport / Vision HUD */}
        <div className="relative bg-black h-80 sm:h-96 w-full flex items-center justify-center overflow-hidden">
          
          {/* Simulated webcam grid & background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Center Pose Estimation Graphic Overlay */}
          <div className="relative z-10 flex flex-col items-center text-center p-6">
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-cyan-400/60 flex items-center justify-center relative mb-4 animate-spin-slow">
              <Camera className="w-10 h-10 text-cyan-400" />
              <div className="absolute -top-1 -right-1 bg-cyan-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">
                LIVE
              </div>
            </div>
            <h4 className="text-sm font-semibold text-slate-200">Computer Vision Landmark Tracking</h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Position your body 6-8 feet away in good lighting. The camera automatically detects joint articulation.
            </p>
          </div>

          {/* HUD Top Left: Joint Angle Telemetry */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3 text-left">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1">
              <Activity className="w-3 h-3 mr-1" />
              <span>Joint Articulation</span>
            </div>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {currentAngle}° <span className="text-xs font-normal text-slate-400">flexion</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">Target range: 90° - 170°</div>
          </div>

          {/* HUD Top Right: Rep counter */}
          <div className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-3 text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Reps</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              {currentReps} <span className="text-xs font-normal text-slate-400">/ {targetReps}</span>
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5">{progressPercent}% complete</div>
          </div>

          {/* HUD Bottom Center: Real-time Form Correction Banner */}
          <div className="absolute bottom-4 inset-x-4 max-w-md mx-auto z-20 bg-blue-950/80 backdrop-blur-md border border-blue-500/40 rounded-xl p-3 text-center shadow-lg">
            <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
              <span>{feedback}</span>
            </div>
          </div>

        </div>

        {/* Controls Footer */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleIncrementRep}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate +1 Rep</span>
            </button>

            <button
              onClick={() => setCurrentReps(0)}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition"
              title="Reset Reps"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition"
            >
              Exit Session
            </button>

            <button
              onClick={handleFinishAndSave}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Session & Log Telemetry</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

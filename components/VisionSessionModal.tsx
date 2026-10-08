'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Activity, Camera as CameraIcon, Volume2, Mic, MicOff, CheckCircle2, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    Pose?: any; Camera?: any; POSE_CONNECTIONS?: any;
    drawConnectors?: any; drawLandmarks?: any;
    SpeechRecognition?: any; webkitSpeechRecognition?: any;
  }
}

export function VisionSessionModal({ isOpen, onClose, exerciseName = "Knee Extension", targetReps = 10, onComplete }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [reps, setReps] = useState(0);
  const [angle, setAngle] = useState(90);
  const [feedback, setFeedback] = useState("Position yourself in front of the camera.");
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sosAlert, setSosAlert] = useState<boolean>(false);
  
  const stageRef = useRef<'down' | 'up' | 'neutral'>('neutral');
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const speakFeedback = useCallback((text: string) => {
    if (!window.speechSynthesis || isSpeakingRef.current) return;
    isSpeakingRef.current = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.onend = () => { isSpeakingRef.current = false; };
    window.speechSynthesis.speak(utterance);
    setFeedback(text);
  }, []);

  const calculateAngle = (a: any, b: any, c: any) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let deg = Math.abs((radians * 180.0) / Math.PI);
    if (deg > 180.0) deg = 360 - deg;
    return Math.round(deg);
  };

  useEffect(() => {
    if (!isOpen) return;
    
    // Ensure MediaPipe scripts are loaded in layout.tsx first!
    if (!window.Pose) {
      setFeedback("Error: MediaPipe not loaded.");
      return;
    }

    const pose = new window.Pose({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5 });

    pose.onResults((results: any) => {
      if (!canvasRef.current || !videoRef.current) return;
      const canvasCtx = canvasRef.current.getContext('2d');
      if (!canvasCtx) return;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.poseLandmarks) {
        window.drawConnectors(canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        window.drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });

        const hip = results.poseLandmarks[24];
        const knee = results.poseLandmarks[26];
        const ankle = results.poseLandmarks[28];

        if (hip && knee && ankle) {
          const currentAngle = calculateAngle(hip, knee, ankle);
          setAngle(currentAngle);

          if (!isPausedRef.current) {
            if (currentAngle < 100) {
              stageRef.current = 'down';
            }
            if (currentAngle > 150 && stageRef.current === 'down') {
              stageRef.current = 'up';
              setReps((prev) => {
                const newReps = prev + 1;
                if (newReps === targetReps) speakFeedback("Excellent! Session complete.");
                else speakFeedback("Good rep! Keep going.");
                return newReps;
              });
            }
          }
        }
      }
      canvasCtx.restore();
    });

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) await pose.send({ image: videoRef.current });
      },
      width: 640, height: 480
    });
    camera.start();

    return () => { camera.stop(); pose.close(); };
  }, [isOpen, speakFeedback, targetReps]);

  // Setup Voice Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = async (event: any) => {
        if (isPausedRef.current) return;
        
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        
        try {
          const res = await fetch('/api/coach', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              patientMessage: transcript,
              currentExercise: exerciseName,
              completedReps: reps
            })
          });
          const data = await res.json();
          
          speakFeedback(data.reply);
          
          if (data.action === 'pause_session') {
            setIsPaused(true);
            setSosAlert(true);
            setIsListening(false);
            recognitionRef.current?.stop();
          }
        } catch (error) {
          console.error("Speech API Fetch Error:", error);
        }
      };
    }
  }, [reps, speakFeedback, exerciseName]);

  const toggleMic = () => {
    if (isListening) recognitionRef.current?.stop();
    else recognitionRef.current?.start();
    setIsListening(!isListening);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-950 flex justify-between items-center text-white">
        <div>
          <h2 className="font-bold text-lg">{exerciseName}</h2>
          <p className="text-xs text-slate-400">Target: {targetReps} Reps</p>
        </div>
        <div className="flex gap-4">
          <button onClick={toggleMic} className={`p-2 rounded-full ${isListening ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-400'}`}>
            {isListening ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-800 text-white"><X size={20} /></button>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden bg-black flex justify-center items-center">
        <video ref={videoRef} className="hidden" />
        <canvas ref={canvasRef} className="w-full h-full object-cover" width="640" height="480" />
        
        {/* HUD Overlays */}
        <div className="absolute top-4 left-4 bg-slate-900/80 p-3 rounded-xl border border-cyan-500/50">
          <div className="text-xs text-cyan-400 font-bold mb-1 flex items-center"><Activity size={14} className="mr-1"/> Angle</div>
          <div className="text-2xl font-mono text-white">{angle}°</div>
        </div>
        
        <div className="absolute top-4 right-4 bg-slate-900/80 p-3 rounded-xl border border-emerald-500/50 text-right">
          <div className="text-xs text-emerald-400 font-bold mb-1">Reps</div>
          <div className="text-2xl font-mono text-white">{reps} <span className="text-sm text-slate-400">/ {targetReps}</span></div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-blue-900/80 px-6 py-3 rounded-full text-blue-200 font-semibold shadow-lg text-center whitespace-nowrap">
          {feedback}
        </div>
        
        {/* SOS Alert UI */}
        {sosAlert && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-red-950/80 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-900 border-2 border-red-500 rounded-2xl p-6 max-w-md text-center shadow-[0_0_50px_rgba(239,68,68,0.4)]">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">Clinical Hold Activated</h3>
              <p className="text-sm text-slate-300 mb-4">AI Vision system detected pain/discomfort. Session has been safely paused.</p>
              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 space-y-2 text-left">
                <div className="flex items-center space-x-2 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> <span>Automated SMS sent to Caregiver (John Connor)</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> <span>High-priority alert logged in Dr. Marcus's Dashboard</span>
                </div>
              </div>
              <button onClick={() => { setSosAlert(false); setIsPaused(false); onClose(); }} className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition">
                End Session & Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { useRehab } from '@/context/RehabContext';
import { useAuth } from '@/context/AuthContext';
import { X, CheckCircle2, Dumbbell, UserCheck, Play, Search, Plus } from 'lucide-react';

export interface ExerciseItem {
  id: string;
  title: string;
  joint: string;
  short_desc: string;
  image_url: string;
  video_url: string;
  instructions: string[];
}

export const EXERCISES: ExerciseItem[] = [
  {
    id: "ex1",
    title: "Seated Knee Extension",
    joint: "Knee",
    short_desc: "Strengthens the quadriceps muscle to improve knee stability.",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGbu6YDegOZ1X1N_u0tCkMlDR4NtWZJZgX6uOj5fgtTw&s=10",
    video_url: "https://www.youtube.com/embed/VuJZ6dqMf8M?si=DCE7gQ-we6x0HW2l",
    instructions: ["Sit straight on a chair.", "Slowly straighten one leg.", "Hold for 3 seconds.", "Lower it down gently."]
  },
  {
    id: "ex2",
    title: "Straight Leg Raise",
    joint: "Knee / Hip",
    short_desc: "Improves hip flexor and quad strength without bending the knee.",
    image_url: "https://images.ctfassets.net/hjcv6wdwxsdz/63gBNdOF5r9XSuuYrk3Qwp/00d1801279584d8611e5b6173f1c2178/woman-doing-straight-leg-raise-on-yoga-mat.png?w=1200",
    video_url: "https://www.youtube.com/embed/gobteD5GWkE?si=Kuq-KumSW6LC7Kq8",
    instructions: ["Lie flat on your back.", "Keep one leg straight, bend the other.", "Lift the straight leg to the height of the bent knee.", "Lower slowly."]
  },
  {
    id: "ex3",
    title: "Ankle Pumps",
    joint: "Ankle",
    short_desc: "Improves blood circulation in the lower leg to prevent clots.",
    image_url: "https://workoutlabs.com/train/wp-content/uploads/2022/06/Ankle_Pumps_M-1.gif",
    video_url: "https://www.youtube.com/embed/KxfFzSOAT7g?si=F57EkcO8YXuEuckL",
    instructions: ["Lie or sit comfortably.", "Pull your toes towards you.", "Point toes away from you.", "Repeat in a pumping motion."]
  },
  {
    id: "ex4",
    title: "Heel Slides",
    joint: "Knee",
    short_desc: "Helps regain knee flexion and range of motion post-surgery.",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo5_26m7DMB7UI-Vozqp2e5-YPjz5dQ6bu1Z-DzXQSFw&s=10",
    video_url: "https://www.youtube.com/embed/6-anByqnKp8?si=cSEDvL0zJDLqqBbn",
    instructions: ["Lie on your back.", "Slide your heel towards your buttocks.", "Hold the stretch for 5 seconds.", "Slide the heel back out."]
  },
  {
    id: "ex5",
    title: "Mini Wall Squats",
    joint: "Knee / Core",
    short_desc: "Builds endurance in the quads and glutes safely.",
    image_url: "https://images.ctfassets.net/hjcv6wdwxsdz/bfCK4PGjevQBmvlAlGtBz/b9e1696a3523185608d2f17599517c64/wall-squats.png",
    video_url: "https://www.youtube.com/embed/0YAFlev6AYg?si=Lvk7u6ZZFlBs90AM",
    instructions: ["Stand with back against a wall.", "Slide down until knees are slightly bent.", "Hold for 10 seconds.", "Push back up slowly."]
  },
  {
    id: "ex7",
    title: "Clamshells",
    joint: "Hip",
    short_desc: "Strengthens the outer hip muscles for pelvic stability.",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlYWTaoA_3ZYZyUXEQzyrdboSPkboD_uiaFpMjAs3XmvHBwDuKgWzRUHso&s=10",
    video_url: "https://www.youtube.com/embed/DAAjOdwZdks?si=ibXF0nl8K_-4w2JT",
    instructions: ["Lie on your side with knees bent.", "Keep feet together.", "Lift the top knee open like a clamshell.", "Do not roll your hips back."]
  },
  {
    id: "ex8",
    title: "Shoulder Flexion",
    joint: "Shoulder",
    short_desc: "Assisted arm raises to improve shoulder joint mobility.",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxTxucswN1l-ov2qkClOu10iNSxxvLdOcjBpXe15FfWOp5mLkmbdbCkjoz&s=10",
    video_url: "https://www.youtube.com/embed/phhba6hzAaU?si=VfshmI7Vf3Y0XrEG",
    instructions: ["Stand straight.", "Keep your arm straight.", "Slowly raise the arm forward and up.", "Lower it smoothly."]
  },
  {
    id: "ex10",
    title: "Single Leg Stance",
    joint: "Balance",
    short_desc: "Improves overall balance and stability post-surgery.",
    image_url: "https://images.ctfassets.net/hjcv6wdwxsdz/4SDuh50THOh2An60o25HTo/b445c7d6ca5449c1341aae2db0ac2417/single-leg-stance-claudia-hold.png?w=1200",
    video_url: "https://www.youtube.com/embed/Wb68ze1oH5c?si=bYgJdsfrXdVuHnoZ",
    instructions: ["Stand near a chair for support.", "Lift one foot off the ground.", "Balance on the standing leg for 30 seconds.", "Switch legs."]
  }
]

interface ExerciseLibraryProps {
  onAssignToPatient?: (exercise: ExerciseItem) => void;
}

export function ExerciseLibrary({ onAssignToPatient }: ExerciseLibraryProps) {
  const { patients, assignExerciseToPatient } = useRehab();
  const { user } = useAuth();

  const isPatient = user?.role === 'patient';
  const currentDoctorId = user?.id || 'doc-1';
  const doctorPatients = patients.filter((p) => p.doctorId === currentDoctorId);
  const currentPatient = isPatient 
    ? (patients.find((p) => p.id === user?.linkedPatientId) || patients[0])
    : null;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Knee', 'Shoulder', 'Hip', 'Core', 'Ankle', 'Balance'];

  // State-based modal for clicked card
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);

  // Assignment options within the modal
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    isPatient ? (currentPatient?.id || '') : (doctorPatients[0]?.id || '')
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('Morning 09:00 AM');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Memoized Filtering
  const filteredExercises = useMemo(() => {
    return EXERCISES.filter(ex => {
      const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            ex.short_desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || ex.joint.toLowerCase().includes(activeFilter.toLowerCase());
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const handleCardClick = (exercise: ExerciseItem) => {
    setSelectedExercise(exercise);
    setShowAssignForm(false);
    if (!selectedPatientId && doctorPatients.length > 0) {
      setSelectedPatientId(doctorPatients[0].id);
    }
  };

  const handleQuickAssignClick = (e: React.MouseEvent, exercise: ExerciseItem) => {
    e.stopPropagation(); // Prevent opening the detail modal
    setSelectedExercise(exercise);
    setShowAssignForm(true);
    if (!selectedPatientId && doctorPatients.length > 0) {
      setSelectedPatientId(doctorPatients[0].id);
    }
  };

  const handleAssignClick = () => {
    if (onAssignToPatient && selectedExercise) {
      onAssignToPatient(selectedExercise);
    }
    setShowAssignForm(true);
  };

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExercise) return;

    if (isPatient && currentPatient) {
      assignExerciseToPatient(
        currentPatient.id,
        selectedExercise.id,
        selectedTimeSlot,
        currentPatient.doctorId || 'doc-1'
      );
      setToastMessage(`Added "${selectedExercise.title}" to your rehabilitation schedule!`);
    } else {
      if (!selectedPatientId) return;
      const patient = doctorPatients.find((p) => p.id === selectedPatientId);
      assignExerciseToPatient(
        selectedPatientId,
        selectedExercise.id,
        selectedTimeSlot,
        currentDoctorId
      );
      setToastMessage(`Assigned "${selectedExercise.title}" to ${patient?.name || 'patient'}`);
    }

    setShowAssignForm(false);
    setSelectedExercise(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper to get joint badge color
  const getJointBadgeColor = (joint: string) => {
    const j = joint.toLowerCase();
    if (j.includes('knee')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (j.includes('shoulder')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (j.includes('hip')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (j.includes('core')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (j.includes('ankle')) return 'bg-teal-100 text-teal-800 border-teal-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-4 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Library Header & Controls */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm sticky top-[120px] z-20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <Dumbbell className="w-5 h-5 text-emerald-600" />
              <span>Exercise Library</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Explore {EXERCISES.length} standard clinical protocols and assign them directly to patient routines.
            </p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-colors"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Grid: 3 columns on desktop, 1 on mobile */}
      {filteredExercises.length === 0 ? (
        <div className="py-20 text-center">
          <Dumbbell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">No exercises found matching your search.</p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
            className="mt-3 text-sm text-emerald-600 font-semibold hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => handleCardClick(exercise)}
              className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer relative"
            >
              {/* Quick Assign Button (Top Right) */}
              <button
                onClick={(e) => handleQuickAssignClick(e, exercise)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 shadow-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
                title="Quick Assign"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Top: Image Placeholder */}
              <div className="relative w-full h-48 bg-slate-100 overflow-hidden rounded-t-2xl">
                <img
                  src={exercise.image_url}
                  alt={exercise.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800/95 text-slate-900 dark:text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transform scale-95 group-hover:scale-100 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-current text-emerald-600" />
                    <span>View Details</span>
                  </span>
                </div>
              </div>

              {/* Middle: Title, Target Joint badge, Short description */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug group-hover:text-emerald-700 transition-colors">
                      {exercise.title}
                    </h3>
                    <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getJointBadgeColor(exercise.joint)}`}>
                      {exercise.joint}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {exercise.short_desc}
                  </p>
                </div>

                <div className="pt-4 flex items-center text-xs font-bold text-emerald-600">
                  <span>View video & instructions</span>
                  <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pop-up Modal (Overlay) */}
      {selectedExercise && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedExercise(null);
            }
          }}
        >
          {/* Centered White Box */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header with Title & Close (X) button */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {selectedExercise.title}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getJointBadgeColor(selectedExercise.joint)}`}>
                  {selectedExercise.joint}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExercise(null)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-xl transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 bg-slate-50 dark:bg-slate-900/50">
              
              {/* Short Description */}
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {selectedExercise.short_desc}
              </p>

              {/* Embedded YouTube iframe using video_url */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-md border border-slate-200 dark:border-slate-700">
                <iframe
                  src={selectedExercise.video_url}
                  title={selectedExercise.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Important Instructions Section */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 flex items-center space-x-1.5">
                  <span>Important Instructions</span>
                </h4>
                <ul className="space-y-2.5 list-disc list-inside text-sm text-slate-700 font-medium">
                  {selectedExercise.instructions.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assignment Form Section (Appears when + Assign to Patient is triggered) */}
              {showAssignForm && (
                <form onSubmit={handleConfirmAssignment} className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4 animate-in fade-in shadow-sm">
                  <div className="flex items-center space-x-2 text-xs font-extrabold text-emerald-900 uppercase tracking-wide">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Assign to Patient Routine</span>
                  </div>

                  {isPatient && currentPatient ? (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Recipient Patient</span>
                      <p className="text-sm font-bold text-emerald-900 mt-1">
                        {currentPatient.name} • {currentPatient.surgeryType}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Select Patient
                      </label>
                      {doctorPatients.length === 0 ? (
                        <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium">
                          No patients currently in your roster. Please create a patient first.
                        </p>
                      ) : (
                        <select
                          value={selectedPatientId}
                          onChange={(e) => setSelectedPatientId(e.target.value)}
                          className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                          required
                        >
                          {doctorPatients.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.surgeryType} • Code: {p.accessCode})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Time Slot
                    </label>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    >
                      <option value="Morning 09:00 AM">Morning 09:00 AM</option>
                      <option value="Morning 11:00 AM">Morning 11:00 AM</option>
                      <option value="Afternoon 02:00 PM">Afternoon 02:00 PM</option>
                      <option value="Evening 05:00 PM">Evening 05:00 PM</option>
                      <option value="Night 08:00 PM">Night 08:00 PM</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAssignForm(false)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isPatient && doctorPatients.length === 0}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold transition shadow-md cursor-pointer"
                    >
                      Confirm Assignment
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer with "+ Assign to Patient" button */}
            <div className="px-6 py-5 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Exercise ID: <code className="font-mono text-slate-500 dark:text-slate-400 font-bold">{selectedExercise.id}</code>
              </span>
              
              {!showAssignForm && (
                <button
                  type="button"
                  onClick={handleAssignClick}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-sm transition-all shadow-md flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign to Patient</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

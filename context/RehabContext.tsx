'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { Patient, Exercise, ScheduledTask, UserRole, Language } from '@/types/rehab';

const STORAGE_PATIENTS_KEY = 'rehab_ai_patients_v2';
const STORAGE_TASKS_KEY = 'rehab_ai_tasks_v2';

// Helper to get formatted date string for today (YYYY-MM-DD)
export const getTodayDateString = (): string => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

// Initial Mock Exercises library with clinical metrics
export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Seated Knee Extension',
    targetReps: 10,
    targetSets: 3,
    category: 'Knee Extension',
    defaultTimeSlot: 'Morning 09:00 AM',
    targetAngle: 'Target Angle: 0° - 90°',
    primaryMuscles: ['Quadriceps Femoris', 'Vastus Medialis', 'Rectus Femoris'],
    indications: 'ACL / TKR Weeks 1-4',
    instructions: 'Sit upright in a firm chair with back supported. Slowly straighten surgical knee until fully extended, hold for 3 seconds at 0° lock, then lower under control.',
    steps: [
      'Position chair so thighs are fully supported and feet touch the floor.',
      'Contract your quadricep and lift the lower leg upwards.',
      'Reach maximum terminal extension (0° to 10° flexion).',
      'Pause for a 3-second isometric hold, keeping toe pointed upwards.',
      'Slowly return foot to resting position over 3 seconds.'
    ],
  },
  {
    id: 'ex-2',
    name: 'Straight Leg Raise',
    targetReps: 12,
    targetSets: 2,
    category: 'Hip & Quad Stability',
    defaultTimeSlot: 'Afternoon 01:00 PM',
    targetAngle: 'Target Angle: 0° - 45°',
    primaryMuscles: ['Rectus Femoris', 'Iliopsoas', 'Tensor Fasciae Latae'],
    indications: 'ACL / TKR / THA Weeks 1-6',
    instructions: 'Lie flat on back with non-operative knee bent. Lock surgical knee completely straight, tighten thigh, and lift leg 12 inches off surface without knee bending.',
    steps: [
      'Lie supine on a firm bed with non-surgical leg bent at 90°.',
      'Engage quadricep to lock the surgical knee completely flat.',
      'Dorsiflex your ankle (pull toes towards your shin).',
      'Lift leg smoothly to 45° elevation without arching your lower back.',
      'Hold at the apex for 2 seconds and descend with control.'
    ],
  },
  {
    id: 'ex-3',
    name: 'Ankle Pumps',
    targetReps: 15,
    targetSets: 3,
    category: 'Ankle Mobility',
    defaultTimeSlot: 'Evening 05:00 PM',
    targetAngle: 'Target Angle: -20° to +30°',
    primaryMuscles: ['Gastrocnemius', 'Soleus', 'Tibialis Anterior'],
    indications: 'Immediate Post-Op / DVT Prophylaxis Weeks 1-8',
    instructions: 'Flex and point your foot continuously like pressing a gas pedal to promote calf muscle pump activation and minimize post-surgical edema.',
    steps: [
      'Position leg elevated on pillows or flat in bed.',
      'Point toes away from you as far as comfortable (plantarflexion).',
      'Pull toes upwards toward your head as far as possible (dorsiflexion).',
      'Perform rhythmic, continuous cadence of 1 pump every 2 seconds.'
    ],
  },
  {
    id: 'ex-4',
    name: 'Heel Slides',
    targetReps: 10,
    targetSets: 2,
    category: 'Knee Flexion',
    defaultTimeSlot: 'Night 08:00 PM',
    targetAngle: 'Target Angle: 0° - 110°',
    primaryMuscles: ['Hamstrings', 'Gracilis', 'Sartorius'],
    indications: 'TKR / Meniscal Repair Weeks 2-8',
    instructions: 'Lie on back. Slowly slide heel towards your buttocks, bending knee as far as comfort allows. Hold 5 seconds and slide back.',
    steps: [
      'Lie flat on back with legs straight on smooth surface.',
      'Slowly slide your heel backwards toward your buttocks.',
      'Stop when feeling gentle stretch at surgical joint.',
      'Maintain peak flexion for 5 seconds before sliding back to neutral.'
    ],
  },
  {
    id: 'ex-5',
    name: 'Pendulum Swings',
    targetReps: 15,
    targetSets: 2,
    category: 'Shoulder Mobility',
    defaultTimeSlot: 'Morning 10:00 AM',
    targetAngle: 'Target Angle: 0° - 30°',
    primaryMuscles: ['Supraspinatus', 'Infraspinatus', 'Rotator Cuff'],
    indications: 'Rotator Cuff / Labral Repair Weeks 1-4',
    instructions: 'Lean forward resting non-operative arm on chair. Let surgical arm hang down relaxed and gently swing in small, passive circles without active muscle contraction.',
    steps: [
      'Lean forward 45° from the waist, bracing non-surgical arm on table.',
      'Let surgical arm hang perpendicular to the floor like a relaxed pendulum.',
      'Initiate gentle torso sway to create passive circular arm motion.',
      'Perform 15 clockwise and 15 counter-clockwise oscillations.'
    ],
  },
  {
    id: 'ex-6',
    name: 'Arm Elevation',
    targetReps: 10,
    targetSets: 3,
    category: 'Shoulder Flexion',
    defaultTimeSlot: 'Afternoon 02:00 PM',
    targetAngle: 'Target Angle: 0° - 140°',
    primaryMuscles: ['Anterior Deltoid', 'Serratus Anterior', 'Upper Trapezius'],
    indications: 'Shoulder Arthroscopy Weeks 2-6',
    instructions: 'Clasp both hands together or use a wand. Slowly elevate arms in front of you towards shoulder height within comfort limits.',
    steps: [
      'Sit comfortably upright or lie supine.',
      'Hold a lightweight wand or clasp hands together.',
      'Use the unaffected arm to guide the surgical arm forward and upward.',
      'Pause at comfortable apex for 3 seconds and lower gradually.'
    ],
  },
  {
    id: 'ex-7',
    name: 'Wall Slides',
    targetReps: 10,
    targetSets: 3,
    category: 'Scapular Stability',
    defaultTimeSlot: 'Morning 11:00 AM',
    targetAngle: 'Target Angle: 45° - 120°',
    primaryMuscles: ['Serratus Anterior', 'Lower Trapezius', 'Rhomboids'],
    indications: 'Scapular Dyskinesis & Shoulder Rehab Weeks 4-12',
    instructions: 'Stand facing wall with forearms against it. Slowly slide forearms upward in a "V" shape, maintaining continuous contact and core engagement.',
    steps: [
      'Stand 6 inches from wall with feet hip-width apart.',
      'Place forearms against wall vertically with elbows at 90°.',
      'Gently slide forearms upwards along the wall into slight "V" position.',
      'Hold peak overhead slide for 2 seconds without shrugging shoulders.',
      'Slide arms back down to starting position under control.'
    ],
  },
];

// Seed Data for Dr. Smith (doc-1) as specified in Requirement 5:
// Patient 1: "Sarah Connor" (Access Code: REHAB-1001, Surgery: Knee Replacement) -> Exercises: Seated Knee Extension, Ankle Pumps
// Patient 2: "Rohan Verma" (Access Code: REHAB-2002, Surgery: Shoulder Arthroscopy) -> Exercises: Pendulum Swings, Arm Elevation
export const SEED_PATIENTS: Patient[] = [
  {
    id: 'pat-sarah-1',
    name: 'Sarah Connor',
    email: 'sarah.connor@patient.health',
    age: 54,
    surgeryType: 'Knee Replacement (Total Knee Arthroplasty)',
    surgeryDate: '2026-09-18',
    recoveryWeek: 3,
    language: 'English',
    caregiverContact: 'John Connor (+1 555-019-8821)',
    doctorId: 'doc-1',
    accessCode: 'REHAB-1001',
  },
  {
    id: 'pat-rohan-2',
    name: 'Rohan Verma',
    email: 'rohan.verma@patient.health',
    age: 46,
    surgeryType: 'Shoulder Arthroscopy (Rotator Cuff Repair)',
    surgeryDate: '2026-09-25',
    recoveryWeek: 2,
    language: 'Hindi',
    caregiverContact: 'Ananya Verma (+91 98765 11022)',
    doctorId: 'doc-1',
    accessCode: 'REHAB-2002',
  },
  {
    id: 'pat-3',
    name: 'Mateo Ramos',
    email: 'mateo.ramos@patient.health',
    age: 48,
    surgeryType: 'ACL Reconstruction (Hamstring Autograft)',
    surgeryDate: '2026-10-01',
    recoveryWeek: 1,
    language: 'Spanish',
    caregiverContact: 'Sofia Ramos (+1 555-014-9922)',
    doctorId: 'doc-2', // Assigned to Dr. Connor for multi-doctor isolation testing
    accessCode: 'REHAB-3003',
  },
];

const todayStr = getTodayDateString();

export const SEED_TASKS: ScheduledTask[] = [
  // Sarah Connor's prescribed routine (doc-1)
  {
    id: 'task-sarah-1',
    patientId: 'pat-sarah-1',
    doctorId: 'doc-1',
    exerciseId: 'ex-1',
    exerciseName: 'Seated Knee Extension',
    timeSlot: 'Morning 09:00 AM',
    date: todayStr,
    status: 'completed',
    targetReps: 10,
    targetSets: 3,
    completedAt: '09:20 AM',
  },
  {
    id: 'task-sarah-2',
    patientId: 'pat-sarah-1',
    doctorId: 'doc-1',
    exerciseId: 'ex-3',
    exerciseName: 'Ankle Pumps',
    timeSlot: 'Evening 05:00 PM',
    date: todayStr,
    status: 'pending',
    targetReps: 15,
    targetSets: 3,
  },

  // Rohan Verma's prescribed routine (doc-1)
  {
    id: 'task-rohan-1',
    patientId: 'pat-rohan-2',
    doctorId: 'doc-1',
    exerciseId: 'ex-5',
    exerciseName: 'Pendulum Swings',
    timeSlot: 'Morning 10:00 AM',
    date: todayStr,
    status: 'pending',
    targetReps: 15,
    targetSets: 2,
  },
  {
    id: 'task-rohan-2',
    patientId: 'pat-rohan-2',
    doctorId: 'doc-1',
    exerciseId: 'ex-6',
    exerciseName: 'Arm Elevation',
    timeSlot: 'Afternoon 02:00 PM',
    date: todayStr,
    status: 'completed',
    targetReps: 10,
    targetSets: 3,
    completedAt: '02:15 PM',
  },

  // Mateo Ramos's prescribed routine (doc-2)
  {
    id: 'task-mateo-1',
    patientId: 'pat-3',
    doctorId: 'doc-2',
    exerciseId: 'ex-1',
    exerciseName: 'Seated Knee Extension',
    timeSlot: 'Morning 09:30 AM',
    date: todayStr,
    status: 'completed',
    targetReps: 10,
    targetSets: 3,
    completedAt: '09:45 AM',
  },
];

export interface AddPatientData {
  name: string;
  email?: string;
  age: number;
  surgeryType: string;
  surgeryDate: string;
  caregiverContact: string;
  language: Language;
  doctorId?: string;
}

interface RehabContextType {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  patients: Patient[];
  exercises: Exercise[];
  scheduledTasks: ScheduledTask[];
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  selectedPatient: Patient | undefined;
  activePatientTasks: ScheduledTask[];
  addPatientWithPrescription: (
    patientData: AddPatientData,
    selectedExercises: Exercise[],
    timeSlots: Record<string, string>,
    doctorId?: string,
    prescriptionConfigs?: Record<string, { reps: number; sets: number; timeSlot: string }>
  ) => { patient: Patient; tasks: ScheduledTask[]; accessCode: string };
  assignExerciseToPatient: (
    patientId: string,
    exerciseId: string,
    timeSlot: string,
    doctorId: string
  ) => ScheduledTask;
  toggleTaskStatus: (taskId: string) => void;
  getPatientsForDoctor: (doctorId: string) => Patient[];
  getTasksForPatient: (patientId: string) => ScheduledTask[];
  getPatientById: (patientId: string) => Patient | undefined;
  getPatientByAccessCode: (accessCode: string) => Patient | undefined;
  stats: {
    activePatientsCount: number;
    complianceRate: number;
    completedTasksCount: number;
    totalTasksCount: number;
  };
}

const RehabContext = createContext<RehabContextType | undefined>(undefined);

export function RehabProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRole] = useState<UserRole>('landing');
  const [patients, setPatients] = useState<Patient[]>(SEED_PATIENTS);
  const [exercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>(SEED_TASKS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-sarah-1');

  // Load from and sync with localStorage for cross-component and real-time state synchronization
  useEffect(() => {
    try {
      const storedPatients = localStorage.getItem(STORAGE_PATIENTS_KEY);
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      } else {
        localStorage.setItem(STORAGE_PATIENTS_KEY, JSON.stringify(SEED_PATIENTS));
      }

      const storedTasks = localStorage.getItem(STORAGE_TASKS_KEY);
      if (storedTasks) {
        setScheduledTasks(JSON.parse(storedTasks));
      } else {
        localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(SEED_TASKS));
      }
    } catch (e) {
      console.error('Failed to load rehab state from storage', e);
    }

    // Storage event listener for real-time synchronization across browser tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_PATIENTS_KEY && e.newValue) {
        setPatients(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_TASKS_KEY && e.newValue) {
        setScheduledTasks(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const persistPatients = (updated: Patient[]) => {
    setPatients(updated);
    try {
      localStorage.setItem(STORAGE_PATIENTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const persistTasks = (updated: ScheduledTask[]) => {
    setScheduledTasks(updated);
    try {
      localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Currently selected patient object
  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // Tasks for the selected patient
  const activePatientTasks = useMemo(() => {
    if (!selectedPatient) return [];
    return scheduledTasks
      .filter((t) => t.patientId === selectedPatient.id)
      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
  }, [scheduledTasks, selectedPatient]);

  // Overall stats
  const stats = useMemo(() => {
    const total = scheduledTasks.length;
    const completed = scheduledTasks.filter((t) => t.status === 'completed').length;
    const complianceRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      activePatientsCount: patients.length,
      complianceRate,
      completedTasksCount: completed,
      totalTasksCount: total,
    };
  }, [patients, scheduledTasks]);

  // STRICT SCOPED QUERIES
  const getPatientsForDoctor = (doctorId: string): Patient[] => {
    return patients.filter((p) => p.doctorId === doctorId);
  };

  const getTasksForPatient = (patientId: string): ScheduledTask[] => {
    return scheduledTasks
      .filter((t) => t.patientId === patientId)
      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
  };

  const getPatientById = (patientId: string): Patient | undefined => {
    return patients.find((p) => p.id === patientId);
  };

  const getPatientByAccessCode = (accessCode: string): Patient | undefined => {
    const cleanCode = accessCode.trim().toUpperCase();
    return patients.find((p) => p.accessCode.toUpperCase() === cleanCode);
  };

  // 1. DOCTOR-PATIENT MAPPING: addPatientWithPrescription
  // When a Doctor creates a patient, link to doctorId and generate accessCode (REHAB-XXXX)
  const addPatientWithPrescription = (
    patientData: AddPatientData,
    selectedExercises: Exercise[],
    timeSlots: Record<string, string>,
    doctorId: string = 'doc-1',
    prescriptionConfigs?: Record<string, { reps: number; sets: number; timeSlot: string }>
  ) => {
    const newPatientId = `pat-${Date.now()}`;
    
    // Automatically generate unique accessCode: "REHAB-" + random 4 digits
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const accessCode = `REHAB-${randomSuffix}`;

    const surgeryDateObj = new Date(patientData.surgeryDate);
    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - surgeryDateObj.getTime());
    const calculatedWeeks = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)));

    const generatedEmail = patientData.email?.trim() || 
      `${patientData.name.toLowerCase().replace(/\s+/g, '.')}${randomSuffix}@patient.health`;

    const newPatient: Patient = {
      id: newPatientId,
      name: patientData.name.trim(),
      email: generatedEmail,
      age: Number(patientData.age),
      surgeryType: patientData.surgeryType,
      surgeryDate: patientData.surgeryDate,
      recoveryWeek: calculatedWeeks,
      language: patientData.language,
      caregiverContact: patientData.caregiverContact.trim(),
      doctorId, // 1-to-1 link to supervising Doctor
      accessCode, // Unique REHAB-XXXX code
    };

    // Generate scheduled tasks strictly mapped with patientId and doctorId
    const newTasks: ScheduledTask[] = selectedExercises.map((exercise, index) => {
      const config = prescriptionConfigs ? prescriptionConfigs[exercise.id] : undefined;
      const assignedSlot = config?.timeSlot || timeSlots[exercise.id] || exercise.defaultTimeSlot;
      const assignedReps = config?.reps ?? exercise.targetReps;
      const assignedSets = config?.sets ?? exercise.targetSets;

      return {
        id: `task-${Date.now()}-${index}`,
        patientId: newPatientId,
        doctorId, // Strict doctor scoping
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        timeSlot: assignedSlot,
        date: getTodayDateString(),
        status: 'pending',
        targetReps: assignedReps,
        targetSets: assignedSets,
      };
    });

    const updatedPatients = [newPatient, ...patients];
    const updatedTasks = [...scheduledTasks, ...newTasks];

    persistPatients(updatedPatients);
    persistTasks(updatedTasks);
    setSelectedPatientId(newPatientId);

    return { patient: newPatient, tasks: newTasks, accessCode };
  };

  // 2. REAL-TIME EXERCISE ASSIGNMENT TO EXISTING PATIENT
  const assignExerciseToPatient = (
    patientId: string,
    exerciseId: string,
    timeSlot: string,
    doctorId: string
  ): ScheduledTask => {
    const targetExercise = exercises.find((ex) => ex.id === exerciseId) || exercises[0];

    const newTask: ScheduledTask = {
      id: `task-${Date.now()}`,
      patientId,
      doctorId,
      exerciseId: targetExercise.id,
      exerciseName: targetExercise.name,
      timeSlot,
      date: getTodayDateString(),
      status: 'pending',
      targetReps: targetExercise.targetReps,
      targetSets: targetExercise.targetSets,
    };

    const updatedTasks = [...scheduledTasks, newTask];
    persistTasks(updatedTasks);
    return newTask;
  };

  // 3. Toggle task completed/pending status
  const toggleTaskStatus = (taskId: string) => {
    const updatedTasks = scheduledTasks.map((task) => {
      if (task.id === taskId) {
        const isCompleting = task.status === 'pending';
        return {
          ...task,
          status: (isCompleting ? 'completed' : 'pending') as 'completed' | 'pending',
          completedAt: isCompleting
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : undefined,
        };
      }
      return task;
    });

    persistTasks(updatedTasks);
  };

  return (
    <RehabContext.Provider
      value={{
        activeRole,
        setActiveRole,
        patients,
        exercises,
        scheduledTasks,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        activePatientTasks,
        addPatientWithPrescription,
        assignExerciseToPatient,
        toggleTaskStatus,
        getPatientsForDoctor,
        getTasksForPatient,
        getPatientById,
        getPatientByAccessCode,
        stats,
      }}
    >
      {children}
    </RehabContext.Provider>
  );
}

export function useRehab() {
  const context = useContext(RehabContext);
  if (!context) {
    throw new Error('useRehab must be used within a RehabProvider');
  }
  return context;
}

export type Language = 'English' | 'Hindi' | 'Spanish';

export type TaskStatus = 'pending' | 'completed';

export interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  surgeryType: string;
  surgeryDate: string;
  recoveryWeek: number;
  language: Language;
  caregiverContact: string;
  doctorId: string; // 1-to-1 link to supervising Doctor
  accessCode: string; // e.g. "REHAB-1001"
}

export interface Exercise {
  id: string;
  name: string;
  targetReps: number;
  targetSets: number;
  category: string;
  defaultTimeSlot: string;
  instructions?: string;
  targetAngle?: string;         // e.g. "Target Angle: 0° - 90°"
  primaryMuscles?: string[];    // e.g. ["Quadriceps femoris", "Vastus medialis"]
  indications?: string;         // e.g. "ACL / TKR Weeks 1-4"
  steps?: string[];             // Step-by-step clinical execution
  thumbnailUrl?: string;
}

export interface ScheduledTask {
  id: string;
  patientId: string;
  doctorId: string; // Strictly scoped to prescribing Doctor
  exerciseId: string;
  exerciseName: string;
  timeSlot: string; // e.g. "09:00 AM", "Morning 09:00 AM"
  date: string; // YYYY-MM-DD
  status: TaskStatus;
  targetReps: number;
  targetSets?: number;
  completedAt?: string;
}

export type UserRole = 'landing' | 'doctor' | 'patient';

export interface PrescriptionItem {
  exerciseId: string;
  timeSlot: string;
  customReps?: number;
  customSets?: number;
}

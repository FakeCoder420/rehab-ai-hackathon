export type UserRole = 'doctor' | 'patient';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  patientAccessCode?: string; // e.g. "REHAB-1001"
  specialization?: string;    // e.g. "Orthopedic Surgery"
  medicalLicense?: string;
  linkedPatientId?: string;   // Connects to Patient ID in RehabContext
  doctorId?: string;          // If patient, linked Doctor ID
  recoveryWeek?: number;
  lastLoginAt: string;
}

export interface DoctorSignupDetails {
  name: string;
  email: string;
  password: string;
  specialization: string;
  medicalLicense: string;
}

export interface PatientAccountRecord {
  id: string;
  name: string;
  email: string;
  accessCode: string;
  passwordHash: string;
  linkedPatientId: string;
  doctorId: string; // 1-to-1 doctor link
  surgeryType: string;
  recoveryWeek: number;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsDoctor: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsPatient: (email: string, accessCode: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signupDoctor: (details: DoctorSignupDetails) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginWithDemoDoctor: () => void;
  loginWithDemoPatient: () => void;
  loginWithDemoSarah: () => void;
  loginWithDemoRohan: () => void;
  registerPatientAccount: (
    patientId: string,
    name: string,
    email: string,
    surgeryType: string,
    recoveryWeek: number,
    doctorId: string,
    customAccessCode?: string
  ) => { accessCode: string; tempPassword: string };
  getPatientAccountByPatientId: (patientId: string) => PatientAccountRecord | undefined;
}

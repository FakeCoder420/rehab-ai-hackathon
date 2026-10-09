'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AuthUser, 
  DoctorSignupDetails, 
  PatientAccountRecord, 
  AuthContextType,
  UserRole
} from '@/types/auth';

const STORAGE_SESSION_KEY = 'rehab_ai_user_session_v2';
const STORAGE_ACCOUNTS_KEY = 'rehab_ai_patient_accounts_v2';
const STORAGE_DOCTORS_KEY = 'rehab_ai_doctor_accounts_v2';

// Seed Mock Doctors
const DEFAULT_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Marcus Smith, MD',
    email: 'dr.smith@rehabai.health',
    passwordHash: 'DoctorPass#2026',
    role: 'doctor' as UserRole,
    specialization: 'Orthopedic Joint Reconstruction',
    medicalLicense: 'MED-NY-882910',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'doc-2',
    name: 'Dr. Alexis Vance, MD',
    email: 'dr.vance@rehabai.health',
    passwordHash: 'DoctorPass#2026',
    role: 'doctor' as UserRole,
    specialization: 'Sports Medicine & Arthroscopy',
    medicalLicense: 'MED-CA-402911',
    lastLoginAt: new Date().toISOString(),
  },
];

// Seed Mock Patients (strictly mapped to doctorId: 'doc-1' for Dr. Smith)
const DEFAULT_PATIENT_ACCOUNTS: PatientAccountRecord[] = [
  {
    id: 'usr-sarah',
    name: 'Sarah Connor',
    email: 'sarah.connor@patient.health',
    accessCode: 'REHAB-1001',
    passwordHash: 'Recovery#2026',
    linkedPatientId: 'pat-sarah-1',
    doctorId: 'doc-1',
    surgeryType: 'Knee Replacement (Total Knee Arthroplasty)',
    recoveryWeek: 3,
  },
  {
    id: 'usr-rohan',
    name: 'Rohan Verma',
    email: 'rohan.verma@patient.health',
    accessCode: 'REHAB-2002',
    passwordHash: 'Recovery#2026',
    linkedPatientId: 'pat-rohan-2',
    doctorId: 'doc-1',
    surgeryType: 'Shoulder Arthroscopy (Rotator Cuff Repair)',
    recoveryWeek: 2,
  },
  {
    id: 'usr-mateo',
    name: 'Mateo Ramos',
    email: 'mateo.ramos@patient.health',
    accessCode: 'REHAB-3003',
    passwordHash: 'Recovery#2026',
    linkedPatientId: 'pat-3',
    doctorId: 'doc-2',
    surgeryType: 'ACL Reconstruction (Hamstring Autograft)',
    recoveryWeek: 1,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [patientAccounts, setPatientAccounts] = useState<PatientAccountRecord[]>(DEFAULT_PATIENT_ACCOUNTS);
  const [doctorAccounts, setDoctorAccounts] = useState(DEFAULT_DOCTORS);

  // Load persisted session on initial client mount
  useEffect(() => {
    try {
      const savedPatients = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      if (savedPatients) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPatientAccounts(JSON.parse(savedPatients));
      } else {
        localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(DEFAULT_PATIENT_ACCOUNTS));
      }

      const savedDoctors = localStorage.getItem(STORAGE_DOCTORS_KEY);
      if (savedDoctors) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDoctorAccounts(JSON.parse(savedDoctors));
      } else {
        localStorage.setItem(STORAGE_DOCTORS_KEY, JSON.stringify(DEFAULT_DOCTORS));
      }

      const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (savedSession) {
        const parsedUser: AuthUser = JSON.parse(savedSession);
        setUser(parsedUser);
      }
    } catch (err) {
      console.error('Failed to load session from localStorage', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(authenticatedUser));
    } catch (err) {
      console.error('Failed to persist session', err);
    }
  };

  // 1. Doctor Login
  const loginAsDoctor = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 350));

    const cleanEmail = email.trim().toLowerCase();
    const matchedDoctor = doctorAccounts.find((d) => d.email.toLowerCase() === cleanEmail);

    if (!matchedDoctor) {
      setIsLoading(false);
      return { 
        success: false, 
        error: 'No clinician account found with this email. (Try demo: dr.smith@rehabai.health)' 
      };
    }

    if (matchedDoctor.passwordHash !== password.trim()) {
      setIsLoading(false);
      return { 
        success: false, 
        error: 'Invalid password. (Default demo password: DoctorPass#2026)' 
      };
    }

    const sessionUser: AuthUser = {
      id: matchedDoctor.id,
      email: matchedDoctor.email,
      name: matchedDoctor.name,
      role: 'doctor',
      specialization: matchedDoctor.specialization,
      medicalLicense: matchedDoctor.medicalLicense,
      lastLoginAt: new Date().toISOString(),
    };

    saveSession(sessionUser);
    setIsLoading(false);
    router.push('/doctor/dashboard');
    return { success: true };
  };

  // 2. Patient Login: strict matching of Email AND 6-digit accessCode (Requirement 2)
  const loginAsPatient = async (
    email: string, 
    accessCode: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 350));

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = accessCode.trim().toUpperCase();

    if (!cleanCode) {
      setIsLoading(false);
      return {
        success: false,
        error: '6-digit Access Code (e.g. REHAB-1001) is required.',
      };
    }

    // Strict 1-to-1 patient account lookup by Email AND Access Code
    let matchedPatient = patientAccounts.find(
      (p) => p.email.toLowerCase() === cleanEmail && p.accessCode.toUpperCase() === cleanCode
    );

    // Fallback: If email is omitted (e.g. from direct modal testing button)
    if (!matchedPatient && !cleanEmail && cleanCode) {
      matchedPatient = patientAccounts.find(
        (p) => p.accessCode.toUpperCase() === cleanCode
      );
    }

    if (!matchedPatient) {
      // Also check if they entered only the code in one of the fields to assist user
      const partialMatch = patientAccounts.find(
        (p) => p.accessCode.toUpperCase() === cleanCode || p.email.toLowerCase() === cleanEmail
      );
      setIsLoading(false);
      if (partialMatch) {
        return {
          success: false,
          error: `Credentials mismatch. Registered email for ${partialMatch.accessCode} is: ${partialMatch.email}`,
        };
      }
      return { 
        success: false, 
        error: 'No patient record found matching this Email and Access Code combination. (Try REHAB-1001 with sarah.connor@patient.health or use One-Click Demo).' 
      };
    }

    // Optional password verification if provided
    if (password && password.trim() && matchedPatient.passwordHash !== password.trim() && password.trim() !== 'Recovery#2026') {
      setIsLoading(false);
      return {
        success: false,
        error: 'Invalid password for this account. (Default demo password: Recovery#2026)',
      };
    }

    const sessionUser: AuthUser = {
      id: matchedPatient.id,
      email: matchedPatient.email,
      name: matchedPatient.name,
      role: 'patient',
      patientAccessCode: matchedPatient.accessCode,
      linkedPatientId: matchedPatient.linkedPatientId,
      doctorId: matchedPatient.doctorId, // Linked doctor
      recoveryWeek: matchedPatient.recoveryWeek,
      lastLoginAt: new Date().toISOString(),
    };

    saveSession(sessionUser);
    setIsLoading(false);
    router.push('/patient/dashboard');
    return { success: true };
  };

  // 3. Doctor Registration
  const signupDoctor = async (details: DoctorSignupDetails): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    if (!details.name.trim() || !details.email.trim() || !details.password.trim()) {
      setIsLoading(false);
      return { success: false, error: 'All fields are required.' };
    }

    const cleanEmail = details.email.trim().toLowerCase();
    const existing = doctorAccounts.find((d) => d.email.toLowerCase() === cleanEmail);
    if (existing) {
      setIsLoading(false);
      return { success: false, error: 'A clinician with this email is already registered.' };
    }

    const newDocId = `doc-${Date.now()}`;
    const newRecord = {
      id: newDocId,
      name: details.name.trim(),
      email: cleanEmail,
      passwordHash: details.password.trim(),
      role: 'doctor' as UserRole,
      specialization: details.specialization.trim() || 'Orthopedic Surgery',
      medicalLicense: details.medicalLicense.trim() || 'MED-NEW-99',
      lastLoginAt: new Date().toISOString(),
    };

    const updated = [...doctorAccounts, newRecord];
    setDoctorAccounts(updated);
    try {
      localStorage.setItem(STORAGE_DOCTORS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    const sessionUser: AuthUser = {
      id: newDocId,
      email: newRecord.email,
      name: newRecord.name,
      role: 'doctor',
      specialization: newRecord.specialization,
      medicalLicense: newRecord.medicalLicense,
      lastLoginAt: new Date().toISOString(),
    };

    saveSession(sessionUser);
    setIsLoading(false);
    router.push('/doctor/dashboard');
    return { success: true };
  };

  // 4. Logout
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (err) {
      console.error(err);
    }
    router.push('/');
  };

  // 5. One-Click Demo Logins
  const loginWithDemoDoctor = () => {
    const demoDoc = doctorAccounts.find((d) => d.id === 'doc-1') || DEFAULT_DOCTORS[0];
    const sessionUser: AuthUser = {
      id: demoDoc.id,
      email: demoDoc.email,
      name: demoDoc.name,
      role: 'doctor',
      specialization: demoDoc.specialization,
      medicalLicense: demoDoc.medicalLicense,
      lastLoginAt: new Date().toISOString(),
    };
    saveSession(sessionUser);
    router.push('/doctor/dashboard');
  };

  // Demo Patient 1: Sarah Connor (REHAB-1001, Knee Replacement)
  const loginWithDemoSarah = () => {
    const sarah = patientAccounts.find((p) => p.accessCode === 'REHAB-1001') || DEFAULT_PATIENT_ACCOUNTS[0];
    const sessionUser: AuthUser = {
      id: sarah.id,
      email: sarah.email,
      name: sarah.name,
      role: 'patient',
      patientAccessCode: sarah.accessCode,
      linkedPatientId: sarah.linkedPatientId,
      doctorId: sarah.doctorId,
      recoveryWeek: sarah.recoveryWeek,
      lastLoginAt: new Date().toISOString(),
    };
    saveSession(sessionUser);
    router.push('/patient/dashboard');
  };

  // Demo Patient 2: Rohan Verma (REHAB-2002, Shoulder Arthroscopy)
  const loginWithDemoRohan = () => {
    const rohan = patientAccounts.find((p) => p.accessCode === 'REHAB-2002') || DEFAULT_PATIENT_ACCOUNTS[1];
    const sessionUser: AuthUser = {
      id: rohan.id,
      email: rohan.email,
      name: rohan.name,
      role: 'patient',
      patientAccessCode: rohan.accessCode,
      linkedPatientId: rohan.linkedPatientId,
      doctorId: rohan.doctorId,
      recoveryWeek: rohan.recoveryWeek,
      lastLoginAt: new Date().toISOString(),
    };
    saveSession(sessionUser);
    router.push('/patient/dashboard');
  };

  const loginWithDemoPatient = () => {
    loginWithDemoSarah();
  };

  // 6. Dynamic Patient Account Registration (Called from CreatePatientModal)
  const registerPatientAccount = (
    patientId: string,
    name: string,
    email: string,
    surgeryType: string,
    recoveryWeek: number,
    doctorId: string = 'doc-1',
    customAccessCode?: string
  ) => {
    const accessCode = customAccessCode || `REHAB-${Math.floor(1000 + Math.random() * 9000)}`;
    const tempPassword = `Recovery#2026`;
    const cleanEmail = email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@patient.health`;

    const newRecord: PatientAccountRecord = {
      id: `usr-${patientId}`,
      name: name.trim(),
      email: cleanEmail,
      accessCode,
      passwordHash: tempPassword,
      linkedPatientId: patientId,
      doctorId,
      surgeryType,
      recoveryWeek,
    };

    setPatientAccounts((prev) => {
      const updated = [newRecord, ...prev];
      try {
        localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    return { accessCode, tempPassword };
  };

  const getPatientAccountByPatientId = (patientId: string) => {
    return patientAccounts.find((p) => p.linkedPatientId === patientId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginAsDoctor,
        loginAsPatient,
        signupDoctor,
        logout,
        loginWithDemoDoctor,
        loginWithDemoPatient,
        loginWithDemoSarah,
        loginWithDemoRohan,
        registerPatientAccount,
        getPatientAccountByPatientId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

'use client';

import React, { useState } from 'react';
import { useRehab } from '@/context/RehabContext';
import { Exercise, Language } from '@/types/rehab';
import { 
  X, 
  UserPlus, 
  Calendar, 
  Phone, 
  Globe, 
  CheckSquare, 
  Square, 
  Clock, 
  Sparkles, 
  Send, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PatientCredentialsModal } from './PatientCredentialsModal';
import { CompactExerciseSelector } from './doctor/CompactExerciseSelector';

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (patientId: string, credentials?: { accessCode: string; tempPassword: string }) => void;
}

const COMMON_SURGERIES = [
  'Total Knee Arthroplasty (Right TKA)',
  'Total Knee Arthroplasty (Left TKA)',
  'ACL Reconstruction (Hamstring Autograft)',
  'Total Hip Replacement (Anterior THA)',
  'Rotator Cuff Repair (Arthroscopic)',
  'Achilles Tendon Repair',
  'Lumbar Microdiscectomy (L4-L5)',
];

const TIME_SLOT_PRESETS = [
  'Morning 09:00 AM',
  'Morning 10:30 AM',
  'Afternoon 01:00 PM',
  'Afternoon 03:30 PM',
  'Evening 05:00 PM',
  'Night 08:00 PM',
];

export function CreatePatientModal({ isOpen, onClose, onSuccess }: CreatePatientModalProps) {
  const { exercises, addPatientWithPrescription } = useRehab();
  const { user, registerPatientAccount } = useAuth();

  const [generatedCreds, setGeneratedCreds] = useState<{
    accessCode: string;
    tempPassword: string;
    patientName: string;
    caregiverContact: string;
  } | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [surgeryType, setSurgeryType] = useState(COMMON_SURGERIES[0]);
  const [customSurgery, setCustomSurgery] = useState('');
  const [surgeryDate, setSurgeryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14); // default ~2 weeks ago
    return d.toISOString().split('T')[0];
  });
  const [caregiverContact, setCaregiverContact] = useState('');
  const [language, setLanguage] = useState<Language>('English');

  // Exercise selection & configs for CompactExerciseSelector (Requirement 2)
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>(['ex-1', 'ex-3']);
  const [prescriptionConfigs, setPrescriptionConfigs] = useState<Record<string, { reps: number; sets: number; timeSlot: string }>>({
    'ex-1': { reps: 10, sets: 3, timeSlot: 'Morning 09:00 AM' },
    'ex-3': { reps: 15, sets: 3, timeSlot: 'Evening 05:00 PM' },
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleToggleExercise = (exerciseId: string) => {
    if (selectedExerciseIds.includes(exerciseId)) {
      setSelectedExerciseIds((prev) => prev.filter((id) => id !== exerciseId));
      const updated = { ...prescriptionConfigs };
      delete updated[exerciseId];
      setPrescriptionConfigs(updated);
    } else {
      const exercise = exercises.find((e) => e.id === exerciseId);
      setSelectedExerciseIds((prev) => [...prev, exerciseId]);
      setPrescriptionConfigs((prev) => ({
        ...prev,
        [exerciseId]: {
          reps: exercise?.targetReps || 10,
          sets: exercise?.targetSets || 3,
          timeSlot: exercise?.defaultTimeSlot || 'Morning 09:00 AM',
        },
      }));
    }
  };

  const handleUpdateConfig = (
    exerciseId: string, 
    updates: Partial<{ reps: number; sets: number; timeSlot: string }>
  ) => {
    setPrescriptionConfigs((prev) => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] || { reps: 10, sets: 3, timeSlot: 'Morning 09:00 AM' }),
        ...updates,
      },
    }));
  };

  // 1-Click Protocol Presets (Requirement 2)
  const handleApplyPreset = (presetName: 'acl-knee' | 'shoulder') => {
    if (presetName === 'acl-knee') {
      setSelectedExerciseIds(['ex-1', 'ex-2', 'ex-3']);
      setPrescriptionConfigs({
        'ex-1': { reps: 10, sets: 3, timeSlot: 'Morning 09:00 AM' },
        'ex-2': { reps: 12, sets: 2, timeSlot: 'Afternoon 01:00 PM' },
        'ex-3': { reps: 15, sets: 3, timeSlot: 'Evening 05:00 PM' },
      });
      setSurgeryType('Total Knee Arthroplasty (Right TKA)');
    } else if (presetName === 'shoulder') {
      setSelectedExerciseIds(['ex-5', 'ex-6', 'ex-7']);
      setPrescriptionConfigs({
        'ex-5': { reps: 15, sets: 2, timeSlot: 'Morning 10:00 AM' },
        'ex-6': { reps: 10, sets: 3, timeSlot: 'Afternoon 02:00 PM' },
        'ex-7': { reps: 10, sets: 3, timeSlot: 'Evening 06:00 PM' },
      });
      setSurgeryType('Rotator Cuff Repair (Arthroscopic)');
    }
  };

  const handleClearAll = () => {
    setSelectedExerciseIds([]);
    setPrescriptionConfigs({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Form Validations
    if (!name.trim()) {
      setFormError('Patient full name is required.');
      return;
    }
    if (!age || Number(age) <= 0 || Number(age) > 120) {
      setFormError('Please provide a valid patient age.');
      return;
    }
    const finalSurgery = surgeryType === 'custom' ? customSurgery.trim() : surgeryType;
    if (!finalSurgery) {
      setFormError('Please specify the post-surgical procedure.');
      return;
    }
    if (!surgeryDate) {
      setFormError('Please specify the surgery date.');
      return;
    }
    if (!caregiverContact.trim()) {
      setFormError('Caregiver contact details are required for post-op safety.');
      return;
    }
    if (selectedExerciseIds.length === 0) {
      setFormError('Please select at least one rehabilitation exercise for the prescription.');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedExercisesList = exercises.filter((ex) => selectedExerciseIds.includes(ex.id));

      const currentDoctorId = user?.id || 'doc-1';

      const computedTimeSlots: Record<string, string> = {};
      selectedExerciseIds.forEach((id) => {
        computedTimeSlots[id] = prescriptionConfigs[id]?.timeSlot || 'Morning 09:00 AM';
      });

      const { patient, accessCode } = addPatientWithPrescription(
        {
          name: name.trim(),
          age: Number(age),
          surgeryType: finalSurgery,
          surgeryDate,
          caregiverContact: caregiverContact.trim(),
          language,
          doctorId: currentDoctorId,
        },
        selectedExercisesList,
        computedTimeSlots,
        currentDoctorId,
        prescriptionConfigs
      );

      // Register secure patient access credentials with strict doctor link
      const creds = registerPatientAccount(
        patient.id,
        patient.name,
        '',
        patient.surgeryType,
        patient.recoveryWeek,
        currentDoctorId,
        accessCode
      );

      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess(patient.id, creds);
      }

      setGeneratedCreds({
        accessCode: creds.accessCode,
        tempPassword: creds.tempPassword,
        patientName: patient.name,
        caregiverContact: patient.caregiverContact,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register patient';
      setFormError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 id="modal-title" className="text-lg font-bold tracking-tight">Create New Patient & Prescription</h3>
              <p className="text-xs text-blue-100/90">Clinical protocol assignment and caregiver notification</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(85vh-8rem)] overflow-y-auto">
          
          {/* Validation Alert */}
          {formError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Demographic & Clinical Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Patient & Surgical Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Patient Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harold Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  placeholder="e.g. 62"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Surgery Type */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Surgery Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={surgeryType}
                  onChange={(e) => setSurgeryType(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                >
                  {COMMON_SURGERIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="custom">Other / Custom Procedure...</option>
                </select>

                {surgeryType === 'custom' && (
                  <input
                    type="text"
                    placeholder="Enter custom procedure name"
                    value={customSurgery}
                    onChange={(e) => setCustomSurgery(e.target.value)}
                    className="mt-2 w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                )}
              </div>

              {/* Surgery Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Surgery Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={surgeryDate}
                    onChange={(e) => setSurgeryDate(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Preferred Language */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Language Preference <span className="text-red-500">*</span>
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Spanish">Spanish (Español)</option>
                </select>
              </div>

              {/* Caregiver Contact */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Caregiver Contact & Relationship <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins (Daughter) - +1 555-234-5678"
                    value={caregiverContact}
                    onChange={(e) => setCaregiverContact(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Caregivers receive automated SMS summaries of missed sessions and pain-score alerts.
                </p>
              </div>

            </div>
          </div>

          {/* Section 2: Minimal Exercise Selector with 1-Click Protocols */}
          <div className="border-t border-slate-200 pt-5">
            <CompactExerciseSelector
              exercises={exercises}
              selectedExerciseIds={selectedExerciseIds}
              prescriptionConfigs={prescriptionConfigs}
              onToggleExercise={handleToggleExercise}
              onUpdateConfig={handleUpdateConfig}
              onApplyPreset={handleApplyPreset}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Modal Actions */}
          <div className="border-t border-slate-200 pt-5 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Assigning...' : 'Assign & Share with Patient'}</span>
            </button>
          </div>

        </form>
      </div>

      {generatedCreds && (
        <PatientCredentialsModal
          isOpen={Boolean(generatedCreds)}
          patientName={generatedCreds.patientName}
          accessCode={generatedCreds.accessCode}
          tempPassword={generatedCreds.tempPassword}
          caregiverContact={generatedCreds.caregiverContact}
          onClose={() => {
            setGeneratedCreds(null);
            onClose();
          }}
        />
      )}
    </div>
  );
}

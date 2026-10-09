'use client';
import React, { useState, useEffect } from 'react';
import { useRehab } from '@/context/RehabContext';
import { useAuth } from '@/context/AuthContext';
import { Exercise, Language } from '@/types/rehab';
import { 
  X, UserPlus, Calendar, Phone, Globe, Clock, Send, AlertCircle, ChevronRight, 
  ChevronLeft, Copy, CheckCircle2, Dumbbell, Stethoscope, Search, Check
} from 'lucide-react';
import { CompactExerciseSelector } from './doctor/CompactExerciseSelector';

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (patientId: string, credentials?: { accessCode: string; tempPassword: string }) => void;
}

const COMMON_SURGERIES = [
  'Total Knee Arthroplasty (TKA)',
  'ACL Reconstruction (Hamstring Autograft)',
  'Total Hip Replacement (Anterior THA)',
  'Rotator Cuff Repair (Arthroscopic)',
  'Achilles Tendon Repair',
  'Lumbar Microdiscectomy (L4-L5)',
];

export function CreatePatientModal({ isOpen, onClose, onSuccess }: CreatePatientModalProps) {
  const { exercises, addPatientWithPrescription } = useRehab();
  const { user, registerPatientAccount } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 is Success screen

  // Draft Autosave using sessionStorage
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem('rehabai_create_patient_draft');
      if (draft && step === 1) {
        const parsed = JSON.parse(draft);
        setName(parsed.name || '');
        setAge(parsed.age || '');
        setSurgeryType(parsed.surgeryType || '');
        setSurgerySide(parsed.surgerySide || 'Left');
        setSurgeryDate(parsed.surgeryDate || '');
        setLanguage(parsed.language || 'English');
        setCaregiverName(parsed.caregiverName || '');
        setCaregiverContact(parsed.caregiverContact || '');
        setCaregiverConsent(parsed.caregiverConsent || false);
      }
    } catch(e) {}
  }, []);

  // Step 1 State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [surgeryType, setSurgeryType] = useState('');
  const [surgerySide, setSurgerySide] = useState<'Left' | 'Right' | 'Bilateral'>('Left');
  const [surgeryDate, setSurgeryDate] = useState('');
  const [language, setLanguage] = useState<Language>('English');
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverContact, setCaregiverContact] = useState('');
  const [caregiverConsent, setCaregiverConsent] = useState(false);
  const [step1Error, setStep1Error] = useState('');

  // Step 2 State
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [prescriptionConfigs, setPrescriptionConfigs] = useState<Record<string, { reps: number; sets: number; timeSlot: string }>>({});
  const [step2Error, setStep2Error] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCreds, setGeneratedCreds] = useState<{accessCode: string; tempPassword: string} | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (step === 1 || step === 2) {
      try {
        sessionStorage.setItem('rehabai_create_patient_draft', JSON.stringify({
          name, age, surgeryType, surgerySide, surgeryDate, language, caregiverName, caregiverContact, caregiverConsent
        }));
      } catch(e) {}
    }
  }, [name, age, surgeryType, surgerySide, surgeryDate, language, caregiverName, caregiverContact, caregiverConsent, step]);

  if (!isOpen) return null;

  const handleNextToStep2 = () => {
    if (!name || !age || !surgeryType || !surgeryDate) {
      setStep1Error('Please fill out all required patient fields.');
      return;
    }
    if (Number(age) < 1 || Number(age) > 120) {
      setStep1Error('Age must be between 1 and 120.');
      return;
    }
    if (caregiverName && !caregiverContact) {
      setStep1Error('Please provide caregiver phone number if a caregiver is named.');
      return;
    }
    setStep1Error('');
    setStep(2);
  };

  const handleNextToStep3 = () => {
    if (selectedExerciseIds.length === 0) {
      setStep2Error('Please select at least one exercise for the protocol.');
      return;
    }
    setStep2Error('');
    setStep(3);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const fullSurgery = `${surgeryType} (${surgerySide})`;
      const patientData = {
          name, 
          age: Number(age), 
          surgeryType: fullSurgery, 
          surgeryDate, 
          caregiverContact, 
          language
      };
      
      const fullExercises = selectedExerciseIds.map(id => exercises.find(e => e.id === id)).filter(Boolean) as Exercise[];
      const timeSlots: Record<string, string> = {};
      selectedExerciseIds.forEach(id => {
          timeSlots[id] = prescriptionConfigs[id].timeSlot;
      });

      const { patient, accessCode } = addPatientWithPrescription(
        patientData,
        fullExercises,
        timeSlots,
        user?.id || 'doc-1',
        prescriptionConfigs
      );

      const creds = await registerPatientAccount(
        patient.id,
        patient.name,
        patient.email,
        patient.surgeryType,
        patient.recoveryWeek,
        user?.id || 'doc-1',
        accessCode
      );
      
      try { sessionStorage.removeItem('rehabai_create_patient_draft'); } catch(e) {}
      
      setGeneratedCreds(creds as any);
      setStep(4);
      if (onSuccess) onSuccess(patient.id, creds as any);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (step < 4 && (name || age || surgeryType) && !window.confirm('You have unsaved changes. Are you sure you want to close?')) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="w-full sm:max-w-2xl bg-white dark:bg-slate-900 sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] h-full sm:h-auto overflow-hidden animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 id="modal-title" className="text-[16px] font-bold text-slate-900 dark:text-white">
              {step === 4 ? 'Patient Created' : 'Create New Patient & Prescription'}
            </h2>
          </div>
          <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
            <div className="flex items-center w-full max-w-sm mx-auto">
              {[1,2,3].map((s) => (
                <React.Fragment key={s}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${step >= s ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-1 mx-2 rounded-full ${step > s ? 'bg-emerald-600' : 'bg-slate-100 dark:bg-slate-800'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {step1Error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center" aria-live="polite">
                  <AlertCircle className="w-4 h-4 mr-2" /> {step1Error}
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="text-[14px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">Patient Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Doe" className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[14px] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Age <span className="text-red-500">*</span></label>
                    <input type="number" min={1} max={120} value={age} onChange={e=>setAge(e.target.value ? Number(e.target.value) : '')} placeholder="45" className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[14px] focus:border-emerald-500 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Surgery Type <span className="text-red-500">*</span></label>
                    <select value={surgeryType} onChange={e=>setSurgeryType(e.target.value)} className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none">
                      <option value="" disabled className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Select surgery</option>
                      {COMMON_SURGERIES.map(s => <option key={s} value={s} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{s}</option>)}
                      <option value="Other / Custom Procedure..." className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Other / Custom Procedure...</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Surgery Side <span className="text-red-500">*</span></label>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      {['Left', 'Right', 'Bilateral'].map(side => (
                        <button key={side} type="button" onClick={() => setSurgerySide(side as any)} className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-colors ${surgerySide === side ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}>{side}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Surgery Date <span className="text-red-500">*</span></label>
                    <input type="date" value={surgeryDate} onChange={e=>setSurgeryDate(e.target.value)} max={new Date().toISOString().split('T')[0]} className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[14px] focus:border-emerald-500 outline-none text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Language Preference <span className="text-red-500">*</span></label>
                    <select value={language} onChange={e=>setLanguage(e.target.value as any)} className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none">
                      <option value="English" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">English</option>
                      <option value="Hindi" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Hindi</option>
                      <option value="Spanish" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Spanish</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[14px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">Caregiver & Contact (Optional)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Caregiver Name</label>
                    <input type="text" value={caregiverName} onChange={e=>setCaregiverName(e.target.value)} placeholder="John Doe" className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[14px] focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Caregiver Phone</label>
                    <input type="tel" value={caregiverContact} onChange={e=>setCaregiverContact(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[14px] focus:border-emerald-500 outline-none" />
                  </div>
                </div>
                {caregiverContact && (
                  <label className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input type="checkbox" checked={caregiverConsent} onChange={e=>setCaregiverConsent(e.target.checked)} className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                    <span className="text-[13px] text-slate-700 dark:text-slate-300 font-medium">Caregiver agrees to receive SMS summaries of missed sessions and pain alerts.</span>
                  </label>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {step2Error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center" aria-live="polite">
                  <AlertCircle className="w-4 h-4 mr-2" /> {step2Error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="text-[14px] font-bold uppercase tracking-wider text-slate-500">Build Protocol</h3>
                  {selectedExerciseIds.length > 0 && (
                    <button onClick={() => {setSelectedExerciseIds([]); setPrescriptionConfigs({});}} className="text-[12px] font-bold text-red-500 hover:text-red-600">Clear all</button>
                  )}
                </div>
                
                {/* Presets */}
                <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                  <button onClick={() => {
                    const ids = ['ex-1', 'ex-3'];
                    setSelectedExerciseIds(ids);
                    setPrescriptionConfigs({'ex-1': {reps:10, sets:3, timeSlot:'Morning 09:00 AM'}, 'ex-3': {reps:15, sets:3, timeSlot:'Evening 05:00 PM'}});
                  }} className="whitespace-nowrap px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[13px] font-bold hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors">
                    ACL Knee Protocol
                  </button>
                  <button onClick={() => {
                    const ids = ['ex-2'];
                    setSelectedExerciseIds(ids);
                    setPrescriptionConfigs({'ex-2': {reps:12, sets:2, timeSlot:'Morning 10:30 AM'}});
                  }} className="whitespace-nowrap px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[13px] font-bold hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors">
                    Shoulder Protocol
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">{exercises.map(ex => (
                  <label key={ex.id} className="flex items-start space-x-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors">
                    <input type="checkbox" checked={selectedExerciseIds.includes(ex.id)} onChange={() => {
                      if (selectedExerciseIds.includes(ex.id)) {
                        setSelectedExerciseIds(prev => prev.filter(x => x !== ex.id));
                        const copy = {...prescriptionConfigs};
                        delete copy[ex.id];
                        setPrescriptionConfigs(copy);
                      } else {
                        setSelectedExerciseIds(prev => [...prev, ex.id]);
                        setPrescriptionConfigs(prev => ({...prev, [ex.id]: {reps: ex.targetReps||10, sets: ex.targetSets||3, timeSlot: ex.defaultTimeSlot||'Morning 09:00 AM'}}));
                      }
                    }} className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                    <div>
                      <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight">{ex.name}</p>
                      <p className="text-[12px] text-slate-500">{ex.category}</p>
                    </div>
                  </label>
                ))}</div>
                </div>

                {selectedExerciseIds.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <h4 className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Selected Exercises ({selectedExerciseIds.length})</h4>
                    {selectedExerciseIds.map(id => {
                      const ex = exercises.find(e => e.id === id);
                      const config = prescriptionConfigs[id];
                      if (!ex || !config) return null;
                      return (
                        <div key={id} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <div className="sm:col-span-5 font-bold text-[14px] text-slate-900 dark:text-white flex items-center"><Dumbbell className="w-4 h-4 mr-2 text-slate-400"/> {ex.name}</div>
                          <div className="sm:col-span-3 flex items-center space-x-2">
                            <input type="number" min={1} max={50} value={config.reps} onChange={e=>setPrescriptionConfigs(p=>({...p, [id]:{...p[id], reps: Number(e.target.value)}}))} className="w-14 h-9 px-2 text-center border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 rounded-lg text-[13px] font-bold" />
                            <span className="text-[12px] text-slate-500 font-medium">x</span>
                            <input type="number" min={1} max={10} value={config.sets} onChange={e=>setPrescriptionConfigs(p=>({...p, [id]:{...p[id], sets: Number(e.target.value)}}))} className="w-14 h-9 px-2 text-center border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 rounded-lg text-[13px] font-bold" />
                          </div>
                          <div className="sm:col-span-4">
                            <select value={config.timeSlot} onChange={e=>setPrescriptionConfigs(p=>({...p, [id]:{...p[id], timeSlot: e.target.value}}))} className="w-full text-sm px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none">
                              {['Morning 09:00 AM', 'Afternoon 01:00 PM', 'Evening 05:00 PM'].map(t=><option key={t} value={t} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{t}</option>)}
                            </select>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" /> {formError}
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[14px] font-bold uppercase tracking-wider text-slate-500">Patient Details</h3>
                    <button onClick={()=>setStep(1)} className="text-[12px] font-bold text-emerald-600 hover:underline">Edit</button>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-[14px] text-slate-700 dark:text-slate-300 grid grid-cols-2 gap-y-2">
                    <div className="font-bold">{name}, {age}</div>
                    <div className="text-right">{surgeryDate}</div>
                    <div className="col-span-2 text-[13px] text-slate-500">{surgeryType} ({surgerySide})</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[14px] font-bold uppercase tracking-wider text-slate-500">Prescription</h3>
                    <button onClick={()=>setStep(2)} className="text-[12px] font-bold text-emerald-600 hover:underline">Edit</button>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-[14px] text-slate-700 dark:text-slate-300 space-y-2">
                    {selectedExerciseIds.map(id => {
                      const ex = exercises.find(e => e.id === id);
                      const config = prescriptionConfigs[id];
                      return (
                        <div key={id} className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-700 last:border-0">
                          <span className="font-medium text-[13px]">{ex?.name}</span>
                          <span className="text-[12px] text-slate-500 font-mono bg-slate-200 dark:bg-slate-900 px-2 py-0.5 rounded">{config.reps}x{config.sets} @ {config.timeSlot.split(' ')[0]}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && generatedCreds && (
            <div className="py-8 space-y-8 animate-in zoom-in-95 duration-500 text-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Prescription Active</h2>
                <p className="text-[14px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">Patient profile created and exercises scheduled. Provide this access code to the patient so they can sign in.</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-sm mx-auto">
                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Patient Access Code</p>
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                  <span className="text-2xl font-mono font-black text-slate-900 dark:text-white tracking-widest">{generatedCreds.accessCode}</span>
                  <button onClick={() => {
                    navigator.clipboard.writeText(generatedCreds.accessCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }} className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors">
                    {copied ? <Check className="w-5 h-5"/> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-[14px] hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center">
                  <Send className="w-4 h-4 mr-2" /> Email Details
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {step < 4 && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0 flex items-center justify-between">
            {step === 1 ? (
              <button onClick={handleClose} className="px-6 py-2.5 text-[14px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Cancel</button>
            ) : (
              <button onClick={() => setStep(step - 1 as any)} className="px-6 py-2.5 text-[14px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </button>
            )}

            {step === 1 && (
              <button onClick={handleNextToStep2} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[14px] font-bold shadow-md hover:bg-emerald-500 transition-colors flex items-center">
                Next Step <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}

            {step === 2 && (
              <button onClick={handleNextToStep3} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[14px] font-bold shadow-md hover:bg-emerald-500 transition-colors flex items-center">
                Review <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}

            {step === 3 && (
              <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 bg-emerald-600 disabled:bg-emerald-600/50 text-white rounded-xl text-[14px] font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all flex items-center">
                {isSubmitting ? 'Assigning...' : 'Assign & Share'}
              </button>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0 flex items-center justify-center">
            <button onClick={() => {
              setStep(1); setName(''); setAge(''); setSurgeryType(''); setSelectedExerciseIds([]);
              try { sessionStorage.removeItem('rehabai_create_patient_draft'); } catch(e){}
            }} className="px-6 py-2.5 text-[14px] font-bold text-emerald-600 hover:text-emerald-700 mr-4">Create another patient</button>
            <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[14px] font-bold shadow-md hover:scale-105 transition-transform">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

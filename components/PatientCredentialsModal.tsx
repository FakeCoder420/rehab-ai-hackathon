'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Key, 
  Copy, 
  Check, 
  Share2, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  X,
  PhoneCall
} from 'lucide-react';

interface PatientCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  accessCode: string;
  tempPassword: string;
  caregiverContact: string;
}

export function PatientCredentialsModal({
  isOpen,
  onClose,
  patientName,
  accessCode,
  tempPassword,
  caregiverContact,
}: PatientCredentialsModalProps) {
  const router = useRouter();
  const { loginAsPatient } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(accessCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const messageText = `Rehab AI Patient Recovery Access for ${patientName}:
Access Code: ${accessCode}
Temporary Password: ${tempPassword}
Portal URL: http://localhost:3000/login
Please keep this safe. Contact Caregiver (${caregiverContact}) if assistance is required.`;

  const handleCopyAll = () => {
    navigator.clipboard.writeText(messageText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleTestLogin = async () => {
    await loginAsPatient('', accessCode, tempPassword);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Patient Access Credentials Generated</h3>
              <p className="text-xs text-emerald-100">Share securely with patient or caregiver</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3">
            <UserCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-xs text-emerald-900">
              <p className="font-bold">Prescription registered for {patientName}</p>
              <p className="text-emerald-700 mt-0.5">Caregiver notification ready for: {caregiverContact}</p>
            </div>
          </div>

          {/* Credentials Display Cards */}
          <div className="space-y-3">
            
            {/* Access Code */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  6-Digit Patient Access Code
                </span>
                <p className="text-lg font-black font-mono text-slate-900 tracking-wider mt-0.5">
                  {accessCode}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-xs transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Temporary Password */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Temporary Password
                </span>
                <p className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {tempPassword}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyPassword}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-xs transition"
              >
                {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPass ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

          </div>

          {/* Formatted Message Preview */}
          <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 font-mono space-y-1">
            <p className="font-semibold text-slate-800">Quick SMS / WhatsApp Message Template:</p>
            <p className="text-[11px] text-slate-500 truncate">
              {messageText.split('\n')[0]} Access Code: {accessCode}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleCopyAll}
              className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedAll ? 'Credentials & Instructions Copied!' : 'Copy Full Credentials & SMS Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleTestLogin}
              className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              <span>Test Direct Login as This Patient</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

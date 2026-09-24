'use client';

import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Lock, CheckCircle2, AlertTriangle, EyeOff, Sparkles } from 'lucide-react';

interface StudentField {
  id: string;
  name: string;
  sensitivity: 'Low' | 'Medium' | 'Special Category (Article 9)' | 'High-Risk Identity Data';
  description: string;
  isNecessaryForCafeteria: boolean;
}

const SCHEMA_FIELDS: StudentField[] = [
  { id: 'StudentID', name: 'StudentID', sensitivity: 'Low', description: 'Unique identifier for student record', isNecessaryForCafeteria: true },
  { id: 'Name', name: 'Name', sensitivity: 'Low', description: 'Preferred student name for customer greeting', isNecessaryForCafeteria: true },
  { id: 'Email', name: 'Email', sensitivity: 'Medium', description: 'Contact address for receiving the lunch promotion voucher', isNecessaryForCafeteria: true },
  { id: 'HomeAddress', name: 'HomeAddress', sensitivity: 'Medium', description: 'Permanent residential address', isNecessaryForCafeteria: false },
  { id: 'Religion', name: 'Religion', sensitivity: 'Special Category (Article 9)', description: 'Religious affiliation (UK GDPR Article 9 Special Category Data)', isNecessaryForCafeteria: false },
  { id: 'MedicalCondition', name: 'MedicalCondition', sensitivity: 'Special Category (Article 9)', description: 'Confidential clinical health notes & diagnoses (UK GDPR Article 9)', isNecessaryForCafeteria: false },
  { id: 'PassportNumber', name: 'PassportNumber', sensitivity: 'High-Risk Identity Data', description: 'Government travel identity document (Sensitive personal identifier requiring strict data minimisation)', isNecessaryForCafeteria: false },
  { id: 'Attendance', name: 'Attendance', sensitivity: 'Medium', description: 'Lecture attendance records', isNecessaryForCafeteria: false },
];

export const DataEthicsLab: React.FC = () => {
  // Initially, all fields are granted to the cafeteria view (a massive GDPR violation)
  const [grantedFields, setGrantedFields] = useState<string[]>([
    'StudentID', 'Name', 'Email', 'HomeAddress', 'Religion', 'MedicalCondition', 'PassportNumber', 'Attendance'
  ]);
  const [submitted, setSubmitted] = useState(false);

  const toggleField = (id: string) => {
    setSubmitted(false);
    if (grantedFields.includes(id)) {
      setGrantedFields(grantedFields.filter((f) => f !== id));
    } else {
      setGrantedFields([...grantedFields, id]);
    }
  };

  // Evaluate compliance with UK GDPR Article 5(1)(c) and Article 9
  const hasSpecialCategory = grantedFields.some((f) => ['Religion', 'MedicalCondition'].includes(f));
  const hasHighRiskIdentity = grantedFields.includes('PassportNumber');
  const hasUnnecessaryMedium = grantedFields.some((f) => ['HomeAddress', 'Attendance'].includes(f));
  const missingCore = !grantedFields.includes('Email') || !grantedFields.includes('StudentID');
  const isFullyCompliant = !hasSpecialCategory && !hasHighRiskIdentity && !hasUnnecessaryMedium && !missingCore;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950 text-rose-400 text-xs font-black uppercase tracking-wider mb-2 border border-rose-800">
            <Shield className="w-3.5 h-3.5" /> Data Ethics &amp; Governance Engineering
          </div>
          <h3 className="text-xl font-black text-white">
            Consequential Data Ethics: GDPR Data Minimisation in Practice
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Scenario: The campus cafeteria wants to dispatch automated lunch offer vouchers. Architect a secure database projection view that adheres to strict <strong>Purpose Limitation</strong> and <strong>Data Minimisation</strong> principles.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-800 text-rose-300 self-start sm:self-center">
          UK GDPR Article 5(1)(c)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Table Column Permission Selector */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Underlying Students Table Columns ({grantedFields.length} Exposed):
            </span>
            <span className="text-[10px] text-slate-500">Click to grant/revoke access</span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {SCHEMA_FIELDS.map((f) => {
              const isGranted = grantedFields.includes(f.id);
              const isHighRisk = f.sensitivity.includes('Special Category') || f.sensitivity.includes('High-Risk');

              return (
                <div
                  key={f.id}
                  onClick={() => toggleField(f.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isGranted
                      ? isHighRisk
                        ? 'bg-rose-950/40 border-rose-600 shadow-sm'
                        : 'bg-slate-900 border-slate-700'
                      : 'bg-slate-950 border-slate-800 opacity-50 hover:opacity-80'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{f.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        isHighRisk
                          ? 'bg-rose-900 text-rose-200'
                          : f.sensitivity === 'Medium'
                          ? 'bg-amber-950 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {f.sensitivity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{f.description}</p>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                    isGranted
                      ? isHighRisk
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isGranted ? 'Exposed' : 'Pruned'}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setSubmitted(true)}
            className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white rounded-xl text-xs font-black transition-all shadow-md mt-2"
          >
            Audit Cafeteria Projection Security
          </button>
        </div>

        {/* Right: Security & Compliance Evaluation Audit */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 block">
              Governance &amp; Ethical Posture Audit:
            </span>

            {/* Compliance Banner */}
            <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
              isFullyCompliant
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/60 border-rose-600 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 text-sm font-bold">
                {isFullyCompliant ? (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    GDPR Article 5 Compliant: Data Minimisation Achieved
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    Regulatory Breach: Over-Privileged Data Exposure
                  </>
                )}
              </div>

              {hasSpecialCategory && (
                <p className="text-[11px] text-rose-300">
                  ❌ <strong>UK GDPR Article 9 Breach:</strong> Special Category Data (Medical health data, Religious beliefs) is exposed to cafeteria staff. Article 9 strictly prohibits processing without explicit legal derogation.
                </p>
              )}

              {hasHighRiskIdentity && (
                <p className="text-[11px] text-rose-300">
                  ❌ <strong>High-Risk Identifier Exposure:</strong> Government passport numbers are confidential identifiers completely disproportionate for cafeteria vouchers, breaching UK GDPR Article 5(1)(c) Data Minimisation.
                </p>
              )}

              {hasUnnecessaryMedium && (
                <p className="text-[11px] text-amber-300">
                  ⚠️ <strong>Data Minimisation Failure:</strong> Home address and lecture attendance are not necessary to email a lunch voucher.
                </p>
              )}

              {missingCore && (
                <p className="text-[11px] text-amber-300">
                  ⚠️ <strong>Operational Defect:</strong> The cafeteria view is missing StudentID or Email, preventing vouchers from being sent.
                </p>
              )}

              {isFullyCompliant && (
                <p className="text-[11px] text-emerald-300">
                  ✓ <strong>Perfect Architecture:</strong> Only necessary fields (StudentID, Name, Email) are projected. Sensitive medical, religious, and passport records are strictly segregated.
                </p>
              )}
            </div>
          </div>

          {/* Ethics Principle Cards */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-pink-400 font-bold block mb-0.5">1. Purpose Limitation</span>
              Data collected for one reason cannot be reused arbitrarily.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-cyan-400 font-bold block mb-0.5">2. Data Minimisation</span>
              Only process the minimal fields required for the service.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-amber-400 font-bold block mb-0.5">3. Role-Based Access</span>
              Cafeteria workers must never access clinical health records.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-emerald-400 font-bold block mb-0.5">4. Retention Limits</span>
              Delete voucher audit logs after expiration period.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

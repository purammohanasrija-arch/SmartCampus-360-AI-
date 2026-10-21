import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  ArrowRight, 
  MessageSquare,
  Sparkles,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { EarlyWarningFlag, User } from '../../types/campus';
import { apiClient } from '../../services/apiClient';

interface EarlyWarningModuleProps {
  currentUser: User;
}

export function EarlyWarningModule({ currentUser }: EarlyWarningModuleProps) {
  const [warnings, setWarnings] = useState<EarlyWarningFlag[]>([]);
  const [selectedWarning, setSelectedWarning] = useState<EarlyWarningFlag | null>(null);
  const [interventionNotesInput, setInterventionNotesInput] = useState('');

  useEffect(() => {
    loadWarnings();
  }, []);

  const loadWarnings = async () => {
    try {
      const res = await apiClient.getEarlyWarnings();
      setWarnings(res.warnings);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'open' | 'under_review' | 'resolved') => {
    try {
      await apiClient.updateWarningStatus(id, status, interventionNotesInput);
      loadWarnings();
      setSelectedWarning(null);
      setInterventionNotesInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const canManageWarnings = currentUser.role === 'admin' || currentUser.role === 'superadmin' || currentUser.role === 'faculty';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span>Student Success</span>
            <span aria-hidden="true">·</span>
            <span>Academic Early-Warning Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Transparent Support Interventions</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Academic Early-Warning & Support Center</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Transparent, explainable criteria flag potential difficulties early to deliver timely mentoring and tutoring interventions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono">
            {warnings.filter(w => w.reviewStatus !== 'resolved').length} Active Flags Requiring Mentorship
          </span>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="p-4 bg-purple-950/30 border border-purple-800/40 rounded-2xl flex items-start gap-3 text-xs text-slate-300">
        <HelpCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white block font-medium">Advisory Framing Policy:</strong>
          <p className="leading-relaxed text-slate-400">
            Early-warning signals are advisory indicators designed solely to connect students with tutoring resources, academic advisors, and financial aid counseling. No automatic academic penalty or disciplinary sanction is derived from automated intelligence flags.
          </p>
        </div>
      </div>

      {/* Warnings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {warnings.map(warn => (
          <div
            key={warn.id}
            className={`border rounded-2xl p-6 space-y-4 transition-all shadow-lg ${
              warn.riskLevel === 'critical'
                ? 'bg-rose-950/10 border-rose-800/40 hover:border-rose-700'
                : 'bg-amber-950/10 border-amber-800/40 hover:border-amber-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                  warn.riskLevel === 'critical'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {warn.riskLevel} Priority
                </span>
                <span className="text-xs text-slate-500 font-mono">Flagged: {warn.flaggedDate}</span>
              </div>

              <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                warn.reviewStatus === 'resolved'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : warn.reviewStatus === 'under_review'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}>
                {warn.reviewStatus.replace('_', ' ')}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">{warn.studentName}</h4>
              <p className="text-xs text-slate-400 font-mono">{warn.department} · Sem {warn.semester} ({warn.studentId})</p>
            </div>

            {/* Explainable Factors List */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-300">Responsible Contributing Factors:</span>
              <ul className="space-y-1 text-xs text-slate-400">
                {warn.factors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Action */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs space-y-1">
              <span className="text-purple-300 font-semibold block">Recommended Mentorship Intervention:</span>
              <p className="text-slate-300 leading-relaxed">{warn.recommendedAction}</p>
              <div className="pt-2 text-[11px] text-slate-500 font-mono flex items-center justify-between">
                <span>Assigned Counselor: {warn.assignedCounselor}</span>
              </div>
            </div>

            {warn.interventionNotes && (
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 italic">
                <span className="font-semibold text-slate-400 not-italic">Case Note:</span> "{warn.interventionNotes}"
              </div>
            )}

            {/* Actions for Staff */}
            {canManageWarnings && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleUpdateStatus(warn.id, 'under_review')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-medium rounded-lg"
                >
                  Mark Under Review
                </button>
                <button
                  onClick={() => handleUpdateStatus(warn.id, 'resolved')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolve Case</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

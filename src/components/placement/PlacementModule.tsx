import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Building2, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  DollarSign, 
  Send, 
  Sparkles,
  Users
} from 'lucide-react';
import { PlacementDrive, PlacementApplication, Student, User } from '../../types/campus';
import { apiClient } from '../../services/apiClient';

interface PlacementModuleProps {
  currentUser: User;
  currentStudent: Student;
}

export function PlacementModule({ currentUser, currentStudent }: PlacementModuleProps) {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [applications, setApplications] = useState<PlacementApplication[]>([]);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    loadPlacements();
  }, []);

  const loadPlacements = async () => {
    try {
      const res = await apiClient.getPlacements();
      setDrives(res.drives);
      setApplications(res.applications);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (drive: PlacementDrive) => {
    setApplyingId(drive.id);
    try {
      await apiClient.applyPlacement(drive.id, currentStudent.studentId, currentStudent.name, currentStudent.cgpa);
      loadPlacements();
      alert(`Application to ${drive.companyName} submitted for review!`);
    } catch (err: any) {
      alert(err.message || 'Application error');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span>Corporate Liaison</span>
            <span aria-hidden="true">·</span>
            <span>Placement & Career Opportunities</span>
            <span aria-hidden="true">·</span>
            <span>Recruitment Pipeline</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Placement & Career Development</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Explore tier-1 technology partners, track corporate interview schedules, and monitor candidate offers.
          </p>
        </div>

        {/* Candidate CGPA Eligibility Badge */}
        <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
          <span className="text-slate-400">Your Standing:</span>
          <span className="font-bold text-emerald-400">{currentStudent.cgpa} CGPA</span>
          <span className="text-slate-500">· Eligible for 100% of Drives</span>
        </div>
      </div>

      {/* My Applications Pipeline */}
      {applications.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Active Application Status ({applications.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map(app => (
              <div 
                key={app.id} 
                className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{app.companyName}</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                    {app.status.replace('_', ' ')}
                  </span>
                </div>

                {app.round && (
                  <div className="text-slate-300 font-medium">{app.round}</div>
                )}

                {app.interviewDate && (
                  <div className="text-[11px] text-amber-300 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Interview: {app.interviewDate}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recruitment Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drives.map(drive => {
          const isEligible = currentStudent.cgpa >= drive.eligibilityMinCGPA;
          const hasApplied = applications.some(a => a.driveId === drive.id && a.studentId === currentStudent.studentId);

          return (
            <div
              key={drive.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 space-y-4 transition-all shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-400">{drive.location}</span>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono">
                    ${drive.packageLPA} LPA
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{drive.companyName}</h4>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">{drive.role}</p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs font-mono space-y-1.5 text-slate-400">
                  <div className="flex justify-between">
                    <span>Min CGPA:</span>
                    <span className={isEligible ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {drive.eligibilityMinCGPA} {isEligible ? '(Eligible)' : '(Ineligible)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Openings:</span>
                    <span className="text-white font-semibold">{drive.openings} positions</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Application Deadline:</span>
                    <span className="text-slate-300">{drive.applicationDeadline}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-800">
                {hasApplied ? (
                  <button
                    disabled
                    className="w-full py-2 bg-slate-800 text-slate-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Application Submitted</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(drive)}
                    disabled={!isEligible || applyingId === drive.id}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isEligible ? 'Apply with Profile' : 'CGPA Ineligible'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

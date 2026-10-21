import React from 'react';
import { X, Printer, ShieldCheck, QrCode, Sparkles, Building2 } from 'lucide-react';
import { Student } from '../../types/campus';
import { TiltCard } from '../common/TiltCard';

interface DigitalIdCardModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

export function DigitalIdCardModal({ student, isOpen, onClose }: DigitalIdCardModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Digital Smart University ID</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Printable Digital ID Card with 3D Holographic Perspective Tilt */}
        <TiltCard maxTilt={14} glare={true} className="rounded-2xl shadow-2xl">
          <div id="printable-id-card" className="bg-gradient-to-br from-purple-950 via-slate-950 to-indigo-950 border-2 border-purple-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-5 text-white">
            {/* Subtle Security Holographic Waves */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

            {/* Institution Header */}
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  SC
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200">SmartCampus 360 University</h4>
                  <p className="text-[10px] text-slate-400">Accredited Institute of Technology & AI</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                Active Scholar
              </span>
            </div>

            {/* Student Portrait & Primary Info */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-24 rounded-xl bg-purple-900/60 border border-purple-500/40 flex flex-col items-center justify-center text-white font-extrabold text-2xl shadow-inner shrink-0 relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-purple-800 to-indigo-700 text-purple-100">
                  {student.avatar || 'SC'}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 py-0.5 text-center text-[8px] font-mono tracking-widest text-purple-300">
                  VERIFIED
                </div>
              </div>

              <div className="space-y-1">
                <h5 className="text-base font-bold text-white leading-tight">{student.name}</h5>
                <p className="text-xs text-purple-300 font-medium">{student.course}</p>
                <div className="text-[11px] text-slate-400 font-mono pt-1">
                  <div>ID: <span className="text-white font-semibold">{student.studentId}</span></div>
                  <div>Roll No: <span className="text-slate-300">{student.rollNo}</span></div>
                  <div>Year / Sem: <span className="text-slate-300">Year {student.year} · Sem {student.semester}</span></div>
                </div>
              </div>
            </div>

            {/* Department and Emergency Contact */}
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-950/60 rounded-xl border border-purple-500/20 text-[10px] font-mono">
              <div>
                <span className="text-slate-500 block">Department</span>
                <span className="text-slate-200 font-semibold truncate block">{student.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Emergency Phone</span>
                <span className="text-slate-200 font-semibold">{student.emergencyContact}</span>
              </div>
            </div>

            {/* Card Footer with Verification QR & Barcode Simulation */}
            <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
              <div>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-mono">Valid Academic Years</span>
                <span className="text-xs font-bold text-purple-300 font-mono">2023 — 2027</span>
                <span className="text-[9px] text-slate-500 block font-mono mt-0.5">3D Interactive Parallax Enabled</span>
              </div>

              {/* QR Code Graphic representation */}
              <div className="p-1.5 bg-white rounded-lg shadow-md shrink-0">
                <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center text-white">
                  <QrCode className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Done
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-purple-600/30"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}

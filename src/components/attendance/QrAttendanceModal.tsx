import React, { useState, useEffect } from 'react';
import { X, QrCode, Timer, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { AttendanceSession, Student } from '../../types/campus';
import { apiClient } from '../../services/apiClient';

interface QrAttendanceModalProps {
  session: AttendanceSession;
  currentStudent?: Student;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function QrAttendanceModal({ session, currentStudent, isOpen, onClose, onSuccess }: QrAttendanceModalProps) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes session timer
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Student test simulation: scan this QR code
  const handleSimulateStudentScan = async () => {
    if (!currentStudent) return;
    setVerifyStatus('scanning');

    try {
      const res = await apiClient.verifyQrAttendance(session.qrToken || 'TOKEN-TEST', currentStudent.studentId);
      if (res.success) {
        setVerifyStatus('success');
        setFeedbackMsg(res.message);
        onSuccess();
      } else {
        setVerifyStatus('error');
        setFeedbackMsg(res.message || 'Verification failed');
      }
    } catch (err: any) {
      setVerifyStatus('error');
      setFeedbackMsg(err.message || 'Network error verifying QR attendance');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-left">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Dynamic Session QR Code</h3>
              <p className="text-[11px] text-slate-400">{session.courseCode}: {session.courseName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Countdown */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono">
          <Timer className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-slate-400">Expires in:</span>
          <span className="font-bold text-emerald-400 text-sm">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        {/* QR Code Container with High Contrast & Subtle Scanline */}
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-inner mx-auto w-56 h-56 relative overflow-hidden">
          <QrCode className="w-44 h-44 text-slate-950" />
          <div className="absolute inset-x-0 h-0.5 bg-purple-500 shadow-md shadow-purple-500 animate-scan pointer-events-none" />
        </div>

        {/* Session Metadata */}
        <div className="space-y-1 text-xs text-slate-400 font-mono">
          <div>Room: <span className="text-white font-semibold">{session.room}</span> · Time: <span className="text-white font-semibold">{session.timeSlot}</span></div>
          <div>Token: <span className="text-purple-300 font-bold">{session.qrToken}</span></div>
          <p className="text-[10px] text-slate-500 pt-1">
            Protected with cryptographically signed timestamp. One submission per authenticated student.
          </p>
        </div>

        {/* Verification Status or Simulation Action */}
        <div className="pt-2 border-t border-slate-800">
          {verifyStatus === 'success' ? (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{feedbackMsg}</span>
            </div>
          ) : verifyStatus === 'error' ? (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{feedbackMsg}</span>
            </div>
          ) : (
            currentStudent && (
              <button
                onClick={handleSimulateStudentScan}
                disabled={verifyStatus === 'scanning'}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Simulate Student Scan ({currentStudent.name.split(' ')[0]})</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

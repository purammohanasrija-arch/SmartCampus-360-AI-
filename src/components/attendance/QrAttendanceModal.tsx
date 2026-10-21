import React, { useState, useEffect } from 'react';
import { X, QrCode, Timer, CheckCircle2, ShieldCheck, AlertCircle, Copy, Check } from 'lucide-react';
import { AttendanceSession, Student } from '../../types/campus';
import { apiClient } from '../../services/apiClient';
import { RealQrCode } from '../common/RealQrCode';

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
  const [copied, setCopied] = useState(false);

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

  // Build authentic scannable QR verification URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://smartcampus.edu';
  const qrVerificationUrl = `${origin}/?module=attendance&session=${encodeURIComponent(session.id)}&token=${encodeURIComponent(session.qrToken || 'LIVE-TOKEN')}&course=${encodeURIComponent(session.courseCode)}`;

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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-center">
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

        {/* Authentic High-Resolution Scannable QR Code */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-2xl mx-auto w-64 h-64 relative overflow-hidden border-4 border-purple-500/30 group">
          <RealQrCode 
            value={qrVerificationUrl} 
            size={220} 
            level="Q" 
            showScanline={true} 
            darkColor="#0f172a" 
            lightColor="#ffffff" 
            margin={1}
          />
          <div className="absolute bottom-1 inset-x-0 text-center pointer-events-none">
            <span className="text-[9px] font-mono tracking-widest text-slate-500 bg-white/95 px-2 py-0.5 rounded-full shadow-sm font-semibold border border-slate-200">
              SCANNABLE LIVE QR
            </span>
          </div>
        </div>

        {/* Session Metadata & Copy Token Action */}
        <div className="space-y-2 text-xs text-slate-400 font-mono text-left">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-500 text-[10px] block font-mono">CRYPTOGRAPHIC SESSION TOKEN</span>
              <span className="text-purple-300 font-bold text-xs">{session.qrToken}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(session.qrToken || '');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              title="Copy session token"
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-[11px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
            <span>Room: <strong className="text-white">{session.room}</strong></span>
            <span>Time Slot: <strong className="text-white">{session.timeSlot}</strong></span>
          </div>
          <p className="text-[10px] text-slate-500 text-center pt-0.5">
            Point any phone camera or barcode scanner at the screen to record verified attendance.
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

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Plus, 
  Check, 
  X, 
  FileText, 
  Users, 
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { 
  AttendanceSession, 
  AttendanceRecord, 
  AttendanceCorrection, 
  Student, 
  User 
} from '../../types/campus';
import { QrAttendanceModal } from './QrAttendanceModal';
import { apiClient } from '../../services/apiClient';

interface AttendanceModuleProps {
  currentUser: User;
  currentStudent: Student;
  students: Student[];
}

export function AttendanceModule({ currentUser, currentStudent, students }: AttendanceModuleProps) {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [corrections, setCorrections] = useState<AttendanceCorrection[]>([]);
  const [activeTab, setActiveTab] = useState<'sessions' | 'marking' | 'corrections' | 'analytics'>('sessions');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isCreateSessionModalOpen, setIsCreateSessionModalOpen] = useState(false);
  const [isSubmitCorrectionOpen, setIsSubmitCorrectionOpen] = useState(false);

  // New Session form
  const [newSessionData, setNewSessionData] = useState({
    courseCode: 'CS601',
    courseName: 'Deep Neural Systems & Generative Models',
    timeSlot: '09:00 - 10:30 AM',
    room: 'Turing Hall 302'
  });

  // Correction request form
  const [correctionData, setCorrectionData] = useState({
    courseCode: 'CS601',
    sessionDate: new Date().toISOString().substring(0, 10),
    requestedStatus: 'approved_leave' as 'present' | 'approved_leave',
    reason: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const sessRes = await apiClient.getAttendanceSessions();
      setSessions(sessRes.sessions);
      if (sessRes.sessions.length > 0 && !selectedSession) {
        setSelectedSession(sessRes.sessions[0]);
        loadRecords(sessRes.sessions[0].id);
      }

      const corrRes = await apiClient.getAttendanceCorrections();
      setCorrections(corrRes.corrections);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRecords = async (sessionId: string) => {
    try {
      const recRes = await apiClient.getAttendanceRecords(sessionId);
      if (recRes.records.length > 0) {
        setRecords(recRes.records);
      } else {
        // Generate baseline roster records for this session
        const baseRecords: AttendanceRecord[] = students.map((s, idx) => ({
          id: `rec-${sessionId}-${s.id}`,
          sessionId,
          studentId: s.studentId,
          studentName: s.name,
          rollNo: s.rollNo,
          status: idx === 1 ? 'absent' : idx === 3 ? 'late' : 'present',
          markedAt: '09:05 AM',
          verifiedMethod: 'qr_scan'
        }));
        setRecords(baseRecords);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectSession = (sess: AttendanceSession) => {
    setSelectedSession(sess);
    loadRecords(sess.id);
    setActiveTab('marking');
  };

  const handleStatusChange = (recordId: string, newStatus: AttendanceRecord['status']) => {
    setRecords(prev => prev.map(r => r.id === recordId ? { ...r, status: newStatus } : r));
  };

  const handleMarkAll = (status: AttendanceRecord['status']) => {
    setRecords(prev => prev.map(r => ({ ...r, status })));
  };

  const handleSaveAttendance = async () => {
    if (!selectedSession) return;
    try {
      await apiClient.markAttendanceBatch(selectedSession.id, records);
      alert('Attendance records successfully updated on campus ledger!');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await apiClient.createAttendanceSession(newSessionData);
      setIsCreateSessionModalOpen(false);
      setSessions([created, ...sessions]);
      setSelectedSession(created);
      loadRecords(created.id);
      setIsQrModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewCorrection = async (id: string, action: 'approved' | 'rejected') => {
    try {
      await apiClient.reviewCorrection(id, action, `Action logged by ${currentUser.name}`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionData.reason) return;
    try {
      await apiClient.submitCorrection({
        studentId: currentStudent.studentId,
        courseCode: correctionData.courseCode,
        sessionDate: correctionData.sessionDate,
        reason: correctionData.reason,
        requestedStatus: correctionData.requestedStatus
      });
      setIsSubmitCorrectionOpen(false);
      setCorrectionData({
        courseCode: 'CS601',
        sessionDate: new Date().toISOString().substring(0, 10),
        requestedStatus: 'approved_leave',
        reason: ''
      });
      loadData();
      alert('Correction petition submitted to course faculty for audit review.');
    } catch (err) {
      console.error(err);
    }
  };

  const canMarkAttendance = currentUser.role === 'admin' || currentUser.role === 'superadmin' || currentUser.role === 'faculty';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span>Academic Governance</span>
            <span aria-hidden="true">·</span>
            <span>Attendance & Condonation</span>
            <span aria-hidden="true">·</span>
            <span>Cryptographic Session QR</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Attendance Management System</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Record lecture participation, generate dynamic expiration QR tokens, and process formal condonation petitions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canMarkAttendance && (
            <button
              onClick={() => setIsCreateSessionModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Launch Session</span>
            </button>
          )}

          {currentUser.role === 'student' && (
            <button
              onClick={() => setIsSubmitCorrectionOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-800 hover:bg-slate-800 text-purple-300 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Request Correction</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'sessions' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Lecture Sessions ({sessions.length})
        </button>
        <button
          onClick={() => setActiveTab('marking')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'marking' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Roster Marking
        </button>
        <button
          onClick={() => setActiveTab('corrections')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'corrections' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Corrections & Petitions ({corrections.filter(c => c.status === 'pending').length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'analytics' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Compliance Analytics
        </button>
      </div>

      {/* Tab 1: Sessions List */}
      {activeTab === 'sessions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map(s => (
            <div
              key={s.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 space-y-4 transition-all shadow-md group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 font-mono">{s.courseCode}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                  s.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {s.status === 'active' ? 'Active QR' : 'Closed'}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{s.courseName}</h4>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{s.timeSlot} · {s.room}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  Turnout: <strong className="text-white tabular-nums">{s.presentCount}</strong> / {s.totalEnrolled}
                </span>

                <div className="flex items-center gap-1.5">
                  {s.qrToken && (
                    <button
                      onClick={() => { setSelectedSession(s); setIsQrModalOpen(true); }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg transition-colors"
                      title="Show Session QR"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleSelectSession(s)}
                    className="px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg transition-colors text-xs font-medium"
                  >
                    Open Roster →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Roster Marking */}
      {activeTab === 'marking' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                {selectedSession?.courseCode} · {selectedSession?.date}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedSession?.courseName}</h3>
              <p className="text-xs text-slate-400">{selectedSession?.room} · Faculty: {selectedSession?.facultyName}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {canMarkAttendance && (
                <>
                  <button
                    onClick={() => handleMarkAll('present')}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg transition-colors"
                  >
                    Mark All Present
                  </button>
                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-medium bg-purple-600/30 hover:bg-purple-600 text-purple-200 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Display QR</span>
                  </button>
                  <button
                    onClick={handleSaveAttendance}
                    className="px-4 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-md transition-colors"
                  >
                    Save Records
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4">Roll Number</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Verification Method</th>
                  <th className="py-2.5 px-4">Time Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-white">{r.studentName}</td>
                    <td className="py-2.5 px-4 font-mono text-purple-300">{r.rollNo}</td>
                    <td className="py-2.5 px-4">
                      {canMarkAttendance ? (
                        <div className="flex items-center gap-1">
                          {(['present', 'absent', 'late', 'approved_leave'] as const).map(st => (
                            <button
                              key={st}
                              onClick={() => handleStatusChange(r.id, st)}
                              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                                r.status === st
                                  ? st === 'present'
                                    ? 'bg-emerald-600 text-white'
                                    : st === 'absent'
                                    ? 'bg-rose-600 text-white'
                                    : st === 'late'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-blue-600 text-white'
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {st.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          r.status === 'present'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : r.status === 'absent'
                            ? 'text-rose-400 bg-rose-500/10'
                            : 'text-amber-400 bg-amber-500/10'
                        }`}>
                          {r.status}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 font-mono">
                      {r.verifiedMethod === 'qr_scan' ? 'Dynamic QR Scan' : 'Faculty Manual Entry'}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 font-mono tabular-nums">{r.markedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Attendance Corrections Workflow */}
      {activeTab === 'corrections' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Attendance Condonation & Correction Ledger</h3>
              <p className="text-xs text-slate-400">Formal appeals submitted by students with documented reasons.</p>
            </div>
            {currentUser.role === 'student' && (
              <button
                onClick={() => setIsSubmitCorrectionOpen(true)}
                className="px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                + New Petition
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-800">
            {corrections.map(c => (
              <div key={c.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-xs">{c.studentName}</span>
                    <span className="text-purple-400 font-mono text-xs">({c.studentId})</span>
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="text-slate-300 text-xs font-mono">{c.courseCode} ({c.sessionDate})</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{c.reason}</p>
                  <span className="text-[10px] text-slate-500 font-mono block">Submitted: {c.submittedAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                    c.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : c.status === 'rejected'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {c.status}
                  </span>

                  {c.status === 'pending' && canMarkAttendance && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleReviewCorrection(c.id, 'approved')}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                        title="Approve Petition"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReviewCorrection(c.id, 'rejected')}
                        className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
                        title="Reject Petition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Compliance Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-slate-400">Statutory 75% Threshold</span>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">91.4% Overall</div>
            <p className="text-xs text-slate-500">Students across 5 academic departments currently in compliance.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-slate-400">Critical Shortage Cohort</span>
            <div className="text-2xl font-bold text-rose-400 font-mono tabular-nums">2 Students &lt;75%</div>
            <p className="text-xs text-slate-500">Early Warning alerts automatically issued to academic mentors.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <span className="text-xs text-slate-400">QR Cryptographic Sessions</span>
            <div className="text-2xl font-bold text-purple-400 font-mono tabular-nums">100% Zero-Spoof</div>
            <p className="text-xs text-slate-500">Dynamic one-time time-locked tokens prevent duplicate scans.</p>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedSession && (
        <QrAttendanceModal
          session={selectedSession}
          currentStudent={currentStudent}
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          onSuccess={() => {
            loadRecords(selectedSession.id);
            setIsQrModalOpen(false);
          }}
        />
      )}

      {/* Create Session Modal */}
      {isCreateSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Launch Attendance Session</h3>
              <button onClick={() => setIsCreateSessionModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Course Subject</label>
                <select
                  value={newSessionData.courseCode}
                  onChange={e => {
                    const code = e.target.value;
                    const name = code === 'CS601' ? 'Deep Neural Systems & Generative Models' : code === 'CS602' ? 'Advanced Distributed Systems' : 'Cybersecurity Protocols';
                    setNewSessionData({ ...newSessionData, courseCode: code, courseName: name });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="CS601">CS601: Deep Neural Systems & Generative Models</option>
                  <option value="CS602">CS602: Advanced Distributed Systems</option>
                  <option value="CS603">CS603: Cybersecurity & Cryptographic Protocols</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Time Slot</label>
                  <input
                    type="text"
                    value={newSessionData.timeSlot}
                    onChange={e => setNewSessionData({ ...newSessionData, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Hall / Lab</label>
                  <input
                    type="text"
                    value={newSessionData.room}
                    onChange={e => setNewSessionData({ ...newSessionData, room: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateSessionModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg"
                >
                  Generate QR Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Correction Modal */}
      {isSubmitCorrectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Attendance Condonation Petition</h3>
              <button onClick={() => setIsSubmitCorrectionOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitCorrection} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Course Code</label>
                <select
                  value={correctionData.courseCode}
                  onChange={e => setCorrectionData({ ...correctionData, courseCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="CS601">CS601: Deep Neural Systems</option>
                  <option value="CS602">CS602: Advanced Distributed Systems</option>
                  <option value="CS603">CS603: Cybersecurity Protocols</option>
                  <option value="CS604">CS604: Database Engineering</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Date of Session</label>
                <input
                  type="date"
                  value={correctionData.sessionDate}
                  onChange={e => setCorrectionData({ ...correctionData, sessionDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Reason for Absence / Correction *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="State valid reason (e.g. University hospital visit, authorized hackathon delegation)..."
                  value={correctionData.reason}
                  onChange={e => setCorrectionData({ ...correctionData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitCorrectionOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

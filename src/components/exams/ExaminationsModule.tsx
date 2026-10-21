import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Calendar, 
  Clock, 
  Plus, 
  Printer, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  Filter,
  TrendingUp,
  X
} from 'lucide-react';
import { Examination, ExamResult, Student, User } from '../../types/campus';
import { apiClient } from '../../services/apiClient';
import { TiltCard, ParallaxLayer } from '../common/TiltCard';

interface ExaminationsModuleProps {
  currentUser: User;
  currentStudent: Student;
}

export function ExaminationsModule({ currentUser, currentStudent }: ExaminationsModuleProps) {
  const [exams, setExams] = useState<Examination[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [activeTab, setActiveTab] = useState<'schedules' | 'results' | 'reportCard'>('schedules');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Exam Form
  const [newExamData, setNewExamData] = useState({
    title: '',
    courseCode: 'CS601',
    courseName: 'Deep Neural Systems & Generative Models',
    examDate: '2026-11-15',
    time: '10:00 AM - 12:00 PM',
    room: 'Auditorium Hall A',
    maxMarks: 50,
    passMarks: 20,
    semester: 6,
    weightagePercentage: 30
  });

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const res = await apiClient.getExams();
      setExams(res.examinations);
      setResults(res.results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamData.title) return;
    try {
      const created = await apiClient.createExam(newExamData);
      setExams([created, ...exams]);
      setIsCreateModalOpen(false);
      setNewExamData({
        title: '',
        courseCode: 'CS601',
        courseName: 'Deep Neural Systems & Generative Models',
        examDate: '2026-11-15',
        time: '10:00 AM - 12:00 PM',
        room: 'Auditorium Hall A',
        maxMarks: 50,
        passMarks: 20,
        semester: 6,
        weightagePercentage: 30
      });
    } catch (err) {
      console.error(err);
    }
  };

  const canManageExams = currentUser.role === 'admin' || currentUser.role === 'superadmin' || currentUser.role === 'faculty';

  // Filter student-specific results
  const studentResults = results.filter(r => r.studentId === currentStudent.studentId);

  return (
    <div className="space-y-6">
      {/* Module Title Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span>Assessment</span>
            <span aria-hidden="true">·</span>
            <span>Examinations & Grade Ledger</span>
            <span aria-hidden="true">·</span>
            <span>Credit-Weighted CGPA</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Examinations & Result Governance</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            View scheduled midterm/final dates, published grading rubrics, and generate official student grade sheets.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canManageExams && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Assessment</span>
            </button>
          )}

          <button
            onClick={() => { setActiveTab('reportCard'); setTimeout(() => window.print(), 200); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-purple-400" />
            <span>Print Report Card</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'schedules' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Exam Schedules ({exams.length})
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'results' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Published Results
        </button>
        <button
          onClick={() => setActiveTab('reportCard')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'reportCard' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Official Grade Sheet
        </button>
      </div>

      {/* Tab 1: Schedules with 3D Parallax Hover Effect */}
      {activeTab === 'schedules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map(e => (
            <TiltCard key={e.id} maxTilt={7} glare={true} className="rounded-2xl">
              <div className="bg-slate-900/70 border border-slate-800 hover:border-purple-500/60 rounded-2xl p-5 space-y-4 transition-all shadow-md group h-full backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <ParallaxLayer z={14}>
                    <span className="text-xs font-bold text-purple-400 font-mono bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">
                      {e.code}
                    </span>
                  </ParallaxLayer>
                  <ParallaxLayer z={22}>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      e.status === 'scheduled'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {e.status.toUpperCase()}
                    </span>
                  </ParallaxLayer>
                </div>

                <div>
                  <ParallaxLayer z={18}>
                    <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{e.title}</h4>
                  </ParallaxLayer>
                  <ParallaxLayer z={10}>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{e.examDate} · {e.time}</span>
                    </div>
                  </ParallaxLayer>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <ParallaxLayer z={10}>
                    <span>Room: <strong className="text-white">{e.room}</strong></span>
                  </ParallaxLayer>
                  <ParallaxLayer z={12}>
                    <span>Max: <strong className="text-purple-300">{e.maxMarks}</strong> (Pass: {e.passMarks})</span>
                  </ParallaxLayer>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      )}

      {/* Tab 2: Results Overview */}
      {activeTab === 'results' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Cohort Marks & Performance Distribution</h3>
            <span className="text-xs text-emerald-400 font-mono">Verified by Academic Board</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Course</th>
                  <th className="py-2.5 px-4 text-right">Internal (30%)</th>
                  <th className="py-2.5 px-4 text-right">External (70%)</th>
                  <th className="py-2.5 px-4 text-right">Total Score</th>
                  <th className="py-2.5 px-4 text-center">Grade</th>
                  <th className="py-2.5 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {results.map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-white">{r.studentName}</td>
                    <td className="py-2.5 px-4 font-mono text-purple-300">{r.courseCode}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">{r.internalMarks}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">{r.externalMarks}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-white tabular-nums">{r.totalMarks}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded font-bold font-mono text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {r.grade} ({r.gpaPoint})
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 text-[11px] max-w-xs truncate">{r.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Official Printable Grade Sheet */}
      {activeTab === 'reportCard' && (
        <div id="printable-report-card" className="bg-slate-950 border border-slate-800 rounded-3xl p-8 max-w-3xl mx-auto space-y-6 shadow-2xl text-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
                SC
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">SmartCampus 360 University</h3>
                <p className="text-xs text-slate-400">Office of the Registrar · Official Semester Grade Sheet</p>
              </div>
            </div>
            <div className="text-right text-xs font-mono text-slate-400">
              <div>Date: {new Date().toISOString().substring(0, 10)}</div>
              <div>Transcript Ref: TR-2026-CS-8921</div>
            </div>
          </div>

          {/* Student Bio Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Candidate Name</span>
              <strong className="text-white text-sm">{currentStudent.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Student ID / Roll</span>
              <span className="text-purple-300 font-semibold">{currentStudent.studentId} · {currentStudent.rollNo}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Department</span>
              <span className="text-slate-300">{currentStudent.department}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Semester & Year</span>
              <span className="text-emerald-400 font-bold">Sem 6 (Year 3)</span>
            </div>
          </div>

          {/* Marks Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-4">Subject Code & Title</th>
                  <th className="py-2.5 px-4 text-center">Credits</th>
                  <th className="py-2.5 px-4 text-center">Internal</th>
                  <th className="py-2.5 px-4 text-center">External</th>
                  <th className="py-2.5 px-4 text-center">Total</th>
                  <th className="py-2.5 px-4 text-center">Letter Grade</th>
                  <th className="py-2.5 px-4 text-right">Grade Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">CS601: Deep Neural Systems & GenAI</td>
                  <td className="py-3 px-4 text-center">4.0</td>
                  <td className="py-3 px-4 text-center">28 / 30</td>
                  <td className="py-3 px-4 text-center">64 / 70</td>
                  <td className="py-3 px-4 text-center font-bold text-white">92</td>
                  <td className="py-3 px-4 text-center text-purple-400 font-bold">A+</td>
                  <td className="py-3 px-4 text-right font-bold">10.0</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">CS602: Advanced Distributed Systems</td>
                  <td className="py-3 px-4 text-center">4.0</td>
                  <td className="py-3 px-4 text-center">26 / 30</td>
                  <td className="py-3 px-4 text-center">61 / 70</td>
                  <td className="py-3 px-4 text-center font-bold text-white">87</td>
                  <td className="py-3 px-4 text-center text-purple-400 font-bold">A</td>
                  <td className="py-3 px-4 text-right font-bold">9.0</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">CS603: Cybersecurity & Crypto Protocols</td>
                  <td className="py-3 px-4 text-center">3.0</td>
                  <td className="py-3 px-4 text-center">27 / 30</td>
                  <td className="py-3 px-4 text-center">62 / 70</td>
                  <td className="py-3 px-4 text-center font-bold text-white">89</td>
                  <td className="py-3 px-4 text-center text-purple-400 font-bold">A</td>
                  <td className="py-3 px-4 text-right font-bold">9.0</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">CS604: Database Engineering</td>
                  <td className="py-3 px-4 text-center">3.0</td>
                  <td className="py-3 px-4 text-center">29 / 30</td>
                  <td className="py-3 px-4 text-center">67 / 70</td>
                  <td className="py-3 px-4 text-center font-bold text-white">96</td>
                  <td className="py-3 px-4 text-center text-purple-400 font-bold">A+</td>
                  <td className="py-3 px-4 text-right font-bold">10.0</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">CS605: HCI & 3D Spatial UI Lab</td>
                  <td className="py-3 px-4 text-center">3.0</td>
                  <td className="py-3 px-4 text-center">30 / 30</td>
                  <td className="py-3 px-4 text-center">65 / 70</td>
                  <td className="py-3 px-4 text-center font-bold text-white">95</td>
                  <td className="py-3 px-4 text-center text-purple-400 font-bold">A+</td>
                  <td className="py-3 px-4 text-right font-bold">10.0</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Box */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-purple-950/30 border border-purple-500/30 rounded-2xl text-center font-mono">
            <div>
              <span className="text-xs text-slate-400">Total Credits Earned</span>
              <div className="text-xl font-bold text-white mt-0.5">17.0 / 17.0</div>
            </div>
            <div>
              <span className="text-xs text-purple-300">Semester SGPA</span>
              <div className="text-2xl font-black text-purple-300 mt-0.5">9.60</div>
            </div>
            <div>
              <span className="text-xs text-emerald-400">Cumulative CGPA</span>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">{currentStudent.cgpa}</div>
            </div>
          </div>

          {/* Institutional Stamp & Seal */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div>
              <span>Verification Token: </span>
              <span className="text-slate-300">SHA256: 8f9b2...e4a1</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-200">Controller of Examinations</div>
              <div className="text-[10px] text-slate-500">Electronically Validated Certificate</div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Schedule Examination</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Exam Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems Final Theory Assessment"
                  value={newExamData.title}
                  onChange={e => setNewExamData({ ...newExamData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Date</label>
                  <input
                    type="date"
                    value={newExamData.examDate}
                    onChange={e => setNewExamData({ ...newExamData, examDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Hall</label>
                  <input
                    type="text"
                    value={newExamData.room}
                    onChange={e => setNewExamData({ ...newExamData, room: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Maximum Marks</label>
                  <input
                    type="number"
                    value={newExamData.maxMarks}
                    onChange={e => setNewExamData({ ...newExamData, maxMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Pass Threshold</label>
                  <input
                    type="number"
                    value={newExamData.passMarks}
                    onChange={e => setNewExamData({ ...newExamData, passMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg"
                >
                  Publish Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

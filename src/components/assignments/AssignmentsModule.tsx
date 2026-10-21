import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Upload, 
  Clock, 
  CheckCircle2, 
  Plus, 
  FileText, 
  AlertCircle,
  Calendar,
  X
} from 'lucide-react';
import { Assignment, Submission, Student, User } from '../../types/campus';
import { apiClient } from '../../services/apiClient';

interface AssignmentsModuleProps {
  currentUser: User;
  currentStudent: Student;
}

export function AssignmentsModule({ currentUser, currentStudent }: AssignmentsModuleProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssignForSubmit, setSelectedAssignForSubmit] = useState<Assignment | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [fileNameInput, setFileNameInput] = useState('');

  // Create Assignment Form
  const [newAssignData, setNewAssignData] = useState({
    title: '',
    courseCode: 'CS601',
    courseName: 'Deep Neural Systems',
    dueDate: '2026-11-20',
    maxMarks: 100,
    instructions: '',
    rubrics: 'Implementation (50%), Performance Benchmarks (30%), Code Quality (20%)'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await apiClient.getAssignments();
      setAssignments(res.assignments);
      setSubmissions(res.submissions);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignForSubmit || !fileNameInput) return;

    try {
      await apiClient.submitAssignment({
        assignmentId: selectedAssignForSubmit.id,
        studentId: currentStudent.studentId,
        studentName: currentStudent.name,
        fileName: fileNameInput
      });
      setSelectedAssignForSubmit(null);
      setFileNameInput('');
      loadData();
      alert('Assignment submitted successfully with cryptographically signed timestamp!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignData.title) return;

    try {
      await apiClient.createExam(newAssignData as any); // using create endpoint
      setIsCreateModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const canCreate = currentUser.role === 'admin' || currentUser.role === 'faculty' || currentUser.role === 'superadmin';

  return (
    <div className="space-y-6">
      {/* Title Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span>Coursework</span>
            <span aria-hidden="true">·</span>
            <span>Learning Management & Submissions</span>
            <span aria-hidden="true">·</span>
            <span>Rubric Evaluation</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Course Assignments & LMS Portal</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Submit coding laboratories, track faculty evaluation feedback, and review grading rubrics.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map(a => {
          const userSub = submissions.find(s => s.assignmentId === a.id && s.studentId === currentStudent.studentId);
          const isSubmitted = !!userSub;

          return (
            <div
              key={a.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 space-y-4 transition-all shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 font-mono">{a.courseCode}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    isSubmitted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {isSubmitted ? 'Submitted' : 'Pending'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{a.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">{a.instructions}</p>
                </div>

                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Due Date:</span>
                    <span className="text-white font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {a.dueDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Max Marks:</span>
                    <span className="text-purple-300 font-bold">{a.maxMarks} pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cohort Turnout:</span>
                    <span className="text-slate-300">{a.submissionsCount} / {a.totalStudents}</span>
                  </div>
                </div>

                {userSub && userSub.marksObtained !== undefined && (
                  <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-semibold">Faculty Grade:</span>
                      <span className="font-bold font-mono text-emerald-300">{userSub.marksObtained} / {a.maxMarks}</span>
                    </div>
                    {userSub.feedback && (
                      <p className="text-[11px] text-slate-300 italic">"{userSub.feedback}"</p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-800">
                {currentUser.role === 'student' && (
                  <button
                    onClick={() => setSelectedAssignForSubmit(a)}
                    className={`w-full py-2 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
                      isSubmitted
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isSubmitted ? 'Resubmit Solution' : 'Submit Assignment'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {selectedAssignForSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Submit Assignment Solution</h3>
              <button onClick={() => setSelectedAssignForSubmit(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-purple-400 font-mono">{selectedAssignForSubmit.courseCode}</span>
              <h4 className="text-sm font-semibold text-white">{selectedAssignForSubmit.title}</h4>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Solution Filename / Code Repository *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. aria_chen_transformer_model.py"
                  value={fileNameInput}
                  onChange={e => setFileNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1 text-slate-400">
                <span className="text-white font-medium block">Evaluation Rubrics:</span>
                <p className="text-[11px]">{selectedAssignForSubmit.rubrics}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignForSubmit(null)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg shadow-md"
                >
                  Confirm & Timestamp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

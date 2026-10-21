import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Filter, 
  CreditCard, 
  MoreVertical, 
  Edit, 
  Archive, 
  CheckCircle2, 
  AlertCircle,
  X,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Student } from '../../types/campus';
import { DigitalIdCardModal } from './DigitalIdCardModal';
import { apiClient } from '../../services/apiClient';

interface StudentDirectoryProps {
  students: Student[];
  onRefresh: () => void;
}

export function StudentDirectory({ students, onRefresh }: StudentDirectoryProps) {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedSem, setSelectedSem] = useState('all');
  const [selectedStudentForId, setSelectedStudentForId] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // New Student Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science & AI',
    course: 'B.Tech Computer Science',
    year: 1,
    semester: 1,
    section: 'A',
    rollNo: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'Parent',
    address: '',
    emergencyContact: ''
  });

  // Filter students
  const filtered = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'all' || s.department === selectedDept;
    const matchesSem = selectedSem === 'all' || String(s.semester) === selectedSem;
    return matchesSearch && matchesDept && matchesSem;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['StudentID', 'Name', 'Email', 'Phone', 'Department', 'Course', 'Year', 'Semester', 'Section', 'RollNo', 'CGPA', 'Attendance', 'FeeStatus', 'BalanceDue'];
    const rows = filtered.map(s => [
      s.studentId,
      `"${s.name}"`,
      s.email,
      s.phone,
      `"${s.department}"`,
      `"${s.course}"`,
      s.year,
      s.semester,
      s.section,
      s.rollNo,
      s.cgpa,
      `${s.attendancePercentage}%`,
      s.feesStatus,
      s.balanceDue
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartCampus_Students_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      if (lines.length > 1) {
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
          if (parts.length >= 3) {
            await apiClient.createStudent({
              name: parts[1] || 'Imported Student',
              email: parts[2] || `imported_${Date.now()}@student.smartcampus.edu`,
              phone: parts[3] || '+1 (555) 000-0000',
              department: parts[4] || 'Computer Science & AI',
              course: parts[5] || 'B.Tech Computer Science',
              year: Number(parts[6]) || 1,
              semester: Number(parts[7]) || 1,
              section: parts[8] || 'A',
              rollNo: parts[9] || `26CS${Math.floor(100 + Math.random() * 900)}`,
              cgpa: Number(parts[10]) || 7.5,
              attendancePercentage: 85.0
            });
          }
        }
        onRefresh();
      }
    };
    reader.readAsText(file);
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    try {
      await apiClient.createStudent({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '+1 (555) 234-5678',
        department: formData.department,
        course: formData.course,
        year: Number(formData.year),
        semester: Number(formData.semester),
        section: formData.section,
        rollNo: formData.rollNo || `26CS${Math.floor(100 + Math.random() * 900)}`,
        guardian: {
          name: formData.guardianName || 'Guardian',
          phone: formData.guardianPhone || '+1 (555) 234-5678',
          email: 'guardian@email.com',
          relation: formData.guardianRelation
        },
        address: formData.address || 'Campus Residence Quad 4',
        emergencyContact: formData.emergencyContact || formData.guardianPhone || '+1 (555) 234-5678',
        status: 'active',
        cgpa: 7.8,
        attendancePercentage: 88.0,
        feesStatus: 'pending',
        balanceDue: 6500,
        avatar: formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
      });
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'Computer Science & AI',
        course: 'B.Tech Computer Science',
        year: 1,
        semester: 1,
        section: 'A',
        rollNo: '',
        guardianName: '',
        guardianPhone: '',
        guardianRelation: 'Parent',
        address: '',
        emergencyContact: ''
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (confirm('Archive this student record?')) {
      await apiClient.archiveStudent(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span>Registry</span>
            <span aria-hidden="true">·</span>
            <span>Student Information System</span>
            <span aria-hidden="true">·</span>
            <span>Role-Based Access</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Student Central Directory</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage academic profiles, digital identities, attendance histories, and enrollments across departments.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* CSV Import */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-purple-400" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          {/* Add Student CTA */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by student ID, full name, email, or roll number..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedDept}
            onChange={e => { setSelectedDept(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Departments</option>
            <option value="Computer Science & AI">Computer Science & AI</option>
            <option value="Electronics & Quantum Communications">Electronics & Quantum</option>
            <option value="Mechanical & Autonomous Robotics">Mechanical & Robotics</option>
            <option value="Biotechnology & Computational Genomics">Biotech & Genomics</option>
            <option value="School of Technology Management">Tech Management</option>
          </select>

          {/* Semester Filter */}
          <select
            value={selectedSem}
            onChange={e => { setSelectedSem(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Semesters</option>
            <option value="2">Semester 2</option>
            <option value="4">Semester 4</option>
            <option value="6">Semester 6</option>
            <option value="8">Semester 8</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Student ID / Roll</th>
                <th className="py-3 px-4">Department & Course</th>
                <th className="py-3 px-4 text-right">CGPA</th>
                <th className="py-3 px-4 text-right">Attendance</th>
                <th className="py-3 px-4 text-center">Fees Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {paginated.length > 0 ? (
                paginated.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Student Avatar & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-800 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                          {s.avatar || s.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{s.name}</div>
                          <div className="text-[11px] text-slate-500">{s.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* ID & Roll */}
                    <td className="py-3 px-4 font-mono">
                      <div className="font-semibold text-purple-300">{s.studentId}</div>
                      <div className="text-[11px] text-slate-500">Roll: {s.rollNo}</div>
                    </td>

                    {/* Department & Course */}
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{s.department}</div>
                      <div className="text-[11px] text-slate-400">{s.course} · Sem {s.semester} (Sec {s.section})</div>
                    </td>

                    {/* CGPA */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-white">
                      {s.cgpa}
                    </td>

                    {/* Attendance */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <span className={s.attendancePercentage < 75 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-medium'}>
                        {s.attendancePercentage}%
                      </span>
                      {s.attendancePercentage < 75 && (
                        <div className="text-[10px] text-rose-500 font-sans font-medium">Under 75% Alert</div>
                      )}
                    </td>

                    {/* Fees Status */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${
                        s.feesStatus === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : s.feesStatus === 'partial'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {s.feesStatus === 'paid' ? 'Paid Full' : s.feesStatus === 'partial' ? `Due $${s.balanceDue}` : 'Overdue'}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudentForId(s)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg transition-colors"
                          title="Generate Digital ID Card"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleArchive(s.id)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                          title="Archive Record"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No student records matching current search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white font-mono">{filtered.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to <strong className="text-white font-mono">{Math.min(currentPage * pageSize, filtered.length)}</strong> of <strong className="text-white font-mono">{filtered.length}</strong> students
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 rounded-lg text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono tabular-nums px-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 rounded-lg text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Digital ID Modal */}
      {selectedStudentForId && (
        <DigitalIdCardModal
          student={selectedStudentForId}
          isOpen={!!selectedStudentForId}
          onClose={() => setSelectedStudentForId(null)}
        />
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                Register New Student
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. maya.lin@student.smartcampus.edu"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Department</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="Computer Science & AI">Computer Science & AI</option>
                    <option value="Electronics & Quantum Communications">Electronics & Quantum</option>
                    <option value="Mechanical & Autonomous Robotics">Mechanical & Robotics</option>
                    <option value="Biotechnology & Computational Genomics">Biotech & Genomics</option>
                    <option value="School of Technology Management">Tech Management</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Course Program</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech Computer Science"
                    value={formData.course}
                    onChange={e => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Year</label>
                  <select
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value={1}>Year 1</option>
                    <option value={2}>Year 2</option>
                    <option value={3}>Year 3</option>
                    <option value={4}>Year 4</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Section</label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Guardian Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Robert Lin"
                    value={formData.guardianName}
                    onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Guardian Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 901-2345"
                    value={formData.guardianPhone}
                    onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg shadow-md"
                >
                  {isSubmitting ? 'Registering...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { 
  User, 
  Student, 
  Faculty, 
  Department, 
  CourseSubject, 
  AttendanceSession, 
  AttendanceRecord,
  AttendanceCorrection,
  Examination, 
  ExamResult, 
  Assignment, 
  Submission, 
  TimetableSlot, 
  FeeRecord, 
  Book, 
  BorrowRecord, 
  PlacementDrive, 
  PlacementApplication, 
  EarlyWarningFlag, 
  GamificationProfile, 
  NotificationItem, 
  AuditLog,
  UserRole
} from '../types/campus';

import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_FACULTY,
  INITIAL_DEPARTMENTS,
  INITIAL_COURSES,
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_CORRECTIONS,
  INITIAL_EXAMINATIONS,
  INITIAL_EXAM_RESULTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_TIMETABLE,
  INITIAL_FEES,
  INITIAL_BOOKS,
  INITIAL_BORROWS,
  INITIAL_DRIVES,
  INITIAL_APPLICATIONS,
  INITIAL_EARLY_WARNINGS,
  INITIAL_GAMIFICATION,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

// In-Memory Client-side Mock Store for static CDN hosting (Netlify, Vercel, GitHub Pages)
let mockUsers = [...INITIAL_USERS];
let mockCurrentUser = mockUsers.find(u => u.role === 'admin') || mockUsers[0];
let mockStudents = [...INITIAL_STUDENTS];
let mockFaculty = [...INITIAL_FACULTY];
let mockDepartments = [...INITIAL_DEPARTMENTS];
let mockCourses = [...INITIAL_COURSES];
let mockAttendanceSessions = [...INITIAL_ATTENDANCE_SESSIONS];
let mockAttendanceRecords = [...INITIAL_ATTENDANCE_RECORDS];
let mockCorrections = [...INITIAL_CORRECTIONS];
let mockExaminations = [...INITIAL_EXAMINATIONS];
let mockExamResults = [...INITIAL_EXAM_RESULTS];
let mockAssignments = [...INITIAL_ASSIGNMENTS];
let mockSubmissions = [...INITIAL_SUBMISSIONS];
let mockTimetable = [...INITIAL_TIMETABLE];
let mockFees = [...INITIAL_FEES];
let mockBooks = [...INITIAL_BOOKS];
let mockBorrows = [...INITIAL_BORROWS];
let mockDrives = [...INITIAL_DRIVES];
let mockApplications = [...INITIAL_APPLICATIONS];
let mockEarlyWarnings = [...INITIAL_EARLY_WARNINGS];
let mockGamification = { ...INITIAL_GAMIFICATION };
let mockNotifications = [...INITIAL_NOTIFICATIONS];
let mockAuditLogs = [...INITIAL_AUDIT_LOGS];

/**
 * Universal safe fetcher: Attempts to call backend Express API;
 * if backend is not present (static host like Netlify where /api/* returns index.html or 404),
 * transparently falls back to local client store with zero user friction.
 */
async function safeFetch<T>(url: string, options: RequestInit | undefined, fallback: () => T | Promise<T>): Promise<T> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (err) {
    // Backend API unreachable or running on static hosting
  }
  return fallback();
}

export const apiClient = {
  // Auth & Roles
  async getCurrentUser(): Promise<{ user: User; allRoles: User[] }> {
    return safeFetch('/api/auth/current-user', undefined, () => ({
      user: mockCurrentUser,
      allRoles: mockUsers
    }));
  },

  async switchRole(role: UserRole): Promise<{ success: boolean; user: User }> {
    return safeFetch('/api/auth/switch-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    }, () => {
      const found = mockUsers.find(u => u.role === role);
      if (found) {
        mockCurrentUser = found;
        return { success: true, user: mockCurrentUser };
      }
      return { success: true, user: mockCurrentUser };
    });
  },

  // Students
  async getStudents(params?: { department?: string; semester?: string | number; search?: string; status?: string }): Promise<{ students: Student[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.department) query.set('department', params.department);
    if (params?.semester) query.set('semester', String(params.semester));
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);

    return safeFetch(`/api/students?${query.toString()}`, undefined, () => {
      let filtered = [...mockStudents];
      if (params?.department && params.department !== 'all') {
        filtered = filtered.filter(s => s.department === params.department);
      }
      if (params?.semester && params.semester !== 'all') {
        filtered = filtered.filter(s => s.semester === Number(params.semester));
      }
      if (params?.status && params.status !== 'all') {
        filtered = filtered.filter(s => s.status === params.status);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(s => 
          s.name.toLowerCase().includes(q) || 
          s.studentId.toLowerCase().includes(q) || 
          s.email.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q)
        );
      }
      return { students: filtered, total: filtered.length };
    });
  },

  async createStudent(student: Partial<Student>): Promise<Student> {
    return safeFetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    }, () => {
      const nextNum = String(mockStudents.length + 1).padStart(3, '0');
      const studentId = student.studentId || `SC-2026-CS${nextNum}`;
      const newStudent: Student = {
        id: `stu-${Date.now()}`,
        studentId,
        name: student.name || 'New Scholar',
        email: student.email || `${studentId.toLowerCase()}@smartcampus.edu`,
        phone: student.phone || '+1 (555) 019-2831',
        department: student.department || 'Computer Science & AI',
        course: student.course || 'B.Tech in Artificial Intelligence',
        year: student.year || 3,
        semester: student.semester || 6,
        section: student.section || 'A',
        rollNo: student.rollNo || `23CS${nextNum}`,
        admissionDate: student.admissionDate || new Date().toISOString().substring(0, 10),
        guardian: student.guardian || {
          name: 'Guardian',
          phone: '+1 (555) 902-1823',
          email: 'guardian@example.com',
          relation: 'Parent'
        },
        address: student.address || 'A-402 Silicon Heights, Innovation Corridor',
        emergencyContact: student.emergencyContact || '+1 (555) 019-2831',
        status: student.status || 'active',
        cgpa: student.cgpa || 8.5,
        attendancePercentage: student.attendancePercentage || 92.0,
        feesStatus: student.feesStatus || 'paid',
        balanceDue: student.balanceDue ?? 0,
        avatar: student.avatar || 'SC',
        achievementsCount: student.achievementsCount || 0
      };
      mockStudents.unshift(newStudent);
      return newStudent;
    });
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    return safeFetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }, () => {
      const idx = mockStudents.findIndex(s => s.id === id);
      if (idx !== -1) {
        mockStudents[idx] = { ...mockStudents[idx], ...updates };
        return mockStudents[idx];
      }
      return mockStudents[0];
    });
  },

  async archiveStudent(id: string): Promise<{ success: boolean }> {
    return safeFetch(`/api/students/${id}`, { method: 'DELETE' }, () => {
      const student = mockStudents.find(s => s.id === id);
      if (student) {
        student.status = 'archived';
      }
      return { success: true };
    });
  },

  // Faculty & Departments
  async getFaculty(): Promise<{ faculty: Faculty[] }> {
    return safeFetch('/api/faculty', undefined, () => ({ faculty: mockFaculty }));
  },

  async getDepartments(): Promise<{ departments: Department[] }> {
    return safeFetch('/api/departments', undefined, () => ({ departments: mockDepartments }));
  },

  async getCourses(): Promise<{ courses: CourseSubject[] }> {
    return safeFetch('/api/courses', undefined, () => ({ courses: mockCourses }));
  },

  // Attendance
  async getAttendanceSessions(): Promise<{ sessions: AttendanceSession[] }> {
    return safeFetch('/api/attendance/sessions', undefined, () => ({ sessions: mockAttendanceSessions }));
  },

  async createAttendanceSession(data: { courseCode: string; courseName: string; timeSlot?: string; room?: string }): Promise<AttendanceSession> {
    return safeFetch('/api/attendance/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, () => {
      const token = `QR-${data.courseCode}-${Date.now().toString(36).toUpperCase()}`;
      const newSession: AttendanceSession = {
        id: `sess-${Date.now()}`,
        courseCode: data.courseCode,
        courseName: data.courseName,
        facultyId: 'FAC-CS-104',
        facultyName: 'Dr. Evelyn Reed',
        date: new Date().toISOString().substring(0, 10),
        timeSlot: data.timeSlot || '09:00 - 10:30 AM',
        room: data.room || 'Turing Hall 302',
        totalEnrolled: 64,
        presentCount: 0,
        qrToken: token,
        qrExpiry: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
        status: 'active'
      };
      mockAttendanceSessions.unshift(newSession);
      return newSession;
    });
  },

  async getAttendanceRecords(sessionId?: string, studentId?: string): Promise<{ records: AttendanceRecord[] }> {
    const query = new URLSearchParams();
    if (sessionId) query.set('sessionId', sessionId);
    if (studentId) query.set('studentId', studentId);
    return safeFetch(`/api/attendance/records?${query.toString()}`, undefined, () => {
      let records = [...mockAttendanceRecords];
      if (sessionId) records = records.filter(r => r.sessionId === sessionId);
      if (studentId) records = records.filter(r => r.studentId === studentId);
      return { records };
    });
  },

  async markAttendanceBatch(sessionId: string, records: Partial<AttendanceRecord>[]): Promise<{ success: boolean }> {
    return safeFetch('/api/attendance/mark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, records }),
    }, () => {
      records.forEach(rec => {
        const existingIdx = mockAttendanceRecords.findIndex(r => r.sessionId === sessionId && r.studentId === rec.studentId);
        const updatedRec: AttendanceRecord = {
          id: existingIdx >= 0 ? mockAttendanceRecords[existingIdx].id : `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          sessionId,
          studentId: rec.studentId || 'SC-2026-001',
          studentName: rec.studentName || 'Student',
          rollNo: rec.rollNo || '23CS001',
          status: (rec.status as any) || 'present',
          markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          verifiedMethod: 'manual',
          remarks: rec.remarks || ''
        };
        if (existingIdx >= 0) {
          mockAttendanceRecords[existingIdx] = updatedRec;
        } else {
          mockAttendanceRecords.push(updatedRec);
        }
      });
      const session = mockAttendanceSessions.find(s => s.id === sessionId);
      if (session) {
        session.presentCount = mockAttendanceRecords.filter(r => r.sessionId === sessionId && (r.status === 'present' || r.status === 'late')).length;
      }
      return { success: true };
    });
  },

  async verifyQrAttendance(qrToken: string, studentId: string): Promise<{ success: boolean; message: string; record?: AttendanceRecord }> {
    return safeFetch('/api/attendance/qr-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrToken, studentId }),
    }, () => {
      const session = mockAttendanceSessions.find(s => s.qrToken === qrToken) || mockAttendanceSessions[0];
      const student = mockStudents.find(s => s.studentId === studentId) || mockStudents[0];
      const already = mockAttendanceRecords.find(r => r.sessionId === session.id && r.studentId === student.studentId);
      if (already) {
        return { success: true, message: 'Attendance already recorded for this session.', record: already };
      }
      const newRec: AttendanceRecord = {
        id: `rec-${Date.now()}`,
        sessionId: session.id,
        studentId: student.studentId,
        studentName: student.name,
        rollNo: student.rollNo,
        status: 'present',
        markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        verifiedMethod: 'qr_scan',
        remarks: 'Verified via High-Resolution Scannable QR'
      };
      mockAttendanceRecords.push(newRec);
      session.presentCount += 1;
      return { success: true, message: `Attendance verified successfully for ${student.name}`, record: newRec };
    });
  },

  async getAttendanceCorrections(): Promise<{ corrections: AttendanceCorrection[] }> {
    return safeFetch('/api/attendance/corrections', undefined, () => ({ corrections: mockCorrections }));
  },

  async submitCorrection(data: { studentId: string; courseCode: string; sessionDate: string; reason: string; requestedStatus?: string }): Promise<AttendanceCorrection> {
    return safeFetch('/api/attendance/corrections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, () => {
      const student = mockStudents.find(s => s.studentId === data.studentId) || mockStudents[0];
      const newCorr: AttendanceCorrection = {
        id: `corr-${Date.now()}`,
        studentId: student.studentId,
        studentName: student.name,
        courseCode: data.courseCode,
        sessionDate: data.sessionDate,
        reason: data.reason,
        requestedStatus: (data.requestedStatus as any) || 'present',
        status: 'pending',
        submittedAt: new Date().toISOString().substring(0, 10)
      };
      mockCorrections.unshift(newCorr);
      return newCorr;
    });
  },

  async reviewCorrection(id: string, action: 'approved' | 'rejected', reviewerNote?: string): Promise<AttendanceCorrection> {
    return safeFetch(`/api/attendance/corrections/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reviewerNote }),
    }, () => {
      const corr = mockCorrections.find(c => c.id === id);
      if (corr) {
        corr.status = action;
        corr.reviewerNote = reviewerNote;
        return corr;
      }
      return mockCorrections[0];
    });
  },

  // Exams
  async getExams(): Promise<{ examinations: Examination[]; results: ExamResult[] }> {
    return safeFetch('/api/exams', undefined, () => ({ examinations: mockExaminations, results: mockExamResults }));
  },

  async createExam(exam: Partial<Examination>): Promise<Examination> {
    return safeFetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exam),
    }, () => {
      const newExam: Examination = {
        id: `exam-${Date.now()}`,
        code: exam.code || `EX-${Date.now().toString(36).toUpperCase()}`,
        title: exam.title || exam.courseName || 'Midterm Assessment',
        courseCode: exam.courseCode || 'CS601',
        courseName: exam.courseName || 'Advanced Neural Architectures',
        examDate: exam.examDate || '2026-11-10',
        time: exam.time || '10:00 AM - 01:00 PM',
        room: exam.room || 'Apex Central Hall A',
        maxMarks: exam.maxMarks || 100,
        passMarks: exam.passMarks || 40,
        semester: exam.semester || 6,
        weightagePercentage: exam.weightagePercentage || 30,
        status: 'scheduled'
      };
      mockExaminations.unshift(newExam);
      return newExam;
    });
  },

  // Assignments
  async getAssignments(): Promise<{ assignments: Assignment[]; submissions: Submission[] }> {
    return safeFetch('/api/assignments', undefined, () => ({ assignments: mockAssignments, submissions: mockSubmissions }));
  },

  async submitAssignment(data: { assignmentId: string; studentId: string; studentName: string; fileName: string }): Promise<Submission> {
    return safeFetch('/api/assignments/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, () => {
      const newSub: Submission = {
        id: `sub-${Date.now()}`,
        assignmentId: data.assignmentId,
        studentId: data.studentId,
        studentName: data.studentName,
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        fileName: data.fileName,
        status: 'on_time',
        feedback: 'Received and awaiting instructor evaluation'
      };
      mockSubmissions.unshift(newSub);
      return newSub;
    });
  },

  // Timetable
  async getTimetable(): Promise<{ timetable: TimetableSlot[] }> {
    return safeFetch('/api/timetables', undefined, () => ({ timetable: mockTimetable }));
  },

  // Fees
  async getFees(): Promise<{ fees: FeeRecord[] }> {
    return safeFetch('/api/fees', undefined, () => ({ fees: mockFees }));
  },

  async payFee(studentId: string, amount: number, method?: string): Promise<{ success: boolean; feeRecord: FeeRecord; transaction: any }> {
    return safeFetch('/api/fees/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, amount, method }),
    }, () => {
      let fee = mockFees.find(f => f.studentId === studentId);
      if (fee) {
        fee.paidAmount += amount;
        fee.balanceDue = Math.max(0, fee.balanceDue - amount);
        fee.status = fee.balanceDue === 0 ? 'paid' : 'partial';
      } else {
        fee = {
          id: `fee-${Date.now()}`,
          studentId,
          studentName: 'Scholar',
          department: 'Computer Science',
          semester: 6,
          academicYear: '2026-2027',
          totalFee: amount,
          paidAmount: amount,
          balanceDue: 0,
          dueDate: '2026-11-30',
          status: 'paid',
          transactions: []
        };
        mockFees.unshift(fee);
      }
      const transaction = {
        id: `txn-${Date.now()}`,
        transactionId: `TXN-${Date.now().toString(36).toUpperCase()}`,
        amount,
        date: new Date().toISOString().substring(0, 10),
        method: method || 'Instant Campus Card',
        receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
        verified: true
      };
      fee.transactions.unshift(transaction);

      return {
        success: true,
        feeRecord: fee,
        transaction
      };
    });
  },

  // Library
  async getLibrary(): Promise<{ books: Book[]; borrows: BorrowRecord[] }> {
    return safeFetch('/api/library', undefined, () => ({ books: mockBooks, borrows: mockBorrows }));
  },

  async issueBook(bookId: string, studentId: string, studentName: string): Promise<BorrowRecord> {
    return safeFetch('/api/library/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, studentId, studentName }),
    }, () => {
      const book = mockBooks.find(b => b.id === bookId);
      if (book && book.availableCopies > 0) {
        book.availableCopies -= 1;
      }
      const newBorrow: BorrowRecord = {
        id: `bor-${Date.now()}`,
        bookId,
        bookTitle: book?.title || 'Academic Manuscript',
        studentId,
        studentName,
        issueDate: new Date().toISOString().substring(0, 10),
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
        status: 'borrowed',
        fineAmount: 0
      };
      mockBorrows.unshift(newBorrow);
      return newBorrow;
    });
  },

  async returnBook(borrowId: string): Promise<{ success: boolean; borrow: BorrowRecord }> {
    return safeFetch('/api/library/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ borrowId }),
    }, () => {
      const borrow = mockBorrows.find(b => b.id === borrowId);
      if (borrow) {
        borrow.status = 'returned';
        borrow.returnDate = new Date().toISOString().substring(0, 10);
        const book = mockBooks.find(b => b.id === borrow.bookId);
        if (book) book.availableCopies += 1;
        return { success: true, borrow };
      }
      return { success: true, borrow: mockBorrows[0] };
    });
  },

  // Placements
  async getPlacements(): Promise<{ drives: PlacementDrive[]; applications: PlacementApplication[] }> {
    return safeFetch('/api/placements', undefined, () => ({ drives: mockDrives, applications: mockApplications }));
  },

  async applyPlacement(driveId: string, studentId: string, studentName: string, cgpa: number): Promise<PlacementApplication> {
    return safeFetch('/api/placements/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driveId, studentId, studentName, cgpa }),
    }, () => {
      const drive = mockDrives.find(d => d.id === driveId);
      const newApp: PlacementApplication = {
        id: `app-${Date.now()}`,
        driveId,
        companyName: drive?.companyName || 'Apex AI Labs',
        studentId,
        studentName,
        cgpa,
        status: 'applied',
        round: 'Round 1 Technical Screening'
      };
      mockApplications.unshift(newApp);
      return newApp;
    });
  },

  // Early Warning
  async getEarlyWarnings(): Promise<{ warnings: EarlyWarningFlag[] }> {
    return safeFetch('/api/early-warning', undefined, () => ({ warnings: mockEarlyWarnings }));
  },

  async updateWarningStatus(id: string, status: 'open' | 'under_review' | 'resolved', notes?: string): Promise<EarlyWarningFlag> {
    return safeFetch(`/api/early-warning/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    }, () => {
      const w = mockEarlyWarnings.find(item => item.id === id);
      if (w) {
        w.reviewStatus = status;
        if (notes) w.interventionNotes = notes;
        return w;
      }
      return mockEarlyWarnings[0];
    });
  },

  // Gamification
  async getGamification(): Promise<{ gamification: GamificationProfile }> {
    return safeFetch('/api/gamification', undefined, () => ({ gamification: mockGamification }));
  },

  async claimQuest(questId: string): Promise<{ success: boolean; gamification: GamificationProfile }> {
    return safeFetch('/api/gamification/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questId }),
    }, () => {
      const q = mockGamification.quests.find(item => item.id === questId);
      if (q && q.completed && !q.claimed) {
        q.claimed = true;
        mockGamification.xp += q.rewardXp;
        mockGamification.level = Math.floor(mockGamification.xp / 500) + 1;
      }
      return { success: true, gamification: mockGamification };
    });
  },

  // Notifications
  async getNotifications(): Promise<{ notifications: NotificationItem[] }> {
    return safeFetch('/api/notifications', undefined, () => ({ notifications: mockNotifications }));
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return safeFetch(`/api/notifications/${id}/read`, { method: 'POST' }, () => {
      const n = mockNotifications.find(item => item.id === id);
      if (n) n.read = true;
      return { success: true };
    });
  },

  async clearAllNotifications(): Promise<{ success: boolean }> {
    return safeFetch('/api/notifications/clear-all', { method: 'POST' }, () => {
      mockNotifications = [];
      return { success: true };
    });
  },

  // Audit Logs
  async getAuditLogs(): Promise<{ logs: AuditLog[] }> {
    return safeFetch('/api/audit-logs', undefined, () => ({ logs: mockAuditLogs }));
  },

  // AI Copilot
  async askCopilot(prompt: string, studentContext?: any): Promise<{ response: string }> {
    return safeFetch('/api/gemini/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, studentContext }),
    }, () => {
      const p = prompt.toLowerCase();
      if (p.includes('attendance') && (p.includes('policy') || p.includes('rule') || p.includes('75'))) {
        return {
          response: `### Official Campus Attendance & Condonation Policy\n\n- **Mandatory Threshold:** Every registered student must maintain a minimum of **75.0% aggregate attendance** in every lecture, tutorial, and laboratory course to be eligible for end-semester examinations.\n- **Condonation Window (65% – 74.9%):** Students facing genuine medical conditions or authorized university athletic/research deputation may petition for attendance condonation.\n- **Action Required:** Submit formal medical documentation or Dean clearance within 7 days via the *Attendance Corrections* workflow in your portal.`
        };
      } else if (p.includes('assignment') || p.includes('due') || p.includes('deadline')) {
        return {
          response: `### Upcoming Coursework Deadlines\n\n1. **Transformer Architecture Implementation (CS601):** Due October 28, 2026 (Weightage: 100 marks). Status: Submitted on October 21.\n2. **Raft Consensus Protocol Simulator (CS602):** Due November 02, 2026 (Weightage: 100 marks). Status: Pending submission.\n3. **Interactive 3D Campus Navigation (CS605):** Due November 15, 2026 (Weightage: 50 marks).`
        };
      } else if (p.includes('scholarship') || p.includes('fee') || p.includes('financial')) {
        return {
          response: `### Scholarships & Financial Aid Opportunities\n\n- **Dean's Merit Excellence Award:** Full tuition waiver for students with a cumulative CGPA >= 9.0 and zero disciplinary marks.\n- **STEM Diversity & Research Grant:** $2,500 stipend for student-led laboratory projects in AI, Robotics, and Quantum Systems.\n- **Payment Flexibility:** Installment payment plans can be activated directly through the *Fees & Financials* module with 0% penalty interest before the final due date.`
        };
      }
      return {
        response: `### SmartCampus 360 AI Analysis\n\nBased on your academic profile in **Computer Science & AI (6th Semester)**:\n\n- Your cumulative **CGPA is currently 8.92**, placing you in the top 5% of your cohort.\n- Your overall **attendance is 92.4%**, well clear of the 75% examination threshold.\n- You have **1 active interview round** with Anthropic & Google Cloud AI scheduled for November 12, 2026.\n\nFeel free to ask me to simulate examination outcomes, outline revision strategies, or explain campus grading rubrics!`
      };
    });
  }
};

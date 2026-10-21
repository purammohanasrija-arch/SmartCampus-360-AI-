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

export const apiClient = {
  // Auth & Roles
  async getCurrentUser(): Promise<{ user: User; allRoles: User[] }> {
    const res = await fetch('/api/auth/current-user');
    return res.json();
  },

  async switchRole(role: UserRole): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/switch-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    return res.json();
  },

  // Students
  async getStudents(params?: { department?: string; semester?: string | number; search?: string; status?: string }): Promise<{ students: Student[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.department) query.set('department', params.department);
    if (params?.semester) query.set('semester', String(params.semester));
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);

    const res = await fetch(`/api/students?${query.toString()}`);
    return res.json();
  },

  async createStudent(student: Partial<Student>): Promise<Student> {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    return res.json();
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async archiveStudent(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Faculty & Departments
  async getFaculty(): Promise<{ faculty: Faculty[] }> {
    const res = await fetch('/api/faculty');
    return res.json();
  },

  async getDepartments(): Promise<{ departments: Department[] }> {
    const res = await fetch('/api/departments');
    return res.json();
  },

  async getCourses(): Promise<{ courses: CourseSubject[] }> {
    const res = await fetch('/api/courses');
    return res.json();
  },

  // Attendance
  async getAttendanceSessions(): Promise<{ sessions: AttendanceSession[] }> {
    const res = await fetch('/api/attendance/sessions');
    return res.json();
  },

  async createAttendanceSession(data: { courseCode: string; courseName: string; timeSlot?: string; room?: string }): Promise<AttendanceSession> {
    const res = await fetch('/api/attendance/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getAttendanceRecords(sessionId?: string, studentId?: string): Promise<{ records: AttendanceRecord[] }> {
    const query = new URLSearchParams();
    if (sessionId) query.set('sessionId', sessionId);
    if (studentId) query.set('studentId', studentId);
    const res = await fetch(`/api/attendance/records?${query.toString()}`);
    return res.json();
  },

  async markAttendanceBatch(sessionId: string, records: Partial<AttendanceRecord>[]): Promise<{ success: boolean }> {
    const res = await fetch('/api/attendance/mark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, records }),
    });
    return res.json();
  },

  async verifyQrAttendance(qrToken: string, studentId: string): Promise<{ success: boolean; message: string; record?: AttendanceRecord }> {
    const res = await fetch('/api/attendance/qr-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrToken, studentId }),
    });
    return res.json();
  },

  async getAttendanceCorrections(): Promise<{ corrections: AttendanceCorrection[] }> {
    const res = await fetch('/api/attendance/corrections');
    return res.json();
  },

  async submitCorrection(data: { studentId: string; courseCode: string; sessionDate: string; reason: string; requestedStatus?: string }): Promise<AttendanceCorrection> {
    const res = await fetch('/api/attendance/corrections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async reviewCorrection(id: string, action: 'approved' | 'rejected', reviewerNote?: string): Promise<AttendanceCorrection> {
    const res = await fetch(`/api/attendance/corrections/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reviewerNote }),
    });
    return res.json();
  },

  // Exams
  async getExams(): Promise<{ examinations: Examination[]; results: ExamResult[] }> {
    const res = await fetch('/api/exams');
    return res.json();
  },

  async createExam(exam: Partial<Examination>): Promise<Examination> {
    const res = await fetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exam),
    });
    return res.json();
  },

  // Assignments
  async getAssignments(): Promise<{ assignments: Assignment[]; submissions: Submission[] }> {
    const res = await fetch('/api/assignments');
    return res.json();
  },

  async submitAssignment(data: { assignmentId: string; studentId: string; studentName: string; fileName: string }): Promise<Submission> {
    const res = await fetch('/api/assignments/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Timetable
  async getTimetable(): Promise<{ timetable: TimetableSlot[] }> {
    const res = await fetch('/api/timetables');
    return res.json();
  },

  // Fees
  async getFees(): Promise<{ fees: FeeRecord[] }> {
    const res = await fetch('/api/fees');
    return res.json();
  },

  async payFee(studentId: string, amount: number, method?: string): Promise<{ success: boolean; feeRecord: FeeRecord; transaction: any }> {
    const res = await fetch('/api/fees/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, amount, method }),
    });
    return res.json();
  },

  // Library
  async getLibrary(): Promise<{ books: Book[]; borrows: BorrowRecord[] }> {
    const res = await fetch('/api/library');
    return res.json();
  },

  async issueBook(bookId: string, studentId: string, studentName: string): Promise<BorrowRecord> {
    const res = await fetch('/api/library/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, studentId, studentName }),
    });
    return res.json();
  },

  async returnBook(borrowId: string): Promise<{ success: boolean; borrow: BorrowRecord }> {
    const res = await fetch('/api/library/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ borrowId }),
    });
    return res.json();
  },

  // Placements
  async getPlacements(): Promise<{ drives: PlacementDrive[]; applications: PlacementApplication[] }> {
    const res = await fetch('/api/placements');
    return res.json();
  },

  async applyPlacement(driveId: string, studentId: string, studentName: string, cgpa: number): Promise<PlacementApplication> {
    const res = await fetch('/api/placements/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driveId, studentId, studentName, cgpa }),
    });
    return res.json();
  },

  // Early Warning
  async getEarlyWarnings(): Promise<{ warnings: EarlyWarningFlag[] }> {
    const res = await fetch('/api/early-warning');
    return res.json();
  },

  async updateWarningStatus(id: string, status: 'open' | 'under_review' | 'resolved', notes?: string): Promise<EarlyWarningFlag> {
    const res = await fetch(`/api/early-warning/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    return res.json();
  },

  // Gamification
  async getGamification(): Promise<{ gamification: GamificationProfile }> {
    const res = await fetch('/api/gamification');
    return res.json();
  },

  async claimQuest(questId: string): Promise<{ success: boolean; gamification: GamificationProfile }> {
    const res = await fetch('/api/gamification/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questId }),
    });
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<{ notifications: NotificationItem[] }> {
    const res = await fetch('/api/notifications');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    return res.json();
  },

  async clearAllNotifications(): Promise<{ success: boolean }> {
    const res = await fetch('/api/notifications/clear-all', { method: 'POST' });
    return res.json();
  },

  // Audit Logs
  async getAuditLogs(): Promise<{ logs: AuditLog[] }> {
    const res = await fetch('/api/audit-logs');
    return res.json();
  },

  // AI Copilot
  async askCopilot(prompt: string, studentContext?: any): Promise<{ response: string }> {
    const res = await fetch('/api/gemini/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, studentContext }),
    });
    return res.json();
  }
};

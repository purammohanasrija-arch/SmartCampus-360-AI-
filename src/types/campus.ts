export type UserRole = 
  | 'superadmin' 
  | 'admin' 
  | 'faculty' 
  | 'student' 
  | 'parent' 
  | 'librarian' 
  | 'placement';

export type AcademicStatus = 'active' | 'probation' | 'graduated' | 'suspended' | 'archived';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  phone?: string;
  status: 'active' | 'inactive';
  studentId?: string;
  facultyId?: string;
  title?: string;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  course: string;
  year: number;
  semester: number;
  section: string;
  rollNo: string;
  admissionDate: string;
  guardian: {
    name: string;
    phone: string;
    email: string;
    relation: string;
  };
  address: string;
  emergencyContact: string;
  status: AcademicStatus;
  cgpa: number;
  attendancePercentage: number;
  feesStatus: 'paid' | 'partial' | 'pending' | 'overdue';
  balanceDue: number;
  avatar: string;
  achievementsCount: number;
}

export interface Faculty {
  id: string;
  facultyId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  coursesHandled: string[];
  workloadHours: number;
  officeHours: string;
  roomNo: string;
  avatar: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  headOfDepartment: string;
  studentCount: number;
  facultyCount: number;
  labsCount: number;
}

export interface CourseSubject {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  semester: number;
  facultyName: string;
  attendanceRate: number;
}

export interface AttendanceSession {
  id: string;
  courseCode: string;
  courseName: string;
  facultyId: string;
  facultyName: string;
  date: string;
  timeSlot: string;
  room: string;
  totalEnrolled: number;
  presentCount: number;
  qrToken?: string;
  qrExpiry?: string;
  status: 'active' | 'closed';
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  status: 'present' | 'absent' | 'late' | 'approved_leave';
  markedAt: string;
  verifiedMethod: 'qr_scan' | 'manual' | 'biometric';
  remarks?: string;
}

export interface AttendanceCorrection {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  sessionDate: string;
  requestedStatus: 'present' | 'approved_leave';
  reason: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewerNote?: string;
}

export interface Examination {
  id: string;
  code: string;
  title: string;
  courseCode: string;
  courseName: string;
  examDate: string;
  time: string;
  room: string;
  maxMarks: number;
  passMarks: number;
  semester: number;
  weightagePercentage: number;
  status: 'scheduled' | 'evaluating' | 'published';
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: string;
  gpaPoint: number;
  status: 'pass' | 'fail';
  remarks?: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  dueDate: string;
  maxMarks: number;
  instructions: string;
  rubrics: string;
  submissionsCount: number;
  totalStudents: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: 'on_time' | 'late' | 'graded' | 'resubmit_required';
  marksObtained?: number;
  feedback?: string;
  fileName?: string;
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  roomNo: string;
  section: string;
  semester: number;
  department: string;
}

export interface FeeTransaction {
  id: string;
  transactionId: string;
  amount: number;
  date: string;
  method: string;
  receiptNumber: string;
  verified: boolean;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  semester: number;
  academicYear: string;
  totalFee: number;
  paidAmount: number;
  balanceDue: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  transactions: FeeTransaction[];
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: 'borrowed' | 'returned' | 'overdue';
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  role: string;
  packageLPA: number;
  eligibilityMinCGPA: number;
  eligibleDepartments: string[];
  driveDate: string;
  applicationDeadline: string;
  openings: number;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface PlacementApplication {
  id: string;
  driveId: string;
  companyName: string;
  studentId: string;
  studentName: string;
  cgpa: number;
  status: 'applied' | 'shortlisted' | 'interview_scheduled' | 'selected' | 'rejected';
  interviewDate?: string;
  round?: string;
}

export interface EarlyWarningFlag {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  semester: number;
  riskLevel: 'critical' | 'warning' | 'low';
  factors: string[];
  attendance: number;
  recentAverage: number;
  recommendedAction: string;
  reviewStatus: 'open' | 'under_review' | 'resolved';
  assignedCounselor: string;
  flaggedDate: string;
  interventionNotes?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface Quest {
  id: string;
  title: string;
  rewardXp: number;
  progress: number;
  goal: number;
  completed: boolean;
  claimed: boolean;
}

export interface GamificationProfile {
  studentId: string;
  level: number;
  levelTitle: string;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  badges: Badge[];
  quests: Quest[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'academic' | 'attendance' | 'exam' | 'fee' | 'placement' | 'library' | 'system';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entity: string;
  details: string;
}

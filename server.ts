import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
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
} from './src/data/mockData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database Store for live operations
let users = [...INITIAL_USERS];
let currentUser = users.find(u => u.role === 'admin') || users[0];
let students = [...INITIAL_STUDENTS];
let faculty = [...INITIAL_FACULTY];
let departments = [...INITIAL_DEPARTMENTS];
let courses = [...INITIAL_COURSES];
let attendanceSessions = [...INITIAL_ATTENDANCE_SESSIONS];
let attendanceRecords = [...INITIAL_ATTENDANCE_RECORDS];
let corrections = [...INITIAL_CORRECTIONS];
let examinations = [...INITIAL_EXAMINATIONS];
let examResults = [...INITIAL_EXAM_RESULTS];
let assignments = [...INITIAL_ASSIGNMENTS];
let submissions = [...INITIAL_SUBMISSIONS];
let timetable = [...INITIAL_TIMETABLE];
let fees = [...INITIAL_FEES];
let books = [...INITIAL_BOOKS];
let borrows = [...INITIAL_BORROWS];
let drives = [...INITIAL_DRIVES];
let applications = [...INITIAL_APPLICATIONS];
let earlyWarnings = [...INITIAL_EARLY_WARNINGS];
let gamification = { ...INITIAL_GAMIFICATION };
let notifications = [...INITIAL_NOTIFICATIONS];
let auditLogs = [...INITIAL_AUDIT_LOGS];

// Gemini Client initialization on the server
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Helper for audit logging
function logAction(actorName: string, actorRole: any, action: string, entity: string, details: string) {
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    actorName,
    actorRole,
    action,
    entity,
    details
  };
  auditLogs.unshift(newLog);
  if (auditLogs.length > 50) auditLogs.pop();
}

// ---------------- API ROUTES ----------------

// Current User & Role Switcher
app.get('/api/auth/current-user', (req: Request, res: Response) => {
  res.json({ user: currentUser, allRoles: users });
});

app.post('/api/auth/switch-role', (req: Request, res: Response) => {
  const { role } = req.body;
  const found = users.find(u => u.role === role);
  if (found) {
    currentUser = found;
    logAction(currentUser.name, currentUser.role, 'ROLE_SWITCHED', 'User Session', `Switched active portal to ${role}`);
    return res.json({ success: true, user: currentUser });
  }
  res.status(404).json({ error: 'Role not found' });
});

// Students API
app.get('/api/students', (req: Request, res: Response) => {
  const { department, semester, search, status } = req.query;
  let filtered = [...students];

  if (department && department !== 'all') {
    filtered = filtered.filter(s => s.department === department);
  }
  if (semester && semester !== 'all') {
    filtered = filtered.filter(s => s.semester === Number(semester));
  }
  if (status && status !== 'all') {
    filtered = filtered.filter(s => s.status === status);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.studentId.toLowerCase().includes(q) || 
      s.email.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q)
    );
  }

  res.json({ students: filtered, total: filtered.length });
});

app.post('/api/students', (req: Request, res: Response) => {
  const studentData = req.body;
  const nextNum = String(students.length + 1).padStart(3, '0');
  const studentId = studentData.studentId || `SC-2026-CS${nextNum}`;
  
  const newStudent = {
    ...studentData,
    id: `stu-${Date.now()}`,
    studentId,
    status: studentData.status || 'active',
    cgpa: studentData.cgpa || 7.5,
    attendancePercentage: studentData.attendancePercentage || 85.0,
    feesStatus: studentData.feesStatus || 'pending',
    balanceDue: studentData.balanceDue ?? 6500,
    avatar: studentData.avatar || studentData.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
    achievementsCount: 0,
    admissionDate: studentData.admissionDate || new Date().toISOString().substring(0, 10)
  };

  students.unshift(newStudent);
  logAction(currentUser.name, currentUser.role, 'STUDENT_CREATED', newStudent.name, `Added student ID ${newStudent.studentId}`);
  res.status(201).json(newStudent);
});

app.put('/api/students/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Student not found' });

  students[idx] = { ...students[idx], ...req.body };
  logAction(currentUser.name, currentUser.role, 'STUDENT_UPDATED', students[idx].name, `Updated student record`);
  res.json(students[idx]);
});

app.delete('/api/students/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const student = students.find(s => s.id === id);
  if (student) {
    student.status = 'archived';
    logAction(currentUser.name, currentUser.role, 'STUDENT_ARCHIVED', student.name, `Archived student ${student.studentId}`);
    return res.json({ success: true, student });
  }
  res.status(404).json({ error: 'Student not found' });
});

// Faculty API
app.get('/api/faculty', (req: Request, res: Response) => {
  res.json({ faculty });
});

// Departments & Courses API
app.get('/api/departments', (req: Request, res: Response) => {
  res.json({ departments });
});

app.get('/api/courses', (req: Request, res: Response) => {
  res.json({ courses });
});

// Attendance API
app.get('/api/attendance/sessions', (req: Request, res: Response) => {
  res.json({ sessions: attendanceSessions });
});

app.post('/api/attendance/sessions', (req: Request, res: Response) => {
  const { courseCode, courseName, timeSlot, room } = req.body;
  const token = `QR-${courseCode}-${Date.now().toString(36).toUpperCase()}`;
  const expiry = new Date(Date.now() + 90 * 60 * 1000).toISOString();

  const newSession = {
    id: `sess-${Date.now()}`,
    courseCode,
    courseName,
    facultyId: currentUser.facultyId || 'FAC-CS-104',
    facultyName: currentUser.name,
    date: new Date().toISOString().substring(0, 10),
    timeSlot: timeSlot || '09:00 - 10:30 AM',
    room: room || 'Turing Hall 302',
    totalEnrolled: 64,
    presentCount: 0,
    qrToken: token,
    qrExpiry: expiry,
    status: 'active' as const
  };

  attendanceSessions.unshift(newSession);
  logAction(currentUser.name, currentUser.role, 'ATTENDANCE_SESSION_CREATED', courseCode, `Generated QR session ${token}`);
  res.status(201).json(newSession);
});

app.get('/api/attendance/records', (req: Request, res: Response) => {
  const { sessionId, studentId } = req.query;
  let records = [...attendanceRecords];
  if (sessionId) records = records.filter(r => r.sessionId === sessionId);
  if (studentId) records = records.filter(r => r.studentId === studentId);
  res.json({ records });
});

app.post('/api/attendance/mark', (req: Request, res: Response) => {
  const { sessionId, records } = req.body;
  const session = attendanceSessions.find(s => s.id === sessionId);
  
  if (Array.isArray(records)) {
    records.forEach(rec => {
      const existingIdx = attendanceRecords.findIndex(r => r.sessionId === sessionId && r.studentId === rec.studentId);
      const updatedRec = {
        id: existingIdx >= 0 ? attendanceRecords[existingIdx].id : `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        sessionId,
        studentId: rec.studentId,
        studentName: rec.studentName,
        rollNo: rec.rollNo,
        status: rec.status,
        markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        verifiedMethod: 'manual' as const,
        remarks: rec.remarks || ''
      };
      if (existingIdx >= 0) {
        attendanceRecords[existingIdx] = updatedRec;
      } else {
        attendanceRecords.push(updatedRec);
      }
    });

    if (session) {
      session.presentCount = attendanceRecords.filter(r => r.sessionId === sessionId && (r.status === 'present' || r.status === 'late')).length;
    }

    logAction(currentUser.name, currentUser.role, 'ATTENDANCE_BATCH_MARKED', session?.courseCode || 'Class', `Updated ${records.length} records`);
  }

  res.json({ success: true });
});

app.post('/api/attendance/qr-verify', (req: Request, res: Response) => {
  const { qrToken, studentId } = req.body;
  const session = attendanceSessions.find(s => s.qrToken === qrToken);

  if (!session) {
    return res.status(400).json({ success: false, message: 'Invalid or unrecognized QR token.' });
  }

  if (session.status !== 'active' || (session.qrExpiry && new Date(session.qrExpiry) < new Date())) {
    return res.status(400).json({ success: false, message: 'This QR attendance session has expired.' });
  }

  const student = students.find(s => s.studentId === studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student ID not recognized in registry.' });
  }

  const alreadyMarked = attendanceRecords.find(r => r.sessionId === session.id && r.studentId === studentId);
  if (alreadyMarked) {
    return res.json({ success: true, message: 'Attendance already recorded for this session.', record: alreadyMarked });
  }

  const newRec = {
    id: `rec-${Date.now()}`,
    sessionId: session.id,
    studentId: student.studentId,
    studentName: student.name,
    rollNo: student.rollNo,
    status: 'present' as const,
    markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    verifiedMethod: 'qr_scan' as const
  };

  attendanceRecords.push(newRec);
  session.presentCount += 1;
  logAction(student.name, 'student', 'QR_ATTENDANCE_VERIFIED', session.courseCode, `Verified presence in ${session.room}`);

  res.json({ success: true, message: `Attendance verified successfully for ${session.courseName}!`, record: newRec });
});

// Attendance Corrections
app.get('/api/attendance/corrections', (req: Request, res: Response) => {
  res.json({ corrections });
});

app.post('/api/attendance/corrections', (req: Request, res: Response) => {
  const { studentId, courseCode, sessionDate, requestedStatus, reason } = req.body;
  const student = students.find(s => s.studentId === studentId) || students[0];

  const newCorrection = {
    id: `corr-${Date.now()}`,
    studentId: student.studentId,
    studentName: student.name,
    courseCode,
    sessionDate,
    requestedStatus: requestedStatus || 'approved_leave',
    reason,
    submittedAt: new Date().toLocaleString(),
    status: 'pending' as const
  };

  corrections.unshift(newCorrection);
  logAction(student.name, 'student', 'ATTENDANCE_CORRECTION_REQUESTED', courseCode, `Reason: ${reason.substring(0, 40)}...`);
  res.status(201).json(newCorrection);
});

app.post('/api/attendance/corrections/:id/action', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, reviewerNote } = req.body; // 'approved' | 'rejected'
  const corr = corrections.find(c => c.id === id);
  if (!corr) return res.status(404).json({ error: 'Correction request not found' });

  corr.status = action;
  corr.reviewerNote = reviewerNote || '';
  logAction(currentUser.name, currentUser.role, `CORRECTION_${action.toUpperCase()}`, corr.courseCode, `Action by faculty on ${corr.studentName}'s request`);
  res.json(corr);
});

// Examinations & Results
app.get('/api/exams', (req: Request, res: Response) => {
  res.json({ examinations, results: examResults });
});

app.post('/api/exams', (req: Request, res: Response) => {
  const examData = req.body;
  const newExam = {
    ...examData,
    id: `exam-${Date.now()}`,
    code: `EX-2026-${examData.courseCode}-${Date.now().toString().slice(-3)}`,
    status: examData.status || 'scheduled'
  };
  examinations.unshift(newExam);
  logAction(currentUser.name, currentUser.role, 'EXAM_CREATED', newExam.title, `Scheduled on ${newExam.examDate}`);
  res.status(201).json(newExam);
});

// Assignments & Submissions
app.get('/api/assignments', (req: Request, res: Response) => {
  res.json({ assignments, submissions });
});

app.post('/api/assignments', (req: Request, res: Response) => {
  const data = req.body;
  const newAssign = {
    ...data,
    id: `assign-${Date.now()}`,
    submissionsCount: 0,
    totalStudents: 64
  };
  assignments.unshift(newAssign);
  logAction(currentUser.name, currentUser.role, 'ASSIGNMENT_CREATED', newAssign.title, `Due ${newAssign.dueDate}`);
  res.status(201).json(newAssign);
});

app.post('/api/assignments/submit', (req: Request, res: Response) => {
  const { assignmentId, studentId, studentName, fileName } = req.body;
  const newSub = {
    id: `sub-${Date.now()}`,
    assignmentId,
    studentId,
    studentName,
    submittedAt: new Date().toLocaleString(),
    status: 'on_time' as const,
    fileName: fileName || 'submission_solution.py'
  };
  submissions.unshift(newSub);
  const assign = assignments.find(a => a.id === assignmentId);
  if (assign) assign.submissionsCount += 1;
  logAction(studentName, 'student', 'ASSIGNMENT_SUBMITTED', assign?.title || 'Assignment', `Submitted file ${newSub.fileName}`);
  res.status(201).json(newSub);
});

// Timetable
app.get('/api/timetables', (req: Request, res: Response) => {
  res.json({ timetable });
});

// Fees & Finance
app.get('/api/fees', (req: Request, res: Response) => {
  res.json({ fees });
});

app.post('/api/fees/pay', (req: Request, res: Response) => {
  const { studentId, amount, method } = req.body;
  const feeRec = fees.find(f => f.studentId === studentId);
  if (!feeRec) return res.status(404).json({ error: 'Fee record not found' });

  const payAmt = Number(amount);
  feeRec.paidAmount += payAmt;
  feeRec.balanceDue = Math.max(0, feeRec.totalFee - feeRec.paidAmount);
  feeRec.status = feeRec.balanceDue === 0 ? 'paid' : 'partial';

  const newTx = {
    id: `tx-${Date.now()}`,
    transactionId: `TXN-${Math.floor(1000 + Math.random() * 9000)}-CAMPUS`,
    amount: payAmt,
    date: new Date().toISOString().substring(0, 10),
    method: method || 'Instant Campus Wire',
    receiptNumber: `RCPT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    verified: true
  };
  feeRec.transactions.unshift(newTx);
  logAction(feeRec.studentName, currentUser.role, 'FEE_PAYMENT_VERIFIED', `$${payAmt}`, `Verified receipt ${newTx.receiptNumber}`);
  res.json({ success: true, feeRecord: feeRec, transaction: newTx });
});

// Library
app.get('/api/library', (req: Request, res: Response) => {
  res.json({ books, borrows });
});

app.post('/api/library/issue', (req: Request, res: Response) => {
  const { bookId, studentId, studentName } = req.body;
  const book = books.find(b => b.id === bookId);
  if (!book || book.availableCopies <= 0) {
    return res.status(400).json({ error: 'Book unavailable for issue.' });
  }

  book.availableCopies -= 1;
  const issueDate = new Date().toISOString().substring(0, 10);
  const due = new Date();
  due.setDate(due.getDate() + 21);
  const dueDate = due.toISOString().substring(0, 10);

  const newBorrow = {
    id: `bor-${Date.now()}`,
    bookId: book.id,
    bookTitle: book.title,
    studentId,
    studentName,
    issueDate,
    dueDate,
    fineAmount: 0,
    status: 'borrowed' as const
  };

  borrows.unshift(newBorrow);
  logAction(currentUser.name, currentUser.role, 'BOOK_ISSUED', book.title, `Issued to ${studentName}`);
  res.status(201).json(newBorrow);
});

app.post('/api/library/return', (req: Request, res: Response) => {
  const { borrowId } = req.params;
  const borrow = borrows.find(b => b.id === borrowId || b.id === req.body.borrowId);
  if (!borrow) return res.status(404).json({ error: 'Borrow record not found' });

  borrow.status = 'returned';
  borrow.returnDate = new Date().toISOString().substring(0, 10);

  const book = books.find(b => b.id === borrow.bookId);
  if (book) book.availableCopies += 1;

  logAction(currentUser.name, currentUser.role, 'BOOK_RETURNED', borrow.bookTitle, `Returned by ${borrow.studentName}`);
  res.json({ success: true, borrow });
});

// Placement Drives
app.get('/api/placements', (req: Request, res: Response) => {
  res.json({ drives, applications });
});

app.post('/api/placements/apply', (req: Request, res: Response) => {
  const { driveId, studentId, studentName, cgpa } = req.body;
  const drive = drives.find(d => d.id === driveId);
  if (!drive) return res.status(404).json({ error: 'Placement drive not found' });

  if (cgpa < drive.eligibilityMinCGPA) {
    return res.status(400).json({ error: `CGPA requirement not met (minimum ${drive.eligibilityMinCGPA} required, current: ${cgpa}).` });
  }

  const existing = applications.find(a => a.driveId === driveId && a.studentId === studentId);
  if (existing) {
    return res.status(400).json({ error: 'You have already applied for this company drive.' });
  }

  const newApp = {
    id: `app-${Date.now()}`,
    driveId,
    companyName: drive.companyName,
    studentId,
    studentName,
    cgpa,
    status: 'applied' as const
  };

  applications.unshift(newApp);
  logAction(studentName, 'student', 'PLACEMENT_APPLIED', drive.companyName, `Role: ${drive.role}`);
  res.status(201).json(newApp);
});

// Early Warning
app.get(['/api/early-warning', '/api/early-warnings'], (req: Request, res: Response) => {
  res.json({ warnings: earlyWarnings });
});

app.post('/api/early-warning/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const warning = earlyWarnings.find(w => w.id === id);
  if (!warning) return res.status(404).json({ error: 'Early warning record not found' });

  warning.reviewStatus = status;
  if (notes) warning.interventionNotes = notes;
  logAction(currentUser.name, currentUser.role, `WARNING_STATUS_${status.toUpperCase()}`, warning.studentName, `Counselor notes updated`);
  res.json(warning);
});

// Gamification
app.get('/api/gamification', (req: Request, res: Response) => {
  res.json({ gamification });
});

app.post('/api/gamification/claim', (req: Request, res: Response) => {
  const { questId } = req.body;
  const quest = gamification.quests.find(q => q.id === questId);
  if (!quest) return res.status(404).json({ error: 'Quest not found' });

  if (!quest.completed || quest.claimed) {
    return res.status(400).json({ error: 'Quest cannot be claimed at this time.' });
  }

  quest.claimed = true;
  gamification.xp += quest.rewardXp;
  if (gamification.xp >= gamification.nextLevelXp) {
    gamification.level += 1;
    gamification.nextLevelXp += 1000;
    gamification.levelTitle = `Level ${gamification.level} Senior Academic Vanguard`;
  }

  logAction(currentUser.name, 'student', 'QUEST_REWARD_CLAIMED', quest.title, `Awarded +${quest.rewardXp} XP`);
  res.json({ success: true, gamification });
});

// Notifications
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json({ notifications });
});

app.post('/api/notifications/:id/read', (req: Request, res: Response) => {
  const { id } = req.params;
  const notif = notifications.find(n => n.id === id);
  if (notif) notif.read = true;
  res.json({ success: true });
});

app.post('/api/notifications/clear-all', (req: Request, res: Response) => {
  notifications = [];
  res.json({ success: true });
});

// Audit Logs
app.get('/api/audit-logs', (req: Request, res: Response) => {
  res.json({ logs: auditLogs });
});

// AI Campus Copilot endpoint
app.post('/api/gemini/copilot', async (req: Request, res: Response) => {
  const { prompt, studentContext } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const contextInfo = studentContext ? `
Current Student Context:
- Name: ${studentContext.name || 'Aria Chen'}
- ID: ${studentContext.studentId || 'SC-2026-CS042'}
- Department: ${studentContext.department || 'Computer Science & AI'}
- Current CGPA: ${studentContext.cgpa || 8.92}
- Overall Attendance: ${studentContext.attendancePercentage || 92.4}%
- Active Courses: CS601 Deep Neural Systems, CS602 Distributed Systems, CS603 Cybersecurity, CS604 Database Engineering
- University Regulations: Minimum 75% attendance mandatory for exam eligibility; Condonation available between 65%-74.9% upon Dean approval for medical grounds.
` : '';

  // Check if Gemini API client is available
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are the official SmartCampus 360 AI Copilot, a helpful, precise academic and institutional assistant for students, faculty, and administrators. 
Use clear formatting with concise bullet points where appropriate. Always adhere to institutional policies and provide constructive, encouraging advice.
${contextInfo}`,
        },
      });

      return res.json({ response: response.text });
    } catch (err: any) {
      console.error('Gemini API call failed, using intelligent campus fallback:', err.message);
      // Fallback intelligently to campus knowledge base below
    }
  }

  // Built-in intelligent campus knowledge engine fallback
  const p = prompt.toLowerCase();
  let fallbackReply = '';

  if (p.includes('attendance') && (p.includes('policy') || p.includes('rule') || p.includes('75'))) {
    fallbackReply = `### Official Campus Attendance & Condonation Policy\n\n- **Mandatory Threshold:** Every registered student must maintain a minimum of **75.0% aggregate attendance** in every lecture, tutorial, and laboratory course to be eligible for end-semester examinations.\n- **Condonation Window (65% – 74.9%):** Students facing genuine medical conditions or authorized university athletic/research deputation may petition for attendance condonation.\n- **Action Required:** Submit formal medical documentation or Dean clearance within 7 days via the *Attendance Corrections* workflow in your portal.`;
  } else if (p.includes('assignment') || p.includes('due') || p.includes('deadline')) {
    fallbackReply = `### Upcoming Coursework Deadlines\n\n1. **Transformer Architecture Implementation (CS601):** Due October 28, 2026 (Weightage: 100 marks). Status: Submitted on October 21.\n2. **Raft Consensus Protocol Simulator (CS602):** Due November 02, 2026 (Weightage: 100 marks). Status: Pending submission.\n3. **Interactive 3D Campus Navigation (CS605):** Due November 15, 2026 (Weightage: 50 marks).`;
  } else if (p.includes('scholarship') || p.includes('fee') || p.includes('financial')) {
    fallbackReply = `### Scholarships & Financial Aid Opportunities\n\n- **Dean's Merit Excellence Award:** Full tuition waiver for students with a cumulative CGPA >= 9.0 and zero disciplinary marks.\n- **STEM Diversity & Research Grant:** $2,500 stipend for student-led laboratory projects in AI, Robotics, and Quantum Systems.\n- **Payment Flexibility:** Installment payment plans can be activated directly through the *Fees & Financials* module with 0% penalty interest before the final due date.`;
  } else if (p.includes('revision') || p.includes('plan') || p.includes('exam') || p.includes('study')) {
    fallbackReply = `### High-Yield 2-Week Midterm Revision Blueprint\n\n- **Week 1 (Theory & Core Proofs):** Focus on Transformer self-attention complexity derivations, distributed consensus invariant proofs (Raft/Paxos), and query planner execution trees.\n- **Week 2 (Hands-on & Past Papers):** Complete 3 timed mock assessments from the Alexandria Digital Library archive.\n- **Recommended Tool:** Use the *Academic What-If Simulation Lab* in your sidebar to simulate target scores and examine the exact impact on your cumulative CGPA!`;
  } else {
    fallbackReply = `### SmartCampus 360 AI Analysis\n\nBased on your academic profile in **Computer Science & AI (6th Semester)**:\n\n- Your cumulative **CGPA is currently 8.92**, placing you in the top 5% of your cohort.\n- Your overall **attendance is 92.4%**, well clear of the 75% examination threshold.\n- You have **1 active interview round** with Anthropic & Google Cloud AI scheduled for November 12, 2026.\n\nFeel free to ask me to simulate examination outcomes, outline revision strategies, or explain campus grading rubrics!`;
  }

  res.json({ response: fallbackReply });
});

// Setup Vite or static serving
async function startServer() {
  app.get('/preview', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'preview.html'));
  });
  app.get('/cover', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'preview.html'));
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartCampus 360 AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

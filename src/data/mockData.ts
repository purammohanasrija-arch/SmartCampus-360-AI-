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
  AuditLog 
} from '../types/campus';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-superadmin',
    name: 'Elena Vance',
    email: 'elena.vance@smartcampus.edu',
    role: 'superadmin',
    avatar: 'EV',
    department: 'University Administration',
    phone: '+1 (555) 234-5678',
    status: 'active',
    title: 'Chancellor & Chief Technology Officer'
  },
  {
    id: 'user-admin',
    name: 'Dr. Arthur Thorne',
    email: 'arthur.thorne@smartcampus.edu',
    role: 'admin',
    avatar: 'AT',
    department: 'Dean of Academic Affairs',
    phone: '+1 (555) 345-6789',
    status: 'active',
    title: 'Dean of Academic Affairs'
  },
  {
    id: 'user-faculty',
    name: 'Prof. Maya Patel',
    email: 'maya.patel@smartcampus.edu',
    role: 'faculty',
    avatar: 'MP',
    department: 'Computer Science & AI',
    phone: '+1 (555) 456-7890',
    status: 'active',
    facultyId: 'FAC-CS-104',
    title: 'Associate Professor & AI Lab Director'
  },
  {
    id: 'user-student',
    name: 'Aria Chen',
    email: 'aria.chen@student.smartcampus.edu',
    role: 'student',
    avatar: 'AC',
    department: 'Computer Science & AI',
    phone: '+1 (555) 567-8901',
    status: 'active',
    studentId: 'SC-2026-CS042',
    title: 'B.Tech CS 3rd Year · Class Representative'
  },
  {
    id: 'user-parent',
    name: 'David Chen',
    email: 'david.chen@guardian.org',
    role: 'parent',
    avatar: 'DC',
    department: 'Guardian Portal',
    phone: '+1 (555) 678-9012',
    status: 'active',
    studentId: 'SC-2026-CS042',
    title: 'Guardian to Aria Chen (SC-2026-CS042)'
  },
  {
    id: 'user-librarian',
    name: 'Marcus Vance',
    email: 'marcus.library@smartcampus.edu',
    role: 'librarian',
    avatar: 'MV',
    department: 'Alexandria Digital Library',
    phone: '+1 (555) 789-0123',
    status: 'active',
    title: 'Head of Digital Information Services'
  },
  {
    id: 'user-placement',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@smartcampus.edu',
    role: 'placement',
    avatar: 'SJ',
    department: 'Career & Industry Relations',
    phone: '+1 (555) 890-1234',
    status: 'active',
    title: 'Chief Placement & Corporate Liaison'
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    code: 'CSE',
    name: 'Computer Science & Artificial Intelligence',
    headOfDepartment: 'Dr. Raymond Holt',
    studentCount: 420,
    facultyCount: 28,
    labsCount: 6
  },
  {
    id: 'dept-2',
    code: 'ECE',
    name: 'Electronics & Quantum Communications',
    headOfDepartment: 'Dr. Evelyn Reed',
    studentCount: 310,
    facultyCount: 22,
    labsCount: 5
  },
  {
    id: 'dept-3',
    code: 'MECH',
    name: 'Mechanical & Autonomous Robotics',
    headOfDepartment: 'Prof. Julian Cruz',
    studentCount: 290,
    facultyCount: 19,
    labsCount: 7
  },
  {
    id: 'dept-4',
    code: 'BIO',
    name: 'Biotechnology & Computational Genomics',
    headOfDepartment: 'Dr. Sunita Rao',
    studentCount: 180,
    facultyCount: 14,
    labsCount: 4
  },
  {
    id: 'dept-5',
    code: 'MGMT',
    name: 'School of Technology Management',
    headOfDepartment: 'Prof. Katherine Hayes',
    studentCount: 240,
    facultyCount: 16,
    labsCount: 3
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    studentId: 'SC-2026-CS042',
    name: 'Aria Chen',
    email: 'aria.chen@student.smartcampus.edu',
    phone: '+1 (555) 567-8901',
    department: 'Computer Science & AI',
    course: 'B.Tech Computer Science',
    year: 3,
    semester: 6,
    section: 'A',
    rollNo: '23CS042',
    admissionDate: '2023-08-15',
    guardian: {
      name: 'David Chen',
      phone: '+1 (555) 678-9012',
      email: 'david.chen@guardian.org',
      relation: 'Father'
    },
    address: '422 University Avenue, Cambridge Campus',
    emergencyContact: '+1 (555) 678-9012',
    status: 'active',
    cgpa: 8.92,
    attendancePercentage: 92.4,
    feesStatus: 'paid',
    balanceDue: 0,
    avatar: 'AC',
    achievementsCount: 9
  },
  {
    id: 'stu-2',
    studentId: 'SC-2026-CS018',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@student.smartcampus.edu',
    phone: '+1 (555) 123-4567',
    department: 'Computer Science & AI',
    course: 'B.Tech Computer Science',
    year: 3,
    semester: 6,
    section: 'A',
    rollNo: '23CS018',
    admissionDate: '2023-08-15',
    guardian: {
      name: 'Sanjay Sharma',
      phone: '+1 (555) 234-5678',
      email: 'sanjay.sharma@email.com',
      relation: 'Father'
    },
    address: '88 Tech Boulevard, Silicon Court',
    emergencyContact: '+1 (555) 234-5678',
    status: 'active',
    cgpa: 7.15,
    attendancePercentage: 68.2, // Under 75% -> early warning alert
    feesStatus: 'partial',
    balanceDue: 1200,
    avatar: 'RS',
    achievementsCount: 4
  },
  {
    id: 'stu-3',
    studentId: 'SC-2026-CS091',
    name: 'Zoe Nakamura',
    email: 'zoe.nakamura@student.smartcampus.edu',
    phone: '+1 (555) 345-6780',
    department: 'Computer Science & AI',
    course: 'B.Tech Computer Science',
    year: 3,
    semester: 6,
    section: 'B',
    rollNo: '23CS091',
    admissionDate: '2023-08-15',
    guardian: {
      name: 'Kenji Nakamura',
      phone: '+1 (555) 456-7891',
      email: 'kenji.nakamura@email.com',
      relation: 'Father'
    },
    address: '15 Sakura Lane, East Residence',
    emergencyContact: '+1 (555) 456-7891',
    status: 'active',
    cgpa: 9.65,
    attendancePercentage: 96.8,
    feesStatus: 'paid',
    balanceDue: 0,
    avatar: 'ZN',
    achievementsCount: 14
  },
  {
    id: 'stu-4',
    studentId: 'SC-2026-EC012',
    name: 'Mateo Hernandez',
    email: 'mateo.hernandez@student.smartcampus.edu',
    phone: '+1 (555) 678-1234',
    department: 'Electronics & Quantum Communications',
    course: 'B.Tech Electronics & Comm',
    year: 2,
    semester: 4,
    section: 'A',
    rollNo: '24EC012',
    admissionDate: '2024-08-10',
    guardian: {
      name: 'Maria Hernandez',
      phone: '+1 (555) 789-2345',
      email: 'maria.hernandez@email.com',
      relation: 'Mother'
    },
    address: '304 Pioneer Drive, North Quad',
    emergencyContact: '+1 (555) 789-2345',
    status: 'active',
    cgpa: 8.34,
    attendancePercentage: 88.5,
    feesStatus: 'paid',
    balanceDue: 0,
    avatar: 'MH',
    achievementsCount: 6
  },
  {
    id: 'stu-5',
    studentId: 'SC-2026-ME005',
    name: 'Liam Gallagher',
    email: 'liam.gallagher@student.smartcampus.edu',
    phone: '+1 (555) 890-3456',
    department: 'Mechanical & Autonomous Robotics',
    course: 'B.Tech Mechanical Engineering',
    year: 4,
    semester: 8,
    section: 'A',
    rollNo: '22ME005',
    admissionDate: '2022-08-20',
    guardian: {
      name: 'Patrick Gallagher',
      phone: '+1 (555) 901-4567',
      email: 'patrick.gallagher@email.com',
      relation: 'Father'
    },
    address: '12 Dynamo Way, South Gate',
    emergencyContact: '+1 (555) 901-4567',
    status: 'active',
    cgpa: 6.84,
    attendancePercentage: 62.0, // Early warning alert
    feesStatus: 'overdue',
    balanceDue: 2400,
    avatar: 'LG',
    achievementsCount: 3
  },
  {
    id: 'stu-6',
    studentId: 'SC-2026-BI024',
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@student.smartcampus.edu',
    phone: '+1 (555) 234-7890',
    department: 'Biotechnology & Computational Genomics',
    course: 'B.Tech Biotechnology',
    year: 3,
    semester: 6,
    section: 'A',
    rollNo: '23BI024',
    admissionDate: '2023-08-15',
    guardian: {
      name: 'Pradeep Deshmukh',
      phone: '+1 (555) 345-8901',
      email: 'pradeep.deshmukh@email.com',
      relation: 'Father'
    },
    address: '77 Helix Court, Science Quarter',
    emergencyContact: '+1 (555) 345-8901',
    status: 'active',
    cgpa: 9.18,
    attendancePercentage: 94.2,
    feesStatus: 'paid',
    balanceDue: 0,
    avatar: 'AD',
    achievementsCount: 11
  },
  {
    id: 'stu-7',
    studentId: 'SC-2026-CS055',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@student.smartcampus.edu',
    phone: '+1 (555) 456-9012',
    department: 'Computer Science & AI',
    course: 'B.Tech Computer Science',
    year: 2,
    semester: 4,
    section: 'B',
    rollNo: '24CS055',
    admissionDate: '2024-08-10',
    guardian: {
      name: 'Fatima Al-Mansoor',
      phone: '+1 (555) 567-0123',
      email: 'fatima.mansoor@email.com',
      relation: 'Mother'
    },
    address: '90 Horizon Tower, West Wing',
    emergencyContact: '+1 (555) 567-0123',
    status: 'active',
    cgpa: 8.76,
    attendancePercentage: 89.1,
    feesStatus: 'paid',
    balanceDue: 0,
    avatar: 'TA',
    achievementsCount: 7
  },
  {
    id: 'stu-8',
    studentId: 'SC-2026-MG019',
    name: 'Chloe Dubois',
    email: 'chloe.dubois@student.smartcampus.edu',
    phone: '+1 (555) 678-9123',
    department: 'School of Technology Management',
    course: 'BBA Tech & Analytics',
    year: 1,
    semester: 2,
    section: 'A',
    rollNo: '25MG019',
    admissionDate: '2025-08-18',
    guardian: {
      name: 'Jean-Luc Dubois',
      phone: '+1 (555) 789-0234',
      email: 'jeanluc.dubois@email.com',
      relation: 'Father'
    },
    address: '210 Meridian Plaza, Central Hub',
    emergencyContact: '+1 (555) 789-0234',
    status: 'active',
    cgpa: 8.45,
    attendancePercentage: 85.0,
    feesStatus: 'paid',
    balanceDue: 0,
    avatar: 'CD',
    achievementsCount: 5
  }
];

export const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'fac-1',
    facultyId: 'FAC-CS-104',
    name: 'Prof. Maya Patel',
    email: 'maya.patel@smartcampus.edu',
    phone: '+1 (555) 456-7890',
    department: 'Computer Science & AI',
    designation: 'Associate Professor & AI Lab Director',
    coursesHandled: ['CS601: Deep Neural Systems', 'CS402: Cloud Architecture'],
    workloadHours: 16,
    officeHours: 'Mon, Wed 14:00 - 16:00',
    roomNo: 'Turing Hall, Room 308',
    avatar: 'MP'
  },
  {
    id: 'fac-2',
    facultyId: 'FAC-CS-101',
    name: 'Dr. Raymond Holt',
    email: 'raymond.holt@smartcampus.edu',
    phone: '+1 (555) 123-7890',
    department: 'Computer Science & AI',
    designation: 'Department Chair & Professor',
    coursesHandled: ['CS602: Advanced Algorithms & Complexity', 'CS101: Discrete Math'],
    workloadHours: 14,
    officeHours: 'Tue, Thu 10:00 - 12:00',
    roomNo: 'Turing Hall, Room 401',
    avatar: 'RH'
  },
  {
    id: 'fac-3',
    facultyId: 'FAC-EC-201',
    name: 'Dr. Evelyn Reed',
    email: 'evelyn.reed@smartcampus.edu',
    phone: '+1 (555) 234-8901',
    department: 'Electronics & Quantum Communications',
    designation: 'Professor & Lab Director',
    coursesHandled: ['EC401: Quantum Computing Fundamentals', 'EC302: Signal Processing'],
    workloadHours: 18,
    officeHours: 'Wed, Fri 11:00 - 13:00',
    roomNo: 'Maxwell Pavilion, Room 215',
    avatar: 'ER'
  },
  {
    id: 'fac-4',
    facultyId: 'FAC-ME-301',
    name: 'Prof. Julian Cruz',
    email: 'julian.cruz@smartcampus.edu',
    phone: '+1 (555) 345-9012',
    department: 'Mechanical & Autonomous Robotics',
    designation: 'Associate Professor',
    coursesHandled: ['ME501: Kinematics of Robotics', 'ME304: Finite Element Analysis'],
    workloadHours: 15,
    officeHours: 'Mon, Thu 15:00 - 17:00',
    roomNo: 'Tesla Workshop, Room 102',
    avatar: 'JC'
  }
];

export const INITIAL_COURSES: CourseSubject[] = [
  {
    id: 'course-1',
    code: 'CS601',
    name: 'Deep Neural Systems & Generative Models',
    department: 'Computer Science & AI',
    credits: 4,
    semester: 6,
    facultyName: 'Prof. Maya Patel',
    attendanceRate: 91.2
  },
  {
    id: 'course-2',
    code: 'CS602',
    name: 'Advanced Distributed Systems',
    department: 'Computer Science & AI',
    credits: 4,
    semester: 6,
    facultyName: 'Dr. Raymond Holt',
    attendanceRate: 88.6
  },
  {
    id: 'course-3',
    code: 'CS603',
    name: 'Cybersecurity & Cryptographic Protocols',
    department: 'Computer Science & AI',
    credits: 3,
    semester: 6,
    facultyName: 'Dr. Evelyn Reed',
    attendanceRate: 86.4
  },
  {
    id: 'course-4',
    code: 'CS604',
    name: 'Database Engineering & Distributed Stores',
    department: 'Computer Science & AI',
    credits: 3,
    semester: 6,
    facultyName: 'Prof. Julian Cruz',
    attendanceRate: 94.0
  },
  {
    id: 'course-5',
    code: 'CS605',
    name: 'Human-Computer Interaction & 3D Spatial UI',
    department: 'Computer Science & AI',
    credits: 3,
    semester: 6,
    facultyName: 'Prof. Maya Patel',
    attendanceRate: 93.5
  }
];

export const INITIAL_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: 'sess-101',
    courseCode: 'CS601',
    courseName: 'Deep Neural Systems & Generative Models',
    facultyId: 'FAC-CS-104',
    facultyName: 'Prof. Maya Patel',
    date: '2026-10-20',
    timeSlot: '09:00 - 10:30 AM',
    room: 'Turing Hall 302',
    totalEnrolled: 64,
    presentCount: 59,
    qrToken: 'QR-CS601-20261020-0900',
    qrExpiry: '2026-10-20T10:30:00Z',
    status: 'active'
  },
  {
    id: 'sess-102',
    courseCode: 'CS602',
    courseName: 'Advanced Distributed Systems',
    facultyId: 'FAC-CS-101',
    facultyName: 'Dr. Raymond Holt',
    date: '2026-10-20',
    timeSlot: '11:00 - 12:30 PM',
    room: 'Turing Hall 304',
    totalEnrolled: 64,
    presentCount: 56,
    qrToken: 'QR-CS602-20261020-1100',
    qrExpiry: '2026-10-20T12:30:00Z',
    status: 'active'
  },
  {
    id: 'sess-103',
    courseCode: 'CS603',
    courseName: 'Cybersecurity & Cryptographic Protocols',
    facultyId: 'FAC-EC-201',
    facultyName: 'Dr. Evelyn Reed',
    date: '2026-10-19',
    timeSlot: '14:00 - 15:30 PM',
    room: 'Cyber Lab 102',
    totalEnrolled: 64,
    presentCount: 61,
    status: 'closed'
  }
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'rec-1',
    sessionId: 'sess-101',
    studentId: 'SC-2026-CS042',
    studentName: 'Aria Chen',
    rollNo: '23CS042',
    status: 'present',
    markedAt: '2026-10-20 09:05 AM',
    verifiedMethod: 'qr_scan'
  },
  {
    id: 'rec-2',
    sessionId: 'sess-101',
    studentId: 'SC-2026-CS018',
    studentName: 'Rohan Sharma',
    rollNo: '23CS018',
    status: 'absent',
    markedAt: '2026-10-20 09:30 AM',
    verifiedMethod: 'manual',
    remarks: 'Unreported absence'
  },
  {
    id: 'rec-3',
    sessionId: 'sess-101',
    studentId: 'SC-2026-CS091',
    studentName: 'Zoe Nakamura',
    rollNo: '23CS091',
    status: 'present',
    markedAt: '2026-10-20 09:02 AM',
    verifiedMethod: 'qr_scan'
  },
  {
    id: 'rec-4',
    sessionId: 'sess-101',
    studentId: 'SC-2026-CS055',
    studentName: 'Tariq Al-Mansoor',
    rollNo: '24CS055',
    status: 'late',
    markedAt: '2026-10-20 09:22 AM',
    verifiedMethod: 'qr_scan',
    remarks: 'Arrived 22 mins late'
  }
];

export const INITIAL_CORRECTIONS: AttendanceCorrection[] = [
  {
    id: 'corr-1',
    studentId: 'SC-2026-CS018',
    studentName: 'Rohan Sharma',
    courseCode: 'CS601',
    sessionDate: '2026-10-18',
    requestedStatus: 'approved_leave',
    reason: 'Medical appointment at University Health Center (medical note attached).',
    submittedAt: '2026-10-19 14:20 PM',
    status: 'pending'
  }
];

export const INITIAL_EXAMINATIONS: Examination[] = [
  {
    id: 'exam-1',
    code: 'EX-2026-CS601-MID',
    title: 'Deep Neural Systems Midterm Examination',
    courseCode: 'CS601',
    courseName: 'Deep Neural Systems & Generative Models',
    examDate: '2026-11-04',
    time: '10:00 AM - 12:00 PM',
    room: 'Auditorium Hall A',
    maxMarks: 50,
    passMarks: 20,
    semester: 6,
    weightagePercentage: 30,
    status: 'scheduled'
  },
  {
    id: 'exam-2',
    code: 'EX-2026-CS602-MID',
    title: 'Distributed Systems Architecture Assessment',
    courseCode: 'CS602',
    courseName: 'Advanced Distributed Systems',
    examDate: '2026-11-07',
    time: '02:00 PM - 04:00 PM',
    room: 'Turing Hall 302',
    maxMarks: 50,
    passMarks: 20,
    semester: 6,
    weightagePercentage: 30,
    status: 'scheduled'
  },
  {
    id: 'exam-3',
    code: 'EX-2026-CS604-ASS1',
    title: 'Distributed Stores Performance Evaluation',
    courseCode: 'CS604',
    courseName: 'Database Engineering & Distributed Stores',
    examDate: '2026-10-10',
    time: '09:00 AM - 11:00 AM',
    room: 'Computer Lab 3',
    maxMarks: 100,
    passMarks: 40,
    semester: 6,
    weightagePercentage: 25,
    status: 'published'
  }
];

export const INITIAL_EXAM_RESULTS: ExamResult[] = [
  {
    id: 'res-1',
    examId: 'exam-3',
    studentId: 'SC-2026-CS042',
    studentName: 'Aria Chen',
    courseCode: 'CS604',
    courseName: 'Database Engineering & Distributed Stores',
    internalMarks: 28,
    externalMarks: 64,
    totalMarks: 92,
    grade: 'A+',
    gpaPoint: 10.0,
    status: 'pass',
    remarks: 'Exceptional database partitioning design and query optimization analysis.'
  },
  {
    id: 'res-2',
    examId: 'exam-3',
    studentId: 'SC-2026-CS091',
    studentName: 'Zoe Nakamura',
    courseCode: 'CS604',
    courseName: 'Database Engineering & Distributed Stores',
    internalMarks: 30,
    externalMarks: 68,
    totalMarks: 98,
    grade: 'A+',
    gpaPoint: 10.0,
    status: 'pass',
    remarks: 'Flawless schema normalization and Raft consensus benchmarking.'
  },
  {
    id: 'res-3',
    examId: 'exam-3',
    studentId: 'SC-2026-CS018',
    studentName: 'Rohan Sharma',
    courseCode: 'CS604',
    courseName: 'Database Engineering & Distributed Stores',
    internalMarks: 18,
    externalMarks: 46,
    totalMarks: 64,
    grade: 'B',
    gpaPoint: 7.0,
    status: 'pass',
    remarks: 'Needs improvement in replication lag calculations.'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-1',
    title: 'Transformer Architecture Implementation from Scratch',
    courseCode: 'CS601',
    courseName: 'Deep Neural Systems',
    facultyName: 'Prof. Maya Patel',
    dueDate: '2026-10-28',
    maxMarks: 100,
    instructions: 'Build a multi-head self-attention module and feedforward encoder block in PyTorch without using nn.Transformer.',
    rubrics: 'Mathematical correctness (40%), Unit tests (30%), Code elegance (15%), Documentation (15%)',
    submissionsCount: 48,
    totalStudents: 64
  },
  {
    id: 'assign-2',
    title: 'Raft Consensus Protocol Leader Election Simulator',
    courseCode: 'CS602',
    courseName: 'Distributed Systems',
    facultyName: 'Dr. Raymond Holt',
    dueDate: '2026-11-02',
    maxMarks: 100,
    instructions: 'Simulate network partitions and term elections with heartbeat timeouts among 5 virtual nodes.',
    rubrics: 'Partition recovery (50%), Log replication invariants (30%), Benchmark latency (20%)',
    submissionsCount: 22,
    totalStudents: 64
  },
  {
    id: 'assign-3',
    title: 'Interactive 3D Campus Space Navigation Prototype',
    courseCode: 'CS605',
    courseName: 'Human-Computer Interaction',
    facultyName: 'Prof. Maya Patel',
    dueDate: '2026-11-15',
    maxMarks: 50,
    instructions: 'Develop a WebGL/Three.js interactive view with accessibility keyboard fallbacks.',
    rubrics: 'Spatial rendering (40%), Performance 60fps (30%), Accessibility compliance (30%)',
    submissionsCount: 15,
    totalStudents: 64
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    assignmentId: 'assign-1',
    studentId: 'SC-2026-CS042',
    studentName: 'Aria Chen',
    submittedAt: '2026-10-21 16:35 PM',
    status: 'graded',
    marksObtained: 96,
    feedback: 'Brilliant attention mask vectorized implementation. Clean visualization code.',
    fileName: 'aria_chen_transformer_v2.py'
  },
  {
    id: 'sub-2',
    assignmentId: 'assign-1',
    studentId: 'SC-2026-CS091',
    studentName: 'Zoe Nakamura',
    submittedAt: '2026-10-20 22:10 PM',
    status: 'graded',
    marksObtained: 99,
    feedback: 'Flawless flash-attention optimization benchmark.',
    fileName: 'zoe_nakamura_transformer.py'
  }
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  {
    id: 'tt-1',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    courseCode: 'CS601',
    courseName: 'Deep Neural Systems',
    facultyName: 'Prof. Maya Patel',
    roomNo: 'Turing Hall 302',
    section: 'A',
    semester: 6,
    department: 'Computer Science & AI'
  },
  {
    id: 'tt-2',
    dayOfWeek: 'Monday',
    startTime: '11:00',
    endTime: '12:30',
    courseCode: 'CS602',
    courseName: 'Distributed Systems',
    facultyName: 'Dr. Raymond Holt',
    roomNo: 'Turing Hall 304',
    section: 'A',
    semester: 6,
    department: 'Computer Science & AI'
  },
  {
    id: 'tt-3',
    dayOfWeek: 'Tuesday',
    startTime: '10:00',
    endTime: '11:30',
    courseCode: 'CS604',
    courseName: 'Database Engineering',
    facultyName: 'Prof. Julian Cruz',
    roomNo: 'Lab 4',
    section: 'A',
    semester: 6,
    department: 'Computer Science & AI'
  },
  {
    id: 'tt-4',
    dayOfWeek: 'Wednesday',
    startTime: '09:00',
    endTime: '10:30',
    courseCode: 'CS601',
    courseName: 'Deep Neural Systems',
    facultyName: 'Prof. Maya Patel',
    roomNo: 'Turing Hall 302',
    section: 'A',
    semester: 6,
    department: 'Computer Science & AI'
  },
  {
    id: 'tt-5',
    dayOfWeek: 'Thursday',
    startTime: '14:00',
    endTime: '16:00',
    courseCode: 'CS605',
    courseName: 'HCI & 3D Spatial UI Lab',
    facultyName: 'Prof. Maya Patel',
    roomNo: 'Graphics Lab 2',
    section: 'A',
    semester: 6,
    department: 'Computer Science & AI'
  },
  {
    id: 'tt-6',
    dayOfWeek: 'Friday',
    startTime: '11:00',
    endTime: '12:30',
    courseCode: 'CS603',
    courseName: 'Cybersecurity Protocols',
    facultyName: 'Dr. Evelyn Reed',
    roomNo: 'Cyber Lab 102',
    section: 'A',
    semester: 6,
    department: 'Computer Science & AI'
  }
];

export const INITIAL_FEES: FeeRecord[] = [
  {
    id: 'fee-1',
    studentId: 'SC-2026-CS042',
    studentName: 'Aria Chen',
    department: 'Computer Science & AI',
    semester: 6,
    academicYear: '2026-2027',
    totalFee: 6500,
    paidAmount: 6500,
    balanceDue: 0,
    dueDate: '2026-09-30',
    status: 'paid',
    transactions: [
      {
        id: 'tx-1',
        transactionId: 'TXN-9021-CAMPUS-01',
        amount: 6500,
        date: '2026-09-12',
        method: 'Online Banking (ACH)',
        receiptNumber: 'RCPT-2026-8812',
        verified: true
      }
    ]
  },
  {
    id: 'fee-2',
    studentId: 'SC-2026-CS018',
    studentName: 'Rohan Sharma',
    department: 'Computer Science & AI',
    semester: 6,
    academicYear: '2026-2027',
    totalFee: 6500,
    paidAmount: 5300,
    balanceDue: 1200,
    dueDate: '2026-10-31',
    status: 'partial',
    transactions: [
      {
        id: 'tx-2',
        transactionId: 'TXN-4421-CAMPUS-02',
        amount: 5300,
        date: '2026-09-20',
        method: 'Debit Card',
        receiptNumber: 'RCPT-2026-8941',
        verified: true
      }
    ]
  },
  {
    id: 'fee-3',
    studentId: 'SC-2026-ME005',
    studentName: 'Liam Gallagher',
    department: 'Mechanical & Autonomous Robotics',
    semester: 8,
    academicYear: '2026-2027',
    totalFee: 6500,
    paidAmount: 4100,
    balanceDue: 2400,
    dueDate: '2026-09-30',
    status: 'overdue',
    transactions: [
      {
        id: 'tx-3',
        transactionId: 'TXN-3311-CAMPUS-03',
        amount: 4100,
        date: '2026-08-30',
        method: 'Campus Wire Transfer',
        receiptNumber: 'RCPT-2026-7811',
        verified: true
      }
    ]
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'bk-1',
    isbn: '978-0262033848',
    title: 'Introduction to Algorithms (4th Edition)',
    author: 'Cormen, Leiserson, Rivest, Stein',
    category: 'Computer Science',
    totalCopies: 12,
    availableCopies: 8,
    shelfLocation: 'Stack CS-204'
  },
  {
    id: 'bk-2',
    isbn: '978-0262035613',
    title: 'Deep Learning: Foundations and Concepts',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    category: 'Artificial Intelligence',
    totalCopies: 8,
    availableCopies: 3,
    shelfLocation: 'Stack AI-102'
  },
  {
    id: 'bk-3',
    isbn: '978-1492040767',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Distributed Systems',
    totalCopies: 10,
    availableCopies: 5,
    shelfLocation: 'Stack CS-310'
  },
  {
    id: 'bk-4',
    isbn: '978-0134685991',
    title: 'Effective Java (3rd Edition)',
    author: 'Joshua Bloch',
    category: 'Software Engineering',
    totalCopies: 15,
    availableCopies: 11,
    shelfLocation: 'Stack SE-105'
  },
  {
    id: 'bk-5',
    isbn: '978-0321751041',
    title: 'The Art of Computer Programming, Vol 1',
    author: 'Donald E. Knuth',
    category: 'Theoretical CS',
    totalCopies: 5,
    availableCopies: 4,
    shelfLocation: 'Reference Room R-01'
  }
];

export const INITIAL_BORROWS: BorrowRecord[] = [
  {
    id: 'bor-1',
    bookId: 'bk-2',
    bookTitle: 'Deep Learning: Foundations and Concepts',
    studentId: 'SC-2026-CS042',
    studentName: 'Aria Chen',
    issueDate: '2026-10-05',
    dueDate: '2026-10-26',
    fineAmount: 0,
    status: 'borrowed'
  },
  {
    id: 'bor-2',
    bookId: 'bk-3',
    bookTitle: 'Designing Data-Intensive Applications',
    studentId: 'SC-2026-CS018',
    studentName: 'Rohan Sharma',
    issueDate: '2026-09-20',
    dueDate: '2026-10-11',
    fineAmount: 9.0, // Overdue by 9 days -> $9 fine
    status: 'overdue'
  }
];

export const INITIAL_DRIVES: PlacementDrive[] = [
  {
    id: 'drive-1',
    companyName: 'Anthropic & Google Cloud AI',
    role: 'Member of Technical Staff - Model Platforms',
    packageLPA: 38.5,
    eligibilityMinCGPA: 8.5,
    eligibleDepartments: ['Computer Science & AI', 'Electronics & Quantum Communications'],
    driveDate: '2026-11-12',
    applicationDeadline: '2026-11-01',
    openings: 8,
    location: 'San Francisco, CA / Hybrid',
    status: 'upcoming'
  },
  {
    id: 'drive-2',
    companyName: 'Stripe Infrastructure',
    role: 'Software Engineer - Distributed Payments',
    packageLPA: 34.0,
    eligibilityMinCGPA: 8.0,
    eligibleDepartments: ['Computer Science & AI'],
    driveDate: '2026-11-18',
    applicationDeadline: '2026-11-05',
    openings: 12,
    location: 'New York / Seattle',
    status: 'upcoming'
  },
  {
    id: 'drive-3',
    companyName: 'Tesla Autonomous Systems',
    role: 'Robotics Perception & Control Engineer',
    packageLPA: 32.0,
    eligibilityMinCGPA: 8.0,
    eligibleDepartments: ['Computer Science & AI', 'Mechanical & Autonomous Robotics', 'Electronics & Quantum Communications'],
    driveDate: '2026-11-25',
    applicationDeadline: '2026-11-10',
    openings: 15,
    location: 'Palo Alto, CA',
    status: 'upcoming'
  }
];

export const INITIAL_APPLICATIONS: PlacementApplication[] = [
  {
    id: 'app-1',
    driveId: 'drive-1',
    companyName: 'Anthropic & Google Cloud AI',
    studentId: 'SC-2026-CS042',
    studentName: 'Aria Chen',
    cgpa: 8.92,
    status: 'shortlisted',
    interviewDate: '2026-11-12 10:30 AM',
    round: 'Technical Architecture Round 1'
  },
  {
    id: 'app-2',
    driveId: 'drive-2',
    companyName: 'Stripe Infrastructure',
    studentId: 'SC-2026-CS042',
    studentName: 'Aria Chen',
    cgpa: 8.92,
    status: 'applied'
  }
];

export const INITIAL_EARLY_WARNINGS: EarlyWarningFlag[] = [
  {
    id: 'warn-1',
    studentId: 'SC-2026-CS018',
    studentName: 'Rohan Sharma',
    department: 'Computer Science & AI',
    semester: 6,
    riskLevel: 'warning',
    factors: [
      'Attendance at 68.2% (below university threshold of 75%)',
      'Recent assessment score dropped to 64%',
      'Overdue library record (9 days past due)'
    ],
    attendance: 68.2,
    recentAverage: 64.0,
    recommendedAction: 'Schedule academic advisory session with Faculty Mentor and notify parent regarding condonation policy.',
    reviewStatus: 'open',
    assignedCounselor: 'Prof. Maya Patel',
    flaggedDate: '2026-10-18',
    interventionNotes: 'Parent contacted via portal; medical leave documentation pending approval.'
  },
  {
    id: 'warn-2',
    studentId: 'SC-2026-ME005',
    studentName: 'Liam Gallagher',
    department: 'Mechanical & Autonomous Robotics',
    semester: 8,
    riskLevel: 'critical',
    factors: [
      'Critical attendance at 62.0%',
      'Unpaid fee dues exceeding $2,400',
      'Missed 2 major lab project milestones'
    ],
    attendance: 62.0,
    recentAverage: 58.5,
    recommendedAction: 'Urgent meeting with Dean of Student Affairs; initiate financial scholarship evaluation or installment plan.',
    reviewStatus: 'under_review',
    assignedCounselor: 'Dr. Arthur Thorne',
    flaggedDate: '2026-10-15',
    interventionNotes: 'Financial aid installment plan draft sent to bursar office.'
  }
];

export const INITIAL_GAMIFICATION: GamificationProfile = {
  studentId: 'SC-2026-CS042',
  level: 4,
  levelTitle: 'Campus Innovator & Scholar',
  xp: 1850,
  nextLevelXp: 2500,
  streakDays: 7,
  badges: [
    {
      id: 'badge-1',
      title: 'Honor Roll Luminary',
      description: 'Maintained CGPA above 8.5 for 4 consecutive semesters',
      icon: 'Award',
      unlockedAt: '2026-09-01'
    },
    {
      id: 'badge-2',
      title: 'Streak Sentinel',
      description: 'Achieved a continuous 7-day academic activity streak',
      icon: 'Flame',
      unlockedAt: '2026-10-20'
    },
    {
      id: 'badge-3',
      title: 'Punctual Scholar',
      description: 'Maintained >90% attendance across all registered courses',
      icon: 'CheckCircle2',
      unlockedAt: '2026-10-15'
    },
    {
      id: 'badge-4',
      title: 'Early Submitter',
      description: 'Submitted 5 coursework assignments >48 hours prior to deadline',
      icon: 'Zap',
      unlockedAt: '2026-10-18'
    }
  ],
  quests: [
    {
      id: 'quest-1',
      title: 'Submit Deep Neural Systems Assignment 1',
      rewardXp: 200,
      progress: 1,
      goal: 1,
      completed: true,
      claimed: false
    },
    {
      id: 'quest-2',
      title: 'Maintain 90%+ Weekly Attendance in all sessions',
      rewardXp: 150,
      progress: 5,
      goal: 5,
      completed: true,
      claimed: true
    },
    {
      id: 'quest-3',
      title: 'Run 3 What-If Semester Projections in the Lab',
      rewardXp: 100,
      progress: 2,
      goal: 3,
      completed: false,
      claimed: false
    },
    {
      id: 'quest-4',
      title: 'Consult AI Campus Copilot for Exam Prep',
      rewardXp: 100,
      progress: 1,
      goal: 1,
      completed: true,
      claimed: false
    }
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Midterm Examination Schedule Published',
    message: 'The official schedule for Semester 6 Midterm Examinations has been released.',
    category: 'exam',
    priority: 'high',
    timestamp: '10 mins ago',
    read: false,
    link: 'exams'
  },
  {
    id: 'notif-2',
    title: 'Anthropic & Google Cloud AI Campus Drive',
    message: 'Registrations are open for the upcoming MTS role. Minimum CGPA: 8.5.',
    category: 'placement',
    priority: 'high',
    timestamp: '1 hour ago',
    read: false,
    link: 'placement'
  },
  {
    id: 'notif-3',
    title: 'Attendance Session Verified',
    message: 'Your attendance for CS601 (Deep Neural Systems) was confirmed via QR scan.',
    category: 'attendance',
    priority: 'medium',
    timestamp: '3 hours ago',
    read: true,
    link: 'attendance'
  },
  {
    id: 'notif-4',
    title: 'Library Due Date Reminder',
    message: '"Deep Learning: Foundations and Concepts" is due in 6 days.',
    category: 'library',
    priority: 'medium',
    timestamp: 'Yesterday',
    read: true,
    link: 'library'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-20 09:30:12',
    actorName: 'Prof. Maya Patel',
    actorRole: 'faculty',
    action: 'SESSION_ATTENDANCE_CREATED',
    entity: 'CS601: Deep Neural Systems',
    details: 'Initiated active QR attendance session in Turing Hall 302.'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-20 08:45:00',
    actorName: 'Dr. Arthur Thorne',
    actorRole: 'admin',
    action: 'EXAM_TIMETABLE_PUBLISHED',
    entity: 'Semester 6 Midterms',
    details: 'Published midterm exam dates and hall seating matrices for 420 students.'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-19 16:15:33',
    actorName: 'Elena Vance',
    actorRole: 'superadmin',
    action: 'SYSTEM_POLICY_UPDATED',
    entity: 'Attendance Threshold Rules',
    details: 'Configured automated Early Warning trigger at 75.0% threshold.'
  }
];

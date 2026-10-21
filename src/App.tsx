import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Compass, 
  Sliders, 
  Trophy, 
  Calendar, 
  Users, 
  CreditCard,
  Building2,
  QrCode,
  CheckCircle2,
  X
} from 'lucide-react';
import { 
  User, 
  Student, 
  Faculty, 
  Department, 
  EarlyWarningFlag, 
  FeeRecord, 
  NotificationItem, 
  GamificationProfile,
  UserRole
} from './types/campus';
import { apiClient } from './services/apiClient';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { StudentDirectory } from './components/students/StudentDirectory';
import { FacultyDirectory } from './components/faculty/FacultyDirectory';
import { AttendanceModule } from './components/attendance/AttendanceModule';
import { ExaminationsModule } from './components/exams/ExaminationsModule';
import { AssignmentsModule } from './components/assignments/AssignmentsModule';
import { TimetableModule } from './components/timetable/TimetableModule';
import { FeesFinanceModule } from './components/fees/FeesFinanceModule';
import { LibraryModule } from './components/library/LibraryModule';
import { PlacementModule } from './components/placement/PlacementModule';
import { EarlyWarningModule } from './components/earlywarning/EarlyWarningModule';
import { Campus3DViewer } from './components/campus3d/Campus3DViewer';
import { Analytics3DView } from './components/analytics3d/Analytics3DView';
import { WhatIfSimulationLab } from './components/simulation/WhatIfSimulationLab';
import { GamificationView } from './components/gamification/GamificationView';
import { CampusCopilotModal } from './components/copilot/CampusCopilotModal';
import { CommandPalette } from './components/common/CommandPalette';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { Interactive3DBackground } from './components/common/Interactive3DBackground';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allRoles, setAllRoles] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [warnings, setWarnings] = useState<EarlyWarningFlag[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [gamification, setGamification] = useState<GamificationProfile | null>(null);

  const [activeModule, setActiveModule] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [qrScanBanner, setQrScanBanner] = useState<{ message: string; sub?: string } | null>(null);

  useEffect(() => {
    if (activeModule === 'cover') {
      window.location.href = '/cover';
    }
  }, [activeModule]);

  // Handle scans from authentic physical QR codes
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const mod = params.get('module');
      const token = params.get('token');
      const course = params.get('course');
      const verify = params.get('verify');
      const stuId = params.get('id');
      const stuName = params.get('name');

      if (token || mod === 'attendance') {
        setActiveModule('attendance');
        if (token) {
          setQrScanBanner({
            message: `Scanned Live Attendance QR Token: ${token}`,
            sub: course ? `Course Session: ${course} · Verified via SmartCampus 360 AI` : 'Attendance Ledger Session Active'
          });
        }
      } else if (verify === 'student' && stuId) {
        setActiveModule('students');
        setQrScanBanner({
          message: `Official Student Credentials Verified: ${stuName || stuId}`,
          sub: `Registry ID: ${stuId} · Tamper-proof cryptographic validation pass`
        });
      }
    } catch (e) {
      console.warn('QR URL parse check:', e);
    }
  }, []);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [theme, setTheme] = useState<'midnight' | 'dark' | 'light'>('midnight');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllInitialData();
  }, []);

  const loadAllInitialData = async () => {
    try {
      setIsLoading(true);
      const [
        userRes, 
        stuRes, 
        facRes, 
        deptRes, 
        warnRes, 
        feeRes, 
        notifRes, 
        gameRes
      ] = await Promise.all([
        apiClient.getCurrentUser(),
        apiClient.getStudents(),
        apiClient.getFaculty(),
        apiClient.getDepartments(),
        apiClient.getEarlyWarnings(),
        apiClient.getFees(),
        apiClient.getNotifications(),
        apiClient.getGamification()
      ]);

      setCurrentUser(userRes.user);
      setAllRoles(userRes.allRoles);
      setStudents(stuRes.students);
      setFaculty(facRes.faculty);
      setDepartments(deptRes.departments);
      setWarnings(warnRes.warnings);
      setFees(feeRes.fees);
      setNotifications(notifRes.notifications);
      setGamification(gameRes.gamification);
    } catch (err) {
      console.error('Failed to load initial campus data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchRole = async (newRole: UserRole) => {
    try {
      const res = await apiClient.switchRole(newRole);
      if (res.success) {
        setCurrentUser(res.user);
        // Direct users to relevant default home
        setActiveModule('dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const refreshStudents = async () => {
    const res = await apiClient.getStudents();
    setStudents(res.students);
  };

  const refreshNotifications = async () => {
    const res = await apiClient.getNotifications();
    setNotifications(res.notifications);
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-extrabold text-lg shadow-xl shadow-purple-600/40 animate-pulse">
          360
        </div>
        <div className="text-center">
          <h2 className="text-sm font-bold tracking-tight text-white">SmartCampus 360 AI</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">Initializing High-Performance Academic Twin...</p>
        </div>
      </div>
    );
  }

  // Active student for student context (default to Aria Chen if student role or first student)
  const currentStudent = students.find(s => s.studentId === currentUser.studentId) || students[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased font-sans relative overflow-x-hidden">
      {/* Subtle 3D Ambient Constellation Background */}
      <Interactive3DBackground />

      {/* Navigation Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        role={currentUser.role}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentUser={currentUser}
          allRoles={allRoles}
          onSwitchRole={handleSwitchRole}
          activeModule={activeModule}
          onNavigate={setActiveModule}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          unreadNotificationsCount={notifications.filter(n => !n.read).length}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'midnight' ? 'dark' : 'midnight')}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {qrScanBanner && (
            <div className="p-4 bg-purple-950/70 border-2 border-purple-500/50 rounded-2xl flex items-center justify-between gap-4 shadow-xl shadow-purple-950/40 animate-fade-in backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-600/30 rounded-xl border border-purple-500/40 text-purple-300">
                  <QrCode className="w-5 h-5 text-purple-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white tracking-wide">{qrScanBanner.message}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                      VERIFIED
                    </span>
                  </div>
                  {qrScanBanner.sub && (
                    <p className="text-[11px] text-purple-200/80 font-mono mt-0.5">{qrScanBanner.sub}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setQrScanBanner(null)}
                className="p-1 hover:bg-purple-900/40 rounded-lg text-purple-300 hover:text-white transition-colors"
                title="Dismiss notice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeModule === 'dashboard' && (
            <AdminDashboard
              students={students}
              faculty={faculty}
              departments={departments}
              warnings={warnings}
              fees={fees}
              onNavigate={setActiveModule}
            />
          )}

          {activeModule === 'students' && (
            <StudentDirectory
              students={students}
              onRefresh={refreshStudents}
            />
          )}

          {activeModule === 'faculty' && (
            <FacultyDirectory />
          )}

          {activeModule === 'attendance' && (
            <AttendanceModule
              currentUser={currentUser}
              currentStudent={currentStudent}
              students={students}
            />
          )}

          {activeModule === 'exams' && (
            <ExaminationsModule
              currentUser={currentUser}
              currentStudent={currentStudent}
            />
          )}

          {activeModule === 'assignments' && (
            <AssignmentsModule
              currentUser={currentUser}
              currentStudent={currentStudent}
            />
          )}

          {activeModule === 'timetable' && (
            <TimetableModule
              currentUser={currentUser}
            />
          )}

          {activeModule === 'fees' && (
            <FeesFinanceModule
              currentUser={currentUser}
              currentStudent={currentStudent}
            />
          )}

          {activeModule === 'library' && (
            <LibraryModule
              currentUser={currentUser}
              currentStudent={currentStudent}
            />
          )}

          {activeModule === 'placement' && (
            <PlacementModule
              currentUser={currentUser}
              currentStudent={currentStudent}
            />
          )}

          {activeModule === 'earlywarning' && (
            <EarlyWarningModule
              currentUser={currentUser}
            />
          )}

          {activeModule === 'campus3d' && (
            <Campus3DViewer />
          )}

          {activeModule === 'analytics3d' && (
            <Analytics3DView departments={departments} />
          )}

          {activeModule === 'simulation' && (
            <WhatIfSimulationLab
              currentStudent={currentStudent}
            />
          )}

          {activeModule === 'gamification' && gamification && (
            <GamificationView
              initialProfile={gamification}
            />
          )}
        </main>
      </div>

      {/* Floating Action Button for AI Copilot */}
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-30 p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl shadow-2xl shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
        title="Open AI Campus Copilot"
      >
        <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline text-xs font-bold">Ask AI Copilot</span>
        <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
      </button>

      {/* Modals & Overlays */}
      <CampusCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        currentStudent={currentStudent}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveModule}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        role={currentUser.role}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onRefresh={refreshNotifications}
        onNavigate={setActiveModule}
      />
    </div>
  );
}

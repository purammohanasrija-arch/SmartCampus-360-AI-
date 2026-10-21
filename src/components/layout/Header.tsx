import React from 'react';
import { 
  Search, 
  Bell, 
  Bot, 
  Shield, 
  ChevronDown, 
  Menu, 
  Sun, 
  Moon,
  Sparkles
} from 'lucide-react';
import { User, UserRole } from '../../types/campus';

interface HeaderProps {
  currentUser: User;
  allRoles: User[];
  onSwitchRole: (role: UserRole) => void;
  activeModule: string;
  onOpenCommandPalette: () => void;
  onOpenNotifications: () => void;
  onOpenCopilot: () => void;
  unreadNotificationsCount: number;
  onToggleSidebar: () => void;
  theme: 'midnight' | 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigate?: (module: string) => void;
}

const MODULE_NAMES: Record<string, string> = {
  dashboard: 'Executive Command Center',
  students: 'Student Registry & Digital IDs',
  faculty: 'Faculty & Department Allocation',
  attendance: 'Attendance & Session Ledger',
  exams: 'Examinations & Transcripts',
  assignments: 'Coursework & LMS Submissions',
  timetable: 'Weekly Master Timetable',
  fees: 'Student Financials & Bursar Receipts',
  library: 'Alexandria Digital Library',
  placement: 'Placement & Career Opportunities',
  earlywarning: 'Academic Early-Warning Intelligence',
  simulation: 'Academic What-If Simulation Lab',
  campus3d: 'Spatial 3D Digital Campus Explorer',
  analytics3d: '3D Multi-Dimensional Performance Matrix',
  gamification: 'Student Quests & Honors Hall'
};

export function Header({
  currentUser,
  allRoles,
  onSwitchRole,
  activeModule,
  onOpenCommandPalette,
  onOpenNotifications,
  onOpenCopilot,
  unreadNotificationsCount,
  onToggleSidebar,
  theme,
  onToggleTheme,
  onNavigate
}: HeaderProps) {
  return (
    <header className="h-16 px-4 md:px-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile Menu Toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 md:hidden text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium">
          <a href="/cover" className="text-slate-400 hover:text-purple-300 transition-colors hidden sm:inline font-semibold" title="Return to Cover Page">
            SmartCampus 360 AI
          </a>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="text-white font-semibold">{MODULE_NAMES[activeModule] || 'Portal'}</span>
        </div>
      </div>

      {/* Middle: Command Palette Quick Search Button */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <button
          onClick={onOpenCommandPalette}
          className="w-full px-3.5 py-1.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between transition-colors shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search directory, courses, or jump to tool...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 text-slate-400 rounded font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Role Switcher, Copilot, Notifications */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Return to Cover Page */}
        <a
          href="/cover"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
          title="Return to Cover Page Showcase"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Cover Page</span>
        </a>

        {/* AI Campus Copilot Button */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/20 transition-all"
        >
          <Bot className="w-4 h-4" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-slate-950" />
          )}
        </button>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <select
            value={currentUser.role}
            onChange={e => onSwitchRole(e.target.value as UserRole)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium cursor-pointer"
            title="Switch User Role Portal"
          >
            <option value="admin">College Administrator</option>
            <option value="superadmin">Super Administrator</option>
            <option value="faculty">Faculty (Prof. Patel)</option>
            <option value="student">Student (Aria Chen)</option>
            <option value="parent">Parent / Guardian</option>
            <option value="librarian">Librarian</option>
            <option value="placement">Placement Officer</option>
          </select>
        </div>

        {/* User Mini Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-white font-bold text-xs shadow-inner">
            {currentUser.avatar}
          </div>
          <div className="hidden lg:block text-left text-xs">
            <div className="font-semibold text-white leading-tight">{currentUser.name}</div>
            <div className="text-[10px] text-purple-400 capitalize">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

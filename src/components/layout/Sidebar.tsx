import React from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Calendar, 
  Award, 
  BookOpen, 
  CreditCard, 
  Briefcase, 
  ShieldAlert, 
  Sliders, 
  Bot, 
  Trophy, 
  Compass, 
  Clock, 
  LogOut,
  Sparkles,
  Database,
  BarChart3
} from 'lucide-react';
import { UserRole } from '../../types/campus';

interface SidebarProps {
  activeModule: string;
  onSelectModule: (module: string) => void;
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  allowedRoles: UserRole[];
  badge?: string;
  isSpecial?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'cover',
    label: 'Cover Page Showcase',
    icon: Sparkles,
    allowedRoles: ['superadmin', 'admin', 'faculty', 'student', 'parent', 'librarian', 'placement'],
    isSpecial: true,
    badge: '3D COVER'
  },
  {
    id: 'dashboard',
    label: 'Command Center',
    icon: Building2,
    allowedRoles: ['superadmin', 'admin', 'faculty', 'student', 'parent', 'librarian', 'placement']
  },
  {
    id: 'students',
    label: 'Students Directory',
    icon: Users,
    allowedRoles: ['superadmin', 'admin', 'faculty', 'librarian', 'placement']
  },
  {
    id: 'faculty',
    label: 'Faculty & Chairs',
    icon: GraduationCap,
    allowedRoles: ['superadmin', 'admin', 'faculty']
  },
  {
    id: 'attendance',
    label: 'Attendance Ledger',
    icon: Calendar,
    allowedRoles: ['superadmin', 'admin', 'faculty', 'student', 'parent']
  },
  {
    id: 'exams',
    label: 'Examinations & Grades',
    icon: Award,
    allowedRoles: ['superadmin', 'admin', 'faculty', 'student', 'parent']
  },
  {
    id: 'assignments',
    label: 'Coursework LMS',
    icon: BookOpen,
    allowedRoles: ['superadmin', 'admin', 'faculty', 'student']
  },
  {
    id: 'timetable',
    label: 'Master Timetable',
    icon: Clock,
    allowedRoles: ['superadmin', 'admin', 'faculty', 'student']
  },
  {
    id: 'fees',
    label: 'Fees & Financials',
    icon: CreditCard,
    allowedRoles: ['superadmin', 'admin', 'student', 'parent']
  },
  {
    id: 'library',
    label: 'Digital Library',
    icon: BookOpen,
    allowedRoles: ['superadmin', 'admin', 'librarian', 'student', 'faculty']
  },
  {
    id: 'placement',
    label: 'Placement Drives',
    icon: Briefcase,
    allowedRoles: ['superadmin', 'admin', 'placement', 'student']
  },
  {
    id: 'earlywarning',
    label: 'Early-Warning AI',
    icon: ShieldAlert,
    allowedRoles: ['superadmin', 'admin', 'faculty'],
    badge: 'Advisory'
  },
  // Interactive Futuristic modules
  {
    id: 'campus3d',
    label: '3D Campus Twin',
    icon: Compass,
    allowedRoles: ['superadmin', 'admin', 'faculty', 'student', 'parent', 'librarian', 'placement'],
    isSpecial: true
  },
  {
    id: 'analytics3d',
    label: '3D Analytics Matrix',
    icon: BarChart3,
    allowedRoles: ['superadmin', 'admin', 'faculty', 'student', 'parent', 'librarian', 'placement'],
    isSpecial: true
  },
  {
    id: 'simulation',
    label: 'What-If Simulation Lab',
    icon: Sliders,
    allowedRoles: ['superadmin', 'admin', 'faculty', 'student'],
    isSpecial: true
  },
  {
    id: 'gamification',
    label: 'Quests & Honors',
    icon: Trophy,
    allowedRoles: ['student', 'admin', 'superadmin'],
    isSpecial: true
  }
];

export function Sidebar({ activeModule, onSelectModule, isOpen, onClose, role }: SidebarProps) {
  const visibleItems = NAV_ITEMS.filter(item => item.allowedRoles.includes(role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Brand & Logo - Click to return to Cover Page */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/30">
          <a
            href="/cover"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/cover';
            }}
            className="flex items-center gap-3 group cursor-pointer transition-all p-1.5 rounded-xl hover:bg-slate-850 hover:border hover:border-purple-500/30 border border-transparent"
            title="Click to return to Interactive Cover Page Showcase"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-purple-600/30 shrink-0 group-hover:scale-105 group-hover:shadow-purple-500/50 transition-all">
              360
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 group-hover:text-purple-300 transition-colors">
                  <span>SmartCampus</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">AI</span>
                </h1>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold group-hover:bg-cyan-500/30 group-hover:border-cyan-400 transition-all flex items-center gap-0.5">
                  ← Cover
                </span>
              </div>
              <div className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors truncate mt-0.5">
                Institutional OS 2026
              </div>
            </div>
          </a>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            University Modules
          </div>

          {visibleItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            const is3DMatrix = item.id === 'analytics3d';

            if (is3DMatrix) {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectModule(item.id);
                    onClose();
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all group relative overflow-hidden cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-purple-600/40 border border-cyan-400/60'
                      : 'bg-gradient-to-r from-purple-950/50 via-slate-900/90 to-cyan-950/40 hover:from-purple-900/70 hover:to-cyan-900/60 border border-purple-500/40 hover:border-cyan-400/70 shadow-md shadow-purple-950/50'
                  }`}
                  title="Open WebGL 3D Holographic Performance Matrix"
                >
                  <div className="flex items-center gap-2.5 truncate z-10">
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                    }`}>
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <span className={`truncate tracking-tight ${
                      isActive 
                        ? 'text-white' 
                        : 'bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-cyan-200'
                    }`}>
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 z-10 shrink-0">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1 shadow-sm ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                      3D LIVE
                    </span>
                    <Sparkles className={`w-3.5 h-3.5 transition-all ${
                      isActive 
                        ? 'text-cyan-200 animate-spin-slow' 
                        : 'text-cyan-400 group-hover:text-cyan-200 group-hover:scale-125 group-hover:rotate-12 animate-pulse'
                    }`} />
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'cover') {
                    window.location.href = '/cover';
                    return;
                  }
                  onSelectModule(item.id);
                  onClose();
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : item.isSpecial
                    ? 'text-purple-300 hover:bg-slate-900 hover:text-white'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.isSpecial ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && !isActive && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                    {item.badge}
                  </span>
                )}
                {item.isSpecial && !isActive && !item.badge && (
                  <Sparkles className="w-3 h-3 text-purple-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer with Demo Indicator */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/60">
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2 text-xs">
            <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[10px] text-slate-400 block font-mono">DEMO MODE ACTIVE</span>
              <span className="text-[11px] text-slate-200 font-semibold truncate block">Synthetic Campus Data</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

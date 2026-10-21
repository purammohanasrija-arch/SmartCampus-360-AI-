import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Users, 
  GraduationCap, 
  Calendar, 
  CreditCard, 
  BookOpen, 
  Briefcase, 
  Sliders, 
  Bot, 
  Building2, 
  ShieldAlert, 
  Award,
  ArrowRight,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types/campus';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string) => void;
  onOpenCopilot: () => void;
  role: UserRole;
}

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  action: () => void;
}

export function CommandPalette({ isOpen, onClose, onNavigate, onOpenCopilot, role }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const ALL_COMMANDS: CommandItem[] = [
    {
      id: 'cmd-cover',
      title: 'Interactive 3D Cover Page Showcase',
      description: 'Experience the 3D parallax hero cover with interactive HUD zones',
      category: 'Overview',
      icon: Sparkles,
      action: () => { window.location.href = '/cover'; onClose(); }
    },
    {
      id: 'cmd-dashboard',
      title: 'Executive Command Center',
      description: 'View university telemetry, KPIs, and attendance health',
      category: 'Overview',
      icon: Building2,
      action: () => { onNavigate('dashboard'); onClose(); }
    },
    {
      id: 'cmd-students',
      title: 'Student Central Directory',
      description: 'Search scholars, export CSV, and issue digital university IDs',
      category: 'Registrar',
      icon: Users,
      action: () => { onNavigate('students'); onClose(); }
    },
    {
      id: 'cmd-attendance',
      title: 'Attendance & Session Ledger',
      description: 'Generate dynamic QR attendance and process condonations',
      category: 'Academic',
      icon: Calendar,
      action: () => { onNavigate('attendance'); onClose(); }
    },
    {
      id: 'cmd-exams',
      title: 'Examinations & Grade Sheets',
      description: 'Manage schedules, review cohort marks, and print transcripts',
      category: 'Academic',
      icon: Award,
      action: () => { onNavigate('exams'); onClose(); }
    },
    {
      id: 'cmd-assignments',
      title: 'Assignments & Coursework LMS',
      description: 'Submit coding labs and inspect faculty rubric feedback',
      category: 'Academic',
      icon: BookOpen,
      action: () => { onNavigate('assignments'); onClose(); }
    },
    {
      id: 'cmd-timetable',
      title: 'Master Weekly Timetable',
      description: 'Review period schedules and classroom allocations',
      category: 'Academic',
      icon: Calendar,
      action: () => { onNavigate('timetable'); onClose(); }
    },
    {
      id: 'cmd-simulation',
      title: 'Academic What-If Simulation Lab',
      description: 'Simulate target finals scores and model cumulative CGPA',
      category: 'AI & Intelligence',
      icon: Sliders,
      action: () => { onNavigate('simulation'); onClose(); }
    },
    {
      id: 'cmd-campus3d',
      title: 'Spatial 3D Digital Campus Explorer',
      description: 'Interactive Three.js campus model with live facility telemetry',
      category: 'Spatial Twin',
      icon: Building2,
      action: () => { onNavigate('campus3d'); onClose(); }
    },
    {
      id: 'cmd-analytics3d',
      title: '3D Performance Matrix & Visualizer',
      description: 'Volumetric 3D pillar matrix of department attendance and GPA',
      category: 'Spatial Twin',
      icon: BarChart3,
      action: () => { onNavigate('analytics3d'); onClose(); }
    },
    {
      id: 'cmd-copilot',
      title: 'Ask AI Campus Copilot',
      description: 'Consult Gemini 3.8 Flash for academic regulations and exam prep',
      category: 'AI & Intelligence',
      icon: Bot,
      action: () => { onOpenCopilot(); onClose(); }
    },
    {
      id: 'cmd-gamification',
      title: 'Quests & Achievement Hall',
      description: 'Track XP levels, 7-day study streaks, and unlockable badges',
      category: 'Student Life',
      icon: Award,
      action: () => { onNavigate('gamification'); onClose(); }
    },
    {
      id: 'cmd-fees',
      title: 'Student Financials & Bursar Receipts',
      description: 'Review fee obligations, balances due, and verified payment invoices',
      category: 'Bursar',
      icon: CreditCard,
      action: () => { onNavigate('fees'); onClose(); }
    },
    {
      id: 'cmd-library',
      title: 'Alexandria Digital Library',
      description: 'Search catalog, borrow textbooks, and track overdue loan fines',
      category: 'Library',
      icon: BookOpen,
      action: () => { onNavigate('library'); onClose(); }
    },
    {
      id: 'cmd-placement',
      title: 'Corporate Placement & Career Portal',
      description: 'Browse recruitment drives, check eligibility, and apply',
      category: 'Career',
      icon: Briefcase,
      action: () => { onNavigate('placement'); onClose(); }
    },
    {
      id: 'cmd-earlywarning',
      title: 'Early-Warning Intelligence Support',
      description: 'Review advisory risk factors and assign mentorship cases',
      category: 'Support',
      icon: ShieldAlert,
      action: () => { onNavigate('earlywarning'); onClose(); }
    }
  ];

  const filtered = ALL_COMMANDS.filter(cmd => 
    cmd.title.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle palette
        if (isOpen) onClose();
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/80">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, tool, or press Esc to exit..."
            value={search}
            onChange={e => { setSearch(e.target.value); setSelectedIndex(0); }}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] bg-slate-800 border border-slate-700 text-slate-400 rounded font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filtered.length > 0 ? (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                    isSelected ? 'bg-purple-600/20 border border-purple-500/30' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{cmd.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">· {cmd.category}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{cmd.description}</p>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 text-slate-500 ${isSelected ? 'text-purple-400 translate-x-1' : ''} transition-transform`} />
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands or pages found.
            </div>
          )}
        </div>

        {/* Bottom Help */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Navigate: ↑ / ↓</span>
          <span>Select: ↵ Enter</span>
          <span>Close: Esc</span>
        </div>
      </div>
    </div>
  );
}

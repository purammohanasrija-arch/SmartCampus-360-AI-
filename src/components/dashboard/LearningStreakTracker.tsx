import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Zap, 
  Trophy, 
  Target, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Users,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { TiltCard, ParallaxLayer } from '../common/TiltCard';

export interface CampusGoal {
  id: string;
  name: string;
  category: string;
  currentStreak: number;
  streakUnit: string;
  targetStreak: number;
  currentProgress: number;
  targetProgress: number;
  progressUnit: string;
  percentage: number;
  color: {
    from: string;
    to: string;
    stroke: string;
    text: string;
    bg: string;
    border: string;
  };
  description: string;
  milestoneMessage: string;
  departmentRankings: {
    dept: string;
    code: string;
    streak: number;
    completion: number;
  }[];
}

const CAMPUS_GOALS: CampusGoal[] = [
  {
    id: 'daily-streak',
    name: 'Continuous Daily Engagement Streak',
    category: 'Cohort Momentum',
    currentStreak: 42,
    streakUnit: 'Days',
    targetStreak: 60,
    currentProgress: 42,
    targetProgress: 60,
    progressUnit: 'Consecutive Days',
    percentage: 70.0,
    color: {
      from: '#f59e0b',
      to: '#ef4444',
      stroke: 'url(#amberFireGradient)',
      text: 'text-amber-400',
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/40'
    },
    description: 'Consecutive days with university-wide 80%+ student attendance and LMS participation.',
    milestoneMessage: '18 days left to achieve the 60-Day Historic University Honors Milestone.',
    departmentRankings: [
      { dept: 'School of Computer Science & AI', code: 'CS', streak: 42, completion: 96 },
      { dept: 'Department of Mechanical & Robotics', code: 'ME', streak: 39, completion: 91 },
      { dept: 'School of Electrical & Electronics', code: 'EE', streak: 38, completion: 89 },
      { dept: 'Department of Bioengineering', code: 'BIO', streak: 35, completion: 84 },
      { dept: 'School of Design & Architecture', code: 'ARCH', streak: 32, completion: 80 }
    ]
  },
  {
    id: 'lms-submissions',
    name: 'On-Time Coursework & Problem Sets',
    category: 'Academic Rigor',
    currentStreak: 28,
    streakUnit: 'Days',
    targetStreak: 35,
    currentProgress: 11480,
    targetProgress: 14000,
    progressUnit: 'Modules Completed',
    percentage: 82.0,
    color: {
      from: '#06b6d4',
      to: '#6366f1',
      stroke: 'url(#cyanIndigoGradient)',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/15',
      border: 'border-cyan-500/40'
    },
    description: 'Cumulative verified lab reports and coursework assignments turned in on time.',
    milestoneMessage: '82% of mid-term coursework requirements fulfilled across all departments.',
    departmentRankings: [
      { dept: 'School of Computer Science & AI', code: 'CS', streak: 28, completion: 94 },
      { dept: 'School of Electrical & Electronics', code: 'EE', streak: 27, completion: 88 },
      { dept: 'Department of Bioengineering', code: 'BIO', streak: 26, completion: 83 },
      { dept: 'Department of Mechanical & Robotics', code: 'ME', streak: 25, completion: 79 },
      { dept: 'School of Design & Architecture', code: 'ARCH', streak: 22, completion: 75 }
    ]
  },
  {
    id: 'attendance-retention',
    name: 'Mandatory Attendance Threshold Continuity',
    category: 'Attendance Health',
    currentStreak: 88,
    streakUnit: 'Days',
    targetStreak: 100,
    currentProgress: 88,
    targetProgress: 100,
    progressUnit: 'Days Above 75%',
    percentage: 88.0,
    color: {
      from: '#10b981',
      to: '#059669',
      stroke: 'url(#emeraldMintGradient)',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
      border: 'border-emerald-500/40'
    },
    description: 'Days sustaining university attendance rate safely above the 75.0% compliance line.',
    milestoneMessage: 'Campus-wide attendance is healthy at 84.6% average with zero critical deficits.',
    departmentRankings: [
      { dept: 'School of Electrical & Electronics', code: 'EE', streak: 88, completion: 97 },
      { dept: 'Department of Mechanical & Robotics', code: 'ME', streak: 88, completion: 94 },
      { dept: 'School of Computer Science & AI', code: 'CS', streak: 88, completion: 92 },
      { dept: 'Department of Bioengineering', code: 'BIO', streak: 86, completion: 88 },
      { dept: 'School of Design & Architecture', code: 'ARCH', streak: 84, completion: 82 }
    ]
  },
  {
    id: 'research-hours',
    name: 'AI Study & Collaborative Lab Hours',
    category: 'Innovation Sprint',
    currentStreak: 19,
    streakUnit: 'Days',
    targetStreak: 25,
    currentProgress: 760,
    targetProgress: 1000,
    progressUnit: 'Hours Logged',
    percentage: 76.0,
    color: {
      from: '#a855f7',
      to: '#ec4899',
      stroke: 'url(#purplePinkGradient)',
      text: 'text-purple-400',
      bg: 'bg-purple-500/15',
      border: 'border-purple-500/40'
    },
    description: 'Study hall collaboration, peer tutoring, and AI Copilot academic exploration hours.',
    milestoneMessage: '760 hours logged towards the 1,000 hour Chancellor Innovation Challenge.',
    departmentRankings: [
      { dept: 'School of Computer Science & AI', code: 'CS', streak: 19, completion: 98 },
      { dept: 'Department of Bioengineering', code: 'BIO', streak: 18, completion: 86 },
      { dept: 'School of Electrical & Electronics', code: 'EE', streak: 17, completion: 82 },
      { dept: 'Department of Mechanical & Robotics', code: 'ME', streak: 16, completion: 77 },
      { dept: 'School of Design & Architecture', code: 'ARCH', streak: 14, completion: 70 }
    ]
  }
];

// 14-day streak timeline nodes
const LAST_14_DAYS = [
  { day: 'Oct 07', label: 'M', completed: true, activity: '92.4% Attendance · 840 LMS Submissions' },
  { day: 'Oct 08', label: 'T', completed: true, activity: '91.8% Attendance · 790 LMS Submissions' },
  { day: 'Oct 09', label: 'W', completed: true, activity: '93.5% Attendance · 910 LMS Submissions' },
  { day: 'Oct 10', label: 'T', completed: true, activity: '94.1% Attendance · 880 LMS Submissions' },
  { day: 'Oct 11', label: 'F', completed: true, activity: '89.6% Attendance · 720 LMS Submissions' },
  { day: 'Oct 12', label: 'S', completed: true, activity: 'Weekend Study Hall & Library Peak' },
  { day: 'Oct 13', label: 'S', completed: true, activity: 'AI Study Sprint & Research Papers' },
  { day: 'Oct 14', label: 'M', completed: true, activity: '95.2% Attendance · 1,020 LMS Submissions' },
  { day: 'Oct 15', label: 'T', completed: true, activity: '94.8% Attendance · 890 LMS Submissions' },
  { day: 'Oct 16', label: 'W', completed: true, activity: '93.9% Attendance · 950 LMS Submissions' },
  { day: 'Oct 17', label: 'T', completed: true, activity: '92.7% Attendance · 880 LMS Submissions' },
  { day: 'Oct 18', label: 'F', completed: true, activity: '91.4% Attendance · 830 LMS Submissions' },
  { day: 'Oct 19', label: 'S', completed: true, activity: 'Weekend Hackathon & Coding Quests' },
  { day: 'Oct 20', label: 'Today', completed: true, isToday: true, activity: 'Active Session · 95.5% Real-Time Attendance' }
];

interface LearningStreakTrackerProps {
  maxTilt?: number;
  is3DActive?: boolean;
  onNavigate?: (module: string) => void;
}

export function LearningStreakTracker({
  maxTilt = 6,
  is3DActive = true,
  onNavigate
}: LearningStreakTrackerProps) {
  const [selectedGoalId, setSelectedGoalId] = useState<string>('daily-streak');
  const [animatedProgress, setAnimatedProgress] = useState<number>(0);
  const [selectedDayHover, setSelectedDayHover] = useState<{ day: string; activity: string } | null>(null);
  const [isRallyTriggered, setIsRallyTriggered] = useState<boolean>(false);

  const currentGoal = CAMPUS_GOALS.find(g => g.id === selectedGoalId) || CAMPUS_GOALS[0];

  // Smooth animation effect on progress ring when switching goals
  useEffect(() => {
    setAnimatedProgress(0);
    const timer = setTimeout(() => {
      setAnimatedProgress(currentGoal.percentage);
    }, 60);
    return () => clearTimeout(timer);
  }, [currentGoal]);

  // SVG Progress Ring Geometry
  const size = 180;
  const strokeWidth = 12;
  const center = size / 2;
  const radius = center - strokeWidth - 6; // ~72px
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  // Calculation for the glowing indicator point at the arc tip
  const angleInDegrees = (animatedProgress / 100) * 360 - 90;
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  const pointX = center + radius * Math.cos(angleInRadians);
  const pointY = center + radius * Math.sin(angleInRadians);

  const handleTriggerRally = () => {
    setIsRallyTriggered(true);
    setTimeout(() => setIsRallyTriggered(false), 3000);
  };

  return (
    <TiltCard maxTilt={maxTilt} glare={is3DActive} className="rounded-2xl">
      <div className="bg-slate-900/75 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-md relative overflow-hidden">
        {/* Subtle Ambient Background Gradient matching active goal */}
        <div 
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: currentGoal.color.from }}
        />

        {/* 1. COMPONENT HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <ParallaxLayer z={14}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
                  <Flame className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Campus Learning Streak & Milestone Tracker</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase">
                      42-Day Streak
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Continuous cohort learning velocity, academic momentum & campus-wide goals
                  </p>
                </div>
              </div>
            </ParallaxLayer>
          </div>

          {/* Goal Selector Switcher Tabs */}
          <ParallaxLayer z={18}>
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs">
              {CAMPUS_GOALS.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoalId(goal.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedGoalId === goal.id
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={goal.name}
                >
                  <span className="hidden md:inline">{goal.category}</span>
                  <span className="md:hidden">{goal.streakUnit}</span>
                </button>
              ))}
            </div>
          </ParallaxLayer>
        </div>

        {/* 2. MAIN CENTERPIECE: ANIMATED PROGRESS RING + METRICS SHOWCASE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* LEFT: ANIMATED SVG CIRCULAR PROGRESS RING (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 relative">
            <ParallaxLayer z={22} className="relative flex items-center justify-center">
              <svg 
                width={size} 
                height={size} 
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90 filter drop-shadow-[0_0_12px_rgba(0,0,0,0.5)]"
              >
                <defs>
                  {/* Amber/Flame Gradient */}
                  <linearGradient id="amberFireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>

                  {/* Cyan to Indigo Gradient */}
                  <linearGradient id="cyanIndigoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>

                  {/* Emerald to Mint Gradient */}
                  <linearGradient id="emeraldMintGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>

                  {/* Purple to Pink Gradient */}
                  <linearGradient id="purplePinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>

                {/* Background Track Ring */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="rgba(30, 41, 59, 0.7)"
                  strokeWidth={strokeWidth}
                />

                {/* Subdivided Tick Marks at 25%, 50%, 75%, 100% */}
                {[0, 90, 180, 270].map(degree => (
                  <circle
                    key={degree}
                    cx={center + radius * Math.cos((degree * Math.PI) / 180)}
                    cy={center + radius * Math.sin((degree * Math.PI) / 180)}
                    r={2.5}
                    fill="rgba(148, 163, 184, 0.4)"
                  />
                ))}

                {/* Active Animated Progress Arc with Smooth Transition */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={currentGoal.color.stroke}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 0.85s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />

                {/* Glowing Dot Marker at Arc Head (when progress > 2%) */}
                {animatedProgress > 2 && (
                  <g className="transition-all duration-700">
                    <circle
                      cx={pointX}
                      cy={pointY}
                      r={6}
                      fill="#ffffff"
                      className="animate-pulse"
                      filter="drop-shadow(0 0 6px rgba(255,255,255,0.8))"
                    />
                    <circle
                      cx={pointX}
                      cy={pointY}
                      r={3}
                      fill={currentGoal.color.from}
                    />
                  </g>
                )}
              </svg>

              {/* Progress Center Content (Rotated back to upright) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
                <div className="flex items-center gap-1">
                  <Flame className={`w-4 h-4 ${currentGoal.color.text} animate-bounce`} />
                  <span className="text-3xl font-black text-white font-mono tracking-tight tabular-nums">
                    {currentGoal.currentStreak}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  {currentGoal.streakUnit} Streak
                </div>
                <div className={`text-xs font-extrabold ${currentGoal.color.text} mt-0.5 font-mono`}>
                  {currentGoal.percentage.toFixed(0)}% Completed
                </div>
              </div>
            </ParallaxLayer>

            {/* Sub-label under ring */}
            <div className="mt-2 text-center">
              <span className="text-[11px] text-slate-400 font-medium">
                Goal: <strong className="text-white font-mono">{currentGoal.targetProgress} {currentGoal.progressUnit}</strong>
              </span>
            </div>
          </div>

          {/* RIGHT: DETAILED GOAL BREAKDOWN & MILESTONE IMPACT (7 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            <ParallaxLayer z={16}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                    {currentGoal.category}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-purple-400 font-semibold">Semester Milestone Target</span>
                </div>
                <h4 className="text-base font-bold text-white mt-0.5">
                  {currentGoal.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {currentGoal.description}
                </p>
              </div>
            </ParallaxLayer>

            {/* Metric Comparison Card */}
            <ParallaxLayer z={14}>
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-[11px] text-slate-400">Current Velocity</div>
                  <div className="text-lg font-bold text-white font-mono flex items-center gap-2">
                    <span>{currentGoal.currentProgress.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-normal">/ {currentGoal.targetProgress.toLocaleString()} {currentGoal.progressUnit}</span>
                  </div>
                </div>

                <div className="sm:border-l sm:border-slate-800 sm:pl-4 space-y-0.5">
                  <div className="text-[11px] text-slate-400">Streak Pace</div>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+14.2% vs Previous Term</span>
                  </div>
                </div>

                <div className="sm:border-l sm:border-slate-800 sm:pl-4">
                  <button
                    onClick={handleTriggerRally}
                    disabled={isRallyTriggered}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 disabled:opacity-60"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    <span>{isRallyTriggered ? 'Rally Boost Active!' : 'Rally Cohort'}</span>
                  </button>
                </div>
              </div>
            </ParallaxLayer>

            {/* Motivational Milestone Notification */}
            <ParallaxLayer z={12}>
              <div className="p-3 rounded-xl bg-gradient-to-r from-slate-950/60 to-purple-950/20 border border-purple-500/20 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs text-slate-300 leading-tight">
                  {currentGoal.milestoneMessage}
                </div>
              </div>
            </ParallaxLayer>
          </div>
        </div>

        {/* 3. 14-DAY CONTINUOUS STREAK CALENDAR STRIP */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>14-Day Consecutive Activity Ledger</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% Daily Quota Met</span>
            </span>
          </div>

          {/* Day Nodes Grid */}
          <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
            {LAST_14_DAYS.map((item, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setSelectedDayHover({ day: item.day, activity: item.activity })}
                onMouseLeave={() => setSelectedDayHover(null)}
                className={`p-2 rounded-xl text-center transition-all cursor-pointer border ${
                  item.isToday
                    ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-slate-950/60 border-slate-800 hover:border-purple-500/50 hover:bg-slate-950'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-400">{item.label}</div>
                <div className="my-1 flex items-center justify-center">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                    item.isToday
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>
                <div className="text-[9px] font-mono text-slate-400">{item.day.split(' ')[1]}</div>
              </div>
            ))}
          </div>

          {/* Hover Activity Tooltip Bar */}
          <div className="h-6 flex items-center text-[11px] text-slate-400 font-mono">
            {selectedDayHover ? (
              <span className="text-purple-300 animate-fadeIn">
                <strong>{selectedDayHover.day}:</strong> {selectedDayHover.activity}
              </span>
            ) : (
              <span className="text-slate-500">
                Hover any day node above to inspect attendance and module throughput details.
              </span>
            )}
          </div>
        </div>

        {/* 4. DEPARTMENT STREAK LEADERBOARD */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Department Cohort Streak Contribution</span>
            </span>
            <button
              onClick={() => onNavigate?.('gamification')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View Quests & Badges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {currentGoal.departmentRankings.slice(0, 4).map((rank, i) => (
              <div 
                key={rank.code}
                className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between gap-3 text-xs parallax-card-subtle"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black font-mono shrink-0 ${
                    i === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    i === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    #{i + 1}
                  </span>
                  <div className="truncate">
                    <span className="font-semibold text-slate-200 block truncate">{rank.dept}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{rank.code} Dept · {rank.streak} Day Streak</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-400 font-mono">{rank.completion}%</span>
                  <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${rank.completion}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </TiltCard>
  );
}

import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  DollarSign, 
  AlertTriangle, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Award,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Cpu,
  Layers,
  Activity,
  Compass,
  Clock,
  Eye
} from 'lucide-react';
import { Student, Faculty, Department, EarlyWarningFlag, FeeRecord } from '../../types/campus';
import { TiltCard, ParallaxLayer } from '../common/TiltCard';
import { PerformanceTrendsChart } from './PerformanceTrendsChart';
import { D3Sparkline } from '../common/D3Sparkline';
import { LearningStreakTracker } from './LearningStreakTracker';

interface AdminDashboardProps {
  students: Student[];
  faculty: Faculty[];
  departments: Department[];
  warnings: EarlyWarningFlag[];
  fees: FeeRecord[];
  onNavigate: (module: string) => void;
}

export function AdminDashboard({ 
  students, 
  faculty, 
  departments, 
  warnings, 
  fees,
  onNavigate 
}: AdminDashboardProps) {
  const [selectedYear, setSelectedYear] = useState('2026-2027');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [parallaxIntensity, setParallaxIntensity] = useState<'subtle' | 'expressive' | 'flat'>('subtle');

  // Compute metrics
  const totalStudents = students.length;
  const activeFaculty = faculty.length;
  const avgAttendance = (students.reduce((acc, s) => acc + s.attendancePercentage, 0) / (totalStudents || 1)).toFixed(1);
  
  const totalCollectedFees = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalPendingDues = fees.reduce((acc, f) => acc + f.balanceDue, 0);

  const activeWarningsCount = warnings.filter(w => w.reviewStatus !== 'resolved').length;

  // Determine tilt angle according to user preference
  const maxTilt = parallaxIntensity === 'expressive' ? 12 : parallaxIntensity === 'subtle' ? 7 : 0;
  const is3DActive = parallaxIntensity !== 'flat';

  return (
    <div className="space-y-6">
      {/* Title & Filter Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span>Executive Command Center</span>
            <span aria-hidden="true">·</span>
            <span>Real-time University Telemetry</span>
            <span aria-hidden="true">·</span>
            <span>Academic Year 2026-2027</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">SmartCampus 360 AI Command Center</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Holistic institutional oversight with multi-layered 3D parallax depth perception.
          </p>
        </div>

        {/* Global Dashboard Filters & 3D Parallax Depth Mode Controller */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Parallax Depth Intensity Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs text-slate-300">
            <span className="px-2 py-0.5 text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>3D Parallax:</span>
            </span>
            <button
              onClick={() => setParallaxIntensity('subtle')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                parallaxIntensity === 'subtle'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Subtle 3D transforms (7° tilt)"
            >
              Subtle
            </button>
            <button
              onClick={() => setParallaxIntensity('expressive')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                parallaxIntensity === 'expressive'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Expressive 3D transforms (12° tilt)"
            >
              Expressive
            </button>
            <button
              onClick={() => setParallaxIntensity('flat')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                parallaxIntensity === 'flat'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Disable 3D tilt transforms"
            >
              Flat
            </button>
          </div>

          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-purple-500 font-mono"
          >
            <option value="2026-2027">AY 2026-2027</option>
            <option value="2025-2026">AY 2025-2026</option>
          </select>

          <select
            value={selectedDeptFilter}
            onChange={e => setSelectedDeptFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="All">All 5 Departments</option>
            <option value="CSE">Computer Science & AI</option>
            <option value="ECE">Electronics & Quantum</option>
            <option value="MECH">Mechanical & Robotics</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid with 3D Parallax Hover Effect & Multi-Layer Depth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Students */}
        <TiltCard 
          maxTilt={maxTilt} 
          glare={is3DActive} 
          onClick={() => onNavigate('students')} 
          className="rounded-2xl cursor-pointer"
        >
          <div className="bg-slate-900/70 border border-slate-800/90 hover:border-purple-500/60 rounded-2xl p-5 space-y-3 transition-all shadow-md group h-full backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400">
              <ParallaxLayer z={12}>
                <span className="text-xs font-semibold text-slate-300">Total Enrolled Scholars</span>
              </ParallaxLayer>
              <ParallaxLayer z={28}>
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/25 transition-all shadow-sm">
                  <Users className="w-4 h-4" />
                </div>
              </ParallaxLayer>
            </div>
            <div>
              <ParallaxLayer z={22}>
                <div className="text-2xl font-black text-white font-mono tabular-nums tracking-tight">
                  {totalStudents} Active
                </div>
              </ParallaxLayer>

              {/* D3 Mini Sparkline for Active Users Growth Trend */}
              <ParallaxLayer z={16} className="my-2.5">
                <D3Sparkline
                  data={[1420, 1450, 1435, 1480, 1510, 1545, 1530, 1580, 1610, 1640, 1675, 1710, 1750, 1785]}
                  color="#a855f7"
                  height={32}
                  unit=" users"
                  label="14D Daily Active Reach"
                />
              </ParallaxLayer>

              <ParallaxLayer z={14}>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  <span>+14.2% YoY Admission</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ml-auto text-slate-400" />
                </div>
              </ParallaxLayer>
            </div>
          </div>
        </TiltCard>

        {/* Card 2: Faculty */}
        <TiltCard 
          maxTilt={maxTilt} 
          glare={is3DActive} 
          onClick={() => onNavigate('faculty')} 
          className="rounded-2xl cursor-pointer"
        >
          <div className="bg-slate-900/70 border border-slate-800/90 hover:border-indigo-500/60 rounded-2xl p-5 space-y-3 transition-all shadow-md group h-full backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400">
              <ParallaxLayer z={12}>
                <span className="text-xs font-semibold text-slate-300">Distinguished Faculty</span>
              </ParallaxLayer>
              <ParallaxLayer z={28}>
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/25 transition-all shadow-sm">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </ParallaxLayer>
            </div>
            <div>
              <ParallaxLayer z={22}>
                <div className="text-2xl font-black text-white font-mono tabular-nums tracking-tight">
                  {activeFaculty} Chairs
                </div>
              </ParallaxLayer>

              {/* D3 Mini Sparkline for Faculty Session Delivery */}
              <ParallaxLayer z={16} className="my-2.5">
                <D3Sparkline
                  data={[110, 114, 112, 118, 122, 125, 121, 126, 128, 132, 130, 135, 138, 142]}
                  color="#6366f1"
                  height={32}
                  unit=" hrs"
                  label="14D Session Deliveries"
                />
              </ParallaxLayer>

              <ParallaxLayer z={14}>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <span>1:15 Faculty-Student Ratio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ml-auto text-slate-400" />
                </div>
              </ParallaxLayer>
            </div>
          </div>
        </TiltCard>

        {/* Card 3: Attendance */}
        <TiltCard 
          maxTilt={maxTilt} 
          glare={is3DActive} 
          onClick={() => onNavigate('attendance')} 
          className="rounded-2xl cursor-pointer"
        >
          <div className="bg-slate-900/70 border border-slate-800/90 hover:border-emerald-500/60 rounded-2xl p-5 space-y-3 transition-all shadow-md group h-full backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400">
              <ParallaxLayer z={12}>
                <span className="text-xs font-semibold text-slate-300">Overall Attendance Rate</span>
              </ParallaxLayer>
              <ParallaxLayer z={28}>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/25 transition-all shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </ParallaxLayer>
            </div>
            <div>
              <ParallaxLayer z={22}>
                <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums tracking-tight">
                  {avgAttendance}%
                </div>
              </ParallaxLayer>

              {/* D3 Mini Sparkline for Attendance Volatility */}
              <ParallaxLayer z={16} className="my-2.5">
                <D3Sparkline
                  data={[86.5, 87.2, 85.9, 88.4, 89.8, 91.2, 89.5, 91.8, 92.4, 93.8, 93.1, 94.4, 94.8, 95.5]}
                  color="#10b981"
                  height={32}
                  unit="%"
                  label="14D Daily Attendance Volatility"
                />
              </ParallaxLayer>

              <ParallaxLayer z={14}>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <span>Threshold: 75.0% Mandatory</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ml-auto text-slate-400" />
                </div>
              </ParallaxLayer>
            </div>
          </div>
        </TiltCard>

        {/* Card 4: Fee Collections & Dues */}
        <TiltCard 
          maxTilt={maxTilt} 
          glare={is3DActive} 
          onClick={() => onNavigate('fees')} 
          className="rounded-2xl cursor-pointer"
        >
          <div className="bg-slate-900/70 border border-slate-800/90 hover:border-amber-500/60 rounded-2xl p-5 space-y-3 transition-all shadow-md group h-full backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400">
              <ParallaxLayer z={12}>
                <span className="text-xs font-semibold text-slate-300">Tuition Collections</span>
              </ParallaxLayer>
              <ParallaxLayer z={28}>
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/25 transition-all shadow-sm">
                  <DollarSign className="w-4 h-4" />
                </div>
              </ParallaxLayer>
            </div>
            <div>
              <ParallaxLayer z={22}>
                <div className="text-2xl font-black text-white font-mono tabular-nums tracking-tight">
                  ${(totalCollectedFees / 1000).toFixed(1)}k
                </div>
              </ParallaxLayer>

              {/* D3 Mini Sparkline for Tuition Collection Velocity */}
              <ParallaxLayer z={16} className="my-2.5">
                <D3Sparkline
                  data={[380, 410, 440, 485, 530, 590, 640, 710, 780, 840, 910, 970, 1040, 1120]}
                  color="#f59e0b"
                  height={32}
                  prefix="$"
                  unit="k"
                  label="14D Inflow Settlement Pace"
                />
              </ParallaxLayer>

              <ParallaxLayer z={14}>
                <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1 mt-1">
                  <span>Pending Dues: ${(totalPendingDues / 1000).toFixed(1)}k</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ml-auto text-slate-400" />
                </div>
              </ParallaxLayer>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* High-Priority Early Warning Alerts Card with 3D Parallax Hover */}
      {activeWarningsCount > 0 && (
        <TiltCard 
          maxTilt={Math.min(maxTilt, 5)} 
          glare={is3DActive} 
          onClick={() => onNavigate('earlywarning')}
          className="rounded-2xl cursor-pointer"
        >
          <div className="p-4 bg-rose-950/25 border border-rose-800/40 hover:border-rose-500/60 rounded-2xl flex items-center justify-between gap-4 transition-all shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3.5">
              <ParallaxLayer z={26}>
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-md">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </ParallaxLayer>
              <ParallaxLayer z={14}>
                <div>
                  <h4 className="text-xs font-bold text-rose-300">
                    {activeWarningsCount} Students Flagged for Academic Support Intervention
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Attendance shortages or recent assessment declines detected. Click to review mentorship cases.
                  </p>
                </div>
              </ParallaxLayer>
            </div>

            <ParallaxLayer z={28}>
              <button className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shrink-0 shadow-md hover:shadow-rose-600/30 transition-all flex items-center gap-1.5">
                <span>Review Cases</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </ParallaxLayer>
          </div>
        </TiltCard>
      )}

      {/* Campus-Wide Learning Streak & Milestone Goals Tracker with Animated Progress Ring */}
      <LearningStreakTracker 
        maxTilt={Math.min(maxTilt, 6)}
        is3DActive={is3DActive}
        onNavigate={onNavigate}
      />

      {/* D3-based Longitudinal Engagement & Performance Trends Analytics */}
      <PerformanceTrendsChart />

      {/* Analytics & Department Breakdown Grid with 3D Parallax Depth */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Department Enrollment Breakdown Card (7 Cols) */}
        <div className="lg:col-span-7">
          <TiltCard maxTilt={Math.min(maxTilt, 5)} glare={is3DActive} className="rounded-2xl h-full">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <ParallaxLayer z={14}>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-400" />
                    Academic Department Enrollments & Capacity
                  </h3>
                </ParallaxLayer>
                <ParallaxLayer z={18}>
                  <span className="text-xs text-purple-400/90 font-mono bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                    5 Total Schools
                  </span>
                </ParallaxLayer>
              </div>

              <div className="space-y-3 pt-1">
                {departments.map(d => (
                  <div 
                    key={d.id} 
                    className="p-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/80 hover:border-purple-500/40 transition-all parallax-card-subtle space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-400 font-mono text-[11px] bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-800/40">
                          {d.code}
                        </span>
                        <span className="text-slate-200 font-medium">{d.name}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px] tabular-nums">
                        {d.studentCount} Students · {d.facultyCount} Faculty
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (d.studentCount / 450) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Institutional Quick Actions Card with Individual 3D Parallax Items (5 Cols) */}
        <div className="lg:col-span-5">
          <TiltCard maxTilt={Math.min(maxTilt, 5)} glare={is3DActive} className="rounded-2xl h-full">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <ParallaxLayer z={14}>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Institutional Quick Actions
                  </h3>
                </ParallaxLayer>
                <ParallaxLayer z={18}>
                  <span className="text-xs text-slate-400 font-mono">Interactive Links</span>
                </ParallaxLayer>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Action 1 */}
                <TiltCard 
                  maxTilt={maxTilt} 
                  scale={1.02} 
                  glare={is3DActive} 
                  onClick={() => onNavigate('campus3d')}
                  className="rounded-xl cursor-pointer"
                >
                  <div className="p-3 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-purple-500/60 rounded-xl text-left flex items-center justify-between transition-all group shadow-sm">
                    <div>
                      <ParallaxLayer z={14}>
                        <div className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-purple-400" />
                          <span>Spatial 3D Digital Campus</span>
                        </div>
                      </ParallaxLayer>
                      <ParallaxLayer z={8}>
                        <div className="text-[11px] text-slate-400 mt-0.5">Interactive Three.js campus buildings & facilities</div>
                      </ParallaxLayer>
                    </div>
                    <ParallaxLayer z={24}>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </ParallaxLayer>
                  </div>
                </TiltCard>

                {/* Action 2: 3D Analytics Matrix */}
                <TiltCard 
                  maxTilt={maxTilt} 
                  scale={1.03} 
                  glare={is3DActive} 
                  onClick={() => onNavigate('analytics3d')}
                  className="rounded-xl cursor-pointer"
                >
                  <div className="p-3 bg-gradient-to-r from-purple-950/40 via-slate-950 to-cyan-950/40 hover:from-purple-900/60 hover:to-cyan-900/50 border border-purple-500/40 hover:border-cyan-400/80 rounded-xl text-left flex items-center justify-between transition-all group shadow-md shadow-purple-950/40">
                    <div>
                      <ParallaxLayer z={14}>
                        <div className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                          <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent group-hover:from-white group-hover:to-cyan-200">
                            3D Analytics Matrix
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                            3D LIVE
                          </span>
                        </div>
                      </ParallaxLayer>
                      <ParallaxLayer z={8}>
                        <div className="text-[11px] text-slate-400 mt-0.5">Volumetric WebGL matrix · Kinetic waves & multi-axis telemetry</div>
                      </ParallaxLayer>
                    </div>
                    <ParallaxLayer z={24}>
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/30 border border-cyan-500/30 group-hover:border-cyan-400 flex items-center justify-center transition-all">
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </ParallaxLayer>
                  </div>
                </TiltCard>

                {/* Action 3 */}
                <TiltCard 
                  maxTilt={maxTilt} 
                  scale={1.02} 
                  glare={is3DActive} 
                  onClick={() => onNavigate('simulation')}
                  className="rounded-xl cursor-pointer"
                >
                  <div className="p-3 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-purple-500/60 rounded-xl text-left flex items-center justify-between transition-all group shadow-sm">
                    <div>
                      <ParallaxLayer z={14}>
                        <div className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Academic Simulation Lab</span>
                        </div>
                      </ParallaxLayer>
                      <ParallaxLayer z={8}>
                        <div className="text-[11px] text-slate-400 mt-0.5">What-if GPA trajectories with live sliders</div>
                      </ParallaxLayer>
                    </div>
                    <ParallaxLayer z={24}>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </ParallaxLayer>
                  </div>
                </TiltCard>

                {/* Action 4 */}
                <TiltCard 
                  maxTilt={maxTilt} 
                  scale={1.02} 
                  glare={is3DActive} 
                  onClick={() => onNavigate('exams')}
                  className="rounded-xl cursor-pointer"
                >
                  <div className="p-3 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-purple-500/60 rounded-xl text-left flex items-center justify-between transition-all group shadow-sm">
                    <div>
                      <ParallaxLayer z={14}>
                        <div className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Examinations & Grades</span>
                        </div>
                      </ParallaxLayer>
                      <ParallaxLayer z={8}>
                        <div className="text-[11px] text-slate-400 mt-0.5">Generate verified official grade transcripts</div>
                      </ParallaxLayer>
                    </div>
                    <ParallaxLayer z={24}>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </ParallaxLayer>
                  </div>
                </TiltCard>

                {/* Action 5 */}
                <TiltCard 
                  maxTilt={maxTilt} 
                  scale={1.02} 
                  glare={is3DActive} 
                  onClick={() => onNavigate('placement')}
                  className="rounded-xl cursor-pointer"
                >
                  <div className="p-3 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-purple-500/60 rounded-xl text-left flex items-center justify-between transition-all group shadow-sm">
                    <div>
                      <ParallaxLayer z={14}>
                        <div className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Corporate Placement Drives</span>
                        </div>
                      </ParallaxLayer>
                      <ParallaxLayer z={8}>
                        <div className="text-[11px] text-slate-400 mt-0.5">Track candidate pipelines, CTC, and offers</div>
                      </ParallaxLayer>
                    </div>
                    <ParallaxLayer z={24}>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </ParallaxLayer>
                  </div>
                </TiltCard>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>

      {/* Additional 3D Parallax Dashboard Cards: Real-Time Telemetry & Upcoming Academic Deadlines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Card: Smart Campus Facility Live Pulse */}
        <TiltCard maxTilt={Math.min(maxTilt, 6)} glare={is3DActive} className="rounded-2xl">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <ParallaxLayer z={14}>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Real-time Smart Campus Facility Telemetry
                </h3>
              </ParallaxLayer>
              <ParallaxLayer z={20}>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Live Sync
                </span>
              </ParallaxLayer>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Telemetry 1 */}
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 space-y-1.5 parallax-card-subtle">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>AI Neural Labs</span>
                  <span className="text-emerald-400 font-mono font-semibold">94%</span>
                </div>
                <div className="text-base font-bold text-white font-mono">112 / 120 GPUs</div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[94%] rounded-full" />
                </div>
              </div>

              {/* Telemetry 2 */}
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 space-y-1.5 parallax-card-subtle">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Quantum Cleanroom</span>
                  <span className="text-emerald-400 font-mono font-semibold">Nominal</span>
                </div>
                <div className="text-base font-bold text-white font-mono">20.4°C · ISO 4</div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[78%] rounded-full" />
                </div>
              </div>

              {/* Telemetry 3 */}
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 space-y-1.5 parallax-card-subtle">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Smart Library Seats</span>
                  <span className="text-amber-400 font-mono font-semibold">82%</span>
                </div>
                <div className="text-base font-bold text-white font-mono">372 / 450 Seats</div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[82%] rounded-full" />
                </div>
              </div>

              {/* Telemetry 4 */}
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 space-y-1.5 parallax-card-subtle">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Microgrid Solar Yield</span>
                  <span className="text-emerald-400 font-mono font-semibold">Active</span>
                </div>
                <div className="text-base font-bold text-white font-mono">480 kW Peak</div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[88%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Card: Key Academic Deadlines & Milestones */}
        <TiltCard maxTilt={Math.min(maxTilt, 6)} glare={is3DActive} className="rounded-2xl">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <ParallaxLayer z={14}>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Academic Calendar Deadlines & Milestones
                </h3>
              </ParallaxLayer>
              <ParallaxLayer z={18}>
                <span className="text-xs text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  Upcoming
                </span>
              </ParallaxLayer>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 flex items-center justify-between parallax-card-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 font-mono font-bold text-xs">
                    03d
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Mid-Term Examination Schedule Publication</div>
                    <div className="text-[11px] text-slate-400">Provisional hall ticket and seat matrix release</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                  Oct 24
                </span>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 flex items-center justify-between parallax-card-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 font-mono font-bold text-xs">
                    06d
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">IEEE Research Paper Submission Deadline</div>
                    <div className="text-[11px] text-slate-400">Department peer-review before university endorsement</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">
                  Oct 27
                </span>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 flex items-center justify-between parallax-card-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-mono font-bold text-xs">
                    12d
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Google & DeepMind Placement Drive Phase 1</div>
                    <div className="text-[11px] text-slate-400">Technical round for 4th year eligible scholars</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  Nov 02
                </span>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}

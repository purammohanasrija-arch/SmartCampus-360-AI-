import React, { useState } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  Save, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles,
  Award,
  ArrowRight
} from 'lucide-react';
import { Student } from '../../types/campus';

interface WhatIfSimulationLabProps {
  currentStudent: Student;
}

interface SavedScenario {
  id: string;
  name: string;
  internalMarks: number;
  finalsExpected: number;
  attendance: number;
  studyHours: number;
  projectedSGPA: number;
  projectedCGPA: number;
}

export function WhatIfSimulationLab({ currentStudent }: WhatIfSimulationLabProps) {
  // Baseline initial state
  const [internalScore, setInternalScore] = useState(88);
  const [finalExamExpected, setFinalExamExpected] = useState(85);
  const [targetAttendance, setTargetAttendance] = useState(Math.round(currentStudent.attendancePercentage));
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(18);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([
    {
      id: 'sc-1',
      name: 'High Distinction Sprint',
      internalScore: 95,
      finalsExpected: 92,
      attendance: 96,
      studyHours: 25,
      projectedSGPA: 9.6,
      projectedCGPA: 9.15,
    } as any,
    {
      id: 'sc-2',
      name: 'Balanced Realistic Baseline',
      internalScore: 85,
      finalsExpected: 80,
      attendance: 88,
      studyHours: 15,
      projectedSGPA: 8.6,
      projectedCGPA: 8.87,
    } as any
  ]);
  const [scenarioNameInput, setScenarioNameInput] = useState('');

  // Course weights for Semester 6 (5 courses, 17 total credits)
  // Credit allocation: CS601(4), CS602(4), CS603(3), CS604(3), CS605(3)
  const totalCredits = 17;
  const previousTotalCredits = 5 * 20; // 100 credits prior to sem 6
  const previousCGPA = currentStudent.cgpa; // e.g. 8.92

  // Calculation: Composite Course Score = (Internal * 0.3) + (Finals * 0.7)
  const compositeScore = (internalScore * 0.3) + (finalExamExpected * 0.7);

  // Convert composite score to 10-point GPA scale:
  // 90-100: 10.0 (O)
  // 80-89: 9.0 (A+)
  // 70-79: 8.0 (A)
  // 60-69: 7.0 (B+)
  // 50-59: 6.0 (B)
  // <50: 0.0 (F)
  const getGPAPoint = (score: number) => {
    if (score >= 90) return 10.0;
    if (score >= 80) return 9.0;
    if (score >= 70) return 8.0;
    if (score >= 60) return 7.0;
    if (score >= 50) return 6.0;
    return 0.0;
  };

  const projectedSGPA = Number(((compositeScore / 100) * 10).toFixed(2));
  // Cumulative CGPA projection = (PreviousCredits * PreviousCGPA + CurrentCredits * CurrentSGPA) / TotalCredits
  const projectedCGPA = Number(
    ((previousTotalCredits * previousCGPA + totalCredits * projectedSGPA) / (previousTotalCredits + totalCredits)).toFixed(2)
  );

  const cgpaDelta = Number((projectedCGPA - previousCGPA).toFixed(2));

  // Minimum final exam score required to achieve CGPA >= 9.0
  // Required SGPA = (9.0 * 117 - 100 * 8.92) / 17 = (1053 - 892) / 17 = 161 / 17 = 9.47 SGPA (Score: 94.7)
  // Score = Int * 0.3 + Final * 0.7 => Final = (94.7 - Int * 0.3) / 0.7
  const requiredScoreForDistinction = Math.max(0, Math.min(100, Math.round((92 - internalScore * 0.3) / 0.7)));

  const handleReset = () => {
    setInternalScore(88);
    setFinalExamExpected(85);
    setTargetAttendance(Math.round(currentStudent.attendancePercentage));
    setWeeklyStudyHours(18);
  };

  const handleSaveScenario = () => {
    if (!scenarioNameInput.trim()) return;
    const newSc: SavedScenario = {
      id: `sc-${Date.now()}`,
      name: scenarioNameInput.trim(),
      internalMarks: internalScore,
      finalsExpected: finalExamExpected,
      attendance: targetAttendance,
      studyHours: weeklyStudyHours,
      projectedSGPA,
      projectedCGPA,
    };
    setSavedScenarios([newSc, ...savedScenarios]);
    setScenarioNameInput('');
  };

  const loadScenario = (sc: SavedScenario) => {
    setInternalScore(sc.internalMarks);
    setFinalExamExpected(sc.finalsExpected);
    setTargetAttendance(sc.attendance);
    setWeeklyStudyHours(sc.studyHours);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span>Predictive Analytics</span>
            <span aria-hidden="true">·</span>
            <span>What-If Simulation Lab</span>
            <span aria-hidden="true">·</span>
            <span>Non-Destructive Sandboxing</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Academic What-If Simulation Lab</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Test hypothetical internal marks, attendance rates, and examination scenarios to model your cumulative CGPA trajectory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFormulaModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Formula Specs</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sliders</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sliders (7 cols) + Projection Gauges (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              Hypothetical Simulation Parameters
            </h3>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
              Live Recalculation
            </span>
          </div>

          {/* Slider 1: Internal Assessment Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Hypothetical Internal Assessment (30% Weightage)</span>
              <span className="text-white font-mono font-bold text-sm tabular-nums">{internalScore} / 100</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={internalScore}
              onChange={e => setInternalScore(Number(e.target.value))}
              className="w-full accent-purple-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Min Pass: 40</span>
              <span>Class Avg: 78</span>
              <span>Perfect: 100</span>
            </div>
          </div>

          {/* Slider 2: Expected Final Examination Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Expected End-Semester Exam Score (70% Weightage)</span>
              <span className="text-white font-mono font-bold text-sm tabular-nums">{finalExamExpected} / 100</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={finalExamExpected}
              onChange={e => setFinalExamExpected(Number(e.target.value))}
              className="w-full accent-purple-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Passing: 40</span>
              <span>Distinction Target: 85+</span>
              <span>100</span>
            </div>
          </div>

          {/* Slider 3: Target Attendance Percentage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Projected Attendance Rate</span>
              <span className={`font-mono font-bold text-sm tabular-nums ${targetAttendance < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {targetAttendance}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={targetAttendance}
              onChange={e => setTargetAttendance(Number(e.target.value))}
              className={`w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer ${
                targetAttendance < 75 ? 'accent-rose-500' : 'accent-emerald-500'
              }`}
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Severe Risk: 50%</span>
              <span className="text-amber-400 font-bold">Mandatory Threshold: 75%</span>
              <span>100%</span>
            </div>
            {targetAttendance < 75 && (
              <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Attendance below 75% will block exam hall ticket issuance without formal medical condonation.</span>
              </div>
            )}
          </div>

          {/* Slider 4: Weekly Dedicated Study Hours */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Weekly Targeted Revision Hours</span>
              <span className="text-purple-300 font-mono font-bold text-sm tabular-nums">{weeklyStudyHours} hrs / wk</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={weeklyStudyHours}
              onChange={e => setWeeklyStudyHours(Number(e.target.value))}
              className="w-full accent-purple-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Light: 5h</span>
              <span>Recommended: 18h</span>
              <span>Intensive: 40h</span>
            </div>
          </div>

          {/* Save Scenario Form */}
          <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Name this scenario (e.g., Final Sprint Push)..."
              value={scenarioNameInput}
              onChange={e => setScenarioNameInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSaveScenario}
              disabled={!scenarioNameInput.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Scenario</span>
            </button>
          </div>
        </div>

        {/* Projections & Outcome Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Outcome Card */}
          <div className="bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Projected Academic Metric
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${cgpaDelta >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                {cgpaDelta >= 0 ? `+${cgpaDelta}` : cgpaDelta} CGPA Delta
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-xs text-slate-400">Projected SGPA</span>
                <div className="text-3xl font-extrabold text-white mt-1 font-mono tabular-nums">{projectedSGPA}</div>
                <span className="text-[11px] text-slate-500">Current Semester 6</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-purple-500/30">
                <span className="text-xs text-purple-300">Cumulative CGPA</span>
                <div className="text-3xl font-extrabold text-purple-300 mt-1 font-mono tabular-nums">{projectedCGPA}</div>
                <span className="text-[11px] text-slate-500">All 6 Semesters</span>
              </div>
            </div>

            {/* Target Distinction Analysis */}
            <div className="mt-5 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Award className="w-4 h-4 text-amber-400" />
                  Target for Distinction (CGPA &gt;= 9.0)
                </span>
                <span className="text-amber-400 font-mono font-bold">
                  {requiredScoreForDistinction <= 100 ? `${requiredScoreForDistinction}% in Finals` : 'Mathematically out of reach'}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                With an internal assessment of {internalScore}%, you need at least {requiredScoreForDistinction}% on the final examination to cross the 9.0 distinction threshold.
              </p>
            </div>
          </div>

          {/* Saved Scenarios Comparison List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Saved Simulation Scenarios ({savedScenarios.length})
            </h4>

            <div className="space-y-2">
              {savedScenarios.map(sc => (
                <div 
                  key={sc.id}
                  onClick={() => loadScenario(sc)}
                  className="p-3 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-purple-500/50 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors">{sc.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Int: {sc.internalMarks}% · Finals: {sc.finalsExpected}% · Att: {sc.attendance}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-purple-400 font-mono tabular-nums">{sc.projectedCGPA} CGPA</div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                      <span>Load</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Formula Specifications Dialog */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                University Grading & Weightage Formulas
              </h3>
              <button 
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-white text-xs font-medium px-2 py-1 bg-slate-800 rounded"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="text-purple-400 font-bold">1. Composite Course Score (CCS):</span>
                <p>CCS = (Internal_Marks × 0.30) + (End_Sem_Marks × 0.70)</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="text-purple-400 font-bold">2. Semester Grade Point Average (SGPA):</span>
                <p>SGPA = ∑(Course_Credits × Grade_Point) / ∑(Course_Credits)</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="text-purple-400 font-bold">3. Cumulative Grade Point Average (CGPA):</span>
                <p>CGPA = ∑(All_Semester_Credits × Semester_SGPA) / ∑(All_Semester_Credits)</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="text-purple-400 font-bold">4. Statutory Attendance Constraint:</span>
                <p className="text-slate-400">Attendance &lt; 75% triggers automated early warning and exam hall ticket hold pursuant to Academic Statute Section 14.B.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

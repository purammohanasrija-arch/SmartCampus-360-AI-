import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  TrendingUp, 
  Layers, 
  Calendar, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Filter,
  Eye,
  Info
} from 'lucide-react';
import { TiltCard, ParallaxLayer } from '../common/TiltCard';

export interface EngagementDataPoint {
  week: string; // e.g. "Wk 01"
  weekNum: number;
  label: string; // e.g. "Week 1 (Orientation)"
  attendance: number; // percentage 0-100
  assignments: number; // percentage 0-100
  assessments: number; // percentage 0-100
  compositeEngagement: number; // calculated score
  milestone?: string; // annotation
}

const DEFAULT_TREND_DATA: EngagementDataPoint[] = [
  { week: 'Wk 1', weekNum: 1, label: 'Week 1: Term Onboarding', attendance: 92, assignments: 76, assessments: 70, compositeEngagement: 80.5, milestone: 'Semester Kickoff' },
  { week: 'Wk 2', weekNum: 2, label: 'Week 2: Core Foundations', attendance: 89, assignments: 81, assessments: 73, compositeEngagement: 82.2 },
  { week: 'Wk 3', weekNum: 3, label: 'Week 3: Lab Explorations', attendance: 88, assignments: 84, assessments: 76, compositeEngagement: 83.6 },
  { week: 'Wk 4', weekNum: 4, label: 'Week 4: Assignment Cycle 1', attendance: 84, assignments: 79, assessments: 74, compositeEngagement: 80.1, milestone: '1st Assignment Wave' },
  { week: 'Wk 5', weekNum: 5, label: 'Week 5: Midterm Prep', attendance: 91, assignments: 86, assessments: 81, compositeEngagement: 86.8 },
  { week: 'Wk 6', weekNum: 6, label: 'Week 6: Mid-Term Assessments', attendance: 96, assignments: 91, assessments: 85, compositeEngagement: 91.2, milestone: 'Midterm Evaluations' },
  { week: 'Wk 7', weekNum: 7, label: 'Week 7: Project Scoping', attendance: 87, assignments: 85, assessments: 80, compositeEngagement: 84.5 },
  { week: 'Wk 8', weekNum: 8, label: 'Week 8: Capstone Sprints', attendance: 90, assignments: 88, assessments: 83, compositeEngagement: 87.6 },
  { week: 'Wk 9', weekNum: 9, label: 'Week 9: Hackathon & IEEE Week', attendance: 95, assignments: 94, assessments: 89, compositeEngagement: 93.1, milestone: 'Annual Hackathon' },
  { week: 'Wk 10', weekNum: 10, label: 'Week 10: Final Project Reviews', attendance: 93, assignments: 92, assessments: 88, compositeEngagement: 91.4 },
  { week: 'Wk 11', weekNum: 11, label: 'Week 11: Revision & Seminars', attendance: 94, assignments: 95, assessments: 91, compositeEngagement: 93.5 },
  { week: 'Wk 12', weekNum: 12, label: 'Week 12: Finals Prep & Portfolios', attendance: 97, assignments: 96, assessments: 93, compositeEngagement: 95.6, milestone: 'Final Submissions' }
];

type MetricKey = 'attendance' | 'assignments' | 'assessments' | 'compositeEngagement';

interface MetricConfig {
  key: MetricKey;
  label: string;
  color: string;
  gradientId: string;
  strokeDasharray?: string;
}

const METRIC_CONFIGS: MetricConfig[] = [
  { key: 'compositeEngagement', label: 'Composite Engagement Index', color: '#a855f7', gradientId: 'grad-composite' },
  { key: 'attendance', label: 'Attendance Compliance', color: '#10b981', gradientId: 'grad-attendance' },
  { key: 'assignments', label: 'LMS Assignment Rate', color: '#38bdf8', gradientId: 'grad-assignments' },
  { key: 'assessments', label: 'Assessment Scores', color: '#f59e0b', gradientId: 'grad-assessments' }
];

export function PerformanceTrendsChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [activeMetrics, setActiveMetrics] = useState<Record<MetricKey, boolean>>({
    compositeEngagement: true,
    attendance: true,
    assignments: true,
    assessments: false
  });

  const [timeRange, setTimeRange] = useState<'12w' | '6w'>('12w');
  const [selectedCohort, setSelectedCohort] = useState<'all' | 'cse' | 'ece' | 'mech'>('all');
  const [hoveredPoint, setHoveredPoint] = useState<EngagementDataPoint | null>(null);

  // Compute filtered dataset
  const chartData = useMemo(() => {
    let data = [...DEFAULT_TREND_DATA];
    if (timeRange === '6w') {
      data = data.slice(-6);
    }
    // Subtle variance based on selected cohort filter
    if (selectedCohort === 'cse') {
      data = data.map(d => ({
        ...d,
        attendance: Math.min(100, d.attendance + 2),
        assignments: Math.min(100, d.assignments + 3),
        compositeEngagement: Math.min(100, +(d.compositeEngagement + 2.5).toFixed(1))
      }));
    } else if (selectedCohort === 'ece') {
      data = data.map(d => ({
        ...d,
        attendance: Math.min(100, d.attendance + 1),
        assessments: Math.min(100, d.assessments + 2),
        compositeEngagement: Math.min(100, +(d.compositeEngagement + 1.2).toFixed(1))
      }));
    } else if (selectedCohort === 'mech') {
      data = data.map(d => ({
        ...d,
        attendance: Math.max(70, d.attendance - 1),
        compositeEngagement: Math.max(70, +(d.compositeEngagement - 0.8).toFixed(1))
      }));
    }
    return data;
  }, [timeRange, selectedCohort]);

  // Aggregate telemetry
  const latestEngagement = chartData[chartData.length - 1].compositeEngagement;
  const initialEngagement = chartData[0].compositeEngagement;
  const netDelta = (latestEngagement - initialEngagement).toFixed(1);
  const isPositive = +netDelta >= 0;

  const toggleMetric = (key: MetricKey) => {
    setActiveMetrics(prev => {
      // Ensure at least one metric remains active
      const next = { ...prev, [key]: !prev[key] };
      if (!Object.values(next).some(Boolean)) return prev;
      return next;
    });
  };

  // D3 Chart Rendering Engine
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clean prior rendering

    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.max(320, rect.width || 700);
    const height = 310;
    const margin = { top: 25, right: 30, bottom: 40, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const defs = svg.append('defs');

    // Create glowing area fill gradients for each metric
    METRIC_CONFIGS.forEach(metric => {
      const gradient = defs
        .append('linearGradient')
        .attr('id', metric.gradientId)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', metric.color)
        .attr('stop-opacity', 0.35);

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', metric.color)
        .attr('stop-opacity', 0.0);
    });

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale: Point scale across weeks
    const xScale = d3
      .scalePoint<string>()
      .domain(chartData.map(d => d.week))
      .range([0, innerWidth])
      .padding(0.2);

    // Y Scale: 60% to 100% for fine-grained engagement visibility
    const yScale = d3
      .scaleLinear()
      .domain([65, 100])
      .range([innerHeight, 0])
      .nice();

    // Horizontal Subtle Grid Lines
    const yGrid = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSize(-innerWidth)
      .tickFormat(() => '');

    g.append('g')
      .attr('class', 'grid text-slate-800')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', '#1e293b')
      .attr('stroke-dasharray', '3 3')
      .attr('stroke-opacity', 0.6);

    g.select('.domain').remove();

    // Render Milestone Markers (vertical shaded bands for key events like Midterms, Hackathons)
    chartData.forEach(d => {
      if (d.milestone) {
        const xPos = xScale(d.week);
        if (xPos !== undefined) {
          // Subtle milestone flag pin
          g.append('line')
            .attr('x1', xPos)
            .attr('x2', xPos)
            .attr('y1', 0)
            .attr('y2', innerHeight)
            .attr('stroke', '#8b5cf6')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4 4')
            .attr('opacity', 0.45);

          g.append('circle')
            .attr('cx', xPos)
            .attr('cy', 8)
            .attr('r', 3)
            .attr('fill', '#a855f7');
        }
      }
    });

    // Render Metric Series (Area + Smooth Line)
    METRIC_CONFIGS.forEach(metric => {
      if (!activeMetrics[metric.key]) return;

      const areaGenerator = d3
        .area<EngagementDataPoint>()
        .x(d => xScale(d.week) || 0)
        .y0(innerHeight)
        .y1(d => yScale(d[metric.key]))
        .curve(d3.curveMonotoneX);

      const lineGenerator = d3
        .line<EngagementDataPoint>()
        .x(d => xScale(d.week) || 0)
        .y(d => yScale(d[metric.key]))
        .curve(d3.curveMonotoneX);

      // Area Fill
      g.append('path')
        .datum(chartData)
        .attr('fill', `url(#${metric.gradientId})`)
        .attr('d', areaGenerator);

      // Stroke Line
      const path = g
        .append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', metric.color)
        .attr('stroke-width', metric.key === 'compositeEngagement' ? 2.8 : 2)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', lineGenerator);

      // Animate line path drawing
      const totalLength = (path.node() as SVGPathElement)?.getTotalLength?.() || 1000;
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(800)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);

      // Data Circles
      g.selectAll(`.dot-${metric.key}`)
        .data(chartData)
        .enter()
        .append('circle')
        .attr('class', `dot-${metric.key}`)
        .attr('cx', d => xScale(d.week) || 0)
        .attr('cy', d => yScale(d[metric.key]))
        .attr('r', metric.key === 'compositeEngagement' ? 4 : 3)
        .attr('fill', '#090d16')
        .attr('stroke', metric.color)
        .attr('stroke-width', 2);
    });

    // Custom Styled X Axis
    const xAxis = d3.axisBottom(xScale);
    const xAxisGroup = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisGroup.select('.domain').attr('stroke', '#334155');
    xAxisGroup
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '11px')
      .attr('font-family', 'var(--font-mono)')
      .attr('dy', '1.2em');

    xAxisGroup.selectAll('line').attr('stroke', '#334155');

    // Custom Styled Y Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${d}%`);

    const yAxisGroup = g.append('g').call(yAxis);
    yAxisGroup.select('.domain').remove();
    yAxisGroup
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '10px')
      .attr('font-family', 'var(--font-mono)');

    yAxisGroup.selectAll('line').remove();

    // Interactive Hover Tracking Plane
    const hoverGroup = g.append('g').style('display', 'none');

    // Vertical Crosshair
    const crosshair = hoverGroup
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#c084fc')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3 3')
      .attr('opacity', 0.85);

    // Glowing indicator circle for hovered composite engagement
    const hoverCircle = hoverGroup
      .append('circle')
      .attr('r', 6)
      .attr('fill', '#a855f7')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    // Invisible transparent overlay to capture pointer events
    const overlay = g
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    overlay
      .on('mouseenter', () => {
        hoverGroup.style('display', null);
      })
      .on('mouseleave', () => {
        hoverGroup.style('display', 'none');
        setHoveredPoint(null);
      })
      .on('mousemove', function (event: MouseEvent) {
        const [pointerX] = d3.pointer(event);

        // Find nearest week data point
        let closestPoint = chartData[0];
        let minDistance = Infinity;

        chartData.forEach(d => {
          const xPos = xScale(d.week) || 0;
          const distance = Math.abs(xPos - pointerX);
          if (distance < minDistance) {
            minDistance = distance;
            closestPoint = d;
          }
        });

        const targetX = xScale(closestPoint.week) || 0;
        const targetY = yScale(closestPoint.compositeEngagement) || 0;

        crosshair.attr('x1', targetX).attr('x2', targetX);
        hoverCircle.attr('cx', targetX).attr('cy', targetY);

        setHoveredPoint(closestPoint);
      });

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = Math.max(320, containerRef.current.clientWidth);
      svg.attr('width', newWidth).attr('viewBox', `0 0 ${newWidth} ${height}`);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartData, activeMetrics]);

  return (
    <TiltCard maxTilt={5} glare={true} className="rounded-2xl w-full">
      <div 
        ref={containerRef}
        className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg backdrop-blur-sm relative"
      >
        {/* Top Header & Telemetry Badges */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <ParallaxLayer z={14}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>D3 Student Engagement & Performance Trajectory</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40 font-semibold">
                      D3.js Vectorized
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Real-time longitudinal telemetry correlating class attendance, LMS completions, and assessment milestones over time.
                  </p>
                </div>
              </div>
            </ParallaxLayer>
          </div>

          {/* Quick Metrics KPI summary chips */}
          <ParallaxLayer z={18}>
            <div className="flex items-center gap-3">
              <div className="bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-mono">Current Index</span>
                <span className="text-base font-extrabold text-purple-300 font-mono tabular-nums">
                  {latestEngagement}%
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-mono">Term Net Gain</span>
                <span className={`text-base font-extrabold font-mono tabular-nums flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? `+${netDelta}%` : `${netDelta}%`}
                </span>
              </div>

              {/* Range Filters */}
              <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 text-xs">
                <button
                  onClick={() => setTimeRange('12w')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    timeRange === '12w' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Full 12 Wks
                </button>
                <button
                  onClick={() => setTimeRange('6w')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    timeRange === '6w' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Last 6 Wks
                </button>
              </div>

              {/* Department Filter */}
              <select
                value={selectedCohort}
                onChange={e => setSelectedCohort(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-purple-500 font-medium"
              >
                <option value="all">Cohort: University Wide</option>
                <option value="cse">CSE Cohort</option>
                <option value="ece">ECE Cohort</option>
                <option value="mech">MECH Cohort</option>
              </select>
            </div>
          </ParallaxLayer>
        </div>

        {/* Metric Series Toggle Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-slate-500" />
            <span>Telemetry Series:</span>
          </span>

          {METRIC_CONFIGS.map(metric => {
            const isActive = activeMetrics[metric.key];
            return (
              <button
                key={metric.key}
                onClick={() => toggleMetric(metric.key)}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 border transition-all ${
                  isActive
                    ? 'border-transparent text-white shadow-sm'
                    : 'border-slate-800 bg-slate-950/50 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                }`}
                style={{
                  backgroundColor: isActive ? `${metric.color}25` : undefined,
                  borderColor: isActive ? metric.color : undefined
                }}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: metric.color }}
                />
                <span style={{ color: isActive ? '#f8fafc' : undefined }}>{metric.label}</span>
              </button>
            );
          })}
        </div>

        {/* SVG Visualization Canvas */}
        <div className="w-full relative overflow-hidden rounded-xl bg-slate-950/50 border border-slate-800/80 p-2">
          <svg ref={svgRef} className="w-full h-[310px] block overflow-visible select-none" />

          {/* Dynamic Interactive Tooltip Card */}
          {hoveredPoint && (
            <div 
              ref={tooltipRef}
              className="absolute top-4 right-4 bg-slate-900/95 border border-purple-500/50 rounded-xl p-3 shadow-2xl backdrop-blur-md pointer-events-none min-w-[210px] space-y-2 z-20"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-xs font-bold text-white font-mono">{hoveredPoint.label}</span>
                {hoveredPoint.milestone && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono font-medium">
                    {hoveredPoint.milestone}
                  </span>
                )}
              </div>

              <div className="space-y-1 text-xs">
                {activeMetrics.compositeEngagement && (
                  <div className="flex items-center justify-between text-purple-300 font-semibold font-mono">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      Composite Index:
                    </span>
                    <span>{hoveredPoint.compositeEngagement}%</span>
                  </div>
                )}
                {activeMetrics.attendance && (
                  <div className="flex items-center justify-between text-emerald-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Attendance:
                    </span>
                    <span>{hoveredPoint.attendance}%</span>
                  </div>
                )}
                {activeMetrics.assignments && (
                  <div className="flex items-center justify-between text-sky-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      Assignments:
                    </span>
                    <span>{hoveredPoint.assignments}%</span>
                  </div>
                )}
                {activeMetrics.assessments && (
                  <div className="flex items-center justify-between text-amber-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Assessments:
                    </span>
                    <span>{hoveredPoint.assessments}%</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Explanatory Context Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Hover across data curves to inspect crosshair coordinates and cohort milestone annotations.</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Source: Institutional LMS Telemetry & RFID Attendance Stream
          </span>
        </div>
      </div>
    </TiltCard>
  );
}

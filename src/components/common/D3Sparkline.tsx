import React, { useEffect, useRef, useState, useId } from 'react';
import * as d3 from 'd3';

interface D3SparklineProps {
  data: number[];
  labels?: string[];
  color?: string; // Stroke and gradient base color (e.g. #a855f7, #10b981, #f59e0b)
  height?: number; // Height in pixels (default 36)
  strokeWidth?: number; // Line thickness (default 1.8)
  fillOpacity?: number; // Area fill opacity (default 0.22)
  unit?: string; // Unit suffix e.g. "%", "k", " scholars"
  prefix?: string; // Unit prefix e.g. "$"
  label?: string; // Optional context label
}

export function D3Sparkline({
  data,
  labels,
  color = '#a855f7',
  height = 36,
  strokeWidth = 2,
  fillOpacity = 0.22,
  unit = '',
  prefix = '',
  label = '14-Day Daily Trend'
}: D3SparklineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const uniqueId = useId().replace(/:/g, '-');
  const gradientId = `spark-grad-${uniqueId}`;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(140);

  // Measure container width responsively
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Render D3 Sparkline
  useEffect(() => {
    if (!svgRef.current || data.length < 2) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = Math.max(80, containerWidth);
    const margin = { top: 4, right: 6, bottom: 4, left: 4 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const defs = svg.append('defs');

    // Linear Gradient Area Fill
    const gradient = defs
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', color)
      .attr('stop-opacity', fillOpacity);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0.0);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale: 0 to data.length - 1
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);

    // Y Scale with dynamic padding
    const minVal = d3.min(data) ?? 0;
    const maxVal = d3.max(data) ?? 100;
    const padding = (maxVal - minVal) * 0.15 || 1;

    const yScale = d3
      .scaleLinear()
      .domain([minVal - padding, maxVal + padding])
      .range([innerHeight, 0]);

    // Area Generator
    const areaGenerator = d3
      .area<number>()
      .x((_, i) => xScale(i))
      .y0(innerHeight)
      .y1(d => yScale(d))
      .curve(d3.curveMonotoneX);

    // Line Generator
    const lineGenerator = d3
      .line<number>()
      .x((_, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveMonotoneX);

    // Render Area
    g.append('path')
      .datum(data)
      .attr('fill', `url(#${gradientId})`)
      .attr('d', areaGenerator);

    // Render Stroke Path
    const path = g
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', lineGenerator);

    // Animate Line Path Entry
    const totalLength = (path.node() as SVGPathElement)?.getTotalLength?.() || 200;
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Last point pulsing dot
    const lastIdx = data.length - 1;
    const lastX = xScale(lastIdx);
    const lastY = yScale(data[lastIdx]);

    // Ambient glow halo
    g.append('circle')
      .attr('cx', lastX)
      .attr('cy', lastY)
      .attr('r', 4.5)
      .attr('fill', color)
      .attr('opacity', 0.35);

    // Endpoint core
    g.append('circle')
      .attr('cx', lastX)
      .attr('cy', lastY)
      .attr('r', 2.8)
      .attr('fill', '#ffffff')
      .attr('stroke', color)
      .attr('stroke-width', 1.5);

    // Interactive Hover Tracking Group
    const hoverGroup = g.append('g').style('display', 'none');

    const hoverLine = hoverGroup
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', color)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2 2')
      .attr('opacity', 0.8);

    const hoverDot = hoverGroup
      .append('circle')
      .attr('r', 3.5)
      .attr('fill', '#ffffff')
      .attr('stroke', color)
      .attr('stroke-width', 2);

    // Overlay to capture mouse events
    const overlay = g
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    overlay
      .on('mouseenter', () => hoverGroup.style('display', null))
      .on('mouseleave', () => {
        hoverGroup.style('display', 'none');
        setHoveredIndex(null);
      })
      .on('mousemove', function (event: MouseEvent) {
        const [pointerX] = d3.pointer(event);
        const idx = Math.min(
          data.length - 1,
          Math.max(0, Math.round(xScale.invert(pointerX)))
        );
        const targetX = xScale(idx);
        const targetY = yScale(data[idx]);

        hoverLine.attr('x1', targetX).attr('x2', targetX);
        hoverDot.attr('cx', targetX).attr('cy', targetY);
        setHoveredIndex(idx);
      });
  }, [data, containerWidth, color, height, strokeWidth, fillOpacity, gradientId]);

  const latestVal = data[data.length - 1];
  const firstVal = data[0];
  const diff = latestVal - firstVal;
  const isUp = diff >= 0;

  return (
    <div ref={containerRef} className="w-full space-y-1 relative group/spark">
      {/* Sparkline Canvas */}
      <div className="relative">
        <svg ref={svgRef} className="w-full block overflow-visible select-none" />

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div 
            className="absolute -top-7 right-0 bg-slate-950/95 border border-slate-700/80 rounded-md px-1.5 py-0.5 text-[10px] font-mono text-white shadow-lg pointer-events-none z-20 flex items-center gap-1 backdrop-blur-sm"
          >
            <span className="text-slate-400">
              {labels?.[hoveredIndex] || `D-${data.length - hoveredIndex}`}:
            </span>
            <span className="font-bold font-mono" style={{ color }}>
              {prefix}{data[hoveredIndex].toLocaleString()}{unit}
            </span>
          </div>
        )}
      </div>

      {/* Micro Status Footnote */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
        <span>{label}</span>
        <span className={isUp ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
          {isUp ? '▲' : '▼'} {Math.abs(diff).toFixed(1)}{unit}
        </span>
      </div>
    </div>
  );
}

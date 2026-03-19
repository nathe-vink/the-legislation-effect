"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import type { Law } from "@/lib/laws";

interface StoryChartProps {
  seriesData: {
    id: string;
    name: string;
    observations: { date: string; value: number | null }[];
    color: string;
  }[];
  laws: Law[];
  normalizeYear: number;
  dateRange?: [string, string];
  onLawClick?: (slug: string) => void;
}

function normalizeSeries(
  observations: { date: string; value: number | null }[],
  baselineYear: number
): { date: string; value: number | null }[] {
  const baseTime = new Date(`${baselineYear}-01-01`).getTime();
  let closest = observations[0];
  let closestDiff = Infinity;

  for (const obs of observations) {
    if (obs.value === null) continue;
    const diff = Math.abs(new Date(obs.date).getTime() - baseTime);
    if (diff < closestDiff) {
      closestDiff = diff;
      closest = obs;
    }
  }

  if (!closest || closest.value === null || closest.value === 0) {
    return observations;
  }

  const baseValue = closest.value;
  return observations.map((o) => ({
    date: o.date,
    value: o.value !== null ? (o.value / baseValue) * 100 : null,
  }));
}

export function StoryChart({
  seriesData,
  laws,
  normalizeYear,
  dateRange,
  onLawClick,
}: StoryChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 420 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDimensions({ width, height: Math.max(350, Math.min(420, width * 0.45)) });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const drawChart = useCallback(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    if (!svgRef.current) return;

    svg.selectAll("*").remove();

    // Compute right margin based on longest label
    const maxLabelLen = Math.max(...seriesData.map((s) => s.name.length), 10);
    const rightMargin = Math.min(200, Math.max(130, maxLabelLen * 7.5));
    const margin = { top: 16, right: rightMargin, bottom: 36, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // ClipPath to prevent lines from rendering outside the plot area
    svg.append("defs")
      .append("clipPath")
      .attr("id", "story-chart-clip")
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height);

    // Process & normalize data
    const processedSeries = seriesData.map((s) => {
      const obs = normalizeSeries(s.observations, normalizeYear);
      return {
        ...s,
        observations: obs.filter((o) => o.value !== null) as { date: string; value: number }[],
      };
    });

    const allDates = processedSeries.flatMap((s) =>
      s.observations.map((o) => new Date(o.date))
    );
    const allValues = processedSeries.flatMap((s) =>
      s.observations.map((o) => o.value)
    );

    if (allDates.length === 0) return;

    let xDomain = d3.extent(allDates) as [Date, Date];
    if (dateRange) {
      xDomain = [new Date(dateRange[0]), new Date(dateRange[1])];
    }
    const yExtent = d3.extent(allValues) as [number, number];
    const yPadding = (yExtent[1] - yExtent[0]) * 0.1;

    const x = d3.scaleTime().domain(xDomain).range([0, width]);
    const y = d3
      .scaleLinear()
      .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
      .range([height, 0]);

    // Blue notebook gridlines
    const yTicks = y.ticks(6);
    yTicks.forEach((tick) => {
      g.append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(tick))
        .attr("y2", y(tick))
        .attr("stroke", "rgba(150, 170, 200, 0.35)")
        .attr("stroke-width", 0.5);
    });

    // Axes
    const xAxis = d3.axisBottom(x).ticks(width > 600 ? 10 : 5);
    const yAxis = d3.axisLeft(y).ticks(6);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .attr("font-family", "'IBM Plex Mono', monospace")
      .attr("font-size", "10px")
      .attr("color", "var(--text-muted)")
      .selectAll("line, path")
      .attr("stroke", "var(--border-primary)");

    g.append("g")
      .call(yAxis)
      .attr("font-family", "'IBM Plex Mono', monospace")
      .attr("font-size", "10px")
      .attr("color", "var(--text-muted)")
      .selectAll("line, path")
      .attr("stroke", "var(--border-primary)");

    // Y-axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .attr("font-family", "'IBM Plex Mono', monospace")
      .attr("font-size", "9px")
      .attr("fill", "var(--text-muted)")
      .text(`Index (${normalizeYear} = 100)`);

    // Data lines (clipped to plot area)
    const linesGroup = g.append("g").attr("clip-path", "url(#story-chart-clip)");
    processedSeries.forEach((s) => {
      const line = d3
        .line<{ date: string; value: number }>()
        .x((d) => x(new Date(d.date)))
        .y((d) => y(d.value))
        .curve(d3.curveLinear);

      linesGroup.append("path")
        .datum(s.observations)
        .attr("fill", "none")
        .attr("stroke", s.color)
        .attr("stroke-width", 2.5)
        .attr("d", line);
    });

    // After computing all label positions, adjust for overlaps
    const labelPositions = processedSeries.map((s) => {
      const lastObs = s.observations[s.observations.length - 1];
      return lastObs ? { ...s, lx: x(new Date(lastObs.date)), ly: y(lastObs.value) } : null;
    }).filter(Boolean) as { name: string; color: string; lx: number; ly: number }[];

    // Sort by y position and push apart overlapping labels
    labelPositions.sort((a, b) => a.ly - b.ly);
    for (let i = 1; i < labelPositions.length; i++) {
      const prev = labelPositions[i - 1];
      const curr = labelPositions[i];
      if (curr.ly - prev.ly < 14) { // 14px minimum spacing
        curr.ly = prev.ly + 14;
      }
    }

    // Draw end-of-line labels at adjusted positions
    labelPositions.forEach((lp) => {
      g.append("text")
        .attr("x", lp.lx + 8)
        .attr("y", lp.ly + 4)
        .attr("font-family", "'IBM Plex Mono', monospace")
        .attr("font-size", "10px")
        .attr("font-weight", "600")
        .attr("fill", lp.color)
        .text(lp.name);
    });

    // Law annotation lines
    laws.forEach((law) => {
      const lawDate = new Date(law.date);
      if (lawDate < xDomain[0] || lawDate > xDomain[1]) return;
      const lx = x(lawDate);

      const annotationGroup = g.append("g").attr("class", "law-annotation");

      annotationGroup
        .append("line")
        .attr("x1", lx)
        .attr("x2", lx)
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "var(--accent-mark)")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4,3")
        .attr("opacity", 0.7);

      // Small marker triangle at bottom
      annotationGroup
        .append("path")
        .attr("d", d3.symbol().type(d3.symbolTriangle).size(30))
        .attr("transform", `translate(${lx},${height - 5})`)
        .attr("fill", "var(--accent-mark)");

      // Year label at top
      annotationGroup
        .append("text")
        .attr("x", lx)
        .attr("y", -4)
        .attr("text-anchor", "middle")
        .attr("font-family", "'IBM Plex Mono', monospace")
        .attr("font-size", "8px")
        .attr("fill", "var(--accent-mark)")
        .attr("opacity", 0.8)
        .text(new Date(law.date).getFullYear());

      // Hover target
      annotationGroup
        .append("rect")
        .attr("x", lx - 8)
        .attr("y", 0)
        .attr("width", 16)
        .attr("height", height)
        .attr("fill", "transparent")
        .attr("cursor", "pointer")
        .on("mouseenter", (event: MouseEvent) => {
          annotationGroup.select("line")
            .attr("stroke-width", 2)
            .attr("opacity", 1)
            .attr("stroke-dasharray", "none");

          const year = new Date(law.date).getFullYear();
          const typeLabel = law.type === "court_decision" ? "Court Decision" : law.type === "executive_action" ? "Executive Action" : "Legislation";

          // Clamp tooltip to container bounds
          const containerWidth = dimensions.width;
          const tooltipWidth = 280;
          let left = event.offsetX + 12;
          let top = event.offsetY - 10;

          if (left + tooltipWidth > containerWidth - 10) {
            left = event.offsetX - tooltipWidth - 12;
          }
          if (left < 10) left = 10;
          if (top < 10) top = 10;
          if (top + 140 > dimensions.height) {
            top = dimensions.height - 150;
          }

          tooltip
            .style("display", "block")
            .style("left", `${left}px`)
            .style("top", `${top}px`)
            .html(
              `<div class="font-mono text-sm font-bold uppercase tracking-wide">${law.name}</div>
               <div class="font-mono text-2xs text-ink-400 uppercase mt-0.5">${typeLabel} · ${year}</div>
               <div class="font-mono text-xs text-ink-600 mt-1.5 leading-relaxed">${law.summary.slice(0, 150)}${law.summary.length > 150 ? "..." : ""}</div>
               <div class="font-mono text-2xs text-mark mt-2">Click to view report card →</div>`
            );
        })
        .on("mouseleave", () => {
          annotationGroup.select("line")
            .attr("stroke-width", 1)
            .attr("opacity", 0.7)
            .attr("stroke-dasharray", "4,3");
          tooltip.style("display", "none");
        })
        .on("click", () => {
          if (onLawClick) onLawClick(law.slug);
        });
    });
  }, [seriesData, laws, normalizeYear, dateRange, dimensions, onLawClick]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg ref={svgRef} className="w-full" />
      <div
        ref={tooltipRef}
        className="absolute hidden pointer-events-none z-50 max-w-[280px] punch-card px-4 py-3"
        style={{ boxShadow: "2px 3px 8px rgba(0,0,0,0.15)" }}
      />
    </div>
  );
}

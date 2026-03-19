"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import type { Law } from "@/lib/laws";

interface SeriesData {
  id: string;
  name: string;
  observations: { date: string; value: number | null }[];
  color: string;
}

interface President {
  name: string;
  party: string;
  start: string;
  end: string;
}

interface TimelineChartProps {
  series: SeriesData[];
  laws: Law[];
  presidents: President[];
  normalized?: boolean;
  baselineYear?: number;
  onLawClick?: (slug: string) => void;
}

const LINE_COLORS = [
  "var(--ink-stamp)",
  "var(--accent-blue)",
  "var(--accent-red)",
  "var(--accent-mark)",
  "#6B8E6B",
  "#8B6B8E",
  "#6B8E8E",
  "#8E8B6B",
];

function normalizeSeries(
  observations: { date: string; value: number | null }[],
  baselineYear: number
): { date: string; value: number | null }[] {
  const baseDate = `${baselineYear}-01-01`;
  const baseTime = new Date(baseDate).getTime();
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

export function TimelineChart({
  series,
  laws,
  presidents,
  normalized = true,
  baselineYear = 1970,
  onLawClick,
}: TimelineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });

  // Responsive resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDimensions({ width, height: Math.max(350, Math.min(450, width * 0.5)) });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const drawChart = useCallback(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    if (!svgRef.current) return;

    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 55 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Process data
    const processedSeries = series.map((s, i) => {
      const obs = normalized ? normalizeSeries(s.observations, baselineYear) : s.observations;
      return {
        ...s,
        observations: obs.filter((o) => o.value !== null) as { date: string; value: number }[],
        color: s.color || LINE_COLORS[i % LINE_COLORS.length],
      };
    });

    // Compute scales
    const allDates = processedSeries.flatMap((s) =>
      s.observations.map((o) => new Date(o.date))
    );
    const allValues = processedSeries.flatMap((s) =>
      s.observations.map((o) => o.value)
    );

    if (allDates.length === 0) return;

    const xExtent = d3.extent(allDates) as [Date, Date];
    const yExtent = d3.extent(allValues) as [number, number];
    const yPadding = (yExtent[1] - yExtent[0]) * 0.1;

    const x = d3.scaleTime().domain(xExtent).range([0, width]);
    const y = d3
      .scaleLinear()
      .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
      .range([height, 0]);

    // Presidential era background bands
    presidents.forEach((pres) => {
      const start = new Date(pres.start);
      const end = new Date(pres.end);
      if (end < xExtent[0] || start > xExtent[1]) return;

      const x0 = Math.max(x(start), 0);
      const x1 = Math.min(x(end), width);

      g.append("rect")
        .attr("x", x0)
        .attr("y", 0)
        .attr("width", x1 - x0)
        .attr("height", height)
        .attr("fill", pres.party === "D" ? "var(--accent-blue)" : "var(--accent-red)")
        .attr("opacity", 0.04);

      // President name label at top
      if (x1 - x0 > 30) {
        g.append("text")
          .attr("x", (x0 + x1) / 2)
          .attr("y", 10)
          .attr("text-anchor", "middle")
          .attr("font-family", "'IBM Plex Mono', monospace")
          .attr("font-size", "9px")
          .attr("fill", "var(--text-muted)")
          .attr("opacity", 0.6)
          .text(pres.name);
      }
    });

    // Grid lines
    const yTicks = y.ticks(6);
    yTicks.forEach((tick) => {
      g.append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(tick))
        .attr("y2", y(tick))
        .attr("stroke", "var(--border-primary)")
        .attr("stroke-dasharray", "3,3")
        .attr("opacity", 0.5);
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
    if (normalized) {
      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -45)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .attr("font-family", "'IBM Plex Mono', monospace")
        .attr("font-size", "9px")
        .attr("fill", "var(--text-muted)")
        .text(`Index (${baselineYear} = 100)`);
    }

    // Data lines
    processedSeries.forEach((s) => {
      const line = d3
        .line<{ date: string; value: number }>()
        .x((d) => x(new Date(d.date)))
        .y((d) => y(d.value))
        .curve(d3.curveLinear);

      g.append("path")
        .datum(s.observations)
        .attr("fill", "none")
        .attr("stroke", s.color)
        .attr("stroke-width", 2)
        .attr("d", line);
    });

    // Law annotation lines
    laws.forEach((law) => {
      const lawDate = new Date(law.date);
      if (lawDate < xExtent[0] || lawDate > xExtent[1]) return;
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

      // Hover target (invisible wider rect)
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
          const typeLabel = law.type === "court_decision" ? "Court Decision" : "Legislation";

          tooltip
            .style("display", "block")
            .style("left", `${event.offsetX + 12}px`)
            .style("top", `${event.offsetY - 10}px`)
            .html(
              `<div class="font-condensed text-sm font-bold uppercase tracking-wide">${law.name}</div>
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

    // Legend
    if (processedSeries.length > 0) {
      const legend = g
        .append("g")
        .attr("transform", `translate(${width - 10}, 25)`);

      processedSeries.forEach((s, i) => {
        const row = legend.append("g").attr("transform", `translate(0, ${i * 18})`);
        row
          .append("line")
          .attr("x1", -30)
          .attr("x2", -10)
          .attr("y1", 0)
          .attr("y2", 0)
          .attr("stroke", s.color)
          .attr("stroke-width", 2);
        row
          .append("text")
          .attr("x", -35)
          .attr("y", 4)
          .attr("text-anchor", "end")
          .attr("font-family", "'IBM Plex Mono', monospace")
          .attr("font-size", "9px")
          .attr("fill", "var(--text-secondary)")
          .text(s.name);
      });
    }
  }, [series, laws, presidents, normalized, baselineYear, dimensions, onLawClick]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg ref={svgRef} className="w-full" />
      <div
        ref={tooltipRef}
        className="absolute hidden pointer-events-none z-10 max-w-[280px] punch-card px-4 py-3"
        style={{ boxShadow: "2px 3px 8px rgba(0,0,0,0.15)" }}
      />
    </div>
  );
}

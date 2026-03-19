"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";

interface Observation {
  date: string;
  value: number | null;
}

interface BeforeAfterChartProps {
  seriesId: string;
  lawDate: string;
  seriesName?: string;
}

function formatValue(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + "B";
  if (abs >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (abs >= 1_000) return (v / 1_000).toFixed(1) + "K";
  if (abs < 1) return v.toFixed(2);
  if (abs < 100) return v.toFixed(1);
  return v.toFixed(0);
}

export function BeforeAfterChart({
  seriesId,
  lawDate,
  seriesName,
}: BeforeAfterChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Observation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 560 });

  const chartHeight = 160;
  const lawYear = new Date(lawDate).getFullYear();
  const startYear = lawYear - 5;
  const endYear = lawYear + 10;

  // Responsive resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDimensions({ width });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Fetch data
  useEffect(() => {
    let cancelled = false;
    const url = `/api/fred/series?id=${seriesId}&frequency=a&start=${startYear}-01-01&end=${endYear}-12-31`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const obs: Observation[] = json.observations || [];
        if (obs.length === 0) {
          setError("No data available for this period");
        } else {
          setData(obs);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load data");
      });

    return () => {
      cancelled = true;
    };
  }, [seriesId, startYear, endYear]);

  const drawChart = useCallback(() => {
    const svg = d3.select(svgRef.current);
    if (!svgRef.current || !data || data.length === 0) return;

    svg.selectAll("*").remove();

    const margin = { top: 12, right: 16, bottom: 28, left: 50 };
    const width = dimensions.width - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    const g = svg
      .attr("width", dimensions.width)
      .attr("height", chartHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Filter valid observations
    const validData = data.filter(
      (d) => d.value !== null
    ) as { date: string; value: number }[];

    if (validData.length === 0) return;

    // Scales
    const xExtent = d3.extent(validData, (d) => new Date(d.date)) as [Date, Date];
    const yExtent = d3.extent(validData, (d) => d.value) as [number, number];
    const yPadding = (yExtent[1] - yExtent[0]) * 0.1 || yExtent[1] * 0.1;

    // If only 1 data point, widen the domain so ticks aren't repeated
    if (validData.length === 1) {
      const singleDate = new Date(validData[0].date);
      xExtent[0] = new Date(singleDate.getFullYear() - 1, 0, 1);
      xExtent[1] = new Date(singleDate.getFullYear() + 1, 0, 1);
    }

    const x = d3.scaleTime().domain(xExtent).range([0, width]);
    const y = d3
      .scaleLinear()
      .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
      .range([height, 0]);

    // Horizontal grid lines
    const yTicks = y.ticks(4);
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

    // X axis — reduce tick count for narrow date ranges to avoid repeated labels
    const dateRangeYears = (xExtent[1].getTime() - xExtent[0].getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const xTickCount = Math.max(2, Math.min(width > 400 ? 8 : 5, Math.floor(dateRangeYears)));
    const xAxis = d3
      .axisBottom(x)
      .ticks(xTickCount)
      .tickFormat((d) => d3.timeFormat("%Y")(d as Date));

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .attr("font-family", "'IBM Plex Mono', monospace")
      .attr("font-size", "9px")
      .attr("color", "var(--text-muted)")
      .selectAll("line, path")
      .attr("stroke", "var(--border-primary)");

    // Y axis
    const yAxis = d3
      .axisLeft(y)
      .ticks(4)
      .tickFormat((d) => formatValue(d as number));

    g.append("g")
      .call(yAxis)
      .attr("font-family", "'IBM Plex Mono', monospace")
      .attr("font-size", "9px")
      .attr("color", "var(--text-muted)")
      .selectAll("line, path")
      .attr("stroke", "var(--border-primary)");

    // Data: if only 1 point, show a dot instead of a line
    if (validData.length === 1) {
      g.append("circle")
        .attr("cx", x(new Date(validData[0].date)))
        .attr("cy", y(validData[0].value))
        .attr("r", 4)
        .attr("fill", "var(--text-primary)");
    } else {
      const line = d3
        .line<{ date: string; value: number }>()
        .x((d) => x(new Date(d.date)))
        .y((d) => y(d.value))
        .curve(d3.curveLinear);

      g.append("path")
        .datum(validData)
        .attr("fill", "none")
        .attr("stroke", "var(--text-primary)")
        .attr("stroke-width", 2)
        .attr("d", line);
    }

    // Enacted annotation line
    const lawDateObj = new Date(lawDate);
    if (lawDateObj >= xExtent[0] && lawDateObj <= xExtent[1]) {
      const lx = x(lawDateObj);

      g.append("line")
        .attr("x1", lx)
        .attr("x2", lx)
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "var(--accent-mark)")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "5,4");

      g.append("text")
        .attr("x", lx)
        .attr("y", -3)
        .attr("text-anchor", "middle")
        .attr("font-family", "'IBM Plex Mono', monospace")
        .attr("font-size", "9px")
        .attr("font-weight", "600")
        .attr("fill", "var(--accent-mark)")
        .text("Enacted");
    }
  }, [data, dimensions, lawDate, chartHeight]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  if (error) {
    return (
      <div className="border border-tan-400 rounded-sm p-4 bg-paper-50">
        {seriesName && (
          <div className="font-mono text-xs text-ink-400 uppercase tracking-wide mb-2">
            {seriesName}
          </div>
        )}
        <div className="h-32 flex items-center justify-center text-ink-400 font-mono text-xs">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border border-tan-400 rounded-sm p-4 bg-paper-50">
        {seriesName && (
          <div className="font-mono text-xs text-ink-400 uppercase tracking-wide mb-2">
            {seriesName}
          </div>
        )}
        <div className="h-32 flex items-center justify-center text-ink-400 font-mono text-xs">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="border border-tan-400 rounded-sm p-4 bg-paper-50">
      {seriesName && (
        <div className="font-mono text-xs text-ink-400 uppercase tracking-wide mb-2">
          {seriesName}
        </div>
      )}
      <div ref={containerRef} className="w-full">
        <svg ref={svgRef} className="w-full" />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TimelineChart } from "@/components/Timeline/TimelineChart";
import lawsData from "@/data/laws.json";
import presidentsData from "@/data/presidents.json";
import type { Law } from "@/lib/laws";

const KEY_SERIES = [
  { id: "CPIAUCSL", name: "CPI — All Items" },
  { id: "AHETPI", name: "Avg Hourly Earnings" },
  { id: "CUSR0000SAH1", name: "CPI — Housing" },
  { id: "CPIMEDSL", name: "CPI — Medical Care" },
];

const LINE_COLORS = [
  "var(--ink-stamp)",
  "var(--accent-blue)",
  "var(--accent-red)",
  "var(--accent-mark)",
];

const GOOD_DIRECTION: Record<string, "up" | "down"> = {
  CPIAUCSL: "down",       // CPI All Items — costs up is bad
  AHETPI: "up",           // Avg Hourly Earnings — up is good
  CUSR0000SAH1: "down",   // CPI Housing — costs up is bad
  CPIMEDSL: "down",       // CPI Medical Care — costs up is bad
};

interface FredResponse {
  series: { id: string; title: string };
  observations: { date: string; value: number | null }[];
}

export default function YourLifePage() {
  const router = useRouter();
  const laws = lawsData as Law[];

  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [seriesData, setSeriesData] = useState<Record<string, FredResponse>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const year = parseInt(inputValue);
    if (isNaN(year) || year < 1930 || year > 2020) return;

    setBirthYear(year);
    setSubmitted(true);
    setLoading(true);

    const results: Record<string, FredResponse> = {};
    await Promise.all(
      KEY_SERIES.map(async (s) => {
        try {
          const res = await fetch(
            `/api/fred/series?id=${s.id}&start=${year}-01-01&frequency=a`
          );
          if (res.ok) {
            results[s.id] = await res.json();
          }
        } catch {
          // Skip failed series
        }
      })
    );

    setSeriesData(results);
    setLoading(false);
  };

  const filteredLaws = birthYear
    ? laws.filter((l) => new Date(l.date).getFullYear() >= birthYear)
    : [];

  const filteredPresidents = birthYear
    ? presidentsData.filter(
        (p) => new Date(p.end).getFullYear() >= birthYear
      )
    : [];

  const chartSeries = KEY_SERIES.map((s, i) => {
    const data = seriesData[s.id];
    if (!data) return null;
    return {
      id: s.id,
      name: s.name,
      observations: data.observations,
      color: LINE_COLORS[i],
    };
  }).filter(Boolean) as {
    id: string;
    name: string;
    observations: { date: string; value: number | null }[];
    color: string;
  }[];

  // Compute summary stats
  const getSummary = (id: string) => {
    const data = seriesData[id];
    if (!data || data.observations.length < 2) return null;

    const validObs = data.observations.filter((o) => o.value !== null);
    if (validObs.length < 2) return null;

    const first = validObs[0].value!;
    const last = validObs[validObs.length - 1].value!;
    const pctChange = ((last - first) / first) * 100;
    return { first, last, pctChange };
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Your Life</h1>
      <p className="font-mono text-sm text-ink-600 mb-6">
        Enter your birth year to see the legislation and economic trends of your
        lifetime.
      </p>

      {/* Birth year input */}
      <div className="punch-card px-7 py-6 mb-6">
        <div className="section-label mb-3">When Were You Born?</div>
        <div className="flex gap-3 items-end">
          <div>
            <label className="font-mono text-2xs text-ink-400 uppercase tracking-wide block mb-1">
              Birth Year
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="1985"
              className="w-28 bg-paper-50 border border-tan-400 rounded-sm px-3 py-2 font-mono text-base text-ink-800 focus:border-mark focus:outline-none"
              min={1930}
              max={2020}
            />
          </div>
          <button onClick={handleSubmit} className="btn btn-active py-2">
            Show My Timeline
          </button>
        </div>
      </div>

      {submitted && birthYear && (
        <>
          {/* Summary stats */}
          {!loading && chartSeries.length > 0 && (
            <div className="punch-card px-7 py-6 mb-6">
              <div className="section-label mb-3">
                Since You Were Born in {birthYear}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {KEY_SERIES.map((s) => {
                  const summary = getSummary(s.id);
                  if (!summary) return null;
                  const isUp = summary.pctChange > 0;
                  const goodDir = GOOD_DIRECTION[s.id] || "up";
                  const isGood = (goodDir === "up" && isUp) || (goodDir === "down" && !isUp);
                  return (
                    <div key={s.id} className="border border-tan-400 rounded-sm p-3 bg-paper-50">
                      <div className="font-mono text-2xs text-ink-400 uppercase tracking-wide mb-1">
                        {s.name}
                      </div>
                      <div className={`font-condensed text-lg font-bold ${isGood ? "text-semantic-good" : "text-semantic-bad"}`}>
                        {isUp ? "+" : ""}{summary.pctChange.toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 font-mono text-2xs text-ink-400 italic">
                Percentage change from {birthYear} to most recent data available.
                All values are nominal (not adjusted for inflation) unless the series itself is inflation-adjusted.
              </div>
            </div>
          )}

          {/* Timeline chart */}
          <div className="punch-card px-4 py-4 mb-6">
            {loading ? (
              <div className="h-[350px] flex items-center justify-center font-mono text-sm text-ink-400">
                Loading your economic timeline...
              </div>
            ) : chartSeries.length > 0 ? (
              <TimelineChart
                series={chartSeries}
                laws={filteredLaws}
                presidents={filteredPresidents}
                normalized={true}
                baselineYear={birthYear}
                onLawClick={(slug) => router.push(`/law/${slug}`)}
              />
            ) : (
              <div className="h-[200px] flex items-center justify-center font-mono text-sm text-ink-400">
                Unable to load economic data. Check your FRED API key.
              </div>
            )}
          </div>

          {/* Laws during lifetime */}
          <div className="punch-card px-7 py-6">
            <div className="section-label mb-3">
              Laws Passed in Your Lifetime ({filteredLaws.length})
            </div>
            <div className="space-y-2">
              {filteredLaws
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((law) => {
                  const year = new Date(law.date + "T12:00:00").getFullYear();
                  const age = year - birthYear;
                  return (
                    <a
                      key={law.id}
                      href={`/law/${law.slug}`}
                      className="block font-mono text-sm hover:bg-paper-200 px-2 py-1 -mx-2 rounded-sm transition-colors duration-150"
                    >
                      <span className="text-ink-400 mr-2">{year}</span>
                      <span className="text-ink-800">{law.name}</span>
                      <span className="text-ink-400 ml-2">(age {age})</span>
                    </a>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

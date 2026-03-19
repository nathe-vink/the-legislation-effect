"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StoryChart } from "./StoryChart";
import { CompactLawCard } from "./CompactLawCard";
import { VerdictBlock } from "./VerdictBlock";
import type { Law } from "@/lib/laws";
import type { Story } from "@/lib/stories";

interface FredResponse {
  series: { id: string; title: string };
  observations: { date: string; value: number | null }[];
}

interface StoryChapterProps {
  story: Story;
  laws: Law[];
}

const LINE_COLORS = [
  "var(--ink-stamp)",
  "var(--accent-blue)",
  "var(--accent-red)",
  "var(--accent-mark)",
  "#6B8E6B",
  "#8B6B8E",
];

export function StoryChapter({ story, laws }: StoryChapterProps) {
  const router = useRouter();
  const [seriesData, setSeriesData] = useState<
    { id: string; name: string; observations: { date: string; value: number | null }[]; color: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const storyLaws = laws.filter((l) => story.lawSlugs.includes(l.slug));

  useEffect(() => {
    let cancelled = false;

    async function fetchSeries() {
      setLoading(true);
      const results: typeof seriesData = [];

      await Promise.all(
        story.fredSeries.map(async (seriesId, i) => {
          try {
            const startYear = new Date(story.dateRange[0]).getFullYear();
            const res = await fetch(
              `/api/fred/series?id=${seriesId}&start=${startYear}-01-01&frequency=a`
            );
            if (res.ok) {
              const data: FredResponse = await res.json();
              results.push({
                id: seriesId,
                name: story.seriesLabels[seriesId] || data.series.title,
                observations: data.observations,
                color: LINE_COLORS[i % LINE_COLORS.length],
              });
            }
          } catch {
            // Skip failed series
          }
        })
      );

      if (!cancelled) {
        // Maintain order matching fredSeries array
        const ordered = story.fredSeries
          .map((id) => results.find((r) => r.id === id))
          .filter(Boolean) as typeof seriesData;
        setSeriesData(ordered);
        setLoading(false);
      }
    }

    fetchSeries();
    return () => { cancelled = true; };
  }, [story.fredSeries, story.seriesLabels, story.dateRange]);

  return (
    <div className="mb-8">
      {/* Headline */}
      <div className="mb-4">
        <h2 className="font-mono text-xl font-bold tracking-wider text-ink-900 uppercase mb-1">
          {story.headline}
        </h2>
        <p className="font-mono text-sm text-ink-600 italic">
          {story.subtitle}
        </p>
      </div>

      {/* Narrative */}
      <div className="font-mono text-sm text-ink-800 leading-relaxed mb-5">
        {story.narrative.split("\n\n").map((paragraph, i) => (
          <p key={i} className={i > 0 ? "mt-3" : ""}>
            {paragraph}
          </p>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-container p-3 mb-5">
        {loading ? (
          <div className="h-[380px] flex items-center justify-center font-mono text-sm text-ink-400">
            Loading economic data...
          </div>
        ) : seriesData.length > 0 ? (
          <StoryChart
            seriesData={seriesData}
            laws={storyLaws}
            normalizeYear={story.normalizeYear}
            dateRange={story.dateRange}
            onLawClick={(slug) => router.push(`/law/${slug}`)}
          />
        ) : (
          <div className="h-[200px] flex items-center justify-center font-mono text-sm text-ink-400">
            Unable to load chart data.
          </div>
        )}
      </div>

      {/* Laws referenced in this story */}
      {storyLaws.length > 0 && (
        <div className="mb-5">
          <div className="section-label mb-2">Laws in this story</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {storyLaws.map((law) => (
              <CompactLawCard key={law.id} law={law} />
            ))}
          </div>
        </div>
      )}

      {/* Verdict */}
      <VerdictBlock verdict={story.verdict} compact />
    </div>
  );
}

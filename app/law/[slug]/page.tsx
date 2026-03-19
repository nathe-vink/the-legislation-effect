import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllLaws, getLawBySlug } from "@/lib/laws";
import { ReportCard } from "@/components/ReportCard/ReportCard";
import { InTheYearsFollowing } from "@/components/InTheYearsFollowing";
import { BackButton } from "@/components/BackButton";
import fredSeriesData from "@/data/fred-series.json";

// Build a flat map of series ID -> human-readable name
const seriesNameMap: Record<string, string> = {
  // Fallbacks for series not in fred-series.json
  FEDFUNDS: "Federal Funds Rate",
  SP500: "S&P 500 Index",
  INDPRO: "Industrial Production Index",
};
for (const group of fredSeriesData.groups) {
  for (const s of group.series) {
    seriesNameMap[s.id] = s.name;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllLaws().map((law) => ({ slug: law.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const law = getLawBySlug(slug);
  if (!law) return { title: "Not Found" };

  return {
    title: `${law.name} — The Legislation Effect`,
    description: law.summary,
    openGraph: {
      title: law.name,
      description: law.summary,
    },
  };
}

export default async function LawPage({ params }: PageProps) {
  const { slug } = await params;
  const law = getLawBySlug(slug);
  if (!law) notFound();

  return (
    <div>
      <div className="mb-6">
        <BackButton />
      </div>

      <ReportCard law={law} />

      {/* In the Years Following section */}
      <div className="punch-card mt-8 px-7 py-6">
        <div className="section-label">In the Years Following</div>
        <p className="font-mono text-sm text-ink-600 mb-4">
          Economic indicators related to this {law.type === "court_decision" ? "decision" : "law"},
          showing 5 years before through 10 years after.
        </p>

        {law.relatedFredSeries.length > 0 ? (
          <InTheYearsFollowing
            seriesIds={law.relatedFredSeries}
            lawDate={law.date}
            seriesMap={seriesNameMap}
          />
        ) : (
          <div className="font-mono text-sm text-ink-400">
            No related economic series identified for this entry.
          </div>
        )}

        <div className="mt-6 border-l-2 border-mark pl-4">
          <p className="font-mono text-xs text-ink-600 italic">
            Many factors influence economic outcomes. This chart shows trends in
            the years surrounding this legislation — not necessarily caused by it.
          </p>
        </div>
      </div>
    </div>
  );
}

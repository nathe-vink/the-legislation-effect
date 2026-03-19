import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — The Legislation Effect",
  description: "Our approach, data sources, and methodology.",
};

export default function AboutPage() {
  return (
    <div>
      <h1 className="font-mono text-2xl font-bold tracking-wider text-ink-900 uppercase mb-6">
        About This Project
      </h1>

      <div className="punch-card px-7 py-6">
        <div className="section-label">Our Approach</div>
        <p className="font-mono text-sm text-ink-800 leading-relaxed mb-4">
          We believe showing Americans what happened to their economy is not partisan.
          The numbers have a point of view. When productivity rises 253% and wages
          rise 116%, that gap is not an opinion — it is a measurement.
        </p>
        <p className="font-mono text-sm text-ink-800 leading-relaxed mb-6">
          The Legislation Effect pairs decades of federal economic data with the
          specific laws, court decisions, and executive actions that shaped those
          trends. We show what each law did, who voted for it, and what happened
          to measurable economic indicators in the years that followed. Where the
          data tells a clear story, we say so.
        </p>

        <hr className="punch-divider" />

        <div className="section-label mt-6">What We Show</div>
        <p className="font-mono text-sm text-ink-800 leading-relaxed mb-4">
          Each story on this site pairs real economic data from the Federal Reserve
          with the laws most relevant to that trend. Each law gets a report card
          with vote breakdowns by party, key sponsors, and a data-grounded
          assessment of its measurable outcomes.
        </p>
        <p className="font-mono text-sm text-ink-800 leading-relaxed mb-6">
          Our verdicts are grounded in the numbers — not in ideology. We never say
          a law was &ldquo;good&rdquo; or &ldquo;bad.&rdquo; We say what happened:
          union membership fell, inequality rose, healthcare costs slowed,
          manufacturing jobs disappeared. You can see who voted for what.
          Draw your own conclusions about the people who made these choices.
        </p>

        <hr className="punch-divider" />

        <div className="section-label mt-6">Correlation, Not Causation</div>
        <p className="font-mono text-sm text-ink-800 leading-relaxed mb-6">
          Economic outcomes are shaped by countless forces — global events,
          technology, demographics, prior legislation, market cycles. No single
          law operates in isolation. When we show that an indicator changed
          after a law passed, we are showing correlation. The trends are real.
          The connections are documented. But we are honest about the limits
          of what any chart can prove.
        </p>

        <hr className="punch-divider" />

        <div className="section-label mt-6">Data Sources</div>
        <div className="meta-grid mb-6">
          <span className="meta-label">Economic Data</span>
          <span className="font-mono text-sm">
            FRED (Federal Reserve Economic Data), maintained by the Federal
            Reserve Bank of St. Louis. All series are publicly available.
          </span>

          <span className="meta-label">Legislation</span>
          <span className="font-mono text-sm">
            Congress.gov for bill text, vote counts, and sponsorship. VoteView
            for party-line breakdowns on historical votes.
          </span>

          <span className="meta-label">Court Decisions</span>
          <span className="font-mono text-sm">
            Supreme Court opinions via Justia and the Court&apos;s official records.
          </span>
        </div>

        <hr className="punch-divider" />

        <div className="section-label mt-6">Methodology</div>
        <p className="font-mono text-sm text-ink-800 leading-relaxed mb-4">
          <strong>Law selection:</strong> We curated 48 laws across labor,
          finance, healthcare, tax, housing, trade, campaign finance, and
          social safety net categories. Selection criteria: measurable economic
          impact and broad public relevance.
        </p>
        <p className="font-mono text-sm text-ink-800 leading-relaxed mb-4">
          <strong>Series association:</strong> Each law is linked to the FRED
          indicators most relevant to its policy area. These are editorial
          judgments — reasonable people may link different indicators.
        </p>
        <p className="font-mono text-sm text-ink-800 leading-relaxed mb-4">
          <strong>Normalization:</strong> When comparing series on a single
          chart, values are indexed to 100 at a baseline year. This allows
          meaningful comparison of series with vastly different scales.
        </p>

        <hr className="punch-divider" />

        <div className="section-label mt-6">Independence</div>
        <p className="font-mono text-sm text-ink-800 leading-relaxed">
          All data is public domain or openly licensed. This project is not
          affiliated with any government agency, political party, or
          advocacy organization. The code and data are open source.
        </p>
      </div>
    </div>
  );
}

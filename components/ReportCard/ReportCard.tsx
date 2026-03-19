import type { Law } from "@/lib/laws";
import { PunchHoles } from "@/components/ui/PunchHoles";
import { VoteBreakdown } from "./VoteBreakdown";
import Link from "next/link";

function partyColor(party: string): string {
  if (party === "D") return "var(--accent-blue)";
  if (party === "R") return "var(--accent-red)";
  return "var(--text-secondary)";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function congressOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function ReportCard({
  law,
  showLink = false,
}: {
  law: Law;
  showLink?: boolean;
}) {
  const isCourtDecision = law.type === "court_decision";
  const typeLabel = isCourtDecision ? "COURT DECISION" : law.type === "executive_action" ? "EXECUTIVE ACTION" : "LEGISLATION";
  const typeIcon = isCourtDecision ? "\u2696" : "\u00A7";
  const year = new Date(law.date + "T12:00:00").getFullYear();

  return (
    <div className="punch-card max-w-[640px] w-full">
      <PunchHoles />

      <div className="px-7 pt-2 pb-1">
        {/* Header — stacked vertically per design rules */}
        <h2 className="font-condensed text-xl font-bold tracking-wide uppercase text-ink-900 leading-tight">
          {law.name}
        </h2>
        <div className="font-mono text-sm text-ink-600 mt-1">
          {law.formalName}
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span
            className="font-mono text-xs uppercase tracking-widest border rounded-sm px-2 py-0.5 inline-block"
            style={{
              color: isCourtDecision ? "var(--accent-mark)" : "var(--text-muted)",
              borderColor: isCourtDecision ? "var(--accent-mark)" : "var(--border-primary)",
            }}
          >
            {typeIcon} {typeLabel}
          </span>
          {law.category.map((cat) => (
            <span key={cat} className="font-condensed text-sm font-semibold tracking-wide uppercase text-ink-600">
              {cat.replace("-", " ")}
            </span>
          ))}
          <span className="font-condensed text-sm font-semibold tracking-wide uppercase text-ink-600">
            · {year}
          </span>
        </div>

        <hr className="punch-divider" />

        {/* Metadata Grid */}
        <div className="meta-grid">
          <span className="meta-label">{isCourtDecision ? "Decided" : "Signed"}</span>
          <span>{formatDate(law.date)}</span>

          {!isCourtDecision && (
            <>
              <span className="meta-label">President</span>
              <span>
                <span style={{ color: partyColor(law.president.party) }}>
                  {law.president.name} ({law.president.party})
                </span>
                {law.president.action !== "SIGNED" && law.president.action !== "N/A" && (
                  <span className="text-party-rep font-semibold">
                    {" "}— {law.president.action}
                    {law.president.overridden ? ", overridden" : ""}
                  </span>
                )}
              </span>
            </>
          )}

          <span className="meta-label">Congress</span>
          <span>
            {congressOrdinal(law.congress.number)} · House:{" "}
            <span style={{ color: partyColor(law.congress.houseControl) }} className="font-semibold">
              {law.congress.houseControl}
            </span>{" "}
            · Senate:{" "}
            <span style={{ color: partyColor(law.congress.senateControl) }} className="font-semibold">
              {law.congress.senateControl}
            </span>
          </span>
        </div>

        <hr className="punch-divider" />

        {/* Summary */}
        <div>
          <div className="section-label">
            {isCourtDecision ? "What the Court Ruled" : "What It Did"}
          </div>
          <p className="font-mono text-base text-ink-800 leading-relaxed m-0">
            {law.summary}
          </p>
        </div>

        <hr className="punch-divider" />

        {/* Vote */}
        <div>
          <div className="section-label">The Vote</div>
          <VoteBreakdown vote={law.vote} />
        </div>

        <hr className="punch-divider" />

        {/* Sponsors */}
        <div>
          <div className="section-label">
            {isCourtDecision ? "Key Justices" : "Key Sponsors"}
          </div>
          {law.sponsors.map((s, i) => (
            <div key={i} className="font-mono text-sm text-ink-800 mb-0.5">
              <span className="text-ink-400">→</span> {s.name}{" "}
              {s.party && s.party !== "" && (
                <span style={{ color: partyColor(s.party) }}>
                  ({s.party}-{s.state})
                </span>
              )}{" "}
              <span className="text-ink-400">· {s.chamber}</span>
            </div>
          ))}
        </div>

        {law.relatedLaws.length > 0 && (
          <>
            <hr className="punch-divider" />
            <div>
              <div className="section-label">Related</div>
              {law.relatedLaws.map((slug, i) => (
                <div key={i} className="font-mono text-sm mb-0.5">
                  <Link href={`/law/${slug}`} className="text-mark">
                    → {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="h-2" />
      </div>

      <PunchHoles />

      {/* Card footer */}
      <div className="border-t border-tan-400 px-7 py-2 font-mono text-2xs text-ink-400 uppercase tracking-wide flex justify-between flex-wrap gap-1">
        <span>Sources: Congress.gov · VoteView · FRED</span>
        {showLink && (
          <Link href={`/law/${law.slug}`} className="text-mark">
            View Full Report Card →
          </Link>
        )}
      </div>
    </div>
  );
}

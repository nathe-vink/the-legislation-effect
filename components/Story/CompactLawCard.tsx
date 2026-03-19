import type { Law } from "@/lib/laws";

interface CompactLawCardProps {
  law: Law;
}

export function CompactLawCard({ law }: CompactLawCardProps) {
  const year = new Date(law.date).getFullYear();
  const typeLabel =
    law.type === "court_decision"
      ? "Court"
      : law.type === "executive_action"
      ? "Exec"
      : "Law";

  return (
    <a
      href={`/law/${law.slug}`}
      className="block no-underline group"
    >
      <div className="border border-tan-400 rounded-sm px-3 py-2.5 bg-paper-100 hover:bg-paper-200 hover:border-tan-500 transition-all duration-150">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-mono text-2xs text-ink-400 uppercase border border-tan-400 px-1.5 py-0.5 rounded-sm flex-shrink-0">
            {typeLabel}
          </span>
          <span className="font-mono text-2xs text-ink-400">{year}</span>
        </div>
        <div className="font-mono text-xs font-bold text-ink-900 uppercase tracking-wide group-hover:text-mark transition-colors duration-150">
          {law.name}
        </div>
        <div className="font-mono text-2xs text-ink-600 mt-1 leading-relaxed line-clamp-2">
          {law.summary.slice(0, 120)}{law.summary.length > 120 ? "..." : ""}
        </div>
      </div>
    </a>
  );
}

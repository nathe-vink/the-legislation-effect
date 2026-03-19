interface VerdictMetric {
  label: string;
  before: string;
  after: string;
  change: string;
}

interface VerdictBlockProps {
  verdict: string;
  metrics?: VerdictMetric[] | null;
  compact?: boolean;
}

export function VerdictBlock({ verdict, metrics, compact = false }: VerdictBlockProps) {
  return (
    <div className="verdict-block">
      <p className={compact ? "font-mono text-xs font-semibold text-ink-900 leading-relaxed" : "verdict-text"}>
        {verdict}
      </p>
      {metrics && metrics.length > 0 && (
        <div className="verdict-metrics">
          {metrics.map((m, i) => (
            <div key={i} className="verdict-metric">
              <span className="verdict-metric-label">{m.label}</span>
              <span className="font-mono text-2xs text-ink-600">
                {m.before} → {m.after}
              </span>
              <span className="verdict-metric-change">{m.change}</span>
            </div>
          ))}
        </div>
      )}
      <p className="font-mono text-2xs text-ink-400 italic mt-2">
        Correlation shown, not necessarily causation.
      </p>
    </div>
  );
}

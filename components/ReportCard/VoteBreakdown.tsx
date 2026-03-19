import type { LawVoteChamber, LawVoteCourt } from "@/lib/laws";

function VoteBar({
  party,
  yea,
  nay,
  color,
}: {
  party: string;
  yea: number;
  nay: number;
  color: string;
}) {
  const total = yea + nay;
  const yeaPct = (yea / total) * 100;

  return (
    <div className="flex items-center gap-3 mb-1.5">
      <span
        className="w-4 font-bold font-mono text-sm"
        style={{ color }}
      >
        {party}
      </span>
      <div className="flex-1 flex h-3.5 border border-tan-400 rounded-sm overflow-hidden">
        <div
          className="transition-[width] duration-500 ease-out"
          style={{ width: `${yeaPct}%`, backgroundColor: color, opacity: 0.8 }}
        />
        <div className="flex-1 bg-paper-50" />
      </div>
      <span className="font-mono text-2xs text-ink-600 min-w-[120px]">
        {yea} YEA · {nay} NAY
      </span>
    </div>
  );
}

function CourtVote({
  majority,
  dissent,
  opinion,
  dissentBy,
}: LawVoteCourt) {
  return (
    <div className="py-3">
      <div className="flex gap-1.5 mb-2">
        {Array.from({ length: majority }).map((_, i) => (
          <div
            key={`m-${i}`}
            className="w-5 h-7 rounded-sm border border-tan-500 bg-mark"
          />
        ))}
        <div className="w-0.5 bg-tan-400 mx-1" />
        {Array.from({ length: dissent }).map((_, i) => (
          <div
            key={`d-${i}`}
            className="w-5 h-7 rounded-sm border border-tan-400 bg-paper-50"
          />
        ))}
      </div>
      <div className="font-mono text-xs text-ink-600">
        {majority}–{dissent} · Opinion: {opinion} · Dissent: {dissentBy}
      </div>
    </div>
  );
}

export function VoteBreakdown({
  vote,
}: {
  vote: {
    house?: LawVoteChamber;
    senate?: LawVoteChamber;
    court?: LawVoteCourt;
  };
}) {
  if (vote.court) {
    return <CourtVote {...vote.court} />;
  }

  return (
    <>
      {vote.house && (
        <>
          <div className="font-mono text-xs text-ink-600 mb-2 uppercase tracking-wide">
            House · {vote.house.yea}–{vote.house.nay} ({vote.house.type})
          </div>
          <VoteBar party="D" yea={vote.house.yea_d} nay={vote.house.nay_d} color="var(--accent-blue)" />
          <VoteBar party="R" yea={vote.house.yea_r} nay={vote.house.nay_r} color="var(--accent-red)" />
        </>
      )}

      {vote.house && vote.senate && <div className="h-4" />}

      {vote.senate && (
        <>
          <div className="font-mono text-xs text-ink-600 mb-2 uppercase tracking-wide">
            Senate · {vote.senate.yea}–{vote.senate.nay} ({vote.senate.type})
          </div>
          <VoteBar party="D" yea={vote.senate.yea_d} nay={vote.senate.nay_d} color="var(--accent-blue)" />
          <VoteBar party="R" yea={vote.senate.yea_r} nay={vote.senate.nay_r} color="var(--accent-red)" />
        </>
      )}
    </>
  );
}

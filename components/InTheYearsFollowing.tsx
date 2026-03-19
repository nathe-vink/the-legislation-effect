"use client";

import { BeforeAfterChart } from "@/components/BeforeAfterChart";

interface InTheYearsFollowingProps {
  seriesIds: string[];
  lawDate: string;
  seriesMap: Record<string, string>;
}

export function InTheYearsFollowing({
  seriesIds,
  lawDate,
  seriesMap,
}: InTheYearsFollowingProps) {
  return (
    <div className="space-y-4">
      {seriesIds.map((seriesId) => (
        <BeforeAfterChart
          key={seriesId}
          seriesId={seriesId}
          lawDate={lawDate}
          seriesName={seriesMap[seriesId] || seriesId}
        />
      ))}
    </div>
  );
}

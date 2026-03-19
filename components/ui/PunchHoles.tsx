"use client";

export function PunchHoles({ count = 24 }: { count?: number }) {
  return (
    <div className="flex justify-center gap-2 px-6 py-1.5 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-paper-50 border border-tan-400 flex-shrink-0"
        />
      ))}
    </div>
  );
}

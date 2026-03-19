"use client";

import { useState, useRef, useEffect } from "react";
import { StoryChapter } from "@/components/Story/StoryChapter";
import { getAllStories, type Story } from "@/lib/stories";
import lawsData from "@/data/laws.json";
import type { Law } from "@/lib/laws";

const stories = getAllStories();
const laws = lawsData as unknown as Law[];

export default function HomePage() {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeStoryId && expandedRef.current) {
      expandedRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeStoryId]);

  const activeStory = activeStoryId
    ? stories.find((s) => s.id === activeStoryId)
    : null;

  return (
    <div>
      {/* Hero section */}
      <div className="mb-6">
        <h1 className="font-mono text-2xl font-bold tracking-wider text-ink-900 uppercase leading-tight mb-3">
          Since 1947, Congress passed hundreds of laws that shaped the American economy.
        </h1>
        <p className="font-mono text-sm text-ink-600 leading-relaxed max-w-2xl">
          Productivity rose 253%. Wages rose 116%. Housing costs rose 2,100%.
          Medical costs rose 4,200%. These are the laws that made it happen —
          and the real, measurable outcomes they had on American lives.
        </p>
        <p className="font-mono text-2xs text-ink-400 mt-3">
          Select a story below to explore the data.
        </p>
      </div>

      {/* Story card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() =>
              setActiveStoryId(
                activeStoryId === story.id ? null : story.id
              )
            }
            className={`text-left ${
              activeStoryId === story.id
                ? "story-card story-card-active"
                : "story-card"
            }`}
          >
            <div className="font-mono text-sm font-bold text-ink-900 uppercase tracking-wide mb-1">
              {story.headline}
            </div>
            <div className="font-mono text-xs text-ink-400 italic mb-2">
              {story.subtitle}
            </div>
            <div className="font-mono text-sm text-ink-600 leading-relaxed">
              {story.abstract}
            </div>
          </button>
        ))}
      </div>

      {/* Expanded story */}
      {activeStory && (
        <div ref={expandedRef} className="scroll-mt-4 punch-card px-6 py-6 mb-8">
          <StoryChapter story={activeStory} laws={laws} />
        </div>
      )}

      {/* Footer link to all laws */}
      <div className="text-center py-6">
        <a href="/laws" className="btn btn-active">
          Browse All 48 Laws →
        </a>
      </div>
    </div>
  );
}

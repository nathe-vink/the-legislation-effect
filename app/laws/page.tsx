"use client";

import { useState } from "react";
import lawsData from "@/data/laws.json";
import type { Law } from "@/lib/laws";

const laws = (lawsData as Law[]).sort((a, b) => a.date.localeCompare(b.date));

const categories = Array.from(
  new Set(laws.flatMap((l) => l.category))
).sort();

export default function LawsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? laws.filter((l) => l.category.includes(activeCategory))
    : laws;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-mono text-2xl font-bold tracking-wider text-ink-900 uppercase mb-2">
        All Laws
      </h1>
      <p className="font-mono text-sm text-ink-600 mb-6">
        {laws.length} landmark laws, court decisions, and executive actions from 1930 to 2022.
      </p>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory(null)}
          className={`btn ${!activeCategory ? "btn-active" : ""}`}
        >
          All ({laws.length})
        </button>
        {categories.map((cat) => {
          const count = laws.filter((l) => l.category.includes(cat)).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`btn ${activeCategory === cat ? "btn-active" : ""}`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Laws list */}
      <div className="space-y-1">
        {filtered.map((law) => {
          const year = new Date(law.date).getFullYear();
          const typeLabel =
            law.type === "court_decision"
              ? "Court"
              : law.type === "executive_action"
              ? "Exec"
              : "Law";

          return (
            <a
              key={law.id}
              href={`/law/${law.slug}`}
              className="block no-underline font-mono text-sm hover:bg-paper-200 px-3 py-2 -mx-3 rounded-sm transition-colors duration-150"
            >
              <span className="text-ink-400 mr-2 inline-block w-10">{year}</span>
              <span className="text-2xs text-ink-400 uppercase border border-tan-400 px-1 py-0.5 rounded-sm mr-2">
                {typeLabel}
              </span>
              <span className="text-ink-800 font-semibold uppercase tracking-wide">
                {law.name}
              </span>
              <span className="text-ink-400 ml-2 text-2xs">
                {law.category.join(", ")}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

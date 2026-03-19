import lawsData from "@/data/laws.json";

export interface LawVoteChamber {
  yea: number;
  nay: number;
  yea_d: number;
  nay_d: number;
  yea_r: number;
  nay_r: number;
  type: string; // "passage" | "veto override" | "conference report"
}

export interface LawVoteCourt {
  majority: number;
  dissent: number;
  opinion: string;
  dissentBy: string;
}

export interface LawSponsor {
  name: string;
  party: string;
  state: string;
  chamber: string;
}

export interface VerdictMetric {
  label: string;
  before: string;
  after: string;
  change: string;
}

export interface Law {
  id: string;
  slug: string;
  name: string;
  formalName: string;
  date: string;
  type: "legislation" | "court_decision" | "executive_action";
  category: string[];
  subcategory: string[];
  summary: string;
  president: {
    name: string;
    party: string;
    action: string;
    overridden: boolean;
  };
  congress: {
    number: number;
    houseControl: string;
    senateControl: string;
  };
  vote: {
    house?: LawVoteChamber;
    senate?: LawVoteChamber;
    court?: LawVoteCourt;
  };
  sponsors: LawSponsor[];
  relatedFredSeries: string[];
  relatedLaws: string[];
  congressGovUrl?: string;
  wikipediaUrl?: string;
  featured: boolean;
  verdict: string | null;
  verdictMetrics: VerdictMetric[] | null;
}

export function getAllLaws(): Law[] {
  return lawsData as Law[];
}

export function getLawBySlug(slug: string): Law | undefined {
  return (lawsData as Law[]).find((law) => law.slug === slug);
}

export function getLawsByCategory(category: string): Law[] {
  return (lawsData as Law[]).filter((law) =>
    law.category.includes(category)
  );
}

export function getAllCategories(): string[] {
  const categories = new Set<string>();
  for (const law of lawsData as Law[]) {
    for (const cat of law.category) {
      categories.add(cat);
    }
  }
  return Array.from(categories).sort();
}

export function getLawsInDateRange(start: string, end: string): Law[] {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (lawsData as Law[]).filter((law) => {
    const d = new Date(law.date);
    return d >= startDate && d <= endDate;
  });
}

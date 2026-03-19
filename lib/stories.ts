import storiesData from '@/data/stories.json';

export interface Story {
  id: string;
  headline: string;
  subtitle: string;
  abstract: string;
  narrative: string;
  verdict: string;
  fredSeries: string[];
  seriesLabels: Record<string, string>;
  normalizeYear: number;
  lawSlugs: string[];
  dateRange: [string, string];
}

export function getAllStories(): Story[] {
  return storiesData as unknown as Story[];
}

export function getStoryById(id: string): Story | undefined {
  return (storiesData as unknown as Story[]).find(s => s.id === id);
}

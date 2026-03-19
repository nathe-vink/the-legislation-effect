/**
 * FRED API client with server-side caching.
 *
 * All requests go through the Next.js API route (/api/fred/series)
 * which proxies to api.stlouisfed.org, keeping the API key server-side.
 *
 * Cache strategy: file-system cache with 24-hour TTL.
 * FRED data updates infrequently (monthly for most series).
 */

const FRED_BASE_URL = "https://api.stlouisfed.org/fred";

export interface FredObservation {
  date: string;
  value: string; // FRED returns string; parse to number, handle "." as null
}

export interface FredSeriesInfo {
  id: string;
  title: string;
  observation_start: string;
  observation_end: string;
  frequency: string;
  units: string;
  seasonal_adjustment: string;
}

export interface FredSeriesResponse {
  series: FredSeriesInfo;
  observations: { date: string; value: number | null }[];
}

// In-memory cache for the server process
const cache = new Map<string, { data: FredSeriesResponse; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(seriesId: string, start?: string, end?: string): string {
  return `${seriesId}:${start || ""}:${end || ""}`;
}

/**
 * Fetch a FRED series with observations.
 * Called server-side only (from API route).
 */
export async function fetchFredSeries(
  seriesId: string,
  options?: {
    observationStart?: string;
    observationEnd?: string;
    frequency?: string; // "a" annual, "q" quarterly, "m" monthly
    units?: string; // "lin" linear, "pch" percent change, etc.
  }
): Promise<FredSeriesResponse> {
  const apiKey = process.env.FRED_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("FRED_API_KEY environment variable is not set");
  }

  const cacheKey = getCacheKey(
    seriesId,
    options?.observationStart,
    options?.observationEnd
  );
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Fetch series metadata
  const seriesUrl = new URL(`${FRED_BASE_URL}/series`);
  seriesUrl.searchParams.set("series_id", seriesId);
  seriesUrl.searchParams.set("api_key", apiKey);
  seriesUrl.searchParams.set("file_type", "json");

  const seriesRes = await fetch(seriesUrl.toString());
  if (!seriesRes.ok) {
    throw new Error(`FRED series fetch failed: ${seriesRes.status}`);
  }
  const seriesData = await seriesRes.json();
  const series: FredSeriesInfo = seriesData.seriess[0];

  // Fetch observations
  const obsUrl = new URL(`${FRED_BASE_URL}/series/observations`);
  obsUrl.searchParams.set("series_id", seriesId);
  obsUrl.searchParams.set("api_key", apiKey);
  obsUrl.searchParams.set("file_type", "json");
  if (options?.observationStart) {
    obsUrl.searchParams.set("observation_start", options.observationStart);
  }
  if (options?.observationEnd) {
    obsUrl.searchParams.set("observation_end", options.observationEnd);
  }
  if (options?.frequency) {
    obsUrl.searchParams.set("frequency", options.frequency);
  }
  if (options?.units) {
    obsUrl.searchParams.set("units", options.units);
  }

  const obsRes = await fetch(obsUrl.toString());
  if (!obsRes.ok) {
    throw new Error(`FRED observations fetch failed: ${obsRes.status}`);
  }
  const obsData = await obsRes.json();

  const observations = (obsData.observations as FredObservation[]).map((o) => ({
    date: o.date,
    value: o.value === "." ? null : parseFloat(o.value),
  }));

  const result: FredSeriesResponse = { series, observations };

  // Cache it
  cache.set(cacheKey, { data: result, timestamp: Date.now() });

  return result;
}

/**
 * Normalize a series to index=100 at a given base date.
 * Finds the observation closest to the base date and divides all values by it.
 */
export function normalizeSeries(
  observations: { date: string; value: number | null }[],
  baseDate: string = "1970-01-01"
): { date: string; value: number | null }[] {
  // Find the closest observation to the base date
  const baseTime = new Date(baseDate).getTime();
  let closest = observations[0];
  let closestDiff = Infinity;

  for (const obs of observations) {
    if (obs.value === null) continue;
    const diff = Math.abs(new Date(obs.date).getTime() - baseTime);
    if (diff < closestDiff) {
      closestDiff = diff;
      closest = obs;
    }
  }

  if (!closest || closest.value === null || closest.value === 0) {
    return observations;
  }

  const baseValue = closest.value;
  return observations.map((o) => ({
    date: o.date,
    value: o.value !== null ? (o.value / baseValue) * 100 : null,
  }));
}

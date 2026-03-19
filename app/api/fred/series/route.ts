import { NextRequest, NextResponse } from "next/server";
import { fetchFredSeries } from "@/lib/fred";

/**
 * GET /api/fred/series?id=CPIAUCSL&start=1947-01-01&end=2024-12-31&frequency=a&units=lin
 *
 * Proxies to FRED API with server-side API key and caching.
 * Returns JSON with series metadata and observations.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const seriesId = searchParams.get("id");

  if (!seriesId) {
    return NextResponse.json(
      { error: "Missing required parameter: id" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchFredSeries(seriesId, {
      observationStart: searchParams.get("start") || undefined,
      observationEnd: searchParams.get("end") || undefined,
      frequency: searchParams.get("frequency") || undefined,
      units: searchParams.get("units") || undefined,
    });

    return NextResponse.json(data, {
      headers: {
        // Allow client-side caching for 1 hour
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("FRED API error:", message);
    return NextResponse.json(
      { error: "Failed to fetch FRED data", detail: message },
      { status: 500 }
    );
  }
}

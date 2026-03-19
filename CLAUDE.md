# CLAUDE.md — The Legislation Effect

## What This Project Is

An interactive web app that overlays decades of US economic time-series data (wages, housing costs, healthcare costs, inequality, productivity) with the landmark legislation that shaped those trends. Each law gets a "report card" showing what it did, who passed it, and what happened in the years that followed.

The goal: help people see, concretely, how specific policy decisions impacted their economic lives — without editorializing. The data speaks for itself.

## Current State

The project is scaffolded with data layer and API proxy complete. The following still needs to be built:

### What exists:
- Next.js 14 App Router project with TypeScript and Tailwind
- FRED API proxy route (`/api/fred/series`) with in-memory caching and normalization
- Law data types and access functions (`lib/laws.ts`)
- 5 fully researched law entries in `data/laws.json` (Taft-Hartley, Glass-Steagall, Gramm-Leach-Bliley, Citizens United, ACA)
- Presidential eras data (`data/presidents.json`)
- FRED series metadata organized into 6 thematic groups (`data/fred-series.json`)
- Root layout with navigation and footer
- Global CSS with full punch card design system
- Tailwind config with all design tokens

### What needs to be built:
1. **PunchHoles component** — decorative perforated edge holes for cards
2. **ReportCard component** — the main card layout (punch card aesthetic)
3. **VoteBreakdown component** — party-line vote visualization bars
4. **TimelineChart component** — D3.js annotated time-series chart (the core feature)
5. **Homepage** (`app/page.tsx`) — timeline view with indicator toggles and category filters
6. **Report card page** (`app/law/[slug]/page.tsx`) — SSR law detail with "In the Years Following" charts
7. **Your Life page** (`app/your-life/page.tsx`) — birth year input → personalized timeline
8. **Compare Eras page** (`app/compare/page.tsx`) — side-by-side presidential era comparison
9. **About page** (`app/about/page.tsx`) — methodology, sources, caveats
10. **Remaining 45 law entries** in `data/laws.json` (see law list below)

## Setup

```bash
npm install
cp .env.local.example .env.local
# Add your FRED API key to .env.local
# Get one free at: https://fred.stlouisfed.org/docs/api/api_key.html
npm run dev
```

## Design System — "The Punch Card"

The entire app evokes IBM 80-column punch cards, government report cards, and factory time-clock records. This is thematically appropriate — legislation IS bureaucracy, and these laws were literally processed on punch cards.

### Colors (defined as CSS variables in globals.css and Tailwind tokens)
- **Background**: Warm aged paper `#F5F0E8`, card surface `#EDE8DC`
- **Borders**: Tan `#C4B99A`, dark `#8A7E66`
- **Text**: Near-black `#2C2416`, secondary `#6B5D4A`, muted `#9A8C74`
- **Party**: Democrat `#3B5998` (muted steel blue), Republican `#B44040` (muted red)
- **Accent**: Gold/amber `#D4A34A` for highlights and annotation markers
- **Ink stamp**: `#1A1408` for maximum emphasis

### Typography
- **Body/data**: `IBM Plex Mono` (monospace) — loaded via Google Fonts in globals.css
- **Headings**: `IBM Plex Sans Condensed` (condensed sans) — uppercase, letter-spaced
- All text should feel typed on a Selectric or printed by a line printer

### Key Visual Elements
- **Perforated holes**: Row of small circles along top/bottom edges of cards (radial-gradient CSS)
- **Dashed dividers**: `border-top: 2px dashed var(--border-primary)` between card sections
- **Stacked card shadow**: `box-shadow: 2px 3px 0 #C4B99A, 4px 6px 0 #E6E0D2`
- **Paper grain**: Subtle repeating-linear-gradient on body background
- **Card hover**: translateY(-1px) + deeper shadow — like lifting a card from a stack
- **Transitions**: 150ms ease — mechanical, no bounce/elastic

### Layout Rules (IMPORTANT)
1. **Card headers always stack vertically** — title full-width on top, metadata (type badge + category + year) on a separate line below. Never side-by-side — long names like "CITIZENS UNITED V. FEC" wrap badly next to badges.
2. **"DO NOT FOLD, SPINDLE, OR MUTILATE" appears ONLY in the page footer** (in layout.tsx). Individual cards have a sources line at bottom. Do not duplicate between card and page footer.
3. **Vote bar tallies need min-width** — the party label, bar, and tally ("106 YEA · 71 NAY") should never wrap. On narrow screens, collapse tally below the bar.
4. **Punch holes degrade gracefully** — reduce count on narrow viewports with overflow:hidden.

### CSS Classes Available (defined in globals.css)
- `.punch-card` — card container with border, shadow, rounded corners
- `.punch-divider` — dashed horizontal divider
- `.section-label` — uppercase muted label for card sections
- `.meta-grid` — 2-column grid for metadata key-value pairs
- `.meta-label` — muted uppercase label in meta grid
- `.btn` / `.btn-active` — monospace rectangular buttons

## Data Architecture

### FRED API
- Proxy at `/api/fred/series?id=CPIAUCSL&start=1947-01-01`
- Returns `{ series: {...metadata}, observations: [{date, value}...] }`
- In-memory cache with 24hr TTL
- `lib/fred.ts` has `fetchFredSeries()` and `normalizeSeries()` functions
- Series are organized in `data/fred-series.json` into 6 groups: Cost of Living, What You Earn, The Wealth Gap, Housing, Labor & Work, Debt & Education

### Law Data
- `data/laws.json` — curated dataset, each entry has: id, slug, name, formalName, date, type (legislation|court_decision|executive_action), category[], summary, president, congress, vote (house/senate/court), sponsors[], relatedFredSeries[], relatedLaws[]
- `lib/laws.ts` — typed access functions: getAllLaws(), getLawBySlug(), getLawsByCategory(), getLawsInDateRange()

### Presidential Eras
- `data/presidents.json` — name, party, start/end dates for timeline background bands

## Views

### 1. Timeline (Homepage `/`)
A D3.js interactive chart spanning 1947–present. Users toggle economic indicators on/off and see vertical annotation markers for laws. Features:
- Multi-series line chart with zoom/pan on x-axis
- Vertical dashed annotation lines at each law's date
- Hover card on annotations showing law name + summary + vote
- Presidential era background bands (subtle alternating fill)
- Indicator toggle pills grouped by theme
- Category filter pills for laws (Labor, Finance, Healthcare, etc.)
- Normalize toggle (index all series to 100 at baseline year)

### 2. Report Card (`/law/[slug]`)
SSR page for each law. Punch card component with:
- Header: name, formal name, type badge, category, year
- Metadata grid: date signed, president (with party color), congress control
- Summary paragraph
- Vote breakdown: visual bars per party for House and Senate (or court decision blocks)
- Key sponsors
- "In the Years Following" — focused charts showing related FRED series 5yr before → 10yr after
- Causation disclaimer on every card
- Related laws links
- Sources line

### 3. Your Life (`/your-life`)
Enter birth year → filtered timeline showing only your lifetime + summary stats:
"Since you were born in [year], real median household income rose X% while housing costs rose Y%..."

### 4. Compare Eras (`/compare`)
Pick two presidential administrations → side-by-side % change in key indicators during each.

### 5. About (`/about`)
Methodology, data sources, causation caveats, how laws were selected.

## Neutrality Principle

The app NEVER says a law was good or bad. It shows: what the law did, who passed it (with party breakdown), and what happened to economic indicators in the years following. Every "In the Years Following" chart includes this disclaimer:

> Many factors influence economic outcomes. This chart shows trends in the years surrounding this legislation — not necessarily caused by it.

## The 50 MVP Laws to Curate

Currently 5 are in laws.json. The remaining 45 need research. Each needs: vote counts by party, sponsors, president action, summary, related FRED series. Here's the full target list:

**Labor (8)**: Wagner Act 1935, Fair Labor Standards Act 1938, Taft-Hartley 1947 ✅, Landrum-Griffin 1959, OSHA Act 1970, PATCO firing 1981 (exec action), NAFTA 1993, PNTR China 2000

**Finance (8)**: Glass-Steagall 1933 ✅, Securities Exchange Act 1934, Bank Holding Co Act 1956, DIDMCA 1980, Garn-St. Germain 1982, Gramm-Leach-Bliley 1999 ✅, Commodity Futures Modernization 2000, Dodd-Frank 2010

**Healthcare (6)**: Medicare/Medicaid 1965, ERISA 1974, COBRA 1985, HIPAA 1996, ACA 2010 ✅, Inflation Reduction Act 2022

**Tax (7)**: Revenue Act 1964, Tax Reform Act 1986, OBRA 1993, EGTRRA 2001, JGTRRA 2003, American Taxpayer Relief 2012, TCJA 2017

**Housing (6)**: National Housing Act 1934, Fair Housing Act 1968, CRA 1977, Tax Reform 1986 (housing), HERA 2008, Dodd-Frank housing provisions

**Trade (5)**: Smoot-Hawley 1930, Reciprocal Trade 1934, Trade Expansion Act 1962, Trade Act 1974, USMCA 2020

**Campaign Finance (5)**: FECA 1971, Buckley v. Valeo 1976 (court), McCain-Feingold 2002, Citizens United 2010 ✅ (court), Shelby County v. Holder 2013 (court)

**Safety Net (5)**: Social Security Act 1935, GI Bill 1944, Civil Rights Act 1964, Welfare Reform 1996, American Rescue Plan 2021

## Tech Notes
- D3 for the timeline (not Recharts/Chart.js — need full control over annotations, zoom, background bands)
- Recharts acceptable for simpler before/after charts on report cards
- Next.js API routes proxy FRED to keep API key server-side
- All law data is static JSON in the repo — no database needed at this scale
- Vercel for deployment

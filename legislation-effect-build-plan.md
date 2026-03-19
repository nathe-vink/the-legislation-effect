# The Legislation Effect — Detailed Build Plan

*How Laws Changed Your Life: an interactive explorer connecting legislation to economic outcomes*

---

## 1. Product Vision

A single-page web app with an interactive timeline at its core. Users explore decades of economic data — wages, housing costs, healthcare costs, inequality, productivity — annotated with the landmark legislation that shaped those trends. Every law gets a "report card" showing what it did, who passed it, and what happened in the years that followed.

The app has three entry points:

1. **The Timeline** — the primary view. A zoomable, pannable time-series chart spanning ~1947 to present. Users toggle economic indicators on/off and see vertical annotation markers for landmark legislation.

2. **Your Life** — enter your birth year. The app narrows to your lifetime, highlights the laws passed since you were born, and shows how the key economic indicators changed over that span.

3. **Report Cards** — click any law to see a dedicated view: plain-language summary, vote breakdown by party, key sponsors, the president who signed it, and a focused before/after chart of the most relevant economic indicators.

A secondary "Compare Eras" view allows side-by-side comparison of economic outcomes across presidential administrations or congressional makeups.

---

## 2. Information Architecture

```
/                         → Landing + Timeline (default view)
/your-life                → Birth year entry → personalized timeline
/law/[slug]               → Report card for a specific law
/compare                  → Compare Eras view
/about                    → Methodology, data sources, caveats
```

### The Timeline View (/)

```
┌─────────────────────────────────────────────────────────────┐
│  THE LEGISLATION EFFECT                          [Your Life]│
├─────────────────────────────────────────────────────────────┤
│  Indicator toggles:                                         │
│  [■ Real Wages] [■ Housing] [□ Healthcare] [□ Inequality]   │
│  [□ Union Membership] [□ Productivity] [□ Corp. Profits]    │
│                                                             │
│  Category filters:                                          │
│  [All] [Labor] [Finance] [Healthcare] [Housing] [Tax]       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          THE CHART                                  │    │
│  │                                                     │    │
│  │   $65k ─┤          ╱─╲        ╱───                  │    │
│  │         │        ╱     ╲    ╱                        │    │
│  │   $55k ─┤──────╱        ╲╱                           │    │
│  │         │    ╱                                       │    │
│  │   $45k ─┤──╱                                         │    │
│  │         │ ┊      ┊         ┊    ┊        ┊           │    │
│  │         ├──┼──────┼─────────┼────┼────────┼──────►    │    │
│  │        1960   1970      1986  1994     2010           │    │
│  │              │      │         │    │        │         │    │
│  │          Taft-  ERISA    Tax   NAFTA     ACA          │    │
│  │          Hartley       Reform                         │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │  HOVERED LAW CARD (appears on annotation hover)    │     │
│  │                                                    │     │
│  │  Tax Reform Act of 1986                            │     │
│  │  Simplified the tax code, lowered top individual   │     │
│  │  rate from 50% to 28%, raised capital gains tax.   │     │
│  │                                                    │     │
│  │  Signed: Reagan (R) │ House: 292-136 │ Senate: 74-23│    │
│  │  Party control: R Senate, D House, R White House   │     │
│  │                                                    │     │
│  │  [View Full Report Card →]                         │     │
│  └────────────────────────────────────────────────────┘     │
│                                                             │
│  Presidential eras (subtle background bands):               │
│  ░░Eisenhower░░│░░JFK/LBJ░░│░Nixon/Ford│░░Carter░░│etc.    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Report Card View (/law/[slug])

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Timeline              THE LEGISLATION EFFECT     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  TAFT-HARTLEY ACT (1947)                               │ │
│  │  Labor Management Relations Act                         │ │
│  │                                                         │ │
│  │  Category: Labor & Unions                               │ │
│  │  Signed: June 23, 1947                                  │ │
│  │  President: Harry Truman (D) — VETOED, overridden       │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │                                                         │ │
│  │  WHAT IT DID                                            │ │
│  │  Restricted union power by banning closed shops,        │ │
│  │  allowing states to pass right-to-work laws, and        │ │
│  │  authorizing presidential injunctions against            │ │
│  │  strikes threatening national security. Amended         │ │
│  │  the pro-union Wagner Act of 1935.                      │ │
│  │                                                         │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │                                                         │ │
│  │  THE VOTE                                               │ │
│  │                                                         │ │
│  │  House: 331-83 (override)    Senate: 68-25 (override)   │ │
│  │  ┌──────────────────┐        ┌──────────────────┐       │ │
│  │  │ D:  Yea 106      │        │ D:  Yea 20       │       │ │
│  │  │     Nay 71       │        │     Nay 22       │       │ │
│  │  │ R:  Yea 225      │        │ R:  Yea 48       │       │ │
│  │  │     Nay 12       │        │     Nay 3        │       │ │
│  │  └──────────────────┘        └──────────────────┘       │ │
│  │                                                         │ │
│  │  Key Sponsors: Sen. Robert Taft (R-OH),                 │ │
│  │  Rep. Fred Hartley (R-NJ)                               │ │
│  │                                                         │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │                                                         │ │
│  │  IN THE YEARS FOLLOWING                                 │ │
│  │  (5 years before → 10 years after)                      │ │
│  │                                                         │ │
│  │  [Focused chart: Union Membership Rate]                 │ │
│  │  [Focused chart: Real Average Hourly Earnings]          │ │
│  │                                                         │ │
│  │  ⚠ Correlation note: Many factors influence economic    │ │
│  │  outcomes. These charts show what happened in the       │ │
│  │  years surrounding this law, not necessarily because    │ │
│  │  of it.                                                 │ │
│  │                                                         │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │                                                         │ │
│  │  RELATED LEGISLATION                                    │ │
│  │  • Wagner Act (1935) — established union rights         │ │
│  │  • Landrum-Griffin Act (1959) — further union reform    │ │
│  │                                                         │ │
│  │  SOURCES                                                │ │
│  │  Congress.gov • VoteView • FRED                         │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Data Architecture

### 3a. Economic Indicator Data (from FRED API)

These are fetched from the FRED API and cached. Organized into thematic groups for the UI toggles:

**Group: "The Cost of Living"**

| Display Name | FRED Series ID | Frequency | Starts | Notes |
|---|---|---|---|---|
| CPI — All Items | `CPIAUCSL` | Monthly | 1947 | Indexed, seasonally adjusted |
| CPI — Housing/Shelter | `CUSR0000SAH1` | Monthly | 1947 | |
| CPI — Medical Care | `CPIMEDSL` | Monthly | 1947 | |
| CPI — Food | `CPIUFDSL` | Monthly | 1967 | |
| CPI — Energy | `CPIENGSL` | Monthly | 1957 | |
| CPI — Education & Communication | `CUSR0000SAE` | Monthly | 1993 | |

**Group: "What You Earn"**

| Display Name | FRED Series ID | Frequency | Starts | Notes |
|---|---|---|---|---|
| Real Median Household Income | `MEHOINUSA672N` | Annual | 1984 | Census data |
| Avg Hourly Earnings (Production Workers) | `AHETPI` | Monthly | 1964 | Real (inflation-adj) preferred |
| Federal Minimum Wage | `FEDMINNFRWG` | Annual | 1938 | Or manually maintained |
| Employment Cost Index | `ECIWAG` | Quarterly | 2001 | Wages & salaries |

**Group: "The Wealth Gap"**

| Display Name | FRED Series ID | Frequency | Starts | Notes |
|---|---|---|---|---|
| Gini Index | `GINIALLRF` | Annual | 1967 | Income inequality |
| Corporate Profits After Tax | `CP` | Quarterly | 1947 | |
| Labor Share of Income (Nonfarm) | `PRS85006173` | Quarterly | 1947 | |
| Nonfarm Productivity (Output/Hour) | `OPHNFB` | Quarterly | 1947 | Productivity vs. wage gap |
| S&P 500 | `SP500` | Monthly | 1957 | Market proxy |
| Personal Savings Rate | `PSAVERT` | Monthly | 1959 | |

**Group: "Housing"**

| Display Name | FRED Series ID | Frequency | Starts | Notes |
|---|---|---|---|---|
| House Price Index (All-Transactions) | `USSTHPI` | Quarterly | 1975 | |
| Homeownership Rate | `RHORUSQ156N` | Quarterly | 1965 | |
| 30-Year Fixed Mortgage Rate | `MORTGAGE30US` | Weekly | 1971 | |

**Group: "Labor & Work"**

| Display Name | FRED Series ID | Frequency | Starts | Notes |
|---|---|---|---|---|
| Union Membership Rate | `LUU0204899600` | Annual | 1983 | BLS; pre-1983 from academic data |
| Unemployment Rate | `UNRATE` | Monthly | 1948 | |
| Labor Force Participation | `CIVPART` | Monthly | 1948 | |

**Group: "Debt & Education"**

| Display Name | FRED Series ID | Frequency | Starts | Notes |
|---|---|---|---|---|
| Student Loan Debt Outstanding | `SLOAS` | Quarterly | 2006 | |
| Household Debt Service Ratio | `TDSP` | Quarterly | 1980 | |
| College Tuition CPI | `CUSR0000SEEB01` | Monthly | 1978 | |

**Non-FRED data (manually maintained or fetched from other sources):**

| Display Name | Source | Format | Notes |
|---|---|---|---|
| National Health Expenditure Per Capita | CMS.gov | Annual CSV download | Goes back to 1960 |
| CEO-to-Worker Pay Ratio | Economic Policy Institute | Annual, published dataset | Goes back to 1965 |
| Union Membership (pre-1983) | Hirsch/Macpherson unionstats.com | Annual | Extends BLS series back to ~1930 |

### 3b. Legislation Data (the curated dataset)

This is the core intellectual property — a JSON file maintained in the repo. Each law is an object:

```json
{
  "id": "taft-hartley-1947",
  "slug": "taft-hartley-act",
  "name": "Taft-Hartley Act",
  "formalName": "Labor Management Relations Act of 1947",
  "date": "1947-06-23",
  "type": "legislation",
  "category": ["labor"],
  "subcategory": ["unions", "collective-bargaining"],

  "summary": "Restricted union power by banning closed shops, allowing states to pass right-to-work laws, and authorizing presidential injunctions against strikes. Amended the pro-union Wagner Act of 1935.",

  "president": {
    "name": "Harry S. Truman",
    "party": "D",
    "action": "vetoed",
    "overridden": true
  },

  "congress": {
    "number": 80,
    "houseControl": "R",
    "senateControl": "R"
  },

  "vote": {
    "house": {
      "yea": 331, "nay": 83,
      "yea_d": 106, "nay_d": 71,
      "yea_r": 225, "nay_r": 12,
      "type": "veto override"
    },
    "senate": {
      "yea": 68, "nay": 25,
      "yea_d": 20, "nay_d": 22,
      "yea_r": 48, "nay_r": 3,
      "type": "veto override"
    }
  },

  "sponsors": [
    { "name": "Robert A. Taft", "party": "R", "state": "OH", "chamber": "Senate" },
    { "name": "Fred A. Hartley Jr.", "party": "R", "state": "NJ", "chamber": "House" }
  ],

  "relatedFredSeries": ["LUU0204899600", "AHETPI", "OPHNFB"],
  "relatedLaws": ["wagner-act-1935", "landrum-griffin-1959"],

  "congressGovUrl": "https://www.congress.gov/bill/80th-congress/house-bill/3020",
  "wikipediaUrl": "https://en.wikipedia.org/wiki/Taft%E2%80%93Hartley_Act"
}
```

### 3c. Presidential Eras Data (for background bands)

A simple JSON array for rendering presidential era background bands on the timeline:

```json
[
  { "name": "Truman", "party": "D", "start": "1945-04-12", "end": "1953-01-20" },
  { "name": "Eisenhower", "party": "R", "start": "1953-01-20", "end": "1961-01-20" },
  ...
]
```

### 3d. Congressional Control Data (for context)

Per-Congress (every 2 years) party control of House and Senate, sourced from VoteView or manually maintained:

```json
[
  { "congress": 80, "years": "1947-1949", "house": "R", "senate": "R" },
  { "congress": 81, "years": "1949-1951", "house": "D", "senate": "D" },
  ...
]
```

---

## 4. Technical Architecture

### Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR for SEO on report card pages, client-side interactivity for charts |
| Charts | D3.js | Full control over the annotated timeline; no charting library handles this specific UX pattern well out of the box |
| Supplementary charts | Recharts | For simpler charts on report card pages (before/after bars, vote breakdowns) |
| Styling | Tailwind CSS | Fast iteration, consistent design tokens |
| Data fetching | Next.js API routes as proxy → FRED API | Handles API key securely, adds caching layer |
| Caching | File-system cache or Vercel KV | FRED data doesn't change often; cache for 24hrs |
| Content | JSON files in repo (`/data/laws.json`, `/data/presidents.json`, etc.) | Version-controlled, easy to edit and review |
| Hosting | Vercel | Free tier is fine for launch; great Next.js integration |
| Analytics | Plausible or Umami (self-hosted) | Privacy-respecting, see what people explore |

### API Architecture

```
Browser
  │
  ├─→ /api/fred/series?id=CPIAUCSL&start=1947-01-01
  │     └─→ Check cache → if miss, fetch from api.stlouisfed.org → cache → return
  │
  ├─→ /api/laws (returns full curated dataset, ~50-100KB)
  │     └─→ Static JSON, no external API needed
  │
  ├─→ /api/laws/[slug] (returns single law detail)
  │     └─→ Static JSON lookup
  │
  └─→ All chart rendering happens client-side in D3
```

### Key Technical Decisions

**Why D3 instead of a chart library?**
The core interaction — a multi-series time-series chart with zoomable x-axis, vertical annotation lines that are hoverable, presidential era background bands, and a floating card on hover — is a bespoke visualization. Recharts/Chart.js can't do the annotation layer well. D3 gives full control.

**Why cache FRED locally instead of hitting the API live?**
FRED API is fast but has a 120 req/min rate limit. For the initial load, a user might trigger 6-10 series fetches. Caching server-side for 24 hours eliminates this concern and makes the app feel instant. FRED data updates infrequently (monthly at most for most series).

**Why JSON files in the repo instead of a database?**
The legislation dataset is small (~200 laws), changes infrequently, and benefits from version control and easy code review. A database adds deployment complexity for no benefit at this scale. If it grows to thousands of entries later, migrate to Supabase/Postgres.

---

## 5. The Curated Legislation Dataset — MVP Scope

For the MVP, curate **50 laws** across 7 categories. Prioritize laws with clear, measurable economic impact and high name recognition. Here's the starter list:

### Labor & Unions (8)
1. Wagner Act (1935) — established right to unionize
2. Fair Labor Standards Act (1938) — minimum wage, 40-hour week
3. Taft-Hartley Act (1947) — restricted union power
4. Landrum-Griffin Act (1959) — union reporting requirements
5. OSHA Act (1970) — workplace safety
6. PATCO Strike / Executive Order (1981) — Reagan fires air traffic controllers (executive action, not legislation, but economically pivotal)
7. NAFTA Implementation Act (1993) — trade/labor intersection
8. PNTR with China (2000) — permanent normal trade relations

### Financial Regulation (8)
9. Glass-Steagall Act (1933) — separated commercial/investment banking
10. Securities Exchange Act (1934) — created SEC
11. Bank Holding Company Act (1956) — limited bank activities
12. Depository Institutions Deregulation Act (1980) — phased out interest rate ceilings
13. Garn-St. Germain Act (1982) — S&L deregulation
14. Gramm-Leach-Bliley Act (1999) — repealed Glass-Steagall
15. Commodity Futures Modernization Act (2000) — deregulated derivatives
16. Dodd-Frank Act (2010) — post-crisis financial reform

### Healthcare (6)
17. Medicare & Medicaid (1965) — Social Security Amendments
18. ERISA (1974) — employer-sponsored benefit regulation
19. COBRA (1985) — continuation of health coverage
20. HIPAA (1996) — portability and privacy
21. Affordable Care Act (2010) — near-universal coverage mandate
22. Inflation Reduction Act (2022) — Medicare drug price negotiation

### Tax Policy (7)
23. Revenue Act of 1964 — Kennedy/Johnson tax cuts
24. Tax Reform Act of 1986 — Reagan simplification, lowered rates
25. Omnibus Budget Reconciliation Act of 1993 — Clinton tax increases
26. Economic Growth and Tax Relief Reconciliation Act (2001) — Bush cuts
27. Jobs and Growth Tax Relief Reconciliation Act (2003) — Bush cuts pt. 2
28. American Taxpayer Relief Act (2012) — fiscal cliff deal
29. Tax Cuts and Jobs Act (2017) — Trump tax reform

### Housing (6)
30. National Housing Act (1934) — created FHA
31. Fair Housing Act (1968) — anti-discrimination
32. Community Reinvestment Act (1977) — lending in underserved areas
33. Tax Reform Act of 1986 (housing provisions) — changed real estate tax treatment
34. Housing and Economic Recovery Act (2008) — HERA, created FHFA
35. Dodd-Frank (housing provisions) — qualified mortgage rules

### Trade & Globalization (5)
36. Smoot-Hawley Tariff Act (1930) — protectionist tariffs before Depression
37. Reciprocal Trade Agreements Act (1934) — presidential tariff authority
38. Trade Expansion Act (1962) — Kennedy Round authority
39. Trade Act of 1974 — fast-track authority, Section 301
40. USMCA (2020) — NAFTA replacement

### Campaign Finance / Corporate Power (5)
41. Federal Election Campaign Act (1971) — contribution limits
42. *Buckley v. Valeo* (1976) — SCOTUS: money = speech
43. Bipartisan Campaign Reform Act (2002) — McCain-Feingold
44. *Citizens United v. FEC* (2010) — SCOTUS: corporate spending = speech
45. *Shelby County v. Holder* (2013) — SCOTUS: gutted Voting Rights Act preclearance

### Landmark Social Safety Net (5)
46. Social Security Act (1935) — retirement safety net
47. GI Bill (1944) — education and housing benefits
48. Civil Rights Act (1964) — anti-discrimination (economic mobility implications)
49. Personal Responsibility and Work Opportunity Act (1996) — welfare reform
50. American Rescue Plan Act (2021) — COVID stimulus

---

## 6. Build Phases

### Phase 1: Foundation (Week 1)
**Goal: Render a working annotated timeline with real FRED data and 10 placeholder laws**

- [ ] Next.js project setup with TypeScript, Tailwind, D3
- [ ] FRED API proxy route with caching (`/api/fred/series`)
- [ ] D3 timeline component: renders a single FRED series with zoom/pan on x-axis
- [ ] Add multi-series support (toggle indicators on/off)
- [ ] Vertical annotation lines from a JSON file of laws (start with 10)
- [ ] Hover card on annotation lines showing law name + one-line summary
- [ ] Presidential era background bands (subtle colored stripes)
- [ ] Responsive layout, mobile considerations

### Phase 2: Report Cards + Content (Week 2)
**Goal: Full report card pages for all 50 laws, robust law data model**

- [ ] Build the curated legislation JSON for all 50 MVP laws (research-intensive)
- [ ] `/law/[slug]` route with SSR for SEO
- [ ] Report card layout: summary, vote breakdown (visual), sponsors, president
- [ ] "In the Years Following" focused charts (D3 or Recharts): 5yr before → 10yr after for related FRED series
- [ ] Correlation caveat language on every report card
- [ ] Related laws linking
- [ ] Source citations (Congress.gov links, FRED links)

### Phase 3: Your Life + Polish (Week 3)
**Goal: Personalized entry point, design polish, share mechanics**

- [ ] `/your-life` route: birth year input → filtered timeline
- [ ] "Since you were born..." summary stats (% change in key indicators)
- [ ] Highlighted laws on timeline scoped to user's lifetime
- [ ] Category filter pills on main timeline (Labor, Finance, Healthcare, etc.)
- [ ] Indicator grouping UI (toggle groups, not individual series)
- [ ] Index/normalize toggle (show all series rebased to 100 for comparison)
- [ ] Design polish: typography, color system, animation on annotation hover
- [ ] Open Graph / social sharing meta tags (screenshot-worthy chart images)
- [ ] About/methodology page

### Phase 4: Compare Eras + Launch (Week 4)
**Goal: Compare feature, performance, launch**

- [ ] `/compare` route: pick two presidential administrations or time periods
- [ ] Side-by-side indicator comparison (% change during each era)
- [ ] Party control context for each era
- [ ] Performance optimization: lazy-load FRED data, virtualize long series
- [ ] Lighthouse audit, accessibility pass
- [ ] Error states, loading states, empty states
- [ ] Analytics integration
- [ ] README, LICENSE, deployment config
- [ ] Launch: deploy to Vercel, share on Twitter/Reddit/HN

### Phase 5+: Post-Launch Iteration
- [ ] Expand to 150+ laws
- [ ] Add Supreme Court decisions as a distinct annotation type
- [ ] Add executive orders (PATCO, ACA mandate delay, etc.)
- [ ] State-level FRED data option (where available)
- [ ] "Contribute a law" — community submission flow
- [ ] Embed mode (for journalists, bloggers)
- [ ] Newsletter: "This week in legislation history" email with chart snapshots

---

## 7. Design Principles

### Neutrality
The app does not say "this law was good" or "this law was bad." It shows what happened. The vote breakdown reveals party alignment. The before/after charts reveal economic trends. Users form their own conclusions.

Where editorial judgment is unavoidable (selecting which laws to include, which FRED series to associate with each law), document the methodology transparently on the About page.

### Causation Disclaimer
Every report card and every "in the years following" chart includes language like:

> *Many factors influence economic outcomes. This chart shows trends in the years surrounding this legislation — not necessarily caused by it. Economic data reflects the cumulative effect of policy, global events, technology, and other forces.*

### Accessibility
- All charts have text alternatives and ARIA labels
- Color coding for party (blue D / red R) uses sufficient contrast and is paired with labels
- Timeline is navigable by keyboard
- Report cards are fully readable without JavaScript (SSR)

### Mobile
The timeline is the hardest component on mobile. Plan for:
- Horizontal scroll on small screens (not pinch-zoom, which conflicts with page zoom)
- Simplified annotation display on mobile (tap instead of hover)
- Report cards are naturally mobile-friendly (vertical stack)

---

## 7b. Visual Design — "The Punch Card" Aesthetic

### Concept
The entire app evokes the look of IBM 80-column punch cards, government report cards, and factory time-clock records — the physical bureaucratic artifacts of the 20th century. This isn't decorative nostalgia; it's thematically perfect. Legislation IS bureaucracy. These laws were literally processed on punch cards. The aesthetic says: "this is the machinery of democracy, laid bare."

### Color Palette

```
--bg-primary:       #F5F0E8;    /* Warm aged paper / card stock */
--bg-card:          #EDE8DC;    /* Slightly darker card surface */
--bg-card-alt:      #E6E0D2;    /* Alternating row stripe */
--border-primary:   #C4B99A;    /* Tan border, like card edges */
--border-dark:      #8A7E66;    /* Darker border for emphasis */
--text-primary:     #2C2416;    /* Near-black, warm brown-black */
--text-secondary:   #6B5D4A;    /* Muted brown for secondary text */
--text-muted:       #9A8C74;    /* Faded, like old typewriter ink */
--accent-red:       #B44040;    /* Republican / alert — muted, not bright */
--accent-blue:      #3B5998;    /* Democrat — muted steel blue */
--accent-mark:      #D4A34A;    /* Gold/amber for highlights, annotation markers */
--hole-punch:       #D6CEBC;    /* The "punched out" hole color — slightly lighter than bg */
--ink-stamp:        #1A1408;    /* Very dark, like a rubber stamp impression */
```

### Typography

**Primary / body**: `IBM Plex Mono` — the literal IBM typeface in monospace. Perfect thematic connection to punch cards and government computing. Available on Google Fonts.

**Display / headings**: `IBM Plex Sans Condensed` — same family, but condensed sans-serif for headings. Reads like the printed headers on punch cards and government forms.

**Accent / labels**: `IBM Plex Mono` at smaller weights for data labels, chart axes, metadata.

All text should feel like it was typed on a Selectric or printed by a line printer — consistent weight, no decorative flourishes, but with careful letter-spacing and line-height to feel intentional rather than default.

```css
body {
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.65;
  letter-spacing: 0.01em;
  color: var(--text-primary);
  background-color: var(--bg-primary);
}

h1, h2, h3 {
  font-family: 'IBM Plex Sans Condensed', 'Arial Narrow', sans-serif;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

### The Punch Card Component

Report cards are the centerpiece. Each one should look like a physical IBM punch card:

**Dimensions**: The real IBM card was 7⅜" × 3¼" (roughly 2.27:1 aspect ratio). Report cards on screen should echo this proportion, though they'll be taller to fit content. Use the width-to-corner-radius ratio of the real card.

**Structure**:
```
┌─ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ─┐
│                                                      │
│  TAFT-HARTLEY ACT                    LABOR │ 1947    │
│  ─────────────────────────────────────────────────── │
│  Labor Management Relations Act                      │
│                                                      │
│  SIGNED   June 23, 1947                              │
│  PRESIDENT Harry S. Truman (D) — VETOED, overridden  │
│  CONGRESS  80th │ House: R │ Senate: R               │
│                                                      │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│                                                      │
│  SUMMARY                                             │
│  Restricted union power by banning closed shops...   │
│                                                      │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│                                                      │
│  THE VOTE                                            │
│  HOUSE  331-83 (veto override)                       │
│    D ████████░░░░░  106 Yea │ 71 Nay                 │
│    R █████████████  225 Yea │ 12 Nay                  │
│                                                      │
│  SENATE  68-25 (veto override)                       │
│    D ████░░░░░░░░░  20 Yea │ 22 Nay                  │
│    R █████████████  48 Yea │ 3 Nay                    │
│                                                      │
├─ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ─┤
│                                                      │
│  IN THE YEARS FOLLOWING                              │
│  [chart area]                                        │
│                                                      │
│  ⚠ Many factors influence economic outcomes...       │
│                                                      │
│  RELATED                                             │
│  → Wagner Act (1935)                                 │
│  → Landrum-Griffin Act (1959)                        │
│                                                      │
│  SOURCES                                             │
│  Congress.gov │ VoteView │ FRED                      │
│                                                      │
└─ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ─┘
```

**CSS for the punch card holes (perforated edges)**:
```css
.punch-card {
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: 6px;            /* IBM cards had round corners post-1964 */
  padding: 2rem;
  position: relative;
  box-shadow: 
    2px 3px 0 var(--border-primary),    /* Stacked card shadow */
    4px 6px 0 var(--bg-card-alt);       /* Second card underneath */
}

/* Perforated edge holes — top and bottom */
.punch-card::before,
.punch-card::after {
  content: '';
  position: absolute;
  left: 1.5rem;
  right: 1.5rem;
  height: 8px;
  background: radial-gradient(
    circle,
    var(--bg-primary) 3px,        /* The "hole" — matches page background */
    transparent 3px
  ) repeat-x;
  background-size: 16px 8px;     /* Spacing between holes */
}
.punch-card::before { top: 10px; }
.punch-card::after { bottom: 10px; }
```

### Punch Card Layout Rules (learned from prototype)

These are hard rules to prevent visual bugs:

**1. Card header is always stacked vertically, never side-by-side.**
The law name goes full-width on its own line. The metadata row (type badge + category + year) goes on a separate line below it. Never attempt to flex the title and metadata into a single row — long titles like "CITIZENS UNITED V. FEC" will wrap badly when competing for horizontal space with a badge. Stack them.

```
✅ CORRECT:
CITIZENS UNITED V. FEC
⚖ COURT DECISION · CAMPAIGN FINANCE · 2010

❌ WRONG:
CITIZENS UNITED V. FEC          ⚖ COURT DECISION
                              CAMPAIGN FINANCE · 2010
```

**2. The "DO NOT FOLD, SPINDLE, OR MUTILATE" tagline appears ONLY in the page footer.**
Individual report cards have a sources line at the bottom (inside the card, before the closing punch holes). The page-level footer carries the "DO NOT FOLD" tagline, the data source credits, and the disclaimer. These are two distinct components — do not duplicate content between them.

```
Card footer (inside punch card):
  SOURCES: Congress.gov · VoteView · FRED

Page footer (outside all cards, bottom of page):
  ────────────────────────────
  DO NOT FOLD, SPINDLE, OR MUTILATE
  Data: FRED (St. Louis Fed) · Congress.gov · VoteView
  Built with public data · Not affiliated with any government agency
```

**3. Vote bars need minimum width for labels.**
The party label (D/R), the bar, and the tally (e.g., "106 YEA · 71 NAY") should never wrap. If the card is too narrow for all three inline, collapse the tally below the bar rather than wrapping mid-number. Set a `min-width` on the tally span.

**4. Punch holes are decorative and should degrade gracefully.**
On very narrow screens (< 400px), reduce hole count rather than letting holes crowd or overflow. The `PunchHoles` component should accept a responsive count or use CSS `gap` with `overflow: hidden` to let holes naturally drop off.

**The divider between sections** uses a dashed line that looks like the perforated tear line on old forms:
```css
.punch-card-divider {
  border: none;
  border-top: 2px dashed var(--border-primary);
  margin: 1.5rem 0;
}
```

### Vote Breakdown Visualization

Instead of standard bar charts, represent votes as a grid of small rectangles — like punched holes on a card. Each rectangle = 1 vote. Filled = Yea, Empty = Nay. Color-coded by party.

```
HOUSE  331-83 (veto override)

D  ■■■■■■■■■■■■■■■■■■■■□□□□□□□□□  106 YEA │ 71 NAY
R  ■■■■■■■■■■■■■■■■■■■■■■■■■■■□    225 YEA │ 12 NAY
```

Where ■ are small filled rectangles (like punch holes) and □ are empty ones. This directly references the punch card metaphor while being an effective data visualization.

### Timeline Chart Styling

The D3 timeline chart inherits the aesthetic:
- **Background**: `var(--bg-card)` with a subtle horizontal line grid resembling ruled ledger paper
- **Gridlines**: Light dashed lines in `var(--border-primary)`, like the row guides on a punch card
- **Data lines**: `var(--ink-stamp)` (dark), 2px stroke, no smoothing (stepped or angular, not bezier — data should look precise, not decorative)
- **Annotation lines**: Vertical dashed lines in `var(--accent-mark)` (gold/amber)
- **Annotation labels**: Rotated 90° monospace text along the line, like column headers on a punch card
- **Presidential era bands**: Very subtle background fill, barely visible — `var(--bg-card-alt)` with 30% opacity, alternating
- **Axis labels**: `IBM Plex Mono`, small, in `var(--text-muted)`

### Page Background Texture

Apply a subtle paper grain texture to the body using CSS:
```css
body {
  background-color: var(--bg-primary);
  background-image: url("data:image/svg+xml,..."); /* inline SVG noise pattern */
  /* Or: use a CSS filter for a subtle grain overlay */
}

/* Alternative: CSS-only noise */
body::before {
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  opacity: 0.03;
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.03) 2px,
      rgba(0,0,0,0.03) 3px
    );
  pointer-events: none;
  z-index: 9999;
}
```

### Hover & Interaction States

- **Cards on hover**: Slight lift (translate -1px Y) + shadow deepens — like picking up a card from a stack
- **Annotation hover on timeline**: The dashed vertical line becomes solid, gold highlight intensifies, card slides in from below
- **Links**: Underlined with a dotted underline (like typewriter), turn `var(--accent-mark)` on hover
- **Buttons**: Rectangular, monospace text, 1px border, no border-radius — flat like a keyboard key. Background darkens on hover.
- **Transitions**: 150ms ease — quick, mechanical, no bouncing or elastic easing. These are machines, not toys.

### The "DO NOT FOLD, SPINDLE, OR MUTILATE" Footer

Every IBM punch card carried the warning "DO NOT FOLD, SPINDLE, OR MUTILATE." The app footer should include a nod to this:

```
────────────────────────────────────────────────────
DO NOT FOLD, SPINDLE, OR MUTILATE

Data: FRED (St. Louis Fed) │ Congress.gov │ VoteView
Built with public data. Not affiliated with any government agency.
Methodology & Sources → /about
────────────────────────────────────────────────────
```

---

## 8. Design Decisions (Resolved)

1. **Timeline starts at 1947.** Robust FRED data begins here for most key series. Pre-1947 laws (Wagner Act 1935, Social Security 1935, Smoot-Hawley 1930) appear as annotations with a note that economic data for that period is limited.

2. **Default to normalized view** (all series indexed to 100 at a user-selectable baseline year, defaulting to 1970). Users can switch to raw values for a single series. This solves the scale problem of overlaying CPI (~300) with Gini (~0.48).

3. **Include non-FRED data** (CEO-to-worker pay ratio from EPI, union membership pre-1983 from academic sources, NHE per capita from CMS). Each non-FRED source is clearly labeled in the UI and documented on the About page with methodology notes.

4. **Include Supreme Court decisions** as a distinct annotation type. Visual marker is different from legislation (gavel icon or different dash pattern on the vertical line). The curated dataset `type` field distinguishes `"legislation"`, `"court_decision"`, and `"executive_action"`.

5. **No expert perspectives in MVP.** Report cards show: what the law did, who passed it, what the data shows. "What economists say" sections are a V2 feature if there's demand.

---

## 9. Success Metrics

**Engagement (what we can measure):**
- Time on site > 3 minutes average (indicates exploration, not bounce)
- Report card views per session > 2 (indicates people are going deep)
- "Your Life" completion rate (how many people who start the flow finish it)
- Social shares (Open Graph previews matter a lot here)

**Impact (what we hope for):**
- Cited in journalism or social media discussions about specific legislation
- Used in classrooms (a teacher sharing it is the ultimate signal)
- Contributes to more specific, evidence-informed political discourse

---

## 10. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Perceived political bias | High | Rigorous neutrality; methodology page; invite critique from both sides; show vote breakdowns, not opinions |
| Oversimplifying causation | High | Disclaimers on every chart; "in the years following" language; About page explaining why correlation ≠ causation |
| FRED API changes or goes down | Low | Cache aggressively; bundle static snapshots of key series as fallback |
| Congress.gov API rate limits | Low | Only used during build-time for enrichment; not hit at runtime |
| Scope creep (too many laws, features) | Medium | MVP is 50 laws, 4 views. Ship that. Expand based on what users actually explore. |
| Legal/political pressure | Low | All data is public domain or openly licensed. No proprietary data. No defamatory claims. |

---

## 11. File Structure

```
the-legislation-effect/
├── app/
│   ├── page.tsx                    # Timeline view (home)
│   ├── your-life/page.tsx          # Birth year → personalized view
│   ├── law/[slug]/page.tsx         # Report card (SSR)
│   ├── compare/page.tsx            # Compare Eras
│   ├── about/page.tsx              # Methodology
│   └── api/
│       └── fred/
│           └── series/route.ts     # FRED proxy with caching
├── components/
│   ├── Timeline/
│   │   ├── TimelineChart.tsx       # Main D3 chart
│   │   ├── AnnotationLine.tsx      # Vertical law marker
│   │   ├── HoverCard.tsx           # Floating law summary on hover
│   │   ├── PresidentialBands.tsx   # Background era shading
│   │   ├── IndicatorToggles.tsx    # Series on/off toggles
│   │   └── CategoryFilters.tsx     # Law category filter pills
│   ├── ReportCard/
│   │   ├── VoteBreakdown.tsx       # Visual vote display
│   │   ├── BeforeAfterChart.tsx    # Focused FRED chart
│   │   ├── SponsorList.tsx
│   │   └── RelatedLaws.tsx
│   └── YourLife/
│       ├── BirthYearInput.tsx
│       └── LifetimeSummary.tsx
├── data/
│   ├── laws.json                   # The 50 curated laws
│   ├── presidents.json             # Presidential eras
│   ├── congress-control.json       # Party control per Congress
│   ├── fred-series.json            # Series metadata (display names, groups)
│   └── supplementary/
│       ├── ceo-pay-ratio.json      # Non-FRED data
│       ├── union-membership-historical.json
│       └── nhe-per-capita.json
├── lib/
│   ├── fred.ts                     # FRED API client + cache logic
│   ├── laws.ts                     # Law data access helpers
│   └── normalize.ts                # Index/normalize series data
├── public/
│   └── og/                         # Pre-generated OG images
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 12. Day 1 Checklist

When you sit down tomorrow morning:

1. **Get API keys**
   - [ ] FRED API key: https://fred.stlouisfed.org/docs/api/api_key.html (instant, free)
   - [ ] Congress.gov API key: https://api.data.gov/signup/ (instant, free — same key works for GovInfo)

2. **Scaffold the project**
   - [ ] `npx create-next-app@latest the-legislation-effect --typescript --tailwind --app`
   - [ ] Install D3: `npm install d3 @types/d3`
   - [ ] Create the `/data` directory and start `laws.json` with 5 entries

3. **Build the FRED proxy**
   - [ ] `/api/fred/series/route.ts` — accept `?id=CPIAUCSL&start=1947-01-01`, proxy to FRED, cache response

4. **First chart**
   - [ ] Render a single FRED series (CPI) as a line chart with D3 in a React component
   - [ ] Add x-axis zoom/pan
   - [ ] Add one vertical annotation line (Taft-Hartley, 1947-06-23) with hover card

That's enough for day 1. Once the first annotated chart is rendering, everything else is iteration.

---

*This plan is designed to be built by one person in 4 weeks. The research on the 50 curated laws is the most time-consuming part — plan for ~1 hour per law to get the vote data, summary, sponsors, and FRED series associations right. The code is the easier half.*

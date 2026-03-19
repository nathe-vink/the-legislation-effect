import { useState } from "react";

const COLORS = {
  bgPrimary: "#F5F0E8",
  bgCard: "#EDE8DC",
  bgCardAlt: "#E6E0D2",
  borderPrimary: "#C4B99A",
  borderDark: "#8A7E66",
  textPrimary: "#2C2416",
  textSecondary: "#6B5D4A",
  textMuted: "#9A8C74",
  accentRed: "#B44040",
  accentBlue: "#3B5998",
  accentMark: "#D4A34A",
  holePunch: "#D6CEBC",
  inkStamp: "#1A1408",
};

const sampleLaws = [
  {
    id: "taft-hartley-1947",
    name: "Taft-Hartley Act",
    formalName: "Labor Management Relations Act of 1947",
    date: "1947-06-23",
    year: 1947,
    type: "legislation",
    category: "LABOR",
    summary: "Restricted union power by banning closed shops, allowing states to pass right-to-work laws, and authorizing presidential injunctions against strikes threatening national security. Amended the pro-union Wagner Act of 1935.",
    president: { name: "Harry S. Truman", party: "D", action: "VETOED", overridden: true },
    congress: { number: 80, houseControl: "R", senateControl: "R" },
    vote: {
      house: { yea: 331, nay: 83, yea_d: 106, nay_d: 71, yea_r: 225, nay_r: 12, type: "veto override" },
      senate: { yea: 68, nay: 25, yea_d: 20, nay_d: 22, yea_r: 48, nay_r: 3, type: "veto override" },
    },
    sponsors: [
      { name: "Robert A. Taft", party: "R", state: "OH", chamber: "Senate" },
      { name: "Fred A. Hartley Jr.", party: "R", state: "NJ", chamber: "House" },
    ],
    relatedLaws: ["Wagner Act (1935)", "Landrum-Griffin Act (1959)"],
  },
  {
    id: "citizens-united-2010",
    name: "Citizens United v. FEC",
    formalName: "Citizens United v. Federal Election Commission, 558 U.S. 310",
    date: "2010-01-21",
    year: 2010,
    type: "court_decision",
    category: "CAMPAIGN FINANCE",
    summary: "Supreme Court ruled that the First Amendment prohibits the government from restricting independent expenditures for political campaigns by corporations, associations, or labor unions. Effectively allowed unlimited corporate spending on elections.",
    president: { name: "Barack Obama", party: "D", action: "N/A (Court decision)", overridden: false },
    congress: { number: 111, houseControl: "D", senateControl: "D" },
    vote: {
      court: { majority: 5, dissent: 4, opinion: "Kennedy", dissentBy: "Stevens" },
    },
    sponsors: [
      { name: "Anthony Kennedy", party: "—", state: "—", chamber: "Majority Opinion" },
      { name: "John Paul Stevens", party: "—", state: "—", chamber: "Dissent" },
    ],
    relatedLaws: ["FECA (1971)", "McCain-Feingold Act (2002)"],
  },
  {
    id: "aca-2010",
    name: "Affordable Care Act",
    formalName: "Patient Protection and Affordable Care Act",
    date: "2010-03-23",
    year: 2010,
    type: "legislation",
    category: "HEALTHCARE",
    summary: "Expanded health insurance coverage to millions of uninsured Americans through Medicaid expansion, health insurance marketplaces, and an individual mandate. Prohibited denial of coverage for pre-existing conditions and allowed children to remain on parents' plans until age 26.",
    president: { name: "Barack Obama", party: "D", action: "SIGNED", overridden: false },
    congress: { number: 111, houseControl: "D", senateControl: "D" },
    vote: {
      house: { yea: 219, nay: 212, yea_d: 219, nay_d: 34, yea_r: 0, nay_r: 178, type: "passage" },
      senate: { yea: 60, nay: 39, yea_d: 58, nay_d: 0, yea_r: 0, nay_r: 39, type: "passage" },
    },
    sponsors: [
      { name: "Charles Rangel", party: "D", state: "NY", chamber: "House" },
      { name: "Harry Reid", party: "D", state: "NV", chamber: "Senate" },
    ],
    relatedLaws: ["Medicare/Medicaid (1965)", "Inflation Reduction Act (2022)"],
  },
];

function PunchHoles({ count = 24 }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "8px", padding: "6px 24px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: COLORS.bgPrimary,
            border: `1px solid ${COLORS.borderPrimary}`,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

function VoteBar({ party, yea, nay, color }) {
  const total = yea + nay;
  const yeaPct = (yea / total) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
      <span style={{ width: "16px", fontWeight: 700, color, fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px" }}>{party}</span>
      <div style={{ flex: 1, display: "flex", height: "14px", border: `1px solid ${COLORS.borderPrimary}`, borderRadius: "1px", overflow: "hidden" }}>
        <div style={{ width: `${yeaPct}%`, backgroundColor: color, opacity: 0.8, transition: "width 0.6s ease" }} />
        <div style={{ flex: 1, backgroundColor: COLORS.bgPrimary }} />
      </div>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: COLORS.textSecondary, minWidth: "120px" }}>
        {yea} YEA · {nay} NAY
      </span>
    </div>
  );
}

function CourtVote({ majority, dissent, opinion, dissentBy }) {
  return (
    <div style={{ padding: "12px 0" }}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
        {Array.from({ length: majority }).map((_, i) => (
          <div key={`m-${i}`} style={{ width: "20px", height: "28px", backgroundColor: COLORS.accentMark, borderRadius: "2px", border: `1px solid ${COLORS.borderDark}` }} />
        ))}
        <div style={{ width: "2px", backgroundColor: COLORS.borderPrimary, margin: "0 4px" }} />
        {Array.from({ length: dissent }).map((_, i) => (
          <div key={`d-${i}`} style={{ width: "20px", height: "28px", backgroundColor: COLORS.bgPrimary, borderRadius: "2px", border: `1px solid ${COLORS.borderPrimary}` }} />
        ))}
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: COLORS.textSecondary }}>
        {majority}–{dissent} · Opinion: {opinion} · Dissent: {dissentBy}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ borderTop: `2px dashed ${COLORS.borderPrimary}`, margin: "20px 0" }} />
  );
}

function ReportCard({ law }) {
  const partyColor = (p) => p === "D" ? COLORS.accentBlue : p === "R" ? COLORS.accentRed : COLORS.textSecondary;
  const isCourtDecision = law.type === "court_decision";
  const typeLabel = isCourtDecision ? "⚖ COURT DECISION" : "§ LEGISLATION";

  return (
    <div
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.borderPrimary}`,
        borderRadius: "6px",
        maxWidth: "640px",
        width: "100%",
        position: "relative",
        boxShadow: `2px 3px 0 ${COLORS.borderPrimary}, 4px 6px 0 ${COLORS.bgCardAlt}`,
        overflow: "hidden",
      }}
    >
      <PunchHoles count={window.innerWidth < 500 ? 14 : 24} />

      <div style={{ padding: "8px 28px 4px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans Condensed', sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.inkStamp, lineHeight: 1.2 }}>
              {law.name}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: COLORS.textSecondary, marginTop: "4px" }}>
              {law.formalName}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
              color: isCourtDecision ? COLORS.accentMark : COLORS.textMuted,
              border: `1px solid ${isCourtDecision ? COLORS.accentMark : COLORS.borderPrimary}`,
              padding: "2px 8px", borderRadius: "2px", display: "inline-block", marginBottom: "4px"
            }}>
              {typeLabel}
            </div>
            <div style={{ fontFamily: "'IBM Plex Sans Condensed', sans-serif", fontSize: "14px", fontWeight: 600, letterSpacing: "0.08em", color: COLORS.textSecondary, textTransform: "uppercase" }}>
              {law.category} · {law.year}
            </div>
          </div>
        </div>

        <Divider />

        {/* Metadata Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 16px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px" }}>
          <span style={{ color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {isCourtDecision ? "Decided" : "Signed"}
          </span>
          <span style={{ color: COLORS.textPrimary }}>{new Date(law.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>

          {!isCourtDecision && (
            <>
              <span style={{ color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>President</span>
              <span>
                <span style={{ color: partyColor(law.president.party) }}>{law.president.name} ({law.president.party})</span>
                {law.president.action !== "SIGNED" && (
                  <span style={{ color: COLORS.accentRed, fontWeight: 600 }}> — {law.president.action}{law.president.overridden ? ", overridden" : ""}</span>
                )}
              </span>
            </>
          )}

          <span style={{ color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Congress</span>
          <span style={{ color: COLORS.textPrimary }}>
            {law.congress.number}th · House: <span style={{ color: partyColor(law.congress.houseControl), fontWeight: 600 }}>{law.congress.houseControl}</span> · Senate: <span style={{ color: partyColor(law.congress.senateControl), fontWeight: 600 }}>{law.congress.senateControl}</span>
          </span>
        </div>

        <Divider />

        {/* Summary */}
        <div>
          <div style={{ fontFamily: "'IBM Plex Sans Condensed', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.textMuted, marginBottom: "8px" }}>
            {isCourtDecision ? "What the Court Ruled" : "What It Did"}
          </div>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: COLORS.textPrimary, lineHeight: 1.7, margin: 0 }}>
            {law.summary}
          </p>
        </div>

        <Divider />

        {/* Vote */}
        <div>
          <div style={{ fontFamily: "'IBM Plex Sans Condensed', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.textMuted, marginBottom: "12px" }}>
            The Vote
          </div>

          {law.vote.court ? (
            <CourtVote {...law.vote.court} />
          ) : (
            <>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: COLORS.textSecondary, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                House · {law.vote.house.yea}–{law.vote.house.nay} ({law.vote.house.type})
              </div>
              <VoteBar party="D" yea={law.vote.house.yea_d} nay={law.vote.house.nay_d} color={COLORS.accentBlue} />
              <VoteBar party="R" yea={law.vote.house.yea_r} nay={law.vote.house.nay_r} color={COLORS.accentRed} />

              <div style={{ height: "16px" }} />

              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: COLORS.textSecondary, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Senate · {law.vote.senate.yea}–{law.vote.senate.nay} ({law.vote.senate.type})
              </div>
              <VoteBar party="D" yea={law.vote.senate.yea_d} nay={law.vote.senate.nay_d} color={COLORS.accentBlue} />
              <VoteBar party="R" yea={law.vote.senate.yea_r} nay={law.vote.senate.nay_r} color={COLORS.accentRed} />
            </>
          )}
        </div>

        <Divider />

        {/* Sponsors */}
        <div>
          <div style={{ fontFamily: "'IBM Plex Sans Condensed', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.textMuted, marginBottom: "8px" }}>
            {isCourtDecision ? "Key Justices" : "Key Sponsors"}
          </div>
          {law.sponsors.map((s, i) => (
            <div key={i} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: COLORS.textPrimary, marginBottom: "2px" }}>
              → {s.name} {s.party !== "—" && <span style={{ color: partyColor(s.party) }}>({s.party}-{s.state})</span>} <span style={{ color: COLORS.textMuted }}>· {s.chamber}</span>
            </div>
          ))}
        </div>

        <Divider />

        {/* Related */}
        <div>
          <div style={{ fontFamily: "'IBM Plex Sans Condensed', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.textMuted, marginBottom: "8px" }}>
            Related
          </div>
          {law.relatedLaws.map((r, i) => (
            <div key={i} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: COLORS.accentMark, marginBottom: "2px", cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: "3px" }}>
              → {r}
            </div>
          ))}
        </div>

        <div style={{ height: "8px" }} />
      </div>

      <PunchHoles count={window.innerWidth < 500 ? 14 : 24} />

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${COLORS.borderPrimary}`,
        padding: "8px 28px",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "10px",
        color: COLORS.textMuted,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "4px",
      }}>
        <span>Sources: Congress.gov · VoteView · FRED</span>
        <span>Do not fold, spindle, or mutilate</span>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const law = sampleLaws[selectedIndex];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: COLORS.bgPrimary,
      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 3px)`,
      padding: "32px 16px",
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans+Condensed:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ maxWidth: "640px", margin: "0 auto 32px", textAlign: "center" }}>
        <div style={{
          fontFamily: "'IBM Plex Sans Condensed', sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: COLORS.textMuted,
          marginBottom: "8px",
        }}>
          The Legislation Effect
        </div>
        <div style={{
          fontFamily: "'IBM Plex Sans Condensed', sans-serif",
          fontSize: "28px",
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: COLORS.inkStamp,
          lineHeight: 1.2,
          marginBottom: "8px",
        }}>
          HOW LAWS CHANGED YOUR LIFE
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "12px",
          color: COLORS.textSecondary,
        }}>
          Report Card Prototype · Punch Card Aesthetic
        </div>
      </div>

      {/* Selector */}
      <div style={{ maxWidth: "640px", margin: "0 auto 24px", display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        {sampleLaws.map((l, i) => (
          <button
            key={l.id}
            onClick={() => setSelectedIndex(i)}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
              padding: "6px 14px",
              border: `1px solid ${i === selectedIndex ? COLORS.borderDark : COLORS.borderPrimary}`,
              borderRadius: "2px",
              backgroundColor: i === selectedIndex ? COLORS.bgCardAlt : COLORS.bgPrimary,
              color: i === selectedIndex ? COLORS.inkStamp : COLORS.textSecondary,
              cursor: "pointer",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              transition: "all 150ms ease",
            }}
          >
            {l.name} ({l.year})
          </button>
        ))}
      </div>

      {/* Card */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ReportCard law={law} />
      </div>

      {/* Footer */}
      <div style={{
        maxWidth: "640px",
        margin: "48px auto 0",
        borderTop: `2px dashed ${COLORS.borderPrimary}`,
        paddingTop: "16px",
        textAlign: "center",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "10px",
        color: COLORS.textMuted,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        lineHeight: 2,
      }}>
        DO NOT FOLD, SPINDLE, OR MUTILATE<br />
        Data: FRED (St. Louis Fed) · Congress.gov · VoteView<br />
        Built with public data · Not affiliated with any government agency
      </div>
    </div>
  );
}

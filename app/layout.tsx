import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Legislation Effect — How Laws Changed Your Life",
  description:
    "Explore decades of economic data annotated with the landmark legislation that shaped wages, housing costs, healthcare, inequality, and more. See how specific laws impacted your life.",
  openGraph: {
    title: "The Legislation Effect",
    description: "How Laws Changed Your Life",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="max-w-6xl mx-auto px-4 pt-8 pb-4">
          <nav className="flex items-center justify-between flex-wrap gap-4">
            <a href="/" className="no-underline">
              <span className="font-mono text-2xs tracking-[0.2em] uppercase text-ink-400 block">
                The Legislation Effect
              </span>
              <span className="font-mono text-lg font-bold tracking-wider text-ink-900 block uppercase">
                How Laws Changed Your Life
              </span>
            </a>
            <div className="flex gap-2 flex-wrap">
              <a href="/" className="btn">
                Stories
              </a>
              <a href="/laws" className="btn">
                All Laws
              </a>
              <a href="/your-life" className="btn">
                Your Life
              </a>
              <a href="/about" className="btn">
                About
              </a>
            </div>
          </nav>
        </header>

        <main className="max-w-6xl mx-auto px-4 pb-16">{children}</main>

        <footer className="max-w-6xl mx-auto px-4 pb-12">
          <hr className="punch-divider mb-6" />
          <div className="text-center font-mono text-2xs text-ink-400 uppercase leading-loose">
            DO NOT FOLD, SPINDLE, OR MUTILATE
            <br />
            Data: FRED (St. Louis Fed) · Congress.gov · VoteView
            <br />
            Built with public data · Not affiliated with any government agency
          </div>
        </footer>
      </body>
    </html>
  );
}

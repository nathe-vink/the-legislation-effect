import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: "#F5F0E8",   // bg-primary — warm aged paper
          100: "#EDE8DC",  // bg-card — card surface
          200: "#E6E0D2",  // bg-card-alt — alternating rows
          300: "#D6CEBC",  // hole-punch — slightly lighter
        },
        tan: {
          400: "#C4B99A",  // border-primary — card edges
          500: "#8A7E66",  // border-dark — emphasis borders
        },
        ink: {
          900: "#1A1408",  // ink-stamp — darkest, rubber stamp
          800: "#2C2416",  // text-primary — near-black warm
          600: "#6B5D4A",  // text-secondary — muted brown
          400: "#9A8C74",  // text-muted — faded typewriter
        },
        party: {
          dem: "#3B5998",  // Democrat — muted steel blue
          rep: "#B44040",  // Republican — muted red
        },
        mark: "#D4A34A",   // Gold/amber — highlights, annotations
        semantic: {
          good: "#4A7C59",  // muted forest green — good for viewer
          bad: "#B44040",   // muted red — bad for viewer
        },
        notebook: {
          line: "#96AAC8",  // Blue notebook gridlines
        },
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', '"Courier New"', "monospace"],
        condensed: ['"IBM Plex Sans Condensed"', '"Arial Narrow"', "sans-serif"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "16px", letterSpacing: "0.08em" }],
        xs: ["11px", { lineHeight: "18px", letterSpacing: "0.06em" }],
        sm: ["12px", { lineHeight: "20px", letterSpacing: "0.04em" }],
        base: ["13px", { lineHeight: "22px", letterSpacing: "0.01em" }],
        md: ["14px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "26px" }],
        xl: ["22px", { lineHeight: "28px" }],
        "2xl": ["28px", { lineHeight: "34px" }],
      },
      boxShadow: {
        card: "2px 3px 0 #C4B99A, 4px 6px 0 #E6E0D2",
      },
      borderRadius: {
        card: "6px",
      },
    },
  },
  plugins: [],
};

export default config;

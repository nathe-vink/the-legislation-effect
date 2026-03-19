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
          400: "#7D7060",  // text-muted — faded typewriter (improved contrast)
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
        "2xs": ["11px", { lineHeight: "17px", letterSpacing: "0.06em" }],
        xs: ["12px", { lineHeight: "19px", letterSpacing: "0.04em" }],
        sm: ["13.5px", { lineHeight: "22px", letterSpacing: "0.03em" }],
        base: ["15px", { lineHeight: "24px", letterSpacing: "0.01em" }],
        md: ["16px", { lineHeight: "26px" }],
        lg: ["20px", { lineHeight: "28px" }],
        xl: ["24px", { lineHeight: "30px" }],
        "2xl": ["30px", { lineHeight: "38px" }],
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

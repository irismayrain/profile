import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // surface / text
        page: { DEFAULT: "#FBFAFD", soft: "#F4F1FA" },
        surface: { DEFAULT: "#FFFFFF", tint: "#FAF8FD" },
        line: { DEFAULT: "#ECE9F3", soft: "#F3F1F8" },
        ink: {
          DEFAULT: "#1A1A24",
          soft: "#52526A",
          mute: "#9595AB",
          faint: "#C2C2D2",
        },
        // primary accent — lavender scale
        lav: {
          50: "#F6F3FB",
          100: "#EBE4F6",
          200: "#D7C9EE",
          300: "#B9A6DF",
          400: "#9582C9",
          500: "#7361B0",
          600: "#574788",
        },
        // secondary accents
        blush: { 100: "#F8E8EF", 200: "#EDCDDB", 500: "#A06181" },
        mist: { 100: "#E1EEF3", 200: "#C2DCE6", 500: "#377789" },
        peach: { 100: "#FBEDE2", 500: "#A0683F" },
        // semantic
        good: "#6FB59A",
        // legacy aliases kept so admin/blog markup using old names still resolves
        paper: { DEFAULT: "#FBFAFD", warm: "#F4F1FA" },
        rose: { soft: "#F8E8EF", deep: "#A06181" },
        iris: { soft: "#EBE4F6", deep: "#7361B0" },
      },
      fontFamily: {
        sans: [
          "Manrope",
          "Noto Sans SC",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        serif: ["Instrument Serif", "Noto Serif SC", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        cn: ["Noto Sans SC", "Manrope", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        soft1: "0 1px 2px rgba(40,30,80,.04), 0 4px 14px rgba(80,60,140,.05)",
        soft2: "0 1px 2px rgba(40,30,80,.05), 0 18px 42px -18px rgba(80,60,140,.18)",
      },
      letterSpacing: {
        tightish: "-0.005em",
        tighter2: "-0.018em",
        tightest: "-0.03em",
      },
    },
  },
  plugins: [],
};

export default config;

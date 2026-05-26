import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--anna-green) / <alpha-value>)",
        "on-primary": "hsl(var(--on-primary) / <alpha-value>)",
        accent: "hsl(var(--accent-electric) / <alpha-value>)",
        bg: "hsl(var(--bg) / <alpha-value>)",
        "bg-alt": "hsl(var(--bg-alt) / <alpha-value>)",
        fg: "hsl(var(--fg) / <alpha-value>)",
        "fg-muted": "hsl(var(--fg-muted) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        leak: "hsl(var(--leak) / <alpha-value>)",
        gain: "hsl(var(--gain) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Calistoga", "Georgia", "serif"],
      },
      maxWidth: {
        prose: "65ch",
        page: "1280px",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

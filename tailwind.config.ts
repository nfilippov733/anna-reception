import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--anna-green) / <alpha-value>)",
        "on-primary": "hsl(var(--on-primary) / <alpha-value>)",
        bg: "hsl(var(--bg) / <alpha-value>)",
        "bg-alt": "hsl(var(--bg-alt) / <alpha-value>)",
        fg: "hsl(var(--fg) / <alpha-value>)",
        "fg-muted": "hsl(var(--fg-muted) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        leak: "hsl(var(--leak) / <alpha-value>)",
        gain: "hsl(var(--gain) / <alpha-value>)",
        // New Editorial ANNA Warm tokens
        ink: "hsl(var(--ink) / <alpha-value>)",
        cream: "hsl(var(--bg-alt) / <alpha-value>)", // alias
        "cream-deep": "hsl(var(--cream-deep) / <alpha-value>)",
        sage: "hsl(var(--sage) / <alpha-value>)",
        "sage-mute": "hsl(var(--sage-mute) / <alpha-value>)",
        "mono-label": "hsl(var(--mono-label) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Calistoga", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.875rem, 4vw, 3rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      maxWidth: {
        prose: "65ch",
        page: "1280px",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        reveal: "reveal 480ms ease-out both",
        bob: "bob 7s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        reveal: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-4px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

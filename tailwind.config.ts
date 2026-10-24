import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#D4AF37",
          goldLight: "#F5E29F",
          goldDark: "#9A7618",
          velvet: "#0B0E0D",
          surface: "#121715",
          card: "#18201D",
          cardHover: "#202B27",
        },
      },
      fontFamily: {
        cinzel: ["'Cinzel'", "var(--font-cinzel)", "Georgia", "serif"],
        "cinzel-dec": ["'Cinzel Decorative'", "'Cinzel'", "serif"],
        bodoni: ["'Bodoni Moda'", "var(--font-bodoni)", "Georgia", "serif"],
        italiana: ["'Italiana'", "'Bodoni Moda'", "serif"],
        cormorant: ["'Cormorant Garamond'", "Georgia", "serif"],
        serif: ["'Bodoni Moda'", "'Cinzel'", "'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Outfit'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 4px 20px -2px rgba(212, 175, 55, 0.25)",
        "gold-lg": "0 10px 30px -4px rgba(212, 175, 55, 0.35)",
        luxury: "0 20px 40px -15px rgba(0, 0, 0, 0.8)",
      },
      animation: {
        "shimmer-slow": "shimmer 4s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

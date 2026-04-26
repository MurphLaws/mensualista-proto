import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F1EEFF",
          100: "#E4DEFF",
          200: "#CABFFF",
          300: "#A998FF",
          400: "#876FFF",
          500: "#6D5BFF",
          600: "#5B47F5",
          700: "#4A36D6",
          800: "#3A29A8",
          900: "#251A7A",
        },
        ink: {
          900: "#0E1020",
          700: "#2B2D45",
          500: "#5C5F7A",
          400: "#8A8DA6",
          300: "#B7BACF",
          200: "#E1E2EC",
          100: "#F1F2F8",
          50: "#F8F9FC",
        },
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(14,16,32,0.04), 0 8px 24px rgba(14,16,32,0.06)",
        ring: "0 0 0 4px rgba(109,91,255,0.18)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

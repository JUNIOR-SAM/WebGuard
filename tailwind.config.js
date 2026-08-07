/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "surface-container-lowest": "#0a0e1a",
        "surface-container": "#1b1f2c",
        "surface-container-high": "#262a37",
        "surface-container-highest": "#313442",
        "surface-variant": "#313442",
        "outline-variant": "#3c4a3c",
        "on-surface": "#dfe2f3",
        "on-surface-variant": "#bbcbb8",
        "inverse-surface": "#dfe2f3",
        "primary": "#3fe56c",
        "primary-container": "#00c853",
        "on-primary-container": "#004c1b",
        "error": "#ffb4ab",
        "surface": "#0f131f",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Geist", "sans-serif"],
      },
    },
  },
  plugins: [],
};
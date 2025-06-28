// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in-scale": "fadeInScale 0.3s ease-out",
      },
      keyframes: {
        fadeInScale: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      fontFamily: {
        // arab: ["Indoensia", "serif"],
        indonesia: ["Indonesia", "serif"],
      },
    },
  },
  plugins: [],
};

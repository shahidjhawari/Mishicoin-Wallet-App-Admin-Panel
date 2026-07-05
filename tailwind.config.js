/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Mishicoin brand palette: deep navy ledger + minted-gold coin accent
        ink: "#0B1220",
        panel: "#111B2E",
        line: "#22304A",
        coin: "#D4AF37",
        coinSoft: "#F2D98A",
        mint: "#3ECF8E",
        danger: "#E5533D",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

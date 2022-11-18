/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        breave: {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(.1)" },
        },
      },
      animation: {
        breave: "breave 300ms ease-in-out infinite",
      },
      fontFamily: {
        space: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animation-delay")],
};

/** @type {import('tailwindcss').Config} */
const { COLORS, FONTS } = require("./src/constants/theme");

module.exports = {
  // Include every file that can declare NativeWind className strings.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: COLORS,
      fontFamily: {
        regular: [FONTS.regular],
        medium: [FONTS.medium],
        semibold: [FONTS.semibold],
        bold: [FONTS.bold],
      },
    },
  },
  plugins: [],
};

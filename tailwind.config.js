/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include every file that can declare NativeWind className strings.
  content: ["./App.{js,jsx,ts,tsx}", "./index.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar"), require("tailwind-scrollbar-hide")],
  safelist: [
    {
      // this regex will match any hex color in the form `scrollbar-thumb-[#a1b2c3]`
      pattern: /scrollbar-thumb-\[#(?:[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\]/,
    },
  ],
});

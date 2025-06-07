/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {

        // primary: "#f66e47",
        // "primary-hover": "#fde2da",
        // "primary-text": "#f66e47",

        // primary: "#FEDC57",
        primary: "#e4c64e",
        "primary-hover": "#fde2da",
        "primary-text": "#f66e47",

        secondary: "#201e33",
        "secondary-hover": "#413d67",

        neutral: "#000000",
        background: "#ffffff",

        "card-bg": "#fafcff",

        // #ecd01e   yellow
        // #413d67   purple
        // #f66e47   orange
      },
    },
  },
  plugins: [],
};

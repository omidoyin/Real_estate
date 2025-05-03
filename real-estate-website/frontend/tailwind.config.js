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
        "primary-blue": "#007BFF",
        "light-blue": "#E6F0FF",
        "accent-green": "#28A745",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};

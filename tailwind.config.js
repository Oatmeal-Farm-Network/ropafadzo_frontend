/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ofn-red': '#A3301E',
        'ofn-green': '#819360',
        'ofn-dark-green': '#4d734d',
        'ofn-gold': '#e5af17',
      }
    },
  },
  plugins: [],
}
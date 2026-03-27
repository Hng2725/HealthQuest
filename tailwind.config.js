/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#fffdf0', // Very light yellowish cream
        surface: '#ffffff', // White cards
        primary: '#fbbf24', // Amber/Pastel Yellow 400
        primaryHover: '#f59e0b', // Amber 500
        accent: '#f472b6', // Pink 400 for cute accent details
        success: '#34d399', // Emerald 400
        danger: '#fb7185', // Rose 400
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

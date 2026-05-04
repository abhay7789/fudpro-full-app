/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'premium-orange': '#FF7D29',
        primary: {
          light: '#FF7D29',
          DEFAULT: '#FF7D29',
          dark: '#E66A1F',
        },
        background: {
          light: '#FFFFFF',
          dark: '#121212',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

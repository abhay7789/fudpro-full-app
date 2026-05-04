/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-mantine-color-scheme="dark"]'],
  theme: {
    extend: {
      colors: {
        'premium-orange': '#FC8019',
        primary: {
          light: '#FF9E68',
          DEFAULT: '#FC8019',
          dark: '#E45100',
        },
        background: {
          light: '#FAFAFA',
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

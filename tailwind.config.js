/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#e5c07b',
          DEFAULT: '#cb9834', // Momentz Gold
          dark: '#aa7c11',
          hover: '#b5852a',
        },
        dark: {
          DEFAULT: '#0F1115', // Rich Executive Charcoal
          surface: '#151821',
          card: '#1A1E29',
          border: '#262C3A',
        },
        gold: {
          50: '#FCF9EE',
          100: '#F7F1D5',
          200: '#EEDDA9',
          300: '#E4C778',
          400: '#DAB34D',
          500: '#CB9834',
          600: '#AA7C11',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

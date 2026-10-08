/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9b8',
          400: '#ec7a94',
          500: '#df4f72',
          600: '#cd2f57',
          700: '#ac1d44',
          800: '#8f1c3c',
          900: '#7a1d39',
          950: '#44081b',
        },
      },
    },
  },
  plugins: [],
}
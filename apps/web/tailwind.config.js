/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta premium de vinos
        wine: {
          50: '#fdf6f7',
          100: '#f9e9ec',
          200: '#f3d4db',
          300: '#e8b0be',
          400: '#d9859a',
          500: '#c55d7a',
          600: '#a83e5f',
          700: '#8b2c4a', // Color principal (burgundy)
          800: '#6d2239',
          900: '#4a1526',
          950: '#2a0a15',
        },
        // Dorado/bronce para acentos de lujo
        gold: {
          50: '#fdfbf5',
          100: '#f9f3e0',
          200: '#f2e4b8',
          300: '#e8cf85',
          400: '#ddb556',
          500: '#d49a33',
          600: '#c27d24',
          700: '#a15f1f',
          800: '#824a20',
          900: '#6a3d1d',
        },
        // Fondos crema/beige (reemplaza blanco puro)
        cream: {
          50: '#fdfcf9',
          100: '#faf6ee',
          200: '#f3ead6',
          300: '#e9d9b5',
        },
      },
      fontFamily: {
        // Tipografía serif premium para títulos
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        // Sans-serif elegante para cuerpo
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 60px -15px rgba(139, 44, 74, 0.15)',
        'premium-hover': '0 30px 80px -20px rgba(139, 44, 74, 0.25)',
      },
    },
  },
  plugins: [],
};
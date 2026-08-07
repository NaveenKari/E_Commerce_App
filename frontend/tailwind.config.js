/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff0f3',
          100: '#ffe0e6',
          200: '#ffc2d1',
          300: '#ff94ac',
          400: '#ff5c82',
          500: '#ff4d6d',
          600: '#f22a52',
          700: '#cc1940',
          800: '#a8173a',
          900: '#8c1836',
          950: '#4d0819',
        },
        accent: {
          50: '#f4f0ff',
          100: '#ebe3ff',
          200: '#d9caff',
          300: '#bda1ff',
          400: '#9d6dff',
          500: '#7c3aed',
          600: '#6d24dd',
          700: '#5c19bb',
          800: '#4c1798',
          900: '#40167c',
          950: '#270a52',
        },
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#0e0e10',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

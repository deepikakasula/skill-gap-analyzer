/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7fa',
          100: '#e4e8f0',
          200: '#c8d1e2',
          300: '#9fb1cd',
          400: '#708bb3',
          500: '#4e6d99',
          600: '#3c547b',
          700: '#314464',
          800: '#2c3b55',
          900: '#283348',
          950: '#1a2130',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

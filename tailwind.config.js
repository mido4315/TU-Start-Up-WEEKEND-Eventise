/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6f8f1',
          100: '#e8eed9',
          200: '#d2ddb5',
          300: '#b6c988',
          400: '#95ae58',
          500: '#73893c',
          600: '#5d6f31',
          700: '#485627',
          800: '#39441f',
          900: '#2f381b',
        },
      },
      boxShadow: {
        panel: '0 20px 60px rgba(33, 44, 24, 0.12)',
      },
    },
  },
  plugins: [],
}

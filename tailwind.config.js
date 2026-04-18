/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Orange accent — matches the logo's orange figure (#D4753A family)
        brand: {
          50:  '#fff8ef',
          100: '#ffecd4',
          200: '#ffd4a5',
          300: '#ffb46d',
          400: '#f98a39',
          500: '#f0691e',
          600: '#d45319',
          700: '#b03f14',
          800: '#8d3211',
          900: '#722a0e',
        },
        // Forest-green neutrals — replaces slate with logo's dark green palette
        slate: {
          50:  '#f3f7f2',
          100: '#e3ece0',
          200: '#c7d9c2',
          300: '#a0bc99',
          400: '#729a6a',
          500: '#527a4a',
          600: '#3f613a',
          700: '#324d2e',
          800: '#273d24',
          900: '#1d2f1b',
          950: '#111c0f',
        },
      },
      boxShadow: {
        panel: '0 20px 60px rgba(17, 28, 15, 0.14)',
      },
    },
  },
  plugins: [],
}

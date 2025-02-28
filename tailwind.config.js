/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ecfdf5',
          600: '#059669',
          700: '#047857',
        },
        amber: {
          50: '#fffbeb',
          600: '#d97706',
          700: '#b45309',
        },
        rose: {
          50: '#fff1f2',
          600: '#e11d48',
          700: '#be123c',
        },
        cyan: {
          50: '#ecfeff',
          600: '#0891b2',
          700: '#0e7490',
        },
        violet: {
          50: '#f5f3ff',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        orange: {
          50: '#fff7ed',
          600: '#ea580c',
          700: '#c2410c',
        }
      }
    },
  },
  plugins: [],
}
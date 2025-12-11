/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './App.tsx',
    './components/**/*.tsx',
    './index.tsx'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#ec4899',
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b',
        'test-color': '#123456',
        dark: {
          DEFAULT: '#0F172A',
          muted: 'rgb(148 163 184)',
          border: '#334155',
          text: 'rgb(248 250 252)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
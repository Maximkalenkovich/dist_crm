/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1220',
        panel: '#121a2b',
        line: '#243149',
        accent: '#2fc6f6',
        accent2: '#7bdcb5',
        warn: '#f5a623',
        danger: '#ff6b6b',
      },
      fontFamily: {
        display: ['"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px rgba(0,0,0,.35)',
      },
    },
  },
  plugins: [],
}

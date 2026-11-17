/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'ui-rounded', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          50: '#fff4ed', 100: '#ffe6d4', 200: '#ffc8a8', 300: '#ffa271',
          400: '#ff7a3d', 500: '#fb5b14', 600: '#ec420a', 700: '#c4300b',
          800: '#9b2811', 900: '#7d2512',
        },
        ink: {
          50: '#f7f7fb', 100: '#eeeef6', 200: '#dcdce9', 300: '#b9b9cf',
          400: '#8d8dab', 500: '#6b6b8a', 600: '#51516e', 700: '#3a3a52',
          800: '#25253a', 900: '#17172a', 950: '#0e0e1c',
        },
      },
      keyframes: {
        flicker: {
          '0%,100%': { transform: 'scale(1) rotate(-2deg)' },
          '50%': { transform: 'scale(1.08) rotate(2deg)' },
        },
        pop: {
          '0%': { transform: 'scale(.8)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        flicker: 'flicker 1.6s ease-in-out infinite',
        pop: 'pop .25s ease-out',
      },
    },
  },
  plugins: [],
}

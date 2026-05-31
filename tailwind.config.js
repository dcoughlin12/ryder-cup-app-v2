/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#FDF8E7',
          100: '#FAF0C2',
          200: '#F5DE85',
          300: '#EFC848',
          400: '#E8B820',
          DEFAULT: '#C8971A',
          600: '#A67B14',
          700: '#7D5C0F',
          800: '#533D0A',
          900: '#2A1F05',
        },
        east: {
          light: '#F87171',
          DEFAULT: '#DC2626',
          dark: '#991B1B',
        },
        west: {
          light: '#60A5FA',
          DEFAULT: '#1D4ED8',
          dark: '#1E3A8A',
        },
        navy: {
          50:  '#E8EBF5',
          100: '#C5CCDF',
          200: '#8FA0C4',
          300: '#5974A9',
          400: '#2B4D8E',
          DEFAULT: '#0B1560',
          600: '#091145',
          700: '#060D30',
          800: '#04091F',
          900: '#02040F',
        },
      },
      fontFamily: {
        serif: ['Georgia', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C8971A 0%, #E8B820 50%, #C8971A 100%)',
        'navy-gradient': 'linear-gradient(180deg, #0B1560 0%, #060D30 100%)',
      },
    },
  },
  plugins: [],
}

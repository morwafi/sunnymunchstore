/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray1: '#e8e8e8',
        gray2: '#d0d0d0',
        gray3: '#b9b9b9',
        gray4: '#a2a2a2',
        gray5: '#8c8c8c',
      },
    },
  },
  plugins: [
      function ({ addUtilities }) {
    const newUtilities = {
      '.card-icon': {
        'background-image': 'url(/assets/card.svg)', // your SVG path
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-size': 'contain',
      },
    }
    addUtilities(newUtilities, ['responsive'])
  }
  ]
}

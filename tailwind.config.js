/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      backgroundImage: {
        bg: "url('./src/img/bg.svg')",
        'app-bg': 'linear-gradient(60deg, #00AB63 0%, #008B57 100%)'
      }
    }
  },
  plugins: []
}

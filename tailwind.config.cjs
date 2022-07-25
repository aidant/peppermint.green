const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/index.html', './src/**/*.svelte'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', ...defaultTheme.fontFamily.serif],
        body: ['Raleway', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  future: {
    purgeLayersByDefault: true
  },
  theme: {
    extend: {
      colors: {
        primary: '#6fa786'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  future: {
    purgeLayersByDefault: true
  },
  theme: {
    fontFamily: {
      sans: ['Plex-Sans'], // Tech Info: username,password,email, #likes
      serif: ['Plex-Serif'] // Content: post,text,title
    },
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
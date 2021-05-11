/* eslint-disable */

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
        primary: '#6fa786',
        secondary: '#71C9AE'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
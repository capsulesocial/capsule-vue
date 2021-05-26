/* eslint-disable */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  future: {
    purgeLayersByDefault: true
  },
  theme: {
    fontFamily: {
      sans: ['NotoSans-Medium'],
    },
    extend: {
      colors: {
        primary: '#1E566C', // Dark Teal
        secondary: '#367589', // Moss Teal
        teal: '#216B6A', //Teal
        ocean: '#89B8CA', // Ocean Blue
        fourth: '#1C478B', // Dark Blue
        fifth: '#1F7DAD', // Light Blue
        gray1: '#EEEEEE',
        gray2: '#DDDDDD',
        gray3: '#BBBBBB',
        gray4: '#888888',
        gray5: '#777777',
        gray6: '#454545',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
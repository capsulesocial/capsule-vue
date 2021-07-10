/* eslint-disable */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  future: {
    purgeLayersByDefault: true
  },
  theme: {
    fontFamily: {
      sans: ['NotoSans-Medium'],
      bold: ['NotoSans-Bold']
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
        subtitle: '#868686',
        lightBG: '#FFFFFF',
        lightPrimaryText: '#000000',
        lightSecondaryText: '#454545',
        lightBorder: '#777777',
        lightDialog: 'EEEEEE',
        lightButtonBG: '#1E566C',
        lightButtonText: '#FFFFFF',
        lightActive: '#1E566C',
        lightAuthorCard: '#E5E7EB',
        darkBG: '#000000',
        darkPrimaryText: '#FFFFFF',
        darkSecondaryText: '#EEEEEE',
        darkBorder: '#EEEEEE',
        darkDialog: '#454545',
        darkButtonBG: '#1F7DAD',
        darkButtonText: '#FFFFFF',
        darkActive: '#367589',
        darkAuthorCard: '#777777',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
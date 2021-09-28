/* eslint-disable */
// @ts-ignore
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  future: {
    purgeLayersByDefault: true
  },
  theme: {
    fontFamily: {
      sans: ['Noto', 'sans-serif'],
      serif: ['NotoSerif', 'serif'],
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#000'
          },
        },
      },
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
        gray7: '#686868',
        lightAuthorCard: '#E5E7EB',
        darkAuthorCard: '#777777',
        selectedBlue: '#0020ff',
        neutralLightest: '#F6F6F6',

        positive: `#1F7DAD`,
        neutral: `#F0B785`,
        negative: `#EE1F63`,

        lightBG: '#FFFFFF',
        lightPrimary: '#407C83',
        lightPrimaryVariant: '#2F5C61',
        lightSecondary: '#E8E8E8',
        lightSurface: '#FFFFFF',
        lightSurfaceVariant: '#95B0B4',
        lightPrimaryText: '#000000',
        lightSecondaryText: '#454545',
        lightOnPrimaryText: '#FFFFFF',
        lightOnSecondaryText: '#000000',
        lightOnSurfaceText: '#000000',
        lightOnSurfaceVariantText: '#000000',
        lightBorder: '#777777',
        lightDialog: '#EEEEEE',
        lightButtonBG: '#1E566C',
        lightButtonText: '#FFFFFF',
        lightActive: '#1E566C',
        lightError: '#B00020',
        lightOnErrorText: '#FFFFFF',

        darkBG: '#121212',
        darkPrimary: '#407C83',
        darkPrimaryVariant: '#324B4E',
        darkSecondary: '#424242',
        darkSurface: '#212121',
        darkSurfaceVariant: '#2D4346',
        darkPrimaryText: '#FFFFFF',
        darkSecondaryText: '#EEEEEE',
        darkOnPrimaryText: '#FFFFFF',
        darkOnSecondaryText: '#C2C2C2',
        darkOnSurfaceText: '#C2C2C2',
        darkOnSurfaceVariantText: '#C2C2C2',
        darkBorder: '#EEEEEE',
        darkDialog: '#454545',
        darkButtonBG: '#1F7DAD',
        darkButtonText: '#FFFFFF',
        darkActive: '#367589',
        darkError: '#B00020',
        darkOnErrorText: '#FFFFFF',
      },
    }
  },
  plugins: [
			// @ts-ignore
      require('@tailwindcss/typography')
  ]
}
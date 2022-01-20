/* eslint-disable */
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
      fontSize: {
        h1: [`2.25rem`, `1.1111`],
        h2: [`1.5rem`, `1.5em`],
        h3: [`1.25rem`, `1.6`],
        h4: [`1rem`, `1.5`],
        h5: [`0.83rem`, `1.25rem`],
        h6: [`0.67rem`, `1rem`],
        p: [`1rem`, `1.5rem`],
        '4xl': '2.6rem',
      },
      colors: {
        primary: '#2E556A', // Dark Teal
        secondary: '#7097AC', // Moss Teal
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
        connectGreen: '#72D591',
        connectOrange: '#F0B785',
        selectedBlue: '#0020ff',
        neutralLightest: '#F6F6F6',

        positive: `#1F7DAD`,
        neutral: `#F0B785`,
        negative: `#EE1F63`,
        lightBG: '#FFFFFF',
        lightBGStop: 'rgba(256, 256, 256, 0.95)',
        lightBGStart: 'rgba(256, 256, 256, 0.90)',
        lightBorder: 'rgba(46, 85, 106, 0.05)',
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
        lightDialog: '#EEEEEE',
        lightInput: 'rgba(46, 85, 106, 0.05)',
        lightButtonBG: '#2E556A',
        lightButtonText: '#FFFFFF',
        lightActive: '#2E556A',
        lightError: '#EE1F63',
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
      boxShadow: {
        lg: '1px 2px 20px rgba(0, 0, 0, 0.07)',
      },
      width: {
        589: `589px`,
        748: `748px`,
        750: `750px`,
        1220: `1220px`,
        760: `760px`,
      },
      minWidth: {
        760: `760px`,
        1220: `1220px`
      },
      maxWidth: {
        420: `420px`,
        700: `700px`,
        760: `760px`,
        mobileCard: `calc(100vw - 50px)`
      },
      height: {
        61: `calc(100vh - 61px)`,
        80: `calc(100vh - 80px)`,
        120: `calc(100vh - 120px)`,
        130: `calc(100vh - 130px)`,
        150: `calc(100vh - 150px)`,
        160: `calc(100vh - 160px)`,
        180: `calc(100vh - 180px)`,
        200: `calc(100vh - 200px)`,
        220: `calc(100vh - 220px)`,
        230: `calc(100vh - 230px)`,
        240: `calc(100vh - 240px)`,
        fit: `fit-content`
      },
      minHeight: {
        61: `calc(100vh - 61px)`,
        80: `calc(100vh - 80px)`,
        120: `calc(100vh - 120px)`,
        130: `calc(100vh - 130px)`,
        150: `calc(100vh - 150px)`,
        160: `calc(100vh - 160px)`,
        180: `calc(100vh - 180px)`,
        200: `calc(100vh - 200px)`,
        220: `calc(100vh - 220px)`,
        230: `calc(100vh - 230px)`,
        240: `calc(100vh - 240px)`,
      },
      maxHeight: {
        90: `90vh`,
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
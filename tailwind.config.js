const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      red: colors.red,
      yellow: colors.amber,
      green: colors.emerald,
      blue: colors.blue,
      indigo: colors.indigo,
      purple: colors.violet,
      pink: colors.pink,

      'laze-primary': '#EBA059',
      'laze-secondary': '#F2BD8B',

      whitesmoke: '#f5f5f5',

      primary: {
        100: '#6EA7C1',
        200: '#599AB8',
        300: '#448DAF',
        400: '#3081A6',
        default: '#1b749d',
        600: '#19698F',
        700: '#165F80',
        800: '#145472',
        900: '#114A64',
      },

      background: '#262526',
      editor: '#1e1e1e',
    },
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    fontFamily: {
      editor: ['Consolas', 'Droid Sans Mono', 'Courier New', 'ui-monospace', 'Droid Sans Fallback'],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

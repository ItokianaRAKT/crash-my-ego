export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'win95-desktop': '#008080',
        'win95-title-start': '#000080',
        'win95-title-end': '#1084d0',
        'win95-error-start': '#800000',
        'win95-error-end': '#ff4d4d',
        'win95-face': '#c0c0c0',
        'win95-light': '#ffffff',
        'win95-shadow': '#808080',
        'win95-dark': '#000000',
        'win95-nav': '#000080',
      },
      fontFamily: {
        system: [
          'Tahoma',
          'MS Sans Serif',
          'Segoe UI',
          'Geneva',
          'Verdana',
          'sans-serif',
        ],
        mono: [
          '"MS Gothic"',
          '"Courier New"',
          'monospace',
        ],
      },
      boxShadow: {
        'win95-raised':
          'inset -2px -2px 0px 0px #808080, inset 2px 2px 0px 0px #ffffff, inset -3px -3px 0px 0px #000000, inset 3px 3px 0px 0px #dfdfdf',
        'win95-sunken':
          'inset 2px 2px 0px 0px #808080, inset -2px -2px 0px 0px #ffffff, inset 3px 3px 0px 0px #000000, inset -3px -3px 0px 0px #dfdfdf',
        'win95-sunken-thin':
          'inset 1px 1px 0px 0px #808080, inset -1px -1px 0px 0px #ffffff',
        'win95-raised-thin':
          'inset -1px -1px 0px 0px #808080, inset 1px 1px 0px 0px #ffffff',
      },
    },
  },
  plugins: [],
};

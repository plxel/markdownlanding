export default {
  breakpoints: [32, 48, 64],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fontSizes: [12, 14, 16, 20, 24, 36, 48, 80, 96],
  fontWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  lineHeights: {
    solid: 1,
    title: 1.25,
    copy: 1.5,
  },
  letterSpacings: {
    normal: 'normal',
    tracked: '0.1em',
    tight: '-0.05em',
    mega: '0.25em',
  },
  borders: [
    0,
    '1px solid',
    '2px solid',
    '4px solid',
    '8px solid',
    '16px solid',
    '32px solid',
  ],
  radii: [0, 2, 4, 16, 9999, '100%'],
  width: [16, 32, 64, 128, 256],
  heights: [16, 32, 64, 128, 256],
  maxWidths: [16, 32, 64, 128, 256, 512, 768, 1024, 1536],
  colors: {
    primary: 'red',
    black: '#000',
    white: '#fff',
    grays: ['#f5f5f5', '#c0c0c0', '#888', '#505050', '#404040'],
  },
  buttons: {
    primary: {
      backgroundColor: 'red',
      borderColor: 'red',
    },
    secondary: {
      backgroundColor: 'green',
      borderColor: 'green',
    },
    text: {
      backgroundColor: 'transparent',
      color: 'red',
      borderColor: 'transparent',
    },
  },
};

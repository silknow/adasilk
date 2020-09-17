import { css } from 'styled-components';
import breakpoints from '@styles/breakpoints';

const theme = {
  fontFamily: {
    sansSerif:
      'Lato, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    mono:
      'Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace',
  },
  colors: {
    text: '#333',
    background: '#f7f7ef',
    primary: '#f38468',
    secondary: '#144168',
    linkHover: '#a02a0c',
    light: '#f5b1a1',
  },
  home: {
    textSearchButton: {
      background: '#f38468',
      text: '#fff',
    },
    imageSearchButton: {
      background: '#9ca4d3',
      text: '#fff',
    },
  },
  header: {
    height: '80px',
    borderBottomWidth: '1px',
  },
  footer: {
    minHeight: '150px',
  },
  pages: {
    HomePage: {
      Title: css`
        background: rgba(255, 255, 255, 0.5);
        max-width: 480px;
        line-height: 1.25;
        padding: 1rem;
        text-align: center;
        font-weight: 400;

        ${breakpoints.tablet`
          text-align: center;
        `}
      `
    }
  },
  components: {}
};

export default theme;

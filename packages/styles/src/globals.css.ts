import { globalStyle } from '@vanilla-extract/css';

import { vars } from './tokens.css';

globalStyle('html', {
  margin: 0,
  padding: 0,
  fontFamily: vars.font.family,
});

globalStyle('body', {
  margin: 0,
  padding: 0,
  fontFamily: vars.font.family,
  fontSize: '1rem', // ← f16R
  lineHeight: '1.5rem', // ← f16R
  fontWeight: vars.font.weight.regular, // ← f16R
  letterSpacing: '0.05em',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});

globalStyle('a', {
  textDecoration: 'none',
  color: 'inherit',
});

globalStyle('*', {
  boxSizing: 'border-box',
});

globalStyle('main', {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

import { style } from '@vanilla-extract/css';

export const wrapper = style({
  width: '100%',
  flex: 1,
  backgroundColor: '#ffffff',
});

export const inner = style({
  maxWidth: '1176px',
  width: '100%',
  margin: '0 auto',

  //   padding: '0 16px',
});

import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const LoginInnerWrapper = style({
  width: '375px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const TitleContentsWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const TitleContents = style([
  typography.f32EB,
  {
    marginTop: '20px',
  },
]);

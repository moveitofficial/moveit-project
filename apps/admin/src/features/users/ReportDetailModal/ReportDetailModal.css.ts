import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const modal = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  padding: '32px',
  width: '100%',
  boxSizing: 'border-box',
});

export const top = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const reportIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  backgroundColor: vars.color.red200,
  color: vars.color.white,
  flexShrink: 0,
});

export const title = style({
  margin: 0,
});

export const divider = style({
  width: 'calc(100% + 64px)',
  marginLeft: '-32px',
  marginRight: '-32px',
  height: '1px',
  backgroundColor: vars.color.line200,
  flexShrink: 0,
});

export const evidenceSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
});


export const carousel = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
});

export const imageFrame = style({
  position: 'relative',
  width: '400px',
  maxWidth: '100%',
  height: '280px',
  overflow: 'hidden',
});

export const carouselImage = style({
  objectFit: 'cover',
});

export const navButton = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  border: 'none',
  padding: 0,
  background: 'none',
  color: vars.color.black400,
  cursor: 'pointer',
  ':disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
});

export const navButtonPrev = style({
  left: 0,
});

export const navButtonNext = style({
  right: 0,
});

export const pageIndicator = style({
  alignSelf: 'center',
  color: vars.color.black400,
});

export const detailSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
});

export const detailHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const reasonLabel = style({
  color: vars.color.gray400,
});

export const detailText = style({
  margin: 0,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
});

export const actions = style({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
});

export const confirmButton = style([
  typography.f16EB,
  {
    width: '318px',
    maxWidth: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
]);

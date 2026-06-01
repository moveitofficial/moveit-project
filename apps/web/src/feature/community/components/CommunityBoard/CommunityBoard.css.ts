import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
  padding: '48px 0 80px',
  boxSizing: 'border-box',
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  gap: '24px',
});

export const titleGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const loungeLabel = style([
  typography.f14EB,
  {
    color: vars.color.blue300,
  },
]);

export const pageTitle = style([
  typography.f32EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const description = style([
  typography.f14B,
  {
    color: vars.color.gray400,
  },
]);

export const writeButton = style([
  typography.f14B,
  {
    height: '40px',
    padding: '0 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
    flexShrink: 0,
  },
]);

export const filters = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
});

export const filterChipButton = style({
  display: 'inline-flex',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
});

export const filterChip = style([
  typography.f16R,
  {
    color: vars.color.black500,
  },
]);

export const filterChipActive = style({
  color: vars.color.white,
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const pagination = style({
  marginTop: '8px',
  alignSelf: 'center',
});

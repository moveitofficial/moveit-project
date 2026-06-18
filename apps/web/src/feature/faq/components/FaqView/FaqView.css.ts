import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '48px 0 120px',
});

export const label = style([
  typography.f14B,
  {
    color: vars.color.blue300,
  },
]);

export const title = style([
  typography.f24B,
  {
    margin: '8px 0 0',
    color: vars.color.black500,
  },
]);

export const subtitle = style([
  typography.f14R,
  {
    margin: '8px 0 0',
    color: vars.color.gray400,
  },
]);

export const searchBox = style({
  position: 'relative',
  width: '763px',
  maxWidth: '100%',
  marginTop: '24px',
});

export const searchInput = style([
  typography.f14R,
  {
    width: '100%',
    padding: '14px 44px 14px 16px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '8px',
    color: vars.color.black500,
    backgroundColor: vars.color.white,
    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
    },
  },
]);

export const searchIcon = style({
  position: 'absolute',
  top: '50%',
  right: '16px',
  transform: 'translateY(-50%)',
  color: vars.color.black300,
  pointerEvents: 'none',
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '40px',
});

export const item = style({
  borderBottom: `1px solid ${vars.color.line200}`,
});

export const question = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  width: '100%',
  padding: '20px 4px',
  border: 'none',
  background: 'none',
  textAlign: 'left',
  cursor: 'pointer',
});

export const questionText = style([
  typography.f16B,
  {
    color: vars.color.black500,
  },
]);

export const chevron = style({
  flexShrink: 0,
  color: vars.color.black300,
  transition: 'transform 0.2s ease',
});

export const chevronOpen = style({
  transform: 'rotate(180deg)',
});

export const answer = style([
  typography.f14R,
  {
    margin: 0,
    padding: '0 4px 24px',
    color: vars.color.gray400,
    lineHeight: '24px',
    whiteSpace: 'pre-wrap',
  },
]);

export const empty = style([
  typography.f14R,
  {
    padding: '40px 4px',
    color: vars.color.gray400,
    textAlign: 'center',
  },
]);

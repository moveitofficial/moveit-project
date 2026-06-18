import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
});

export const heading = style([
  typography.f18EB,
  { color: vars.color.black500 },
]);

export const addButton = style([
  typography.f16B,
  {
    height: '40px',
    padding: '0 16px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '8px',
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
]);

export const emptyBox = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '32px',
  width: '100%',
  height: '448px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
});

export const emptyDesc = style([
  typography.f16B,
  {
    color: vars.color.gray400,
    textAlign: 'center',
  },
]);

export const emptyButton = style([
  typography.f16EB,
  {
    width: '375px',
    height: '52px',
    padding: '14px',
    backgroundColor: vars.color.black500,
    border: 'none',
    borderRadius: '12px',
    color: vars.color.white,
    cursor: 'pointer',
  },
]);

export const list = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '24px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  width: '201px',
  cursor: 'pointer',
});

export const cardThumb = style({
  position: 'relative',
  width: '201px',
  height: '201px',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: vars.color.gray200,
});

export const cardTitle = style([
  typography.f14EB,
  {
    marginTop: '18px',
    color: vars.color.black500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
]);

export const cardActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  marginTop: '12px',
});

export const actionButton = style([
  typography.f12R,
  {
    padding: 0,
    background: 'none',
    border: 'none',
    color: vars.color.gray400,
    cursor: 'pointer',
    selectors: {
      '&:hover': {
        color: vars.color.blue300,
        fontWeight: vars.font.weight.extraBold,
      },
    },
  },
]);

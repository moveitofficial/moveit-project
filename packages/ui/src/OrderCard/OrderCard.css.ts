import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const card = style({
  display: 'flex',
  alignItems: 'stretch',
  height: '80px',
  gap: '12px',
  backgroundColor: vars.color.white,
});

export const cardLeft = style({
  display: 'flex',
  alignItems: 'stretch',
  flex: 1,
  minWidth: 0,
  gap: '12px',
  border: 'none',
  background: 'none',
  padding: 0,
  textAlign: 'left',
});

export const cardLeftClickable = style({
  cursor: 'pointer',
});

export const thumbnailWrapper = style({
  flexShrink: 0,
  width: '100px',
  height: '80px',
  borderRadius: '8px',
  overflow: 'hidden',
});

export const thumbnail = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

export const thumbnailPlaceholder = style({
  width: '100%',
  height: '100%',
  backgroundColor: vars.color.gray100,
});

export const content = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  minWidth: 0,
});

export const metaRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
});

export const metaText = style({
  color: vars.color.gray400,
});

export const buyerText = style({
  color: vars.color.blue300,
});

export const title = style({
  color: vars.color.black300,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const date = style({
  color: vars.color.gray400,
});

export const right = style({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '8px',
});

export const amount = style({
  color: vars.color.black500,
});

export const actions = style({
  display: 'flex',
  gap: '12px',
});

const buttonBase = style({
  padding: '8px 14px',
  borderRadius: '8px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
});

export const whiteButton = style([
  buttonBase,
  {
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black300,
  },
]);

export const blueButton = style([
  buttonBase,
  {
    border: 'none',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
  },
]);

export const redButton = style([
  buttonBase,
  {
    border: 'none',
    backgroundColor: vars.color.red200,
    color: vars.color.white,
  },
]);

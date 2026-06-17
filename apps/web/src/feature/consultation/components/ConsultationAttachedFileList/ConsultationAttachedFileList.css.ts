import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const imageList = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '8px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const imageItem = style({
  position: 'relative',
  width: '80px',
  height: '80px',
  flexShrink: 0,
});

export const imagePreview = style({
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  objectFit: 'cover',
  border: `1px solid ${vars.color.line200}`,
  boxSizing: 'border-box',
});

export const imageRemoveButton = style({
  position: 'absolute',
  top: '4px',
  right: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '20px',
  height: '20px',
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  backgroundColor: vars.color.black500,
  color: vars.color.white,
  cursor: 'pointer',
  opacity: 0.8,
});

export const documentList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const documentItem = style([
  typography.f14R,
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    margin: 0,
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: vars.color.background100,
    color: vars.color.black500,
  },
]);

export const documentRemoveButton = style({
  padding: 0,
  border: 'none',
  background: 'none',
  color: vars.color.gray400,
  cursor: 'pointer',
  flexShrink: 0,
});

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

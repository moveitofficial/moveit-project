import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const heroRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '240px',
});

export const profileGroup = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '20px',
  flex: 1,
  minWidth: 0,
});

export const avatar = style([
  typography.f20B,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: vars.color.blue400,
    color: vars.color.white,
    flexShrink: 0,
    overflow: 'hidden',
  },
]);

export const avatarImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const profileContent = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
});

export const titleRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  width: '100%',
});

export const companyName = style([
  typography.f32EB,
  {
    margin: 0,
    color: vars.color.black500,
    minWidth: 0,
  },
]);

export const titleActions = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
  flexShrink: 0,
});

export const favoriteButton = style({
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '6px',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: vars.color.black500,
});

export const favoriteButtonActive = style({
  color: vars.color.blue300,
});

export const favoriteCount = style([
  typography.f14EB,
  {
    color: vars.color.black500,
  },
]);

export const reportButton = style([
  typography.f14R,
  {
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: vars.color.gray400,
  },
]);

export const ceoName = style([
  typography.f16EB,
  {
    margin: 0,
    marginTop: '4px',
    color: vars.color.black500,
  },
]);

export const description = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
    whiteSpace: 'pre-wrap',
    selectors: {
      [`${titleRow} + &`]: {
        marginTop: '4px',
      },
      [`${ceoName} + &`]: {
        marginTop: '8px',
      },
    },
  },
]);

export const tagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '12px',
});

export const actionColumn = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '12px',
  flexShrink: 0,
});

export const primaryButton = style([
  typography.f16B,
  {
    display: 'flex',
    width: '210px',
    padding: '14px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    boxSizing: 'border-box',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
    textDecoration: 'none',
  },
]);

export const secondaryButton = style([
  typography.f16B,
  {
    minWidth: '160px',
    padding: '14px 24px',
    border: `1px solid ${vars.color.blue300}`,
    borderRadius: '8px',
    backgroundColor: vars.color.white,
    color: vars.color.blue300,
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
  },
]);

export const statsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: '0',
  marginTop: '8px',
  padding: '24px 32px',
  borderRadius: '12px',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
});

export const statItem = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  textAlign: 'center',
  selectors: {
    '&:not(:last-child)': {
      borderRight: `1px solid ${vars.color.line200}`,
    },
  },
});

export const statLabel = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const statNumber = style([
  typography.f24B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const statSubLabel = style([
  typography.f12R,
  {
    margin: 0,
    color: vars.color.blue300,
  },
]);

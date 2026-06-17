import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const panel = style({
  width: '280px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '20px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '16px',
  boxSizing: 'border-box',
  overflowY: 'auto',
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const sectionHeader = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const sectionTitle = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const headerActions = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
});

export const headerAction = style([
  typography.f12R,
  {
    padding: 0,
    border: 'none',
    background: 'none',
    color: vars.color.gray400,
    cursor: 'pointer',
  },
]);

export const serviceList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const serviceCard = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
});

export const serviceCardLink = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
  textDecoration: 'none',
  color: 'inherit',
});

export const thumbnail = style({
  width: '56px',
  height: '56px',
  borderRadius: '8px',
  backgroundColor: vars.color.background300,
  flexShrink: 0,
});

export const thumbnailImage = style({
  width: '56px',
  height: '56px',
  borderRadius: '8px',
  objectFit: 'cover',
  flexShrink: 0,
});

export const serviceInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
});

export const serviceTitle = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
]);

export const servicePrice = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const statusBadge = style([
  typography.f12B,
  {
    padding: '4px 10px',
    borderRadius: '100px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
  },
]);

export const scheduleText = style([
  typography.f12R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '32px',
});

export const title = style([
  typography.f18EB,
  {
    margin: 0,
    color: vars.color.black500,
    textAlign: 'center',
  },
]);

export const notice = style([
  typography.f12R,
  {
    margin: 0,
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: vars.color.blue50,
    color: vars.color.blue300,
  },
]);

export const label = style([
  typography.f14B,
  {
    color: vars.color.black500,
  },
]);

export const calendar = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const calHeader = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const calMonth = style([
  typography.f16B,
  {
    color: vars.color.black500,
  },
]);

export const calNav = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
});

export const navButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  background: 'none',
  color: vars.color.gray400,
  cursor: 'pointer',
});

export const weekRow = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
});

export const weekday = style([
  typography.f12R,
  {
    color: vars.color.gray400,
    textAlign: 'center',
  },
]);

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  rowGap: '4px',
  justifyItems: 'center',
});

export const day = style([
  typography.f14R,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '50%',
    background: 'none',
    color: vars.color.black500,
    cursor: 'pointer',
    selectors: {
      '&:hover:not(:disabled)': {
        backgroundColor: vars.color.background300,
      },
      '&:disabled': {
        color: vars.color.gray200,
        cursor: 'not-allowed',
      },
    },
  },
]);

export const dayToday = style({
  color: vars.color.blue300,
  backgroundColor: vars.color.blue50,
});

export const daySelected = style({
  color: vars.color.white,
  backgroundColor: vars.color.blue300,
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: vars.color.blue300,
    },
  },
});

export const infoRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '12px',
  borderTop: `1px solid ${vars.color.line200}`,
});

export const infoLabel = style([
  typography.f14R,
  {
    color: vars.color.gray400,
  },
]);

export const infoValue = style([
  typography.f14R,
  {
    color: vars.color.gray400,
  },
]);

export const infoValueStrong = style([
  typography.f14B,
  {
    color: vars.color.black500,
  },
]);

export const submitButton = style([
  typography.f16EB,
  {
    width: '100%',
    height: '52px',
    marginTop: '8px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);

export const submitButtonDisabled = style({
  backgroundColor: vars.color.gray50,
  color: vars.color.white,
  cursor: 'not-allowed',
});

export const cancelButton = style([
  typography.f14R,
  {
    padding: '4px',
    border: 'none',
    background: 'none',
    color: vars.color.gray400,
    cursor: 'pointer',
  },
]);

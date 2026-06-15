import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});

export const transcript = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  flex: 1,
  overflowY: 'auto',
  padding: '20px 24px',
});

export const botMessage = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const botText = style([
  typography.f16R,
  {
    margin: 0,
    color: vars.color.black500,
    whiteSpace: 'pre-line',
    wordBreak: 'break-word',
  },
]);

export const botLines = style({
  display: 'flex',
  flexDirection: 'column',
});

export const botTextBold = style([
  typography.f16EB,
  {
    margin: 0,
    color: vars.color.black500,
    wordBreak: 'break-word',
  },
]);

export const meta = style([
  typography.f12R,
  {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: vars.color.gray400,
  },
]);

export const metaAvatar = style([
  typography.f12EB,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    lineHeight: 1,
  },
]);

export const userRow = style({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const userPill = style([
  typography.f16R,
  {
    padding: '12px 16px',
    borderRadius: 16,
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    whiteSpace: 'nowrap',
  },
]);

export const choices = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: 8,
});

export const chip = style([
  typography.f16R,
  {
    padding: '12px 16px',
    borderRadius: 16,
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
    selectors: {
      '&:hover': {
        borderColor: vars.color.blue300,
        color: vars.color.blue300,
      },
    },
  },
]);

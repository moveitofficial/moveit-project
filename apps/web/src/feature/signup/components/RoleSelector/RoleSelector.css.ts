import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const Container = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const titleWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '32px',
  marginBottom: '56px',
});

export const title = style([
  typography.f32EB,
  {
    textAlign: 'center',
  },
]);

export const selectRoleWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '24px',
});

export const selectRoleInner = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  backgroundColor: vars.color.blue50,
  padding: '36px 0 36px 36px',
  border: `1px solid ${vars.color.gray200}`,
  borderRadius: '12px',
  gap: '24px',
  cursor: 'pointer',

  ':hover': {
    borderColor: vars.color.blue300,
  },
});

export const textGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});
export const titleText = style([typography.f24EB]);
export const descText = style([
  typography.f16R,
  { color: vars.color.gray500, wordBreak: 'keep-all' },
]);

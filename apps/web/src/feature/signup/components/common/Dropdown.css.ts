import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const dropdownWrapper = style({
  position: 'relative',
  width: '100%',
});

export const dropdownTrigger = style([
  typography.f16R,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '12px',
    color: vars.color.black500,
    backgroundColor: vars.color.white,
    cursor: 'pointer',
    textAlign: 'left',
  },
]);

export const dropdownTriggerEmpty = style([
  dropdownTrigger,
  {
    color: vars.color.gray400,
  },
]);

export const dropdownTriggerDisabled = style([
  dropdownTrigger,
  {
    color: vars.color.gray400,
    backgroundColor: vars.color.gray100,
    cursor: 'not-allowed',
  },
]);

export const dropdownChevron = style({
  color: vars.color.black500,
  flexShrink: 0,
});

export const dropdownMenu = style({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  width: '100%',
  maxHeight: '208px',
  margin: 0,
  padding: '8px 0',
  listStyle: 'none',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
  backgroundColor: vars.color.white,
  overflowY: 'auto',
  zIndex: 1,
});

export const dropdownOption = style([
  typography.f16R,
  {
    width: '100%',
    padding: '14px 24px',
    background: 'none',
    border: 'none',
    color: vars.color.black500,
    textAlign: 'left',
    cursor: 'pointer',

    ':hover': {
      backgroundColor: vars.color.blue50,
    },
  },
]);

export const dropdownOptionSelected = style([
  dropdownOption,
  {
    backgroundColor: vars.color.blue50,
  },
]);

export const dropdownOptionDisabled = style([
  dropdownOption,
  {
    color: vars.color.gray300,
    cursor: 'not-allowed',

    selectors: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
]);

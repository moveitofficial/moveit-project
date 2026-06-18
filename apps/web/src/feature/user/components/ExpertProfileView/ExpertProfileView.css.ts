import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.87rem',
  width: '100%',
  fontFamily: vars.font.family,
});

export const titleRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
  width: '100%',
});

export const title = style({
  fontFamily: vars.font.family,
  fontWeight: vars.font.weight.extraBold,
  fontSize: '18px',
  color: vars.color.black500,
  margin: 0,
});

export const approvalBadgeApproved = style([
  typography.f14B,
  {
    color: vars.color.blue300,
    flexShrink: 0,
  },
]);

export const approvalBadgeWaiting = style([
  typography.f14B,
  {
    color: vars.color.yellow100,
    flexShrink: 0,
  },
]);

export const approvalBadgeRejected = style([
  typography.f14B,
  {
    color: vars.color.red200,
    flexShrink: 0,
  },
]);

export const sections = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
});

export const basicBody = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '2.5rem',
});

export const basicFields = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  flex: 1,
  minWidth: 0,
});

export const fieldGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '2rem',
  width: '100%',
});

export const fieldGridFull = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  width: '100%',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  width: '100%',
  minWidth: 0,
});

export const label = style([
  typography.f16B,
  {
    color: vars.color.black500,
  },
]);

export const input = style([
  typography.f16R,
  {
    width: '100%',
    padding: '0.875rem 1rem',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '0.75rem',
    color: vars.color.black500,
    backgroundColor: vars.color.white,
    boxSizing: 'border-box',

    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
      '&:disabled': {
        color: vars.color.gray400,
        backgroundColor: vars.color.gray100,
        cursor: 'not-allowed',
      },
    },
  },
]);

export const textarea = style([
  typography.f16R,
  {
    width: '100%',
    minHeight: '7.5rem',
    padding: '0.875rem 1rem',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '0.75rem',
    color: vars.color.black500,
    backgroundColor: vars.color.white,
    boxSizing: 'border-box',
    resize: 'vertical',

    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
      '&:disabled': {
        color: vars.color.gray400,
        backgroundColor: vars.color.gray100,
        cursor: 'not-allowed',
      },
    },
  },
]);

export const timeRange = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  width: '100%',
});

export const timeSlot = style({
  flex: 1,
  minWidth: 0,
});

export const timeSeparator = style([
  typography.f16R,
  {
    color: vars.color.gray400,
    flexShrink: 0,
  },
]);

export const employeeRange = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  width: '100%',
});

export const employeeRangeSlot = style({
  flex: 1,
  minWidth: 0,
});

export const employeeInputWrapper = style({
  position: 'relative',
  width: '100%',
});

export const employeeInput = style([
  typography.f16R,
  {
    width: '100%',
    padding: '0.875rem 3rem 0.875rem 1rem',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '0.75rem',
    color: vars.color.black500,
    backgroundColor: vars.color.white,
    boxSizing: 'border-box',

    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
      '&:disabled': {
        color: vars.color.gray400,
        backgroundColor: vars.color.gray100,
        cursor: 'not-allowed',
      },
    },
  },
]);

export const employeeSuffix = style([
  typography.f16R,
  {
    position: 'absolute',
    top: '50%',
    right: '1rem',
    transform: 'translateY(-50%)',
    color: vars.color.gray400,
    pointerEvents: 'none',
  },
]);

export const employeeRangeSeparator = style([
  typography.f16R,
  {
    color: vars.color.gray400,
    flexShrink: 0,
  },
]);

export const chipList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
});

export const providerList = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
});

export const providerBadge = style({
  position: 'relative',
  display: 'block',
  flexShrink: 0,
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '9999px',
  backgroundColor: vars.color.white,
  overflow: 'hidden',
});

export const providerBadgeActive = style({
  borderColor: vars.color.blue300,
  backgroundColor: vars.color.blue50,
});

export const providerIcon = style({
  objectFit: 'cover',
});

export const providerIconInactive = style({
  filter: 'grayscale(1)',
});

export const statusMessage = style([
  typography.f16R,
  {
    color: vars.color.gray400,
  },
]);

export const errorMessage = style([
  typography.f16R,
  {
    color: vars.color.red200,
  },
]);

export const applyBtn = style({
  margin: '2rem auto 0',

  display: 'flex',
  width: '23.4375rem',
  padding: '0.875rem',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.625rem',
  border: 'none',
  borderRadius: '0.75rem',
  background: `var(--Primary-blue-300, #1B92FF)`,
  cursor: 'pointer',

  color: vars.color.white,
  fontFamily: vars.font.family,
  fontWeight: vars.font.weight.extraBold,
  fontSize: '1rem',
});

export const applyBtnDisabled = style({
  cursor: 'not-allowed',
  opacity: 0.5,
});

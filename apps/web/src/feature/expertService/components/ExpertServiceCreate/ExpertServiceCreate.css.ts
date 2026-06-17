import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { globalStyle, style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  width: '776px',
  padding: '120px 0',
  gap: '20px',
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
});

export const label = style([
  typography.f16B,
  {
    color: vars.color.black500,
  },
]);

export const labelCount = style([
  typography.f16B,
  {
    color: vars.color.gray300,
  },
]);

export const input = style([
  typography.f16R,
  {
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '12px',
    color: vars.color.black500,
    backgroundColor: vars.color.white,
    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
    },
  },
]);

export const inputWithUnit = style({
  position: 'relative',
  width: '100%',
});

globalStyle(`${inputWithUnit} input`, {
  paddingRight: '92px',
});

export const unit = style([
  typography.f16R,
  {
    position: 'absolute',
    top: '50%',
    right: '16px',
    transform: 'translateY(-50%)',
    color: vars.color.gray400,
  },
]);

export const guide = style([
  typography.f12R,
  {
    margin: 0,
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: vars.color.blue50,
    color: vars.color.blue300,
  },
]);

// 상세분야 — 라디오 단일선택 박스
export const categoryOptions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '8px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
});

export const categoryOption = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 8px',
  border: 'none',
  background: 'none',
  textAlign: 'left',
  cursor: 'pointer',
});

export const categoryLabel = style([
  typography.f16R,
  {
    color: vars.color.black500,
  },
]);

export const radio = style({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: `2px solid ${vars.color.gray200}`,
  boxSizing: 'border-box',
  flexShrink: 0,
});

export const radioChecked = style([
  radio,
  {
    position: 'relative',
    borderColor: vars.color.blue300,
    selectors: {
      '&::after': {
        content: '',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: vars.color.blue300,
      },
    },
  },
]);

// 반복 섹션(STEP / FAQ)
export const repeatItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '16px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
});

export const repeatHeader = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const repeatTitle = style([
  typography.f14B,
  {
    color: vars.color.black500,
  },
]);

export const removeButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  border: 'none',
  background: 'none',
  color: vars.color.gray400,
  cursor: 'pointer',
});

export const addButton = style([
  typography.f14R,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    width: '100%',
    padding: '12px 0',
    border: `1px dashed ${vars.color.line200}`,
    borderRadius: '12px',
    backgroundColor: vars.color.white,
    color: vars.color.gray400,
    cursor: 'pointer',
  },
]);

export const textareaWrapper = style({
  position: 'relative',
  width: '100%',
});

export const textarea = style([
  typography.f16R,
  {
    width: '100%',
    height: '120px',
    padding: '16px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '12px',
    color: vars.color.black500,
    backgroundColor: vars.color.white,
    resize: 'none',
    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
    },
  },
]);

// textareaWrapper 내부(절대 위치)
export const counter = style([
  typography.f12R,
  {
    position: 'absolute',
    right: '16px',
    bottom: '16px',
    color: vars.color.gray400,
  },
]);

// 에디터 등 일반 흐름 카운터
export const counterRight = style([
  typography.f12R,
  {
    alignSelf: 'flex-end',
    color: vars.color.gray400,
  },
]);

export const submitArea = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '40px',
});

export const submitBtn = style([
  typography.f16EB,
  {
    width: '375px',
    padding: '14px 0',
    backgroundColor: vars.color.gray50,
    border: 'none',
    borderRadius: '12px',
    color: vars.color.white,
    cursor: 'not-allowed',
    selectors: {
      '&:not(:disabled)': {
        backgroundColor: vars.color.blue300,
        cursor: 'pointer',
      },
    },
  },
]);

export const formError = style([
  typography.f12B,
  {
    color: vars.color.red200,
    width: '100%',
  },
]);

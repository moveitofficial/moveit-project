import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const conversation = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '16px',
  boxSizing: 'border-box',
  overflow: 'hidden',
});

export const messageScroll = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: '24px',
});

export const messageContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const stateText = style([
  typography.f14R,
  {
    margin: 0,
    padding: '24px 0',
    color: vars.color.gray400,
    textAlign: 'center',
  },
]);

export const messageRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '8px',
  maxWidth: '80%',
});

export const messageRowMine = style({
  alignSelf: 'flex-end',
});

export const avatar = style({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  objectFit: 'cover',
  flexShrink: 0,
});

export const avatarFallback = style([
  typography.f14B,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: vars.color.blue400,
    color: vars.color.white,
    flexShrink: 0,
  },
]);

export const bubbleGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
});

export const bubble = style([
  typography.f14R,
  {
    margin: 0,
    padding: '12px 16px',
    borderRadius: '12px',
    color: vars.color.black500,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
]);

export const bubbleMine = style({
  backgroundColor: vars.color.yellow50,
});

export const bubbleOther = style({
  backgroundColor: vars.color.background300,
});

export const time = style([
  typography.f12R,
  {
    alignSelf: 'flex-end',
    color: vars.color.gray400,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
]);

export const fileChip = style([
  typography.f14R,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    maxWidth: '260px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    textDecoration: 'none',
  },
]);

export const fileIcon = style({
  color: vars.color.gray400,
  flexShrink: 0,
});

export const fileMeta = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
});

export const fileName = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const fileSub = style([
  typography.f12R,
  {
    color: vars.color.gray400,
  },
]);

export const imageAttachment = style({
  display: 'inline-block',
  maxWidth: '220px',
  borderRadius: '12px',
  overflow: 'hidden',
});

export const attachmentImage = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
});

export const systemRow = style({
  display: 'flex',
  justifyContent: 'center',
  padding: '4px 0',
});

export const systemText = style([
  typography.f12R,
  {
    margin: 0,
    color: vars.color.gray400,
    textAlign: 'center',
  },
]);

export const inputArea = style({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '16px',
  borderTop: `1px solid ${vars.color.line200}`,
});

export const textarea = style([
  typography.f14R,
  {
    width: '100%',
    minHeight: '52px',
    maxHeight: '140px',
    boxSizing: 'border-box',
    padding: '14px 16px',
    borderRadius: '12px',
    border: `1px solid ${vars.color.line200}`,
    resize: 'none',
    color: vars.color.black500,
    fontFamily: vars.font.family,
    '::placeholder': {
      color: vars.color.gray200,
    },
  },
]);

export const inputBottom = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
});

export const actionGroup = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
});

export const actionButton = style([
  typography.f14R,
  {
    padding: '8px 12px',
    borderRadius: '8px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
    ':disabled': {
      color: vars.color.gray200,
      cursor: 'not-allowed',
    },
  },
]);

export const attachButton = style([
  typography.f14R,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
    ':disabled': {
      color: vars.color.gray200,
      cursor: 'not-allowed',
    },
  },
]);

export const sendButton = style([
  typography.f14B,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 24px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);

export const sendButtonDisabled = style({
  backgroundColor: vars.color.gray50,
  color: vars.color.white,
  cursor: 'not-allowed',
});

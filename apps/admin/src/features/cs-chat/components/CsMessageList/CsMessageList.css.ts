import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const systemLine = style([
  typography.f14R,
  { margin: 0, textAlign: 'center', color: vars.color.gray400 },
]);

export const stamp = style({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  fontSize: 10,
  lineHeight: '14px',
  color: vars.color.gray400,
});

// 아바타는 말풍선 위쪽 정렬 (타임스탬프는 아래쪽 유지)
export const avatar = style({
  alignSelf: 'flex-start',
});

export const userRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: 8,
});

export const userBubble = style([
  typography.f16R,
  {
    margin: 0,
    maxWidth: 560,
    padding: 16,
    borderRadius: 8,
    backgroundColor: vars.color.blue50,
    color: vars.color.black500,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
]);

export const adminRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  gap: 8,
});

export const adminBubble = style([
  typography.f14R,
  {
    margin: 0,
    maxWidth: 560,
    padding: 16,
    borderRadius: 8,
    backgroundColor: vars.color.yellow50,
    color: vars.color.black500,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
]);

// 파일/이미지 첨부 (클릭 시 다운로드)
export const fileBubble = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  textDecoration: 'none',
  cursor: 'pointer',
});

export const fileIcon = style({
  flexShrink: 0,
});

export const fileName = style({
  maxWidth: 220,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

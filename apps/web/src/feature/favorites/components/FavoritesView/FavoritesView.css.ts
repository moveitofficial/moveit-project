import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

/** Figma: 좌측 276px(제목·구분선·탭) + gap 24px + 카드 그리드(876px = 3×276 + 2×24) */
const SIDEBAR_WIDTH = '276px';
const SIDEBAR_CONTENT_GAP = '24px';

export const page = style({
  display: 'grid',
  gridTemplateColumns: `${SIDEBAR_WIDTH} 1fr`,
  columnGap: SIDEBAR_CONTENT_GAP,
  rowGap: 0,
  alignItems: 'start',
  width: '100%',
  padding: '48px 0 80px',
  boxSizing: 'border-box',
});

export const pageTitle = style([
  typography.f18B,
  {
    gridColumn: '1',
    gridRow: '1',
    margin: '0 0 16px',
    color: vars.color.black500,
    wordBreak: 'keep-all',
  },
]);

export const pageDivider = style({
  gridColumn: '1',
  gridRow: '2',
  width: '100%',
  height: '1px',
  margin: 0,
  border: 'none',
  backgroundColor: vars.color.line200,
});

export const tabList = style({
  gridColumn: '1',
  gridRow: '3',
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const tabButton = style([
  typography.f16R,
  {
    padding: '14px 16px',
    border: 'none',
    background: 'none',
    color: vars.color.gray500,
    textAlign: 'left',
    cursor: 'pointer',
    wordBreak: 'keep-all',
  },
]);

export const tabButtonActive = style({
  fontWeight: vars.font.weight.extraBold,
  color: vars.color.black500,
});

export const content = style({
  gridColumn: '2',
  gridRow: '3',
  minWidth: 0,
});

export const cardGrid = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '24px',
});

import { style } from '@vanilla-extract/css';

const SIDEBAR_WIDTH = '276px';
const SIDEBAR_CONTENT_GAP = '24px';

export const page = style({
  display: 'grid',
  gridTemplateColumns: `${SIDEBAR_WIDTH} 1fr`,
  columnGap: SIDEBAR_CONTENT_GAP,
  alignItems: 'start',
  width: '100%',
  padding: '48px 0 80px',
  boxSizing: 'border-box',
});

export const content = style({
  minWidth: 0,
});

import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
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

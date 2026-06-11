import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

const PROFILE_COLUMN_WIDTH = '130px';
const PROFILE_FIELD_GAP = '80px';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '56px',
});

export const sectionSkeleton = style({
  height: '664px',
  borderRadius: '12px',
  backgroundColor: vars.color.line100,
});

export const tableSections = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '50px',
  marginLeft: `calc(${PROFILE_COLUMN_WIDTH} + ${PROFILE_FIELD_GAP})`,
  maxWidth: '1400px',
});

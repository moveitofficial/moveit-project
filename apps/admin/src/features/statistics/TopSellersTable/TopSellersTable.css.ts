import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
  overflow: 'hidden',
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '20px 24px 16px',
  borderBottom: `1px solid ${vars.color.line200}`,
});

export const headerTitle = style({
  color: vars.color.black400,
});

export const headerSubtitle = style({
  color: vars.color.gray400,
});

const colBase = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  padding: '0 8px',
  selectors: {
    '&:not(:last-child)': {
      borderRight: `1px solid ${vars.color.line200}`,
    },
  },
});

export const colNo = style([colBase, { flex: '0 0 80px' }]);
export const colBusiness = style([colBase, { flex: '0 200px' }]);
export const colEmailHeader = style([colBase, { flex: 2, minWidth: 0 }]);
export const colEmailCell = style([
  colBase,
  { flex: 2, minWidth: 0, justifyContent: 'flex-start', paddingLeft: '16px' },
]);
export const colProvider = style([colBase, { flex: '0 0 120px' }]);
export const colAmount = style([colBase, { flex: '0 0 180px' }]);
export const colRegion = style([colBase, { flex: '0 0 120px' }]);
export const colCount = style([colBase, { flex: '0 0 100px' }]);
export const colRating = style([colBase, { flex: '0 0 100px' }]);
export const colDate = style([colBase, { flex: '0 0 200px' }]);

export const emailText = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

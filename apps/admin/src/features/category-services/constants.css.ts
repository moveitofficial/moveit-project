import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

const colBase = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
});

export const svcColTitle = style([colBase, { flex: 3, minWidth: 0 }]);
export const svcColCategory = style([colBase, { flex: '0 0 140px' }]);
export const svcColCompany = style([colBase, { flex: '0 0 180px' }]);
export const svcColStatus = style([colBase, { flex: '0 0 180px' }]);
export const svcColPrice = style([colBase, { flex: '0 0 200px' }]);
export const svcColDate = style([colBase, { flex: '0 0 120px' }]);
export const svcColSales = style([colBase, { flex: '0 0 120px' }]);

export const titleText = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const statusActive = style({ color: vars.color.blue300 });
export const statusPaused = style({ color: vars.color.gray400 });
export const statusClosed = style({ color: vars.color.red200 });

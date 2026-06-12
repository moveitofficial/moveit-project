import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

const colBase = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
});

export const svcColTitle = style([colBase, { flex: 3, minWidth: 0 }]);
export const svcColCategory = style([colBase, { flex: '0 0 160px' }]);
export const svcColCompany = style([colBase, { flex: '0 0 180px' }]);
export const svcColStatus = style([colBase, { flex: '0 0 180px' }]);
export const svcColPrice = style([colBase, { flex: '0 0 200px' }]);
export const svcColDate = style([colBase, { flex: '0 0 200px' }]);
export const svcColSales = style([colBase, { flex: '0 0 120px' }]);

export const expertColCompany = style([colBase, { flex: '0 0 180px' }]);
export const expertColEmail = style([colBase, { flex: 2, minWidth: 0 }]);
export const expertColType = style([colBase, { flex: '0 0 160px' }]);
export const expertColProvider = style([colBase, { flex: '0 0 120px' }]);
export const expertColStatus = style([colBase, { flex: '0 0 120px' }]);
export const expertColRegion = style([colBase, { flex: '0 0 120px' }]);
export const expertColOrders = style([colBase, { flex: '0 0 100px' }]);
export const expertColReport = style([colBase, { flex: '0 0 100px' }]);
export const expertColDate = style([colBase, { flex: '0 0 200px' }]);

export const bannerColImage = style([colBase, { flex: '0 0 220px' }]);
export const bannerColUrl = style([colBase, { flex: 3, minWidth: 0 }]);
export const bannerColDate = style([colBase, { flex: '0 0 200px' }]);

export const titleText = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const thumbnailImg = style({
  objectFit: 'cover',
  borderRadius: '4px',
});

export const statusActive = style({ color: vars.color.blue300 });
export const statusPaused = style({ color: vars.color.gray400 });
export const statusClosed = style({ color: vars.color.red200 });
export const statusApproved = style({ color: vars.color.blue300 });
export const statusPending = style({ color: vars.color.yellow100 });
export const statusRejected = style({ color: vars.color.red200 });

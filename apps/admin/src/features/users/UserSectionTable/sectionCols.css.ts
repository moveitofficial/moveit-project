import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

const cellBase = {
  flexShrink: 0,
  textAlign: 'center' as const,
  borderRight: `1px solid ${vars.color.line200}`,
  alignSelf: 'stretch',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const cellLeft = {
  ...cellBase,
  justifyContent: 'flex-start' as const,
  padding: '0 16px',
};

export const truncate = style({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
  textAlign: 'left',
});

export const colFlexHeader = style({ ...cellBase, flex: 1, minWidth: 0 });

/* 구매내역 */
export const colOrderNo = style({ ...cellBase, width: '70px' });
export const colOrderService = style({ ...cellLeft, flex: 1, minWidth: 0 });
export const colOrderExpert = style({
  ...cellBase,
  width: '220px',
  color: vars.color.blue300,
});
export const colOrderStatus = style({ ...cellBase, width: '160px' });
export const colOrderAmount = style({
  ...cellBase,
  width: '160px',
  color: vars.color.blue300,
});
export const colOrderFee = style({ ...cellBase, width: '140px' });
export const colOrderEndDate = style({ ...cellBase, width: '180px' });
export const colOrderRefund = style({
  ...cellBase,
  width: '150px',
  borderRight: 'none',
});

export const orderStatusUrgent = style({ color: vars.color.red200 });

export const refundClickable = style({
  border: 'none',
  background: 'none',
  padding: 0,
  color: 'inherit',
  cursor: 'pointer',
});

export const refundRequestText = style({
  color: vars.color.red200,
  textDecoration: 'underline',
});

export const refundRequestClickable = style([
  refundRequestText,
  {
    border: 'none',
    background: 'none',
    padding: 0,
    cursor: 'pointer',
  },
]);

/* 등록된 서비스 */
export const colServiceNo = style({ ...cellBase, width: '80px' });
export const colServiceTitle = style({ ...cellLeft, flex: 1, minWidth: 0 });
export const colServiceStatus = style({ ...cellBase, width: '180px' });
export const colServicePrice = style({ ...cellBase, width: '200px' });
export const colServiceCreatedAt = style({ ...cellBase, width: '200px' });
export const colServiceSalesCount = style({
  ...cellBase,
  width: '140px',
  borderRight: 'none',
});

export const serviceTitleButton = style([
  typography.f16R,
  {
    display: 'block',
    width: '100%',
    border: 'none',
    background: 'none',
    padding: 0,
    textAlign: 'left',
    cursor: 'pointer',
  },
]);

/* 신고 */
export const colReportNo = style({ ...cellBase, width: '70px' });
export const colReportUser = style({
  ...cellBase,
  width: '200px',
  color: vars.color.blue300,
});
export const colReportDetail = style({ ...cellLeft, flex: 1, minWidth: 0 });
export const colReportReason = style({ ...cellBase, width: '240px' });
export const colReportDate = style({
  ...cellBase,
  width: '200px',
  borderRight: 'none',
});

export const reportDetailButton = style([
  typography.f16R,
  {
    display: 'block',
    width: '100%',
    border: 'none',
    background: 'none',
    padding: 0,
    textAlign: 'left',
    cursor: 'pointer',
  },
]);

/* 게시글 · 댓글 */
export const colCommunityNo = style({ ...cellBase, width: '70px' });
export const colCommunityContent = style({ ...cellLeft, flex: 1, minWidth: 0 });
export const colCommunityStatus = style({ ...cellBase, width: '200px' });
export const colCommunityCreatedAt = style({ ...cellBase, width: '220px' });
export const colCommunityDeletedAt = style({ ...cellBase, width: '220px' });
export const colCommunityDelete = style({
  ...cellBase,
  width: '160px',
  borderRight: 'none',
});

const communityDeleteLinkBase = {
  border: 'none',
  background: 'none',
  padding: 0,
  color: vars.color.red200,
  textDecoration: 'underline',
  cursor: 'pointer',
};

export const deleteAction = style([typography.f16EB, communityDeleteLinkBase]);

export const deleteReasonLink = style([
  typography.f16EB,
  communityDeleteLinkBase,
]);

export const statusVisible = style({ color: vars.color.black400 });
export const statusDeleted = style({ color: vars.color.gray300 });
export const statusAdminDeleted = style({ color: vars.color.red200 });

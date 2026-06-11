import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

/* 거절 사유 상단 띠 */
export const rejectReasonStrip = style({
  padding: '16px',
  backgroundColor: vars.color.red200,
  borderRadius: '4px',
  color: vars.color.white,
});

export const layout = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '80px',
  width: '100%',
});

export const profileColumn = style({
  width: '130px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
});

export const avatar = style({
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  backgroundColor: vars.color.gray200,
  flexShrink: 0,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const avatarImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const profileActions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
  alignItems: 'center',
});

/* 필드 그리드 */
export const body = style({
  flex: 1,
  minWidth: 0,
  maxWidth: '1400px',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
});

export const grid2 = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '32px',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const fieldLabel = style({
  color: vars.color.black300,
});

export const fieldValue = style({
  padding: '14px 16px',
  backgroundColor: vars.color.background100,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
  color: vars.color.gray400,
  minHeight: '52px',
  display: 'flex',
  alignItems: 'center',
});

export const fieldValueTextarea = style({
  padding: '14px 16px',
  backgroundColor: vars.color.background100,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
  color: vars.color.gray400,
  minHeight: '144px',
  display: 'flex',
  alignItems: 'flex-start',
});

const splitFieldValueBase = {
  flex: 1,
  minWidth: 0,
  padding: '14px 16px',
  backgroundColor: vars.color.background100,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
  color: vars.color.gray400,
  minHeight: '52px',
  display: 'flex',
  alignItems: 'center',
};

export const splitFieldRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const splitFieldValue = style(splitFieldValueBase);

export const splitFieldValueWithSuffix = style({
  ...splitFieldValueBase,
  justifyContent: 'space-between',
});

export const rangeSeparator = style({
  flexShrink: 0,
  color: vars.color.black500,
});

/* 섹션 헤더 */
export const sectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
});

export const sectionHeaderMain = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'nowrap',
  minWidth: 0,
});

export const sectionHeaderTitleGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flexShrink: 0,
});

export const sectionHeaderMetaInline = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginLeft: '24px',
  color: vars.color.gray400,
  flexShrink: 0,
});

export const sectionHeaderRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
  marginLeft: 'auto',
});

export const sectionHeaderMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: vars.color.gray400,
});

export const approvalStatusBlue = style({
  color: vars.color.blue300,
});

export const approvalStatusRejected = style({
  color: vars.color.red200,
});

export const sectionTitle = style({});

export const sectionDivider = style({
  padding: '36px 0 16px',
});

export const specialtyPills = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  alignItems: 'center',
  minHeight: '52px',
});

export const specialtyPill = style({
  padding: '12px 16px',
  backgroundColor: vars.color.blue100,
  color: vars.color.black400,
  borderRadius: '100px',
});

/* 소셜 연동 아이콘 */
export const providerIcons = style({
  display: 'flex',
  gap: '24px',
  alignItems: 'center',
  minHeight: '52px',
});

export const providerIconImage = style({
  width: '40px',
  height: '40px',
  flexShrink: 0,
});

export const providerIconInactive = style({
  opacity: 0.4,
});

/* 포트폴리오 그리드 */
export const portfolioGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '24px',
});

export const portfolioCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const portfolioItem = style({
  width: '332px',
  height: '332px',
  overflow: 'hidden',
  borderRadius: '12px',
  backgroundColor: vars.color.gray200,
});

export const portfolioImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const portfolioTitle = style({
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export const emptyText = style({
  color: vars.color.gray400,
});

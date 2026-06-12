import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

import {
  SERVICE_DETAIL_STICKY_TOP,
  SERVICE_DETAIL_TAB_STICKY_TOP,
} from '../../constants';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '64px',
  width: '100%',
  padding: '0 0 80px',
  boxSizing: 'border-box',
});

export const heroBand = style({
  width: '100vw',
  marginLeft: 'calc(-50vw + 50%)',
  backgroundColor: vars.color.blue50,
  padding: '56px 0',
  boxSizing: 'border-box',
});

export const heroInner = style({
  width: '100%',
  maxWidth: '1176px',
  margin: '0 auto',
});

export const contentRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '92px',
  paddingTop: '8px',
});

export const mainColumn = style({
  width: '724px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
});

export const sidebarColumn = style({
  width: '360px',
  flexShrink: 0,
  position: 'sticky',
  top: `${String(SERVICE_DETAIL_STICKY_TOP)}px`,
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  // sticky 탭 높이(~58px) + top 오프셋
  scrollMarginTop: `${String(SERVICE_DETAIL_TAB_STICKY_TOP + 58)}px`,
});

export const sectionTitle = style({
  margin: 0,
  color: vars.color.black500,
  fontSize: '20px',
  fontWeight: vars.font.weight.extraBold,
  lineHeight: '28px',
});

import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

import { PANEL_HEIGHT, PANEL_WIDTH } from '../../constants';

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  width: PANEL_WIDTH,
  height: PANEL_HEIGHT,
  maxHeight: 'calc(100vh - 108px)',
  borderRadius: 16,
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
  boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
  overflow: 'hidden',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
});

export const headerTab = style({
  padding: '24px 24px 16px',
});

export const headerBot = style({
  height: 56,
  padding: '0 12px',
  gap: 8,
  borderBottom: `1px solid ${vars.color.line100}`,
});

export const avatar = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  borderRadius: '50%',
  backgroundColor: vars.color.blue300,
  color: vars.color.white,
  lineHeight: 1,
});

export const avatarLg = style([typography.f20EB, { width: 40, height: 40 }]);
export const avatarSm = style([typography.f14EB, { width: 24, height: 24 }]);

export const title = style({ color: vars.color.black500 });
export const titleTab = style([typography.f24EB]);
export const titleBot = style([typography.f16B]);

export const headerIcon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.black300,
  cursor: 'pointer',
});

export const exit = style([
  typography.f14R,
  {
    marginLeft: 'auto',
    color: vars.color.gray400,
    cursor: 'pointer',
  },
]);

export const tabBar = style({
  display: 'flex',
  backgroundColor: vars.color.background200,
});

export const tab = style([
  typography.f16R,
  {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 60,
    color: vars.color.gray400,
    cursor: 'pointer',
  },
]);

export const tabActive = style({
  color: vars.color.blue300,
});

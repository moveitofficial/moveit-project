import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { SERVICE_DETAIL_TAB_STICKY_TOP } from '../../constants';

export const tabNav = style({
  position: 'sticky',
  top: `${String(SERVICE_DETAIL_TAB_STICKY_TOP)}px`,
  zIndex: 10,
  backgroundColor: vars.color.white,
});

export const tabList = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '24px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  borderBottom: `1px solid ${vars.color.line200}`,
});

export const tabLink = recipe({
  base: [
    typography.f16R,
    {
      display: 'inline-block',
      padding: '16px 0',
      color: vars.color.gray400,
      textDecoration: 'none',
      borderBottom: '2px solid transparent',
      marginBottom: '-1px',
    },
  ],
  variants: {
    active: {
      true: [
        typography.f16B,
        {
          color: vars.color.black500,
          borderBottomColor: vars.color.blue300,
        },
      ],
      false: {},
    },
  },
});

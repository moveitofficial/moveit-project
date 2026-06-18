import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { SERVICE_DESCRIPTION_COLLAPSED_MAX_HEIGHT } from '../../constants';

export const block = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const blockTitle = style([
  typography.f18B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const bulletList = style([
  typography.f14R,
  {
    margin: 0,
    paddingLeft: '20px',
    color: vars.color.black300,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
]);

export const paragraph = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.black300,
    whiteSpace: 'pre-line',
  },
]);

export const stepGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 163px)',
  gap: '24px',
});

export const stepCard = style({
  display: 'flex',
  flexDirection: 'column',
  width: '163px',
  paddingTop: '16px',
  paddingRight: '16px',
  paddingBottom: '16px',
  paddingLeft: '16px',
  borderRadius: '8px',
  backgroundColor: vars.color.blue50,
  boxSizing: 'border-box',
});

export const stepLabel = style([
  typography.f14EB,
  {
    margin: 0,
    color: vars.color.blue300,
  },
]);

export const stepTitle = style([
  typography.f16B,
  {
    margin: 0,
    marginTop: '4px',
    color: vars.color.black500,
  },
]);

export const stepDescription = style([
  typography.f12R,
  {
    margin: 0,
    marginTop: '12px',
    color: vars.color.gray400,
  },
]);

export const preparationBox = style({
  padding: '24px',
  borderRadius: '8px',
  backgroundColor: '#FEF8E8',
});

export const preparationText = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.black500,
    whiteSpace: 'pre-line',
  },
]);

export const detailImageList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const detailImage = style({
  width: '100%',
  height: 'auto',
});

export const expandableRoot = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const expandableContent = recipe({
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  variants: {
    collapsed: {
      true: {
        maxHeight: `${String(SERVICE_DESCRIPTION_COLLAPSED_MAX_HEIGHT)}px`,
        overflow: 'hidden',
      },
      false: {},
    },
  },
});

export const expandableFade = style({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: '120px',
  background: `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${vars.color.white} 100%)`,
  pointerEvents: 'none',
});

export const expandableButton = style([
  typography.f14R,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);

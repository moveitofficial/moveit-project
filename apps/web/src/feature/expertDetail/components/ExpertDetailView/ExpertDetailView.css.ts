import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

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
  backgroundColor: '#FAFAFA',
  padding: '56px 0 40px',
  boxSizing: 'border-box',
});

export const heroInner = style({
  width: '100%',
  maxWidth: '1176px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const contentInner = style({
  width: '100%',
  maxWidth: '1176px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '64px',
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const sectionHeader = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
});

export const sectionTitle = style([
  typography.f24B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const sectionActionLink = style([
  typography.f14R,
  {
    color: vars.color.gray400,
    textDecoration: 'none',
  },
]);

export const sectionHeaderActions = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
});

export const infoPanel = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '24px',
  padding: '24px 32px',
  borderRadius: '12px',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
});

export const infoItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  flex: 1,
  minWidth: 0,
});

export const infoLabel = style([
  typography.f14EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const infoValue = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const clientTagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
});

export const clientTag = style([
  typography.f14R,
  {
    padding: '4px 10px',
    borderRadius: '999px',
    backgroundColor: vars.color.blue50,
    color: vars.color.blue300,
  },
]);

export const serviceGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: '24px',
});

export const serviceCardLink = style({
  textDecoration: 'none',
  color: 'inherit',
});

export const emptyServices = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '24px',
  padding: '72px 0',
  borderRadius: '16px',
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
});

export const emptyServicesIllustration = style({
  width: '320px',
  height: '168px',
});

export const emptyServicesText = style([
  typography.f18EB,
  {
    margin: 0,
    color: vars.color.gray400,
    textAlign: 'center',
  },
]);

export const portfolioGridWrap = style({
  width: '100%',
});

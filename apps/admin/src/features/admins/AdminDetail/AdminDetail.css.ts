import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const infoCard = style({
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
  overflow: 'hidden',
  padding: '32px',
});

export const infoHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '16px',
});

export const infoTitle = style({
  color: vars.color.black400,
});

export const infoFields = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
});

export const fieldGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const fieldLabel = style({
  color: vars.color.black300,
});

export const fieldValue = style({
  padding: '14px 16px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
  color: vars.color.gray400,
  backgroundColor: vars.color.background100,
});

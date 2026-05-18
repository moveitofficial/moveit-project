import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '112px',
});

export const newService = style({
  width: '100vw',
  marginLeft: 'calc(-50vw + 50%)', // 부모 중앙 기준으로 좌측까지 밀어냄
  backgroundColor: vars.color.blue50,
  padding: '80px 0',
  marginTop: '88px',
  display: 'flex',
  justifyContent: 'center',
});

export const newServiceInner = style({
  width: '100%',
  maxWidth: '1176px',
});

export const cardList = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '24px',
});

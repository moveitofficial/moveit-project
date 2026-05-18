import { style } from '@vanilla-extract/css';

export const card = style({
  width: '276px',
  height: '356px',
  display: 'flex',
  flexDirection: 'column',
  border: 'none',
  backgroundColor: '#ffffff',
  boxShadow: 'none',
});

export const clickable = style({
  cursor: 'pointer',
});

export const thumbnailWrapper = style({
  position: 'relative',
  width: '276px',
  height: '176px',
  borderRadius: '12px',
  overflow: 'hidden',
  flexShrink: 0,
  marginBottom: '16px',
});

export const thumbnail = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

export const techStackList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  marginBottom: '16px',
});

export const title = style({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 1,
  alignSelf: 'stretch',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: 'var(--Black-Black-300, #373737)',
  fontFamily: 'var(--font-nanum-square)',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: '800',
  lineHeight: '24px',
  marginBottom: '16px',
  wordBreak: 'keep-all',
});

export const metaRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginBottom: '8px',
});

export const ratingRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginBottom: '8px',
});

export const starIcon = style({
  color: '#FFB629',
  fontSize: '18px',
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'translateY(-1px)',
});

export const rating = style({
  color: 'var(--Black-Black-500, #040404)',
  fontFamily: 'var(--font-nanum-square)',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '22px',
});

export const reviewCount = style({
  color: 'var(--gray-gray-400, #999)',
  fontFamily: 'var(--font-nanum-square)',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '22px',
});

export const price = style({
  alignSelf: 'stretch',
  color: 'var(--Primary-blue-300, #1B92FF)',
  fontFamily: 'var(--font-nanum-square)',
  fontSize: '18px',
  fontStyle: 'normal',
  fontWeight: '800',
  lineHeight: '26px',
  marginBottom: '8px',
});

export const expertName = style({
  alignSelf: 'stretch',
  color: 'var(--gray-gray-400, #999)',
  fontFamily: 'var(--font-nanum-square)',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '22px',
});

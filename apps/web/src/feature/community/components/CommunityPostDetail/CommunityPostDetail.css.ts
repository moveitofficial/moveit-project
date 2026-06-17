import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { globalStyle, style } from '@vanilla-extract/css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  width: '776px',
  margin: '0 auto',
  gap: '24px',
  padding: '48px 0 80px',
  boxSizing: 'border-box',
});

export const postSection = style({
  width: '100%',
});

export const postCategory = style([
  typography.f14EB,
  {
    color: vars.color.blue300,
  },
]);

export const postTitle = style([
  typography.f32EB,
  {
    margin: 0,
    marginTop: '8px',
    color: vars.color.black500,
  },
]);

export const postMetaRow = style({
  marginTop: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
});

export const postAuthorGroup = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
});

export const postAuthorName = style([
  typography.f14EB,
  { color: vars.color.black500 },
]);

export const postDate = style([
  typography.f12R,
  { color: vars.color.gray400 },
]);

export const postStats = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '16px',
});

export const postLike = style([
  typography.f14EB,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: vars.color.black300,
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    ':disabled': {
      cursor: 'default',
    },
  },
]);

export const postLikeCount = style([typography.f14EB]);

export const postMetaRight = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '16px',
});

export const postEdit = style([
  typography.f14R,
  {
    color: vars.color.gray400,
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    ':disabled': {
      cursor: 'default',
      opacity: 0.5,
    },
  },
]);

export const postContent = style([
  typography.f14R,
  {
    marginTop: '24px',
    color: vars.color.black500,
    whiteSpace: 'pre-wrap',
    lineHeight: '24px',
  },
]);

// 에디터 HTML 본문 — 전역 reset(list-style:none 등)에 가려진 서식을 복구.
globalStyle(`${postContent} ul`, { listStyle: 'disc', paddingLeft: '24px' });
globalStyle(`${postContent} ol`, { listStyle: 'decimal', paddingLeft: '24px' });
globalStyle(`${postContent} b, ${postContent} strong`, { fontWeight: 700 });
globalStyle(`${postContent} u`, { textDecoration: 'underline' });
globalStyle(`${postContent} i, ${postContent} em`, { fontStyle: 'italic' });

export const avatar = style({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
});

export const avatarFallback = style({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: vars.color.gray200,
});

export const commentSection = style({
  width: '100%',
  marginTop: '8px',
});

export const commentTitle = style([
  typography.f16EB,
  { color: vars.color.black500 },
]);

export const commentComposer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
  backgroundColor: vars.color.background100,
});

export const commentComposerAtSection = style({
  marginTop: '16px',
});

export const commentComposerEditingMultiline = style({
  alignItems: 'flex-end',
});

export const commentTextarea = style([
  typography.f14R,
  {
    flex: 1,
    width: '100%',
    minHeight: '40px',
    padding: 0,
    border: 'none',
    outline: 'none',
    resize: 'none',
    overflow: 'hidden',
    lineHeight: '22.4px',
    boxSizing: 'border-box',
    color: vars.color.black500,
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
  },
]);

export const commentTextareaSingleLine = style({
  paddingTop: '8.8px',
  paddingBottom: '8.8px',
});

const commentActionButton = style([
  typography.f14B,
  {
    display: 'flex',
    height: '40px',
    padding: '0 16px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
    flexShrink: 0,
    selectors: {
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.5,
      },
    },
  },
]);

export const commentSubmitButton = commentActionButton;
export const commentEditSubmitButton = commentActionButton;

export const commentList = style({
  marginTop: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
});

export const commentItem = style({
  padding: '20px 0',
  borderTop: `1px solid ${vars.color.line200}`,
});

export const commentBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
});

export const commentHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
});

export const commentAvatar = style({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  objectFit: 'cover',
  objectPosition: 'center',
  flexShrink: 0,
});

export const commentAvatarFallback = style({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: vars.color.gray200,
  flexShrink: 0,
});

export const commentMeta = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  flex: 1,
  minWidth: 0,
});

export const commentAuthorName = style([
  typography.f14EB,
  { color: vars.color.black500 },
]);

export const commentDate = style([
  typography.f12R,
  { color: vars.color.gray400 },
]);

export const commentBody = style({
  paddingLeft: '28px',
});

export const commentContent = style([
  typography.f14R,
  {
    whiteSpace: 'pre-wrap',
    color: vars.color.black400,
    lineHeight: '22.4px',
  },
]);

export const commentHeaderActions = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  flexShrink: 0,
});

export const commentHeaderAction = style([
  typography.f12R,
  {
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: vars.color.gray400,
  },
]);

export const commentLikeButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'default',
  color: vars.color.black300,
});

export const commentReplyDivider = style({
  marginTop: '12px',
  borderTop: `1px solid ${vars.color.line200}`,
});

export const commentReplyItem = style({
  marginLeft: '28px',
  paddingTop: '16px',
});


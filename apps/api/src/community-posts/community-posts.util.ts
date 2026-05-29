import sanitizeHtml from 'sanitize-html';

export const POST_MIN_LENGTH = 1;
export const POST_TITLE_MAX_LENGTH = 100;
export const POST_CONTENT_MAX_LENGTH = 1000;

const POST_CONTENT_ALLOWED_TAGS = [
  'p',
  'strong',
  'em',
  'u',
  'ul',
  'ol',
  'li',
  'br',
];

export function sanitizePostContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [...POST_CONTENT_ALLOWED_TAGS],
    allowedAttributes: {},
  });
}

export function getPostContentPlainTextLength(html: string): number {
  const plain = sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  });
  return plain.trim().length;
}

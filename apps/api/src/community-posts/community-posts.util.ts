import sanitizeHtml from 'sanitize-html';

import { POST_BANNED_WORDS } from '../common/constants/banned-words';

export const POST_MIN_LENGTH = 1;
export const COMMENT_MAX_LENGTH = 1000;
export const COMMENT_MIN_LENGTH = 1;

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

export function containsBannedWord(text: string): boolean {
  const plain = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
  const normalized = plain.replaceAll(/[^\p{L}\p{N}]/gu, '').toLowerCase();
  return POST_BANNED_WORDS.some((w) => normalized.includes(w.toLowerCase()));
}

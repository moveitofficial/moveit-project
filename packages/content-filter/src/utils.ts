import sanitizeHtml from 'sanitize-html';

import { POST_BANNED_WORDS } from './banned-words';

export function containsBannedWord(text: string): boolean {
  const plain = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
  const normalized = plain.replaceAll(/[^\p{L}\p{N}]/gu, '').toLowerCase();
  return POST_BANNED_WORDS.some((w) => normalized.includes(w.toLowerCase()));
}

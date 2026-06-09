import type { AdminFaq } from '@/mocks/types';

import { mockAdminFaqs } from '@/mocks/faqs';

export function getFaqs(): AdminFaq[] {
  return mockAdminFaqs;
}

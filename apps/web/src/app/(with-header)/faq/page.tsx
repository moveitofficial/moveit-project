import type { Metadata } from 'next';

import { getFaqs } from '@/feature/faq/api';
import { FaqView } from '@/feature/faq/components/FaqView';

export const metadata: Metadata = {
  title: 'FAQ | moveit',
};

export default async function FaqPage() {
  const response = await getFaqs().catch(() => null);
  const faqs = (response?.data.items ?? []).map((faq) => ({
    id: faq.id,
    question: faq.title,
    answer: faq.content,
  }));

  return <FaqView faqs={faqs} />;
}

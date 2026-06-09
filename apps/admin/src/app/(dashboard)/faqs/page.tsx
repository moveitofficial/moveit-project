import { getFaqs } from '@/features/faq/api';
import { FaqList } from '@/features/faq/FaqList';

export default function FaqsPage() {
  const faqs = getFaqs();

  return <FaqList faqs={faqs} />;
}

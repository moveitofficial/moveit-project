import { getFaqs } from '@/features/faq/api';
import { FaqList } from '@/features/faq/FaqList';

export default async function FaqsPage() {
  const res = await getFaqs(1);

  return (
    <FaqList
      initialItems={res.data.items}
      hasNext={res.data.pagination.hasNext}
    />
  );
}

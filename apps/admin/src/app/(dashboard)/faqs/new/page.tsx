import PageHeaderOverride from '@/components/layout/PageHeader/PageHeaderOverride';
import { FaqForm } from '@/features/faq/FaqForm';

export default function FaqNewPage() {
  return (
    <>
      <PageHeaderOverride
        breadcrumb={['화면 구성 관리', 'FAQ 관리', '등록']}
        title="FAQ 등록"
      />
      <FaqForm />
    </>
  );
}

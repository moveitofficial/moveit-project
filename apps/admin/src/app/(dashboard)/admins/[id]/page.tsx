import * as styles from './page.css';

import PageHeaderOverride from '@/components/layout/PageHeader/PageHeaderOverride';
import { AdminActivityList } from '@/features/admins/AdminActivityList';
import { AdminDetail } from '@/features/admins/AdminDetail';
import { getAdminDetail } from '@/features/admins/api';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: admin } = await getAdminDetail(id);

  return (
    <div className={styles.wrapper}>
      <PageHeaderOverride
        breadcrumb={['관리자 리스트']}
        title={`${admin.name} 관리자 상세`}
      />
      <AdminDetail id={id} />
      <AdminActivityList adminId={id} />
    </div>
  );
}

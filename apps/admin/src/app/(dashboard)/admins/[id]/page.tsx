import * as styles from './page.css';

import { AdminActivityList } from '@/features/admins/AdminActivityList';
import { AdminDetail } from '@/features/admins/AdminDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className={styles.wrapper}>
      <AdminDetail id={id} />
      <AdminActivityList adminId={id} />
    </div>
  );
}

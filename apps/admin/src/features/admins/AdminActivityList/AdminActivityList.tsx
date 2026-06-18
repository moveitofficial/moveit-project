import { typography } from '@repo/styles/typography';

import AdminActivityInfiniteList from './AdminActivityInfiniteList';
import * as styles from './AdminActivityList.css';

import { getAdminActivities } from '@/features/admins/api';

interface Props {
  adminId: string;
}

export default async function AdminActivityList({ adminId }: Props) {
  const { data } = await getAdminActivities(adminId, 1);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={`${typography.f16EB} ${styles.title}`}>최근 활동</h2>
        <p className={`${typography.f12R} ${styles.subtitle}`}>실시간 로그</p>
      </div>

      <AdminActivityInfiniteList
        adminId={adminId}
        initialItems={data.items}
        initialHasNext={data.pagination.hasNext}
      />
    </section>
  );
}

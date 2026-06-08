import { typography } from '@repo/styles/typography';

import * as styles from './AdminDetail.css';

import { getAdminDetail } from '@/features/admins/api';
import { ResetPasswordButton } from '@/features/admins/ResetPasswordButton';
import { getAdminSession } from '@/utils/session';

interface Props {
  id: string;
}

export default async function AdminDetail({ id }: Props) {
  const [{ data: admin }, session] = await Promise.all([
    getAdminDetail(id),
    getAdminSession(),
  ]);

  return (
    <section className={styles.infoCard}>
      <div className={styles.infoHeader}>
        <h2 className={`${typography.f18EB} ${styles.infoTitle}`}>기본정보</h2>
        <ResetPasswordButton adminId={admin.id} adminName={admin.name} isSuper={session?.isSuper ?? false} />
      </div>

      <div className={styles.infoFields}>
        <div className={styles.fieldGroup}>
          <span className={`${typography.f16B} ${styles.fieldLabel}`}>
            이메일
          </span>
          <span className={`${typography.f16R} ${styles.fieldValue}`}>
            {admin.email}
          </span>
        </div>
        <div className={styles.fieldGroup}>
          <span className={`${typography.f16B} ${styles.fieldLabel}`}>
            이름
          </span>
          <span className={`${typography.f16R} ${styles.fieldValue}`}>
            {admin.name}
          </span>
        </div>
      </div>
    </section>
  );
}

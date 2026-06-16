import { cookies } from 'next/headers';

import * as styles from './layout.css';

import { PageHeader } from '@/components/layout/PageHeader';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  ADMIN_PROFILE_COOKIE,
  parseAdminProfileCookie,
} from '@/features/login/adminProfileCookie';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const profile = parseAdminProfileCookie(
    cookieStore.get(ADMIN_PROFILE_COOKIE)?.value,
  );

  return (
    <div className={styles.wrapper}>
      <Sidebar initialProfile={profile} />
      <div className={styles.main}>
        <PageHeader />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

import * as styles from './layout.css';

import { PageHeader } from '@/components/layout/PageHeader';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.main}>
        <PageHeader />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

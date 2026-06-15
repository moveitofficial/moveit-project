import { MypageMenu } from '../MypageMenu';

import * as styles from './MypageLayout.css';

import type { User } from '@/mocks/types';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  user: User;
}

export default function MypageLayout({ children, user }: Props) {
  return (
    <div className={styles.page}>
      <MypageMenu user={user} />
      <main className={styles.content}>{children}</main>
    </div>
  );
}

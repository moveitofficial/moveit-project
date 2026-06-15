import headerLogo from '@public/header/headerLogo.svg';
import Image from 'next/image';
import Link from 'next/link';

import * as styles from './Header.css';
import HeaderNav from './HeaderNav';
import HeaderUserMenu from './HeaderUserMenu';

import type { Role } from '@/types/enums';

export default function Header({
  role,
  displayName,
}: {
  role: Role | null;
  displayName: string | null;
}) {
  return (
    <header className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.logoMenuGroup}>
          <Link href="/" aria-label="moveit 홈">
            <Image src={headerLogo} alt="moveit" className={styles.logo} />
          </Link>
          <HeaderNav />
        </div>
        <HeaderUserMenu role={role} displayName={displayName} />
      </div>
    </header>
  );
}

import headerLogo from '@public/header/headerLogo.svg';
import { typography } from '@repo/styles/typography';
import clsx from 'clsx';
import { type Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import * as styles from './Header.css';
import HeaderNav from './HeaderNav';

const userMenuItems: { label: string; href: Route }[] = [
  { label: '전문가 등록', href: '#' },
  { label: '로그인', href: '/login' },
];

export default function Header() {
  return (
    <header className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.logoMenuGroup}>
          <Link href="/" aria-label="moveit 홈">
            <Image src={headerLogo} alt="moveit" className={styles.logo} />
          </Link>
          <HeaderNav />
        </div>
        <div className={styles.userMenuGroup}>
          {userMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(typography.f16R, styles.navLink)}
            >
              {item.label}
            </Link>
          ))}
          <Link href="#" className={clsx(typography.f16B, styles.signUpButton)}>
            회원가입
          </Link>
        </div>
      </div>
    </header>
  );
}

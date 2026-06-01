'use client';

import headerLogo from '@public/header/headerLogo.svg';
import { typography } from '@repo/styles/typography';
import clsx from 'clsx';
import { type Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import * as styles from './Header.css';

const navItems: { label: string; href: Route }[] = [
  { label: 'IT코칭', href: '#' },
  { label: '프로젝트의뢰', href: '#' },
  { label: '자유게시판', href: '/community' },
  { label: 'FAQ', href: '#' },
];

const userMenuItems: { label: string; href: Route }[] = [
  { label: '전문가 등록', href: '#' },
  { label: '로그인', href: '#' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.logoMenuGroup}>
          <Link href="/" aria-label="moveit 홈">
            <Image src={headerLogo} alt="moveit" className={styles.logo} />
          </Link>
          <nav className={styles.navMenu}>
            {navItems.map((item) => {
              const isActive =
                item.href !== '#' &&
                (pathname === item.href ||
                  (item.href === '/community' &&
                    (pathname === '/community' ||
                      pathname.startsWith('/community/'))));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={clsx(
                    typography.f16R,
                    styles.navLink,
                    isActive && styles.navLinkActive,
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
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

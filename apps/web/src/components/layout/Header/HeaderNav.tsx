'use client';

import { typography } from '@repo/styles/typography';
import clsx from 'clsx';
import { type Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import * as styles from './Header.css';

function isNavItemActive(href: Route, pathname: string): boolean {
  if (href === '#') {
    return false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

const navItems: { label: string; href: Route }[] = [
  { label: 'IT코칭', href: '/it-coaching' },
  { label: '프로젝트의뢰', href: '/project-request' },
  { label: '자유게시판', href: '/community' },
  { label: 'FAQ', href: '#' },
];

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.navMenu}>
      {navItems.map((item) => {
        const isActive = isNavItemActive(item.href, pathname);

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
  );
}

'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getMypageMenuItems } from '../../constants';

import * as styles from './MypageMenu.css';

import type { Role } from '@/types/enums';

interface Props {
  role: Role;
}

function isMenuItemActive(pathname: string, href: string): boolean {
  if (href === '/mypage') {
    return pathname === '/mypage';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MypageMenu({ role }: Props) {
  const pathname = usePathname();
  const menuItems = getMypageMenuItems(role);

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>계정 설정</h2>
      <hr className={styles.sidebarDivider} />

      <nav aria-label="계정 설정 메뉴">
        <ul className={styles.menuList}>
          {menuItems.map((item) => {
            const isActive = isMenuItemActive(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={{ pathname: item.href }}
                  className={clsx(
                    styles.menuLink,
                    isActive && styles.menuLinkActive,
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

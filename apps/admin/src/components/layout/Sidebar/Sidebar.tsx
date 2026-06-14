'use client';

import { typography } from '@repo/styles/typography';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import * as styles from './Sidebar.css';

import { useAdminStore } from '@/stores/admin-store';

const menuGroups = [
  {
    title: '회원관리',
    items: [
      { label: '유저 리스트', href: '/users' },
      { label: '블랙리스트', href: '/blacklist' },
      { label: '탈퇴 유저', href: '/withdrawn' },
    ],
  },
  {
    title: '서비스 & 거래',
    items: [
      { label: '서비스 관리', href: '/services' },
      { label: '주문 내역', href: '/orders' },
      { label: '신고 내역', href: '/reports' },
      { label: '정산', href: '/settlements' },
      { label: '판매 통계', href: '/sales-stats' },
    ],
  },
  {
    title: '운영',
    items: [
      { label: 'cs 문의', href: '/cs' },
      { label: '관리자 리스트', href: '/admins' },
    ],
  },
  {
    title: '화면 구성 관리',
    items: [
      { label: '메인 세팅', href: '/main-setting' },
      { label: '카테고리 대표 서비스', href: '/category-services' },
      { label: 'FAQ 관리', href: '/faqs' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const admin = useAdminStore((s) => s.admin);

  return (
    <aside className={styles.wrapper}>
      <div className={styles.brand}>
        <Link href="/dashboard" className={clsx(typography.f16EB, styles.logo)}>
          moveit
        </Link>
        <p className={clsx(typography.f12R, styles.email)}>
          {admin && `${admin.name} · ${admin.email}`}
        </p>
      </div>
      <nav className={styles.menu}>
        {menuGroups.map((group) => (
          <div key={group.title} className={styles.group}>
            <p className={clsx(typography.f12EB, styles.groupTitle)}>
              {group.title}
            </p>
            <ul className={styles.itemList}>
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      typography.f16R,
                      styles.item,
                      pathname === item.href && styles.itemActive,
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

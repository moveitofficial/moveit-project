'use client';

import profileIcon from '@public/header/Profile.svg';
import { typography } from '@repo/styles/typography';
import clsx from 'clsx';
import { type Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import * as styles from './Header.css';
import { useDropdown } from './useDropdown';

import type { Role } from '@/types/enums';

import { signOut } from '@/feature/login/api';
import { useUserStore } from '@/stores/user-store';

const CLIENT_MENU: { label: string; href: Route }[] = [
  { label: '내정보', href: '/mypage' },
  { label: '메세지', href: '/service/message' },
  { label: '일정관리', href: '/mypage/schedule' },
];

const EXPERT_MENU: { label: string; href: Route }[] = [
  { label: '내정보', href: '/mypage' },
  { label: '메세지', href: '/service/message' },
  { label: '서비스 관리', href: '#' },
  { label: '일정관리', href: '/mypage/schedule' },
];

interface ProfileMenuProps {
  role: Role;
  displayName: string;
}

export default function ProfileMenu({ role, displayName }: ProfileMenuProps) {
  const router = useRouter();
  const { ref, open, setOpen } = useDropdown();

  async function handleLogout() {
    try {
      await signOut();
    } finally {
      // 로그아웃 후 항상 메인으로 이동하고, 서버 헤더를 비로그인 상태로 재렌더한다.
      useUserStore.getState().setUser(null);
      setOpen(false);
      router.replace('/');
      router.refresh();
    }
  }

  const menu = role === 'EXPERT' ? EXPERT_MENU : CLIENT_MENU;

  return (
    <div ref={ref} className={styles.profileMenu}>
      <button
        type="button"
        aria-label="프로필 메뉴"
        className={styles.profileButton}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        <Image src={profileIcon} alt="" className={styles.profileIcon} />
      </button>
      {open && (
        <div className={styles.dropdown}>
          <p className={clsx(typography.f16EB, styles.dropdownName)}>
            {displayName}
          </p>
          {menu.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                typography.f16R,
                styles.dropdownItem,
                index === menu.length - 1 && styles.dropdownItemLast,
              )}
              onClick={() => {
                setOpen(false);
              }}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            className={clsx(typography.f14R, styles.dropdownLogout)}
            onClick={() => {
              void handleLogout();
            }}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}

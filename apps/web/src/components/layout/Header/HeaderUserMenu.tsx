import { typography } from '@repo/styles/typography';
import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { type Route } from 'next';
import Link from 'next/link';

import * as styles from './Header.css';
import MessageMenu from './MessageMenu';
import NotificationMenu from './NotificationMenu';
import ProfileMenu from './ProfileMenu';

import type { Role } from '@/types/enums';

interface HeaderIconLinkProps {
  href: Route;
  label: string;
  hasBadge?: boolean;
  children: React.ReactNode;
}

function HeaderIconLink({
  href,
  label,
  hasBadge = false,
  children,
}: HeaderIconLinkProps) {
  return (
    <Link href={href} aria-label={label} className={styles.iconLink}>
      {children}
      {hasBadge && <span className={styles.badge} />}
    </Link>
  );
}

function GuestMenu() {
  return (
    <div className={styles.userMenuGroup}>
      <Link href="/login" className={clsx(typography.f16R, styles.navLink)}>
        로그인
      </Link>
      <Link
        href="/signup"
        className={clsx(typography.f16B, styles.signUpButton)}
      >
        회원가입
      </Link>
    </div>
  );
}

export default function HeaderUserMenu({
  role,
  displayName,
}: {
  role: Role | null;
  displayName: string | null;
}) {
  if (role === null) {
    return <GuestMenu />;
  }

  const isExpert = role === 'EXPERT';

  return (
    <div className={styles.userMenuGroup}>
      <Link
        href="/mypage/orders"
        className={clsx(typography.f16B, styles.navLink)}
      >
        {isExpert ? '판매관리' : '구매관리'}
      </Link>
      <MessageMenu role={role} />
      <NotificationMenu />
      {!isExpert && (
        <HeaderIconLink href="/favorites" label="찜 목록">
          <Heart size={24} />
        </HeaderIconLink>
      )}
      <ProfileMenu role={role} displayName={displayName ?? ''} />
    </div>
  );
}

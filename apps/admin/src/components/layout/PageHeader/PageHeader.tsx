'use client';

import { typography } from '@repo/styles/typography';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import * as styles from './PageHeader.css';

import { LogoutButton } from '@/features/login/LogoutButton';
import { usePageHeaderStore } from '@/stores/page-header-store';

const ROUTE_INFO: Record<string, { breadcrumb: string[]; title: string }> = {
  '/dashboard': { breadcrumb: ['대시보드'], title: '대시보드' },
  '/users': { breadcrumb: ['회원관리'], title: '유저 리스트' },
  '/blacklist': { breadcrumb: ['회원관리'], title: '블랙리스트' },
  '/withdrawn': { breadcrumb: ['회원관리'], title: '탈퇴 유저' },
  '/services': { breadcrumb: ['서비스 & 거래'], title: '서비스 관리' },
  '/orders': { breadcrumb: ['서비스 & 거래'], title: '주문 내역' },
  '/reports': { breadcrumb: ['서비스 & 거래'], title: '신고 내역' },
  '/settlements': { breadcrumb: ['서비스 & 거래'], title: '정산' },
  '/sales-stats': { breadcrumb: ['서비스 & 거래'], title: '판매 통계' },
  '/cs': { breadcrumb: ['운영'], title: 'cs 문의' },
  '/admins': { breadcrumb: ['운영'], title: '관리자 리스트' },
  '/main-setting': { breadcrumb: ['화면 구성 관리'], title: '메인 세팅' },
  '/category-services': {
    breadcrumb: ['화면 구성 관리'],
    title: '카테고리 대표 서비스',
  },
  '/faqs': { breadcrumb: ['화면 구성 관리'], title: 'FAQ 관리' },
};

export default function PageHeader() {
  const pathname = usePathname();
  const override = usePageHeaderStore((s) => s.override);
  const info = override ??
    ROUTE_INFO[pathname] ?? { breadcrumb: [], title: '' };

  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>
        <p className={clsx(typography.f12R, styles.breadcrumb)}>
          {info.breadcrumb.join(' > ')}
        </p>
        <h1 className={clsx(typography.f16EB, styles.title)}>{info.title}</h1>
      </div>
      <LogoutButton />
    </header>
  );
}

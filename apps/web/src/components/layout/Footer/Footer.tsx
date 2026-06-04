import footerLogo from '@public/header/headerLogo.svg';
import { typography } from '@repo/styles/typography';
import clsx from 'clsx';
import { type Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import * as styles from './Footer.css';

const footerMenu: { title: string; items: { label: string; href: Route }[] }[] = [
  {
    title: '서비스',
    items: [
      { label: 'IT코칭', href: '/it-coaching' },
      { label: '프로젝트 의뢰', href: '/project-request' },
      { label: '판매자 인증', href: '#' },
    ],
  },
  {
    title: '고객지원',
    items: [
      { label: 'FAQ', href: '#' },
      { label: '1:1문의', href: '#' },
    ],
  },
  {
    title: '약관 및 정책',
    items: [
      { label: '이용약관', href: '#' },
      { label: '개인정보처리방침', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <Image src={footerLogo} alt="moveit" />
            <p className={clsx(typography.f14R, styles.decText)}>
              검증된 IT 전문가 플랫폼 <br />
              멘토링부터 프로젝트까지
            </p>
          </div>
          <nav className={styles.menuColumns}>
            {footerMenu.map((column) => (
              <div key={column.title} className={styles.column}>
                <p className={typography.f16B}>{column.title}</p>
                <div className={styles.columnList}>
                  {column.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={clsx(typography.f14R, styles.columnLink)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
        <div className={styles.divider} />
        <p className={clsx(typography.f14R, styles.bottomInfo)}>
          (주) moveit | 대표이사 : 000 | 사업자등록번호 : 123-45-67890
          <br />
          서울특별시 00구 0000로 123, 5층 | 통신판매업신고 : 2024-서울00-0123
          <br />
          고객센터 : 1588 - 0000 | 이메일 : support@moveit.com
          <br />
          <br />© 2026 DevConnect Inc. All rights reserved
        </p>
      </div>
    </footer>
  );
}

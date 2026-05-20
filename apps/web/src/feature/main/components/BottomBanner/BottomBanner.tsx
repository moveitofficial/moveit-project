import { vars } from '@repo/styles/tokens';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import * as styles from './BottomBanner.css';

export default function BottomBanner() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.innerContainer}>
        <div className={styles.titleTextGroup}>
          <div className={styles.titleText}>
            나만의 재능으로 <br />{' '}
            <span className={styles.titleColor}>수익을 만드세요</span>
          </div>
          <div className={styles.desColor}>
            검증된 판매자로 등록하고 안전하게 IT 서비스를 판매하세요.
            <br />
            MoveIt이 당신의 성공을 도와드립니다.
          </div>
        </div>
        <Link href="/" className={styles.btn}>
          판매자 인증 신청
          <ChevronRight size={16} strokeWidth={3} color={vars.color.black500} />
        </Link>
      </div>
    </div>
  );
}

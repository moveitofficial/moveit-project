import { typography } from '@repo/styles/typography';

import * as styles from './page.css';

export default function Home() {
  return (
    <main className={styles.container}>
      <h1 className={`${typography.f40EB} ${styles.heading}`}>
        어드민 어드민IT 전문가와 함께, 원하는 목표를 시작하세요
      </h1>

      <h2 className={`${typography.f32B} ${styles.heading}`}>
        시험 텍스트를 입력해 보세요
      </h2>

      <p className={typography.f24R}>24px / Regular / 기본색</p>

      <p className={`${typography.f16R} ${styles.fontGroup}`}>
        16px / Regular / gray500 — fontGroup 스타일 적용
      </p>

      <p className={`${typography.f18B} ${styles.accent}`}>
        18px / Bold / blue300
      </p>

      <p className={`${typography.f14B} ${styles.danger}`}>
        14px / Bold / red200
      </p>

      <span className={typography.f12R}>12px / Regular</span>
      <span className={typography.f8R}>8px / Regular (가장 작은 사이즈)</span>
    </main>
  );
}

'use client';

import signupLogo from '@public/SignUp/signUpLogo.svg';
import Image from 'next/image';
import { type FormEvent, useState } from 'react';

import * as styles from './ExpertPortfolio.css';

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

export default function ExpertPortfolio() {
  const [portfolios] = useState<string[]>([]);

  const canSubmit = portfolios.length > 0;

  return (
    <section className={styles.Container}>
      <div className={styles.titleWrapper}>
        <Image src={signupLogo} alt="moveit" priority />
        <h1 className={styles.title}>
          전문가 신청을 위해
          <br />
          필수 정보를 작성해주세요
        </h1>
      </div>

      <p className={styles.sectionTitle}>포트폴리오 등록</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.emptyBox}>
          <p className={styles.emptyDesc}>
            포트폴리오를 등록하시면 승인후
            <br />
            프로필, 판매 중 서비스 페이지에 노출됩니다.
          </p>
          <button type="button" className={styles.addBtn}>
            포트폴리오 등록하기
          </button>
        </div>

        <div className={styles.submitArea}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!canSubmit}
          >
            전문가 승인신청
          </button>
          <p className={styles.skipDesc}>
            전문가 승인 신청을 눌러야지만
            <br />
            전문가 승인이 가능합니다.
          </p>
          <button type="button" className={styles.skipBtn}>
            건너뛰기
          </button>
        </div>
      </form>
    </section>
  );
}

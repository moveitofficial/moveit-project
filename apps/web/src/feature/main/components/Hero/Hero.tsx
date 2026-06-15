import maintopImg from '@public/main/maintopImg.svg';
import starFill from '@public/main/starFill.svg';
import Image from 'next/image';

import * as styles from './Hero.css';
import HeroSearchForm from './HeroSearchForm';

const heroStats = [
  { icon: starFill, value: '4.9', label: '평균 만족도' },
  { icon: null, value: '15,234', label: '완료된 프로젝트' },
  { icon: null, value: '98%', label: '성공률' },
];

export default function Hero() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.searchContainer}>
        <div className={styles.titleGroup}>
          <div className={styles.titleText}>
            IT 전문가와 함께,
            <br />
            <span className={styles.titleBlack}>원하는 목표를 시작하세요</span>
          </div>
          <div className={styles.decText}>
            검증된 IT 전문가의 코칭과 프로젝트 제작 서비스를 만나보세요.
            <br />
            당신의 성장을 위한 최고의 파트너를 찾아드립니다.
          </div>
        </div>
        <HeroSearchForm />
        <div className={styles.webDataGroup}>
          {heroStats.map(({ icon, value, label }) => (
            <div key={label}>
              <div className={styles.dataItem}>
                {icon && <Image src={icon} alt="" />}
                <div>{value}</div>
              </div>
              <div className={styles.dataGroupDecText}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.imageContainer}>
        <Image src={maintopImg} alt="HeroImage" />
      </div>
    </section>
  );
}

import googleLogo from '@public/login/googleLogo.svg';
import kakaoLogo from '@public/login/kaLogo.svg';
import naverLogo from '@public/login/naver.svg';
import Image from 'next/image';

import * as styles from './SnsLogin.css';

const snsProviders = [
  { name: 'Google', src: googleLogo, alt: 'Google 로그인' },
  { name: 'Kakao', src: kakaoLogo, alt: 'Kakao 로그인' },
  { name: 'Naver', src: naverLogo, alt: 'Naver 로그인' },
];

export default function SnsLogin() {
  return (
    <ul className={styles.SnsList}>
      {snsProviders.map((provider) => (
        <li key={provider.name}>
          <button type="button" className={styles.SnsButton}>
            <Image
              src={provider.src}
              alt={provider.alt}
              width={54}
              height={54}
            />
          </button>
        </li>
      ))}
    </ul>
  );
}

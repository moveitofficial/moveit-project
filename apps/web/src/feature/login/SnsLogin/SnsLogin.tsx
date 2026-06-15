import googleLogo from '@public/login/googleLogo.svg';
import kakaoLogo from '@public/login/kaLogo.svg';
import naverLogo from '@public/login/naver.svg';
import Image from 'next/image';

import * as styles from './SnsLogin.css';

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

const snsProviders = [
  { path: 'google', src: googleLogo, alt: 'Google 로그인' },
  { path: 'kakao', src: kakaoLogo, alt: 'Kakao 로그인' },
  { path: 'naver', src: naverLogo, alt: 'Naver 로그인' },
] as const;

export default function SnsLogin() {
  return (
    <ul className={styles.SnsList}>
      {snsProviders.map((provider) => (
        <li key={provider.path}>
          <a
            href={`${BASE_URL}/auth/${provider.path}`}
            className={styles.SnsButton}
          >
            <Image
              src={provider.src}
              alt={provider.alt}
              width={54}
              height={54}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

import LoginLogo from '@public/login/loginLogo.svg';
import Image from 'next/image';
import Link from 'next/link';

import * as styles from './LoginCmponents.css';
import LoginForm from './LoginForm/LoginForm';
import SnsLogin from './SnsLogin/SnsLogin';

export default function LoginComponents() {
  return (
    <section className={styles.LoginContainer}>
      <div className={styles.LoginLogoWrapper}>
        <Link href="/">
          <Image src={LoginLogo} alt="moveit" priority />
        </Link>
        <h1 className={styles.LoginText}>다시만나서 반가워요</h1>
      </div>

      <LoginForm />

      <p className={styles.SignUpHint}>
        아직 무빗 회원이 아니신가요?{' '}
        <Link href="/signup" className={styles.SignUpLink}>
          이메일로 회원가입하기
        </Link>
      </p>

      <div className={styles.SnsWrapper}>
        <p className={styles.SnsTitle}>SNS 계정으로 시작하세요</p>
        <SnsLogin />
      </div>
    </section>
  );
}

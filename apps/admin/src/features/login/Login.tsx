import adminLogo from '@public/mainLogo.svg';
import Image from 'next/image';

import * as styles from './Login.css';
import LoginForm from './loginForm/LoginForm';

export default function Login() {
  return (
    <section className={styles.LoginInnerWrapper}>
      <div className={styles.TitleContentsWrapper}>
        <Image src={adminLogo} alt="어드민로고" priority />
        <div className={styles.TitleContents}>관리자 페이지</div>
      </div>
      <LoginForm />
    </section>
  );
}

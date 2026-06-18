import * as styles from './page.css';

import LoginComponents from '@/feature/login/LoginCmponents';

export default function LoginPage() {
  return (
    <main className={styles.LoginContainer}>
      <LoginComponents />
    </main>
  );
}

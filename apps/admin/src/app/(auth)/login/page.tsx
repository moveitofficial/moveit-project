import * as styles from './page.css';

import Login from '@/features/login/Login';

export default function LoginPage() {
  return (
    <main className={styles.LoginContainer}>
      <Login />
    </main>
  );
}

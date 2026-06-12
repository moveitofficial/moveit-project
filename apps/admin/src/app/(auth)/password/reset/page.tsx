import * as styles from './page.css';

import PasswordReset from '@/features/passwordReset/PasswordReset';

export default function ResetPasswordPage() {
  return (
    <main className={styles.PasswordResetContainer}>
      <PasswordReset />
    </main>
  );
}

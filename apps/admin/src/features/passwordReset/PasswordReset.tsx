import adminLogo from '@public/mainLogo.svg';
import Image from 'next/image';

import * as styles from './PasswordReset.css';
import PasswordResetForm from './PasswordResetForm/PasswordResetForm';

export default function PasswordReset() {
  return (
    <section className={styles.PasswordResetInnerWrapper}>
      <div className={styles.TitleContentsWrapper}>
        <Image src={adminLogo} alt="어드민로고" priority />
        <div className={styles.TitleContents}>비밀번호를 변경해 주세요</div>
      </div>
      <PasswordResetForm />
    </section>
  );
}

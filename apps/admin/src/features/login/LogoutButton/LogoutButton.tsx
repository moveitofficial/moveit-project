'use client';

import { useAdminSignOut } from '../useAdminSignOut';

import * as styles from './LogoutButton.css';

export default function LogoutButton() {
  const signOut = useAdminSignOut();

  return (
    <button
      type="button"
      className={styles.button}
      disabled={signOut.isPending}
      onClick={() => {
        signOut.mutate();
      }}
    >
      로그아웃
    </button>
  );
}

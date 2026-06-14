import clsx from 'clsx';

import * as styles from './AuthContainer.css';

import type { ReactNode } from 'react';

interface AuthContainerProps {
  children: ReactNode;
  className?: string;
}

export default function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className={clsx(styles.wrapper)}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}

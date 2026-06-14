import clsx from 'clsx';

import * as styles from './CreateContainer.css';

import type { ReactNode } from 'react';

interface CreateContainerProps {
  children: ReactNode;
  className?: string;
}

export default function CreateContainer({ children }: CreateContainerProps) {
  return (
    <div className={clsx(styles.wrapper)}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}

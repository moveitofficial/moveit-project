import clsx from 'clsx';

import * as styles from './Container.css';

import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}

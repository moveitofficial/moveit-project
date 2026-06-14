import signupLogo from '@public/SignUp/signUpLogo.svg';
import Image from 'next/image';

import * as styles from './FormHeader.css';

import type { ReactNode } from 'react';

interface Props {
  title: ReactNode;
  align?: 'center' | 'left';
}

export default function FormHeader({ title, align = 'center' }: Props) {
  const isLeft = align === 'left';
  return (
    <div className={isLeft ? styles.wrapperLeft : styles.wrapperCenter}>
      <Image src={signupLogo} alt="moveit" priority />
      <h1 className={isLeft ? styles.titleLeft : styles.titleCenter}>
        {title}
      </h1>
    </div>
  );
}

import * as styles from './FormFooter.css';

import type { ReactNode } from 'react';


interface Props {
  submitLabel: string;
  disabled: boolean;
  skipDesc: ReactNode;
  onSkip?: () => void;
  skipLabel?: string;
}

export default function FormFooter({
  submitLabel,
  disabled,
  skipDesc,
  onSkip,
  skipLabel = '건너뛰기',
}: Props) {
  return (
    <div className={styles.wrapper}>
      <button type="submit" className={styles.submitBtn} disabled={disabled}>
        {submitLabel}
      </button>
      <p className={styles.skipDesc}>{skipDesc}</p>
      <button type="button" onClick={onSkip} className={styles.skipBtn}>
        {skipLabel}
      </button>
    </div>
  );
}

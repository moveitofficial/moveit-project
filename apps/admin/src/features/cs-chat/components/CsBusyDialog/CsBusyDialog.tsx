'use client';

import { BUSY_CONFIRM, BUSY_DESC, BUSY_TITLE } from '../../constants';

import * as styles from './CsBusyDialog.css';

export default function CsBusyDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card} role="dialog" aria-modal="true">
        <div className={styles.texts}>
          <p className={styles.title}>{BUSY_TITLE}</p>
          <p className={styles.desc}>{BUSY_DESC}</p>
        </div>
        <button type="button" className={styles.confirm} onClick={onConfirm}>
          {BUSY_CONFIRM}
        </button>
      </div>
    </div>
  );
}

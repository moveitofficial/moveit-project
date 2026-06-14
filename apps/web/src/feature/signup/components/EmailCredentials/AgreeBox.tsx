'use client';

import { Check } from 'lucide-react';

import * as styles from './AgreeBox.css';
import { AGREEMENT_ITEMS, type AgreementKey, type Agreements } from './constants';

interface Props {
  agreements: Agreements;
  allAgreed: boolean;
  onToggle: (key: AgreementKey) => void;
  onToggleAll: () => void;
}

export default function AgreeBox({
  agreements,
  allAgreed,
  onToggle,
  onToggleAll,
}: Props) {
  return (
    <div className={styles.agreeBox}>
      <button type="button" onClick={onToggleAll} className={styles.agreeRow}>
        <span className={allAgreed ? styles.checkboxChecked : styles.checkbox}>
          {allAgreed && <Check size={12} strokeWidth={3} color="white" />}
        </span>
        <span className={styles.agreeAllText}>모두 동의합니다.</span>
      </button>

      <div className={styles.divider} />

      <p className={styles.agreeDesc}>
        회원 가입 및 회원 관리 등의 목적으로 이메일, 비밀번호, 휴대폰 번호 등의
        정보를 <span className={styles.agreeUnderline}>수집 및 이용</span>
        하고 있습니다.
      </p>

      {AGREEMENT_ITEMS.map(({ key, linkText, suffix }) => (
        <button
          key={key}
          type="button"
          onClick={() => {
            onToggle(key);
          }}
          className={styles.agreeRow}
        >
          <span
            className={
              agreements[key] ? styles.checkboxChecked : styles.checkbox
            }
          >
            {agreements[key] && <Check size={12} strokeWidth={3} color="white" />}
          </span>
          <span className={styles.agreeItemText}>
            {linkText !== null && (
              <span className={styles.agreeUnderline}>{linkText}</span>
            )}
            {suffix}
          </span>
        </button>
      ))}
    </div>
  );
}

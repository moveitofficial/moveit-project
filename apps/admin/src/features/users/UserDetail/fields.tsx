import googleIcon from '@public/google.svg';
import googleMonoIcon from '@public/google_mono.svg';
import kakaoIcon from '@public/kakao.svg';
import kakaoMonoIcon from '@public/kakao_mono.svg';
import naverIcon from '@public/naver.svg';
import naverMonoIcon from '@public/naver_mono.svg';
import { typography } from '@repo/styles/typography';
import Image from 'next/image';

import * as styles from './UserDetail.css';

import type { Provider } from '@/types/enums';

const SOCIAL_PROVIDERS = [
  {
    provider: 'NAVER' as const,
    label: '네이버',
    color: naverIcon,
    mono: naverMonoIcon,
  },
  {
    provider: 'KAKAO' as const,
    label: '카카오',
    color: kakaoIcon,
    mono: kakaoMonoIcon,
  },
  {
    provider: 'GOOGLE' as const,
    label: '구글',
    color: googleIcon,
    mono: googleMonoIcon,
  },
];

export function Field({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className={styles.field}>
      <span className={`${typography.f16B} ${styles.fieldLabel}`}>{label}</span>
      <div className={`${typography.f16R} ${styles.fieldValue}`}>
        {value ?? '-'}
      </div>
    </div>
  );
}

export function SplitField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <span className={`${typography.f16B} ${styles.fieldLabel}`}>{label}</span>
      {children}
    </div>
  );
}

export function ContactTimeField({
  start,
  end,
}: {
  start: string | null | undefined;
  end: string | null | undefined;
}) {
  return (
    <SplitField label="연락 가능 시간">
      <div className={styles.splitFieldRow}>
        <div className={`${typography.f16R} ${styles.splitFieldValue}`}>
          {start ?? '-'}
        </div>
        <span className={`${typography.f16B} ${styles.rangeSeparator}`}>~</span>
        <div className={`${typography.f16R} ${styles.splitFieldValue}`}>
          {end ?? '-'}
        </div>
      </div>
    </SplitField>
  );
}

export function EmployeeCountField({
  min,
  max,
}: {
  min: number | null | undefined;
  max: number | null | undefined;
}) {
  return (
    <SplitField label="인원 수">
      <div className={styles.splitFieldRow}>
        <div
          className={`${typography.f16R} ${styles.splitFieldValueWithSuffix}`}
        >
          <span>{min ?? '-'}</span>
          <span>이상</span>
        </div>
        <span className={`${typography.f16B} ${styles.rangeSeparator}`}>~</span>
        <div
          className={`${typography.f16R} ${styles.splitFieldValueWithSuffix}`}
        >
          <span>{max ?? '-'}</span>
          <span>미만</span>
        </div>
      </div>
    </SplitField>
  );
}

export function TagPills({
  items,
  getLabel,
}: {
  items: string[];
  getLabel?: (item: string) => string;
}) {
  const resolveLabel = getLabel ?? ((item: string) => item);

  if (items.length === 0) {
    return <span className={`${typography.f16R} ${styles.emptyText}`}>-</span>;
  }

  return (
    <div className={styles.specialtyPills}>
      {items.map((item) => (
        <span
          key={item}
          className={`${typography.f16R} ${styles.specialtyPill}`}
        >
          {resolveLabel(item)}
        </span>
      ))}
    </div>
  );
}

export function LinkedAccounts({ provider }: { provider: Provider }) {
  return (
    <div className={styles.providerIcons}>
      {SOCIAL_PROVIDERS.map(
        ({ provider: socialProvider, label, color, mono }) => {
          const isActive = provider === socialProvider;

          return (
            <Image
              key={socialProvider}
              src={isActive ? color : mono}
              alt={label}
              width={40}
              height={40}
              className={
                isActive
                  ? styles.providerIconImage
                  : `${styles.providerIconImage} ${styles.providerIconInactive}`
              }
            />
          );
        },
      )}
    </div>
  );
}

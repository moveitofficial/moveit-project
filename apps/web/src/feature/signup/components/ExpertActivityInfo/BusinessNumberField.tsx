'use client';

import { type ChangeEvent } from 'react';

import * as styles from './BusinessNumberField.css';
import { BUSINESS_NUMBER_LENGTH } from './constants';

interface Props {
  value: string;
  onChange: (digits: string) => void;
  inputClassName: string;
}

export default function BusinessNumberField({
  value,
  onChange,
  inputClassName,
}: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value
      .replaceAll(/\D/g, '')
      .slice(0, BUSINESS_NUMBER_LENGTH);
    onChange(digits);
  };

  const formatError =
    value.length > 0 && value.length < BUSINESS_NUMBER_LENGTH
      ? '형식의 맞지 않는 번호입니다'
      : null;

  return (
    <div className={styles.wrapper}>
      <input
        id="businessNumber"
        type="text"
        name="businessNumber"
        placeholder="사업자 번호를 입력해주세요(숫자만 입력해주세요)"
        value={value}
        onChange={handleChange}
        className={inputClassName}
      />
      {formatError !== null && <p className={styles.error}>{formatError}</p>}
    </div>
  );
}

'use client';

import { type ChangeEvent } from 'react';

const MAX_PHONE_DIGITS = 11;

const formatPhone = (digits: string): string => {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 7)}.${digits.slice(7, 11)}`;
};

interface Props {
  value: string;
  onChange: (digits: string) => void;
  className: string;
}

export default function PhoneField({ value, onChange, className }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value
      .replaceAll(/\D/g, '')
      .slice(0, MAX_PHONE_DIGITS);
    onChange(digits);
  };

  return (
    <input
      id="phone"
      type="tel"
      name="phone"
      placeholder="연락 가능 번호를 입력해주세요(숫자만 입력해주세요)"
      value={formatPhone(value)}
      onChange={handleChange}
      className={className}
    />
  );
}

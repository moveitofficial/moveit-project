export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;

export type AgreementKey = 'age' | 'terms' | 'privacy' | 'marketing';
export type Agreements = Record<AgreementKey, boolean>;

export const AGREEMENT_ITEMS: {
  key: AgreementKey;
  linkText: string | null;
  suffix: string;
}[] = [
  { key: 'age', linkText: null, suffix: '만 14세 이상입니다.' },
  { key: 'terms', linkText: '서비스 이용약관', suffix: '에 동의합니다.' },
  {
    key: 'privacy',
    linkText: '개인정보 수집 이용',
    suffix: '에 동의합니다. (선택)',
  },
  {
    key: 'marketing',
    linkText: '마케팅 수신 홍보목적의 개인정보 수집 및 이용',
    suffix: '에 동의합니다. (선택)',
  },
];

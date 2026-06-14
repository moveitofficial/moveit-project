'use client';

import { type ChangeEvent, type FormEvent, useState } from 'react';

import CheckboxGroup from '../common/CheckboxGroup';
import Dropdown from '../common/Dropdown';
import FormFooter from '../common/FormFooter';
import FormHeader from '../common/FormHeader';
import PhoneField from '../common/PhoneField';
import { REGIONS } from '../common/regions';

import * as styles from './ClientInfo.css';
import {
  DETAIL_AREAS_BY_INTEREST,
  INTEREST_AREAS,
  MAX_DETAIL_AREAS,
  type InterestAreaId,
} from './constants';

interface FormState {
  nickname: string;
  interestArea: InterestAreaId | '';
  detailAreas: string[];
  region: string;
  bankName: string;
  accountNumber: string;
  phone: string;
}

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

export default function ClientInfo() {
  const [form, setForm] = useState<FormState>({
    nickname: '',
    interestArea: '',
    detailAreas: [],
    region: '',
    bankName: '',
    accountNumber: '',
    phone: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (id: string) => {
    setForm((prev) => ({
      ...prev,
      interestArea: id as InterestAreaId,
      detailAreas: [],
    }));
  };

  const handleRegionChange = (id: string) => {
    setForm((prev) => ({ ...prev, region: id }));
  };

  const handleAccountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replaceAll(/\D/g, '');
    setForm((prev) => ({ ...prev, accountNumber: digits }));
  };

  const handlePhoneChange = (digits: string) => {
    setForm((prev) => ({ ...prev, phone: digits }));
  };

  const handleDetailAreasChange = (next: string[]) => {
    setForm((prev) => ({ ...prev, detailAreas: next }));
  };

  const detailOptions =
    form.interestArea === ''
      ? null
      : DETAIL_AREAS_BY_INTEREST[form.interestArea];

  const canSubmit =
    form.nickname.trim() !== '' &&
    form.interestArea !== '' &&
    form.detailAreas.length > 0 &&
    form.region !== '' &&
    form.bankName.trim() !== '' &&
    form.accountNumber !== '' &&
    form.phone !== '';

  return (
    <section className={styles.Container}>
      <FormHeader
        title={
          <>
            회원 정보를 입력해 주시면, 더 정확한
            <br />
            맞춤 추천을 받아보실 수 있습니다.
          </>
        }
      />

      <p className={styles.sectionTitle}>회원정보</p>

      <form className={styles.formBox} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="nickname" className={styles.label}>
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            name="nickname"
            placeholder="닉네임을 입력해주세요"
            value={form.nickname}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>관심 분야</span>
          <Dropdown
            options={INTEREST_AREAS}
            value={form.interestArea}
            onChange={handleInterestChange}
            placeholder="관심분야를 선택해주세요"
          />
        </div>

        {detailOptions !== null && (
          <div className={styles.field}>
            <span className={styles.label}>상세 분야</span>
            <CheckboxGroup
              options={detailOptions}
              selected={form.detailAreas}
              onChange={handleDetailAreasChange}
              max={MAX_DETAIL_AREAS}
            />
          </div>
        )}

        <div className={styles.field}>
          <span className={styles.label}>지역을 선택해 주세요</span>
          <Dropdown
            options={REGIONS}
            value={form.region}
            onChange={handleRegionChange}
            placeholder="지역을 선택해주세요"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="bankName" className={styles.label}>
            환불받을 은행명
          </label>
          <input
            id="bankName"
            type="text"
            name="bankName"
            placeholder="은행명을 입력해주세요"
            value={form.bankName}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="accountNumber" className={styles.label}>
            환불받을 입금계좌
          </label>
          <input
            id="accountNumber"
            type="text"
            name="accountNumber"
            placeholder="계좌번호를 입력해주세요"
            value={form.accountNumber}
            onChange={handleAccountChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="phone" className={styles.label}>
            연락처
          </label>
          <PhoneField
            value={form.phone}
            onChange={handlePhoneChange}
            className={styles.input}
          />
        </div>

        <FormFooter
          submitLabel="다음"
          disabled={!canSubmit}
          skipDesc={
            <>
              회원정보는
              <br />
              추후 myPage에서 작성 가능합니다.
            </>
          }
        />
      </form>
    </section>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { type ChangeEvent, type FormEvent, useState } from 'react';

import { useExpertSignupStore } from '../../expertSignupStore';
import { useBlockBack } from '../../useBlockBack';
import Dropdown from '../common/Dropdown';
import FormFooter from '../common/FormFooter';
import FormHeader from '../common/FormHeader';
import PhoneField from '../common/PhoneField';
import { REGIONS } from '../common/regions';

import BusinessNumberField from './BusinessNumberField';
import { BUSINESS_NUMBER_LENGTH, TIME_OPTIONS } from './constants';
import * as styles from './ExpertActivityInfo.css';



interface FormState {
  businessName: string;
  businessNumber: string;
  phone: string;
  ceoName: string;
  bankName: string;
  bankAccount: string;
  contactTimeStart: string;
  contactTimeEnd: string;
  region: string;
}

export default function ExpertActivityInfo() {
  useBlockBack();
  const router = useRouter();
  const setActivity = useExpertSignupStore((s) => s.setActivity);

  const [form, setForm] = useState<FormState>({
    businessName: '',
    businessNumber: '',
    phone: '',
    ceoName: '',
    bankName: '',
    bankAccount: '',
    contactTimeStart: '',
    contactTimeEnd: '',
    region: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replaceAll(/\D/g, '');
    setForm((prev) => ({ ...prev, bankAccount: digits }));
  };

  const handleBusinessNumberChange = (digits: string) => {
    setForm((prev) => ({ ...prev, businessNumber: digits }));
  };

  const handlePhoneChange = (digits: string) => {
    setForm((prev) => ({ ...prev, phone: digits }));
  };

  const handleTimeStartChange = (id: string) => {
    setForm((prev) => {
      const startIdx = TIME_OPTIONS.findIndex((o) => o.id === id);
      const endIdx = TIME_OPTIONS.findIndex(
        (o) => o.id === prev.contactTimeEnd,
      );
      const shouldResetEnd = endIdx !== -1 && endIdx <= startIdx;
      return {
        ...prev,
        contactTimeStart: id,
        contactTimeEnd: shouldResetEnd ? '' : prev.contactTimeEnd,
      };
    });
  };

  const handleTimeEndChange = (id: string) => {
    setForm((prev) => ({ ...prev, contactTimeEnd: id }));
  };

  const handleRegionChange = (id: string) => {
    setForm((prev) => ({ ...prev, region: id }));
  };

  const startIdx = TIME_OPTIONS.findIndex(
    (o) => o.id === form.contactTimeStart,
  );
  const endDisabledIds =
    startIdx === -1 ? [] : TIME_OPTIONS.slice(0, startIdx + 1).map((o) => o.id);

  const canSubmit =
    form.businessName.trim() !== '' &&
    form.businessNumber.length === BUSINESS_NUMBER_LENGTH &&
    form.phone !== '' &&
    form.ceoName.trim() !== '' &&
    form.bankName.trim() !== '' &&
    form.bankAccount !== '' &&
    form.contactTimeStart !== '' &&
    form.contactTimeEnd !== '' &&
    form.region !== '';

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    setActivity(form); // 서버 저장 X, state에만 보관
    router.push('/signup/expert/company-info');
  };

  return (
    <section className={styles.Container}>
      <FormHeader
        title={
          <>
            전문가 신청을 위해
            <br />
            필수 정보를 작성해주세요
          </>
        }
      />

      <p className={styles.sectionTitle}>활동 정보</p>

      <form className={styles.formBox} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="businessName" className={styles.label}>
            회사명
          </label>
          <input
            id="businessName"
            type="text"
            name="businessName"
            placeholder="회사명을 입력해주세요"
            value={form.businessName}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="businessNumber" className={styles.label}>
            사업자 번호
          </label>
          <BusinessNumberField
            value={form.businessNumber}
            onChange={handleBusinessNumberChange}
            inputClassName={styles.input}
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

        <div className={styles.field}>
          <label htmlFor="ceoName" className={styles.label}>
            대표자 명
          </label>
          <input
            id="ceoName"
            type="text"
            name="ceoName"
            placeholder="대표자명을 입력해주세요"
            value={form.ceoName}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="bankName" className={styles.label}>
            은행명
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
          <label htmlFor="bankAccount" className={styles.label}>
            입금계좌
          </label>
          <input
            id="bankAccount"
            type="text"
            name="bankAccount"
            placeholder="계좌번호를 입력해주세요"
            value={form.bankAccount}
            onChange={handleAccountChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>연락 가능한 시간을 설정해주세요</span>
          <div className={styles.timeRange}>
            <div className={styles.timeSlot}>
              <Dropdown
                options={TIME_OPTIONS}
                value={form.contactTimeStart}
                onChange={handleTimeStartChange}
                placeholder="시작 시간"
              />
            </div>
            <span className={styles.timeSeparator}>~</span>
            <div className={styles.timeSlot}>
              <Dropdown
                options={TIME_OPTIONS}
                value={form.contactTimeEnd}
                onChange={handleTimeEndChange}
                placeholder="종료 시간"
                disabledIds={endDisabledIds}
              />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>지역을 선택해 주세요</span>
          <Dropdown
            options={REGIONS}
            value={form.region}
            onChange={handleRegionChange}
            placeholder="지역을 선택해주세요"
          />
        </div>

        <FormFooter
          submitLabel="다음"
          disabled={!canSubmit}
          onSkip={() => {
            router.push('/signup/expert/company-info');
          }}
          skipDesc={
            <>
              필수 정보를 입력해야 서비스 등록이 가능합니다.
              <br />
              추후 myPage에서 작성 가능합니다.
            </>
          }
        />
      </form>
    </section>
  );
}

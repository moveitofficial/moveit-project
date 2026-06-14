'use client';

import { type ChangeEvent, type FormEvent, useState } from 'react';

import CheckboxGroup from '../common/CheckboxGroup';
import Dropdown from '../common/Dropdown';
import FormFooter from '../common/FormFooter';
import FormHeader from '../common/FormHeader';
import { SERVICE_CATEGORIES_BY_GROUP } from '../common/serviceCategories';
import { SERVICE_GROUPS, type ServiceGroupId } from '../common/serviceGroups';
import { TECH_STACKS } from '../common/techStacks';

import {
  FOUNDED_YEAR_MONTH_LENGTH,
  MAX_SPECIALTY_CATEGORIES,
  MAX_TECH_STACKS,
} from './constants';
import * as styles from './ExpertCompanyInfo.css';

interface FormState {
  foundedYearMonth: string;
  employeeMin: string;
  employeeMax: string;
  description: string;
  specialtyGroup: ServiceGroupId | '';
  specialtyCategories: string[];
  techStacks: string[];
}

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const formatYearMonth = (digits: string): string => {
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}`;
};

export default function ExpertCompanyInfo() {
  const [form, setForm] = useState<FormState>({
    foundedYearMonth: '',
    employeeMin: '',
    employeeMax: '',
    description: '',
    specialtyGroup: '',
    specialtyCategories: [],
    techStacks: [],
  });

  const handleFoundedYearMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value
      .replaceAll(/\D/g, '')
      .slice(0, FOUNDED_YEAR_MONTH_LENGTH);
    setForm((prev) => ({ ...prev, foundedYearMonth: digits }));
  };

  const handleEmployeeMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replaceAll(/\D/g, '');
    setForm((prev) => ({ ...prev, employeeMin: digits }));
  };

  const handleEmployeeMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replaceAll(/\D/g, '');
    setForm((prev) => ({ ...prev, employeeMax: digits }));
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleSpecialtyGroupChange = (id: string) => {
    setForm((prev) => ({
      ...prev,
      specialtyGroup: id as ServiceGroupId,
      specialtyCategories: [],
    }));
  };

  const handleSpecialtyCategoriesChange = (next: string[]) => {
    setForm((prev) => ({ ...prev, specialtyCategories: next }));
  };

  const handleTechStacksChange = (next: string[]) => {
    setForm((prev) => ({ ...prev, techStacks: next }));
  };

  const canSubmit =
    form.foundedYearMonth.length === FOUNDED_YEAR_MONTH_LENGTH &&
    form.employeeMin !== '' &&
    form.employeeMax !== '' &&
    form.description.trim() !== '' &&
    form.specialtyGroup !== '' &&
    form.specialtyCategories.length > 0 &&
    form.techStacks.length > 0;

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

      <p className={styles.sectionTitle}>회사 정보</p>

      <form className={styles.formBox} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="foundedYearMonth" className={styles.label}>
            설립연도
          </label>
          <input
            id="foundedYearMonth"
            type="text"
            name="foundedYearMonth"
            placeholder="설립 년월을 입력해주세요 (예: 2025.05)"
            value={formatYearMonth(form.foundedYearMonth)}
            onChange={handleFoundedYearMonthChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>인원 수</span>
          <div className={styles.employeeRange}>
            <div className={styles.employeeRangeSlot}>
              <div className={styles.employeeInputWrapper}>
                <input
                  type="text"
                  name="employeeMin"
                  placeholder="숫자만 입력해주세요"
                  value={form.employeeMin}
                  onChange={handleEmployeeMinChange}
                  className={styles.employeeInput}
                />
                <span className={styles.employeeSuffix}>이상</span>
              </div>
            </div>
            <span className={styles.employeeRangeSeparator}>~</span>
            <div className={styles.employeeRangeSlot}>
              <div className={styles.employeeInputWrapper}>
                <input
                  type="text"
                  name="employeeMax"
                  placeholder="숫자만 입력해주세요"
                  value={form.employeeMax}
                  onChange={handleEmployeeMaxChange}
                  className={styles.employeeInput}
                />
                <span className={styles.employeeSuffix}>미만</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="description" className={styles.label}>
            소개
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="전문가님의 대해서 소개해주세요"
            value={form.description}
            onChange={handleDescriptionChange}
            className={styles.textarea}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>전문분야</span>
          <Dropdown
            options={SERVICE_GROUPS}
            value={form.specialtyGroup}
            onChange={handleSpecialtyGroupChange}
            placeholder="전문 분야를 선택해주세요"
          />
        </div>

        {form.specialtyGroup !== '' && (
          <div className={styles.field}>
            <span className={styles.label}>상세분야</span>
            <CheckboxGroup
              options={SERVICE_CATEGORIES_BY_GROUP[form.specialtyGroup]}
              selected={form.specialtyCategories}
              onChange={handleSpecialtyCategoriesChange}
              max={MAX_SPECIALTY_CATEGORIES}
              showChips
            />
          </div>
        )}

        <div className={styles.field}>
          <span className={styles.label}>보유 기술</span>
          <CheckboxGroup
            options={TECH_STACKS}
            selected={form.techStacks}
            onChange={handleTechStacksChange}
            max={MAX_TECH_STACKS}
            showChips
            maxHeight={396}
          />
        </div>

        <FormFooter
          submitLabel="다음"
          disabled={!canSubmit}
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

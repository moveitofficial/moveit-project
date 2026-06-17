'use client';

import googleLogo from '@public/login/googleLogo.svg';
import kakaoLogo from '@public/login/kaLogo.svg';
import naverLogo from '@public/login/naver.svg';
import { ApiError } from '@repo/fetcher';
import { RoundChip } from '@repo/ui/RoundChip';
import Image, { type StaticImageData } from 'next/image';
import { type ChangeEvent, useEffect, useState } from 'react';

import { ExpertProfileSection } from '../ExpertProfileSection';
import { MyInfoProfileSection } from '../MyInfoProfileSection';

import * as styles from './ExpertProfileView.css';

import type {
  AuthProvider,
  MyUser,
  SpecialtyCategory,
} from '@/feature/user/api';
import type { Region } from '@/mocks/types';

import CheckboxGroup from '@/feature/signup/components/common/CheckboxGroup';
import Dropdown from '@/feature/signup/components/common/Dropdown';
import PhoneField from '@/feature/signup/components/common/PhoneField';
import { REGIONS } from '@/feature/signup/components/common/regions';
import { SERVICE_CATEGORIES_BY_GROUP } from '@/feature/signup/components/common/serviceCategories';
import {
  SERVICE_GROUPS,
  type ServiceGroupId,
} from '@/feature/signup/components/common/serviceGroups';
import { TECH_STACKS } from '@/feature/signup/components/common/techStacks';
import BusinessNumberField from '@/feature/signup/components/ExpertActivityInfo/BusinessNumberField';
import {
  BUSINESS_NUMBER_LENGTH,
  TIME_OPTIONS,
} from '@/feature/signup/components/ExpertActivityInfo/constants';
import {
  FOUNDED_YEAR_MONTH_LENGTH,
  MAX_SPECIALTY_CATEGORIES,
  MAX_TECH_STACKS,
} from '@/feature/signup/components/ExpertCompanyInfo/constants';
import {
  usePatchExpertProfileMutation,
  usePatchMyUserMutation,
  usePatchProfileImageMutation,
} from '@/feature/user/queries';

const PROVIDERS: { id: AuthProvider; src: StaticImageData; alt: string }[] = [
  { id: 'NAVER', src: naverLogo, alt: '네이버' },
  { id: 'KAKAO', src: kakaoLogo, alt: '카카오' },
  { id: 'GOOGLE', src: googleLogo, alt: '구글' },
];

const getSpecialtyGroup = (
  categories: SpecialtyCategory[],
): ServiceGroupId | '' => {
  const group = categories[0]?.group;
  if (group === 'IT_COACHING' || group === 'PROJECT_REQUEST') {
    return group;
  }
  return '';
};

const getSpecialtyCategories = (
  categories: SpecialtyCategory[],
  group: ServiceGroupId | '',
): string[] => {
  if (group === '') return [];
  return categories
    .filter((item) => item.group === group)
    .map((item) => item.category);
};

const formatFoundedYear = (digits: string): string => {
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}`;
};

const foundedYearToDigits = (value: number | null): string => {
  if (value === null) return '';
  return String(value);
};

const timeToHourId = (time: string | null): string => {
  if (time === null || time === '') return '';
  const hour = Number.parseInt(time.split(':')[0] ?? '', 10);
  return Number.isNaN(hour) ? '' : String(hour);
};

const hourIdToTime = (id: string): string => {
  if (id === '') return '';
  return `${id.padStart(2, '0')}:00`;
};

const getRegionLabel = (id: string | null): string => {
  if (id === null || id === '') return '';
  return REGIONS.find((region) => region.id === id)?.label ?? id;
};

const getGroupLabel = (id: ServiceGroupId | ''): string => {
  if (id === '') return '';
  return SERVICE_GROUPS.find((group) => group.id === id)?.label ?? id;
};

interface Props {
  user: MyUser;
}

export default function ExpertProfileView({ user: initialUser }: Props) {
  const { mutateAsync: patchMyUser, isPending: isPatchingMyUser } =
    usePatchMyUserMutation();
  const {
    mutateAsync: patchExpertProfile,
    isPending: isPatchingExpertProfile,
  } = usePatchExpertProfileMutation();
  const { mutateAsync: patchProfileImage, isPending: isPatchingProfileImage } =
    usePatchProfileImageMutation();

  const [user, setUser] = useState(initialUser);
  const [businessName, setBusinessName] = useState('');
  const [ceoName, setCeoName] = useState('');
  const [description, setDescription] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [foundedYearMonth, setFoundedYearMonth] = useState('');
  const [contactTimeStart, setContactTimeStart] = useState('');
  const [contactTimeEnd, setContactTimeEnd] = useState('');
  const [employeeMin, setEmployeeMin] = useState('');
  const [employeeMax, setEmployeeMax] = useState('');
  const [region, setRegion] = useState<Region | ''>('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [specialtyGroup, setSpecialtyGroup] = useState<ServiceGroupId | ''>('');
  const [specialtyCategories, setSpecialtyCategories] = useState<string[]>([]);
  const [techStacks, setTechStacks] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isSaving =
    isPatchingMyUser || isPatchingExpertProfile || isPatchingProfileImage;

  const profile = user.expertProfile;

  const syncDraftFromUser = (nextUser: MyUser) => {
    const expert = nextUser.expertProfile;
    const categories = expert?.specialtyCategories ?? [];
    const nextGroup = getSpecialtyGroup(categories);

    setUser(nextUser);
    setBusinessName(expert?.businessName ?? '');
    setCeoName(expert?.ceoName ?? '');
    setDescription(expert?.description ?? '');
    setBusinessNumber(expert?.businessNumber ?? '');
    setPhoneNumber(nextUser.phoneNumber ?? '');
    setFoundedYearMonth(foundedYearToDigits(expert?.foundedYear ?? null));
    setContactTimeStart(timeToHourId(expert?.contactTimeStart ?? null));
    setContactTimeEnd(timeToHourId(expert?.contactTimeEnd ?? null));
    setEmployeeMin(
      expert?.employeeMin === null || expert?.employeeMin === undefined
        ? ''
        : String(expert.employeeMin),
    );
    setEmployeeMax(
      expert?.employeeMax === null || expert?.employeeMax === undefined
        ? ''
        : String(expert.employeeMax),
    );
    setRegion((nextUser.region as Region | null) ?? '');
    setBankName(nextUser.bankName ?? '');
    setBankAccount(nextUser.bankAccount ?? '');
    setSpecialtyGroup(nextGroup);
    setSpecialtyCategories(getSpecialtyCategories(categories, nextGroup));
    setTechStacks(expert?.techStacks.map((stack) => stack.name) ?? []);
  };

  useEffect(() => {
    syncDraftFromUser(initialUser);
  }, [initialUser]);

  const savedSpecialtyGroup = getSpecialtyGroup(
    profile?.specialtyCategories ?? [],
  );
  const savedSpecialtyCategories = getSpecialtyCategories(
    profile?.specialtyCategories ?? [],
    savedSpecialtyGroup,
  );
  const savedSpecialtyOptions =
    savedSpecialtyGroup === ''
      ? null
      : SERVICE_CATEGORIES_BY_GROUP[savedSpecialtyGroup];
  const specialtyOptions =
    specialtyGroup === '' ? null : SERVICE_CATEGORIES_BY_GROUP[specialtyGroup];

  const startIdx = TIME_OPTIONS.findIndex((o) => o.id === contactTimeStart);
  const endDisabledIds =
    startIdx === -1 ? [] : TIME_OPTIONS.slice(0, startIdx + 1).map((o) => o.id);

  const runSave = async (save: () => Promise<unknown>) => {
    setSaveError(null);
    try {
      await save();
    } catch (error_) {
      const message =
        error_ instanceof ApiError ? error_.message : '저장에 실패했습니다.';
      setSaveError(message);
      throw error_ instanceof Error ? error_ : new Error(message);
    }
  };

  const saveBasicInfo = async () => {
    await runSave(() =>
      patchExpertProfile({
        businessName: businessName.trim(),
        ceoName: ceoName.trim(),
        description: description.trim(),
      }),
    );
  };

  const saveCompanyInfo = async () => {
    await runSave(async () => {
      await Promise.all([
        patchExpertProfile({
          businessNumber,
          contactTimeStart: hourIdToTime(contactTimeStart),
          contactTimeEnd: hourIdToTime(contactTimeEnd),
          foundedYear: foundedYearMonth,
          employeeMin: Number(employeeMin),
          employeeMax: Number(employeeMax),
        }),
        patchMyUser({
          phoneNumber,
          region,
          bankName: bankName.trim(),
          bankAccount,
        }),
      ]);
    });
  };

  const saveSkillsInfo = async () => {
    await runSave(() =>
      patchExpertProfile({
        specialtyCategories: specialtyCategories.map((category) => ({
          group: specialtyGroup,
          category,
        })),
        techStackNames: techStacks,
      }),
    );
  };

  const handleProfileFileSelect = async (file: File) => {
    const previousImageUrl = user.profileImageUrl;
    const previewUrl = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, profileImageUrl: previewUrl }));

    setSaveError(null);
    try {
      await patchProfileImage(file);
    } catch (error_) {
      URL.revokeObjectURL(previewUrl);
      setUser((prev) => ({ ...prev, profileImageUrl: previousImageUrl }));
      const message =
        error_ instanceof ApiError
          ? error_.message
          : '프로필 이미지 변경에 실패했습니다.';
      setSaveError(message);
    }
  };

  const handleFoundedYearMonthChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const digits = event.target.value
      .replaceAll(/\D/g, '')
      .slice(0, FOUNDED_YEAR_MONTH_LENGTH);
    setFoundedYearMonth(digits);
  };

  const handleBankAccountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replaceAll(/\D/g, '');
    setBankAccount(digits);
  };

  const handleContactTimeStartChange = (id: string) => {
    const nextStartIdx = TIME_OPTIONS.findIndex((option) => option.id === id);
    const endIdx = TIME_OPTIONS.findIndex(
      (option) => option.id === contactTimeEnd,
    );
    const shouldResetEnd = endIdx !== -1 && endIdx <= nextStartIdx;
    setContactTimeStart(id);
    if (shouldResetEnd) {
      setContactTimeEnd('');
    }
  };

  const handleSpecialtyGroupChange = (id: string) => {
    setSpecialtyGroup(id as ServiceGroupId);
    setSpecialtyCategories([]);
  };

  const canSaveBasicInfo =
    businessName.trim().length >= 2 &&
    ceoName.trim().length >= 2 &&
    description.trim().length > 0 &&
    !isSaving;

  const canSaveCompanyInfo =
    businessNumber.length === BUSINESS_NUMBER_LENGTH &&
    phoneNumber !== '' &&
    foundedYearMonth.length === FOUNDED_YEAR_MONTH_LENGTH &&
    contactTimeStart !== '' &&
    contactTimeEnd !== '' &&
    employeeMin !== '' &&
    employeeMax !== '' &&
    region !== '' &&
    bankName.trim().length >= 2 &&
    bankAccount.length >= 10 &&
    !isSaving;

  const canSaveSkillsInfo =
    specialtyGroup !== '' &&
    specialtyCategories.length > 0 &&
    techStacks.length > 0 &&
    !isSaving;

  if (profile === null) {
    return (
      <section className={styles.root}>
        <h1 className={styles.title}>프로필 관리</h1>
        <p className={styles.statusMessage}>
          전문가 프로필이 없습니다. 회원가입 절차를 완료해주세요.
        </p>
      </section>
    );
  }

  const getApprovalStatus = () => {
    if (profile.isApproved) {
      return {
        label: '판매자 승인 완료',
        className: styles.approvalBadgeApproved,
      };
    }
    if (profile.rejectedAt !== null) {
      return {
        label: '판매자 승인 거절',
        className: styles.approvalBadgeRejected,
      };
    }
    if (profile.isApplied) {
      return {
        label: '판매자 승인 대기',
        className: styles.approvalBadgeWaiting,
      };
    }
    return null;
  };

  const approvalStatus = getApprovalStatus();

  return (
    <section className={styles.root}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>프로필 관리</h1>
        {approvalStatus !== null && (
          <span className={approvalStatus.className}>
            {approvalStatus.label}
          </span>
        )}
      </div>

      {saveError !== null && <p className={styles.errorMessage}>{saveError}</p>}

      <div className={styles.sections}>
        <ExpertProfileSection
          title="기본정보"
          onSave={saveBasicInfo}
          onCancel={() => {
            syncDraftFromUser(user);
          }}
          saveDisabled={!canSaveBasicInfo}
        >
          {(isEditing) => (
            <div className={styles.basicBody}>
              <MyInfoProfileSection
                profileImageUrl={user.profileImageUrl}
                onFileSelect={(file) => {
                  void handleProfileFileSelect(file);
                }}
                disabled={isSaving}
              />

              <div className={styles.basicFields}>
                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <label
                      htmlFor="expert-business-name"
                      className={styles.label}
                    >
                      회사명
                    </label>
                    <input
                      id="expert-business-name"
                      type="text"
                      placeholder="회사명을 입력해주세요"
                      value={businessName}
                      disabled={!isEditing}
                      onChange={(event) => {
                        setBusinessName(event.target.value);
                      }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="expert-ceo-name" className={styles.label}>
                      대표자 명
                    </label>
                    <input
                      id="expert-ceo-name"
                      type="text"
                      placeholder="대표자명을 입력해주세요"
                      value={ceoName}
                      disabled={!isEditing}
                      onChange={(event) => {
                        setCeoName(event.target.value);
                      }}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="expert-description" className={styles.label}>
                    소개
                  </label>
                  <textarea
                    id="expert-description"
                    placeholder="전문가님의 대해서 소개해주세요"
                    value={description}
                    disabled={!isEditing}
                    onChange={(event) => {
                      setDescription(event.target.value);
                    }}
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>연동된 계정</span>
                  <div className={styles.providerList}>
                    {PROVIDERS.map((provider) => {
                      const isActive = user.provider === provider.id;
                      const iconClassName = isActive
                        ? styles.providerIcon
                        : `${styles.providerIcon} ${styles.providerIconInactive}`;
                      return (
                        <span
                          key={provider.id}
                          className={
                            isActive
                              ? `${styles.providerBadge} ${styles.providerBadgeActive}`
                              : styles.providerBadge
                          }
                          aria-label={provider.alt}
                        >
                          <Image
                            src={provider.src}
                            alt={provider.alt}
                            fill
                            className={iconClassName}
                          />
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </ExpertProfileSection>

        <ExpertProfileSection
          title="회사정보"
          onSave={saveCompanyInfo}
          onCancel={() => {
            syncDraftFromUser(user);
          }}
          saveDisabled={!canSaveCompanyInfo}
        >
          {(isEditing) => (
            <div className={styles.fieldGridFull}>
              <div className={styles.field}>
                <span className={styles.label}>사업자 번호</span>
                <BusinessNumberField
                  value={businessNumber}
                  onChange={setBusinessNumber}
                  inputClassName={styles.input}
                  disabled={!isEditing}
                />
              </div>

              <div className={styles.field}>
                <span className={styles.label}>전화번호</span>
                <PhoneField
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  disabled={!isEditing}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="expert-founded-year" className={styles.label}>
                  설립연도
                </label>
                <input
                  id="expert-founded-year"
                  type="text"
                  placeholder="설립 년월을 입력해주세요 (예: 2025.05)"
                  value={formatFoundedYear(foundedYearMonth)}
                  disabled={!isEditing}
                  onChange={handleFoundedYearMonthChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <span className={styles.label}>
                  연락 가능한 시간을 설정해주세요
                </span>
                <div className={styles.timeRange}>
                  <div className={styles.timeSlot}>
                    <Dropdown
                      options={TIME_OPTIONS}
                      value={contactTimeStart}
                      onChange={handleContactTimeStartChange}
                      placeholder="시작 시간"
                      disabled={!isEditing}
                    />
                  </div>
                  <span className={styles.timeSeparator}>~</span>
                  <div className={styles.timeSlot}>
                    <Dropdown
                      options={TIME_OPTIONS}
                      value={contactTimeEnd}
                      onChange={setContactTimeEnd}
                      placeholder="종료 시간"
                      disabled={!isEditing}
                      disabledIds={endDisabledIds}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>인원 수</span>
                <div className={styles.employeeRange}>
                  <div className={styles.employeeRangeSlot}>
                    <div className={styles.employeeInputWrapper}>
                      <input
                        type="text"
                        placeholder="숫자만 입력해주세요"
                        value={employeeMin}
                        disabled={!isEditing}
                        onChange={(event) => {
                          setEmployeeMin(
                            event.target.value.replaceAll(/\D/g, ''),
                          );
                        }}
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
                        placeholder="숫자만 입력해주세요"
                        value={employeeMax}
                        disabled={!isEditing}
                        onChange={(event) => {
                          setEmployeeMax(
                            event.target.value.replaceAll(/\D/g, ''),
                          );
                        }}
                        className={styles.employeeInput}
                      />
                      <span className={styles.employeeSuffix}>미만</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>지역</span>
                {isEditing ? (
                  <Dropdown
                    options={REGIONS}
                    value={region}
                    onChange={(nextRegion) => {
                      setRegion(nextRegion as Region);
                    }}
                    placeholder="지역을 선택해주세요"
                  />
                ) : (
                  <input
                    type="text"
                    value={getRegionLabel(region)}
                    disabled
                    className={styles.input}
                  />
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="expert-bank-name" className={styles.label}>
                  은행명
                </label>
                <input
                  id="expert-bank-name"
                  type="text"
                  placeholder="은행명을 입력해주세요"
                  value={bankName}
                  disabled={!isEditing}
                  onChange={(event) => {
                    setBankName(event.target.value);
                  }}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="expert-bank-account" className={styles.label}>
                  입금계좌
                </label>
                <input
                  id="expert-bank-account"
                  type="text"
                  placeholder="계좌번호를 입력해주세요"
                  value={bankAccount}
                  disabled={!isEditing}
                  onChange={handleBankAccountChange}
                  className={styles.input}
                />
              </div>
            </div>
          )}
        </ExpertProfileSection>

        <ExpertProfileSection
          title="분야 및 보유기술"
          onSave={saveSkillsInfo}
          onCancel={() => {
            syncDraftFromUser(user);
          }}
          saveDisabled={!canSaveSkillsInfo}
        >
          {(isEditing) => (
            <div className={styles.fieldGridFull}>
              <div className={styles.field}>
                <span className={styles.label}>전문 분야</span>
                {isEditing ? (
                  <Dropdown
                    options={SERVICE_GROUPS}
                    value={specialtyGroup}
                    onChange={handleSpecialtyGroupChange}
                    placeholder="전문 분야를 선택해주세요"
                  />
                ) : (
                  <input
                    type="text"
                    value={getGroupLabel(savedSpecialtyGroup)}
                    disabled
                    className={styles.input}
                  />
                )}
              </div>

              <div className={styles.field}>
                <span className={styles.label}>상세 분야</span>
                {isEditing && specialtyOptions !== null ? (
                  <CheckboxGroup
                    options={specialtyOptions}
                    selected={specialtyCategories}
                    onChange={setSpecialtyCategories}
                    max={MAX_SPECIALTY_CATEGORIES}
                    showChips
                  />
                ) : (
                  savedSpecialtyOptions !== null &&
                  savedSpecialtyCategories.length > 0 && (
                    <div className={styles.chipList}>
                      {savedSpecialtyCategories.map((id) => {
                        const option = savedSpecialtyOptions.find(
                          (item) => item.id === id,
                        );
                        if (option === undefined) return null;
                        return (
                          <RoundChip
                            key={id}
                            text={option.label}
                            size="web"
                            color="blue100"
                          />
                        );
                      })}
                    </div>
                  )
                )}
              </div>

              <div className={styles.field}>
                <span className={styles.label}>보유기술</span>
                {isEditing ? (
                  <CheckboxGroup
                    options={TECH_STACKS}
                    selected={techStacks}
                    onChange={setTechStacks}
                    max={MAX_TECH_STACKS}
                    showChips
                    maxHeight={396}
                  />
                ) : (
                  techStacks.length > 0 && (
                    <div className={styles.chipList}>
                      {techStacks.map((stackId) => {
                        const option = TECH_STACKS.find(
                          (item) => item.id === stackId,
                        );
                        if (option === undefined) return null;
                        return (
                          <RoundChip
                            key={stackId}
                            text={option.label}
                            size="web"
                            color="blue100"
                          />
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </ExpertProfileSection>
      </div>
    </section>
  );
}

'use client';

import googleLogo from '@public/login/googleLogo.svg';
import kakaoLogo from '@public/login/kaLogo.svg';
import naverLogo from '@public/login/naver.svg';
import { RoundChip } from '@repo/ui/RoundChip';
import Image, { type StaticImageData } from 'next/image';
import { type ChangeEvent, useState } from 'react';

import { MyInfoFieldRow, myInfoFieldRowStyles } from '../MyInfoFieldRow';
import { MyInfoProfileSection } from '../MyInfoProfileSection';

import * as styles from './MyInfoView.css';

import type {
  AuthProvider,
  ClientMeUser,
  InterestCategory,
  Region,
  ServiceCategoryName,
} from '@/mocks/types';

import {
  DETAIL_AREAS_BY_INTEREST,
  INTEREST_AREAS,
  MAX_DETAIL_AREAS,
  type InterestAreaId,
} from '@/feature/signup/components/ClientInfo/constants';
import CheckboxGroup from '@/feature/signup/components/common/CheckboxGroup';
import Dropdown from '@/feature/signup/components/common/Dropdown';
import PhoneField from '@/feature/signup/components/common/PhoneField';
import { REGIONS } from '@/feature/signup/components/common/regions';
import { mockClientUser } from '@/mocks/user';

const PROVIDERS: { id: AuthProvider; src: StaticImageData; alt: string }[] = [
  { id: 'NAVER', src: naverLogo, alt: '네이버' },
  { id: 'KAKAO', src: kakaoLogo, alt: '카카오' },
  { id: 'GOOGLE', src: googleLogo, alt: '구글' },
];

const getInitialInterestArea = (
  categories: InterestCategory[],
): InterestAreaId | '' => categories[0]?.group ?? '';

const getInitialDetailAreas = (
  categories: InterestCategory[],
  group: InterestAreaId | '',
): ServiceCategoryName[] => {
  if (group === '') return [];
  return categories
    .filter((item) => item.group === group)
    .map((item) => item.category);
};

const toInterestCategories = (
  group: InterestAreaId | '',
  categories: string[],
): InterestCategory[] => {
  if (group === '') return [];
  return categories.map((category) => ({
    group,
    category: category as ServiceCategoryName,
  }));
};

export default function MyInfoView() {
  const initialUser = mockClientUser;

  const [user, setUser] = useState<ClientMeUser>(initialUser);
  const [nickname, setNickname] = useState(
    initialUser.clientProfile?.nickname ?? '',
  );
  const [phoneNumber, setPhoneNumber] = useState(initialUser.phoneNumber ?? '');
  const [bankName, setBankName] = useState(initialUser.bankName ?? '');
  const [bankAccount, setBankAccount] = useState(initialUser.bankAccount ?? '');
  const [region, setRegion] = useState<Region | ''>(initialUser.region ?? '');
  const [interestArea, setInterestArea] = useState<InterestAreaId | ''>(
    getInitialInterestArea(initialUser.clientProfile?.interestCategories ?? []),
  );
  const [detailAreas, setDetailAreas] = useState<string[]>(
    getInitialDetailAreas(
      initialUser.clientProfile?.interestCategories ?? [],
      getInitialInterestArea(
        initialUser.clientProfile?.interestCategories ?? [],
      ),
    ),
  );
  const [isInterestEditing, setIsInterestEditing] = useState(false);

  const savedInterestArea = getInitialInterestArea(
    user.clientProfile?.interestCategories ?? [],
  );
  const savedDetailAreas = getInitialDetailAreas(
    user.clientProfile?.interestCategories ?? [],
    savedInterestArea,
  );
  const savedDetailOptions =
    savedInterestArea === ''
      ? null
      : DETAIL_AREAS_BY_INTEREST[savedInterestArea];

  const detailOptions =
    interestArea === '' ? null : DETAIL_AREAS_BY_INTEREST[interestArea];

  const handleBankAccountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replaceAll(/\D/g, '');
    setBankAccount(digits);
  };

  const handleInterestAreaChange = (nextGroup: string) => {
    setInterestArea(nextGroup as InterestAreaId);
    setDetailAreas([]);
  };

  const saveNickname = () => {
    setUser((prev) => ({
      ...prev,
      clientProfile: {
        nickname: nickname.trim(),
        interestCategories: prev.clientProfile?.interestCategories ?? [],
      },
    }));
  };

  const savePhoneNumber = () => {
    setUser((prev) => ({ ...prev, phoneNumber }));
  };

  const saveBankName = () => {
    setUser((prev) => ({ ...prev, bankName: bankName.trim() }));
  };

  const saveBankAccount = () => {
    setUser((prev) => ({ ...prev, bankAccount }));
  };

  const saveRegion = () => {
    if (region === '') return;
    setUser((prev) => ({ ...prev, region }));
  };

  const saveInterestCategories = () => {
    const nextCategories = toInterestCategories(interestArea, detailAreas);
    setUser((prev) => ({
      ...prev,
      clientProfile: {
        nickname: prev.clientProfile?.nickname ?? null,
        interestCategories: nextCategories,
      },
    }));
  };

  const resetInterestDraft = () => {
    const categories = user.clientProfile?.interestCategories ?? [];
    const nextInterestArea = getInitialInterestArea(categories);
    setInterestArea(nextInterestArea);
    setDetailAreas(getInitialDetailAreas(categories, nextInterestArea));
  };

  const handleInterestEditingChange = (editing: boolean) => {
    if (editing) {
      resetInterestDraft();
    }
    setIsInterestEditing(editing);
  };

  return (
    <section className={styles.root}>
      <h1 className={styles.title}>내 정보</h1>

      <div className={styles.card}>
        <MyInfoProfileSection
          profileImageUrl={user.profileImageUrl}
          onChange={(nextUrl) => {
            setUser((prev) => ({ ...prev, profileImageUrl: nextUrl }));
          }}
        />

        <div className={styles.fields}>
          <MyInfoFieldRow label="이름" htmlFor="my-info-name" readOnly>
            <input
              id="my-info-name"
              type="text"
              value={user.name ?? ''}
              disabled
              className={myInfoFieldRowStyles.input}
            />
          </MyInfoFieldRow>

          <MyInfoFieldRow
            label="닉네임"
            htmlFor="my-info-nickname"
            onSave={saveNickname}
            onCancel={() => {
              setNickname(user.clientProfile?.nickname ?? '');
            }}
            saveDisabled={nickname.trim().length < 2}
          >
            {(isEditing) => (
              <input
                id="my-info-nickname"
                type="text"
                placeholder="닉네임을 입력해주세요"
                value={nickname}
                disabled={!isEditing}
                onChange={(event) => {
                  setNickname(event.target.value);
                }}
                className={myInfoFieldRowStyles.input}
              />
            )}
          </MyInfoFieldRow>

          <MyInfoFieldRow
            label="연락처"
            onSave={savePhoneNumber}
            onCancel={() => {
              setPhoneNumber(user.phoneNumber ?? '');
            }}
          >
            {(isEditing) => (
              <PhoneField
                value={phoneNumber}
                onChange={setPhoneNumber}
                disabled={!isEditing}
                className={myInfoFieldRowStyles.input}
              />
            )}
          </MyInfoFieldRow>

          <MyInfoFieldRow label="이메일" htmlFor="my-info-email" readOnly>
            <input
              id="my-info-email"
              type="email"
              value={user.email}
              disabled
              className={myInfoFieldRowStyles.input}
            />
          </MyInfoFieldRow>

          <MyInfoFieldRow label="연동된 계정" readOnly>
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
          </MyInfoFieldRow>

          <MyInfoFieldRow
            label="환불받을 은행명"
            htmlFor="my-info-bank-name"
            onSave={saveBankName}
            onCancel={() => {
              setBankName(user.bankName ?? '');
            }}
            saveDisabled={bankName.trim().length < 2}
          >
            {(isEditing) => (
              <input
                id="my-info-bank-name"
                type="text"
                placeholder="은행명을 입력해주세요"
                value={bankName}
                disabled={!isEditing}
                onChange={(event) => {
                  setBankName(event.target.value);
                }}
                className={myInfoFieldRowStyles.input}
              />
            )}
          </MyInfoFieldRow>

          <MyInfoFieldRow
            label="환불받을 입금계좌"
            htmlFor="my-info-bank-account"
            onSave={saveBankAccount}
            onCancel={() => {
              setBankAccount(user.bankAccount ?? '');
            }}
            saveDisabled={bankAccount.length < 10}
          >
            {(isEditing) => (
              <input
                id="my-info-bank-account"
                type="text"
                placeholder="계좌번호를 입력해주세요"
                value={bankAccount}
                disabled={!isEditing}
                onChange={handleBankAccountChange}
                className={myInfoFieldRowStyles.input}
              />
            )}
          </MyInfoFieldRow>

          <MyInfoFieldRow
            label="관심 분야"
            isEditing={isInterestEditing}
            onEditingChange={handleInterestEditingChange}
            onSave={saveInterestCategories}
            onCancel={resetInterestDraft}
            saveDisabled={interestArea === '' || detailAreas.length === 0}
          >
            {(isEditing) => (
              <Dropdown
                options={INTEREST_AREAS}
                value={interestArea}
                onChange={handleInterestAreaChange}
                placeholder="관심분야를 선택해주세요"
                disabled={!isEditing}
              />
            )}
          </MyInfoFieldRow>

          <MyInfoFieldRow label="상세 분야" readOnly>
            {isInterestEditing && detailOptions !== null ? (
              <CheckboxGroup
                options={detailOptions}
                selected={detailAreas}
                onChange={setDetailAreas}
                max={MAX_DETAIL_AREAS}
                showChips
                chipsAlign="end"
              />
            ) : (
              savedDetailOptions !== null &&
              savedDetailAreas.length > 0 && (
                <div className={styles.savedDetailChips}>
                  {savedDetailAreas.map((id) => {
                    const option = savedDetailOptions.find((o) => o.id === id);
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
          </MyInfoFieldRow>

          <MyInfoFieldRow
            label="지역"
            onSave={saveRegion}
            onCancel={() => {
              setRegion(user.region ?? '');
            }}
            saveDisabled={region === ''}
          >
            {(isEditing) => (
              <Dropdown
                options={REGIONS}
                value={region}
                onChange={(nextRegion) => {
                  setRegion(nextRegion as Region);
                }}
                placeholder="지역을 선택해주세요"
                disabled={!isEditing}
              />
            )}
          </MyInfoFieldRow>
        </div>
      </div>
    </section>
  );
}

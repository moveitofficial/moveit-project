'use client';

import googleLogo from '@public/login/googleLogo.svg';
import kakaoLogo from '@public/login/kaLogo.svg';
import naverLogo from '@public/login/naver.svg';
import { ApiError } from '@repo/fetcher';
import { RoundChip } from '@repo/ui/RoundChip';
import Image, { type StaticImageData } from 'next/image';
import { type ChangeEvent, useEffect, useState } from 'react';

import { MyInfoFieldRow, myInfoFieldRowStyles } from '../MyInfoFieldRow';
import { MyInfoProfileSection } from '../MyInfoProfileSection';
import * as myInfoStyles from '../MyInfoView/MyInfoView.css';

import type {
  AuthProvider,
  InterestCategory,
  MyUser,
} from '@/feature/user/api';
import type { Region, ServiceCategoryName } from '@/mocks/types';

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
import {
  usePatchClientProfileMutation,
  usePatchMyUserMutation,
  usePatchProfileImageMutation,
} from '@/feature/user/queries';

const PROVIDERS: { id: AuthProvider; src: StaticImageData; alt: string }[] = [
  { id: 'NAVER', src: naverLogo, alt: '네이버' },
  { id: 'KAKAO', src: kakaoLogo, alt: '카카오' },
  { id: 'GOOGLE', src: googleLogo, alt: '구글' },
];

const getInitialInterestArea = (
  categories: InterestCategory[],
): InterestAreaId | '' => {
  const group = categories[0]?.group;
  if (group === 'IT_COACHING' || group === 'PROJECT_REQUEST') {
    return group;
  }
  return '';
};

const getInitialDetailAreas = (
  categories: InterestCategory[],
  group: InterestAreaId | '',
): ServiceCategoryName[] => {
  if (group === '') return [];
  return categories
    .filter((item) => item.group === group)
    .map((item) => item.category as ServiceCategoryName);
};

const toInterestCategories = (
  group: InterestAreaId | '',
  categories: string[],
): InterestCategory[] => {
  if (group === '') return [];
  return categories.map((category) => ({
    group,
    category,
  }));
};

interface Props {
  user: MyUser;
}

export default function ClientMyInfoView({ user: initialUser }: Props) {
  const { mutateAsync: patchMyUser, isPending: isPatchingMyUser } =
    usePatchMyUserMutation();
  const { mutateAsync: patchClientProfile, isPending: isPatchingClientProfile } =
    usePatchClientProfileMutation();
  const { mutateAsync: patchProfileImage, isPending: isPatchingProfileImage } =
    usePatchProfileImageMutation();

  const [user, setUser] = useState(initialUser);
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [region, setRegion] = useState<Region | ''>('');
  const [interestArea, setInterestArea] = useState<InterestAreaId | ''>('');
  const [detailAreas, setDetailAreas] = useState<string[]>([]);
  const [isInterestEditing, setIsInterestEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isSaving =
    isPatchingMyUser || isPatchingClientProfile || isPatchingProfileImage;

  useEffect(() => {
    const interestCategories = initialUser.clientProfile?.interestCategories ?? [];
    const nextInterestArea = getInitialInterestArea(interestCategories);

    setUser(initialUser);
    setNickname(initialUser.clientProfile?.nickname ?? '');
    setPhoneNumber(initialUser.phoneNumber ?? '');
    setBankName(initialUser.bankName ?? '');
    setBankAccount(initialUser.bankAccount ?? '');
    setRegion((initialUser.region as Region | null) ?? '');
    setInterestArea(nextInterestArea);
    setDetailAreas(
      getInitialDetailAreas(interestCategories, nextInterestArea),
    );
  }, [initialUser]);

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

  const saveNickname = async () => {
    await runSave(() =>
      patchClientProfile({ nickname: nickname.trim() }),
    );
  };

  const savePhoneNumber = async () => {
    await runSave(() => patchMyUser({ phoneNumber }));
  };

  const saveBankName = async () => {
    await runSave(() => patchMyUser({ bankName: bankName.trim() }));
  };

  const saveBankAccount = async () => {
    await runSave(() => patchMyUser({ bankAccount }));
  };

  const saveRegion = async () => {
    if (region === '') return;
    await runSave(() => patchMyUser({ region }));
  };

  const saveInterestCategories = async () => {
    await runSave(() =>
      patchClientProfile({
        interestCategories: toInterestCategories(interestArea, detailAreas),
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
    <section className={myInfoStyles.root}>
      <h1 className={myInfoStyles.title}>내 정보</h1>
      {saveError !== null && (
        <p className={myInfoStyles.errorMessage}>{saveError}</p>
      )}

      <div className={myInfoStyles.card}>
        <MyInfoProfileSection
          profileImageUrl={user.profileImageUrl}
          onFileSelect={(file) => {
            void handleProfileFileSelect(file);
          }}
          disabled={isSaving}
        />

        <div className={myInfoStyles.fields}>
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
            saveDisabled={nickname.trim().length < 2 || isSaving}
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
            saveDisabled={isSaving}
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
            <div className={myInfoStyles.providerList}>
              {PROVIDERS.map((provider) => {
                const isActive = user.provider === provider.id;
                const iconClassName = isActive
                  ? myInfoStyles.providerIcon
                  : `${myInfoStyles.providerIcon} ${myInfoStyles.providerIconInactive}`;
                return (
                  <span
                    key={provider.id}
                    className={
                      isActive
                        ? `${myInfoStyles.providerBadge} ${myInfoStyles.providerBadgeActive}`
                        : myInfoStyles.providerBadge
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
            saveDisabled={bankName.trim().length < 2 || isSaving}
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
            saveDisabled={bankAccount.length < 10 || isSaving}
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
            saveDisabled={
              interestArea === '' || detailAreas.length === 0 || isSaving
            }
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
                <div className={myInfoStyles.savedDetailChips}>
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
              setRegion((user.region as Region | null) ?? '');
            }}
            saveDisabled={region === '' || isSaving}
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

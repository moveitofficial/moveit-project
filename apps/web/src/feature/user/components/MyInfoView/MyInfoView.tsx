'use client';

import googleLogo from '@public/login/googleLogo.svg';
import kakaoLogo from '@public/login/kaLogo.svg';
import naverLogo from '@public/login/naver.svg';
import { ApiError } from '@repo/fetcher';
import { RoundChip } from '@repo/ui/RoundChip';
import Image, { type StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useEffect, useState } from 'react';

import { MyInfoFieldRow, myInfoFieldRowStyles } from '../MyInfoFieldRow';
import { MyInfoProfileSection } from '../MyInfoProfileSection';

import * as styles from './MyInfoView.css';

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
import { useMyUserQuery } from '@/feature/user/queries';

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

const syncDraftFromUser = (
  user: MyUser,
  setters: {
    setUser: (user: MyUser) => void;
    setNickname: (value: string) => void;
    setPhoneNumber: (value: string) => void;
    setBankName: (value: string) => void;
    setBankAccount: (value: string) => void;
    setRegion: (value: Region | '') => void;
    setInterestArea: (value: InterestAreaId | '') => void;
    setDetailAreas: (value: string[]) => void;
  },
) => {
  const interestCategories = user.clientProfile?.interestCategories ?? [];
  const nextInterestArea = getInitialInterestArea(interestCategories);

  setters.setUser(user);
  setters.setNickname(user.clientProfile?.nickname ?? '');
  setters.setPhoneNumber(user.phoneNumber ?? '');
  setters.setBankName(user.bankName ?? '');
  setters.setBankAccount(user.bankAccount ?? '');
  setters.setRegion((user.region as Region | null) ?? '');
  setters.setInterestArea(nextInterestArea);
  setters.setDetailAreas(
    getInitialDetailAreas(interestCategories, nextInterestArea),
  );
};

export default function MyInfoView() {
  const router = useRouter();
  const { data, isPending, isError, error } = useMyUserQuery();

  const [user, setUser] = useState<MyUser | null>(null);
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [region, setRegion] = useState<Region | ''>('');
  const [interestArea, setInterestArea] = useState<InterestAreaId | ''>('');
  const [detailAreas, setDetailAreas] = useState<string[]>([]);
  const [isInterestEditing, setIsInterestEditing] = useState(false);

  useEffect(() => {
    if (!data) return;
    syncDraftFromUser(data, {
      setUser,
      setNickname,
      setPhoneNumber,
      setBankName,
      setBankAccount,
      setRegion,
      setInterestArea,
      setDetailAreas,
    });
  }, [data]);

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      router.push('/login');
    }
  }, [error, router]);

  const savedInterestArea = getInitialInterestArea(
    user?.clientProfile?.interestCategories ?? [],
  );
  const savedDetailAreas = getInitialDetailAreas(
    user?.clientProfile?.interestCategories ?? [],
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
    if (user === null) return;
    setUser({
      ...user,
      clientProfile: {
        id: user.clientProfile?.id ?? '',
        userId: user.clientProfile?.userId ?? user.id,
        nickname: nickname.trim(),
        interestCategories: user.clientProfile?.interestCategories ?? [],
      },
    });
  };

  const savePhoneNumber = () => {
    if (user === null) return;
    setUser({ ...user, phoneNumber });
  };

  const saveBankName = () => {
    if (user === null) return;
    setUser({ ...user, bankName: bankName.trim() });
  };

  const saveBankAccount = () => {
    if (user === null) return;
    setUser({ ...user, bankAccount });
  };

  const saveRegion = () => {
    if (user === null || region === '') return;
    setUser({ ...user, region });
  };

  const saveInterestCategories = () => {
    if (user === null) return;
    const nextCategories = toInterestCategories(interestArea, detailAreas);
    setUser({
      ...user,
      clientProfile: {
        id: user.clientProfile?.id ?? '',
        userId: user.clientProfile?.userId ?? user.id,
        nickname: user.clientProfile?.nickname ?? null,
        interestCategories: nextCategories,
      },
    });
  };

  const resetInterestDraft = () => {
    if (user === null) return;
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

  if (isPending) {
    return (
      <section className={styles.root}>
        <h1 className={styles.title}>내 정보</h1>
        <p className={styles.statusMessage}>내 정보를 불러오는 중입니다.</p>
      </section>
    );
  }

  if (isError || user === null) {
    const message =
      error instanceof ApiError
        ? error.message
        : '내 정보를 불러오지 못했습니다.';
    return (
      <section className={styles.root}>
        <h1 className={styles.title}>내 정보</h1>
        <p className={styles.errorMessage}>{message}</p>
      </section>
    );
  }

  return (
    <section className={styles.root}>
      <h1 className={styles.title}>내 정보</h1>

      <div className={styles.card}>
        <MyInfoProfileSection
          profileImageUrl={user.profileImageUrl}
          onChange={(nextUrl) => {
            setUser((prev) =>
              prev === null ? prev : { ...prev, profileImageUrl: nextUrl },
            );
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
              setRegion((user.region as Region | null) ?? '');
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

'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import * as styles from './UserFilter.css';

import type { UserFilterParams } from '@/features/users/types';

import { FilterDropdown } from '@/components/common/FilterDropdown';
import { SearchBar } from '@/components/common/SearchBar';
import {
  EXPERT_STATUS_OPTIONS,
  PAGE_SIZE_OPTIONS,
  PROVIDER_OPTIONS,
  REGION_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from '@/features/users/constants';

interface Props {
  params: UserFilterParams;
}

export default function UserFilter({ params }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams.toString());

    if (value === undefined) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    next.delete('page');
    router.push(`?${next.toString()}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <SearchBar
          value={params.search}
          onChange={(value) => {
            updateParam('search', value === '' ? undefined : value);
          }}
          placeholder="이름 / 이메일로 검색해주세요"
        />
      </div>

      <FilterDropdown
        options={PROVIDER_OPTIONS}
        value={params.provider}
        onChange={(value) => {
          updateParam('provider', value);
        }}
        placeholder="가입경로"
      />

      {params.tab === 'EXPERT' && (
        <>
          <FilterDropdown
            options={EXPERT_STATUS_OPTIONS}
            value={params.approvalStatus}
            onChange={(value) => {
              updateParam('approvalStatus', value);
            }}
            placeholder="상태"
          />
          <FilterDropdown
            options={SERVICE_TYPE_OPTIONS}
            value={params.serviceType}
            onChange={(value) => {
              updateParam('serviceType', value);
            }}
            placeholder="전문분야"
          />
        </>
      )}

      <FilterDropdown
        options={REGION_OPTIONS}
        value={params.region}
        onChange={(value) => {
          updateParam('region', value);
        }}
        placeholder="지역"
      />

      <FilterDropdown
        options={PAGE_SIZE_OPTIONS}
        value={params.pageSize === undefined ? undefined : String(params.pageSize)}
        onChange={(value) => {
          updateParam('pageSize', value);
        }}
        placeholder="50개씩"
        hasReset={false}
      />
    </div>
  );
}

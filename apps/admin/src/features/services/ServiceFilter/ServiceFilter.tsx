'use client';

import * as styles from './ServiceFilter.css';

import type { ServiceFilterParams } from '@/features/services/types';

import { FilterDropdown } from '@/components/common/FilterDropdown';
import { SearchBar } from '@/components/common/SearchBar';
import { PAGE_SIZE_OPTIONS, SERVICE_STATUS_OPTIONS, SERVICE_TYPE_OPTIONS } from '@/utils/constants';
import { useUpdateParam } from '@/utils/hooks';

interface Props {
  params: ServiceFilterParams;
}

export default function ServiceFilter({ params }: Props) {
  const updateParam = useUpdateParam();

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <SearchBar
          value={params.search}
          onChange={(value) => {
            updateParam('search', value === '' ? undefined : value);
          }}
          placeholder="서비스명으로 검색해주세요"
        />
      </div>

      <FilterDropdown
        options={SERVICE_TYPE_OPTIONS}
        value={params.serviceType}
        onChange={(value) => {
          updateParam('serviceType', value);
        }}
        placeholder="카테고리"
      />

      <FilterDropdown
        options={SERVICE_STATUS_OPTIONS}
        value={params.status}
        onChange={(value) => {
          updateParam('status', value);
        }}
        placeholder="상태"
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

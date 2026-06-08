'use client';

import * as styles from './AdminFilter.css';

import type { AdminFilterParams } from '@/features/admins/types';

import { FilterDropdown } from '@/components/common/FilterDropdown';
import { SearchBar } from '@/components/common/SearchBar';
import { PAGE_SIZE_OPTIONS } from '@/utils/constants';
import { useUpdateParam } from '@/utils/hooks';

interface Props {
  params: AdminFilterParams;
}

export default function AdminFilter({ params }: Props) {
  const updateParam = useUpdateParam();

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
        options={PAGE_SIZE_OPTIONS}
        value={params.pageSize?.toString()}
        onChange={(value) => {
          updateParam('pageSize', value);
        }}
        placeholder="50개씩"
        hasReset={false}
      />
    </div>
  );
}

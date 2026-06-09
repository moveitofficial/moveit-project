'use client';

import * as styles from './SettlementFilter.css';

import type { SettlementFilterParams } from '@/features/settlements/types';

import { FilterDropdown } from '@/components/common/FilterDropdown';
import { SearchBar } from '@/components/common/SearchBar';
import { SETTLEMENT_STATUS_OPTIONS } from '@/utils/constants';
import { useUpdateParam } from '@/utils/hooks';

interface Props {
  params: SettlementFilterParams;
}

export default function SettlementFilter({ params }: Props) {
  const updateParam = useUpdateParam();

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <SearchBar
          value={params.search}
          onChange={(value) => {
            updateParam('search', value === '' ? undefined : value);
          }}
          placeholder="구매자명으로 검색해주세요"
        />
      </div>

      <FilterDropdown
        options={SETTLEMENT_STATUS_OPTIONS}
        value={params.status}
        onChange={(value) => {
          updateParam('status', value);
        }}
        placeholder="상태"
      />
    </div>
  );
}

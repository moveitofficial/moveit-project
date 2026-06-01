'use client';

import * as styles from './ReportFilter.css';

import type { ReportFilterParams } from '@/features/reports/types';

import { FilterDropdown } from '@/components/common/FilterDropdown';
import { SearchBar } from '@/components/common/SearchBar';
import { PAGE_SIZE_OPTIONS, REPORT_REASON_OPTIONS } from '@/utils/constants';
import { useUpdateParam } from '@/utils/hooks';


interface Props {
  params: ReportFilterParams;
}

export default function ReportFilter({ params }: Props) {
  const updateParam = useUpdateParam();

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <SearchBar
          value={params.search}
          onChange={(value) => {
            updateParam('search', value === '' ? undefined : value);
          }}
          placeholder="회사명 or 유저이름으로 검색해주세요"
        />
      </div>

      <FilterDropdown
        options={REPORT_REASON_OPTIONS}
        value={params.reason}
        onChange={(value) => {
          updateParam('reason', value);
        }}
        placeholder="사유"
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

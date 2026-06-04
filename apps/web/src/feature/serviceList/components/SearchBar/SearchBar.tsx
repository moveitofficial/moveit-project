'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { buildServiceListHref } from '../../utils';

import * as styles from './SearchBar.css';

import type { ServiceListConfig, ServiceListSearchParams } from '../../types';

import { SearchInput } from '@/components/common/SearchInput';

interface Props {
  config: ServiceListConfig;
  params: ServiceListSearchParams;
}

export default function SearchBar({ config, params }: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(params.keyword);

  const handleSubmit = () => {
    const href = buildServiceListHref(config, {
      ...params,
      keyword: keyword.trim(),
      page: 1,
    });
    router.push(href);
  };

  return (
    <SearchInput
      className={styles.searchWrapper}
      inputClassName={styles.searchInput}
      searchIconClassName={styles.searchSubmitButton}
      searchIconSize={24}
      value={keyword}
      onChange={setKeyword}
      onSubmit={handleSubmit}
      placeholder="어떤 전문가가 필요하세요?"
    />
  );
}

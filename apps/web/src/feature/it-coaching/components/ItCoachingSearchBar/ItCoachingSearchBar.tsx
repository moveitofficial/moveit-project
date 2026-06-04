'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { buildItCoachingHref, type ItCoachingSearchParams } from '../../utils';

import * as styles from './ItCoachingSearchBar.css';

import { SearchInput } from '@/components/common/SearchInput';

interface Props {
  params: ItCoachingSearchParams;
}

export default function ItCoachingSearchBar({ params }: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(params.keyword);

  const handleSubmit = () => {
    const href = buildItCoachingHref({
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

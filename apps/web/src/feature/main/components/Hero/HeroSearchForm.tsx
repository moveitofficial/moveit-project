'use client';

import { useState } from 'react';

import { RadioGroup } from './RadioGroup';

import { SearchInput } from '@/components/common/SearchInput';

export default function HeroSearchForm() {
  const [tab, setTab] = useState('IT코칭');
  const [search, setSearch] = useState('');

  const handleSubmit = () => {
    const keyword = search.trim();
    if (!keyword) return;
    // TODO: API 연동 시 tab + keyword 로 검색 쿼리 실행
  };

  return (
    <>
      <RadioGroup value={tab} onChange={setTab} />
      <SearchInput
        value={search}
        onChange={setSearch}
        onSubmit={handleSubmit}
      />
    </>
  );
}

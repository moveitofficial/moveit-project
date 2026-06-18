'use client';

import { RoundChip } from '@repo/ui/RoundChip';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import * as styles from './Hero.css';
import { RadioGroup } from './RadioGroup';

import { SearchInput } from '@/components/common/SearchInput';
import { IT_COACHING_LIST_CONFIG } from '@/feature/itCoaching/constants';
import { PROJECT_REQUEST_LIST_CONFIG } from '@/feature/projectRequest/constants';
import {
  SERVICE_LIST_DEFAULT_PARAMS,
  buildServiceListHref,
} from '@/feature/serviceList/utils';

export default function HeroSearchForm() {
  const router = useRouter();
  const [tab, setTab] = useState('IT코칭');
  const [search, setSearch] = useState('');

  const config =
    tab === 'IT코칭' ? IT_COACHING_LIST_CONFIG : PROJECT_REQUEST_LIST_CONFIG;
  const chips = config.categoryOptions.filter((option) => option.id !== 'ALL');

  const handleSubmit = () => {
    const keyword = search.trim();
    if (!keyword) return;
    router.push(
      buildServiceListHref(config, SERVICE_LIST_DEFAULT_PARAMS, { keyword }),
    );
  };

  return (
    <>
      <RadioGroup value={tab} onChange={setTab} />
      <SearchInput value={search} onChange={setSearch} onSubmit={handleSubmit} />
      <div className={styles.roundGroup}>
        {chips.map((option) => (
          <Link
            key={option.id}
            href={buildServiceListHref(config, SERVICE_LIST_DEFAULT_PARAMS, {
              category: option.id,
            })}
            className={styles.chipLink}
          >
            <RoundChip text={option.label} size="web" />
          </Link>
        ))}
      </div>
    </>
  );
}

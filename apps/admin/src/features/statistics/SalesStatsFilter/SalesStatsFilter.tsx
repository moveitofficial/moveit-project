'use client';

import { typography } from '@repo/styles/typography';
import { CalendarDays } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';

import * as styles from './SalesStatsFilter.css';

import { formatDisplayDate, toDateStr } from '@/utils/formatDate';
import { useUpdateParam } from '@/utils/hooks';

const PRESETS = [
  { label: '7일', days: 7 },
  { label: '30일', days: 30 },
  { label: '90일', days: 90 },
  { label: '1년', days: 365 },
] as const;

export default function SalesStatsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateParam = useUpdateParam();
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const currentStart = searchParams.get('startDate') ?? '';
  const currentEnd = searchParams.get('endDate') ?? '';

  function applyPreset(days: number): void {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days + 1);
    const next = new URLSearchParams(searchParams.toString());
    next.set('startDate', toDateStr(start));
    next.set('endDate', toDateStr(end));
    router.push(`?${next.toString()}`);
  }

  function isPresetActive(days: number): boolean {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days + 1);
    return currentStart === toDateStr(start) && currentEnd === toDateStr(end);
  }

  return (
    <div className={styles.container}>
      <div className={styles.presetContainer}>
        {PRESETS.map(({ label, days }) => {
          const active = isPresetActive(days);
          return (
            <button
              key={days}
              type="button"
              onClick={() => {
                applyPreset(days);
              }}
              className={`${active ? typography.f16EB : typography.f16R} ${styles.presetBtn[active ? 'active' : 'inactive']}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <label
        className={styles.dateBox}
        onClick={(e) => {
          e.preventDefault();
          startRef.current?.showPicker();
        }}
      >
        <span className={`${typography.f16R} ${styles.dateBoxText}`}>
          {currentStart ? formatDisplayDate(currentStart) : 'yyyy.MM.dd'}
        </span>
        <CalendarDays size={24} />
        <input
          ref={startRef}
          type="date"
          value={currentStart}
          max={currentEnd || undefined}
          onChange={(e) => {
            updateParam('startDate', e.target.value || undefined);
          }}
          className={styles.hiddenDateInput}
        />
      </label>

      <span className={`${typography.f16R} ${styles.separator}`}>~</span>

      <label
        className={styles.dateBox}
        onClick={(e) => {
          e.preventDefault();
          endRef.current?.showPicker();
        }}
      >
        <span className={`${typography.f16R} ${styles.dateBoxText}`}>
          {currentEnd ? formatDisplayDate(currentEnd) : 'yyyy.MM.dd'}
        </span>
        <CalendarDays size={24} />
        <input
          ref={endRef}
          type="date"
          value={currentEnd}
          min={currentStart || undefined}
          onChange={(e) => {
            updateParam('endDate', e.target.value || undefined);
          }}
          className={styles.hiddenDateInput}
        />
      </label>
    </div>
  );
}

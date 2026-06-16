import { MS_PER_DAY } from '@repo/utils';

export function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0] ?? '';
}

export function formatDisplayDate(dateStr: string): string {
  return dateStr.replaceAll('-', '.');
}

export function calcDayCount(start: string, end: string): number {
  return (
    Math.round(
      (new Date(end).getTime() - new Date(start).getTime()) / MS_PER_DAY,
    ) + 1
  );
}

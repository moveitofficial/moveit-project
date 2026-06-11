import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { HOURS_PER_DAY, MINUTES_PER_HOUR, MS_PER_MINUTE } from './constants';

/** ISO 문자열을 "YYYY.MM.DD" 형식으로 변환 */
export const formatDate = (iso: string): string =>
  format(new Date(iso), 'yyyy.MM.dd');

/** ISO 문자열을 상대시간("X분 전", "X시간 전") 또는 "YYYY.MM.DD"로 변환 */
export const formatRelativeTime = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();

  const minutes = Math.floor(diffMs / MS_PER_MINUTE);
  if (minutes < MINUTES_PER_HOUR) {
    return `${minutes}분 전`;
  }

  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  if (hours < HOURS_PER_DAY) {
    return `${hours}시간 전`;
  }

  return format(new Date(iso), 'yyyy.MM.dd');
};

/** ISO 문자열을 "YYYY.MM.DD 오후 hh:mm" 형식으로 변환 */
export const formatPaymentDateTime = (iso: string): string =>
  format(new Date(iso), 'yyyy.MM.dd a hh:mm', { locale: ko });

/** 결제 할부 개월 수를 표시 문자열로 변환 */
export const formatInstallment = (months: number): string =>
  months <= 1 ? '일시불' : `${months}개월 할부`;

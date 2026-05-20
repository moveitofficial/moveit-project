import { format } from 'date-fns';

/** ISO 문자열을 "YYYY.MM.DD" 형식으로 변환 */
export const formatDate = (iso: string): string =>
  format(new Date(iso), 'yyyy.MM.dd');

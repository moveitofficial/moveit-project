/** ISO 문자열을 "YY.MM.DD" / "HH:mm" 으로 분리 */
export function formatStamp(iso: string): { date: string; time: string } {
  const at = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  const year = String(at.getFullYear()).slice(2);
  return {
    date: `${year}.${pad(at.getMonth() + 1)}.${pad(at.getDate())}`,
    time: `${pad(at.getHours())}:${pad(at.getMinutes())}`,
  };
}

export function toManwon(won: number): string {
  return formatManwon(Math.floor(won / 10_000));
}

// 만원 단위 값을 레이블 문자열로 변환 (500→'500만', 10000→'1억', 15000→'1억5,000만')
export function formatManwon(manwon: number): string {
  if (manwon < 10_000) {
    return `${manwon.toLocaleString()}만`;
  }

  const eok = Math.floor(manwon / 10_000);
  const remaining = manwon % 10_000;

  return remaining === 0
    ? `${eok}억`
    : `${eok}억${remaining.toLocaleString()}만`;
}

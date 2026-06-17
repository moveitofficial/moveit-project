const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function toKstDate(date: Date): Date {
  const kst = new Date(date.getTime() + KST_OFFSET_MS);
  return new Date(
    Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate()),
  );
}

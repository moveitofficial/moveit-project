export function parseCookies(
  cookieHeader: string | undefined,
): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((pair): [string, string] => {
        const eqIndex = pair.indexOf('=');
        if (eqIndex === -1) return [pair.trim(), ''];
        return [
          pair.slice(0, eqIndex).trim(),
          decodeURIComponent(pair.slice(eqIndex + 1).trim()),
        ];
      })
      .filter(([key]) => key.length > 0),
  );
}

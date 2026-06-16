/**
 * 관리자 표시용(이름·이메일) 쿠키.
 * 서버(레이아웃)에서 읽어 Sidebar를 SSR로 그려, 새로고침 시 깜박임을 없애기 위함.
 * 인증은 별도 httpOnly 쿠키가 담당하며, 이건 민감정보가 아닌 표시용이다.
 *
 * 값은 base64로 저장한다. percent-encoding은 서버에서 쿠키를 헤더로 포워딩할 때
 * 디코드되어 비ASCII(한글)가 헤더에 들어가 ByteString 에러를 내기 때문.
 */
export const ADMIN_PROFILE_COOKIE = 'admin_profile';

export interface AdminProfile {
  name: string;
  email: string;
}

function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCodePoint(byte);
  }
  return btoa(binary);
}

function decodeBase64(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.codePointAt(0) ?? 0);
  return new TextDecoder().decode(bytes);
}

/** 로그인 시 저장 (클라이언트) */
export function setAdminProfileCookie(profile: AdminProfile) {
  const value = encodeBase64(JSON.stringify(profile));
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  // eslint-disable-next-line unicorn/no-document-cookie -- 표시용 쿠키, 라이브러리 미사용
  document.cookie = `${ADMIN_PROFILE_COOKIE}=${value}; path=/; SameSite=Lax${secure}`;
}

/** 로그아웃 시 제거 (클라이언트) */
export function clearAdminProfileCookie() {
  // eslint-disable-next-line unicorn/no-document-cookie -- 표시용 쿠키, 라이브러리 미사용
  document.cookie = `${ADMIN_PROFILE_COOKIE}=; path=/; max-age=0`;
}

/** 쿠키 값 파싱 (서버/클라이언트 공용) */
export function parseAdminProfileCookie(
  value: string | undefined,
): AdminProfile | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(decodeBase64(value)) as AdminProfile;
    return parsed.name && parsed.email ? parsed : null;
  } catch {
    return null;
  }
}

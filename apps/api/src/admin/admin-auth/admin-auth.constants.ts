/** JWT payload `typ` — refresh 엔드포인트에서 access 토큰과 구분 */
export const ADMIN_JWT_ACCESS_TYP = 'admin_access' as const;
export const ADMIN_JWT_REFRESH_TYP = 'admin_refresh' as const;

export const ADMIN_ACCESS_COOKIE_NAME = 'admin_moveit_access_token';
export const ADMIN_REFRESH_COOKIE_NAME = 'admin_moveit_refresh_token';

/** 쿠키 Max-Age(ms) — 아래 JWT `expiresIn`과 반드시 같게 유지 */
export const ADMIN_ACCESS_MAX_AGE_MS = 60 * 60 * 1000;
export const ADMIN_REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** JWT `expiresIn` — 위 Max-Age(ms)와 동일 기간 */
export const ADMIN_ACCESS_JWT_EXPIRES_IN = '1h' as const;
export const ADMIN_REFRESH_JWT_EXPIRES_IN = '7d' as const;

/** JWT payload `typ` — refresh 엔드포인트에서 access 토큰과 구분 */
export const JWT_ACCESS_TYP = 'access' as const;
export const JWT_REFRESH_TYP = 'refresh' as const;
export const JWT_OAUTH_STATE_TYP = 'oauth_state' as const;
export const JWT_OAUTH_SIGNUP_TYP = 'oauth_signup' as const;

export const ACCESS_COOKIE_NAME = 'moveit_access_token';
export const REFRESH_COOKIE_NAME = 'moveit_refresh_token';

/** 쿠키 Max-Age(ms) — 아래 JWT `expiresIn`과 반드시 같게 유지 */
export const ACCESS_MAX_AGE_MS = 60 * 60 * 1000;
export const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** JWT `expiresIn` — 위 Max-Age(ms)와 동일 기간 */
export const ACCESS_JWT_EXPIRES_IN = '1h' as const;
export const REFRESH_JWT_EXPIRES_IN = '7d' as const;
export const OAUTH_STATE_JWT_EXPIRES_IN = '10m' as const;
export const OAUTH_SIGNUP_JWT_EXPIRES_IN = '30m' as const;
export const OAUTH_SIGNUP_COOKIE_NAME = 'moveit_oauth_signup_token';
export const OAUTH_SIGNUP_COOKIE_MAX_AGE_MS = 30 * 60 * 1000;

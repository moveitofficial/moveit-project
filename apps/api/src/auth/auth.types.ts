import type { Role } from '@prisma/client';

export interface AuthPublicUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  profileImageUrl: string | null;
  isBlocked: boolean;
  isDeleted: boolean;
}

/**
 * 액세스 JWT payload — `JwtAccessStrategy.validate`가 검증 후 읽는 필드와 동일해야 함.
 * 로그인 시 `JwtService.sign`에는 `typ: JWT_ACCESS_TYP`을 넣는다.
 * (`typ`은 디코드 후 string으로만 보장되므로 타입은 string)
 */
export interface JwtAccessPayload {
  sub: string;
  email: string;
  role: Role;
  typ: string;
}

/**
 * 리프레시 JWT payload — `JwtRefreshStrategy.validate`에서 `typ`으로 access와 구분할 때 동일하게 사용.
 * (`typ`은 디코드 후 string으로만 보장되므로 타입은 string)
 */
export interface JwtRefreshPayload {
  sub: string;
  typ: string;
}

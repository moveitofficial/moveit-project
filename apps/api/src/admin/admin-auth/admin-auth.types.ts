/**
 * 어드민 access 토큰 payload
 * sub: 토큰 주인인 어드민의 DB id (uuid)
 * email:	어드민 이메일
 * isSuper:	슈퍼어드민 여부 (true/false)
 * typ: 토큰 종류 식별자 (admin_access)
 */

export interface AdminJwtAccessPayload {
  sub: string;
  email: string;
  isSuper: boolean;
  mustChangePassword: boolean;
  typ: string;
}

export interface AdminJwtRefreshPayload {
  sub: string;
  typ: string;
}

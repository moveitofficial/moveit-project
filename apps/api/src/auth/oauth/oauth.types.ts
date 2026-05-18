import type { AuthProvider, Role } from '@prisma/client';

export interface OAuthProfile {
  provider: AuthProvider;
  providerId: string;
  email: string | null;
  name: string | null;
  profileImageUrl?: string | null;
}

export type CreateOAuthUserParams = OAuthProfile & {
  role: Role;
};

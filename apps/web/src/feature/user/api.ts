// apps/web/src/feature/user/api.ts
import { api } from '@repo/fetcher';

import type { ApiSuccess } from '@/types/api';
import type { Role } from '@/types/enums';

export interface InterestCategory {
  group: string;
  category: string;
}

export interface ClientProfile {
  id: string;
  userId: string;
  nickname: string | null;
  interestCategories: InterestCategory[];
}

export interface MyUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  provider: 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER';
  profileImageUrl: string | null;
  region: string | null;
  phoneNumber: string | null;
  bankName: string | null;
  bankAccount: string | null;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: string;
  clientProfile: ClientProfile | null;
}

export function getMyUser() {
  return api.get<ApiSuccess<MyUser>>('/users/me');
}

export function patchMyUser(body: {
  region?: string;
  phoneNumber?: string;
  bankName?: string;
  bankAccount?: string;
}) {
  return api.patch<ApiSuccess<MyUser>>('/users/me', body);
}

export function patchClientProfile(body: {
  nickname?: string;
  interestCategories?: InterestCategory[];
}) {
  return api.patch<ApiSuccess<ClientProfile>>('/users/me/client-profile', body);
}

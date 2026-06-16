import { ApiError, api } from '@repo/fetcher';

import type { ApiSuccess } from '@/types/api';
import type { Role } from '@/types/enums';

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

export type AuthProvider = 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER';

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
  provider: AuthProvider;
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

export interface PatchMyUserBody {
  region?: string;
  phoneNumber?: string;
  bankName?: string;
  bankAccount?: string;
}

export interface PatchClientProfileBody {
  nickname?: string;
  interestCategories?: InterestCategory[];
}

async function multipartPatch<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new ApiError(
      response.status,
      error.message ?? '요청 중 오류가 발생했습니다.',
    );
  }

  const json = (await response.json()) as ApiSuccess<T>;
  return json.data;
}

export function getMyUser(): Promise<ApiSuccess<MyUser>> {
  return api.get<ApiSuccess<MyUser>>('/users/me');
}

export function patchMyUser(
  body: PatchMyUserBody,
): Promise<ApiSuccess<MyUser>> {
  return api.patch<ApiSuccess<MyUser>>('/users/me', body);
}

export function patchClientProfile(
  body: PatchClientProfileBody,
): Promise<ApiSuccess<ClientProfile>> {
  return api.patch<ApiSuccess<ClientProfile>>('/users/me/client-profile', body);
}

export function patchProfileImage(file: File): Promise<MyUser> {
  const formData = new FormData();
  formData.append('profileImage', file);
  return multipartPatch<MyUser>('/users/me/profile-image', formData);
}

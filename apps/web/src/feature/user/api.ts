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

export interface SpecialtyCategory {
  group: string;
  category: string;
}

export interface TechStack {
  name: string;
}

export interface ExpertProfile {
  id: string;
  userId: string;
  isApplied: boolean;
  isApproved: boolean;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  businessName: string | null;
  businessNumber: string | null;
  ceoName: string | null;
  contactTimeStart: string | null;
  contactTimeEnd: string | null;
  foundedYear: number | null;
  employeeMin: number | null;
  employeeMax: number | null;
  description: string | null;
  specialtyCategories: SpecialtyCategory[];
  techStacks: TechStack[];
  createdAt: string;
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
  expertProfile: ExpertProfile | null;
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

export interface PatchExpertProfileBody {
  businessName?: string;
  businessNumber?: string;
  ceoName?: string;
  contactTimeStart?: string;
  contactTimeEnd?: string;
  foundedYear?: string;
  employeeMin?: number;
  employeeMax?: number;
  description?: string;
  specialtyCategories?: SpecialtyCategory[];
  techStackNames?: string[];
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
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

export function patchExpertProfile(
  body: PatchExpertProfileBody,
): Promise<ApiSuccess<ExpertProfile>> {
  return api.patch<ApiSuccess<ExpertProfile>>(
    '/users/me/expert-profile',
    body,
  );
}

export function patchProfileImage(file: File): Promise<MyUser> {
  const formData = new FormData();
  formData.append('profileImage', file);
  return multipartPatch<MyUser>('/users/me/profile-image', formData);
}

export function patchPassword(
  body: ChangePasswordBody,
): Promise<ApiSuccess<Record<string, never>>> {
  return api.patch<ApiSuccess<Record<string, never>>>(
    '/users/me/password',
    body,
  );
}

import { api, ApiError } from '@repo/fetcher';

import type { User } from '@/feature/login/api';
import type { ApiSuccess } from '@/types/api';
import type { Role } from '@/types/enums';

export type OAuthSignUpResponse = ApiSuccess<{ user: User }>;

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
  role: Role;
}

export type SignUpResponse = ApiSuccess<{
  userId: string;
  role: Role;
  onboardingRequired: boolean;
}>;

export interface MeExpertProfile {
  businessName: string | null;
  businessNumber: string | null;
  ceoName: string | null;
  contactTimeStart: string | null;
  contactTimeEnd: string | null;
  foundedYear: string | null;
  employeeMin: number | null;
  employeeMax: number | null;
  description: string | null;
  specialtyCategories: unknown[];
  techStacks: unknown[];
}

export interface MeResponse {
  role: Role;
  name: string | null;
  // 포폴 등록 시 빈 프로필이 자동 생성될 수 있어, 존재 여부가 아닌 완성 여부로 판단
  expertProfile: MeExpertProfile | null;
}

export interface PortfolioListItem {
  id: string;
  title: string;
  thumbnailUrl: string | null;
}

export interface PortfolioListResponse {
  count: number;
  items: PortfolioListItem[];
}

export interface ClientProfileRequest {
  nickname: string;
  region: string;
  phoneNumber: string;
  bankName: string;
  bankAccount: string;
  interestCategories: { group: string; category: string }[];
}

export interface ExpertProfileRequest {
  businessName: string;
  businessNumber: string;
  ceoName: string;
  contactTimeStart: string;
  contactTimeEnd: string;
  foundedYear: string;
  employeeMin: number;
  employeeMax: number;
  description: string;
  region: string;
  phoneNumber: string;
  bankName: string;
  bankAccount: string;
  specialtyCategories: { group: string; category: string }[];
  techStackNames: string[];
}

export interface UploadedImage {
  key: string;
  url: string;
}

export interface UploadPortfolioImagesResponse {
  portfolioId: string;
  mainImage: UploadedImage;
  detailImages: UploadedImage[];
}

export interface PortfolioDetail {
  title: string;
  description: string;
  clientName: string;
  businessSector: string;
  images: { imgUrl: string; isMain: boolean }[];
  skills: { stackName: string; stackType: StackType }[];
}

export function oauthSignUp(role: Role): Promise<OAuthSignUpResponse> {
  return api.post<OAuthSignUpResponse>('/auth/oauth/signup', { role });
}

export function signUp(body: SignUpRequest): Promise<SignUpResponse> {
  return api.post<SignUpResponse>('/auth/signup', body);
}

export function getMe(): Promise<ApiSuccess<MeResponse>> {
  return api.get<ApiSuccess<MeResponse>>('/users/me');
}

export function getMyPortfolios(): Promise<ApiSuccess<PortfolioListResponse>> {
  return api.get<ApiSuccess<PortfolioListResponse>>('/users/me/portfolios');
}

export function applyExpertApproval(): Promise<ApiSuccess<unknown>> {
  return api.post<ApiSuccess<unknown>>('/users/me/expert-profiles/apply', {});
}

export function deletePortfolio(id: string): Promise<ApiSuccess<unknown>> {
  return api.delete<ApiSuccess<unknown>>(`/users/me/portfolios/${id}`);
}

export function createClientProfile(
  body: ClientProfileRequest,
): Promise<ApiSuccess<unknown>> {
  return api.post<ApiSuccess<unknown>>('/users/me/client-profiles', body);
}

export function createExpertProfile(
  body: ExpertProfileRequest,
): Promise<ApiSuccess<unknown>> {
  return api.post<ApiSuccess<unknown>>('/users/me/expert-profiles', body);
}

async function multipartPost<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
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

export function uploadPortfolioImages(
  mainImage: File,
  detailImages: File[],
): Promise<UploadPortfolioImagesResponse> {
  const formData = new FormData();
  formData.append('mainImage', mainImage);
  for (const file of detailImages) {
    formData.append('detailImages', file);
  }
  return multipartPost<UploadPortfolioImagesResponse>(
    '/portfolios/upload',
    formData,
  );
}

export type StackType = 'DESIGN' | 'FRONTEND' | 'BACKEND';

export interface PortfolioRequest {
  portfolioId: string;
  title: string;
  description: string;
  clientName: string;
  businessSector: string;
  images: { imgUrl: string; isMain: boolean }[];
  skills: { stackName: string; stackType: StackType }[];
}

export function createPortfolio(
  body: PortfolioRequest,
): Promise<ApiSuccess<unknown>> {
  return api.post<ApiSuccess<unknown>>('/users/me/portfolios', body);
}

export function getPortfolio(id: string): Promise<ApiSuccess<PortfolioDetail>> {
  return api.get<ApiSuccess<PortfolioDetail>>(`/portfolios/${id}`);
}

export function uploadPortfolioImage(
  portfolioId: string,
  image: File,
): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append('image', image);
  return multipartPost<UploadedImage>(
    `/portfolios/${portfolioId}/upload/image`,
    formData,
  );
}

export function updatePortfolio(
  id: string,
  body: Omit<PortfolioRequest, 'portfolioId'>,
): Promise<ApiSuccess<PortfolioDetail>> {
  return api.patch<ApiSuccess<PortfolioDetail>>(
    `/users/me/portfolios/${id}`,
    body,
  );
}

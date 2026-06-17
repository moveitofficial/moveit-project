import { ApiError, api } from '@repo/fetcher';

import type { ServiceCategoryId } from '@/feature/signup/components/common/serviceCategories';
import type { ServiceGroupId } from '@/feature/signup/components/common/serviceGroups';
import type { TechStackId } from '@/feature/signup/components/common/techStacks';
import type { ApiSuccess } from '@/types/api';

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
).replace(/\/$/, '');

interface UploadedImage {
  key: string;
  url: string;
}

// POST /services/upload 응답: serviceId(생성) + 업로드된 이미지 URL.
export interface UploadServiceImagesResponse {
  serviceId: string;
  mainImage: UploadedImage;
  detailImages: UploadedImage[];
}

export interface ServiceStep {
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface CreateServiceBody {
  serviceId: string;
  title: string;
  workDuration: number;
  revisionCount: number;
  serviceScope: string;
  servicePrice: number;
  description: string;
  preparationNotes: string;
  refundPolicy: string;
  mainImageUrl: string;
  images: { imgUrl: string }[];
  steps: ServiceStep[];
  faqs: ServiceFaq[];
  serviceGroup: ServiceGroupId;
  serviceCategory: ServiceCategoryId;
  techStackNames: TechStackId[];
}

// @repo/fetcher api는 FormData를 못 보내므로 멀티파트는 raw fetch.
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

export function uploadServiceImages(
  mainImage: File,
  detailImages: File[],
): Promise<UploadServiceImagesResponse> {
  const formData = new FormData();
  formData.append('mainImage', mainImage);
  for (const file of detailImages) {
    formData.append('detailImages', file);
  }
  return multipartPost<UploadServiceImagesResponse>(
    '/services/upload',
    formData,
  );
}

export function createService(
  body: CreateServiceBody,
): Promise<ApiSuccess<unknown>> {
  return api.post<ApiSuccess<unknown>>('/services', body);
}

// 편집 프리필용 상세 (GET /services/:id). techStacks는 name으로 내려온다.
export interface ServiceDetailResponse {
  id: string;
  title: string;
  workDuration: number;
  revisionCount: number;
  serviceScope: string;
  servicePrice: number;
  description: string;
  preparationNotes: string;
  refundPolicy: string;
  categoryRef: { group: ServiceGroupId; category: ServiceCategoryId };
  images: { id: string; imgUrl: string; isMain: boolean }[];
  steps: { id: string; title: string; description: string }[];
  faqs: { id: string; question: string; answer: string }[];
  techStacks: TechStackId[];
}

export function getService(
  serviceId: string,
): Promise<ApiSuccess<ServiceDetailResponse>> {
  return api.get<ApiSuccess<ServiceDetailResponse>>(`/services/${serviceId}`);
}

export function updateService(
  serviceId: string,
  body: Omit<CreateServiceBody, 'serviceId'>,
): Promise<ApiSuccess<unknown>> {
  return api.patch<ApiSuccess<unknown>>(`/services/${serviceId}`, body);
}

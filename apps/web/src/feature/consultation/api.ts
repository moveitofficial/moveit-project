import { api, ApiError } from '@repo/fetcher';

import type { ConsultationChatFile } from './types';
import type { ApiSuccess } from '@/mocks/types';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000').replace(
  /\/$/,
  '',
);

interface UploadConsultationFilesResponse {
  roomId: string;
  files: ConsultationChatFile[];
}

interface CreateConsultationRoomResponse {
  id: string;
}

async function authMultipartPost<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { message?: string };
    throw new ApiError(
      response.status,
      error.message ?? '요청 중 오류가 발생했습니다.',
    );
  }

  const json = (await response.json()) as ApiSuccess<T>;
  return json.data;
}

export async function uploadConsultationFiles(
  files: File[],
): Promise<UploadConsultationFilesResponse> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  return authMultipartPost<UploadConsultationFilesResponse>(
    '/consultation/rooms/new/upload',
    formData,
  );
}

export async function createConsultationRoom(params: {
  expertUserId: string;
  serviceId: string;
  content: string;
  roomId?: string;
  files?: ConsultationChatFile[];
}): Promise<CreateConsultationRoomResponse> {
  const response = await api.post<ApiSuccess<CreateConsultationRoomResponse>>(
    '/consultation/rooms',
    params,
  );

  return response.data;
}

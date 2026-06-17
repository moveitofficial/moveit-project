'use client';

import { ApiError } from '@repo/fetcher';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import {
  createService,
  updateService,
  uploadServiceImages,
  type CreateServiceBody,
} from './api';

// 편집 시 이미지: file이 있으면 새로 올릴 이미지, null이면 기존(url 유지).
export interface ServiceImageInput {
  file: File | null;
  url: string;
}

type ServiceFormBody = Omit<
  CreateServiceBody,
  'serviceId' | 'mainImageUrl' | 'images'
>;

interface CreateServiceParams {
  mainImage: File;
  detailImages: File[];
  // serviceId·mainImageUrl·images는 업로드 응답으로 채워진다.
  body: ServiceFormBody;
}

interface UpdateServiceParams {
  mainImage: ServiceImageInput;
  detailImages: ServiceImageInput[];
  body: ServiceFormBody;
}

export function useCreateService() {
  const router = useRouter();

  return useMutation<unknown, Error, CreateServiceParams>({
    mutationFn: async ({ mainImage, detailImages, body }) => {
      const uploaded = await uploadServiceImages(mainImage, detailImages);
      return createService({
        ...body,
        serviceId: uploaded.serviceId,
        mainImageUrl: uploaded.mainImage.url,
        images: uploaded.detailImages.map((image) => ({ imgUrl: image.url })),
      });
    },
    onSuccess: () => {
      router.push('/mypage');
    },
  });
}

export function useUpdateService(serviceId: string) {
  const router = useRouter();

  return useMutation<unknown, Error, UpdateServiceParams>({
    mutationFn: async ({ mainImage, detailImages, body }) => {
      const hasNewImage =
        mainImage.file !== null || detailImages.some((d) => d.file !== null);

      let mainImageUrl = mainImage.url;
      let images = detailImages.map((d) => ({ imgUrl: d.url }));

      // 업로드 엔드포인트가 메인+상세 묶음형이라, 이미지를 바꾸려면 전체를 새로 올려야 한다.
      if (hasNewImage) {
        const mainFile = mainImage.file;
        const detailFiles = detailImages.map((d) => d.file);
        if (
          mainFile === null ||
          detailFiles.length === 0 ||
          detailFiles.includes(null)
        ) {
          throw new ApiError(
            400,
            '이미지를 변경하려면 메인·상세 이미지를 모두 다시 등록해주세요.',
          );
        }
        const uploaded = await uploadServiceImages(
          mainFile,
          detailFiles.filter((file): file is File => file !== null),
        );
        mainImageUrl = uploaded.mainImage.url;
        images = uploaded.detailImages.map((image) => ({ imgUrl: image.url }));
      }

      return updateService(serviceId, { ...body, mainImageUrl, images });
    },
    onSuccess: () => {
      router.push('/mypage/services');
    },
  });
}

export function toCreateServiceErrorMessage(error: Error | null): string | null {
  if (error === null) return null;
  if (error instanceof ApiError && error.status < 500) {
    return error.message;
  }
  return '등록에 실패했습니다. 잠시 후 다시 시도해주세요.';
}

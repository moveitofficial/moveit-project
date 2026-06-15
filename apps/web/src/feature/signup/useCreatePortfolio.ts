'use client';

import { ApiError } from '@repo/fetcher';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import {
  createPortfolio,
  uploadPortfolioImages,
  type PortfolioRequest,
} from './api';

interface CreatePortfolioParams {
  mainImage: File;
  detailImages: File[];
  body: Omit<PortfolioRequest, 'portfolioId' | 'images'>;
}

export function useCreatePortfolio() {
  const router = useRouter();

  return useMutation<unknown, Error, CreatePortfolioParams>({
    mutationFn: async ({ mainImage, detailImages, body }) => {
      const uploaded = await uploadPortfolioImages(mainImage, detailImages);
      return createPortfolio({
        ...body,
        portfolioId: uploaded.portfolioId,
        images: [
          { imgUrl: uploaded.mainImage.url, isMain: true },
          ...uploaded.detailImages.map((img) => ({
            imgUrl: img.url,
            isMain: false,
          })),
        ],
      });
    },
    onSuccess: () => {
      router.push('/signup/expert/portfolio'); // 목록으로 → 거기서 다시 조회
    },
  });
}

export function toCreatePortfolioErrorMessage(
  error: Error | null,
): string | null {
  if (error === null) return null;
  if (error instanceof ApiError && error.status < 500) {
    return error.message;
  }
  return '등록에 실패했습니다. 잠시 후 다시 시도해주세요.';
}

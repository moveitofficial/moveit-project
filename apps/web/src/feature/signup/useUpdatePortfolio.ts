'use client';

import { ApiError } from '@repo/fetcher';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import {
  updatePortfolio,
  uploadPortfolioImage,
  type PortfolioDetail,
  type PortfolioRequest,
} from './api';

import type { ApiSuccess } from '@/types/api';


interface ImageInput {
  file: File | null; // null이면 기존 이미지(업로드 불필요)
  url: string;
}

interface UpdatePortfolioParams {
  portfolioId: string;
  mainImage: ImageInput;
  detailImages: ImageInput[];
  body: Omit<PortfolioRequest, 'portfolioId' | 'images'>;
}

export function useUpdatePortfolio() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ApiSuccess<PortfolioDetail>, Error, UpdatePortfolioParams>({
    mutationFn: async ({ portfolioId, mainImage, detailImages, body }) => {
      // 새 이미지(file 있음)만 업로드, 기존은 url 그대로
      const uploadIfNew = async (img: ImageInput): Promise<string> => {
        if (!img.file) return img.url;
        const { url } = await uploadPortfolioImage(portfolioId, img.file);
        return url;
      };

      const mainUrl = await uploadIfNew(mainImage);
      const detailUrls = await Promise.all(
        detailImages.map((img) => uploadIfNew(img)),
      );

      return updatePortfolio(portfolioId, {
        ...body,
        images: [
          { imgUrl: mainUrl, isMain: true },
          ...detailUrls.map((imgUrl) => ({ imgUrl, isMain: false })),
        ],
      });
    },
    onSuccess: (data, { portfolioId }) => {
      // 응답으로 상세 캐시를 갱신 → 재진입 시 깜빡임 없이 최신 데이터 표시
      queryClient.setQueryData(['portfolio', portfolioId], data);
      router.push('/signup/expert/portfolio');
    },
  });
}

export function toUpdatePortfolioErrorMessage(
  error: Error | null,
): string | null {
  if (error === null) return null;
  if (error instanceof ApiError && error.status < 500) {
    return error.message;
  }
  return '수정에 실패했습니다. 잠시 후 다시 시도해주세요.';
}

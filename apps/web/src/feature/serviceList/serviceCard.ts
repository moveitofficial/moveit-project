import type { ServiceListServiceItem } from './types';
import type { TechStackName } from '@/mocks/types';
import type { CardService } from '@repo/ui/Card';

import { mockExpertList } from '@/mocks/experts';
import { getTechStackLabel } from '@/mocks/metadata';

export function toCardService(service: ServiceListServiceItem): CardService {
  return {
    id: service.id,
    title: service.title,
    price: service.servicePrice,
    duration: service.workDuration,
    revisionCount: service.revisionCount,
    thumbnailUrl: service.thumbnailUrl,
    expert: {
      id: service.expert.id,
      name: service.expert.name,
      companyName: service.expert.companyName,
    },
    category: {
      type: service.categoryRef.group,
      detail: service.categoryRef.category,
    },
    rating: service.rating,
    reviewCount: service.reviewCount,
    isFavorite: service.isFavorite,
  };
}

export function getExpertTechStackLabels(expertId: string): string[] {
  const expert = mockExpertList.find((item) => item.id === expertId);
  const stacks = expert?.techStacks ?? [];

  return stacks.slice(0, 3).map((name: TechStackName) => getTechStackLabel(name));
}

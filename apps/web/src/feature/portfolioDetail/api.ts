import { api, ApiError, publicApi } from '@repo/fetcher';

import type { PortfolioModalExpertContext } from './types';
import type {
  ApiSuccess,
  BusinessSector,
  PortfolioDetail,
  PortfolioListItem,
  PortfolioSkill,
  ServiceImage,
  StackType,
  TechStackName,
} from '@/mocks/types';

import { fetchExpertProfileSummary } from '@/utils/expertContactTime';

const PORTFOLIO_FALLBACK_THUMBNAIL =
  'https://picsum.photos/seed/moveit-fallback/400/300';

interface PortfolioImageApi {
  id: string;
  imgUrl: string;
  isMain: boolean;
}

interface PortfolioSkillApi {
  stackName: string;
  stackType: StackType;
}

interface PortfolioDetailApi {
  id: string;
  title: string;
  description: string;
  clientName: string;
  businessSector: BusinessSector;
  images: PortfolioImageApi[];
  skills: PortfolioSkillApi[];
}

interface PortfolioListItemApi {
  id: string;
  title: string;
  thumbnailUrl: string | null;
}

interface PortfolioListApi {
  count: number;
  items: PortfolioListItemApi[];
}

function resolveThumbnailUrl(thumbnailUrl: string): string {
  return thumbnailUrl.trim().length > 0
    ? thumbnailUrl
    : PORTFOLIO_FALLBACK_THUMBNAIL;
}

function mapPortfolioImages(images: PortfolioImageApi[]): ServiceImage[] {
  return images.map((image) => ({
    id: image.id,
    url: resolveThumbnailUrl(image.imgUrl),
    isMain: image.isMain,
  }));
}

function mapPortfolioSkill(skill: PortfolioSkillApi): PortfolioSkill {
  return {
    stackName: skill.stackName as TechStackName,
    stackType: skill.stackType,
  };
}

function mapPortfolioDetail(data: PortfolioDetailApi): PortfolioDetail {
  const images = mapPortfolioImages(data.images);
  const mainImage = images.find((image) => image.isMain) ?? images[0];

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    clientName: data.clientName,
    businessSector: data.businessSector,
    thumbnailUrl: mainImage?.url ?? PORTFOLIO_FALLBACK_THUMBNAIL,
    skills: data.skills.map((skill) => mapPortfolioSkill(skill)),
    images,
  };
}

function mapPortfolioListItem(item: PortfolioListItemApi): PortfolioListItem {
  return {
    id: item.id,
    title: item.title,
    thumbnailUrl: resolveThumbnailUrl(item.thumbnailUrl ?? ''),
    clientName: '',
    businessSector: 'PUBLIC_INSTITUTION',
  };
}

export async function getPortfolioDetail(
  portfolioId: string,
): Promise<PortfolioDetail | null> {
  try {
    const response = await publicApi.get<ApiSuccess<PortfolioDetailApi>>(
      `/portfolios/${portfolioId}`,
    );

    return mapPortfolioDetail(response.data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function getExpertPortfolioList(
  expertUserId: string,
): Promise<PortfolioListItem[]> {
  try {
    const response = await api.get<ApiSuccess<PortfolioListApi>>(
      `/users/${expertUserId}/portfolios`,
    );

    return response.data.items.map((item) => mapPortfolioListItem(item));
  } catch {
    return [];
  }
}

export async function getPortfolioModalExpertContext(
  expertUserId: string,
): Promise<PortfolioModalExpertContext> {
  return fetchExpertProfileSummary(expertUserId);
}

import { Card, type CardService } from '@repo/ui/Card';
import { type Route } from 'next';
import Link from 'next/link';

import * as styles from './page.css';

import type { CommunityPost } from '@/mocks/types';

import { CommunityCard } from '@/components/common/CommunityCard';
import { ExpertCard } from '@/components/common/ExpertCard';
import {
  getMainSections,
  getPopularPosts,
  getRecentServices,
  getRecentlyViewedServices,
  getRecommendedByInterest,
  getServicesByRegion,
  type MainExpertItem,
  type MainServiceItem,
  type PopularPost,
} from '@/feature/main/api';
import { BottomBanner } from '@/feature/main/components/BottomBanner';
import { Browse } from '@/feature/main/components/Browse';
import { Hero } from '@/feature/main/components/Hero';
import { Showcase } from '@/feature/main/components/Showcase';
import { StripBanner } from '@/feature/main/components/StripBanner';
import { buildServiceDetailHref } from '@/feature/serviceDetail/utils';
import { getMe } from '@/feature/signup/api';
import { getTechStackLabel } from '@/mocks/metadata';

const toCardService = (s: MainServiceItem): CardService => ({
  id: s.id,
  title: s.title,
  price: s.servicePrice,
  duration: s.workDuration,
  revisionCount: s.revisionCount,
  thumbnailUrl: s.thumbnailUrl,
  expert: {
    id: s.expert.id,
    name: s.expert.name,
    companyName: s.expert.companyName,
  },
  category: {
    type: s.categoryRef.group,
    detail: s.categoryRef.category,
  },
  rating: s.rating,
  reviewCount: s.reviewCount,
  isFavorite: false,
});

const toCommunityPost = (p: PopularPost): CommunityPost => ({
  id: p.id,
  category: p.category,
  title: p.title,
  content: p.content,
  author: { id: p.userId, name: p.authorDisplayName, profileImageUrl: p.authorProfileImageUrl },
  likeCount: p.likeCount,
  commentCount: p.commentCount,
  viewCount: 0,
  isLiked: false,
  createdAt: p.createdAt,
});

const toExpertCardExpert = (e: MainExpertItem) => ({
  name: e.businessName ?? e.name ?? '',
  description: '',
  profileImageUrl: e.profileImageUrl,
  techStacks: e.techStacks.map((name) => getTechStackLabel(name)),
  stats: { averageRating: e.rating, totalReviews: e.reviewCount },
});

function serviceCards(items: MainServiceItem[]) {
  return items.map((s) => (
    <Link
      key={s.id}
      href={buildServiceDetailHref(s.id, s.categoryRef.group)}
      className={styles.cardLink}
    >
      <Card
        service={toCardService(s)}
        expertTechStacks={s.techStacks.map((name) => getTechStackLabel(name))}
      />
    </Link>
  ));
}

export default async function Home() {
  const me = await getMe().catch(() => null);
  const isClient = me?.data.role === 'CLIENT';
  const displayName = me?.data.name ?? '회원';

  const [sectionsRes, recentRes, postsRes, recommendedRes, regionRes, viewedRes] =
    await Promise.all([
      getMainSections(),
      getRecentServices(),
      getPopularPosts(),
      isClient
        ? getRecommendedByInterest().catch(() => null)
        : Promise.resolve(null),
      isClient
        ? getServicesByRegion().catch(() => null)
        : Promise.resolve(null),
      isClient
        ? getRecentlyViewedServices().catch(() => null)
        : Promise.resolve(null),
    ]);

  const sections = sectionsRes.data;
  const recentServices = recentRes.data;
  const popularPosts = postsRes.data;
  const recommended = recommendedRes?.data ?? [];
  const regionServices = regionRes?.data ?? [];
  const recentlyViewed = viewedRes?.data ?? [];

  return (
    <main className={styles.container}>
      <Hero />
      <Browse />

      {recommended.length > 0 && (
        <Showcase
          title={`${displayName}님의 관심 분야 추천 서비스`}
          description="관심 분야를 기반으로 추천해요"
        >
          <div className={styles.cardList}>{serviceCards(recommended)}</div>
        </Showcase>
      )}
      {regionServices.length > 0 && (
        <Showcase
          title={`${displayName}님의 지역 추천 서비스`}
          description="가까운 전문가의 서비스"
        >
          <div className={styles.cardList}>{serviceCards(regionServices)}</div>
        </Showcase>
      )}
      {recentlyViewed.length > 0 && (
        <Showcase title={`${displayName}님이 최근 본 서비스`}>
          <div className={styles.cardList}>{serviceCards(recentlyViewed)}</div>
        </Showcase>
      )}

      <Showcase
        title="가장 많이 찾는 IT 코칭"
        description="이번 주 인기 TOP 4"
        viewAllHref="/it-coaching"
      >
        <div className={styles.cardList}>
          {serviceCards(sections.popularItCoaching)}
        </div>
      </Showcase>

      {sections.banner && (
        <StripBanner
          imageUrl={sections.banner.imageUrl}
          actionUrl={sections.banner.actionUrl as Route}
        />
      )}

      <Showcase
        title="가장 많이 찾는 프로젝트 의뢰"
        description="이번 주 인기 TOP 4"
        viewAllHref="/project-request"
      >
        <div className={styles.cardList}>
          {serviceCards(sections.popularProjectRequest)}
        </div>
      </Showcase>

      <div className={styles.newService}>
        <div className={styles.newServiceInner}>
          <Showcase
            title="새로 등록된 서비스"
            description="지금 막 등록된 따근한 서비스"
            spacing="none"
          >
            <div className={styles.cardList}>
              {serviceCards(recentServices)}
            </div>
          </Showcase>
        </div>
      </div>

      <Showcase title="MOVIT 인기 게시글" viewAllHref="/community">
        <div className={styles.communityList}>
          {popularPosts.map((post) => (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className={styles.communityCardLink}
            >
              <CommunityCard post={toCommunityPost(post)} />
            </Link>
          ))}
        </div>
      </Showcase>

      <Showcase title="MOVIT 인기 프로젝트 의뢰 전문가">
        <div className={styles.cardList}>
          {sections.moveitPopularProjectExpert.map((expert) => (
            <Link
              key={expert.userId}
              href={`/experts/${expert.userId}`}
              className={styles.cardLink}
            >
              <ExpertCard expert={toExpertCardExpert(expert)} />
            </Link>
          ))}
        </div>
      </Showcase>

      <Showcase title="MOVIT 인기 코칭">
        <div className={styles.cardList}>
          {sections.moveitPopularCoaching.map((expert) => (
            <Link
              key={expert.userId}
              href={`/experts/${expert.userId}`}
              className={styles.cardLink}
            >
              <ExpertCard expert={toExpertCardExpert(expert)} />
            </Link>
          ))}
        </div>
      </Showcase>

      <BottomBanner />
    </main>
  );
}

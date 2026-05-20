import { Card, type CardService } from '@repo/ui/Card';
import { type Route } from 'next';

import { mockCommunityPosts } from '../mocks/community';
import { mockMainData } from '../mocks/main';

import * as styles from './page.css';

import type { ServiceListItem } from '@/mocks/types';

import { CommunityCard } from '@/components/common/CommunityCard';
import { Browse } from '@/feature/main/components/Browse';
import { Hero } from '@/feature/main/components/Hero';
import { Showcase } from '@/feature/main/components/Showcase';
import { StripBanner } from '@/feature/main/components/StripBanner';

const toCardService = (s: ServiceListItem): CardService => ({
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
  isFavorite: s.isFavorite,
});

export default function Home() {
  const itCoachingSection = mockMainData.sections.find(
    (s) => s.sectionType === 'POPULAR_IT_COACHING',
  );
  const itCoachingServices =
    itCoachingSection?.targetType === 'SERVICE' ? itCoachingSection.items : [];

  const stripBannerData = mockMainData.banners[0];

  const projectRequestSection = mockMainData.sections.find(
    (s) => s.sectionType === 'POPULAR_PROJECT_REQUEST',
  );
  const projectRequestServices =
    projectRequestSection?.targetType === 'SERVICE'
      ? projectRequestSection.items
      : [];

  const newServices = mockMainData.newServices;

  const popularPosts = mockCommunityPosts.slice(0, 3);

  return (
    <main className={styles.container}>
      <Hero />
      <Browse />
      <Showcase
        title="가장 많이 찾는 IT 코칭"
        description="이번 주 인기 TOP 4"
        viewAllHref="/"
      >
        <div className={styles.cardList}>
          {itCoachingServices.map((service) => (
            <Card
              key={service.id}
              service={toCardService(service)}
              expertTechStacks={['React', 'Next.js', 'TypeScript']}
            />
          ))}
        </div>
      </Showcase>
      {stripBannerData && (
        <StripBanner
          imageUrl={stripBannerData.imageUrl}
          actionUrl={stripBannerData.actionUrl as Route}
        />
      )}
      <Showcase
        title="가장 많이 찾는 프로젝트 의뢰"
        description="이번 주 인기 TOP 4"
        viewAllHref="/"
      >
        <div className={styles.cardList}>
          {projectRequestServices.map((service) => (
            <Card
              key={service.id}
              service={toCardService(service)}
              expertTechStacks={['React', 'Next.js', 'TypeScript']}
            />
          ))}
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
              {newServices.map((service) => (
                <Card
                  key={service.id}
                  service={toCardService(service)}
                  expertTechStacks={['React', 'Next.js', 'TypeScript']}
                />
              ))}
            </div>
          </Showcase>
        </div>
      </div>
      <Showcase title="MOVIT 인기 게시글" viewAllHref="/">
        <div className={styles.communityList}>
          {popularPosts.map((post) => (
            <CommunityCard key={post.id} post={post} />
          ))}
        </div>
      </Showcase>
    </main>
  );
}

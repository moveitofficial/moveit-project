'use client';

import servicesEmptyIllustration from '@public/expertDetail/servicesEmpty.svg';
import { Card } from '@repo/ui/Card';
import Image from 'next/image';
import Link from 'next/link';

import * as viewStyles from '../ExpertDetailView/ExpertDetailView.css';

import type {
  ExpertDetailPageData,
  ExpertDetailViewerRole,
} from '../../types';
import type { ServiceListItem } from '@/mocks/types';
import type { CardService } from '@repo/ui/Card';

import { PortfolioCardGrid } from '@/feature/portfolioDetail/components/PortfolioCardGrid';
import { buildServiceDetailHref } from '@/feature/serviceDetail/utils';
import { getTechStackLabel } from '@/mocks/metadata';

interface Props {
  data: ExpertDetailPageData;
  viewer: ExpertDetailViewerRole;
}

function buildCardService(service: ServiceListItem): CardService {
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

export default function ExpertDetailSections({ data, viewer }: Props) {
  const { expert, portfolios, services, portfolioExpertContext } = data;

  return (
    <div className={viewStyles.contentInner}>
      <section className={viewStyles.section}>
        <div className={viewStyles.sectionHeader}>
          <h2 className={viewStyles.sectionTitle}>포트폴리오</h2>
          {viewer === 'owner' ? (
            <div className={viewStyles.sectionHeaderActions}>
              <Link href="/mypage/portfolios" className={viewStyles.sectionActionLink}>
                포트폴리오 편집
              </Link>
            </div>
          ) : null}
        </div>
        <div className={viewStyles.portfolioGridWrap}>
          <PortfolioCardGrid
            portfolios={portfolios}
            expert={portfolioExpertContext}
            expertUserId={expert.id}
            size="large"
          />
        </div>
      </section>

      <section className={viewStyles.section}>
        <div className={viewStyles.sectionHeader}>
          <h2 className={viewStyles.sectionTitle}>판매중 서비스</h2>
          {viewer === 'owner' ? (
            <Link href="/mypage/services" className={viewStyles.sectionActionLink}>
              서비스 관리
            </Link>
          ) : null}
        </div>

        {services.length === 0 ? (
          <div className={viewStyles.emptyServices}>
            <Image
              src={servicesEmptyIllustration}
              alt=""
              width={320}
              height={168}
              className={viewStyles.emptyServicesIllustration}
            />
            <p className={viewStyles.emptyServicesText}>
              아직 준비중이에요
              <br />
              곧 좋은 서비스로 찾아뵐게요!
            </p>
          </div>
        ) : (
          <div className={viewStyles.serviceGrid}>
            {services.map((service) => {
              const techStacks = expert.techStacks.slice(0, 3);

              return (
                <Link
                  key={service.id}
                  href={buildServiceDetailHref(
                    service.id,
                    service.categoryRef.group,
                  )}
                  className={viewStyles.serviceCardLink}
                >
                  <Card
                    service={buildCardService(service)}
                    expertTechStacks={techStacks.map((stack) =>
                      getTechStackLabel(stack),
                    )}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

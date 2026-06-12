import { Card } from '@repo/ui/Card';
import Link from 'next/link';

import { buildServiceDetailHref } from '../../utils';
import * as sectionStyles from '../ServiceDetailView/ServiceDetailView.css';

import * as styles from './RelatedServicesSection.css';

import type { ServiceListItem, TechStackName } from '@/mocks/types';
import type { CardService } from '@repo/ui/Card';

import { getTechStackLabel } from '@/mocks/metadata';


interface Props {
  services: ServiceListItem[];
  techStacksByServiceId?: Partial<Record<string, TechStackName[]>>;
}

function buildRelatedCardService(service: ServiceListItem): CardService {
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

export default function RelatedServicesSection({
  services,
  techStacksByServiceId = {},
}: Props) {
  if (services.length === 0) {
    return null;
  }

  return (
    <section className={sectionStyles.section}>
      <h2 className={sectionStyles.sectionTitle}>이 전문가의 다른 서비스</h2>
      <div className={styles.cardList}>
        {services.map((service) => {
          const techStacks = (techStacksByServiceId[service.id] ?? []).slice(
            0,
            3,
          );

          return (
            <Link
              key={service.id}
              href={buildServiceDetailHref(
                service.id,
                service.categoryRef.group,
              )}
              className={styles.cardLink}
            >
              <Card
                service={buildRelatedCardService(service)}
                expertTechStacks={techStacks.map((stack) =>
                  getTechStackLabel(stack),
                )}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

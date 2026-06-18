import { RelatedServicesSection } from '../RelatedServicesSection';
import { ServiceDescriptionSection } from '../ServiceDescriptionSection';
import { ServiceDetailHero } from '../ServiceDetailHero';
import { ServiceDetailSidebar } from '../ServiceDetailSidebar';
import { ServiceDetailTabs } from '../ServiceDetailTabs';
import { ServiceFaqSection } from '../ServiceFaqSection';
import { ServicePortfolioSection } from '../ServicePortfolioSection';
import { ServiceRefundSection } from '../ServiceRefundSection';
import { ServiceReviewSection } from '../ServiceReviewSection';

import * as styles from './ServiceDetailView.css';

import type { ServiceDetailPageData, ServiceDetailViewerRole } from '../../types';

interface Props {
  data: ServiceDetailPageData;
  viewerRole: ServiceDetailViewerRole;
}

export default function ServiceDetailView({ data, viewerRole }: Props) {
  const {
    service,
    portfolios,
    portfoliosHasMore,
    reviewsHasMore,
    relatedServiceTechStacks,
  } = data;

  return (
    <div className={styles.page}>
      <div className={styles.heroBand}>
        <div className={styles.heroInner}>
          <ServiceDetailHero data={data} viewerRole={viewerRole} />
        </div>
      </div>

      <div className={styles.contentRow}>
        <div className={styles.mainColumn}>
          <ServiceDetailTabs />
          <ServicePortfolioSection
            expertUserId={service.expert.id}
            serviceId={service.id}
            expert={{
              companyName: service.expert.companyName,
              contactTime: data.contactTime,
            }}
            portfolios={portfolios}
            hasMore={portfoliosHasMore}
          />
          <ServiceDescriptionSection service={service} />
          <ServiceFaqSection faqs={service.faqs} />
          <ServiceRefundSection refundPolicy={service.refundPolicy} />
          <ServiceReviewSection
            serviceId={service.id}
            initialReviews={service.reviews.items}
            initialTotalCount={service.reviews.totalCount}
            initialAverageRating={service.reviews.averageRating}
            initialHasMore={reviewsHasMore}
          />
        </div>

        <div className={styles.sidebarColumn}>
          <ServiceDetailSidebar
            service={service}
            viewerRole={viewerRole}
            contactTime={data.contactTime}
            totalAmount={data.totalAmount}
          />
        </div>
      </div>

      <RelatedServicesSection
        services={service.recommendedServices}
        techStacksByServiceId={relatedServiceTechStacks}
      />
    </div>
  );
}

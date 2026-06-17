import starFill from '@public/Card/starFill.svg';
import { Star } from 'lucide-react';
import Image from 'next/image';

import { buildServiceDetailBreadcrumb } from '../../utils';

import ServiceDetailFavoriteButton from './ServiceDetailFavoriteButton';
import * as styles from './ServiceDetailHero.css';

import type { ServiceDetailPageData, ServiceDetailViewerRole } from '../../types';

import { getTechStackLabel } from '@/mocks/metadata';

interface Props {
  data: ServiceDetailPageData;
  viewerRole: ServiceDetailViewerRole;
}

function getExpertInitials(companyName: string): string {
  const compact = companyName.replaceAll(' ', '');
  return compact.slice(0, 2);
}

function RatingStars({ rating }: { rating: number }) {
  const filledCount = Math.round(rating);

  return (
    <span className={styles.starList} aria-hidden>
      {Array.from({ length: 5 }, (_, index) => {
        const isFilled = index < filledCount;

        if (isFilled) {
          return (
            <Image
              key={index}
              src={starFill}
              alt=""
              width={16}
              height={16}
              className={styles.starIcon}
            />
          );
        }

        return <Star key={index} size={16} className={styles.starIconEmpty} />;
      })}
    </span>
  );
}

export default function ServiceDetailHero({ data, viewerRole }: Props) {
  const { service, expertStats, orderCount, favoriteCount, contactTime } = data;
  const { groupLabel, categoryLabel } = buildServiceDetailBreadcrumb(
    service.categoryRef,
  );
  const mainImage =
    service.images.find((image) => image.isMain) ?? service.images[0];
  const showFavorite = viewerRole !== 'owner';
  const isNewService = orderCount === 0 && service.reviews.totalCount === 0;
  const topTechStack = service.techStacks[0];

  return (
    <section className={styles.hero}>
      <div className={styles.heroMain}>
        <div className={styles.heroContent}>
          <div className={styles.topRow}>
            <p className={styles.breadcrumb}>
              {groupLabel} &gt; {categoryLabel}
              {topTechStack === undefined
                ? null
                : ` > ${getTechStackLabel(topTechStack)}`}
            </p>

            {showFavorite ? (
              <ServiceDetailFavoriteButton
                initialFavorite={service.isFavorite}
                favoriteCount={favoriteCount}
              />
            ) : null}
          </div>

          <h1 className={styles.title}>{service.title}</h1>

          {isNewService ? (
            <p className={styles.newServiceNote}>
              새롭게 등록된 서비스로, 더욱 빠르고 유연한 맞춤 진행이 가능합니다.
            </p>
          ) : (
            <div className={styles.statsRow}>
              <div className={styles.ratingGroup}>
                <RatingStars rating={service.reviews.averageRating} />
                <p className={styles.ratingText}>
                  {service.reviews.averageRating.toFixed(1)}(
                  {service.reviews.totalCount.toLocaleString()})
                </p>
              </div>
              <p className={styles.statText}>
                누적 판매 {orderCount.toLocaleString()}건
              </p>
              <p className={styles.purchaseRate}>
                구매율 {expertStats.purchaseRate}%
              </p>
            </div>
          )}
        </div>

        <div className={styles.expertBanner}>
          <div className={styles.expertAvatar}>
            {getExpertInitials(service.expert.companyName)}
          </div>
          <div className={styles.expertInfo}>
            <p className={styles.expertName}>{service.expert.companyName}</p>
            <p className={styles.expertHours}>
              연락가능 시간 : {contactTime.start} ~ {contactTime.end}
            </p>
          </div>
        </div>
      </div>

      {mainImage === undefined ? null : (
        <div className={styles.heroImageWrapper}>
          <Image
            src={mainImage.url}
            alt={service.title}
            width={360}
            height={272}
            className={styles.heroImage}
          />
        </div>
      )}
    </section>
  );
}

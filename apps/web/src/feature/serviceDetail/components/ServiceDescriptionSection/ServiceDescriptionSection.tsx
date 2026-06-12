import Image from 'next/image';

import { parseDescriptionSections } from '../../utils';
import * as sectionStyles from '../ServiceDetailView/ServiceDetailView.css';

import ServiceDescriptionExpandable from './ServiceDescriptionExpandable';
import * as styles from './ServiceDescriptionSection.css';

import type { ServiceDetail } from '@/mocks/types';

interface Props {
  service: ServiceDetail;
}

export default function ServiceDescriptionSection({ service }: Props) {
  const { recommendedLines, bodyParagraphs } = parseDescriptionSections(
    service.description,
  );
  const detailImages = service.images.filter((image) => !image.isMain);

  const hasExpandableContent =
    bodyParagraphs.length > 0 ||
    service.steps.length > 0 ||
    (service.preparationNotes !== null && service.preparationNotes.length > 0) ||
    detailImages.length > 0;

  return (
    <section id="description" className={sectionStyles.section}>
      <h2 className={sectionStyles.sectionTitle}>서비스 설명</h2>

      {recommendedLines.length > 0 ? (
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>이런 분께 추천드려요</h3>
          <ul className={styles.bulletList}>
            {recommendedLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasExpandableContent ? (
        <ServiceDescriptionExpandable>
          {bodyParagraphs.length > 0 ? (
            <div className={styles.block}>
              {bodyParagraphs.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}

          {service.steps.length > 0 ? (
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>이렇게 진행합니다</h3>
              <div className={styles.stepGrid}>
                {service.steps.map((step) => (
                  <article key={step.order} className={styles.stepCard}>
                    <p className={styles.stepLabel}>STEP {step.order}</p>
                    <p className={styles.stepTitle}>{step.title}</p>
                    <p className={styles.stepDescription}>
                      {step.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {service.preparationNotes !== null &&
          service.preparationNotes.length > 0 ? (
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>준비해 오시면 좋아요</h3>
              <div className={styles.preparationBox}>
                <p className={styles.preparationText}>
                  {service.preparationNotes}
                </p>
              </div>
            </div>
          ) : null}

          {detailImages.length > 0 ? (
            <div className={styles.detailImageList}>
              {detailImages.map((image) => (
                <Image
                  key={image.id}
                  src={image.url}
                  alt=""
                  width={800}
                  height={600}
                  className={styles.detailImage}
                />
              ))}
            </div>
          ) : null}
        </ServiceDescriptionExpandable>
      ) : null}
    </section>
  );
}

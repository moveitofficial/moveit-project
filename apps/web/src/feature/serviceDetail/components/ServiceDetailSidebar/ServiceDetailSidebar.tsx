import Link from 'next/link';

import * as styles from './ServiceDetailSidebar.css';
import ServiceDetailSidebarClientActions from './ServiceDetailSidebarClientActions';


import type { ServiceDetailViewerRole } from '../../types';
import type { ConsultationInquiryContext } from '@/feature/consultation/types';
import type { ServiceDetail } from '@/mocks/types';

import { getTechStackLabel } from '@/mocks/metadata';

interface Props {
  service: ServiceDetail;
  viewerRole: ServiceDetailViewerRole;
  contactTime: ConsultationInquiryContext['contactTime'];
  totalAmount: number;
}

export default function ServiceDetailSidebar({
  service,
  viewerRole,
  contactTime,
  totalAmount,
}: Props) {
  const consultationContext: ConsultationInquiryContext = {
    expertUserId: service.expert.id,
    serviceId: service.id,
    companyName: service.expert.companyName,
    contactTime,
  };

  const isCoaching = service.categoryRef.group === 'IT_COACHING';
  const priceUnit = isCoaching ? '원 / 한달' : '원';
  const durationLabel = isCoaching ? '월기준' : '작업 기간';

  return (
    <aside>
      <div className={styles.card}>
        <p className={styles.priceLabel}>기본가격</p>
        <div className={styles.priceRow}>
          <p className={styles.priceValue}>
            {service.servicePrice.toLocaleString()}
          </p>
          <p className={styles.priceUnit}>{priceUnit}</p>
        </div>

        <div className={styles.infoBox}>
          <div className={styles.infoRow}>
            <p className={styles.infoLabel}>{durationLabel}</p>
            <p className={styles.infoValue}>{service.workDuration}일</p>
          </div>
          <div className={styles.infoRow}>
            <p className={styles.infoLabel}>수정 횟수</p>
            <p className={styles.infoValue}>{service.revisionCount}회</p>
          </div>
          <div className={styles.infoRow}>
            <p className={styles.infoLabel}>제공 범위</p>
            <p className={styles.infoValue}>{service.serviceScope}</p>
          </div>
        </div>

        {viewerRole === 'guest' ? (
          <Link href="#" className={styles.primaryButton}>
            회원가입
          </Link>
        ) : null}

        {viewerRole === 'client' ? (
          <ServiceDetailSidebarClientActions
            consultationContext={consultationContext}
            orderName={service.title}
            amount={totalAmount}
          />
        ) : null}
      </div>

      <div className={styles.techStackList}>
        {service.techStacks.map((stack) => (
          <span key={stack} className={styles.techStackTag}>
            {getTechStackLabel(stack)}
          </span>
        ))}
      </div>
    </aside>
  );
}

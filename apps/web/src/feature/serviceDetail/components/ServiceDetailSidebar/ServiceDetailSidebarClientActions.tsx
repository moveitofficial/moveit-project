'use client';

import { useState } from 'react';

import * as styles from './ServiceDetailSidebar.css';

import type { ConsultationInquiryContext } from '@/feature/consultation/types';

import { ConsultationInquiryModal } from '@/feature/consultation/components/ConsultationInquiryModal';

interface Props {
  consultationContext: ConsultationInquiryContext;
}

export default function ServiceDetailSidebarClientActions({
  consultationContext,
}: Props) {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  return (
    <>
      <button type="button" className={styles.primaryButton}>
        바로구매
      </button>
      <button
        type="button"
        className={styles.secondaryButton}
        onClick={() => {
          setIsConsultationOpen(true);
        }}
      >
        상담 견적 문의
      </button>

      <ConsultationInquiryModal
        isOpen={isConsultationOpen}
        onClose={() => {
          setIsConsultationOpen(false);
        }}
        context={consultationContext}
      />
    </>
  );
}

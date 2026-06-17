'use client';

import { useState } from 'react';

import * as styles from './ServiceDetailSidebar.css';

import type { ConsultationInquiryContext } from '@/feature/consultation/types';

import { ConsultationInquiryModal } from '@/feature/consultation/components/ConsultationInquiryModal';
import { requestServicePayment } from '@/feature/payment/toss';

interface Props {
  consultationContext: ConsultationInquiryContext;
  orderName: string;
  amount: number;
}

export default function ServiceDetailSidebarClientActions({
  consultationContext,
  orderName,
  amount,
}: Props) {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handleBuy = () => {
    setIsPaying(true);
    // 성공 시 Toss 결제창으로 이동, 취소·실패 시 reject되어 버튼을 복구한다.
    void requestServicePayment({
      serviceId: consultationContext.serviceId,
      orderName,
      amount,
    }).catch(() => {
      setIsPaying(false);
    });
  };

  return (
    <>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={handleBuy}
        disabled={isPaying}
      >
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

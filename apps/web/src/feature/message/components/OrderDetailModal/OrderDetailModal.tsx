'use client';

import { Modal } from '@repo/ui/Modal';

import * as styles from './OrderDetailModal.css';

import type { OrderPaymentDetail } from '@/feature/message/api';
import type { MessageRoomOrder } from '@/feature/message/types';

import { useOrderPayment } from '@/feature/message/useMessage';
import { formatPaymentDateTime } from '@/feature/message/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: MessageRoomOrder;
  isSeller: boolean;
}

// Toss 카드사(발급사) 코드 → 카드사명.
const CARD_ISSUERS: Record<string, string> = {
  '3K': '기업BC',
  '46': '광주',
  '71': '롯데',
  '30': '산업',
  '31': 'BC',
  '51': '삼성',
  '38': '새마을금고',
  '41': '신한',
  '62': '신협',
  '36': '씨티',
  '33': '우리',
  W1: '우리',
  '37': '우체국',
  '39': '저축은행',
  '35': '전북',
  '42': '제주',
  '15': '카카오뱅크',
  '3A': '케이뱅크',
  '24': '토스뱅크',
  '21': '하나',
  '61': '현대',
  '11': '국민',
  '91': 'NH농협',
};

function formatMethod(payment: OrderPaymentDetail | undefined): string {
  if (payment === undefined) {
    return '-';
  }
  if (payment.card === null) {
    return payment.method;
  }
  const issuer = CARD_ISSUERS[payment.card.issuerCode];
  const cardName = `${payment.card.cardType}카드`;
  return issuer === undefined ? cardName : `${cardName} ${issuer}`;
}

function formatInstallment(payment: OrderPaymentDetail | undefined): string {
  if (payment === undefined) {
    return '-';
  }
  return payment.installmentMonths <= 1
    ? '일시불'
    : `${String(payment.installmentMonths)}개월 할부`;
}

export default function OrderDetailModal({
  isOpen,
  onClose,
  order,
  isSeller,
}: Props) {
  const { data: payment } = useOrderPayment(order.id);

  const paidAt =
    payment === undefined ? '-' : formatPaymentDateTime(payment.approvedAt);
  const totalLabel = isSeller ? '최종 정산예정금액' : '최종 결제금액';
  const totalAmount = isSeller ? order.agreedServicePrice : order.totalAmount;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={420}>
      <div className={styles.content}>
        <h2 className={styles.title}>거래상세 정보</h2>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>결제 정보</h3>
          <dl className={styles.rows}>
            <div className={styles.row}>
              <dt className={styles.label}>결제 일시</dt>
              <dd className={styles.value}>{paidAt}</dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.label}>결제 수단</dt>
              <dd className={styles.value}>{formatMethod(payment)}</dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.label}>결제 방식</dt>
              <dd className={styles.value}>{formatInstallment(payment)}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>결제 금액</h3>
          <dl className={styles.rows}>
            <div className={styles.row}>
              <dt className={styles.label}>서비스 금액</dt>
              <dd className={styles.value}>
                {order.agreedServicePrice.toLocaleString()} 원
              </dd>
            </div>
            {isSeller ? null : (
              <div className={styles.row}>
                <dt className={styles.label}>무빗 수수료</dt>
                <dd className={styles.value}>
                  {order.platformFee.toLocaleString()} 원
                </dd>
              </div>
            )}
            <div className={styles.totalRow}>
              <dt className={styles.labelTotal}>{totalLabel}</dt>
              <dd className={styles.valueTotal}>
                {totalAmount.toLocaleString()} 원
              </dd>
            </div>
          </dl>
        </section>

        <button type="button" className={styles.confirmButton} onClick={onClose}>
          확인
        </button>
      </div>
    </Modal>
  );
}

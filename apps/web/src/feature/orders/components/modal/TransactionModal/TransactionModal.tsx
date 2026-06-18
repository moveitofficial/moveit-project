'use client';

import { ApiError } from '@repo/fetcher';
import { typography } from '@repo/styles/typography';
import { Modal } from '@repo/ui/Modal';
import {
  formatInstallment,
  formatPaymentDateTime,
  formatPrice,
} from '@repo/utils';
import { useEffect, useRef, useState } from 'react';

import * as styles from './TransactionModal.css';

import type {
  OrderPaymentCard,
  OrderTransaction,
} from '@/feature/orders/types';
import type { Role } from '@/types/enums';

import { getOrderTransaction } from '@/feature/orders/api';

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

function formatMethod(method: string, card: OrderPaymentCard | null): string {
  if (card === null) {
    return method;
  }
  const issuer = CARD_ISSUERS[card.issuerCode];
  const cardName = `${card.cardType}카드`;
  return issuer === undefined ? cardName : `${cardName} ${issuer}`;
}

function getTransactionTitle(
  orderStatus: OrderTransaction['orderStatus'],
): string {
  if (orderStatus === 'REFUND_REQUESTED') {
    return '거래상세 정보(환불 요청중)';
  }
  if (orderStatus === 'REFUND_COMPLETED') {
    return '거래상세 정보(환불 완료)';
  }
  return '거래상세 정보';
}

function getAmountValue(
  transaction: OrderTransaction | null,
  role: Role,
  isRefundCompleted: boolean,
): number {
  if (transaction === null) {
    return 0;
  }
  if (isRefundCompleted) {
    return transaction.refundAmount ?? 0;
  }
  if (role === 'CLIENT') {
    return transaction.totalAmount;
  }
  return transaction.settlementAmount;
}

interface PaymentInfoProps {
  paidAt: string;
  method: string;
  card: OrderPaymentCard | null;
  installmentMonths: number;
}

function PaymentInfo({
  paidAt,
  method,
  card,
  installmentMonths,
}: PaymentInfoProps) {
  return (
    <div className={styles.infoBlock}>
      <p className={`${typography.f14EB} ${styles.sectionTitle}`}>결제 정보</p>
      <div className={styles.infoRow}>
        <span className={`${typography.f14B} ${styles.rowLabel}`}>
          결제 일시
        </span>
        <span className={`${typography.f14R} ${styles.rowValue}`}>
          {formatPaymentDateTime(paidAt)}
        </span>
      </div>
      <div className={styles.infoRow}>
        <span className={`${typography.f14B} ${styles.rowLabel}`}>
          결제 수단
        </span>
        <span className={`${typography.f14R} ${styles.rowValue}`}>
          {formatMethod(method, card)}
        </span>
      </div>
      <div className={styles.infoRow}>
        <span className={`${typography.f14B} ${styles.rowLabel}`}>
          결제 방식
        </span>
        <span className={`${typography.f14R} ${styles.rowValue}`}>
          {formatInstallment(installmentMonths)}
        </span>
      </div>
    </div>
  );
}

interface AmountBlockProps {
  servicePrice: number;
  platformFee: number;
  showPlatformFee: boolean;
  totalLabel: string;
  totalAmount: number;
  isRefund?: boolean;
}

function AmountBlock({
  servicePrice,
  platformFee,
  showPlatformFee,
  totalLabel,
  totalAmount,
  isRefund = false,
}: AmountBlockProps) {
  return (
    <div className={styles.infoBlock}>
      <p className={`${typography.f14EB} ${styles.sectionTitle}`}>결제 금액</p>
      <div className={styles.infoRow}>
        <span className={`${typography.f14B} ${styles.rowLabel}`}>
          서비스 금액
        </span>
        <span className={`${typography.f14R} ${styles.rowValue}`}>
          {formatPrice(servicePrice)}
        </span>
      </div>
      {showPlatformFee && (
        <div className={styles.infoRow}>
          <span className={`${typography.f14B} ${styles.rowLabel}`}>
            무빗 수수료
          </span>
          <span className={`${typography.f14R} ${styles.rowValue}`}>
            {formatPrice(platformFee)}
          </span>
        </div>
      )}
      <div className={styles.infoRow}>
        <span className={`${typography.f14B} ${styles.rowLabel}`}>
          {totalLabel}
        </span>
        <span
          className={`${typography.f16EB} ${isRefund ? styles.refundValue : styles.totalValue}`}
        >
          {formatPrice(totalAmount)}
        </span>
      </div>
    </div>
  );
}

interface TransactionModalProps {
  orderId: string;
  role: Role;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionModal({
  orderId,
  role,
  isOpen,
  onClose,
}: TransactionModalProps) {
  const [transaction, setTransaction] = useState<OrderTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setTransaction(null);
      setFetchError(null);
      return;
    }

    cancelledRef.current = false;
    setIsLoading(true);
    setFetchError(null);

    void (async () => {
      try {
        const { data } = await getOrderTransaction(orderId);
        if (cancelledRef.current) return;
        setTransaction(data);
      } catch (error: unknown) {
        if (cancelledRef.current) return;
        setTransaction(null);
        setFetchError(
          error instanceof ApiError
            ? error.message
            : '거래 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
        );
      } finally {
        if (!cancelledRef.current) setIsLoading(false);
      }
    })();

    return () => {
      cancelledRef.current = true;
    };
  }, [isOpen, orderId, retryCount]);

  const isRefundCompleted = transaction?.orderStatus === 'REFUND_COMPLETED';

  const amountLabel = isRefundCompleted
    ? '환불금액'
    : role === 'CLIENT'
      ? '최종 결제금액'
      : '정산예정금액';

  const amountValue = getAmountValue(transaction, role, isRefundCompleted);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={382}>
      <div className={styles.modal}>
        <div className={styles.top}>
          <h2 className={`${typography.f18EB} ${styles.title}`}>
            {transaction === null
              ? '거래상세 정보'
              : getTransactionTitle(transaction.orderStatus)}
          </h2>

          {isLoading && <p className={styles.statusMessage}>불러오는 중...</p>}

          {!isLoading && fetchError !== null && (
            <p className={styles.errorMessage} role="alert">
              {fetchError}
            </p>
          )}

          {!isLoading && transaction !== null && (
            <div className={styles.infoSections}>
              <PaymentInfo
                paidAt={transaction.paidAt}
                method={transaction.method}
                card={transaction.card}
                installmentMonths={transaction.installmentMonths}
              />
              <AmountBlock
                servicePrice={transaction.servicePrice}
                platformFee={transaction.platformFee}
                showPlatformFee={role === 'CLIENT'}
                totalLabel={amountLabel}
                totalAmount={amountValue}
                isRefund={isRefundCompleted}
              />
            </div>
          )}
        </div>

        {!isLoading && (
          <div className={styles.actions}>
            {fetchError === null ? (
              transaction !== null && (
                <button
                  type="button"
                  className={styles.confirmButton}
                  onClick={onClose}
                >
                  확인
                </button>
              )
            ) : (
              <>
                <button
                  type="button"
                  className={styles.confirmButton}
                  onClick={() => {
                    setRetryCount((count) => count + 1);
                  }}
                >
                  다시 시도
                </button>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                >
                  닫기
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

'use client';

import { typography } from '@repo/styles/typography';
import { Modal } from '@repo/ui/Modal';
import {
  formatDate,
  formatInstallment,
  formatPaymentDateTime,
  formatPrice,
} from '@repo/utils';
import { useEffect, useRef, useState, useTransition } from 'react';

import { completeOrderSettlement } from './actions';
import {
  getOrderRefund,
  getOrderSettlement,
  getOrderSettlementPreview,
  getOrderTransaction,
} from './api';
import { REFUND_MODAL_COPY } from './orderActionConstants';
import * as styles from './OrderActionModal.css';

import type {
  OrderRefundDetail,
  OrderSettlement,
  OrderSettlementPreview,
  OrderTransaction,
} from './types';

import { isRefundStatusApproval, type RefundStatus } from '@/utils/constants';

export type OrderActionModalType =
  | 'transaction'
  | 'settlement'
  | 'settlementApprove'
  | 'refund';

export type OrderActionModalProps =
  | {
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      type: 'transaction';
    }
  | {
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      type: 'settlement';
    }
  | {
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      type: 'settlementApprove';
      onCompleted: () => void;
    }
  | {
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      type: 'refund';
      refundStatus: RefundStatus;
    };

interface PaymentInfoProps {
  paidAt: string;
  method: string;
  installmentMonths: number;
}

function PaymentInfo({ paidAt, method, installmentMonths }: PaymentInfoProps) {
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
          {method}
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
  totalLabel: string;
  totalAmount: number;
}

function AmountBlock({
  servicePrice,
  platformFee,
  totalLabel,
  totalAmount,
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
      <div className={styles.infoRow}>
        <span className={`${typography.f14B} ${styles.rowLabel}`}>
          무빗 수수료
        </span>
        <span className={`${typography.f14R} ${styles.rowValue}`}>
          {formatPrice(platformFee)}
        </span>
      </div>
      <div className={styles.infoRow}>
        <span className={`${typography.f14B} ${styles.rowLabel}`}>
          {totalLabel}
        </span>
        <span className={`${typography.f16EB} ${styles.totalValue}`}>
          {formatPrice(totalAmount)}
        </span>
      </div>
    </div>
  );
}

function getModalTitle(
  type: OrderActionModalType,
  refundStatus?: RefundStatus,
) {
  if (type === 'transaction') {
    return '거래상세 정보';
  }
  if (type === 'settlement') {
    return '정산상세 정보';
  }
  if (type === 'settlementApprove') {
    return '입금 확인';
  }
  if (refundStatus !== undefined) {
    return REFUND_MODAL_COPY[refundStatus].title;
  }
  return '';
}

const FETCH_ERROR_MESSAGE: Record<OrderActionModalType, string> = {
  transaction:
    '거래 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
  settlement: '정산 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
  settlementApprove:
    '입금 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
  refund: '주문 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
};

export default function OrderActionModal(props: OrderActionModalProps) {
  const { orderId, isOpen, onClose, type } = props;
  const refundStatus = type === 'refund' ? props.refundStatus : undefined;
  const refundCopy =
    refundStatus === undefined ? null : REFUND_MODAL_COPY[refundStatus];

  const [transaction, setTransaction] = useState<OrderTransaction | null>(null);
  const [settlement, setSettlement] = useState<OrderSettlement | null>(null);
  const [preview, setPreview] = useState<OrderSettlementPreview | null>(null);
  const [refundDetail, setRefundDetail] = useState<OrderRefundDetail | null>(
    null,
  );
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setTransaction(null);
      setSettlement(null);
      setPreview(null);
      setRefundDetail(null);
      setReason('');
      return;
    }

    cancelledRef.current = false;
    setIsLoading(true);

    void (async () => {
      try {
        // 거래 상세
        if (type === 'transaction') {
          const { data } = await getOrderTransaction(orderId);
          if (cancelledRef.current) {
            return;
          }
          setTransaction(data);
          return;
        }

        // 정산 상세
        if (type === 'settlement') {
          const { data } = await getOrderSettlement(orderId);
          if (cancelledRef.current) {
            return;
          }
          setSettlement(data);
          return;
        }

        // 정산 승인
        if (type === 'settlementApprove') {
          const { data } = await getOrderSettlementPreview(orderId);
          if (cancelledRef.current) {
            return;
          }
          setPreview(data);
          return;
        }

        // refund 관련
        if (refundStatus === undefined) {
          return;
        }

        // 취소·환불 승인
        // TODO: 취소/환불 API 작성 시 refundStatus로 추가 분기 필요
        if (isRefundStatusApproval(refundStatus)) {
          const { data } = await getOrderTransaction(orderId);

          if (cancelledRef.current) {
            return;
          }
          setTransaction(data);
          return;
        }

        // 취소·환불 완료
        // TODO: 취소/환불 API 작성 시 refundStatus로 추가 분기 필요
        const { data } = await getOrderRefund(orderId);
        if (cancelledRef.current) {
          return;
        }

        setRefundDetail(data);
      } catch {
        alert(FETCH_ERROR_MESSAGE[type]);
        onClose();
      } finally {
        if (!cancelledRef.current) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelledRef.current = true;
    };
  }, [isOpen, orderId, type, refundStatus, onClose]);

  function handleRefundApprovalSubmit() {
    if (!reason.trim()) {
      return;
    }
    // TODO: 승인 액션 추가 후 아래 호출
    onClose();
  }

  function handleSettlementApprove() {
    if (type !== 'settlementApprove') {
      return;
    }

    startTransition(async () => {
      try {
        await completeOrderSettlement(orderId);
        props.onCompleted();
        onClose();
      } catch {
        alert('정산 완료 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    });
  }

  const paymentInfo = transaction ?? refundDetail;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={382}>
      <div className={styles.modal}>
        <div className={styles.top}>
          <h2 className={`${typography.f18EB} ${styles.title}`}>
            {getModalTitle(type, refundStatus)}
          </h2>

          {!isLoading && type === 'transaction' && transaction !== null && (
            <div className={styles.infoSections}>
              <PaymentInfo
                paidAt={transaction.paidAt}
                method={transaction.method}
                installmentMonths={transaction.installmentMonths}
              />
              <AmountBlock
                servicePrice={transaction.servicePrice}
                platformFee={transaction.platformFee}
                totalLabel="최종 결제금액"
                totalAmount={transaction.totalAmount}
              />
            </div>
          )}

          {!isLoading && type === 'settlement' && settlement !== null && (
            <div className={styles.infoSections}>
              <PaymentInfo
                paidAt={settlement.paidAt}
                method={settlement.method}
                installmentMonths={settlement.installmentMonths}
              />
              <AmountBlock
                servicePrice={settlement.servicePrice}
                platformFee={settlement.platformFee}
                totalLabel="최종 정산금액"
                totalAmount={settlement.settlementAmount}
              />
              <div className={styles.reasonSection}>
                <p className={`${typography.f16EB} ${styles.reasonTitle}`}>
                  정산 담당자
                </p>
                <div className={styles.reasonMeta}>
                  <span className={typography.f12R}>
                    정산 완료일 : {formatDate(settlement.settledAt)}
                  </span>
                  <span className={typography.f12R}>
                    {settlement.settledByAdminName ?? '-'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!isLoading && type === 'settlementApprove' && preview !== null && (
            <div className={styles.infoSections}>
              <div className={styles.infoBlock}>
                <p className={`${typography.f14EB} ${styles.sectionTitle}`}>
                  입금 정보
                </p>
                <div className={styles.infoRow}>
                  <span className={`${typography.f14B} ${styles.rowLabel}`}>
                    회사명
                  </span>
                  <span className={`${typography.f14R} ${styles.rowValue}`}>
                    {preview.businessName ?? '-'}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={`${typography.f14B} ${styles.rowLabel}`}>
                    은행명
                  </span>
                  <span className={`${typography.f14R} ${styles.rowValue}`}>
                    {preview.bankName ?? '-'}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={`${typography.f14B} ${styles.rowLabel}`}>
                    입금계좌
                  </span>
                  <span className={`${typography.f14R} ${styles.rowValue}`}>
                    {preview.bankAccount ?? '-'}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={`${typography.f14B} ${styles.rowLabel}`}>
                    입금 금액
                  </span>
                  <span className={`${typography.f16EB} ${styles.totalValue}`}>
                    {formatPrice(preview.settlementAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!isLoading && type === 'refund' && paymentInfo !== null && (
            <div className={styles.infoSections}>
              <PaymentInfo
                paidAt={paymentInfo.paidAt}
                method={paymentInfo.method}
                installmentMonths={paymentInfo.installmentMonths}
              />
              {transaction !== null && (
                <AmountBlock
                  servicePrice={transaction.servicePrice}
                  platformFee={transaction.platformFee}
                  totalLabel="취소 금액"
                  totalAmount={transaction.totalAmount}
                />
              )}
              {refundDetail !== null && (
                <div className={styles.infoBlock}>
                  <p className={`${typography.f14EB} ${styles.sectionTitle}`}>
                    결제 금액
                  </p>
                  <div className={styles.infoRow}>
                    <span className={`${typography.f14B} ${styles.rowLabel}`}>
                      서비스 금액
                    </span>
                    <span className={`${typography.f14R} ${styles.rowValue}`}>
                      {formatPrice(refundDetail.servicePrice)}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={`${typography.f14B} ${styles.rowLabel}`}>
                      취소 금액
                    </span>
                    <span
                      className={`${typography.f16EB} ${styles.totalValue}`}
                    >
                      {formatPrice(refundDetail.refundAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!isLoading && refundCopy?.mode === 'approval' && (
          <textarea
            className={`${typography.f16R} ${styles.textarea}`}
            placeholder={refundCopy.placeholder}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
            }}
          />
        )}

        {!isLoading &&
          refundCopy?.mode === 'completed' &&
          refundDetail !== null && (
            <div className={styles.reasonSection}>
              <p className={`${typography.f16EB} ${styles.reasonTitle}`}>
                {refundCopy.reasonTitle}
              </p>
              <div className={styles.reasonMeta}>
                <span className={typography.f12R}>
                  {refundCopy.completedDateLabel} :{' '}
                  {formatDate(refundDetail.approvedAt)}
                </span>
                <span className={typography.f12R}>
                  {refundDetail.approvedBy.name ?? '-'}
                </span>
              </div>
              <p className={`${typography.f16R} ${styles.reasonText}`}>
                {refundDetail.approvedBy.reason ?? '-'}
              </p>
            </div>
          )}

        {!isLoading && (
          <div className={styles.actions}>
            {type === 'settlementApprove' ? (
              <>
                <button
                  type="button"
                  className={styles.submitButton}
                  disabled={isPending}
                  onClick={handleSettlementApprove}
                >
                  정산 완료
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  disabled={isPending}
                  onClick={onClose}
                >
                  아니오
                </button>
              </>
            ) : refundCopy?.mode === 'approval' ? (
              <>
                <button
                  type="button"
                  className={styles.submitButton}
                  disabled={!reason.trim()}
                  onClick={handleRefundApprovalSubmit}
                >
                  {refundCopy.submitLabel}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={onClose}
                >
                  닫기
                </button>
              </>
            ) : (
              <button
                type="button"
                className={styles.submitButton}
                onClick={onClose}
              >
                {refundCopy?.submitLabel ?? '확인'}
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

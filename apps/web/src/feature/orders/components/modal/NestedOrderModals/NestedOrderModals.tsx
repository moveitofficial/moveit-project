'use client';

import { useRouter } from 'next/navigation';

import type { NestedOrderModal } from '@/feature/orders/constants';
import type { OrderStatus } from '@/feature/orders/types';
import type { Role } from '@/types/enums';

import { OrderActionModal } from '@/feature/orders/components/modal/OrderActionModal';
import { ReviewModal } from '@/feature/orders/components/modal/ReviewModal';
import { TransactionModal } from '@/feature/orders/components/modal/TransactionModal';

interface Props {
  nestedModal: NestedOrderModal | null;
  role: Role;
  onChangeModal: (modal: NestedOrderModal | null) => void;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  onReviewIdUpdate: (orderId: string, reviewId: string | null) => void;
}

export default function NestedOrderModals({
  nestedModal,
  role,
  onChangeModal,
  onClose,
  onStatusUpdate,
  onReviewIdUpdate,
}: Props) {
  const router = useRouter();
  return (
    <>
      {nestedModal?.type === 'transaction' && (
        <TransactionModal
          orderId={nestedModal.orderId}
          role={role}
          isOpen={true}
          onClose={onClose}
        />
      )}

      {nestedModal?.type === 'requestCancel' && (
        <OrderActionModal
          type="requestCancel"
          orderId={nestedModal.orderId}
          isOpen={true}
          onClose={onClose}
          onCompleted={() => {
            onStatusUpdate(nestedModal.orderId, 'CANCEL_REQUESTED');
            onClose();
          }}
        />
      )}

      {nestedModal?.type === 'confirmPurchase' && (
        <OrderActionModal
          type="confirmPurchase"
          orderId={nestedModal.orderId}
          isOpen={true}
          onClose={onClose}
          onCompleted={() => {
            onStatusUpdate(nestedModal.orderId, 'PURCHASE_CONFIRMED');
            onChangeModal({
              type: 'confirmPurchaseCompleted',
              orderId: nestedModal.orderId,
            });
          }}
        />
      )}

      {nestedModal?.type === 'confirmPurchaseCompleted' && (
        <OrderActionModal
          type="confirmPurchaseCompleted"
          isOpen={true}
          onClose={onClose}
          onWriteReview={() => {
            onChangeModal({
              type: 'writeReview',
              orderId: nestedModal.orderId,
            });
          }}
        />
      )}

      {nestedModal?.type === 'requestRefund' && (
        <OrderActionModal
          type="requestRefund"
          orderId={nestedModal.orderId}
          isOpen={true}
          onClose={onClose}
          onCompleted={() => {
            onStatusUpdate(nestedModal.orderId, 'REFUND_REQUESTED');
            onChangeModal({ type: 'refundRequestCompleted' });
          }}
        />
      )}

      {nestedModal?.type === 'refundRequestCompleted' && (
        <OrderActionModal
          type="refundRequestCompleted"
          isOpen={true}
          onClose={onClose}
        />
      )}

      {nestedModal?.type === 'cancelRefund' && (
        <OrderActionModal
          type="cancelRefund"
          orderId={nestedModal.orderId}
          isOpen={true}
          onClose={onClose}
          onCompleted={() => {
            onStatusUpdate(nestedModal.orderId, 'EXPIRED');
            onChangeModal({ type: 'refundRequestCancelled' });
          }}
        />
      )}

      {nestedModal?.type === 'refundRequestCancelled' && (
        <OrderActionModal
          type="refundRequestCancelled"
          isOpen={true}
          onClose={onClose}
        />
      )}

      {nestedModal?.type === 'requestSettlement' && (
        <OrderActionModal
          type="requestSettlement"
          orderId={nestedModal.orderId}
          isOpen={true}
          onClose={onClose}
          onCompleted={() => {
            onStatusUpdate(nestedModal.orderId, 'SETTLEMENT_REQUESTED');
            onClose();
          }}
        />
      )}

      {nestedModal?.type === 'requestScheduleChange' && (
        <OrderActionModal
          type="requestScheduleChange"
          orderId={nestedModal.orderId}
          roomId={nestedModal.roomId}
          isOpen={true}
          onClose={onClose}
          onCompleted={() => {
            const { roomId } = nestedModal;
            onClose();
            router.push(`/service/message?roomId=${roomId}`);
          }}
        />
      )}

      {nestedModal?.type === 'requestPurchaseConfirm' && (
        <OrderActionModal
          type="requestPurchaseConfirm"
          roomId={nestedModal.roomId}
          isOpen={true}
          onClose={onClose}
          onCompleted={() => {
            const { roomId } = nestedModal;
            onClose();
            router.push(`/service/message?roomId=${roomId}`);
          }}
        />
      )}

      {nestedModal?.type === 'completeWork' && (
        <OrderActionModal
          type="completeWork"
          orderId={nestedModal.orderId}
          isOpen={true}
          onClose={onClose}
          onCompleted={() => {
            onStatusUpdate(nestedModal.orderId, 'WORK_COMPLETED');
            onClose();
          }}
        />
      )}

      {nestedModal?.type === 'approveRefund' && (
        <OrderActionModal
          type="approveRefund"
          orderId={nestedModal.orderId}
          isOpen={true}
          onClose={onClose}
          onCompleted={() => {
            onStatusUpdate(nestedModal.orderId, 'REFUND_COMPLETED');
            onClose();
          }}
        />
      )}

      {nestedModal?.type === 'rejectRefund' && (
        <OrderActionModal
          type="rejectRefund"
          orderId={nestedModal.orderId}
          isOpen={true}
          onClose={onClose}
          onCompleted={() => {
            onStatusUpdate(nestedModal.orderId, 'EXPIRED');
            onClose();
          }}
        />
      )}

      {nestedModal?.type === 'approveCancel' && (
        <OrderActionModal
          type="approveCancel"
          orderId={nestedModal.orderId}
          isOpen={true}
          onClose={onClose}
          onCompleted={() => {
            onStatusUpdate(nestedModal.orderId, 'PAYMENT_CANCELLED');
            onClose();
          }}
        />
      )}

      {nestedModal?.type === 'rejectCancel' && (
        <OrderActionModal
          type="rejectCancel"
          orderId={nestedModal.orderId}
          isOpen={true}
          onClose={onClose}
          onCompleted={() => {
            onStatusUpdate(nestedModal.orderId, 'NEGOTIATING');
            onClose();
          }}
        />
      )}

      {nestedModal?.type === 'writeReview' && (
        <ReviewModal
          mode="write"
          orderId={nestedModal.orderId}
          isOpen={true}
          onClose={onClose}
          onCompleted={(review) => {
            onReviewIdUpdate(nestedModal.orderId, review.id);
            onClose();
          }}
        />
      )}

      {nestedModal?.type === 'viewReview' && (
        <ReviewModal
          mode="view"
          orderId={nestedModal.orderId}
          isOpen={true}
          onClose={onClose}
          onEdit={(review) => {
            onChangeModal({
              type: 'editReview',
              orderId: nestedModal.orderId,
              reviewId: nestedModal.reviewId,
              rating: review.rating,
              content: review.content,
            });
          }}
          onDelete={() => {
            onChangeModal({
              type: 'deleteReview',
              orderId: nestedModal.orderId,
              reviewId: nestedModal.reviewId,
            });
          }}
        />
      )}

      {nestedModal?.type === 'editReview' && (
        <ReviewModal
          mode="edit"
          orderId={nestedModal.orderId}
          reviewId={nestedModal.reviewId}
          initialRating={nestedModal.rating}
          initialContent={nestedModal.content}
          isOpen={true}
          onClose={onClose}
          onCompleted={() => {
            onClose();
          }}
        />
      )}

      {nestedModal?.type === 'deleteReview' && (
        <OrderActionModal
          type="deleteReview"
          orderId={nestedModal.orderId}
          reviewId={nestedModal.reviewId}
          isOpen={true}
          onClose={onClose}
          onCompleted={() => {
            onReviewIdUpdate(nestedModal.orderId, null);
            onClose();
          }}
        />
      )}
    </>
  );
}

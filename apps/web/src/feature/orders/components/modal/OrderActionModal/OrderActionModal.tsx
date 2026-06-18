'use client';

import { ConfirmModal } from '@repo/ui/Modal';
import { useTransition } from 'react';

import { CONFIRM_COPY } from './orderActionConstants';

import type { ConfirmCopy } from './orderActionConstants';
import type { ConfirmModalActionVariant } from '@repo/ui/Modal';

import {
  approveCancel,
  approveRefund,
  cancelRefund,
  completeWork,
  confirmPurchase,
  deleteReview,
  rejectCancel,
  rejectRefund,
  requestCancel,
  requestRefund,
  requestScheduleChange,
  requestSettlement,
} from '@/feature/orders/actions';
import { sendChatText } from '@/feature/orders/sendChatText';

export type OrderActionModalProps =
  | {
      type: 'requestCancel';
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: () => void;
    }
  | {
      type: 'confirmPurchase';
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: () => void;
    }
  | {
      type: 'confirmPurchaseCompleted';
      isOpen: boolean;
      onClose: () => void;
      onWriteReview: () => void;
    }
  | {
      type: 'requestRefund';
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: () => void;
    }
  | {
      type: 'refundRequestCompleted';
      isOpen: boolean;
      onClose: () => void;
    }
  | {
      type: 'refundRequestCancelled';
      isOpen: boolean;
      onClose: () => void;
    }
  | {
      type: 'requestSettlement';
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: () => void;
    }
  | {
      type: 'completeWork';
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: () => void;
    }
  | {
      type: 'requestScheduleChange';
      orderId: string;
      roomId: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: () => void;
    }
  | {
      type: 'requestPurchaseConfirm';
      roomId: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: () => void;
    }
  | {
      type: 'approveRefund';
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: () => void;
    }
  | {
      type: 'rejectRefund';
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: () => void;
    }
  | {
      type: 'cancelRefund';
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: () => void;
    }
  | {
      type: 'approveCancel';
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: () => void;
    }
  | {
      type: 'rejectCancel';
      orderId: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: () => void;
    }
  | {
      type: 'deleteReview';
      orderId: string;
      reviewId: string;
      isOpen: boolean;
      onClose: () => void;
      onCompleted: () => void;
    };

export default function OrderActionModal(props: OrderActionModalProps) {
  const { type, isOpen, onClose } = props;
  const [isPending, startTransition] = useTransition();

  // 처리 중 중복 클릭 방지
  function guardedSubmit(
    execute: () => Promise<void>,
    onCompleted: () => void,
  ) {
    return () => {
      if (isPending) {
        return;
      }
      startTransition(() => {
        void (async () => {
          try {
            await execute();
            onCompleted();
          } catch {
            alert('처리 중 오류가 발생했습니다. 다시 시도해주세요.');
          }
        })();
      });
    };
  }

  // '예/아니오' 단일 액션 확인 모달
  function confirmAction(
    copy: ConfirmCopy,
    variant: ConfirmModalActionVariant,
    execute: () => Promise<void>,
    onCompleted: () => void,
  ) {
    return (
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        title={copy.title}
        description={copy.description}
        actions={[
          {
            label: '예',
            variant,
            onClick: guardedSubmit(execute, onCompleted),
          },
          { label: '아니오', variant: 'white', onClick: onClose },
        ]}
      />
    );
  }

  if (type === 'confirmPurchaseCompleted') {
    const copy = CONFIRM_COPY.confirmPurchaseCompleted;
    return (
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        title={copy.title}
        description={copy.description}
        actions={[
          {
            label: '리뷰 작성하기',
            variant: 'blue',
            onClick: props.onWriteReview,
          },
          { label: '아니오', variant: 'white', onClick: onClose },
        ]}
      />
    );
  }

  if (type === 'refundRequestCompleted') {
    const copy = CONFIRM_COPY.refundRequestCompleted;
    return (
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        title={copy.title}
        description={copy.description}
        actions={[{ label: '확인', variant: 'blue', onClick: onClose }]}
      />
    );
  }

  if (type === 'refundRequestCancelled') {
    const copy = CONFIRM_COPY.refundRequestCancelled;
    return (
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        title={copy.title}
        description={copy.description}
        actions={[{ label: '확인', variant: 'blue', onClick: onClose }]}
      />
    );
  }

  if (type === 'requestCancel') {
    return confirmAction(
      CONFIRM_COPY.requestCancel,
      'blue',
      () => requestCancel(props.orderId),
      props.onCompleted,
    );
  }

  if (type === 'confirmPurchase') {
    return confirmAction(
      CONFIRM_COPY.confirmPurchase,
      'blue',
      () => confirmPurchase(props.orderId),
      props.onCompleted,
    );
  }

  if (type === 'requestRefund') {
    return confirmAction(
      CONFIRM_COPY.requestRefund,
      'blue',
      () => requestRefund(props.orderId),
      props.onCompleted,
    );
  }

  if (type === 'requestSettlement') {
    return confirmAction(
      CONFIRM_COPY.requestSettlement,
      'blue',
      () => requestSettlement(props.orderId),
      props.onCompleted,
    );
  }

  if (type === 'approveRefund') {
    return confirmAction(
      CONFIRM_COPY.approveRefund,
      'red',
      () => approveRefund(props.orderId),
      props.onCompleted,
    );
  }

  if (type === 'cancelRefund') {
    return confirmAction(
      CONFIRM_COPY.cancelRefund,
      'blue',
      () => cancelRefund(props.orderId),
      props.onCompleted,
    );
  }

  if (type === 'rejectRefund') {
    return confirmAction(
      CONFIRM_COPY.rejectRefund,
      'blue',
      () => rejectRefund(props.orderId),
      props.onCompleted,
    );
  }

  if (type === 'approveCancel') {
    return confirmAction(
      CONFIRM_COPY.approveCancel,
      'red',
      () => approveCancel(props.orderId),
      props.onCompleted,
    );
  }

  if (type === 'rejectCancel') {
    return confirmAction(
      CONFIRM_COPY.rejectCancel,
      'blue',
      () => rejectCancel(props.orderId),
      props.onCompleted,
    );
  }

  if (type === 'completeWork') {
    return confirmAction(
      CONFIRM_COPY.completeWork,
      'blue',
      () => completeWork(props.orderId),
      props.onCompleted,
    );
  }

  if (type === 'requestScheduleChange') {
    return confirmAction(
      CONFIRM_COPY.requestScheduleChange,
      'blue',
      () => requestScheduleChange(props.orderId, props.roomId),
      props.onCompleted,
    );
  }

  if (type === 'requestPurchaseConfirm') {
    return confirmAction(
      CONFIRM_COPY.requestPurchaseConfirm,
      'blue',
      () => {
        sendChatText(
          props.roomId,
          '작업이 완료되었어요. 작업물을 확인하고 구매확정을 진행해 주세요.',
        );
        return Promise.resolve();
      },
      props.onCompleted,
    );
  }

  // type === 'deleteReview'
  return confirmAction(
    CONFIRM_COPY.deleteReview,
    'blue',
    () => deleteReview(props.orderId, props.reviewId),
    props.onCompleted,
  );
}

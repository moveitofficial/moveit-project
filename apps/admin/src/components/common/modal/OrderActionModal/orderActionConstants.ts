import type { RefundStatus } from '@/utils/constants';

interface RefundModalCopy {
  title: string;
  reasonTitle: string;
  completedDateLabel: string;
  placeholder?: string;
  submitLabel: string;
  mode: 'approval' | 'completed';
}

export const REFUND_MODAL_COPY: Record<RefundStatus, RefundModalCopy> = {
  CANCEL_REQUESTED: {
    title: '취소승인',
    reasonTitle: '취소 승인 사유',
    completedDateLabel: '취소 완료일',
    placeholder: '취소 승인 사유를 입력해주세요',
    submitLabel: '결제 취소 승인',
    mode: 'approval',
  },
  REFUND_REQUESTED: {
    title: '환불승인',
    reasonTitle: '환불 승인 사유',
    completedDateLabel: '환불 완료일',
    placeholder: '환불승인 사유를 입력해주세요',
    submitLabel: '환불 승인',
    mode: 'approval',
  },
  CANCEL_COMPLETED: {
    title: '취소 완료',
    reasonTitle: '취소 승인 사유',
    completedDateLabel: '취소 완료일',
    submitLabel: '확인',
    mode: 'completed',
  },
  REFUND_COMPLETED: {
    title: '환불 완료',
    reasonTitle: '환불 승인 사유',
    completedDateLabel: '환불 완료일',
    submitLabel: '확인',
    mode: 'completed',
  },
};

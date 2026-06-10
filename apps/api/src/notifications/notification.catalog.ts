import {
  NotificationCategory,
  NotificationType,
  ReferenceType,
} from '@prisma/client';

export interface NotificationContentVars {
  postTitle?: string;
  rejectReason?: string;
  deleteReason?: string;
  adminReason?: string;
  serviceTitle?: string;
  clientName?: string;
}

interface NotificationMeta {
  type: NotificationType;
  referenceType: ReferenceType | null;
  buildContent: (vars?: NotificationContentVars) => string;
}

export const NOTIFICATION_CATALOG: Record<
  NotificationCategory,
  NotificationMeta
> = {
  // ───── 커뮤니티 ─────
  [NotificationCategory.POST_COMMENT]: {
    type: NotificationType.COMMUNITY,
    referenceType: ReferenceType.POST,
    buildContent: (vars) => `'${vars?.postTitle ?? ''}'에 댓글이 달렸어요`,
  },
  [NotificationCategory.POST_REPLY]: {
    type: NotificationType.COMMUNITY,
    referenceType: ReferenceType.POST,
    buildContent: (vars) =>
      `'${vars?.postTitle ?? ''}'에 내 댓글에 답글이 달렸어요`,
  },
  [NotificationCategory.POST_LIKE]: {
    type: NotificationType.COMMUNITY,
    referenceType: ReferenceType.POST,
    buildContent: (vars) => `'${vars?.postTitle ?? ''}'에 좋아요가 달렸어요`,
  },
  [NotificationCategory.POST_DELETED_BY_ADMIN]: {
    type: NotificationType.COMMUNITY,
    referenceType: ReferenceType.POST,
    buildContent: (vars) =>
      `'${vars?.postTitle ?? ''}' 게시글이 '${vars?.deleteReason ?? ''}' 사유로 삭제되었어요`,
  },
  [NotificationCategory.COMMENT_DELETED_BY_ADMIN]: {
    type: NotificationType.COMMUNITY,
    referenceType: ReferenceType.COMMENT,
    buildContent: (vars) =>
      `'${vars?.postTitle ?? ''}'에 작성한 댓글이 '${vars?.deleteReason ?? ''}' 사유로 삭제되었어요`,
  },

  // ───── 계정 ─────
  [NotificationCategory.EXPERT_APPROVED]: {
    type: NotificationType.ACCOUNT,
    referenceType: null,
    buildContent: () => `전문가 승인이 완료되었어요`,
  },
  [NotificationCategory.EXPERT_REJECTED]: {
    type: NotificationType.ACCOUNT,
    referenceType: null,
    buildContent: (vars) =>
      `'${vars?.rejectReason ?? ''}' 전문가 승인이 거절되었어요`,
  },

  // ───── 거래 - 주문/결제 ─────
  [NotificationCategory.ORDER_CREATED]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 새로운 주문이 있어요. MyPage > 판매관리에서 확인해주세요`,
  },
  [NotificationCategory.PAYMENT_SUCCESS]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.PAYMENT,
    buildContent: (vars) => `'${vars?.serviceTitle ?? ''}' 결제가 완료되었어요`,
  },

  // ───── 거래 - 취소 ─────
  [NotificationCategory.ORDER_CANCEL_REQUESTED]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.clientName ?? ''}'님이 '${vars?.serviceTitle ?? ''}' 취소 요청을 보냈어요. MyPage > 판매관리에서 확인해주세요`,
  },
  [NotificationCategory.ORDER_CANCEL_REQUESTED_TO_CLIENT]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 취소 요청이 완료되었어요`,
  },
  [NotificationCategory.ORDER_CANCEL_APPROVED_BY_EXPERT]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 주문 취소 요청이 승인되었습니다`,
  },
  [NotificationCategory.ORDER_CANCEL_APPROVED_BY_ADMIN]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.adminReason ?? ''}' '${vars?.serviceTitle ?? ''}' 주문 취소 요청이 승인되었습니다`,
  },
  [NotificationCategory.ORDER_CANCEL_REJECTED_BY_EXPERT]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 주문 취소 요청이 거절되었습니다`,
  },
  [NotificationCategory.ORDER_CANCELLED]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) => `'${vars?.serviceTitle ?? ''}' 주문이 취소되었어요`,
  },

  // ───── 거래 - 환불 ─────
  [NotificationCategory.REFUND_REQUESTED]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.REFUND,
    buildContent: (vars) =>
      `'${vars?.clientName ?? ''}'님이 '${vars?.serviceTitle ?? ''}' 환불 요청을 보냈어요. MyPage > 판매관리에서 확인해주세요`,
  },

  [NotificationCategory.REFUND_REQUESTED_TO_CLIENT]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.REFUND,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 환불 요청이 완료되었어요`,
  },
  [NotificationCategory.REFUND_APPROVED_BY_EXPERT]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.REFUND,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 환불 요청이 승인되었습니다`,
  },
  [NotificationCategory.REFUND_APPROVED_BY_ADMIN]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.REFUND,
    buildContent: (vars) =>
      `'${vars?.adminReason ?? ''}' '${vars?.serviceTitle ?? ''}' 환불 요청이 승인되었습니다`,
  },
  [NotificationCategory.REFUND_REJECTED_BY_EXPERT]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.REFUND,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 환불 요청이 거절되었습니다`,
  },

  // ───── 거래 - 작업/구매확정/정산 ─────
  [NotificationCategory.WORK_COMPLETED]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 작업이 완료되었어요. 구매확정을 진행해주세요`,
  },
  [NotificationCategory.PURCHASE_CONFIRM_REQUEST]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 구매확정 요청이 들어왔어요. MyPage > 구매관리에서 확인해주세요`,
  },
  [NotificationCategory.PURCHASE_CONFIRM_REMINDER]: {
    type: NotificationType.REMINDER,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 아직 구매확정되지 않은 작업물이 있어요`,
  },
  [NotificationCategory.PURCHASE_CONFIRM_PENDING]: {
    type: NotificationType.REMINDER,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 아직 구매확정되지 않은 주문건이 있어요`,
  },
  [NotificationCategory.PURCHASE_CONFIRMED]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 구매확정이 완료되었어요. MyPage > 판매관리에서 정산요청 해주세요`,
  },
  [NotificationCategory.PURCHASE_AUTO_CONFIRMED]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 기한 경과로 자동 구매확정되었어요`,
  },
  [NotificationCategory.SETTLEMENT_REQUEST_REMINDER]: {
    type: NotificationType.REMINDER,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 정산 요청을 해주세요`,
  },
  [NotificationCategory.SETTLEMENT_DONE]: {
    type: NotificationType.TRANSACTION,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 정산이 완료되었어요. MyPage > 판매관리에서 확인해주세요`,
  },

  // ───── 일정 ─────
  [NotificationCategory.SCHEDULE_REGISTERED]: {
    type: NotificationType.REMINDER,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) => `'${vars?.serviceTitle ?? ''}' 일정이 등록되었어요`,
  },
  [NotificationCategory.SCHEDULE_CHANGE_REQUEST]: {
    type: NotificationType.REMINDER,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 일정 변경 요청이 왔어요. 채팅방에서 확인해주세요`,
  },
  [NotificationCategory.SCHEDULE_CHANGED]: {
    type: NotificationType.REMINDER,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) => `'${vars?.serviceTitle ?? ''}' 일정이 변경되었어요`,
  },
  [NotificationCategory.SCHEDULE_REMINDER]: {
    type: NotificationType.REMINDER,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 일정 시작·마감이 임박했어요`,
  },

  // ───── 리마인더 ─────
  [NotificationCategory.DEADLINE_REMINDER]: {
    type: NotificationType.REMINDER,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 마감임박이 얼마 남지 않았어요`,
  },
  [NotificationCategory.DEADLINE_EXPIRED]: {
    type: NotificationType.REMINDER,
    referenceType: ReferenceType.ORDER,
    buildContent: (vars) =>
      `'${vars?.serviceTitle ?? ''}' 기한이 만료되었어요. 환불 요청이 가능합니다`,
  },
};

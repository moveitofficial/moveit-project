import { AdminActionType } from '@prisma/client';

export enum PendingType {
  EXPERT_APPLICATION = 'EXPERT_APPLICATION',
  REPORT = 'REPORT',
  CS = 'CS',
  SETTLEMENT = 'SETTLEMENT',
}

// 페이지네이션 응답 공통 타입 (toPaginatedResponse 유틸 반환 형태)
export interface Paginated<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    hasNext: boolean;
  };
}

// 활동 로그에서 referenceId가 User를 가리키는 액션 종류
export const USER_TARGET_ACTIONS = new Set<AdminActionType>([
  AdminActionType.EXPERT_APPROVED,
  AdminActionType.EXPERT_REJECTED,
  AdminActionType.BLACKLIST_ADDED,
  AdminActionType.BLACKLIST_REMOVED,
  AdminActionType.CANCEL_APPROVED,
  AdminActionType.REFUND_APPROVED,
]);

// 활동 로그에서 referenceId가 Faq를 가리키는 액션 종류
export const FAQ_TARGET_ACTIONS = new Set<AdminActionType>([
  AdminActionType.FAQ_CREATED,
  AdminActionType.FAQ_UPDATED,
  AdminActionType.FAQ_DELETED,
]);

// 활동 로그에서 referenceId가 CsChatRoom을 가리키는 액션 종류
export const CS_TARGET_ACTIONS = new Set<AdminActionType>([
  AdminActionType.CS_ASSIGNED,
  AdminActionType.CS_CLOSED,
]);

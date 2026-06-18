import { AdminActionType, type MainSectionType } from '@prisma/client';

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

// 활동 로그에서 referenceId가 MainSetting을 가리키는 액션 종류
export const MAIN_TARGET_ACTIONS = new Set<AdminActionType>([
  AdminActionType.MAIN_UPDATED,
]);

// 활동 로그에서 referenceId가 Order를 가리키는 액션 종류
export const ORDER_TARGET_ACTIONS = new Set<AdminActionType>([
  AdminActionType.SETTLEMENT_COMPLETED,
]);

// MainSetting 섹션 타입 → 한글 표시명
export const MAIN_SECTION_LABELS: Record<MainSectionType, string> = {
  POPULAR_IT_COACHING: '가장 많이 찾는 IT 코칭',
  POPULAR_PROJECT_REQUEST: '가장 많이 찾는 프로젝트 의뢰',
  MOVEIT_POPULAR_PROJECT_EXPERT: '무빗 인기 프로젝트 의뢰 전문가',
  MOVEIT_POPULAR_COACHING: '무빗 인기 코칭',
  RECOMMENDED_IT_COACHING: '추천 IT 코칭',
  RECOMMENDED_PROJECT_REQUEST: '추천 프로젝트 의뢰',
};

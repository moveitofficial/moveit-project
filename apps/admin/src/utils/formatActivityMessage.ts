import type { ActivityType } from '@/types/enums';

interface RecentActivity {
  actionType: ActivityType;
  targetName: string | null;
}

const FALLBACK_TARGET = '이름없음';
const MAIN_EXPOSURE_SUFFIX = ' 노출 수정';

const wrapFaqTitle = (title: string) => `<${title}>`;

const ACTIVITY_MESSAGE_FORMAT: Record<
  ActivityType,
  (target: string | null) => string
> = {
  EXPERT_APPROVED: (title) => `${title ?? FALLBACK_TARGET} 판매자 권한 승인`,
  EXPERT_REJECTED: (title) => `${title ?? FALLBACK_TARGET} 판매자 권한 거절`,
  BLACKLIST_ADDED: (title) => `${title ?? FALLBACK_TARGET} 블랙리스트 등록`,
  BLACKLIST_REMOVED: (title) => `${title ?? FALLBACK_TARGET} 블랙리스트 삭제`,
  CANCEL_APPROVED: (title) => `${title ?? FALLBACK_TARGET} 취소 승인`,
  REFUND_APPROVED: (title) =>
    title === null ? '환불 승인' : `${title} 환불 승인`,
  FAQ_CREATED: (title) =>
    `FAQ ${wrapFaqTitle(title ?? FALLBACK_TARGET)} 신규등록`,
  FAQ_UPDATED: (title) => `FAQ ${wrapFaqTitle(title ?? FALLBACK_TARGET)} 수정`,
  FAQ_DELETED: (title) => `FAQ ${wrapFaqTitle(title ?? FALLBACK_TARGET)} 삭제`,
  CS_ASSIGNED: (title) => `${title ?? FALLBACK_TARGET} 문의 처리중`,
  CS_CLOSED: (title) => `${title ?? FALLBACK_TARGET} 문의 처리 완료`,
  SETTLEMENT_COMPLETED: (title) =>
    title === null ? '정산 완료' : `${title} 판매자 정산 완료`,
  MAIN_UPDATED: (title) => {
    if (title === null) {
      return '메인 노출 수정';
    }
    if (title.endsWith(MAIN_EXPOSURE_SUFFIX)) {
      return `메인 ${title.slice(0, -MAIN_EXPOSURE_SUFFIX.length)} 수정`;
    }
    return title;
  },
};

export function formatActivityMessage(activity: RecentActivity): string {
  return ACTIVITY_MESSAGE_FORMAT[activity.actionType](activity.targetName);
}

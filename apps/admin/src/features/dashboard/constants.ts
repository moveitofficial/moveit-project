import type { ActivityType, DashboardSummary, PendingTaskType } from './types';
import type { RoundChip } from '@repo/ui/RoundChip';
import type { ComponentProps } from 'react';

export type SummaryCountColor = 'blue300' | 'red200' | 'yellow100';

interface SummaryCardConfig {
  label: string;
  subtext: string;
  countColor: SummaryCountColor;
}

type ChipColor = NonNullable<ComponentProps<typeof RoundChip>['color']>;
type ChipOpacity = NonNullable<ComponentProps<typeof RoundChip>['opacity']>;

interface BadgeConfig {
  text: string;
  color: ChipColor;
  opacity: ChipOpacity;
}

export const SUMMARY_CARD_CONFIG: Record<
  keyof DashboardSummary,
  SummaryCardConfig
> = {
  expertApplications: {
    label: '전문가 신청',
    subtext: '대기 중',
    countColor: 'blue300',
  },
  reports: {
    label: '신고 접수',
    subtext: '처리 필요',
    countColor: 'red200',
  },
  settlements: {
    label: '정산 요청',
    subtext: '처리 필요',
    countColor: 'yellow100',
  },
  ongoingServices: {
    label: '서비스 진행중',
    subtext: '거래 중',
    countColor: 'blue300',
  },
};

export const PENDING_TASK_BADGE_CONFIG: Record<PendingTaskType, BadgeConfig> = {
  EXPERT_APPLICATION: { text: '전문가 신청', color: 'blue300', opacity: 'full' },
  REPORT: { text: '신고', color: 'red200', opacity: 'full' },
  CS: { text: 'CS', color: 'yellow100', opacity: 'full' },
  SETTLEMENT: { text: '정산 요청', color: 'blue400', opacity: 'full' },
};

export const ACTIVITY_BADGE_CONFIG: Record<ActivityType, BadgeConfig> = {
  EXPERT_APPROVED: { text: '전문가 승인', color: 'blue300', opacity: 'full' },
  EXPERT_REJECTED: { text: '전문가 거절', color: 'red200', opacity: 'full' },
  MAIN_UPDATED: { text: '메인 노출 수정', color: 'yellow100', opacity: 'full' },
  FAQ_CREATED: { text: 'FAQ 등록', color: 'blue300', opacity: 'full' },
  FAQ_UPDATED: { text: 'FAQ 수정', color: 'yellow100', opacity: 'full' },
  FAQ_DELETED: { text: 'FAQ 삭제', color: 'red200', opacity: 'full' },
  BLACKLIST_ADDED: {
    text: '블랙리스트 등록',
    color: 'red200',
    opacity: 'full',
  },
  BLACKLIST_REMOVED: {
    text: '블랙리스트 삭제',
    color: 'blue400',
    opacity: 'full',
  },
  REFUND_APPROVED: { text: '환불 승인', color: 'blue300', opacity: 'full' },
  CANCEL_APPROVED: { text: '취소 승인', color: 'red200', opacity: 'full' },
  CS_ASSIGNED: { text: '문의 처리중', color: 'yellow100', opacity: 'full' },
  CS_CLOSED: { text: '문의 처리 완료', color: 'blue400', opacity: 'full' },
  SETTLEMENT_COMPLETED: {
    text: '정산 완료',
    color: 'blue400',
    opacity: 'full',
  },
};

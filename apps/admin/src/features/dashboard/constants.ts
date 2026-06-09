import type { DashboardSummary, PendingTaskType } from './types';
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
  EXPERT_APPLICATION: {
    text: '전문가 신청',
    color: 'blue300',
    opacity: 'full',
  },
  REPORT: { text: '신고', color: 'red200', opacity: 'full' },
  CS: { text: 'CS', color: 'yellow100', opacity: 'full' },
  SETTLEMENT: { text: '정산 요청', color: 'blue400', opacity: 'full' },
};

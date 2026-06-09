import type { SettlementStatus } from '@/types/enums';
import type { OrderCardAction } from '@repo/ui/OrderCard';
import type { RectLabelColor } from '@repo/ui/RectLabel';

interface BadgeConfig {
  text: string;
  color: RectLabelColor;
}

export const SETTLEMENT_STATUS_BADGE_CONFIG: Record<
  SettlementStatus,
  BadgeConfig
> = {
  SETTLEMENT_REQUESTED: { text: '정산요청', color: 'yellow' },
  SETTLEMENT_COMPLETED: { text: '정산완료', color: 'blue400' },
};

export const SETTLEMENT_STATUS_ACTIONS_CONFIG: Record<
  SettlementStatus,
  OrderCardAction[]
> = {
  SETTLEMENT_REQUESTED: [
    { label: '거래상세', variant: 'white' },
    { label: '정산완료', variant: 'blue' },
  ],
  SETTLEMENT_COMPLETED: [
    { label: '거래상세', variant: 'white' },
    { label: '정산상세', variant: 'white' },
  ],
};

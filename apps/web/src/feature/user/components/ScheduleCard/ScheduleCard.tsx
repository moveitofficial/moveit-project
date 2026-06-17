'use client';

import { RectLabel, type RectLabelColor } from '@repo/ui/RectLabel';
import { formatDate, formatPrice } from '@repo/utils';

import * as styles from './ScheduleCard.css';

import type { OrderScheduleItem, ScheduleStatus } from '@/feature/user/api';
import type { Role } from '@/types/enums';

const STATUS_LABEL: Record<ScheduleStatus, string> = {
  IN_PROGRESS: '작업중',
  WORK_COMPLETED: '작업완료',
  DEADLINE_IMMINENT: '마감임박',
  EXPIRED: '기한만료',
};

const STATUS_COLOR: Record<ScheduleStatus, RectLabelColor> = {
  IN_PROGRESS: 'blue50',
  WORK_COMPLETED: 'yellow',
  DEADLINE_IMMINENT: 'red',
  EXPIRED: 'blue100',
};

interface Props {
  order: OrderScheduleItem;
  role: Role;
  onChat?: () => void;
  onRequestScheduleChange?: () => void;
  onChangeSchedule?: () => void;
}

export default function ScheduleCard({
  order,
  role,
  onChat,
  onRequestScheduleChange,
  onChangeSchedule,
}: Props) {
  const { title, status, amount, startDate, endDate, hasScheduleChangeRequest } =
    order;

  const canHandleSchedule = status !== 'WORK_COMPLETED';
  const showExpertRequest = canHandleSchedule && role === 'EXPERT';
  const showClientChange =
    canHandleSchedule && role === 'CLIENT' && hasScheduleChangeRequest;

  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <RectLabel text={STATUS_LABEL[status]} color={STATUS_COLOR[status]} />
        <p className={styles.title}>{title}</p>
        <p className={styles.schedule}>
          일정: {formatDate(startDate)} ~ {formatDate(endDate)}
        </p>
      </div>

      <div className={styles.aside}>
        <span className={styles.amount}>{formatPrice(amount)}</span>
        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={onChat}>
            채팅
          </button>
          {showClientChange && (
            <button
              type="button"
              className={styles.button}
              onClick={onChangeSchedule}
            >
              일정변경
            </button>
          )}
          {showExpertRequest && (
            <button
              type="button"
              className={styles.requestButton}
              onClick={onRequestScheduleChange}
            >
              일정변경 요청
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

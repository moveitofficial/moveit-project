import type { OrderScheduleItem } from '@/feature/user/api';
import type { Metadata } from 'next';

import { ScheduleView } from '@/feature/user/components';


export const metadata: Metadata = {
  title: '일정관리 | moveit',
};

// TODO: 확인용 임시 목데이터 (쿼리 연결 시 제거)
const MOCK_ORDERS: OrderScheduleItem[] = [
  {
    id: 'order-001',
    title: '프로팀의 앱개발 센스있는 디자인+개발 합니다.',
    status: 'IN_PROGRESS',
    amount: 80_000_000,
    startDate: '2025-05-27T00:00:00.000Z',
    endDate: '2025-06-30T00:00:00.000Z',
    hasScheduleChangeRequest: false,
  },
  {
    id: 'order-002',
    title: '프로팀의 앱개발 센스있는 디자인+개발 합니다.',
    status: 'WORK_COMPLETED',
    amount: 80_000_000,
    startDate: '2025-05-27T00:00:00.000Z',
    endDate: '2025-06-23T00:00:00.000Z',
    hasScheduleChangeRequest: false,
  },
  {
    id: 'order-003',
    title: '프로팀의 앱개발 센스있는 디자인+개발 합니다.',
    status: 'DEADLINE_IMMINENT',
    amount: 80_000_000,
    startDate: '2025-05-27T00:00:00.000Z',
    endDate: '2025-06-24T00:00:00.000Z',
    hasScheduleChangeRequest: true,
  },
];

export default function SchedulePage() {
  return <ScheduleView orders={MOCK_ORDERS} role="EXPERT" />;
}

import type { Metadata } from 'next';

import { ScheduleView } from '@/feature/user/components';

export const metadata: Metadata = {
  title: '일정관리 | moveit',
};

export default function SchedulePage() {
  return <ScheduleView />;
}

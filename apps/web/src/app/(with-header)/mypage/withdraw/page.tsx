import type { Metadata } from 'next';

import { WithdrawView } from '@/feature/user/components/WithdrawView';

export const metadata: Metadata = {
  title: '회원탈퇴 | moveit',
};

export default function WithdrawPage() {
  return <WithdrawView />;
}

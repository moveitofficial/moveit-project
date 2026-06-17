import type { Metadata } from 'next';

import { MyCommentsView } from '@/feature/user/components/MyCommentsView';

export const metadata: Metadata = {
  title: '내가 쓴 댓글 | moveit',
};

export default function MyCommentsPage() {
  return <MyCommentsView />;
}

import type { Metadata } from 'next';

import { MyReviewsView } from '@/feature/user/components/MyReviewsView';

export const metadata: Metadata = {
  title: '내가 쓴 리뷰 | moveit',
};

export default function MyReviewsPage() {
  return <MyReviewsView />;
}

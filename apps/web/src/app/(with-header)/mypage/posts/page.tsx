import type { Metadata } from 'next';

import { MyPostsView } from '@/feature/user/components/MyPostsView';

export const metadata: Metadata = {
  title: '내가 쓴 게시글 | moveit',
};

export default function MyPostsPage() {
  return <MyPostsView />;
}

import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

import { getCommunityPostDetail } from '@/feature/community/api';
import { CommunityPostWrite } from '@/feature/community/components/CommunityPostWrite';
import { getMe } from '@/feature/signup/api';

export const metadata: Metadata = {
  title: '글쓰기 | moveit',
};

interface Props {
  searchParams: Promise<{ id?: string }>;
}

// 로그인한 사용자만 접근. ?id가 있으면 편집(작성자 본인만).
export default async function CommunityWritePage({ searchParams }: Props) {
  const me = await getMe().catch(() => null);
  if (me === null) {
    redirect('/login');
  }

  const { id } = await searchParams;
  if (id === undefined) {
    return <CommunityPostWrite />;
  }

  const detail = await getCommunityPostDetail(id);
  if (detail === null) {
    redirect('/community');
  }
  // 작성자가 아니면 수정 불가 → 상세로.
  if (detail.post.userId !== me.data.id) {
    redirect(`/community/${id}`);
  }

  return (
    <CommunityPostWrite
      postId={id}
      initial={{
        category: detail.post.category,
        title: detail.post.title,
        content: detail.post.content,
      }}
    />
  );
}

import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

import { getCommunityPostDetail } from '@/feature/community/api';
import { CommunityPostDetail } from '@/feature/community/components/CommunityPostDetail';
import { getMe } from '@/feature/signup/api';

interface Props {
  params: Promise<{ postId: string }>;
}

export function generateMetadata(): Metadata {
  return { title: '자유게시판 | moveit' };
}

export default async function CommunityPostDetailPage({ params }: Props) {
  const { postId } = await params;

  const detail = await getCommunityPostDetail(postId);
  if (!detail) {
    notFound();
  }

  // 실제 로그인 사용자 id(쿠키 기반). 비로그인이면 null → 본인 글 편집/삭제 숨김.
  let currentUserId: string | null = null;
  try {
    const { data } = await getMe();
    currentUserId = data.id;
  } catch {
    currentUserId = null;
  }

  return (
    <CommunityPostDetail
      post={detail.post}
      comments={detail.comments}
      currentUserId={currentUserId}
    />
  );
}

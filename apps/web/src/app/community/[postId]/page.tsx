import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

import { getCommunityPostDetail } from '@/feature/community/api';
import { CommunityPostDetail } from '@/feature/community/components/CommunityPostDetail';
import { getMockAuthUser } from '@/mocks/user';

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

  const currentUserId = getMockAuthUser()?.id ?? null;

  return (
    <CommunityPostDetail
      post={detail.post}
      comments={detail.comments}
      currentUserId={currentUserId}
    />
  );
}

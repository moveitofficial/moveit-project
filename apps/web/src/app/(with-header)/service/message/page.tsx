import type { Metadata } from 'next';

import { MessageView } from '@/feature/message';
import { getMe } from '@/feature/signup/api';

export const metadata: Metadata = {
  title: '메시지 | moveit',
};

// 로그인 쿠키로 내 사용자 id를 서버에서 구한다. 비로그인이면 null.
async function getMyId(): Promise<string | null> {
  try {
    const { data } = await getMe();
    return data.id;
  } catch {
    return null;
  }
}

export default async function MessagePage({
  searchParams,
}: {
  searchParams: Promise<{ roomId?: string }>;
}) {
  const myId = await getMyId();
  const { roomId } = await searchParams;
  return <MessageView myId={myId} initialRoomId={roomId ?? null} />;
}


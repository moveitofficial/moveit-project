import { CsChatBoard } from '@/features/cs-chat';
import { getCsRooms } from '@/features/cs-chat/api';

export default async function CsPage() {
  // 첫 렌더 깜박임 방지: 목록을 서버에서 미리 받아 넘긴다
  const initialRooms = await getCsRooms({ page: 1 });

  return <CsChatBoard initialRooms={initialRooms} />;
}

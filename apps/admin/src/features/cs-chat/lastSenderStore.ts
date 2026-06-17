import { create } from 'zustand';

import type { SenderType } from './types';

/**
 * 방별 "마지막 메시지를 보낸 주체".
 * 소켓 메시지/내역에서 senderType를 알 수 있으므로, 목록 프로필을 보낸 사람 기준으로 표시한다.
 */
interface LastSenderState {
  byRoom: Record<string, SenderType>;
  setLastSender: (roomId: string, senderType: SenderType) => void;
}

export const useLastSenderStore = create<LastSenderState>((set) => ({
  byRoom: {},
  setLastSender: (roomId, senderType) =>
    { set((state) => ({ byRoom: { ...state.byRoom, [roomId]: senderType } })); },
}));

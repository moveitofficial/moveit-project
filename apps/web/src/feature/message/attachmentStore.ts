import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { MessageAttachment } from './types';

/**
 * 메시지별 첨부파일 캐시.
 * 내역 API(findMessages)가 attachments를 안 주므로, 소켓으로 받은 파일 정보를
 * 메시지 id로 저장해두고 재입장/새로고침 시 채워 넣는다. (sessionStorage 유지)
 */
interface AttachmentState {
  byMessageId: Record<string, MessageAttachment[]>;
  cache: (messageId: string, attachments: MessageAttachment[]) => void;
}

export const useAttachmentStore = create<AttachmentState>()(
  persist(
    (set) => ({
      byMessageId: {},
      cache: (messageId, attachments) => {
        set((state) => ({
          byMessageId: { ...state.byMessageId, [messageId]: attachments },
        }));
      },
    }),
    {
      name: 'moveit-chat-attachments',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

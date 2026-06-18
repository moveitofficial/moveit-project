import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CsMessageAttachment } from './types';

/**
 * 메시지별 첨부파일 캐시.
 * 내역 API가 attachments를 안 주므로, 소켓으로 받은 파일 정보를 메시지 id로 저장해두고
 * 재입장 시 채워 넣는다. (sessionStorage라 새로고침에도 유지)
 */
interface AttachmentState {
  byMessageId: Record<string, CsMessageAttachment[]>;
  cache: (messageId: string, attachments: CsMessageAttachment[]) => void;
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
      name: 'cs-attachments',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

import type { CommunityContentType } from '@/features/users/types';

interface CommunityDeleteCopy {
  title: string;
  placeholder: string;
  submitLabel: string;
}

export const COMMUNITY_DELETE_COPY: Record<
  CommunityContentType,
  CommunityDeleteCopy
> = {
  post: {
    title: '게시글 삭제',
    placeholder: '삭제 사유를 입력해주세요',
    submitLabel: '게시글 삭제',
  },
  comment: {
    title: '댓글 삭제',
    placeholder: '삭제 사유를 입력해주세요',
    submitLabel: '댓글 삭제',
  },
};

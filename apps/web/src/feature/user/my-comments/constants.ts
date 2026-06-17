export type MyCommentSort = 'latest' | 'oldest';

export const MY_COMMENT_PAGE_SIZE = 10;

export const MY_COMMENT_SORT_OPTIONS: { id: MyCommentSort; label: string }[] =
  [
    { id: 'latest', label: '최신순' },
    { id: 'oldest', label: '오래된순' },
  ];

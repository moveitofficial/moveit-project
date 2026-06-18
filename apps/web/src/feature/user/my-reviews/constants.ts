export type MyReviewSort = 'latest' | 'oldest';

export const MY_REVIEW_PAGE_SIZE = 10;

export const MY_REVIEW_SORT_OPTIONS: { id: MyReviewSort; label: string }[] = [
  { id: 'latest', label: '최신순' },
  { id: 'oldest', label: '오래된순' },
];

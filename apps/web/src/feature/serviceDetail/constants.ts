/** 본문 sticky 사이드바 top 오프셋 */
export const SERVICE_DETAIL_STICKY_TOP = 24;

/** 본문 sticky 탭 네비게이션 top 오프셋 */
export const SERVICE_DETAIL_TAB_STICKY_TOP = 0;

export const SERVICE_DETAIL_TABS = [
  { id: 'portfolio', label: '포트폴리오' },
  { id: 'description', label: '서비스 설명' },
  { id: 'faq', label: '자주 묻는 질문' },
  { id: 'refund', label: '환불규정' },
  { id: 'reviews', label: '리뷰' },
] as const;

/** 서비스 설명 접힘 시 최대 높이 */
export const SERVICE_DESCRIPTION_COLLAPSED_MAX_HEIGHT = 560;

export const SERVICE_DETAIL_REVIEW_PAGE_SIZE = 5;

export const SERVICE_DETAIL_PORTFOLIO_PREVIEW_COUNT = 4;

export const SERVICE_DETAIL_REVIEW_SORT_OPTIONS = [
  { id: 'latest', label: '최신순' },
  { id: 'rating', label: '평점순' },
] as const;

export const MOCK_EXPERT_CONTACT_TIME = {
  start: 'AM 09:00',
  end: 'PM 06:00',
} as const;

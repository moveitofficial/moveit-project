import type { ApiSuccess, PaginatedResult, Review } from './types';

export const mockReviews: Review[] = [
  {
    id: 'rev-001',
    rating: 5,
    content: '정말 만족스러운 작업이었습니다. 의사소통도 원활했고, 결과물도 기대 이상이었어요.',
    createdAt: '2026-04-15T10:30:00.000Z',
    reviewer: {
      id: 'user-101',
      name: '이수민',
      profileImageUrl: 'https://i.pravatar.cc/150?img=20',
    },
  },
  {
    id: 'rev-002',
    rating: 5,
    content: '두 번째 의뢰입니다. 항상 만족스러워서 다음에도 이용할 예정이에요.',
    createdAt: '2026-04-10T14:00:00.000Z',
    reviewer: {
      id: 'user-102',
      name: '박철수',
      profileImageUrl: 'https://i.pravatar.cc/150?img=22',
    },
  },
  {
    id: 'rev-003',
    rating: 4,
    content: '결과물은 좋았는데 일정이 조금 지연된 점은 아쉬웠습니다.',
    createdAt: '2026-04-05T09:15:00.000Z',
    reviewer: {
      id: 'user-103',
      name: '최영희',
      profileImageUrl: null,
    },
  },
  {
    id: 'rev-004',
    rating: 5,
    content: '디자인 시안이 너무 마음에 들어요. 추천합니다!',
    createdAt: '2026-03-28T16:45:00.000Z',
    reviewer: {
      id: 'user-104',
      name: '김도현',
      profileImageUrl: 'https://i.pravatar.cc/150?img=11',
    },
  },
];

export const mockServiceReviewsResponse: ApiSuccess<PaginatedResult<Review>> = {
  success: true,
  message: '요청 성공',
  data: {
    items: mockReviews,
    pagination: { page: 1, pageSize: 20, totalCount: 4, hasNext: false },
  },
};

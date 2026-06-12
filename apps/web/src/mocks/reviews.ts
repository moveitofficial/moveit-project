import type { ApiSuccess, PaginatedResult, Review } from './types';

export const mockReviews: Review[] = [
  {
    id: 'rev-001',
    rating: 4,
    content:
      '바이브 코딩으로 사이트를 만들려다가 된통 크게 낭패를 본 뒤에 나인원랩스에 작업을 맡겼습니다. 까다로운 요구 사항들을 다 받아 주시고 마지막까지 마치 내 것처럼 정성스럽게 공 들여서 사이트 구축을 마무리 주셔서 감사합니다. 고맙습니다.!',
    createdAt: '2026-04-07T10:30:00.000Z',
    reviewer: {
      id: 'user-101',
      name: '닉네임',
      profileImageUrl: null,
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
  {
    id: 'rev-005',
    rating: 5,
    content: '요구사항 정리부터 일정 관리까지 꼼꼼하게 챙겨주셔서 믿고 맡길 수 있었습니다.',
    createdAt: '2026-03-20T11:00:00.000Z',
    reviewer: {
      id: 'user-105',
      name: '정하늘',
      profileImageUrl: null,
    },
  },
  {
    id: 'rev-006',
    rating: 4,
    content: '전반적으로 만족스럽고, 중간 피드백 반영도 빨랐습니다.',
    createdAt: '2026-03-15T09:30:00.000Z',
    reviewer: {
      id: 'user-106',
      name: '오민지',
      profileImageUrl: null,
    },
  },
  {
    id: 'rev-007',
    rating: 5,
    content: '첫 외주였는데 결과물 퀄리티가 기대 이상이었어요.',
    createdAt: '2026-03-10T18:20:00.000Z',
    reviewer: {
      id: 'user-107',
      name: '한지우',
      profileImageUrl: null,
    },
  },
];

export const mockServiceReviewsResponse: ApiSuccess<PaginatedResult<Review>> = {
  success: true,
  message: '요청 성공',
  data: {
    items: mockReviews,
    pagination: { page: 1, pageSize: 20, totalCount: 7, hasNext: false },
  },
};

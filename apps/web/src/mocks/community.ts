import type {
  ApiSuccess,
  CommunityComment,
  CommunityPost,
  PaginatedResult,
} from './types';

const postOne: CommunityPost = {
  id: 'post-001',
  category: 'QUESTION',
  title: 'Next.js 14 app router에서 server action 폼처리 어떻게 하시나요?',
  content: '서버 액션으로 form submit 처리하려는데 revalidatePath 타이밍이 헷갈려서요. 경험 있으신 분들 의견 부탁드립니다!',
  author: {
    id: 'user-201',
    name: '개발하는 조한준',
    profileImageUrl: 'https://i.pravatar.cc/150?img=8',
  },
  likeCount: 233,
  commentCount: 233,
  viewCount: 1240,
  isLiked: false,
  createdAt: '2026-05-10T14:20:00.000Z',
};

const postTwo: CommunityPost = {
  id: 'post-002',
  category: 'TIP',
  title: 'NestJS Prisma 트랜잭션 처리 베스트 프랙티스 공유',
  content: '프로젝트하면서 정리한 interactive transaction 패턴들 공유합니다. 롤백 처리와 에러 핸들링 위주로 정리했어요.',
  author: {
    id: 'user-202',
    name: '백엔드 길드장',
    profileImageUrl: 'https://i.pravatar.cc/150?img=15',
  },
  likeCount: 187,
  commentCount: 42,
  viewCount: 980,
  isLiked: true,
  createdAt: '2026-05-09T10:00:00.000Z',
};

const postThree: CommunityPost = {
  id: 'post-003',
  category: 'REVIEW',
  title: 'MOVIT에서 앱 개발 의뢰한 후기 공유드려요',
  content: '앱 개발 의뢰했는데 너무 만족스러워서 후기 남깁니다. 매칭부터 정산까지 전체 진행 과정 공유드려요.',
  author: {
    id: 'user-203',
    name: '의뢰인 김민수',
    profileImageUrl: null,
  },
  likeCount: 156,
  commentCount: 31,
  viewCount: 720,
  isLiked: false,
  createdAt: '2026-05-08T09:15:00.000Z',
};

const postFour: CommunityPost = {
  id: 'post-004',
  category: 'FREE',
  title: '요즘 사이드 프로젝트 어떻게들 시작하시나요',
  content: '혼자 기획부터 다 하기엔 막막한데, 다들 어떻게 동료 구해서 시작하시는지 궁금합니다.',
  author: {
    id: 'user-204',
    name: '프리랜서 지망생',
    profileImageUrl: 'https://i.pravatar.cc/150?img=12',
  },
  likeCount: 64,
  commentCount: 18,
  viewCount: 410,
  isLiked: false,
  createdAt: '2026-05-07T16:40:00.000Z',
};

const postFive: CommunityPost = {
  id: 'post-005',
  category: 'STUDY_GROUP',
  title: '[모집] React 19 + Next.js 15 스터디 멤버 구합니다',
  content: '매주 토요일 오프라인(강남) + 디스코드로 진행 예정입니다. 코드 리뷰 중심으로 갈 예정이고 인원은 4명까지 받습니다.',
  author: {
    id: 'user-205',
    name: '스터디 운영자',
    profileImageUrl: 'https://i.pravatar.cc/150?img=22',
  },
  likeCount: 38,
  commentCount: 12,
  viewCount: 260,
  isLiked: false,
  createdAt: '2026-05-06T11:05:00.000Z',
};

export const mockCommunityPosts: CommunityPost[] = [
  postOne,
  postTwo,
  postThree,
  postFour,
  postFive,
];

export const mockCommunityComments: CommunityComment[] = [
  {
    id: 'cmt-001',
    parentCommentId: null,
    content: '저도 비슷한 고민 중인데, 안정성이 중요하면 18, 새 기능이 필요하면 19로 가는 게 좋을 것 같아요.',
    author: {
      id: 'user-301',
      name: '시니어개발자',
      profileImageUrl: 'https://i.pravatar.cc/150?img=25',
    },
    likeCount: 5,
    createdAt: '2026-05-10T15:00:00.000Z',
    replies: [
      {
        id: 'cmt-002',
        parentCommentId: 'cmt-001',
        content: '답변 감사합니다! 큰 도움이 됐어요.',
        author: {
          id: 'user-201',
          name: '개발새내기',
          profileImageUrl: 'https://i.pravatar.cc/150?img=8',
        },
        likeCount: 0,
        createdAt: '2026-05-10T15:30:00.000Z',
      },
    ],
  },
  {
    id: 'cmt-003',
    parentCommentId: null,
    content: 'Server Component 활용도가 높으면 19가 확실히 유리합니다.',
    author: {
      id: 'user-302',
      name: 'NextJS러버',
      profileImageUrl: 'https://i.pravatar.cc/150?img=27',
    },
    likeCount: 3,
    createdAt: '2026-05-10T16:00:00.000Z',
  },
];

export const mockCommunityPostsResponse: ApiSuccess<PaginatedResult<CommunityPost>> = {
  success: true,
  message: '요청 성공',
  data: {
    items: mockCommunityPosts,
    pagination: { page: 1, pageSize: 20, totalCount: 5, hasNext: false },
  },
};

export const mockCommunityPostDetailResponse: ApiSuccess<
  CommunityPost & { comments: CommunityComment[] }
> = {
  success: true,
  message: '요청 성공',
  data: {
    ...postOne,
    comments: mockCommunityComments,
  },
};

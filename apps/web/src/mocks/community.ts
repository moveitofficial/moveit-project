import type {
  ApiSuccess,
  CommunityComment,
  CommunityPost,
  PaginatedResult,
} from './types';

const postOne: CommunityPost = {
  id: 'post-001',
  category: 'FREE',
  title: 'React 18 vs 19 어떤 게 더 좋을까요?',
  content: '새 프로젝트 시작하는데 React 19로 가야할지 고민이에요. 경험 있으신 분들 의견 부탁드립니다!',
  author: {
    id: 'user-201',
    name: '개발새내기',
    profileImageUrl: 'https://i.pravatar.cc/150?img=8',
  },
  likeCount: 12,
  commentCount: 5,
  viewCount: 234,
  isLiked: false,
  createdAt: '2026-05-10T14:20:00.000Z',
};

const postTwo: CommunityPost = {
  id: 'post-002',
  category: 'QUESTION',
  title: 'NestJS에서 트랜잭션 어떻게 처리하시나요?',
  content: 'Prisma 쓰는데 트랜잭션 처리 모범 사례가 궁금합니다.',
  author: {
    id: 'user-202',
    name: '백엔드충',
    profileImageUrl: 'https://i.pravatar.cc/150?img=15',
  },
  likeCount: 8,
  commentCount: 3,
  viewCount: 156,
  isLiked: true,
  createdAt: '2026-05-09T10:00:00.000Z',
};

const postThree: CommunityPost = {
  id: 'post-003',
  category: 'REVIEW',
  title: '코드잇 에이전시에 의뢰 후기',
  content: '앱 개발 의뢰했는데 너무 만족스러워서 후기 남깁니다. 진행 과정 공유드려요.',
  author: {
    id: 'user-203',
    name: '의뢰인이당',
    profileImageUrl: null,
  },
  likeCount: 24,
  commentCount: 8,
  viewCount: 412,
  isLiked: false,
  createdAt: '2026-05-08T09:15:00.000Z',
};

export const mockCommunityPosts: CommunityPost[] = [postOne, postTwo, postThree];

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
  message: '게시글 목록을 조회했습니다.',
  data: {
    items: mockCommunityPosts,
    pagination: { page: 1, pageSize: 20, totalCount: 3, hasNext: false },
  },
};

export const mockCommunityPostDetailResponse: ApiSuccess<
  CommunityPost & { comments: CommunityComment[] }
> = {
  success: true,
  message: '게시글 상세를 조회했습니다.',
  data: {
    ...postOne,
    comments: mockCommunityComments,
  },
};

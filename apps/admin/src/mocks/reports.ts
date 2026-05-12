import type { AdminReport, ApiSuccess, PaginatedResult } from './types';

const adminReportOne: AdminReport = {
  id: 'rep-001',
  reporterName: '김지훈',
  reporterId: 'user-001',
  targetUserName: '박상민',
  targetUserId: 'user-003',
  reason: 'ABUSE',
  detail: '욕설 및 비방이 있었습니다. 채팅 내역 첨부합니다.',
  imageUrls: ['https://picsum.photos/seed/report1/600/400'],
  status: 'PENDING',
  adminMemo: null,
  createdAt: '2026-05-11T10:30:00.000Z',
  processedAt: null,
};

export const mockAdminReports: AdminReport[] = [
  adminReportOne,
  {
    id: 'rep-002',
    reporterName: '이수민',
    reporterId: 'user-002',
    targetUserName: '나쁜전문가',
    targetUserId: 'expert-bad-001',
    reason: 'FRAUD',
    detail: '계약과 다른 결과물을 제공했습니다.',
    imageUrls: [
      'https://picsum.photos/seed/report2-1/600/400',
      'https://picsum.photos/seed/report2-2/600/400',
    ],
    status: 'IN_REVIEW',
    adminMemo: '확인 중',
    createdAt: '2026-05-09T14:00:00.000Z',
    processedAt: null,
  },
  {
    id: 'rep-003',
    reporterName: '최영희',
    reporterId: 'user-004',
    targetUserName: '문제유저',
    targetUserId: 'user-bad-001',
    reason: 'SPAM',
    detail: '스팸성 메시지를 반복 발송합니다.',
    imageUrls: [],
    status: 'RESOLVED',
    adminMemo: '블랙리스트 처리 완료',
    createdAt: '2026-05-05T11:00:00.000Z',
    processedAt: '2026-05-06T15:00:00.000Z',
  },
];

export const mockAdminReportsResponse: ApiSuccess<PaginatedResult<AdminReport>> = {
  success: true,
  message: '신고 내역을 조회했습니다.',
  data: {
    items: mockAdminReports,
    pagination: { page: 1, pageSize: 50, totalCount: 3, hasNext: false },
  },
};

export const mockAdminReportDetailResponse: ApiSuccess<AdminReport> = {
  success: true,
  message: '신고 상세를 조회했습니다.',
  data: adminReportOne,
};

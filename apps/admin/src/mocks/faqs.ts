import type { AdminFaq, ApiSuccess, PaginatedResult } from './types';

export const mockAdminFaqs: AdminFaq[] = [
  {
    id: 'faq-001',
    title: '기획서나 디자인이 없어도 개발이 가능한가요?',
    content: '가능합니다. 전문가와 상담 후 진행할 수 있으며, 기획 및 디자인부터 함께 진행 가능합니다.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'faq-002',
    title: '결제는 어떻게 이루어지나요?',
    content: '토스 결제 시스템을 통해 카드/계좌이체로 안전하게 결제하실 수 있습니다.',
    order: 2,
    isPublished: true,
    createdAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'faq-003',
    title: '환불 정책이 어떻게 되나요?',
    content: '작업 시작 전에는 100% 환불 가능하며, 진행 중인 경우 진행률에 따라 차등 환불됩니다.',
    order: 3,
    isPublished: true,
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'faq-004',
    title: '전문가 등록은 어떻게 하나요?',
    content: '회원가입 시 전문가로 선택 후 필수 정보를 입력하시면 관리자 승인 후 활동 가능합니다.',
    order: 4,
    isPublished: false,
    createdAt: '2026-02-01T10:00:00.000Z',
  },
];

export const mockAdminFaqsResponse: ApiSuccess<PaginatedResult<AdminFaq>> = {
  success: true,
  message: 'FAQ 목록을 조회했습니다.',
  data: {
    items: mockAdminFaqs,
    pagination: { page: 1, pageSize: 50, totalCount: 4, hasNext: false },
  },
};

export const mockPublicFaqsResponse: ApiSuccess<AdminFaq[]> = {
  success: true,
  message: 'FAQ 목록을 조회했습니다.',
  data: mockAdminFaqs.filter((f) => f.isPublished),
};

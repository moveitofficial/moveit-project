import type { ApiSuccess, Faq, PaginatedResult } from './types';

export const mockFaqs: Faq[] = [
  {
    id: 'faq-001',
    title: '회원가입은 어떻게 하나요?',
    content:
      '메인 우측 상단의 "회원가입" 버튼을 통해 이메일 또는 SNS(구글/카카오/네이버)로 가입할 수 있어요. 의뢰인과 전문가 회원가입은 분리되어 있습니다.',
    createdAt: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 'faq-002',
    title: '전문가로 활동하려면 어떻게 신청하나요?',
    content:
      '회원가입 시 "판매자(전문가)" 회원가입을 선택하시고, 마이페이지에서 사업자 정보·전문 카테고리·기술 스택을 입력하면 관리자 승인 후 서비스를 등록하실 수 있어요.',
    createdAt: '2026-01-10T09:05:00.000Z',
  },
  {
    id: 'faq-003',
    title: '결제는 안전한가요?',
    content:
      '결제 금액은 무빗에서 안전하게 보관(에스크로)하고, 작업이 완료된 뒤 구매확정 시 전문가에게 정산됩니다. 작업 시작 전 취소 시 100% 환불됩니다.',
    createdAt: '2026-01-12T11:30:00.000Z',
  },
  {
    id: 'faq-004',
    title: '환불 정책이 어떻게 되나요?',
    content:
      '작업 시작 전: 100% 환불 / 작업 진행 중: 진행률 차감 후 환불 / 작업 완료 후: 환불 불가. 상세 정책은 각 서비스 상세페이지의 환불 정책을 확인해주세요.',
    createdAt: '2026-01-12T11:35:00.000Z',
  },
  {
    id: 'faq-005',
    title: '전문가와 직접 소통할 수 있나요?',
    content:
      '서비스 상세페이지의 "문의하기" 버튼을 누르면 전문가와 1:1 채팅으로 소통하실 수 있어요. 거래·결제·일정 변경 요청도 채팅에서 진행됩니다.',
    createdAt: '2026-02-01T10:00:00.000Z',
  },
  {
    id: 'faq-006',
    title: '리뷰는 누가 작성할 수 있나요?',
    content:
      '구매확정을 완료한 의뢰인만 해당 주문에 대해 리뷰를 작성할 수 있어요. 한 주문당 1회만 작성 가능합니다.',
    createdAt: '2026-02-15T14:20:00.000Z',
  },
  {
    id: 'faq-007',
    title: '계정이 차단되면 어떻게 해야 하나요?',
    content:
      '관리자가 정책 위반 등의 사유로 계정을 차단한 경우, 로그인 시 안내 화면이 표시됩니다. 이의 신청은 고객센터(1:1 문의)로 접수해주세요.',
    createdAt: '2026-03-01T16:00:00.000Z',
  },
  {
    id: 'faq-008',
    title: '커뮤니티 글은 누구나 쓸 수 있나요?',
    content:
      '회원이면 카테고리(질문 / 팁 공유 / 후기 / 스터디모임 / 자유) 어느 곳이든 자유롭게 작성하실 수 있어요. 운영정책 위반 시 게시글이 삭제될 수 있습니다.',
    createdAt: '2026-03-20T09:15:00.000Z',
  },
];

export const mockFaqsResponse: ApiSuccess<PaginatedResult<Faq>> = {
  success: true,
  message: '요청 성공',
  data: {
    items: mockFaqs,
    pagination: { page: 1, pageSize: 20, totalCount: mockFaqs.length, hasNext: false },
  },
};

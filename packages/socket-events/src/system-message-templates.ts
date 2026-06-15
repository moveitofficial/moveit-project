export type SystemMessageType =
  | 'TRADE_REQUEST'
  | 'TRADE_CANCELED'
  | 'TRADE_REQUEST_EXPIRED'
  | 'PAYMENT_HELD'
  | 'PAYMENT_COMPLETED'
  | 'SCHEDULE_REQUEST'
  | 'SCHEDULE_REGISTERED'
  | 'SCHEDULE_CHANGE_REQUEST';

export type SystemMessageRole = 'CLIENT' | 'EXPERT';

// 소켓 이벤트로 전송되는 payload (type별 discriminated union)
export type SystemMessageSocketPayload =
  | {
      systemType: 'TRADE_REQUEST';
      serviceTitle: string;
      servicePrice: number;
      platformFee: number;
      totalAmount: number;
      expertSettlementAmount: number;
    }
  | {
      systemType: 'TRADE_CANCELED';
      serviceTitle: string;
      servicePrice: number;
      platformFee: number;
      totalAmount: number;
      expertSettlementAmount: number;
    }
  | {
      systemType: 'TRADE_REQUEST_EXPIRED';
      serviceTitle: string;
      servicePrice: number;
      platformFee: number;
      totalAmount: number;
      expertSettlementAmount: number;
    }
  | { systemType: 'PAYMENT_HELD' }
  | {
      systemType: 'PAYMENT_COMPLETED';
      serviceTitle: string;
      servicePrice: number;
      platformFee: number;
      totalAmount: number;
      expertSettlementAmount: number;
    }
  | { systemType: 'SCHEDULE_REQUEST' }
  | {
      systemType: 'SCHEDULE_REGISTERED';
      serviceTitle: string;
      startDate: string;
      endDate: string;
    }
  | {
      systemType: 'SCHEDULE_CHANGE_REQUEST';
      serviceTitle: string;
      clientName: string;
      expertBusinessName: string;
    };

// 템플릿 fields key 타입 정의용 (모든 가능한 필드의 합집합)
export interface SystemMessageOrderPayload {
  serviceTitle?: string;
  servicePrice?: number;
  platformFee?: number;
  totalAmount?: number;
  expertSettlementAmount?: number;
  startDate?: string;
  endDate?: string;
  clientName?: string;
  expertBusinessName?: string;
}

export type SystemMessageFieldFormat = 'text' | 'currency' | 'date';

export interface SystemMessageField {
  label: string;
  key: keyof SystemMessageOrderPayload;
  format: SystemMessageFieldFormat;
  roles?: SystemMessageRole[]; // 없으면 양쪽 모두
}

// DB content 필드 및 알림/채팅목록 미리보기용 중립 텍스트
export const SYSTEM_MESSAGE_CONTENT: Record<SystemMessageType, string> = {
  TRADE_REQUEST: '거래 요청이 왔어요',
  TRADE_CANCELED: '거래 요청이 취소됐어요',
  TRADE_REQUEST_EXPIRED: '거래 요청이 만료됐어요',
  PAYMENT_HELD: '무빗이 결제 금액을 안전하게 보관하고 있어요',
  PAYMENT_COMPLETED: '결제가 완료됐어요',
  SCHEDULE_REQUEST: '일정 등록 요청이 왔어요',
  SCHEDULE_REGISTERED: '일정 등록이 완료됐어요',
  SCHEDULE_CHANGE_REQUEST: '일정 변경 요청이 왔어요',
};

// 메시지 상세 렌더링용 템플릿
export const SYSTEM_MESSAGE_TEMPLATES: Record<
  SystemMessageType,
  {
    recipientRoles?: SystemMessageRole[]; // 없으면 양쪽 모두
    title: (role: SystemMessageRole) => string;
    body: (role: SystemMessageRole) => string;
    fields: SystemMessageField[];
  }
> = {
  TRADE_REQUEST: {
    title: (role) =>
      role === 'EXPERT'
        ? '고객에게 거래를 요청했어요'
        : '전문가가 거래를 요청했어요',
    body: (role) =>
      role === 'EXPERT'
        ? '고객이 요청을 확인하고 있어요.\n고객이 결제를 완료하면 서비스를 진행해 주세요.'
        : '금액이 맞는지 확인하고 결제를 진행해 주세요.',
    fields: [
      { label: '서비스명', key: 'serviceTitle', format: 'text' },
      { label: '서비스 금액', key: 'servicePrice', format: 'currency' },
      { label: '무빗 수수료', key: 'platformFee', format: 'currency', roles: ['CLIENT'] },
      { label: '최종 결제금액', key: 'totalAmount', format: 'currency', roles: ['CLIENT'] },
      { label: '최종 정산예정금액', key: 'expertSettlementAmount', format: 'currency', roles: ['EXPERT'] },
    ],
  },
  TRADE_CANCELED: {
    title: () => '거래 요청이 취소됐어요',
    body: (role) =>
      role === 'EXPERT'
        ? '다시 거래를 원하신다면 고객과 협의 후 진행해 주세요.'
        : '다시 거래를 원하신다면 전문가와 협의 후 진행해 주세요.',
    fields: [
      { label: '서비스명', key: 'serviceTitle', format: 'text' },
      { label: '서비스 금액', key: 'servicePrice', format: 'currency' },
      { label: '무빗 수수료', key: 'platformFee', format: 'currency', roles: ['CLIENT'] },
      { label: '최종 결제금액', key: 'totalAmount', format: 'currency', roles: ['CLIENT'] },
      { label: '최종 정산예정금액', key: 'expertSettlementAmount', format: 'currency', roles: ['EXPERT'] },
    ],
  },
  TRADE_REQUEST_EXPIRED: {
    title: () => '거래 요청이 만료됐어요',
    body: (role) =>
      role === 'EXPERT'
        ? '다시 거래를 원하신다면 고객과 협의 후 진행해 주세요.'
        : '다시 거래를 원하신다면 전문가와 협의 후 진행해 주세요.',
    fields: [
      { label: '서비스명', key: 'serviceTitle', format: 'text' },
      { label: '서비스 금액', key: 'servicePrice', format: 'currency' },
      { label: '무빗 수수료', key: 'platformFee', format: 'currency', roles: ['CLIENT'] },
      { label: '최종 결제금액', key: 'totalAmount', format: 'currency', roles: ['CLIENT'] },
      { label: '최종 정산예정금액', key: 'expertSettlementAmount', format: 'currency', roles: ['EXPERT'] },
    ],
  },
  PAYMENT_HELD: {
    recipientRoles: ['CLIENT'],
    title: () => '무빗이 결제 금액을\n안전하게 보관하고 있어요',
    body: () =>
      '최종 결과물을 받고 거래 확정 버튼을 눌러주세요.\n거래를 확정하면 전문가에게 결제 금액이 송금됩니다.',
    fields: [],
  },
  PAYMENT_COMPLETED: {
    title: () => '결제가 완료되었습니다',
    body: (role) =>
      role === 'EXPERT'
        ? '고객과 협의 후 반드시 일정을 등록해 주세요.\n일정을 등록하지 않으면 구매 확정을 진행할 수 없습니다. 또한, 등록된 일정 내에 작업을 완료하지 못할 경우 고객이 환불을 요청하면 전액 환불될 수 있습니다.'
        : '일정 등록을 요청해주세요.\n일정을 등록하지 않으면 구매 확정을 진행할 수 없습니다. 일정 내 작업 미완료 시 전액 무료환불이 가능해요.',
    fields: [
      { label: '서비스명', key: 'serviceTitle', format: 'text' },
      { label: '서비스 금액', key: 'servicePrice', format: 'currency' },
      { label: '무빗 수수료', key: 'platformFee', format: 'currency', roles: ['CLIENT'] },
      { label: '최종 결제금액', key: 'totalAmount', format: 'currency', roles: ['CLIENT'] },
      { label: '최종 정산예정금액', key: 'expertSettlementAmount', format: 'currency', roles: ['EXPERT'] },
    ],
  },
  SCHEDULE_REQUEST: {
    recipientRoles: ['CLIENT'],
    title: () => '일정을 등록해주세요',
    body: () =>
      '판매자에게 일정 등록을 요청해 주세요.\n일정을 등록하지 않으면 구매 확정을 진행할 수 없습니다. 일정 내 작업 미완료 시 전액 무료환불이 가능합니다.',
    fields: [],
  },
  SCHEDULE_REGISTERED: {
    title: () => '일정 등록이 완료되었습니다',
    body: (role) =>
      role === 'EXPERT'
        ? '마감일 미준수 시 구매자 요청에 따라 100% 환불이 진행됩니다. 일정 변경 시 반드시 고객님과 상의 후 일정을 변경하세요.'
        : '마감일 미준수 시 100% 환불이 가능합니다.',
    fields: [
      { label: '서비스명', key: 'serviceTitle', format: 'text' },
      { label: '시작일', key: 'startDate', format: 'date' },
      { label: '마감일', key: 'endDate', format: 'date' },
    ],
  },
  SCHEDULE_CHANGE_REQUEST: {
    title: () => '일정 변경 요청',
    body: (role) =>
      role === 'EXPERT'
        ? '구매자님에게 일정 변경을 요청했습니다.'
        : '판매자님이 일정 변경을 요청했습니다.',
    fields: [
      { label: '서비스명', key: 'serviceTitle', format: 'text' },
      { label: '구매자', key: 'clientName', format: 'text', roles: ['EXPERT'] },
      { label: '판매자', key: 'expertBusinessName', format: 'text', roles: ['CLIENT'] },
    ],
  },
};

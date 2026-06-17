export type UserRole = 'CLIENT' | 'EXPERT' | 'ADMIN' | 'SUPER_ADMIN';
export type ExpertApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'; // api 확인 후 수정 예정

export type Provider = 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER';

export type ActivityType =
  | 'EXPERT_APPROVED'
  | 'EXPERT_REJECTED'
  | 'MAIN_UPDATED'
  | 'FAQ_CREATED'
  | 'FAQ_UPDATED'
  | 'FAQ_DELETED'
  | 'BLACKLIST_ADDED'
  | 'BLACKLIST_REMOVED'
  | 'REFUND_APPROVED'
  | 'CANCEL_APPROVED'
  | 'CS_ASSIGNED'
  | 'CS_CLOSED'
  | 'SETTLEMENT_COMPLETED';

export type ServiceType = 'IT_COACHING' | 'PROJECT_REQUEST';
export type ServiceCategory = 'WEB' | 'APP' | 'AI' | 'GAME' | 'DATA_ANALYTICS';
export type ServiceStatus = 'ACTIVE' | 'PAUSED' | 'CLOSED';

export type OrderStatus =
  | 'NEGOTIATING'
  | 'CANCEL_REQUESTED'
  | 'PAYMENT_CANCELLED'
  | 'IN_PROGRESS'
  | 'DEADLINE_IMMINENT'
  | 'EXPIRED'
  | 'WORK_COMPLETED'
  | 'PURCHASE_CONFIRMED'
  | 'SETTLEMENT_REQUESTED'
  | 'SETTLEMENT_COMPLETED'
  | 'REFUND_REQUESTED'
  | 'REFUND_COMPLETED';
export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';
export type SettlementStatus = Extract<
  OrderStatus,
  'SETTLEMENT_REQUESTED' | 'SETTLEMENT_COMPLETED'
>;
export type RefundStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export type ReportReason =
  | 'FALSE_INFORMATION'
  | 'ABUSE'
  | 'ILLEGAL_ACTIVITY'
  | 'EXTERNAL_CONTACT'
  | 'SPAM'
  | 'OTHER';

export type ReportStatus = 'PENDING' | 'COMPLETED';

export type CSChatStatus = 'OPEN' | 'ASSIGNED' | 'CLOSED';

export type Region =
  | 'SEOUL'
  | 'BUSAN'
  | 'DAEGU'
  | 'INCHEON'
  | 'GWANGJU'
  | 'DAEJEON'
  | 'ULSAN'
  | 'SEJONG'
  | 'GYEONGGI_NORTH'
  | 'GYEONGGI_SOUTH'
  | 'GANGWON'
  | 'CHUNGBUK'
  | 'CHUNGNAM'
  | 'JEONBUK'
  | 'JEONNAM'
  | 'GYEONGBUK'
  | 'GYEONGNAM'
  | 'JEJU';

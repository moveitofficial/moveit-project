import type {
  ExpertApprovalStatus,
  Provider,
  ReportReason,
  ServiceType,
} from '@/types/enums';

// 유저 목록
export interface UserItem {
  id: string;
  name: string | null;
  email: string;
  provider: Provider;
  region: string | null;
  paymentCount: number;
  reportCount: number;
  businessName: string | null;
  specialtyGroup: ServiceType | null;
  approvalStatus: ExpertApprovalStatus | null;
  createdAt: string;
}

export interface ClientUserFilterParams {
  tab: 'CLIENT';
  search?: string;
  provider?: Provider;
  region?: string;
  pageSize?: number;
}

export interface ExpertUserFilterParams {
  tab: 'EXPERT';
  search?: string;
  provider?: Provider;
  region?: string;
  approvalStatus?: ExpertApprovalStatus;
  serviceType?: ServiceType;
  pageSize?: number;
}

export type UserFilterParams = ClientUserFilterParams | ExpertUserFilterParams;

// 유저 상세 정보 (UserDetail)
interface SpecialtyInfo {
  serviceGroupName: ServiceType | null;
  serviceCategoryNames: string[];
}

export interface ExpertDetail {
  isApplied: boolean;
  isApproved: boolean;
  approvedAt: string | null;
  approvedByAdminName: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  businessName: string | null;
  businessNumber: string | null;
  ceoName: string | null;
  contactTimeStart: string | null;
  contactTimeEnd: string | null;
  foundedYear: number | null;
  employeeMin: number | null;
  employeeMax: number | null;
  description: string | null;
  techStacks: string[];
  portfolios: { id: string; title: string; mainImageUrl: string | null }[];
}

interface UserDetailBase {
  id: string;
  name: string | null;
  email: string;
  provider: Provider;
  region: string | null;
  phoneNumber: string | null;
  profileImageUrl: string | null;
  bankName: string | null;
  bankAccount: string | null;
  createdAt: string;
  isBlocked: boolean;
  blockedAt: string | null;
  blockedByAdminName: string | null;
  specialty: SpecialtyInfo | null;
}

export interface ClientUserDetail extends UserDetailBase {
  role: 'CLIENT';
  nickname: string | null;
}

export interface ExpertUserDetail extends UserDetailBase {
  role: 'EXPERT';
  expert: ExpertDetail;
}

export type UserDetailData = ClientUserDetail | ExpertUserDetail;

// 주문/서비스 테이블 (UserSectionTable)
export interface UserOrderItem {
  id: string;
  service: { id: string; title: string };
  expert: { id: string; name: string | null };
  status: string;
  totalAmount: number;
  platformFee: number;
  endDate: string | null;
  refund: string | null;
  createdAt: string;
}

export interface UserServiceItem {
  id: string;
  title: string;
  status: string;
  servicePrice: number;
  salesCount: number;
  createdAt: string;
}

// 서비스별 주문 모달 (ServiceOrdersModal)
export interface ServiceOrderItem {
  id: string;
  status: string;
  totalAmount: number;
  startDate: string;
  endDate: string | null;
  client: { id: string; name: string | null };
  service: {
    id: string;
    title: string;
    serviceGroupName: string;
    serviceCategoryName: string;
    thumbnailUrl: string | null;
  };
}

export type ServiceOrderTab =
  | 'all'
  | 'working'
  | 'workCompleted'
  | 'purchaseConfirmed'
  | 'settlement'
  | 'expired'
  | 'cancelRefund';

export type ServiceOrderSort = 'latest' | 'endDate';

export type ServiceOrderCounts = Record<ServiceOrderTab, number>;

export interface ServiceOrdersResult {
  items: ServiceOrderItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
}

// 신고 내역 테이블 · 신고 상세 모달 (ReportDetailModal)
export interface UserReportDetail {
  id: string;
  reason: ReportReason;
  detail: string;
  images: string[];
}

export interface UserReportReceivedItem {
  id: string;
  reporter: { id: string; name: string | null };
  detail: string;
  reason: ReportReason;
  createdAt: string;
}

export interface UserReportSentItem {
  id: string;
  reported: { id: string; name: string | null };
  detail: string;
  reason: ReportReason;
  createdAt: string;
}

// 커뮤니티 테이블 · 삭제 모달 (UserSectionTable · CommunityDeletionModal)
export interface CommunityDeletionInfo {
  deletedAt: string;
  deletedByAdminName: string;
  deleteReason: string;
}

export type CommunityStatus = 'VISIBLE' | 'USER_DELETED' | 'ADMIN_DELETED';

export type CommunityContentType = 'post' | 'comment';

export interface UserPostItem {
  id: string;
  title: string;
  status: CommunityStatus;
  deletedAt: string | null;
  deletedByAdminName: string | null;
  createdAt: string;
}

export interface UserCommentItem {
  id: string;
  content: string;
  status: CommunityStatus;
  deletedAt: string | null;
  deletedByAdminName: string | null;
  createdAt: string;
}

// 거래/정산/환불 모달 (OrderActionModal)
export interface OrderTransaction {
  paidAt: string;
  method: string;
  installmentMonths: number;
  servicePrice: number;
  platformFee: number;
  totalAmount: number;
}

export interface OrderRefundDetail {
  paidAt: string;
  method: string;
  installmentMonths: number;
  servicePrice: number;
  refundAmount: number;
  type: 'REFUND' | 'CANCEL';
  approvedAt: string;
  approvedBy: {
    type: 'ADMIN' | 'EXPERT';
    name: string | null;
    reason: string | null;
  };
}

export interface OrderSettlement {
  paidAt: string;
  method: string;
  installmentMonths: number;
  servicePrice: number;
  platformFee: number;
  settlementAmount: number;
  settledAt: string;
  settledByAdminName: string | null;
}

export interface OrderSettlementPreview {
  businessName: string | null;
  bankName: string | null;
  bankAccount: string | null;
  settlementAmount: number;
}

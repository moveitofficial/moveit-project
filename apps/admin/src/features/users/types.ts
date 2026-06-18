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

// 신고 내역 테이블 (UserSectionTable)
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

// 커뮤니티 테이블 (UserSectionTable)
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

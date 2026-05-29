export type UserRole = 'CLIENT' | 'EXPERT' | 'ADMIN' | 'SUPER_ADMIN';
export type Provider = 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER';
export type ServiceType = 'IT_COACHING' | 'PROJECT_REQUEST';
export type ServiceStatus = 'ON_SALE' | 'STOPPED' | 'DELETED' | 'HIDDEN';
export type ExpertApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type OrderStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'WORK_COMPLETED'
  | 'PURCHASE_CONFIRMED'
  | 'SETTLEMENT_REQUESTED'
  | 'SETTLEMENT_COMPLETED'
  | 'CANCELED'
  | 'REFUNDED'
  | 'EXPIRED';
export type PaymentStatus = 'PENDING' | 'DONE' | 'FAILED' | 'CANCELED';
export type RefundStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELED';
export type ReportStatus = 'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED';
export type SettlementStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'COMPLETED'
  | 'REJECTED';
export type CSChatStatus = 'OPEN' | 'CLOSED';

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  provider: Provider;
  region: string;
  phoneNumber: string;
  profileImageUrl: string | null;
  isBlocked: boolean;
  blockReason: string | null;
  isDeleted: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  orderCount: number;
  reportCount: number;
}

export interface AdminExpert {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  companyName: string;
  companyNumber: string;
  bossName: string;
  region: string;
  phoneNumber: string;
  provider: Provider;
  serviceType: ServiceType;
  approvalStatus: ExpertApprovalStatus;
  rejectReason: string | null;
  techStacks: string[];
  totalRevenue: number;
  totalOrders: number;
  rating: number;
  reportCount: number;
  createdAt: string;
}

export interface AdminService {
  id: string;
  title: string;
  expertName: string;
  expertId: string;
  serviceType: ServiceType;
  categoryName: string;
  price: number;
  status: ServiceStatus;
  reviewCount: number;
  rating: number;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  serviceTitle: string;
  expertName: string;
  clientName: string;
  status: OrderStatus;
  totalAmount: number;
  platformFee: number;
  paymentStatus: PaymentStatus | null;
  createdAt: string;
  startDate: string;
  endDate: string;
}

export interface AdminRefund {
  id: string;
  orderId: string;
  serviceTitle: string;
  clientName: string;
  expertName: string;
  type: 'REFUND' | 'CANCEL';
  reason: string;
  refundAmount: number;
  status: RefundStatus;
  adminMemo: string | null;
  createdAt: string;
  processedAt: string | null;
}

export interface AdminSettlement {
  id: string;
  expertId: string;
  expertName: string;
  companyName: string;
  amount: number;
  status: SettlementStatus;
  bankName: string;
  bankAccount: string;
  adminMemo: string | null;
  requestedAt: string;
  processedAt: string | null;
}

export interface AdminReport {
  id: string;
  reporterName: string;
  reporterId: string;
  targetUserName: string;
  targetUserId: string;
  reason: string;
  detail: string;
  imageUrls: string[];
  status: ReportStatus;
  adminMemo: string | null;
  createdAt: string;
  processedAt: string | null;
}

export interface AdminMainSetting {
  id: string;
  sectionType: string;
  targetType: 'SERVICE' | 'EXPERT';
  targetId: string;
  targetTitle: string;
  thumbnailUrl: string;
  order: number;
}

export interface AdminBanner {
  id: string;
  imageUrl: string;
  actionUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminFaq {
  id: string;
  title: string;
  content: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
}

export interface AdminCSChatRoom {
  id: string;
  user: { id: string; name: string; email: string };
  status: CSChatStatus;
  lastMessage: { content: string; createdAt: string };
  unreadCount: number;
  createdAt: string;
}

export interface AdminManager {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AdminBlacklistUser {
  id: string;
  name: string;
  email: string;
  provider: Provider;
  region: string;
  orderCount: number;
  reportCount: number;
  createdAt: string;
}

export interface AdminBlacklistExpert {
  id: string;
  name: string;
  email: string;
  companyName: string;
  serviceType: ServiceType;
  provider: Provider;
  region: string;
  totalOrders: number;
  reportCount: number;
  createdAt: string;
}

export type PendingTaskType =
  | 'EXPERT_APPROVAL'
  | 'REPORT'
  | 'CS'
  | 'SETTLEMENT';
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
  | 'CS_CLOSED';

export interface AdminDashboard {
  summary: {
    pendingExpertCount: number;
    pendingReportCount: number;
    pendingSettlementCount: number;
    activeOrderCount: number;
  };
  pendingTasks: {
    type: PendingTaskType;
    title: string;
    requester: string;
    createdAt: string;
  }[];
  recentActivities: {
    type: ActivityType;
    message: string;
    adminName: string;
    createdAt: string;
  }[];
}

export interface SalesStatistics {
  summary: {
    totalTransactionAmount: number;
    totalTransactionCount: number;
    averageTransactionAmount: number;
    maxTransactionAmount: number;
  };
  dailySales: { date: string; amount: number; count: number }[];
  categorySales: { category: string; amount: number; ratio: number }[];
  topSellers: { expertId: string; expertName: string; amount: number }[];
}

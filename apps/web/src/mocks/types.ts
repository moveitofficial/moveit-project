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
export type RefundStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELED';
export type NotificationType =
  | 'MESSAGE'
  | 'COMMENT'
  | 'LIKE'
  | 'ORDER'
  | 'PAYMENT'
  | 'REFUND'
  | 'SERVICE'
  | 'SETTLEMENT'
  | 'REPORT';

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  error: {
    code: string;
    details?: Record<string, unknown>;
  };
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

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImageUrl: string | null;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface ExpertSummary {
  id: string;
  name: string;
  companyName: string;
  profileImageUrl?: string;
}

export interface ServiceCategory {
  type: ServiceType;
  detail: string;
}

export interface ServiceListItem {
  id: string;
  title: string;
  price: number;
  duration: number;
  revisionCount: number;
  thumbnailUrl: string;
  expert: ExpertSummary;
  category: ServiceCategory;
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
}

export interface ServiceImage {
  id: string;
  url: string;
  isMain: boolean;
}

export interface ServiceStep {
  order: number;
  title: string;
  description: string;
}

export interface ServiceFaq {
  id: string;
  question: string;
  answer: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  duration: number;
  revisionCount: number;
  scope: string;
  servicePrice: number;
  description: string;
  refundPolicy: string;
  status: ServiceStatus;
  isFavorite: boolean;
  expert: ExpertSummary;
  images: ServiceImage[];
  techStacks: string[];
  steps: ServiceStep[];
  faqs: ServiceFaq[];
  reviews: {
    items: Review[];
    totalCount: number;
    averageRating: number;
  };
  recommendedServices: ServiceListItem[];
}

export interface ExpertStats {
  totalReviews: number;
  averageRating: number;
  purchaseRate: number;
  completionRate: number;
}

export interface ExpertDetail {
  id: string;
  name: string;
  companyName: string;
  description: string;
  profileImageUrl: string;
  isFavorite: boolean;
  stats: ExpertStats;
  specialtyCategories: { serviceTypeId: string; serviceCategoryId: string }[];
  techStacks: string[];
  portfolios: PortfolioListItem[];
  services: ServiceListItem[];
}

export interface PortfolioListItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  clientName: string;
  industry: string;
}

export interface PortfolioDetail extends PortfolioListItem {
  description: string;
  skills: { stackName: string; stackType: string }[];
  images: ServiceImage[];
}

export interface Review {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    profileImageUrl: string | null;
  };
}

export interface OrderListItem {
  id: string;
  serviceTitle: string;
  thumbnailUrl: string;
  expertName: string;
  status: OrderStatus;
  totalAmount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface OrderDetail extends OrderListItem {
  service: ServiceListItem;
  agreedServicePrice: number;
  platformFee: number;
  payment?: {
    id: string;
    method: string;
    status: PaymentStatus;
    paidAt: string;
  };
  refund?: {
    id: string;
    status: RefundStatus;
    reason: string;
    refundAmount: number;
  };
}

export interface CommunityPost {
  id: string;
  category: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    profileImageUrl: string | null;
  };
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  parentCommentId: string | null;
  content: string;
  author: {
    id: string;
    name: string;
    profileImageUrl: string | null;
  };
  likeCount: number;
  createdAt: string;
  replies?: CommunityComment[];
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface ChatRoomListItem {
  id: string;
  currentService: { id: string; title: string };
  opponent: { id: string; name: string; profileImageUrl: string };
  lastMessage: { id: string; type: string; content: string; createdAt: string };
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  content: string;
  attachments: { url: string; fileName: string }[];
  isRead: boolean;
  createdAt: string;
}

export interface MainSection {
  sectionType: string;
  title: string;
  targetType: 'SERVICE' | 'EXPERT';
  items: ServiceListItem[] | ExpertDetail[];
}

export interface MainData {
  banners: { id: string; imageUrl: string; actionUrl: string }[];
  sections: MainSection[];
}

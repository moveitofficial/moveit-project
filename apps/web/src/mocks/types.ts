// =========================
// Prisma 스키마와 1:1 정렬한 enum 타입들
// 변경 시 apps/api/prisma/schema.prisma 와 동기화
// =========================

export type AuthProvider = 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER';

export type Role = 'CLIENT' | 'EXPERT';

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

export type ServiceGroupName = 'IT_COACHING' | 'PROJECT_REQUEST';

export type ServiceCategoryName = 'WEB' | 'APP' | 'AI' | 'GAME' | 'DATA_ANALYTICS';

export type TechStackName =
  | 'JAVASCRIPT'
  | 'TYPESCRIPT'
  | 'PYTHON'
  | 'JAVA'
  | 'KOTLIN'
  | 'SWIFT'
  | 'REACT'
  | 'NEXTJS'
  | 'VUE'
  | 'REACT_NATIVE'
  | 'NODEJS'
  | 'NESTJS'
  | 'SPRING'
  | 'DJANGO'
  | 'FASTAPI'
  | 'POSTGRESQL'
  | 'MYSQL'
  | 'MONGODB'
  | 'AWS'
  | 'DOCKER';

export type StackType = 'DESIGN' | 'FRONTEND' | 'BACKEND';

export type BusinessSector =
  | 'PUBLIC_INSTITUTION'
  | 'ECOMMERCE'
  | 'LEGAL_TAX'
  | 'REAL_ESTATE'
  | 'MEDICAL_PHARMA';

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

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export type RefundType = 'CANCEL' | 'REFUND';

export type RefundStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export type CommunityCategory = 'QUESTION' | 'TIP' | 'REVIEW' | 'STUDY_GROUP' | 'FREE';

export type NotificationType = 'COMMUNITY' | 'TRANSACTION' | 'REMINDER';

export type NotificationCategory =
  // 커뮤니티
  | 'POST_COMMENT'
  | 'POST_REPLY'
  | 'POST_LIKE'
  // 거래
  | 'ORDER_CREATED'
  | 'ORDER_CANCELLED'
  | 'PAYMENT_SUCCESS'
  | 'REFUND_REQUESTED'
  | 'PURCHASE_CONFIRM_REQUEST'
  | 'PURCHASE_CONFIRMED'
  | 'SETTLEMENT_REQUESTED'
  | 'SETTLEMENT_DONE'
  // 일정
  | 'SCHEDULE_REGISTERED'
  | 'SCHEDULE_CHANGE_REQUEST'
  | 'SCHEDULE_REMINDER'
  // 리마인더
  | 'DEADLINE_REMINDER';

export type ReferenceType = 'SERVICE' | 'ORDER' | 'POST' | 'COMMENT' | 'PAYMENT' | 'REFUND';

export type MainSectionType =
  | 'POPULAR_IT_COACHING'
  | 'POPULAR_PROJECT_REQUEST'
  | 'MOVEIT_POPULAR_PROJECT_EXPERT'
  | 'MOVEIT_POPULAR_COACHING'
  | 'RECOMMENDED_IT_COACHING'
  | 'RECOMMENDED_PROJECT_REQUEST';

export type MainTargetType = 'USER' | 'SERVICE';

export type MessageType = 'TEXT' | 'FILE' | 'SYSTEM';

export type SystemMessageType =
  | 'TRADE_REQUEST_SENT'
  | 'TRADE_REQUEST_RECEIVED'
  | 'TRADE_CANCELED'
  | 'PAYMENT_REQUEST'
  | 'PAYMENT_HELD'
  | 'PAYMENT_COMPLETED'
  | 'SCHEDULE_REQUEST'
  | 'SCHEDULE_REGISTERED'
  | 'SCHEDULE_CHANGE_REQUEST'
  | 'ORDER_COMPLETION_PENDING';

// =========================
// 공통 응답 래퍼
// =========================

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  error: {
    code: number;
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

// =========================
// User / Profile
// =========================

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  provider: AuthProvider;
  profileImageUrl: string | null;
  region: Region | null;
  phoneNumber: string | null;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export interface InterestCategory {
  group: ServiceGroupName;
  category: ServiceCategoryName;
}

export interface ClientProfile {
  nickname: string | null;
  interestCategories: InterestCategory[];
}

export interface ClientMeUser extends User {
  bankName: string | null;
  bankAccount: string | null;
  clientProfile: ClientProfile | null;
}

export interface ExpertSummary {
  id: string;
  name: string;
  companyName: string;
  profileImageUrl: string | null;
}

// =========================
// 카테고리 / 기술스택 메타
// =========================

export interface ServiceGroupMeta {
  id: string;
  name: ServiceGroupName;
  label: string;
}

export interface ServiceCategoryMeta {
  id: string;
  name: ServiceCategoryName;
  label: string;
}

export interface TechStackMeta {
  id: string;
  name: TechStackName;
  label: string;
}

// =========================
// 서비스
// =========================

export interface ServiceCategoryRef {
  group: ServiceGroupName;
  category: ServiceCategoryName;
}

export interface ServiceListItem {
  id: string;
  title: string;
  servicePrice: number;
  workDuration: number;
  revisionCount: number;
  thumbnailUrl: string;
  status: ServiceStatus;
  expert: ExpertSummary;
  categoryRef: ServiceCategoryRef;
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
  workDuration: number;
  revisionCount: number;
  serviceScope: string;
  servicePrice: number;
  description: string;
  preparationNotes: string | null;
  refundPolicy: string;
  status: ServiceStatus;
  categoryRef: ServiceCategoryRef;
  isFavorite: boolean;
  expert: ExpertSummary;
  images: ServiceImage[];
  techStacks: TechStackName[];
  steps: ServiceStep[];
  faqs: ServiceFaq[];
  reviews: {
    items: Review[];
    totalCount: number;
    averageRating: number;
  };
  recommendedServices: ServiceListItem[];
}

// =========================
// 전문가
// =========================

export interface ExpertStats {
  totalReviews: number;
  averageRating: number | null;
  purchaseRate: number | null;
  completionRate: number | null;
}

export interface ExpertDetail {
  id: string;
  name: string;
  companyName: string;
  ceoName?: string;
  description: string;
  profileImageUrl: string | null;
  isFavorite: boolean;
  favoriteCount?: number;
  stats: ExpertStats;
  specialtyCategories: ServiceCategoryRef[];
  techStacks: TechStackName[];
  portfolios: PortfolioListItem[];
  services: ServiceListItem[];
  clientNames?: string[];
  foundedYear?: number;
  region?: Region | null;
  employeeMin?: number | null;
  employeeMax?: number | null;
  contactTimeStart?: string;
  contactTimeEnd?: string;
  totalOrderCount?: number;
  serviceCount?: number;
}

// =========================
// 포트폴리오
// =========================

export interface PortfolioListItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  clientName: string;
  businessSector: BusinessSector;
}

export interface PortfolioSkill {
  stackName: TechStackName;
  stackType: StackType;
}

export interface PortfolioDetail extends PortfolioListItem {
  description: string;
  skills: PortfolioSkill[];
  images: ServiceImage[];
}

// =========================
// 리뷰
// =========================

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

// =========================
// 주문 / 결제 / 환불
// =========================

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
    installmentMonths: number;
    paidAt: string;
  };
  refund?: {
    id: string;
    type: RefundType;
    status: RefundStatus;
    refundAmount: number;
    requestedAt: string;
  };
}

// =========================
// 커뮤니티
// =========================

export interface CommunityPost {
  id: string;
  category: CommunityCategory;
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

// =========================
// 알림
// =========================

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  content: string;
  referenceType: ReferenceType;
  referenceId: string;
  isRead: boolean;
  createdAt: string;
}

// =========================
// 채팅
// =========================

export interface ChatRoomListItem {
  id: string;
  currentService: { id: string; title: string };
  opponent: { id: string; name: string; profileImageUrl: string | null };
  lastMessage: {
    id: string;
    type: MessageType;
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  type: MessageType;
  systemType: SystemMessageType | null;
  content: string;
  attachments: { url: string; fileName: string; fileSize: number; fileType: string }[];
  isRead: boolean;
  createdAt: string;
}

// =========================
// 메인 / 배너 / FAQ
// =========================

export interface Banner {
  id: string;
  imageUrl: string;
  actionUrl: string;
}

export type MainSection =
  | {
      sectionType: MainSectionType;
      title: string;
      targetType: 'SERVICE';
      items: ServiceListItem[];
    }
  | {
      sectionType: MainSectionType;
      title: string;
      targetType: 'USER';
      items: ExpertDetail[];
    };

export interface MainData {
  banners: Banner[];
  sections: MainSection[];
  newServices: ServiceListItem[];
}

export interface Faq {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

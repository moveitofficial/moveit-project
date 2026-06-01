export type Provider = 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER';
export type ServiceType = 'IT_COACHING' | 'PROJECT_REQUEST';
export type ServiceStatus = 'ON_SALE' | 'STOPPED' | 'DELETED' | 'HIDDEN';
export type ExpertApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ReportReason =
  | 'FALSE_INFORMATION'
  | 'ABUSE'
  | 'ILLEGAL_ACTIVITY'
  | 'EXTERNAL_CONTACT'
  | 'SPAM'
  | 'OTHER';

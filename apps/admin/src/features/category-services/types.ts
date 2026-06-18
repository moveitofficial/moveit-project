import type { Pagination } from '@/types/api';
import type { ServiceStatus, ServiceType } from '@/types/enums';

export interface CategoryFeaturedItem {
  categoryFeaturedId: string;
  serviceId: string;
  title: string;
  category: ServiceType;
  businessName: string | null;
  status: ServiceStatus;
  servicePrice: number;
  createdAt: string;
  orderCount: number;
}

export interface CategoryFeaturedPageResponse {
  itCoaching: CategoryFeaturedItem[];
  projectRequest: CategoryFeaturedItem[];
}

export interface ServiceCandidateItem {
  serviceId: string;
  title: string;
  category: ServiceType;
  businessName: string | null;
  status: ServiceStatus;
  servicePrice: number;
  createdAt: string;
  orderCount: number;
  isAlreadyRegistered: boolean;
}

export interface RegisteredServiceItem {
  serviceId: string;
  title: string;
}

export interface ServiceCandidatesResponse {
  items: ServiceCandidateItem[];
  pagination: Pagination;
  registered: RegisteredServiceItem[];
}

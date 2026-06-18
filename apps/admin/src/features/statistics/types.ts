import type { Provider, Region, ServiceCategory, ServiceType } from '@/types/enums';

export interface SalesSummary {
  totalTransactionAmount: number;
  totalTransactionCount: number;
  averageTransactionAmount: number;
  maxTransactionAmount: number;
}

export interface DailySalesItem {
  date: string;
  totalTransactionAmount: number;
  totalTransactionCount: number;
}

export interface CategorySalesItem {
  serviceGroupName: ServiceType;
  serviceCategoryName: ServiceCategory;
  totalTransactionAmount: number;
  totalTransactionCount: number;
}

export interface TopSellerItem {
  sellerUserId: string;
  businessName: string | null;
  email: string;
  provider: Provider;
  totalTransactionAmount: number;
  totalTransactionCount: number;
  region: Region | null;
  avgRating: number | null;
  createdAt: string;
}

export interface SalesStatistics {
  summary: SalesSummary;
  dailySales: DailySalesItem[];
  categorySales: CategorySalesItem[];
  topSellers: TopSellerItem[];
}

import { ApiProperty } from '@nestjs/swagger';

import type {
  AuthProvider,
  Region,
  ServiceCategoryName,
  ServiceGroupName,
} from '@prisma/client';

export class SalesSummaryDto {
  @ApiProperty({ example: 1_500_000, description: '총 거래액' })
  declare totalTransactionAmount: number;

  @ApiProperty({ example: 10, description: '총 거래 건수' })
  declare totalTransactionCount: number;

  @ApiProperty({ example: 150_000, description: '평균 거래액' })
  declare averageTransactionAmount: number;

  @ApiProperty({ example: 300_000, description: '최고 거래액' })
  declare maxTransactionAmount: number;
}

export class DailySalesItemDto {
  @ApiProperty({ example: '2024-01-01', description: '날짜 (YYYY-MM-DD)' })
  declare date: string;

  @ApiProperty({ example: 500_000, description: '일별 총 거래액' })
  declare totalTransactionAmount: number;

  @ApiProperty({ example: 3, description: '일별 거래 건수' })
  declare totalTransactionCount: number;
}

export class CategorySalesItemDto {
  @ApiProperty({ example: 'IT_COACHING', description: '서비스 그룹' })
  declare serviceGroupName: ServiceGroupName;

  @ApiProperty({ example: 'WEB', description: '서비스 카테고리' })
  declare serviceCategoryName: ServiceCategoryName;

  @ApiProperty({ example: 500_000, description: '총 거래액' })
  declare totalTransactionAmount: number;

  @ApiProperty({ example: 3, description: '총 거래 건수' })
  declare totalTransactionCount: number;
}

export class TopSellerItemDto {
  @ApiProperty({ example: 'uuid', description: '판매자 유저 ID' })
  declare sellerUserId: string;

  @ApiProperty({
    example: '(주)무브잇',
    description: '사업자명',
    nullable: true,
  })
  declare businessName: string | null;

  @ApiProperty({ example: 'seller@example.com', description: '이메일' })
  declare email: string;

  @ApiProperty({ example: 'LOCAL', description: '가입 경로' })
  declare provider: AuthProvider;

  @ApiProperty({ example: 1_000_000, description: '총 거래액' })
  declare totalTransactionAmount: number;

  @ApiProperty({ example: 5, description: '총 거래 건수' })
  declare totalTransactionCount: number;

  @ApiProperty({ example: 'SEOUL', description: '지역', nullable: true })
  declare region: Region | null;

  @ApiProperty({ example: 4.5, description: '평균 평점', nullable: true })
  declare avgRating: number | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '가입일' })
  declare createdAt: string;
}

export class StatisticsResponseDto {
  @ApiProperty({ type: SalesSummaryDto, description: '요약 통계' })
  declare summary: SalesSummaryDto;

  @ApiProperty({ type: [DailySalesItemDto], description: '일별 매출' })
  declare dailySales: DailySalesItemDto[];

  @ApiProperty({ type: [CategorySalesItemDto], description: '카테고리별 매출' })
  declare categorySales: CategorySalesItemDto[];

  @ApiProperty({ type: [TopSellerItemDto], description: '판매자 TOP 10' })
  declare topSellers: TopSellerItemDto[];
}

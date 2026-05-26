import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Region,
  ServiceCategoryName,
  ServiceGroupName,
  ServiceStatus,
  TechStackName,
} from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { SERVICE_REVIEW_SORT } from '../services.types';

import type { ServiceReviewSort } from '../services.types';

class ServiceImageResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: 'https://cdn.example.com/img.jpg' })
  declare imgUrl: string;

  @ApiProperty({ example: true })
  declare isMain: boolean;
}

class ServiceStepResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: 1 })
  declare order: number;

  @ApiProperty({ example: '환경 설정' })
  declare title: string;

  @ApiProperty({ example: 'Node.js 설치 후 실행' })
  declare description: string;
}

class ServiceFaqResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '환불은 어떻게 하나요?' })
  declare question: string;

  @ApiProperty({ example: '착수 전 전액 환불 가능합니다.' })
  declare answer: string;
}

class ServiceTechStackResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare techStackId: string;
}

class ServiceCategoryRefResponseDto {
  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
  })
  declare group: ServiceGroupName;

  @ApiProperty({ enum: ServiceCategoryName, example: ServiceCategoryName.WEB })
  declare category: ServiceCategoryName;
}

export class ServiceResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ format: 'uuid' })
  declare expertUserId: string;

  @ApiProperty({ example: 'React 초급 코칭 패키지' })
  declare title: string;

  @ApiProperty({ example: 14 })
  declare workDuration: number;

  @ApiProperty({ example: 2 })
  declare revisionCount: number;

  @ApiProperty({ example: '코드 리뷰 및 실습 과제 피드백 포함' })
  declare serviceScope: string;

  @ApiProperty({ example: 120_000 })
  declare servicePrice: number;

  @ApiProperty({ example: 'React 기초부터 프로젝트 배포까지…' })
  declare description: string;

  @ApiProperty({ example: '노트북이 필요합니다.' })
  declare preparationNotes: string;

  @ApiProperty({ example: '작업 착수 전 전액 환불…' })
  declare refundPolicy: string;

  @ApiProperty({ enum: ServiceStatus, example: ServiceStatus.ACTIVE })
  declare status: ServiceStatus;

  @ApiProperty({ type: ServiceCategoryRefResponseDto })
  declare categoryRef: ServiceCategoryRefResponseDto;

  @ApiProperty({ type: [ServiceImageResponseDto] })
  declare images: ServiceImageResponseDto[];

  @ApiProperty({ type: [ServiceStepResponseDto] })
  declare steps: ServiceStepResponseDto[];

  @ApiProperty({ type: [ServiceFaqResponseDto] })
  declare faqs: ServiceFaqResponseDto[];

  @ApiProperty({ type: [ServiceTechStackResponseDto] })
  declare techStacks: ServiceTechStackResponseDto[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  declare createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  declare updatedAt: Date;
}

/** GET /services — api-spec-web.md §5 sort */
export const SERVICE_LIST_SORT = [
  'latest',
  'popular',
  'price_asc',
  'price_desc',
  'rating',
] as const;

export type ServiceListSort = (typeof SERVICE_LIST_SORT)[number];

export class ServiceListQueryDto extends PaginationQueryDto {
  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
  })
  @IsEnum(ServiceGroupName)
  declare group: ServiceGroupName | undefined;

  @ApiPropertyOptional({
    enum: ServiceCategoryName,
    example: ServiceCategoryName.WEB,
  })
  @IsOptional()
  @IsEnum(ServiceCategoryName)
  declare category: ServiceCategoryName | undefined;

  @ApiPropertyOptional({ enum: Region, example: Region.SEOUL })
  @IsOptional()
  @IsEnum(Region)
  declare region: Region | undefined;

  @ApiPropertyOptional({ example: 100_000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  declare priceMin: number | undefined;

  @ApiPropertyOptional({ example: 500_000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  declare priceMax: number | undefined;

  @ApiPropertyOptional({
    description: 'TechStackName CSV',
    example: 'REACT,TYPESCRIPT',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && value.length > 0
      ? value.split(',').map((s) => s.trim())
      : undefined,
  )
  @ArrayMaxSize(3)
  @IsEnum(TechStackName, { each: true })
  declare techStacks: TechStackName[] | undefined;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  declare expertUserId: string | undefined;

  @ApiPropertyOptional({ example: 'React 코칭' })
  @IsOptional()
  @IsString()
  declare search: string | undefined;

  @ApiPropertyOptional({
    enum: SERVICE_LIST_SORT,
    example: 'popular',
  })
  @IsOptional()
  @IsEnum(SERVICE_LIST_SORT)
  declare sort: ServiceListSort | undefined;

  @ApiPropertyOptional({ maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  declare pageSize: number | undefined;
}

class ServiceExpertSummaryResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '코드잇 에이전시' })
  declare name: string;

  @ApiProperty({ example: '코드잇 에이전시' })
  declare companyName: string;

  @ApiProperty({ nullable: true })
  declare profileImageUrl: string | null;

  @ApiProperty({ enum: Region, nullable: true, example: Region.SEOUL })
  declare region: Region | null;
}

export class ServiceListItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '안드로이드 / iOS 앱 개발' })
  declare title: string;

  @ApiProperty({ example: 380_000 })
  declare servicePrice: number;

  @ApiProperty({ example: 30 })
  declare workDuration: number;

  @ApiProperty({ example: 3 })
  declare revisionCount: number;

  @ApiProperty({ example: 'https://...' })
  declare thumbnailUrl: string;

  @ApiProperty({ enum: ServiceStatus })
  declare status: ServiceStatus;

  @ApiProperty({ type: ServiceExpertSummaryResponseDto })
  declare expert: ServiceExpertSummaryResponseDto;

  @ApiProperty({ type: ServiceCategoryRefResponseDto })
  declare categoryRef: ServiceCategoryRefResponseDto;

  @ApiProperty({
    enum: TechStackName,
    isArray: true,
    example: [TechStackName.REACT],
  })
  declare techStacks: TechStackName[];

  @ApiProperty({ example: 4.9 })
  declare rating: number;

  @ApiProperty({ example: 328 })
  declare reviewCount: number;

  @ApiProperty({ example: 120 })
  declare orderCount: number;

  @ApiProperty({ example: 45 })
  declare favoriteCount: number;
}

class PaginationResponseDto {
  @ApiProperty({ example: 1 })
  declare page: number;

  @ApiProperty({ example: 20 })
  declare pageSize: number;

  @ApiProperty({ example: 125 })
  declare totalCount: number;

  @ApiProperty({ example: true })
  declare hasNext: boolean;
}

export class ServiceListPaginatedResponseDto {
  @ApiProperty({ type: [ServiceListItemResponseDto] })
  declare items: ServiceListItemResponseDto[];

  @ApiProperty({ type: PaginationResponseDto })
  declare pagination: PaginationResponseDto;
}

export class ServiceReviewsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: SERVICE_REVIEW_SORT, example: 'latest' })
  @IsOptional()
  @IsEnum(SERVICE_REVIEW_SORT)
  declare sort: ServiceReviewSort | undefined;

  @ApiPropertyOptional({ maximum: 50, default: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  declare pageSize: number | undefined;
}

class ReviewerResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty()
  declare name: string;

  @ApiProperty({ nullable: true })
  declare profileImageUrl: string | null;
}

export class ReviewResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty()
  declare rating: number;

  @ApiProperty()
  declare content: string;

  @ApiProperty()
  declare createdAt: string;

  @ApiProperty({ type: ReviewerResponseDto })
  declare reviewer: ReviewerResponseDto;
}

export class ServiceReviewsPaginatedResponseDto {
  @ApiProperty({ type: [ReviewResponseDto] })
  declare items: ReviewResponseDto[];

  @ApiProperty({ type: PaginationResponseDto })
  declare pagination: PaginationResponseDto;

  @ApiProperty({ example: 4.9 })
  declare averageRating: number;
}

class ServiceDetailStepResponseDto {
  @ApiProperty({ example: 1 })
  declare order: number;

  @ApiProperty({ example: '요구사항 분석' })
  declare title: string;

  @ApiProperty({ example: '클라이언트의 요구사항을 명확히 정리합니다.' })
  declare description: string;
}

class ServiceDetailFaqResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty()
  declare question: string;

  @ApiProperty()
  declare answer: string;
}

export class ServiceDetailResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty()
  declare title: string;

  @ApiProperty()
  declare workDuration: number;

  @ApiProperty()
  declare revisionCount: number;

  @ApiProperty()
  declare serviceScope: string;

  @ApiProperty()
  declare servicePrice: number;

  @ApiProperty()
  declare description: string;

  @ApiProperty({ example: '노트북이 필요합니다.' })
  declare preparationNotes: string;

  @ApiProperty()
  declare refundPolicy: string;

  @ApiProperty({ enum: ServiceStatus })
  declare status: ServiceStatus;

  @ApiProperty({ type: ServiceCategoryRefResponseDto })
  declare categoryRef: ServiceCategoryRefResponseDto;

  @ApiProperty({ example: false })
  declare isFavorite: boolean;

  @ApiProperty({ type: ServiceExpertSummaryResponseDto })
  declare expert: ServiceExpertSummaryResponseDto;

  @ApiProperty({ type: [ServiceImageResponseDto] })
  declare images: ServiceImageResponseDto[];

  @ApiProperty({ enum: TechStackName, isArray: true })
  declare techStacks: TechStackName[];

  @ApiProperty({ type: [ServiceDetailStepResponseDto] })
  declare steps: ServiceDetailStepResponseDto[];

  @ApiProperty({ type: [ServiceDetailFaqResponseDto] })
  declare faqs: ServiceDetailFaqResponseDto[];

  @ApiProperty({ example: 120 })
  declare orderCount: number;

  @ApiProperty({ example: 45 })
  declare favoriteCount: number;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BusinessSector,
  Region,
  ServiceCategoryName,
  ServiceGroupName,
  TechStackName,
} from '@prisma/client';

class SpecialtyCategoryResponseDto {
  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
  })
  declare group: ServiceGroupName;

  @ApiProperty({ enum: ServiceCategoryName, example: ServiceCategoryName.WEB })
  declare category: ServiceCategoryName;
}

class TechStackResponseDto {
  @ApiProperty({ enum: TechStackName, example: TechStackName.TYPESCRIPT })
  declare name: TechStackName;
}

class PortfolioResponseDto {
  @ApiProperty({ example: 'b3e57c2a-e64b-47c7-99dd-a174ca2d4dac' })
  declare id: string;

  @ApiProperty({ example: '우리 동네 제휴멤버십 서비스' })
  declare title: string;

  @ApiProperty({ example: '서비스 설명입니다.' })
  declare description: string;

  @ApiProperty({ example: '코드잇' })
  declare clientName: string;

  @ApiProperty({
    enum: BusinessSector,
    example: BusinessSector.PUBLIC_INSTITUTION,
  })
  declare businessSector: BusinessSector;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  declare createdAt: Date;
}

export class ExpertProfileResponseDto {
  @ApiProperty({ example: 'c4685ba9-fa20-4922-aa17-265b354ae844' })
  declare id: string;

  @ApiProperty({ example: '7656a3d3-c608-413a-936a-73362085bd1f' })
  declare userId: string;

  @ApiProperty({ example: false })
  declare isApplied: boolean;

  @ApiProperty({ example: false })
  declare isApproved: boolean;

  @ApiPropertyOptional({ example: null })
  declare approvedAt: Date | null;

  @ApiPropertyOptional({ example: null })
  declare rejectedAt: Date | null;

  @ApiPropertyOptional({ example: null })
  declare rejectReason: string | null;

  @ApiPropertyOptional({ example: '코드잇 에이전시' })
  declare businessName: string | null;

  @ApiPropertyOptional({ example: '1234567890' })
  declare businessNumber: string | null;

  @ApiPropertyOptional({ example: '김코드' })
  declare ceoName: string | null;

  @ApiPropertyOptional({ example: '09:00' })
  declare contactTimeStart: string | null;

  @ApiPropertyOptional({ example: '18:00' })
  declare contactTimeEnd: string | null;

  @ApiPropertyOptional({ example: 2021 })
  declare foundedYear: number | null;

  @ApiPropertyOptional({ example: 5 })
  declare employeeMin: number | null;

  @ApiPropertyOptional({ example: 10 })
  declare employeeMax: number | null;

  @ApiPropertyOptional({ example: '안녕하세요 코드잇 에이전시입니다.' })
  declare description: string | null;

  @ApiPropertyOptional({ example: null })
  declare avgRating: number | null;

  @ApiProperty({ example: 0 })
  declare reviewCount: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  declare createdAt: Date;

  @ApiProperty({ type: [SpecialtyCategoryResponseDto] })
  declare specialtyCategories: SpecialtyCategoryResponseDto[];

  @ApiProperty({ type: [TechStackResponseDto] })
  declare techStacks: TechStackResponseDto[];

  @ApiProperty({ type: [PortfolioResponseDto] })
  declare portfolios: PortfolioResponseDto[];
}

export class CreateExpertProfileResponseDto {
  @ApiPropertyOptional({ enum: Region, example: Region.SEOUL })
  declare region: Region | null;

  @ApiPropertyOptional({ example: '01012345678' })
  declare phoneNumber: string | null;

  @ApiPropertyOptional({ example: '카카오뱅크' })
  declare bankName: string | null;

  @ApiPropertyOptional({ example: '3333123456789' })
  declare bankAccount: string | null;

  @ApiProperty({ type: ExpertProfileResponseDto })
  declare expertProfile: ExpertProfileResponseDto;
}

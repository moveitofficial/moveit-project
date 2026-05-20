import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';

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

  @ApiPropertyOptional({ example: '노트북이 필요합니다.' })
  declare preparationNotes: string | null;

  @ApiProperty({ example: '작업 착수 전 전액 환불…' })
  declare refundPolicy: string;

  @ApiProperty({ enum: ServiceStatus, example: ServiceStatus.ACTIVE })
  declare status: ServiceStatus;

  @ApiProperty({ format: 'uuid' })
  declare serviceGroupId: string;

  @ApiProperty({ format: 'uuid' })
  declare serviceCategoryId: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  declare createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  declare updatedAt: Date;
}

export class ServiceListDataDto {
  @ApiProperty()
  declare count: number;

  @ApiProperty({ type: [ServiceResponseDto] })
  declare items: ServiceResponseDto[];
}

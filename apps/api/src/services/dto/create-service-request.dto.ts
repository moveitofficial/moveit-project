import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateServiceRequestDto {
  @ApiProperty({ example: 'React 초급 코칭 패키지' })
  @IsString()
  @MaxLength(200)
  declare title: string;

  @ApiProperty({
    example: 14,
    description: '예상 작업 기간(일)',
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  declare workDuration: number;

  @ApiProperty({ example: 2, description: '무료 수정 횟수' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  declare revisionCount: number;

  @ApiProperty({
    example: '코드 리뷰 및 실습 과제 피드백 포함',
    description: '제공 범위',
  })
  @IsString()
  @MaxLength(2000)
  declare serviceScope: string;

  @ApiProperty({ example: 120_000, description: '서비스 가격(원)' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  declare servicePrice: number;

  @ApiProperty({
    example: 'React 기초부터 프로젝트 배포까지 단계별로 안내합니다.',
  })
  @IsString()
  @MaxLength(5000)
  declare description: string;

  @ApiPropertyOptional({
    example: '노트북 및 안정적인 인터넷 환경이 필요합니다.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  declare preparationNotes?: string;

  @ApiProperty({
    example: '작업 착수 전 전액 환불, 착수 후 일할 계산 환불',
  })
  @IsString()
  @MaxLength(2000)
  declare refundPolicy: string;

  @ApiPropertyOptional({
    enum: ServiceStatus,
    example: ServiceStatus.ACTIVE,
    description: '미입력 시 ACTIVE',
  })
  @IsOptional()
  @IsEnum(ServiceStatus)
  declare status?: ServiceStatus;

  @ApiProperty({
    format: 'uuid',
    example: '2b25c45a-5c87-4caa-8872-34b501452c23',
  })
  @IsUUID()
  declare serviceGroupId: string;

  @ApiProperty({
    format: 'uuid',
    example: 'b3e57c2a-e64b-47c7-99dd-a174ca2d4dac',
  })
  @IsUUID()
  declare serviceCategoryId: string;
}

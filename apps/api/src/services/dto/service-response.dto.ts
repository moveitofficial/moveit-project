import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ServiceCategoryName,
  ServiceGroupName,
  ServiceStatus,
} from '@prisma/client';

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

  @ApiPropertyOptional({ example: '노트북이 필요합니다.' })
  declare preparationNotes: string | null;

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

export class ServiceListDataDto {
  @ApiProperty()
  declare count: number;

  @ApiProperty({ type: [ServiceResponseDto] })
  declare items: ServiceResponseDto[];
}

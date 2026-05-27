import { ApiProperty } from '@nestjs/swagger';
import {
  ServiceCategoryName,
  ServiceGroupName,
  TechStackName,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class ServiceDetailImageDto {
  @ApiProperty({ example: 'https://cdn.example.com/detail.jpg' })
  @IsUrl()
  declare imgUrl: string;
}

export class ServiceStepDto {
  @ApiProperty({ example: '환경 설정', description: '최대 10자' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  declare title: string;

  @ApiProperty({ example: 'Node.js 설치 후 실행', description: '최대 16자' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  declare description: string;
}

export class ServiceFaqDto {
  @ApiProperty({ example: '환불은 어떻게 하나요?', description: '최대 50자' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  declare question: string;

  @ApiProperty({
    example: '착수 전 전액 환불 가능합니다.',
    description: '최대 500자',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  declare answer: string;
}

export class CreateServiceRequestDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  declare serviceId: string;

  @ApiProperty({ example: 'React 초급 코칭 패키지' })
  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  @MaxLength(30)
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
  @IsNotEmpty()
  @MaxLength(500)
  declare description: string;

  @ApiProperty({
    example: '노트북 및 안정적인 인터넷 환경이 필요합니다.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  declare preparationNotes: string;

  @ApiProperty({
    example: '작업 착수 전 전액 환불, 착수 후 일할 계산 환불',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  declare refundPolicy: string;

  @ApiProperty({
    example: 'https://cdn.example.com/main.jpg',
    description: '메인 이미지 URL',
  })
  @IsUrl()
  declare mainImageUrl: string;

  @ApiProperty({
    type: [ServiceDetailImageDto],
    description: '상세 이미지 1~10개',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => ServiceDetailImageDto)
  declare images: ServiceDetailImageDto[];

  @ApiProperty({
    type: [ServiceStepDto],
    description: '진행 단계 1~4개',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => ServiceStepDto)
  declare steps: ServiceStepDto[];

  @ApiProperty({
    type: [ServiceFaqDto],
    description: '자주 묻는 질문 최소 1개',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ServiceFaqDto)
  declare faqs: ServiceFaqDto[];

  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
  })
  @IsEnum(ServiceGroupName)
  declare serviceGroup: ServiceGroupName;

  @ApiProperty({ enum: ServiceCategoryName, example: ServiceCategoryName.WEB })
  @IsEnum(ServiceCategoryName)
  declare serviceCategory: ServiceCategoryName;

  @ApiProperty({
    enum: TechStackName,
    isArray: true,
    description: '기술 스택 이름 배열, 최소 1개 최대 3개',
    example: [TechStackName.TYPESCRIPT],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ArrayUnique()
  @IsEnum(TechStackName, { each: true })
  declare techStackNames: TechStackName[];
}

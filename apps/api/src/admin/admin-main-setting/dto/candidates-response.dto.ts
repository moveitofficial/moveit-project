import { ApiProperty } from '@nestjs/swagger';
import {
  AuthProvider,
  Region,
  ServiceGroupName,
  ServiceStatus,
} from '@prisma/client';

export class ServiceCandidateItemDto {
  @ApiProperty({ format: 'uuid' })
  declare serviceId: string;

  @ApiProperty({ example: '안드로이드 / IOS 앱 개발 React Native' })
  declare title: string;

  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
  })
  declare category: ServiceGroupName;

  @ApiProperty({ type: String, nullable: true, example: '코드잇에이전시' })
  declare businessName: string | null;

  @ApiProperty({ enum: ServiceStatus, example: ServiceStatus.ACTIVE })
  declare status: ServiceStatus;

  @ApiProperty({ example: 380_000 })
  declare servicePrice: number;

  @ApiProperty({ type: String, format: 'date-time' })
  declare createdAt: Date;

  @ApiProperty({ example: 10 })
  declare orderCount: number;

  @ApiProperty({
    example: false,
    description:
      '이미 해당 sectionType에 등록되어 있는지 (true면 모달에서 체크 상태로 표시)',
  })
  declare isAlreadyRegistered: boolean;
}

export class ExpertCandidateItemDto {
  @ApiProperty({ format: 'uuid' })
  declare userId: string;

  @ApiProperty({ type: String, nullable: true, example: '(주)디자인' })
  declare businessName: string | null;

  @ApiProperty({ example: 'kim@example.com' })
  declare email: string;

  @ApiProperty({
    enum: ServiceGroupName,
    isArray: true,
    example: [ServiceGroupName.PROJECT_REQUEST],
  })
  declare specialties: ServiceGroupName[];

  @ApiProperty({ enum: AuthProvider, example: AuthProvider.KAKAO })
  declare provider: AuthProvider;

  @ApiProperty({ example: true })
  declare isApproved: boolean;

  @ApiProperty({ enum: Region, nullable: true })
  declare region: Region | null;

  @ApiProperty({ example: 1 })
  declare saleCount: number;

  @ApiProperty({ example: 0 })
  declare reportCount: number;

  @ApiProperty({ type: String, format: 'date-time' })
  declare createdAt: Date;

  @ApiProperty({
    example: false,
    description: '이미 해당 sectionType에 등록되어 있는지',
  })
  declare isAlreadyRegistered: boolean;
}

export class RegisteredServiceItemDto {
  @ApiProperty({ format: 'uuid' })
  declare serviceId: string;

  @ApiProperty({ example: '안드로이드 / IOS 앱 개발 React Native' })
  declare title: string;
}

export class RegisteredExpertItemDto {
  @ApiProperty({ format: 'uuid' })
  declare userId: string;

  @ApiProperty({ type: String, nullable: true, example: '(주)디자인' })
  declare businessName: string | null;
}

class CandidatesPaginationDto {
  @ApiProperty({ example: 1 })
  declare page: number;

  @ApiProperty({ example: 20 })
  declare pageSize: number;

  @ApiProperty({ example: 100 })
  declare totalCount: number;

  @ApiProperty({ example: true })
  declare hasNext: boolean;
}

export class ServiceCandidatesResponseDto {
  @ApiProperty({ type: [ServiceCandidateItemDto] })
  declare items: ServiceCandidateItemDto[];

  @ApiProperty({ type: CandidatesPaginationDto })
  declare pagination: CandidatesPaginationDto;

  @ApiProperty({
    type: [RegisteredServiceItemDto],
    description:
      '현재 해당 sectionType에 등록된 서비스 전체 (페이지네이션과 무관). "선택된 서비스" 라벨 표시용',
  })
  declare registered: RegisteredServiceItemDto[];
}

export class ExpertCandidatesResponseDto {
  @ApiProperty({ type: [ExpertCandidateItemDto] })
  declare items: ExpertCandidateItemDto[];

  @ApiProperty({ type: CandidatesPaginationDto })
  declare pagination: CandidatesPaginationDto;

  @ApiProperty({
    type: [RegisteredExpertItemDto],
    description:
      '현재 해당 sectionType에 등록된 전문가 전체. "선택된 전문가" 라벨 표시용',
  })
  declare registered: RegisteredExpertItemDto[];
}

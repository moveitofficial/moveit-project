import { ApiProperty } from '@nestjs/swagger';
import {
  AuthProvider,
  Region,
  ServiceGroupName,
  ServiceStatus,
} from '@prisma/client';

export class ServiceMainItemDto {
  @ApiProperty({ format: 'uuid', description: '삭제 시 식별자' })
  declare mainSettingId: string;

  @ApiProperty({ format: 'uuid' })
  declare serviceId: string;

  @ApiProperty({ example: '안드로이드 / IOS 앱 개발 React Native' })
  declare title: string;

  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
    description: 'IT_COACHING=IT코칭, PROJECT_REQUEST=프로젝트 의뢰',
  })
  declare category: ServiceGroupName;

  @ApiProperty({ type: String, nullable: true, example: '코드잇에이전시' })
  declare businessName: string | null;

  @ApiProperty({
    enum: ServiceStatus,
    example: ServiceStatus.ACTIVE,
    description: 'ACTIVE=판매중, PAUSED=일시정지, CLOSED=종료',
  })
  declare status: ServiceStatus;

  @ApiProperty({ example: 380_000 })
  declare servicePrice: number;

  @ApiProperty({ type: String, format: 'date-time' })
  declare createdAt: Date;

  @ApiProperty({ example: 10, description: '해당 서비스의 누적 주문 건수' })
  declare orderCount: number;
}

export class BannerItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: 'https://cdn.example.com/banner/abc.png' })
  declare imageUrl: string;

  @ApiProperty({ example: 'https://moveit.kr/events/2026-summer' })
  declare actionUrl: string;

  @ApiProperty({ type: String, format: 'date-time' })
  declare createdAt: Date;
}

export class ExpertMainItemDto {
  @ApiProperty({ format: 'uuid', description: '삭제 시 식별자' })
  declare mainSettingId: string;

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
    description: '전문분야 (복수 가능)',
  })
  declare specialties: ServiceGroupName[];

  @ApiProperty({
    enum: AuthProvider,
    example: AuthProvider.KAKAO,
    description: '가입경로 (LOCAL=이메일, GOOGLE/KAKAO/NAVER)',
  })
  declare provider: AuthProvider;

  @ApiProperty({ example: true, description: '전문가 승인 여부' })
  declare isApproved: boolean;

  @ApiProperty({ enum: Region, nullable: true })
  declare region: Region | null;

  @ApiProperty({ example: 1, description: '판매 누적 (전문가 기준 주문 수)' })
  declare saleCount: number;

  @ApiProperty({ example: 0, description: '받은 신고 누적' })
  declare reportCount: number;

  @ApiProperty({ type: String, format: 'date-time' })
  declare createdAt: Date;
}

export class MainSettingResponseDto {
  @ApiProperty({ type: [ServiceMainItemDto] })
  declare popularItCoaching: ServiceMainItemDto[];

  @ApiProperty({ type: [BannerItemDto] })
  declare banners: BannerItemDto[];

  @ApiProperty({ type: [ServiceMainItemDto] })
  declare popularProjectRequest: ServiceMainItemDto[];

  @ApiProperty({ type: [ServiceMainItemDto] })
  declare recommendedItCoaching: ServiceMainItemDto[];

  @ApiProperty({ type: [ServiceMainItemDto] })
  declare recommendedProjectRequest: ServiceMainItemDto[];

  @ApiProperty({ type: [ExpertMainItemDto] })
  declare moveitPopularProjectExpert: ExpertMainItemDto[];

  @ApiProperty({ type: [ExpertMainItemDto] })
  declare moveitPopularCoaching: ExpertMainItemDto[];
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AuthProvider,
  Region,
  Role,
  ServiceCategoryName,
  ServiceGroupName,
  TechStackName,
} from '@prisma/client';

// ─── 공통: 그룹 1 + 카테고리 N (CLIENT 관심분야 / EXPERT 전문분야 공용) ─────
class SpecialtyDto {
  @ApiProperty({
    enum: ServiceGroupName,
    nullable: true,
    example: ServiceGroupName.IT_COACHING,
  })
  declare serviceGroupName: ServiceGroupName | null;

  @ApiProperty({
    enum: ServiceCategoryName,
    isArray: true,
    example: [ServiceCategoryName.WEB, ServiceCategoryName.APP],
  })
  declare serviceCategoryNames: ServiceCategoryName[];
}

// ─── Expert 전용 ─────────────────────────────────────

class PortfolioItemDto {
  @ApiProperty({
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  declare id: string;

  @ApiProperty({ example: '온라인 쇼핑몰 리뉴얼 프로젝트' })
  declare title: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: '메인 이미지 URL',
    example: 'https://picsum.photos/seed/portfolio-1/800/600',
  })
  declare mainImageUrl: string | null;
}

class ExpertDetailDto {
  // 승인 상태
  @ApiProperty({ example: true })
  declare isApplied: boolean;

  @ApiProperty({ example: true })
  declare isApproved: boolean;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    example: '2026-05-15T10:00:00.000Z',
  })
  declare approvedAt: Date | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: '승인한 관리자 이름',
    example: '무빗 관리자',
  })
  declare approvedByAdminName: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    example: null,
  })
  declare rejectedAt: Date | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: null,
  })
  declare rejectReason: string | null;

  // 회사정보
  @ApiProperty({ type: String, nullable: true, example: '무빗 주식회사' })
  declare businessName: string | null;

  @ApiProperty({ type: String, nullable: true, example: '1234567890' })
  declare businessNumber: string | null;

  @ApiProperty({ type: String, nullable: true, example: '카키쿠키' })
  declare ceoName: string | null;

  @ApiProperty({ type: String, nullable: true, example: '10:00' })
  declare contactTimeStart: string | null;

  @ApiProperty({ type: String, nullable: true, example: '19:00' })
  declare contactTimeEnd: string | null;

  @ApiProperty({ type: Number, nullable: true, example: 2020 })
  declare foundedYear: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 5 })
  declare employeeMin: number | null;

  @ApiProperty({ type: Number, nullable: true, example: 10 })
  declare employeeMax: number | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '안녕하세요. 무빗 에이전시입니다.',
  })
  declare description: string | null;

  // 기술스택
  @ApiProperty({
    enum: TechStackName,
    isArray: true,
    example: [TechStackName.JAVASCRIPT, TechStackName.TYPESCRIPT],
  })
  declare techStacks: TechStackName[];

  // 포트폴리오
  @ApiProperty({ type: [PortfolioItemDto] })
  declare portfolios: PortfolioItemDto[];
}

// ─── 메인 응답 ─────────────────────────────────────
export class UserDetailResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  declare id: string;

  @ApiProperty({ type: String, example: '조한준', nullable: true })
  declare name: string | null;

  @ApiProperty({ example: 'marvel_net@naver.com' })
  declare email: string;

  @ApiProperty({ enum: AuthProvider, example: AuthProvider.LOCAL })
  declare provider: AuthProvider;

  @ApiProperty({ enum: Role, example: Role.CLIENT })
  declare role: Role;

  @ApiProperty({ enum: Region, nullable: true, example: Region.SEOUL })
  declare region: Region | null;

  @ApiProperty({
    type: String,
    example: '010-1234-5678',
    nullable: true,
  })
  declare phoneNumber: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'https://picsum.photos/seed/profile-1/400/400',
  })
  declare profileImageUrl: string | null;

  @ApiProperty({ type: String, example: '기업은행', nullable: true })
  declare bankName: string | null;

  @ApiProperty({ type: String, example: '274062211011134', nullable: true })
  declare bankAccount: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-05-29T05:29:32.433Z',
  })
  declare createdAt: Date;

  // 블랙리스트
  @ApiProperty({ example: false })
  declare isBlocked: boolean;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    example: null,
  })
  declare blockedAt: Date | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: '차단한 관리자 이름',
    example: null,
  })
  declare blockedByAdminName: string | null;

  // CLIENT 전용 (EXPERT일 땐 응답에서 생략)
  @ApiPropertyOptional({ type: String, example: '카키쿠키', nullable: true })
  declare nickname?: string | null;

  // CLIENT는 "관심 분야", EXPERT는 "전문 분야" — 모양 같아서 키 통합. role 무관 top-level.
  @ApiProperty({ type: SpecialtyDto, nullable: true })
  declare specialty: SpecialtyDto | null;

  // EXPERT 전용 (CLIENT일 땐 응답에서 생략)
  @ApiPropertyOptional({ type: ExpertDetailDto })
  declare expert?: ExpertDetailDto;
}

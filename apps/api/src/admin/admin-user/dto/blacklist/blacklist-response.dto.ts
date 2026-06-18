import { ApiProperty } from '@nestjs/swagger';
import { AuthProvider, Region } from '@prisma/client';

import { BlacklistStatus } from './blacklist-status.enum';

export class BlacklistItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ type: String, nullable: true, example: '김코드' })
  declare name: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '(주)디자인커넥트랩',
    description: 'role=EXPERT 일 때 회사명, CLIENT 면 null',
  })
  declare businessName: string | null;

  @ApiProperty({ example: 'kim@example.com' })
  declare email: string;

  @ApiProperty({ enum: AuthProvider, example: AuthProvider.LOCAL })
  declare provider: AuthProvider;

  @ApiProperty({ enum: Region, example: Region.SEOUL, nullable: true })
  declare region: Region | null;

  @ApiProperty({
    example: 1,
    description:
      'role=CLIENT → 본인이 결제한 주문 수 / role=EXPERT → 본인이 등록한 모든 서비스에 들어온 주문 합',
  })
  declare paymentCount: number;

  @ApiProperty({ example: 3, description: '본인이 당한 신고 수' })
  declare reportCount: number;

  @ApiProperty({
    enum: BlacklistStatus,
    example: BlacklistStatus.BLACKLISTED,
    description:
      '차단 상태 — 블랙리스트 페이지라 항상 BLACKLISTED. 응답에 누락되면 비정상 데이터 의심',
  })
  declare status: BlacklistStatus;

  @ApiProperty({ example: '2026-01-23T05:02:46.228Z' })
  declare createdAt: Date;
}

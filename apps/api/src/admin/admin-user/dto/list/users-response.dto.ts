import { ApiProperty } from '@nestjs/swagger';
import { AuthProvider, Region } from '@prisma/client';

export class UserItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '조한준', nullable: true })
  declare name: string | null;

  @ApiProperty({ example: 'kim@example.com' })
  declare email: string;

  @ApiProperty({ enum: AuthProvider, example: AuthProvider.LOCAL })
  declare provider: AuthProvider;

  @ApiProperty({ enum: Region, example: Region.SEOUL, nullable: true })
  declare region: Region | null;

  @ApiProperty({
    example: 12,
    description:
      'role=CLIENT → 본인이 결제한 주문 수 / role=EXPERT → 본인이 등록한 모든 서비스에 들어온 주문 합',
  })
  declare paymentCount: number;

  @ApiProperty({ example: 0, description: '본인이 당한 신고 수' })
  declare reportCount: number;

  @ApiProperty({ example: '2026-05-27T05:02:46.228Z' })
  declare createdAt: Date;
}

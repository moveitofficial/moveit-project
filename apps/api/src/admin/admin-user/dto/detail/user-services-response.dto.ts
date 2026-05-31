import { ApiProperty } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';

// 등록된 서비스(EXPERT 전용).
export class UserServiceItemDto {
  @ApiProperty({
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  declare id: string;

  @ApiProperty({ example: '안드로이드 / iOS 앱 개발 React Native' })
  declare title: string;

  @ApiProperty({ enum: ServiceStatus, example: ServiceStatus.ACTIVE })
  declare status: ServiceStatus;

  @ApiProperty({ example: 380_000, description: '판매금액' })
  declare servicePrice: number;

  @ApiProperty({ example: 10, description: '누적 주문(판매) 건수' })
  declare salesCount: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: '등록일',
    example: '2024-01-24T00:00:00.000Z',
  })
  declare createdAt: Date;
}

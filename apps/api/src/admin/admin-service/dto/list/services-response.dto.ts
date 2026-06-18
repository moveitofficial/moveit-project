import { ApiProperty } from '@nestjs/swagger';
import { ServiceGroupName, ServiceStatus } from '@prisma/client';

export class ServiceItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '안드로이드 / IOS 앱 개발 React Native' })
  declare title: string;

  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
    description: '카테고리 그룹 (IT_COACHING / PROJECT_REQUEST)',
  })
  declare categoryGroup: ServiceGroupName;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '(주)디자인커넥트랩',
    description: '판매자 회사명 (사업자 미등록 시 null)',
  })
  declare businessName: string | null;

  @ApiProperty({
    enum: ServiceStatus,
    example: ServiceStatus.ACTIVE,
    description:
      'ACTIVE=판매중 / PAUSED=판매중지 / CLOSED=삭제(소프트딜리트, 응답에 포함)',
  })
  declare status: ServiceStatus;

  @ApiProperty({ example: 380_000, description: '판매 금액 (원)' })
  declare servicePrice: number;

  @ApiProperty({ example: '2024-01-24T05:02:46.228Z', description: '등록일' })
  declare createdAt: Date;

  @ApiProperty({ example: 10, description: '서비스에 들어온 주문 수' })
  declare orderCount: number;
}

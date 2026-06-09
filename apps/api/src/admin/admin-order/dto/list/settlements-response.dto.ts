import { ApiProperty } from '@nestjs/swagger';
import {
  OrderStatus,
  ServiceCategoryName,
  ServiceGroupName,
} from '@prisma/client';

class SettlementsListClientDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ type: String, nullable: true, example: '조한준' })
  declare name: string | null;
}

class SettlementsListExpertDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ type: String, nullable: true, example: '킴판매자' })
  declare businessName: string | null;
}

class SettlementsListServiceDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '프로팀의 앱개발 센스있는 디자인+개발 합니다.' })
  declare title: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'https://cdn.example.com/svc/abc.png',
  })
  declare thumbnailUrl: string | null;

  @ApiProperty({
    enum: ServiceGroupName,
    example: ServiceGroupName.IT_COACHING,
  })
  declare categoryGroup: ServiceGroupName;

  @ApiProperty({
    enum: ServiceCategoryName,
    example: ServiceCategoryName.APP,
  })
  declare categoryName: ServiceCategoryName;
}

export class SettlementItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({
    enum: [OrderStatus.SETTLEMENT_REQUESTED, OrderStatus.SETTLEMENT_COMPLETED],
    example: OrderStatus.SETTLEMENT_REQUESTED,
    description: 'SETTLEMENT_REQUESTED=정산요청, SETTLEMENT_COMPLETED=정산완료',
  })
  declare status:
    | typeof OrderStatus.SETTLEMENT_REQUESTED
    | typeof OrderStatus.SETTLEMENT_COMPLETED;

  @ApiProperty({ example: 80_000_000 })
  declare totalAmount: number;

  @ApiProperty({ type: String, format: 'date-time' })
  declare startDate: Date;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  declare endDate: Date | null;

  @ApiProperty({ type: SettlementsListClientDto })
  declare client: SettlementsListClientDto;

  @ApiProperty({ type: SettlementsListExpertDto })
  declare expert: SettlementsListExpertDto;

  @ApiProperty({ type: SettlementsListServiceDto })
  declare service: SettlementsListServiceDto;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    description: '정산 완료 시각 (SETTLEMENT_REQUESTED 면 null)',
  })
  declare settledAt: Date | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '코드잇 관리자',
    description: '정산 처리한 관리자 이름 (SETTLEMENT_REQUESTED 면 null)',
  })
  declare settledByAdminName: string | null;
}

import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

class OrderClientRefDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ type: String, nullable: true, example: '조한준' })
  declare name: string | null;
}

class OrderServiceRefDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '프로팀의 앱개발 센스있는 디자인+개발 합니다.' })
  declare title: string;

  @ApiProperty({ example: 'IT 코칭' })
  declare serviceGroupName: string;

  @ApiProperty({ example: 'APP 제작' })
  declare serviceCategoryName: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'https://cdn.example.com/svc/abc.png',
  })
  declare thumbnailUrl: string | null;
}

export class ServiceOrderItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.IN_PROGRESS })
  declare status: OrderStatus;

  @ApiProperty({ type: OrderClientRefDto })
  declare client: OrderClientRefDto;

  @ApiProperty({ type: OrderServiceRefDto })
  declare service: OrderServiceRefDto;

  @ApiProperty({ example: 80_000_000 })
  declare totalAmount: number;

  @ApiProperty({ type: String, format: 'date-time' })
  declare startDate: Date;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  declare endDate: Date | null;
}

export class ServiceOrderCountsDto {
  @ApiProperty({ example: 11 }) declare all: number;
  @ApiProperty({ example: 3 }) declare working: number;
  @ApiProperty({ example: 2 }) declare workCompleted: number;
  @ApiProperty({ example: 5 }) declare purchaseConfirmed: number;
  @ApiProperty({ example: 3 }) declare settlement: number;
  @ApiProperty({ example: 1 }) declare expired: number;
  @ApiProperty({ example: 1 }) declare cancelRefund: number;
}

export class ServiceOrdersResponseDto {
  @ApiProperty({ type: [ServiceOrderItemDto] })
  declare items: ServiceOrderItemDto[];

  @ApiProperty({ example: 1 })
  declare page: number;

  @ApiProperty({ example: 5 })
  declare pageSize: number;

  @ApiProperty({ example: 23 })
  declare totalCount: number;

  @ApiProperty({ example: true })
  declare hasNext: boolean;
}

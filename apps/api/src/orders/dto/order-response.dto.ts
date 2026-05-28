import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

class OrderServiceImageDto {
  @ApiProperty({ example: 'https://cdn.example.com/main.jpg' })
  declare imgUrl: string;
}

class OrderServiceSummaryDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;
  @ApiProperty({ example: '웹 서비스 MVP 개발' })
  declare title: string;
  @ApiProperty({ example: 380_000 })
  declare servicePrice: number;
  @ApiProperty({ type: [OrderServiceImageDto] })
  declare images: OrderServiceImageDto[];
}

class OrderClientSummaryDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;
  @ApiProperty({ nullable: true, example: '조한준' })
  declare name: string | null;
}

class OrderExpertSummaryDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;
  @ApiProperty({ nullable: true, example: '홍길동' })
  declare name: string | null;
  @ApiProperty({
    nullable: true,
    example: 'https://cdn.example.com/profile.jpg',
  })
  declare profileImageUrl: string | null;
}

class OrderListPaginationDto {
  @ApiProperty({ example: 1 })
  declare page: number;
  @ApiProperty({ example: 20 })
  declare pageSize: number;
  @ApiProperty({ example: 50 })
  declare totalCount: number;
  @ApiProperty({ example: true })
  declare hasNext: boolean;
}

export class OrderListItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.IN_PROGRESS })
  declare status: OrderStatus;

  @ApiProperty({ example: 418_000 })
  declare totalAmount: number;

  @ApiProperty({ example: 380_000 })
  declare agreedServicePrice: number;

  @ApiProperty({ example: 38_000 })
  declare platformFee: number;

  @ApiProperty({ example: '2026-06-01T00:00:00.000Z' })
  declare startDate: Date;

  @ApiProperty({ example: '2026-06-30T00:00:00.000Z' })
  declare endDate: Date;

  @ApiProperty()
  declare createdAt: Date;

  @ApiProperty({ type: OrderServiceSummaryDto })
  declare service: OrderServiceSummaryDto;

  @ApiProperty({ type: OrderClientSummaryDto })
  declare clientUser: OrderClientSummaryDto;

  @ApiProperty({ type: OrderExpertSummaryDto })
  declare expertUser: OrderExpertSummaryDto;
}

export class OrderListResponseDto {
  @ApiProperty({ type: [OrderListItemDto] })
  declare items: OrderListItemDto[];

  @ApiProperty({ type: OrderListPaginationDto })
  declare pagination: OrderListPaginationDto;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiProperty({ nullable: true, example: '코드잇에이전시' })
  declare businessName: string | null;

  @ApiProperty({
    nullable: true,
    example: 'https://cdn.example.com/profile.jpg',
  })
  declare profileImageUrl: string | null;
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

  @ApiPropertyOptional({
    nullable: true,
    example: '2026-06-30T00:00:00.000Z',
  })
  declare endDate: Date | null;

  @ApiProperty()
  declare createdAt: Date;

  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  declare chatRoomId: string | null;

  @ApiProperty({ type: OrderServiceSummaryDto })
  declare service: OrderServiceSummaryDto;

  @ApiProperty({ type: OrderClientSummaryDto })
  declare clientUser: OrderClientSummaryDto;

  @ApiProperty({ type: OrderExpertSummaryDto })
  declare expertUser: OrderExpertSummaryDto;

  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: true,
    description:
      '작성된 리뷰 ID (없으면 null). 리뷰 단건 조회·수정·삭제에 사용',
  })
  declare reviewId: string | null;
}

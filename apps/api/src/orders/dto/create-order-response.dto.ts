import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class CreateOrderResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.NEGOTIATING })
  declare status: OrderStatus;

  @ApiProperty({ example: 1_000_000 })
  declare agreedServicePrice: number;

  @ApiProperty({ example: 100_000 })
  declare platformFee: number;

  @ApiProperty({ example: 1_100_000 })
  declare totalAmount: number;

  @ApiProperty({ example: '2026-06-01T00:00:00.000Z' })
  declare startDate: Date;

  @ApiPropertyOptional({
    nullable: true,
    example: null,
    description: '전문가 일정 등록 전 null',
  })
  declare endDate: Date | null;

  @ApiProperty()
  declare createdAt: Date;
}

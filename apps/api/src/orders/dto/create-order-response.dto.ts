import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class CreateOrderResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.NEGOTIATING })
  declare status: OrderStatus;

  @ApiProperty({ example: 380_000 })
  declare agreedServicePrice: number;

  @ApiProperty({ example: 38_000 })
  declare platformFee: number;

  @ApiProperty({ example: 418_000 })
  declare totalAmount: number;

  @ApiProperty({ example: '2026-06-01T00:00:00.000Z' })
  declare startDate: Date;

  @ApiProperty({ example: '2026-06-30T00:00:00.000Z' })
  declare endDate: Date;

  @ApiProperty()
  declare createdAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class CreateTradeRequestResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare orderId: string;

  @ApiProperty({ format: 'uuid' })
  declare clientUserId: string;

  @ApiProperty({ format: 'uuid' })
  declare expertUserId: string;

  @ApiProperty({ format: 'uuid' })
  declare serviceId: string;

  @ApiProperty({ example: 8_500_000 })
  declare agreedServicePrice: number;

  @ApiProperty({ example: 850_000 })
  declare platformFee: number;

  @ApiProperty({ example: 9_350_000 })
  declare totalAmount: number;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  declare status: OrderStatus;

  @ApiProperty()
  declare createdAt: Date;
}

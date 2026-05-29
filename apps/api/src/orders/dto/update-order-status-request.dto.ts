import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateOrderStatusRequestDto {
  @ApiProperty({
    description: '변경할 주문 상태',
    enum: OrderStatus,
    example: OrderStatus.CANCEL_REQUESTED,
  })
  @IsEnum(OrderStatus)
  declare status: OrderStatus;
}

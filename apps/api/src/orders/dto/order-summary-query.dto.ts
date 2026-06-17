import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

import { ORDER_LIST_AS } from '../orders.constants';

import type { OrderListAs } from '../orders.constants';

export class OrderSummaryQueryDto {
  @ApiProperty({
    description: '조회 역할 (구매자: client, 판매자: expert)',
    enum: [ORDER_LIST_AS.CLIENT, ORDER_LIST_AS.EXPERT],
    example: ORDER_LIST_AS.CLIENT,
  })
  @IsIn([ORDER_LIST_AS.CLIENT, ORDER_LIST_AS.EXPERT])
  declare as: OrderListAs;
}
